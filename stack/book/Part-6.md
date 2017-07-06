## Part 6

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/6/part-6.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/6/part-6.svg)

<em>6.0 Part 6 (clickable)</em>

### Create initial children

Seems like the element itself is finished, so now we can continue with its children. Two steps here: children should be mounted (`this.mountChildren`)(1) and connected to the parent (`DOMLazyTree.queueChild`)(2). Let’s move to children mounting because it’s obviously more interesting.

There is a separate module called `ReactMultiChild` (`src\renderers\shared\stack\reconciler\ReactMultiChild.js`) to manage children. Nice, let’s check the `mountChildren` method then. It contains two main tasks as well. First of all, we instantiate children (use `ReactChildReconciler` for that) and mount them. What children are actually here? It can be a simple HTML tag or another custom component. To handle HTML we need to instantiate `ReactDOMComponent` and for custom component - `ReactCompositeComponent`. The mounting flow, again, depends on what the child type is.

### One more time

If you are still reading this, it's probably time to clarify and review the overall process one more time. Let’s take a break and recollect the sequence of objects.

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/6/overall-mounting-scheme.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/6/overall-mounting-scheme.svg)

<em>6.1 Overall mounting scheme (clickable)</em>

1) React instantiates `ReactCompositeComponent` for each of your custom components (with component lifecycle hooks like `componentWillMount`, etc) and mounts it.

2) During mounting, at first, an instance of your custom component will be created (`constructor` called).

3) Then, its render method is called (for a simple example, render returns `div`) and `React.createElement` creates the React elements. It can be called directly or after parsing JSX by Babel and replacing tags in your render. But, it’s not exactly what we need, see what's next below.

4) We need a DOM component for our `div`. So, during an instantiation process, we create instances of `ReactDOMComponent` from the element-objects (mentioned above).

5) Then, we need to mount the DOM component. That actually means we create the DOM elements and assign event listeners, etc.

6) Then, we process the initial children of our DOM component. We create instances of them and mount them as well. Depending on what each item of the children is, a custom component or just an HTML tag, we recurse to step 1) or step 5) respectively. And then again for all nested elements.

That’s it. It's pretty straightforward as you can see.

So, mounting is basically finished. Enqueue the `componentDidMount` method! Great job.

### Alright, we’ve finished *Part 6*.

Let’s recap how we got here. Let's look at the scheme one more time, then remove redundant less important pieces, and it becomes this:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/6/part-6-A.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/6/part-6-A.svg)

<em>6.2 Part 6 simplified (clickable)</em>

And we should probably fix spaces and alignment as well:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/6/part-6-B.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/6/part-6-B.svg)

<em>6.3 Part 6 simplified & refactored (clickable)</em>

Nice. In fact, that’s all that happens here. So, we can take the essential value from *Part 6* and use it for the final `mounting` scheme:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/6/part-6-C.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/6/part-6-C.svg)

<em>6.4 Part 6 essential value (clickable)</em>

And then we're done!


[To the next page: Part 7 >>](./Part-7.md)

[<< To the previous page: Part 5](./Part-5.md)


[Home](../../README.md)
