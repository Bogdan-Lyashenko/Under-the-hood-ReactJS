## Part 6

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/6/part-6.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/6/part-6.svg)

<em>6.0 Part 6 (clickable)</em>

### Create initial children

Seems like element itself was finished, now we can continue with its children. Two steps here: children should be mounted `this.mountChildren`(1) and connected to the parent `DOMLazyTree.queueChild`(2).
Let’s move to children mounting because it’s obviously more interesting.

There is a separate module called `ReactMultiChild`  (`src\renderers\shared\stack\reconciler\ReactMultiChild.js`) to manage children. Nice, let’s check `mountChildren` method then. In contains two main tasks as well. First of all, instantiate children (use `ReactChildReconciler` for that) and mount them. What children actually are here? So, it’s can be simple HTML tag or another custom component, to handle HTML we need to instantiate `ReactDOMComponent` and for custom component - `ReactCompositeComponent`. Mounting flow, again, depends on what the child type is.

### One more time

If you are still reading this, probably it’s a time to clarify and remind overall process one more time. Let’s take a break and recollect sequence of objects.

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/6/overall-mounting-scheme.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/6/overall-mounting-scheme.svg)

<em>6.1 Overall mounting scheme (clickable)</em>

1) React instantiate `ReactCompositeComponent` for each your custom component (with component lifecycle hooks like `componentWillMount` etc) and mount it.

2) During mounting, at first, an instance of your custom component will be created (`constructor` called).

3) Then, its render method called (let’s take a simple case, render returns `div`) and `React.createElement` creates React elements. It can be called directly or after parsing JSX by Babel and replacing tags in your render. But, it’s not exactly what we need, see next below.

4) We need DOM component for our `div`. So, during an instantiation process, we create instances of `ReactDOMComponent` from that element-objects (mentioned above).

5) Then, we need to mount DOM component. That actually means create DOM elements, assigning event listeners etc.

6) Then, we process initial children of our DOM component. We create instances of them and mount them as well, depends on what each item of children is, custom component or just HTML tag, we recurse to step 1) or step 5) respectively. And again, for all nested elements.

That’s it. Pretty straightforward as you can see.
So, mounting is finished. Enque `componentDidMount` method then! Great job.

### Alright, we’ve finished *Part 6*.

Let’s recap what we get here. Look at the scheme one more time, then, let’s remove redundant less important pieces, so it becomes like that:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/6/part-6-A.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/6/part-6-A.svg)

<em>6.2 Part 6 simplified (clickable)</em>

And, probably, let’s fix spaces and alignment as well:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/6/part-6-B.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/6/part-6-B.svg)

<em>6.3 Part 6 simplified&refactored (clickable)</em>

Nice. In fact, that’s all that happens here. So, we can take essential value from the *Part 6*, it will be used for the final `mounting` scheme:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/6/part-6-C.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/6/part-6-C.svg)

<em>6.4 Part 6 essential value (clickable)</em>

And then, we have done!


[To the next page: Part 7 >>](./Part-7.md)

[<< To the previous page: Part 5](./Part-5.md)


[Home](../../README.md)
