## Part 11

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/11/part-11.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/11/part-11.svg)

<em>11.0 Part 11 (clickable)</em>

### Update component

Comment in the code which describes the method says:
>‘Perform an update to a mounted component. The componentWillReceiveProps and shouldComponentUpdate methods are called, then (assuming the update isn't skipped) the remaining update lifecycle methods are called and the DOM representation is updated. By default, this implements React's rendering and reconciliation algorithm. Sophisticated clients may wish to override this.’

Alright… sounds reasonable.

The first thing we check if `props` (1) were changed, technically, the method `updateComponent` can be called in two different scenarios if `setState` was called or `props` were changed. If `props` were actually changed, then life-cycle method `componentWillReceiveProps` will be called. After, React re-calculate `nextState` (2) based on `pending state queue` (queue of partial state objects which we set before, in our case queue will be like [{message: "click state message"}]). Of course, in the case with just `props` update state will be untouched.

Well, next step, we set `shouldUpdate` to default value `true`(3). That’s actually why when `shouldComponentUpdate` is not specified, a component is updated by default. Then, check if it’s not `force update`. As you know, it’s possible to call `forceUpdate` from component to update it, instead of changing `state` or `props`, but, according to React official docs, using this method is bad practice. So, in a case of force update component will be updated permanently, otherwise, specified from the component method `shouldComponentUpdate` will be called, and `shouldUpdate` will be re-assigned with its result value. If it's determined that a component should not update, React still needs to set `props` and `state` but shortcut the rest of the update.

### Alright, we’ve finished *Part 11*.

Let’s recap how we got here. Let's look at the scheme one more time, then remove redundant less important pieces, and it becomes this:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/11/part-11-A.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/11/part-11-A.svg)

<em>11.1 Part 11 simplified (clickable)</em>

And we should probably fix spaces and alignment as well:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/11/part-11-B.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/11/part-11-B.svg)

<em>11.2 Part 11 simplified & refactored (clickable)</em>

Nice. In fact, that’s all that happens here. So, we can take the essential value from *Part 11* and use it for the final `updating` scheme:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/11/part-11-C.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/11/part-11-C.svg)

<em>11.3 Part 11 essential value (clickable)</em>

And then we're done!


[To the next page: Part 12 >>](./Part-12.md)

[<< To the previous page: Part 10](./Part-10.md)


[Home](../../README.md)
