## Part 10

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/10/part-10.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/10/part-10.svg)

<em>10.0 Part 10 (clickable)</em>

### Dirty components

As you can see, React loop through `dirtyComponents`(1), and call `ReactUpdates.runBatchedUpdates`(2), through transaction! Transaction? The new one, but why? Let’s see.

The transaction type is `ReactUpdatesFlushTransaction` and, we’ve already mentioned that before, we need to check `wrappers` to understand what the transaction actually does. A small hint from the code comment:
> ‘ReactUpdatesFlushTransaction's wrappers will clear the dirtyComponents array and perform any updates enqueued by mount-ready handlers (i.e., componentDidUpdate)’

But, anyway, we need to prove that. There are two wrappers `NESTED_UPDATES` and `UPDATE_QUEUEING`. On `initialize` phase we store `dirtyComponentsLength` (3) and, as you can check on `close`, React compares, maybe during updates a flush number of dirty components was changed, so, obviously it’s needed to run `flushBatchedUpdates` one more time. You see, no magic, everything is pretty straightforward.

Well.. one magic moment actually is present. `ReactUpdatesFlushTransaction` overrides `Transaction.perform` method, because… it actually requires behavior from `ReactReconcileTransaction` (transaction is used during mounting and allows to keep app state safe). So, inside `ReactUpdatesFlushTransaction.perform` method, `ReactReconcileTransaction` is used as well, so transaction method actually is wrapped one more time.

So, technically, it looks like:

```javascript
[NESTED_UPDATES, UPDATE_QUEUEING].initialize()
[SELECTION_RESTORATION, EVENT_SUPPRESSION, ON_DOM_READY_QUEUEING].initialize()

method -> ReactUpdates.runBatchedUpdates

[SELECTION_RESTORATION, EVENT_SUPPRESSION, ON_DOM_READY_QUEUEING].close()
[NESTED_UPDATES, UPDATE_QUEUEING].close()
```

We will go back to the transaction in the end, to double check how it helps to finish method work, but now, let’s see details of `ReactUpdates.runBatchedUpdates`(2) (`\src\renderers\shared\stack\reconciler\ReactUpdates.js#125`)

The first thing we should do from the very beginning - sort `dirtyComponets` array (4). How to sort? By `mount order` (integer number was set to a component when instance mounted), it means that parents (they were mounted first) will be updated first, children next, and so on.
The next step, we increase `updateBatchNumber`, it’s something like ID for current reconciling. According to comment in the code:
> ‘Any updates enqueued while reconciling must be performed after this entire batch. Otherwise, if dirtyComponents is [A, B] where A has children B and C, B could update twice in a single batch if C's render enqueues an update to B (since B would have already updated, we should skip it, and the only way we can know to do so is by checking the batch counter).’

It helps actually to avoid double updates for the same components.

Well done, finally we loop through `dirtyComponents` and pass each component to `ReactReconciler.performUpdateIfNecessary` (5), where actually `performUpdateIfNecessary` method will be called from `ReactCompositeComponent` instance, so, move on to `ReactCompositeComponent` code again and its method `updateComponent`. Here we can find something interesting for us, so, let’s dive deeper.

### Alright, we’ve finished *Part 10*.

Let’s recap how we got here. Let's look at the scheme one more time, then remove redundant less important pieces, and it becomes this:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/10/part-10-A.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/10/part-10-A.svg)

<em>10.1 Part 10 simplified (clickable)</em>

And we should probably fix spaces and alignment as well:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/10/part-10-B.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/10/part-10-B.svg)

<em>10.2 Part 10 simplified & refactored (clickable)</em>

Nice. In fact, that’s all that happens here. So, we can take the essential value from *Part 10* and use it for the final `updating` scheme:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/10/part-10-C.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/10/part-10-C.svg)

<em>10.3 Part 10 essential value (clickable)</em>

And then we're done!


[To the next page: Part 11 >>](./Part-11.md)

[<< To the previous page: Part 9](./Part-9.md)


[Home](../../README.md)
