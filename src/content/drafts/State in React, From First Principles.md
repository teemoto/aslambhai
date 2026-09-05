# State in React, From First Principles

Every React developer asks the same question at some point: useState, useReducer or Context? Which one do I use?

The best way to master this is to understand what each one is for? Get that distinction right and you stop guessing. You start designing cleaner systems almost by reflex. So lets build the mental model first followed by the mechanics

## Two job, not three tools

The trap is to think of these three as interchangeable options, like three brands of the same wrench. Think of them instead as tools on a bench: two of them do one job, and the third does a completely different job.

> useState and useReducer manage state. Context *distributes* it.

Managing state means owning a value and deciding how it changes. Distributing state means taking a value that already exists and getting it to the components that need it. Different problems. Different tools.

Picture a company:

| Tool       | What it is                                                   |
| ---------- | ------------------------------------------------------------ |
| useState   | An individual employee's personal notes. One person, one notepad, quick edits. |
| useReducer | A team's workflow system. Requests come in, a defined process decides what happens next. |
| Context    | The company wide email broadcast. It decides nothing. It only makes usre the right people hear the same thing. |

Hold that picture. Everything below is a variation of it.

If you want the whole article compressed to three lines, here it is:

> useState: "I update values"
>
> useReducer: "I dispatch values"
>
> Context: "I share values"

## useState, the default you reach for first

Use it when the state is simple: a few values, updates, no complicated transitions between states.

```tsx
const Counter = () => {
	const [count, setCount] = useState(0);
	return (
	 <button onClick={() => setCount(count + 1)}>
	 	{count}
	 </button>
	);
}
```

The mental model is: **I have a value, and I update it directly.** That is the whole thing.

It is simple and readable, carries almost no boilerplate, and covers the large majority of cases you will hit. The cons only show up later: as the logic grows, the updates get messy, and it becomes hard to track how one state change relates to another.

## Where useState starts to crack

Watch what happens when one piece of state becomes three:

```tsx
const [loading, setLoading] = useState(false);
const [data, setData] = useState(null);
const [error, setError] = useState(null);
```

Now a single "load" operation touches all three:

```
setLoading(true)
setData(some_data)
setError(null)
setLoading(false)
```

You are managing multiple related values by hand, and the relationships between them are implicit. Nobody wrote down "when loading starts, error must clear etc". That rule lives in your head, and in three different event handlers. This is exactly where bugs creep in.

## useReducer, when state has rules

Reach for useReducer when the transitions are the hard part: multiple related values, several ways the state can change, and you want those changes to be predictable.

Here is the same loading/data/error state, but with the rules written down in one place.

```tsx
function reducer(state, action){
  switch(action.type){
    case "FETCH_START":
      return {...state, loading: true, error: null}
    case "FETCH_SUCCESS":
      return {loading: false, data: action.payload, error: null}
    case "FETCH_ERROR":
      return {loading: false, data: null, error: action.payload}
    default:
      return state;
  }
}

// Wiring it up
const [state, dispatch] = useReducer(reducer, { loading: false, data: null, error: null})
```

The mental model shifts here, state no longer chanegs by direct assignment. It changes through actions. You do not set loading and clear error and hope you did it in every handler. You dispatch `FETCH_START`, and the reducer guarantees what that means every time.

Think of it as the difference between switches and buttons. With useState you flip switches by hand. With useReducer you press one button and the system decides which switches flip.

However there is a cost - more boilerplate, a steeper first climb, and genuine overkill for a single boolean. What you buy is predictable transitions, all the logic in one place, far easier debugging, and state that scales as the app gets more complex.

## Context, the broadcast layer

The most important thing about Context:

> It does not manage state. It shares it.

```tsx
const CounterContext = createContext(null);

const App = () => {
  const [count, setCount] = useState(0);
  return (
   <CounterContext.Provider value={{count, setCount}}>
     <Child /> 
   </CounterContext.Provider>
  )
}

const Child = () => {
  const { count, setCount } = useContext(CounterContext)  ;
  return (
   <button onClick={() => setCount(count + 1)}>
    {count}
   </button>    
  )
}
```

Notice what Context did and did not do. The useState still lives in `App`. Context did not create or own the count. It carried the value down to `Child` without you threading it through every component in between. 

A common costly misconception is to think of Context as a global state management. It is not. It is a way to avoid prop drilling. That is the entire job. 

## How they actually work together

In real apps you rarely pick one. You combine them. The most common pattern: useReducer for managing state and Context for distributing it.

```tsx
const CounterContext = createContext(null);

const CounterProvider = ({children}) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
   <CounterContext.Provider value={{state, dispatch}}>
    {children}
   </CounterContext.Provider>
  );
}
```

This is, in effect a miniature Redux built oout of two React primitives. A reducer owns the state transitions, and a context hands `state` and `dispatch` to anyone who asks. 

## A framework for choosing

| Reach for  | When                                                         |
| ---------- | ------------------------------------------------------------ |
| useState   | A single value or two, simple updates, state lives in one component. |
| useReducer | Multiple related values, complex transitions, real business logic. |
| Context    | The state has to reach components far apart, and you want to stop prop drilling. |

## Examples

Concrete beats abstract. Here are some examples of what each one looks like in production

- **useState:** a modal's open/closed flag, a controlled input, a toggle switch.
- **useReducer:** form state, the loading/error/data triad of an API call, complex multi-step UI flow.
- **Context:** authenticated user, themes, feature flags.

## Performance

Context has a sharp edge:

```tsx
<Context.Provider value={{count}}></Context.Provider>
```

Every render creates a new object for that value. React sees a new reference and re-renders every consumer, whether or not the data they care about changed. The first fix is to stabilize the value so the reference only changes when the data does:

```tsx
const value = useMemo( () => ({count}), [count])
```

Better still, split the contedxt so the things that change often and the things that never change do not share a provider:

- `CountContext`
- `DispatchContext`

Dispatch never changes, so components that only dispatch never re-render when the count does.

## Final thoughts

useState and useReducer manage state, Context distributes it.

So here is a question for you. You are building a multi-step checkout flow. It is shared across several components, and it has real transitions: next step, previous step, validate before advancing. What do you reach for, and why?

Work it out form the mental model, not from memory. If you can defend your answer in two sentences, you understand this.