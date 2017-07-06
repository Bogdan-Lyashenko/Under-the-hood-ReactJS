## Part 8

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/8/part-8.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/8/part-8.svg)

<em>8.0 Part 8 (clickable)</em>

### `this.setState`

We know how mounting works, but now, let’s go from the another side. Yes, `setState` method, one more piece of cake!

First of all, why we actually can call some method called `setState`? Well, that’s clear enough, we inherited our component from `ReactComponent`. Alright, then, it’s easy to find this class in React source and check its `setState` method.

```javascript
//src\isomorphic\modern\class\ReactComponent.js#68
this.updater.enqueueSetState(this, partialState)
```
As you can see, there is some `updater` interface. What that `updater` is? Well, if you check mounting process we’ve just analyzed, during `mountComponent`, instance receives `updater` property as a  reference to `ReactUpdateQueue` (`src\renderers\shared\stack\reconciler\ReactUpdateQueue.js`).

Well, dive inside `enqueueSetState` (1) method and see that, at first, it pushes partial state (a partial state is an object you pass into `this.setState`) to `_pendingStateQueue` (2) of internal instance (just to remind: public instance, it’s actually our custom component `ExampleApplication` and, internal instance is `ReactCompositeComponent` which was created during mounting), secondary, we `enqueueUpdate`, what actually check if updates already in progress and push our component to `dirtyComponents` list, otherwise, if not - init update transaction and then push component to `dirtyComponents` list.

To summarize this, each component has own list of pending states, means, each time you call `setState` in one transaction, you just push that objects into a queue, then, later, they will be merged into component state one by one. And, when you call `setState`, you add your component into `dirtyComponents` list. Probably, you are already wondering, how that `dirtyComponents` are processed? You are right, that’s next important piece of the puzzle...

### Alright, we’ve finished *Part 8*.

Let’s recap how we got here. Let's look at the scheme one more time, then remove redundant less important pieces, and it becomes this:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/8/part-8-A.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/8/part-8-A.svg)

<em>8.1 Part 8 simplified (clickable)</em>

And we should probably fix spaces and alignment as well:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/8/part-8-B.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/8/part-8-B.svg)

<em>8.2 Part 8 simplified & refactored (clickable)</em>

Nice. In fact, that’s all that happens here. So, we can take the essential value from *Part 8* and use it for the final `updating` scheme:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/8/part-8-C.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/8/part-8-C.svg)

<em>8.3 Part 8 essential value (clickable)</em>

And then we're done!


[To the next page: Part 9 >>](./Part-9.md)

[<< To the previous page: Part 7](./Part-7.md)


[Home](../../README.md)
