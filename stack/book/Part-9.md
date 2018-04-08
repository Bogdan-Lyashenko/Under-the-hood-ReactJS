## Part 9

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/9/part-9.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/9/part-9.svg)

<em>9.0 Part 9 (clickable)</em>

### But let’s move back..

As you noticed on the scheme, the call of `setState` method, can be triggered in several ways, be more precise, with, or without, external impact (means ‘user action’). Let’s take two cases: in the first case, the method call is triggered by mouse click, and second, just call from `setTimeout` in `componentDidMount`.

What actually makes that difference? Well, as you remember, React process updates in `batches`, it means that list of updates should be somehow collected and, then, `flushed`. The thing is that when mouse event appears, it’s handled on the top level and then, through several layers of wrappers the batched update will be started. By the way, as you can see it happens only if `ReactEventListener` is `enabled` (1), and, if you remember, during a component mounting phase, one of `ReactReconcileTransaction` wrappers actually disables it, and make mounting safe. Smart enough! But, what about `setTimeout` case? It’s also simple, before putting a component into `dirtyComponents` list React will make sure that transaction is started (opened), so then, later, it should be closed and updates flushed.

As you know, React implements ‘synthetic events’, some ‘syntax sugar’ which in fact wraps native events. But then, later, they still try to behave how we all used to see events. You can see the comment in the code:
> ‘To help development we can get better dev tool integration by simulating a real browser event’

```javascript
var fakeNode = document.createElement('react');

ReactErrorUtils.invokeGuardedCallback = function (name, func, a) {
      var boundFunc = func.bind(null, a);
      var evtType = 'react-' + name;

      fakeNode.addEventListener(evtType, boundFunc, false);

      var evt = document.createEvent('Event');
      evt.initEvent(evtType, false, false);

      fakeNode.dispatchEvent(evt);
      fakeNode.removeEventListener(evtType, boundFunc, false);
};
```
Alright, back to our update, let’s see one more time. The approach is:

1. call setState
1. open batching transaction if it’s not opened yet
1. add affected components to `dirtyComponents` list,
1. close transaction with calling `ReactUpdates.flushBatchedUpdates`, what actually means ‘process whatever was collected into `dirtyComponents`’.

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/9/set-state-update-start.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/9/set-state-update-start.svg)

<em>9.1 `setState` start (clickable)</em>

### Alright, we’ve finished *Part 9*.

Let’s recap how we got here. Let's look at the scheme one more time, then remove redundant less important pieces, and it becomes this:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/9/part-9-A.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/9/part-9-A.svg)

<em>9.2 Part 9 simplified (clickable)</em>

And we should probably fix spaces and alignment as well:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/9/part-9-B.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/9/part-9-B.svg)

<em>9.3 Part 9 simplified & refactored (clickable)</em>

Nice. In fact, that’s all that happens here. So, we can take the essential value from *Part 9* and use it for the final `updating` scheme:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/9/part-9-C.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/9/part-9-C.svg)

<em>9.6 Part 9 essential value (clickable)</em>

And then we're done!


[To the next page: Part 10 >>](./Part-10.md)

[<< To the previous page: Part 8](./Part-8.md)


[Home](../../README.md)
