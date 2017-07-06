## Part 7

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/7/part-7.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/7/part-7.svg)

<em>7.0 Part 7 (clickable)</em>

### Back to the beginning

After mounting as result of method execution, we have HTML elements which are ready to be set into a document. Actually, `markup` (1) is generated, but `mountComponent`, despite how it’s named, is not actually HTML markup. It’s a data structure with fields `children`, `node` (actual DOM nodes), etc. But, we have our HTML element to put into the container (the one specified as the container in the `ReactDOM.render` call). While adding it into DOM, React will erase everything that was there before. `DOMLazyTree`(2) is a utils class that performs some operations with tree data structures, which we're actually doing during work with the DOM.

The last thing is `parentNode.insertBefore(tree.node)`(3), where `parentNode` is the container `div` node and `tree.node` is actually our `ExampleAppliication` div node. Nice, the HTML elements that were created during mounting were finally inserted into the document.

So, that’s it? Not exactly. As you remember, the `mount` call was wrapped into a transaction. It means that we should close it. Let’s check our `close` wrappers list. Mostly, we should restore some locked behavior `ReactInputSelection.restoreSelection()`, `ReactBrowserEventEmitter.setEnabled(previouslyEnabled)`, but also, we will notify all of the callbacks `this.reactMountReady.notifyAll`(4) we put into `transaction.reactMountReady` queue before. One of them is our favorite `componentDidMount`, which will be triggered exactly by the `close` wrapper.

Now you have a clear picture of what ‘component did mount’ actually means. Cheers!

### One more transaction to close

Well, actually, that transaction was not only one. We forgot one more which was used to wrap the `ReactMount.batchedMountComponentIntoNode` call. Let’s close it as well.

Here, we check the wrapper `ReactUpdates.flushBatchedUpdates`(5), which will process `dirtyComponents`. Sounds interesting, ya? Well, it's good or bad news. We just did our first mount, so there are no dirty components yet. It means that it’s an idle call. So, we can close this transaction as well and say that the batching strategy updates are done.

### Alright, we’ve finished *Part 7*.

Let’s recap how we got here. Let's look at the scheme one more time, then remove redundant less important pieces, and it becomes this:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/7/part-7-A.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/7/part-7-A.svg)

<em>7.1 Part 7 simplified (clickable)</em>

And we should probably fix spaces and alignment as well:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/7/part-7-B.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/7/part-7-B.svg)

<em>7.2 Part 7 simplified & refactored (clickable)</em>

Nice. In fact, that’s all that happens here. So, we can take the essential value from *Part 7* and use it for the final `mounting` scheme:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/7/part-7-C.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/7/part-7-C.svg)

<em>7.3 Part 7 essential value (clickable)</em>

And then we're done! In fact, we're done with mounting. Let's see it below!


[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/7/mounting-parts-C.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/7/mounting-parts-C.svg)

<em>7.4 Mounting (clickable)</em>

[To the next page: Part 8 >>](./Part-8.md)

[<< To the previous page: Part 6](./Part-6.md)


[Home](../../README.md)
