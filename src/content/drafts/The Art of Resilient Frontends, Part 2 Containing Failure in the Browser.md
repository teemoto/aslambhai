# The Art of Resilient Frontends, Part 2: Containing Failure in the Browser

Part 1 built the mental model. The browser is a node in a distributed system that happens to have a screen attached, and a resilient frontend runs on a five-part habit called ECORE: expect failure, contain it, observe it, recover from it, evolve. Part 1 lived in the first letter.

Expecting failure changes nothing on its own. This part is where containment starts, and it does so in the browser.

## Draw the watertight compartments

In a ship, if one section has a leak - does it make sense to let the whole ship sink because of it? The smart answer is no - you build your ship such that it is split into a group of watertight compartments so a leak in compartment A does is contained within it and does not cause the ship to sink.

<SHOW A DIAGRAM HERE - A SHIP WITH NO WATERTIGHT COMPARTMENTS TITLED "DUMB SHIP" - IT HAS A LEAK AND IS SINKING AND A SHIP WITH WATERTIGHT COMPARTMENTS TITLED "SMART SHIP" WITH ONE OR TWO LEAKING COMPARTMENTS BUT THE SHIP IS NOT SINKING - SHOW THEM SIDE BY SIDE>

The same applies to your UI. Lets dive deep with an example. Consider a dashboard with the following component structure:

```
Dashboard
    |-- Header
    |-- Revenue Chart
    |-- Inventory Table
    |-- Notifications
    |-- Account Menu
```

If the Revenue Chart feature throws an error, should the whole screen go blank? Absolutely not. The chart is an independent feature and the other features can function without it. So it gets its own watertight compartment aka an independent boundary.

```tsx
function Dashboard(){
  return (
  	<>
    	<Header />
    	<ErrorBoundary fallback={<ChartError />}
        <RevenueChart />
      </ErrorBoundary>
      <ErrorBoundary fallback={<TableError />}
        <InventoryTable />
      </ErrorBoundary>
      .
      .
    </>
  );
}
```

Now one failure is contained:

```
Revenue Chart Failure (shows ChartError)
Inventory Table Success
Notifications Success
Account Menu Success
```

Independent/Error boundaries are basically the watertight compartments for your UI. However, there is a tradeoff which is the boundary size. One giant boundary is simple and useless:

```tsx
<ErrorBoundary>
	<EntireApplication /> {/* One error blanks everything */}
</ErrorBoundary>
```

Too many boundaries is the opposite failure: noise and complexity. The rough rule of the thumb is coupling. If two elements always succeed or fail together, they share a boundary.

## Organize by what code is for, not what it is

A frontend gets hard to change when it is organized only by what things are instead of what they are for.

```
Fragile: organized by technical type
components/ hooks/ utils/ services/ types/
```

This looks tidy on day one. By month seven, unrelated features are tangled together inside every one of these folders, and a change ot billing risks breaking reporting. Organize by business capability instead:

```
features/
		authentication/ components/ api/ hooks/ types.ts
		billing/ compoinents/ api/ hooks/ types.ts
		reporting/ components/ api/ hooks/ types.ts
		
shared/
		ui/ network/ analytics/ errors/
```

Now when billing changes, an engineer reasons mostly within the billing folder, and accidental coupling drops.

The architecture should mirror how the organization changes. (There is a term for this - reverse conway's law). Do not ask "which components look similar?". Ask "which code changes together, for the same business reason?" Code that changes together should live together. 

<A VISUAL DEPICTING REVERSE CONWAYS LAW AND CODE ORGANIZATION>

## Give every concern its own seam

Here is a component that is doing far too much:

```tsx
function OrdersPage(){
  const [orders, setOrders] = useState();
  
  userEffect(() => {
    fetch("/api/orders")
    	.then((response) => response.json())
    	.then(setOrders)
  }, []);
  
  return orders.map((order) => (
  	<div onClick={() => fetch(`/api/orders/${order.id}/approve`)}>
    	{order.name}
    </div>
  ))
}
```

That one function handles fetching, serialization, state, a business action, rendering and user interaction. It is hard to test and harder to evolve, because there is no seam to change one concern without touching the rest. Split it into layers, each with a single job.

```ts
// orderApi.ts - the only layer that speaks to HTTP
export async function getOrders(): Promise<Order[]> {
  const response = await fetch("/api/orders")
  if(!response.ok) throw new Error(`Failed to load orders: ${reponse.status}`);
  return response.json();
}
```

```ts
// useOrders.ts - application logic, how this data is cached and refetched.
export function useOrders() {
  return useQuery({ queryKey: ["orders"], queryFn: getOrders})
}
```

```tsx
// OrdersPage.tsx - presentation, every state has a face
export function OrdersPage(){
  const { isLoading, isError, data, refetch} = useOrders();
  
  if (isLoading) return <OrdersSkeleton />
  if (isError) return <OrdersError onRetry={refetch} />
  
  return <OrdersList orders={data} />
}
```

They payoff shows up at migration time. When REST becomes GraphQL, only `ordersApi.ts` changes. When the design system changes, only `OrdersPage.tsx` changes. The seams are where the future gets to enter without a completed rewrite.

```
Presentation -> OrdersPage.tsx (Changes with design)
App Logic -> useOrders.ts (changes with caching rules)
Infrastructure -> ordersApi.ts (changes with the network)
```

## Every piece of state has a rightful owner

Most fragility traces back to one habit: dumping all state into one global store. (Looking at you redux). Not all state is global. Give each piece the narrowest owner that works.

| State               | Rightful owner    |
| ------------------- | ----------------- |
| Button hover state  | the component     |
| Modal open state    | a nearby parent   |
| Form draft          | the form          |
| Server data         | query cache       |
| Authenticated user  | application scope |
| URL filters         | URL               |
| Cross-page workflow | a shared store3   |

State that lives close to where it is used is easier to understand and far less likely to create invisible dependencies across the app.

The distinction that fixes most bugs: **Server state and client state are not the same things.**

|            | Server State                                          | Client State                                             |
| ---------- | ----------------------------------------------------- | -------------------------------------------------------- |
| Owned By   | The Backend                                           | The Frontend                                             |
| Examples   | Users, orders, reports, notifications                 | selected tab, modal open, draft text, sidebar collapsed. |
| Staleness  | can go stale                                          | cannot go stale                                          |
| Handling   | must be fetched, cached, invalidated and synchronized | set it and read it                                       |
| Belongs in | a query cache                                         | local/component state                                    |

Treating server data as if it were plain client data is the root of "I updated my profile and it still shows the old name". Server data is a cache of something someone else owns, so give it a tool that understands staleness, TanStack Query for example, rather than a plain store you have to hand-synchronize forever.

## Every state deserves a face

Fragile apps model only the happy path

```
data exists => render the page
```

Real apps live in more states than that, and a blank area is ambiguous. Is it loading? Empty? Broken? The user cannot tell.

Give each meaning ful  state its own face:

```tsx
function CustomerList(){
  const { isPending, isError, data, refetch } = useCustomers();
  
  if (isPending) return <CustomerListSkeleton />;
  
  if (isError) {
    return (
    	<ErrorState
        title="Customers could not be loaded"
        actionLabel="Try again"
        onAction={() => refetch()}
       />
    );
  }
  
  if (data.length === 0) return <EmptyCustomers />;
  return <CustomerTable customers={data} />;
}
```

## When the ideal fails, serve the useful

Graceful degradation means that when the ideal experience is unavailable, you serve the best useful alternative instead of nothing.

<SHOW THE BELOW TABLE DATA AS A VISUAL>

| When this fails | Serve this instead                         |
| --------------- | ------------------------------------------ |
| A chart         | the summarized numbers                     |
| An image        | a placeholder                              |
| Live updates    | a manual refresh button                    |
| Search          | the results already on screen              |
| Analytics       | nothing visible, and never block the user. |

This forces a ranking of what actually matters. Take a checkout feature:

| Path                    | Priority     |
| ----------------------- | ------------ |
| Payment submission      | critical     |
| Product image zoon      | Non-critical |
| Recommendation carousel | Non-critical |
| Analytics tracking      | non-critical |

The critical path must not depend on the non-critical paths. Fire and forget the telemetry so a broken analytics call cannot break a purchase:

```tsx
async function completePurchase(order: Order){
  const result = await submitOrder(order);
  trackPurchase(result).catch(error) => {
    logNonCriticalFailure(error); //Analytics failing must never fail the sale
  }
  return result;
}
```

This connects straight back to the failure boundaries discussed above. Partial success at the data layer, degradation at the UX layer, and boundaries at the component layer are the same instinct applied at three altitudes. Contain the damage and keep the core alive.

## Next: the unreliable network

Everything we discussed so far assumed the failure was yours to catch inside the browser - a component that throws, a store that sprawls, a state you forgot to render. The nastier failures come over the wire. Requests that hang, that fail halfway, that return a shape you never agreed to, that arrive in the wrong order and overwrite fresh data with stale.

Part 3 is about that boundary. Treating the nextwork as unreliable by default: timeouts and safe retries, validating what the network sends before you trust it, designing for partial success when one of several services falls over, protecting against out-of-order responses, and then seeing all of it through observability, so a failure on a strangers phone still leaves you something to investigate.