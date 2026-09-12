# Canaries vs E2E Tests, Part 1: Two Questions, Not One Answer

Here is a question I get from engineers all the time: canaries or end-t0-end tests, which one is better?

It is the wrong question. The two are related, but they solve different failure-detection problems, so "which is better?" almost never has an answer. The useful question is what each one is for. Get that straight and the "which" answers itself.

## Think of a restaurant 

An E2E test is the full rehearsal before you open the doors. Can a customer walk in, order food, pay and receive the meal? You run the whole thing once, in a controlled setting, to prove the workflow can happen at all.

A canary is different. It is sending a real or synthetic customer through the restaurant every few minutes after you have opened.

So basically:

> E2E tests validate workflows. Canaries monitor live behavior.

<ADD A GENERATED IMAGE HERE SHOWCASING THE TWO SCENARIOS>

## What is an E2E test?

E2E means end-to-end. It excercies a user journey across multiple parts of the system, start to finish. A login journey looks like this:

1. Open login page
2. Enter username and password
3. Submit
4. The backend authenticates
5. The dashboard loads.
6. Verify the expected content is there.

<SHOW THE ABOVE AS A VISUAL>

In a browser test that reads, conceptually, like this:

```ts
test("user can log in", async ({page}) => {
  await page.goto("/login");
  await page.getByLabel("Email").fill("user@test.com");
  await page.getByLabel("Password").fill("password");
  await page.getByRole("button", { name: "Sign in"}).click();
  await expect(page.getByText("Dashboard")).toBeVisible();
})
```

## What is a canary?

"Canary" means a few different things in software, so context matters. Here we mean a synthetic canary, sometimes called a canary test: a check that runs on schedule and excercises a real, deployed system. eg: Every five minutes, say, it does this:

1. Open the production site
2. Log in using a dummy account
3. Search for a product
4. Open the result
5. Verify the page works
6. Report latency and success or failure.

Conceptually

```ts
async function checkoutCanary(){
	await login(canaryUser);
  await searchForProduct("coffee");
  await addToCart();
  await verifyCart();
}
```

A scheduler runs it over and over:

```
12:00 Success
12:05 Success
12:10 Success
12:15 Failure
12:20 Failure
```

<SHOW THE ABOVE AS A VISUAL>

Now you know something changed around 12:15. Nobody had to notice a support ticket. The canary noticed it first.

That is where the name comes from. Miners carries canaries into caol mines as an early warning for dangerous gases. The bird reacts before the humans did. A software canary follows the same idea. Run a small, representative check that fails early, before the system's trouble reaches your users.

## They can be the exact same code

This is where people get confused, so slow down here.

Suppose you have this Playwright test:

```ts
test("checkout works", async ({page}) => {
  await page.goto("/")
  await login(page)
  await addProduct(page)
  await checkout(page)
  await expect(page.getByText("Order confirmed")).toBeVisible()
})
```

Run it during CI and you call it an E2E test. Run nearly the same workflow every five minutes against production and you call it a canary. The difference is not the test implementation. It is when it runs, where it runs and why.

## The key difference is the question each one asks

Strip away the tooling and each one is asking a single question

> E2E Test: Does this workflow work in the environment I am testing?
>
> Canary: Is this workflow working in the deployed system right now?

The gap between the above two questions is subtle and is the entire point of this article.

## Two lifecycles

An E2E test lives in your delivery pipeline:

1. A developer changes code
2. CI builds application
3. Deploys to test environment 
4. E2E suite runs
5. Tests pass
6. Deployment is done

Catches regressions before they reach production.

A canary lives in production

1. Production is already running
2. Every N minutes, canary executes.
3. Did the critical journey succeed? If yes, record metric else fire an alert.

That catches problems after deployment and during normal operation, when no one is looking.

## Why just E2E tests are not enough

Say your E2E suite passed at 10:00 AM. You deployed at 10:15 AM. Every thing was working at the point.

At 2:00 PM one of the services you depend on has an outage. Your code did not change, your tests did not suddenly become wrong. But prod is broken.

```
CI E2E tests:
10:00 Success

Production:
10:15 Success
11:00 Success
.
.
14:00 Failure dependency fails
```

<REPLACE ASCII ABOVE WITH GOOD VISUAL>

The CI test finished hours ago. It has nothing to say about 2:00PM. A canary running every few minutes catches it.

## Why just canaries are not enough

Now reverse the situation. A developer makes a change and introduces are regression.

Without E2E tests - merge -> deploy -> prod breaks ->canary notices. The canary did its job. But your users were already hitting the broken feature by the time it fired.

With E2E tests: The code change trips the suite and deployment is blocked. 

So the two divide the work cleanly:

- E2E tests help prevent bad releases
- Canaries help detect bad production behavior.

## A side-by-side view

| Dimension                    | E2E Test               | Canary                          |
| ---------------------------- | ---------------------- | ------------------------------- |
| Primary purpose              | Validate functionality | Monitor availability            |
| Typical timing               | CI/CD                  | Continuously                    |
| Environment                  | Test/Staging           | Production or Prod adjacent     |
| Failure means                | Code may be broken     | System is currently unhealthy   |
| Prevent bad deploys          | Excellent              | Usually too late                |
| Detect dependency outage     | Limited                | Excellent                       |
| Detect infrastructure issues | Limited                | Excellent                       |
| Frequency                    | PR/build/release       | Every few minutes               |
| Alerting                     | Usually build failure  | Usually operational alert       |
| User journey coverage        | Can be broad           | Usually a small critical subset |

## There are so many ways to fail

A feature say - login has many failure paths. Look at everything it touches

1. Browser
2. Frontend
3. API Gateway
4. Auth Service
5. Database

<SHOW ABOVE AS A GOOD GENERATED IMAGE>

Your E2E tests run before deployment, the login tests go green and that establishes one thing: our current build can complete login. But production can still fail for reasons your build knew nothing about:

- Auth service outage
- DNS issues
- Bad prod config
- Data base outage
- Network issues etc

<SHOW ABOVE AS A GOOD GENERATED IMAGE>

A production canary see the real environment, so it sees these.

## Why canaries are so powerful

A canary does not care why the system broke.It asks a brutally simple question: can the customer still do what they intented to do? That matters because the infrastructure monitoring can lie by omission. You can be staring at a dashboard like this:

```
CPU HEALTHY
Memory HEALTHY
Server HEALTHY
DATABASE HEALTHY
```

and still have:

```
Login FAILED
```

because an expired OAuth configuration broke the actual user journey while every box you were watching stayed green. The canary catches that, because the canary is the user journey.

## A canary is not a health check

These get conflated, so pull them apart. A health endpoint answers a narrow question:

```
GET /health
{
	"status": "ok"
}
```

That is useful. But the health check only asks "is the server alive?" The canary asks "can a user log in, search, and submit an order?" A canary tests at a much higher level.

## The car dashboard

One more picture, because it holds all the layers at once. Think about a car.

- The **health check** tells you the engine is running.
- The **component tests** confirm the brake and fuel sensors work.
- The **E2E test** is what you do before selling the car: start it, drive, brake, turn, park.
- The **canary** is every morning after delivery, talking a test car around the block to ask if the whole thing still works.

<SHOW A GOOD GENERATED IMAGE FOR THE ABOVE>

Different layers, different questions. None of them replaces the others.

That is the distinction to carry with you: E2E tests answer "does it work?" and canaries answer "is it working?". In Part 2 we get practical - What a canary should and should not test, how to run one without paging your on-call at 2 AM over network noise, where all of this fits alongside the test pyramid and real-user monitoring, and how to decide, for any given workflow, which tool it belongs to.
