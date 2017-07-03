## Part 7

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/7/part-7.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/7/part-7.svg)

<em>7.0 Part 7 (clickable)</em>

### Back to the beginning

After mounting as result of method execution we have HTML elements which are ready to be set into a document. Actually, `markup` (1), generated but `mountComponent`, despite how it’s named, not actually HTML markup, it’s a data structure with fields `children`, `node` (actually DOM node), etc. But, we have our HTML element to put into the container (that one, specified as the container in `ReactDOM.render` call). While putting it into DOM, React will erase everything that was there before. `DOMLazyTree`(2) is utils class to perform some operations with tree data structures, which we actually do during work with DOM.

So, in the end, the last thing `parentNode.insertBefore(tree.node)`(3). Where `parentNode` is container `div` node and `tree.node` is actually our `ExampleAppliication` div node. Nice, HTML elements created during mounting finally were inserted into document.

So, that’s it? Not exactly. As you remember, `mount` call was wrapped into a transaction, it means that we should close it. Let’s check `close` wrappers list. Mostly, we should restore some locked behavior `ReactInputSelection.restoreSelection()`, `ReactBrowserEventEmitter.setEnabled(previouslyEnabled)` but also, we will notify all that callbacks `this.reactMountReady.notifyAll`(4) we put into `transaction.reactMountReady` queue before. One of them is our favorite `componentDidMount`, it will be triggered exactly by this `close` wrapper.

Now you have a clear picture what ‘component did mount’ actually means. Cheers.

### One more transaction close

Well, actually, that transaction was not only one, we forgot one more, which was used to wrap `ReactMount.batchedMountComponentIntoNode` call. Let’s close it as well.

Let’s check wrapper `ReactUpdates.flushBatchedUpdates`(5), which will process `dirtyComponents`... Sounds interesting, ya? Bad-good news, we just did our first mount, so there are no dirty components yet, it means that it’s idle call. Then, we can close this transaction as well, and say that batching strategy updates is done.

### Alright, we’ve finished *Part 7*.

Let’s recap what we get here. Look at the scheme one more time, then, let’s remove redundant less important pieces, so it becomes like that:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/7/part-7-A.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/7/part-7-A.svg)

<em>7.1 Part 7 simplified (clickable)</em>

And, probably, let’s fix spaces and alignment as well:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/7/part-7-B.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/7/part-7-B.svg)

<em>7.2 Part 7 simplified&refactored (clickable)</em>

Nice. In fact, that’s all that happens here. So, we can take essential value from the *Part 7*, it will be used for the final `mounting` scheme:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/7/part-7-C.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/7/part-7-C.svg)

<em>7.3 Part 7 essential value (clickable)</em>

And then, we have done! In fact, we have done with mounting. Let's see below!


[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/7/mounting-parts-C.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/7/mounting-parts-C.svg)

<em>7.4 Mounting (clickable)</em>

[To the next page: Part 8 >>](./Part-8.md)

[<< To the previous page: Part 6](./Part-6.md)


[Home](../../README.md)
