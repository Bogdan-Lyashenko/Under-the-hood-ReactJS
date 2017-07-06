## Part 3

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/3/part-3.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/3/part-3.svg)

<em>3.0 Part 3 (clickable)</em>

### Mount

Method `componentMount` is one of the biggest parts of our journey.!
So, method which is interesting for us is `ReactCompositeComponent.mountComponent`(1).

If you remember, I mentioned that the **first component which is pushed into components tree** is `TopLevelWrapper` (internal React class), so, here, we are gonna to mount it. But.. it’s almost empty wrapper, so, it’s kind of boring to debug it, it doesn’t affect flow at all, so, I suggest to skip it right now and move to its child. That’s how mounting of a tree actually works, you mount parent, then its child and a child of a child and so on. So, just believe me, after `TopLevelWrapper` is mounted, the child of it (`ReactCompositeComponent` which manage `ExampleApplication` component) will be put into the same phase.

Alright, we are again on step (1). Let’s see what is inside. There are some key actions gonna happen, so let’s discuss this logic with details.

### Assigning instance updater

That `updater` (2), returned from `transaction.getUpdateQueue()` is actually is `ReactUpdateQueue` module. So, why it’s actually **assigned here**? Well, because `ReactCompositeComponent` (class we are currently looking on) is one for all platforms, but updaters are different, so we assign it dynamically during mounting depending on platform. Alright. We don’t really need this `updater` for now but keep it in mind, it’s really **important `updater`**, it will be used soon from well-known component method **`setState`**.

Well, actually, not only `updater` is assigned to an instance during this phase. Component instance (your custom component) also is extended with `props` and `context`, `refs`.

Check out the code below:

```javascript
// \src\renderers\shared\stack\reconciler\ReactCompositeComponent.js#255
// These should be set up in the constructor, but as a convenience for
// simpler class abstractions, we set them up after the fact.
inst.props = publicProps;
inst.context = publicContext;
inst.refs = emptyObject;
inst.updater = updateQueue;
```

So, then you can access `props` in your code from an instance, like `this.props`.

### Create ExampleApplication instance

By calling `_constructComponent` (3) and through several construction methods finally, `new ExampleApplication()` will be created. That’s a point when constructor from our code will be called. So, first time actually our code was touched from React’s ecosystem. Nice.

### Perform initial mount

So, we go through mount (4), and the first thing which should happen here is a call of `componentWillMount` if it was specified of course. So, it’s the first method of life-cycle hooks we met. Also, a bit below you can see `componentDidMount`, but, actually it’s just pushed into transaction queue because it shouldn’t be called directly, but only in the very end, when mounting operations were done.  Also, possibly you could add `setState` calls inside `componentWillMount`, in that case, a state will be re-computed of course, but, without calling `render` method (it just doesn't make sense, because a component is not mounted yet).

Official documentation proves the same:

> “`componentWillMount()` is invoked immediately before mounting occurs. It is called before `render()`, therefore setting state in this method will not trigger a re-rendering.”

Let’s check the code, just to make sure ;)

```javascript
// \src\renderers\shared\stack\reconciler\ReactCompositeComponent.js#476
if (inst.componentWillMount) {
    //..
    inst.componentWillMount();

    // When mounting, calls to `setState` by `componentWillMount` will set
    // `this._pendingStateQueue` without triggering a re-render.
    if (this._pendingStateQueue) {
        inst.state = this._processPendingState(inst.props, inst.context);
    }
}
```

True. Well, but then, when `state` is recalculated we call `render` method, yes, exactly that one which we specify in our components! So, one more touch of ‘our’ code.

Alright, the next thing is to create a React component instance. Erm.., what, again? Seems we’ve already seen this `this._instantiateReactComponent`(5) call, right? That’s true, but that time we instantiated a `ReactCompositeComponent` for our `ExampleApplication` component, but now, we are gonna to create VDOM instances to its child, based on that element we got from `render` method. Alright, for our exact case render method returns `div`, so VDOM representation for it is `ReactDOMComponent`. When instance is created, we call `ReactReconciler.mountComponent` again, but this time as internalInstance we pass a newly created instance of `ReactDOMComponent`.

And, call `mountComponent` on it…

### Alright, we’ve finished *Part 3*.

Let’s recap how we got here. Let's look at the scheme one more time, then remove redundant less important pieces, and it becomes this:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/3/part-3-A.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/3/part-3-A.svg)

<em>3.1 Part 3 simplified (clickable)</em>

And we should probably fix spaces and alignment as well:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/3/part-3-B.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/3/part-3-B.svg)

<em>3.2 Part 3 simplified & refactored (clickable)</em>

Nice. In fact, that’s all that happens here. So, we can take the essential value from *Part 3* and use it for the final `mounting` scheme:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/3/part-3-C.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/3/part-3-C.svg)

<em>3.3 Part 3 essential value (clickable)</em>

And then we're done!


[To the next page: Part 4 >>](./Part-4.md)

[<< To the previous page: Part 2](./Part-2.md)


[Home](../../README.md)
