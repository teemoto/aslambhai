# Canaries vs E2E Tests, Part 2: Designing the stack

Part 1<instr: attach link to part 1> drew the line: E2E tests validate workflows before release, canaries monitor live behavior after it. E2E answers "does it work?" and a canary answers "is it working?".

Knowing the difference is the easy part. Now the harder part: building canaries that help, and fitting them next to the test, metrics, and monitoring you already have. This is where reliability engineering lives.

## A canary should test almost nothing

Read that again, because the instinct is the opposite. A canary should cover a small number of critical user journeys. Not everything.

For an ecommerce app, that short list might be:

- Homepage loads
- Search works
- Product detail loads
- Login works
- Add-to-cart works
- Checkout reaches payment

<img: CREATE VISUAL TO EXPLAIN THE ABOVE INSTEAD OF BULLET POINTS IDEALLY AS A FLOW WHILE ALSO SHOWING FLOWS AND PARTS WHICH THE CANARY DOES NOT COVER>

You do not need 2,000 canaries. You need a few strong signals.

## Why not run the whole E2E suite as canaries?

It is tempting. You already wrote 800 E2E tests, so why not point them at production every five minutes? Because that would create:

- Huge traffic
- Expensive infrastructure usage
- Noisy alerts
- Test-account pollution
- State-management complexity
- Accidental data mutations
- Flaky failures

<img: CREATE AN IMAGE TO HIGHLIGHT THE ABOVE - DO NOT DELETE THE BULLET LIST>

The suites are sized differently on purpose. A full E2E suite might be 800 tests. A production canary suite might be 8 ciritcal journeys.

## Read only canaries are the easy ones.

A canary that logs in, opens a dashboard, and verifies a report is relatively safe. It only reads and does not change anything.

Now compare a canary that does any of these against production, every five minutes, forever:

- Place a real order
- Transfer money
- Delete an account
- Send an email

That is dangerous. For workflows that mutate state, you need dedicated test data and a cleanup strategy before the canary is safe to run.

## Synthetic users

Production canaries usually run as synthetic accounts, something like `canary-user@example.com` . That account is setup deliberately: predictable data, restricted permissions, special test inventory, monitoring exclusions, and clean up automation. You do not want your monitoring workflow to affect real users and you do want real-user noise to affect your monitoring.

## A canary measures more than pass or fail

A good canary does not only report a green check, but rather it can/should measure the whole shape of the experience. It has this capability because it runs the real user journey against the real system.

- Success rate
- Total latency
- DNS latency
- Connection latency
- Page load time
- API latency
- Authentication latency
- Time to usable UI

<img: CREATE VISUAL TO EXPLAIN THE ABOVE INSTEAD OF BULLET POINTS>

So a login canary reports something like:

```
Login canary
Success: 99.9%
P50: 800ms
P95: 1.6s
P99: 3.2s
```

At that point it is not only an availability check. It is a performance-monitoring mechanism too.

## Alerting, and the danger of crying wolf

Say the canary runs every five minutes. A single failure might only be network noise. So you tier the response:

- 1 failure: record a metric.
- 2 consecutive failures: raise a warning
- 3 consecutive failures: page the on-call.

How agressive you make this depends on how critical the workflow is.

And here is the trap that quietly kills canary programs. Imagine a flaky canary:

```
2:00 AM X
2:05 AM good
2:10 AM X
```

Engineers learn the lesson you do not want them to learn: "ignore that alert". Then a real outage happens, and nobody moves. That is alert fatigue. A canary must therefore be determinisctic, isolated, fast, reliable and easy to diagnose. A noisy canary is worse than no canary at all.

## Where E2E tests fit: The test pyramid

You have probably seen the test pyramid:

```
E2E -> Integration -> Unit tests
```

<img: GENERATE A TEST PYRAMID IMAGE AND REMOVE THE CODE BLOCK ABOVE>

Many unit tests, some integration tests, few E2E tests. The reason E2E sits at the narrow top is that those tests are slower, more expensive, harder to debug, and more likely to be flaky. They earn their place anyway, because they give strong confirdence the system works end to end.

Canaries sit *outside* this pyramid. They belong to observability and production monitoring, not to your build:

```
Development / CI:
 - Unit
 - Integration
 - E2E
 
------ Production Boundary -------
Canaries
Metrics
Logs
Tracing
Real-user monitoring
```

That boundary is the useful distinction. It is the difference between verification and observability. Testing asks "before releasing this, do we believe it works?". Observability asks "now that it is released, is it working". E2E lives in the first world. Canaries live in the second.

## Two outages no unit tests would catch

Consider this example. You release a new version of your product. CI is clean:

```
Unit green
Integration greem
E2E green
```

You deploy. Then the canary reports:

```
Login green check
Search green check
Checkout red cross
```

You investigate and find the production payment gateway configuration has the wrong certificate. No CI test would necessarily catch that, because the problem exists only in the production configuration. That is exactly what canaries are for.

Another one. All your tests pass, but your production CDN accidentally serves app.js as a 404. The application cannot load. Backend monitoring looks perfect:

```
API healthy green check
Database healthy green check
Servers healthy green check
```

But a browser canary opens the homepage and fails immediately. Now you know the customer-facing system is broken, even though every server-side box is green.

## Synthetic monitoring vs real users

There is one more layer worth naming. A canary is synthetic monitoring: it simulates users. Real User Monitoring, or RUM, measuers actual users.

- Canary: "Our synthetic checkout works"
- RUM: "97.6% of real customers successfully complete checkout"

Why run both? Because your canary might run in Chrome, from US-West, on a fast connection, while your real users are on Safari in India over slow 4G, Firefox in Germany, an older Android in Brazil. Canaries give you consistency. RUM gives you diversity. Together with E2E, you get three distinct quersions answered:

- E2E: "Does our software work before release"
- Canary: "Does production work right now?"
- RUM: "Are real users successfully experiencing it"

<img: GENERATE VISUAL OR IMAGE TO REPLACE THE BULLET POINTS ABOVE BUT CONVEY THE MESSAGE>

## The honest ledger

Neither tool is free. Here is what each one buys and costs.

**E2E tests give you: **

- Regressions caught before deployment, probably their biggest benefit
- A determinisitic setup, because you control the environment and the data.
- Broad workflow coverage, including many edge cases.
- Safe destructive testing: in a test environment you can delete users, create thousands of records, and simulate payment failures.

**And they cost you: ** They are slow, expensive, flaky if poorly designed, and the test environment may differ from production.

**Canaries give you: **

- A test of the real deployed system, which is the whole advantage.
- Detection of environmental failures: network issues, DNS, CDN, certificates, production configs, downstream services etc.
- Continous coverage, catching failures that happen long after deployment.
- Direct measurement of critical journeys.

**And they cost you: ** They only detect after the problem exists, they can affect production state, they need safe synthetic data, flaky ones cause noisy alerts, and they cannot safely excercies every failure scenario.

Remember, tests and canaries catch different classes of failure. The exact boundary may shift depending on where your E2E environment runs, but the shape captures the architectural difference.

| Failure Class      | E2E  | Canary |
| ------------------ | ---- | ------ |
| Code regression    | ✅    | ✅      |
| Production config  | ⚠️    | ✅      |
| Dependency outage  | ⚠️    | ✅      |
| DNS                | ❌    | ✅      |
| CDN                | ⚠️    | ✅      |
| Certificate expiry | ❌    | ✅      |
| Edge cases         | ✅    | ⚠️      |
| Destructive flows  | ✅    | ❌      |
| Continous outages  | ❌    | ✅      |

## So which should you use

In almost any serious production system, both. Not E2E or canary. E2E and canary, because they both protect different phases.

A practical split for an app with 50 important workflows:

- Unit tests: thousands
- Integration tests: hundreds
- E2E tests: 50 workflows
- Production canaries: 5 to 10 critical journeys.

So the E2E list runs long: login, logout, reset password, create report, delete report, export report, edit account, change permissions and so on. The canary list stays short on purpose: homepage, login, load dashboard, load report, critical transaction.

## Two questions that decide where a workflow goes

When you are not sure whether something should be a canary, ask: if this functionality stops working at 2AM wihtout a deployment, do I want someone to know? If yes, it is a strong candidate. Can users log in? Can customers check out? Can publisher serve ads? Can reports load? Can payments complete? Those are good canary targets.

When you are unsure if something should be an E2E test, ask a different question: could a code change break this behavior, and do I want to block the release if it does? If yes, it is an E2E candidate.

<img: GENERATE AN IMAGE HERE THAT CAPTURES THE ABOVE SECTION>

## One more "canary" to keep it straight 

Do not confuse canary testing with canary deployment. The later is a release stratgey, eg:

1. Deploy the new version to 1% of users.
2. Observe metrics.
3. If it looks good, increase to 10%, then 50%, then 100%.

Same bird, same idea: expose a small population first so problems show up before they hit everyone. It is a different mechanism from a synthetic canary, but it rests on the same resilience principle. Detect problems early. Limit the blast radius.

## The distinction to carry with you

If you have to takeaway just one thing from this article, take this:

> E2E tests prove that a workflow can work. Canaries continuously verify that the deployed workflow still works.

```
BEFORE PRODUCTION
Unit, then Integration, then E2E
|
DEPLOY
|
AFTER PRODUCTION
Canaries + Metrics + RUM
```

Neither is inherently better. They answer different questions. If I were designing a production system, I would build broad E2E coverage for release confidence and a small, highly reliable set of canaries around the most business-critical user journeys for continuous production confidence.

Go ahead and do this. In you feature or product, pick the single most business-critical journey, and make it a canary this week. Then look at what a code change could quietly break, and make sure that is an E2E test. Do that, and you stop asking which is better. You start asking the only question that matters for each workflow: is this one about "does it work?" or "is it working?".

