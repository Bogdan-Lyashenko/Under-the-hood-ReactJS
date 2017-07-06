## Part 3

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/3/part-3.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/3/part-3.svg)

<em>3.0 Part 3 (clickable)</em>

### Mount

The method `componentMount` is one of the biggest parts of our journey! So, the method that is interesting for us is `ReactCompositeComponent.mountComponent`(1).

If you remember, I mentioned that the **first component that is pushed into a component's tree** is `TopLevelWrapper` (internal React class). Here, we are going to mount it. But... it’s basically an empty wrapper, so, it’s kind of boring to debug. It doesn’t affect flow at all, so, I suggest we skip it right now and move on to its child.

That’s how mounting of a tree actually works, you mount the parent, then its child, and a child of a child, and so on. Just believe me, after `TopLevelWrapper` is mounted, the child of it (`ReactCompositeComponent`, which manages the `ExampleApplication` component) will be put into the same phase.

Alright, we are back to step (1). Let’s see what's inside. There are some key actions that are going to happen, so let’s discuss this logic with details.

### Assigning instance updater

That `updater` (2), returned from `transaction.getUpdateQueue()`, is actually the `ReactUpdateQueue` module. So, why is it actually **assigned here**? Well, because `ReactCompositeComponent` (the class we are currently looking at) is one used in all platforms, but updaters are different, so we assign it dynamically during mounting depending on the platform.

Alright. We don’t really need this `updater` for now, but keep it in mind. `updater` is really **important**, it will be used soon by well-known component method **`setState`**.

Actually, not only is `updater` assigned to an instance during this phase, the component instance (your custom component) is also extended with `props`, `context`, and `refs`.

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

By calling `_constructComponent` (3) and through several construction methods, finally `new ExampleApplication()` will be created. That’s the point when the constructor from our code will be called. So, it's the first time our code was actually touched by React’s ecosystem. Nice.

### Perform initial mount

So, we go through mount (4) and the first thing that should happen here is a call of `componentWillMount` (if it was specified of course). It’s the first method of life-cycle hooks we meet. Also, a bit below you can see `componentDidMount`, but it’s actually just pushed into the transaction queue because it shouldn’t be called directly. It happens only at the very end, when mounting operations are done. Also, you could possibly add `setState` calls inside `componentWillMount`. In that case, the state will of course be re-computed, but without calling the `render` method (it just doesn't make sense to, because the component is not mounted yet).

Official documentation proves the same:

> `componentWillMount()` is invoked immediately before mounting occurs. It is called before `render()`, therefore setting state in this method will not trigger a re-rendering.

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

True. Well, but when `state` is recalculated, we call the `render` method. Yes, exactly the one which we specify in our components! So, one more touch of ‘our’ code.

Alright, the next thing is to create a React component instance. Erm... what, again? Seems we’ve already seen this `this._instantiateReactComponent`(5) call, right? That’s true, but that time we instantiated a `ReactCompositeComponent` for our `ExampleApplication` component. Now, we are going to create VDOM instances for its child based on the element we got from the `render` method. For our exact case, the render method returns `div`, so the VDOM representation for it is `ReactDOMComponent`. When the instance is created, we call `ReactReconciler.mountComponent` again, but this time as `internalInstance`, we pass a newly created instance of `ReactDOMComponent`.

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
