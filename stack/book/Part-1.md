## Part 1

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/1/part-1.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/1/part-1.svg)

<em>1.0 Part 1 (clickable)</em>

### Transaction

Well, the component instance should be somehow **connected** to React's eco-system and, of course, **make some influence** on it. There is a dedicated module `ReactUpdates` which helps with this. As you know, **React performs updates in chunks**, it means that it collects operations and performs them **together**. It’s always better because it allows applying some **pre-condition** and **post-conditions** just once for the whole list of items (chunk) instead of doing it for each item.

What actually helps handle this pre/post processing? Right, **transaction**! For someone it can be a new word, or at least its interpretation for UI needs, so let’s talk a bit more about it and start from a simple example.

Imagine the ‘communication channel’. You need to open a connection, send the message, then close the connection. This can be a lot if you send several messages one by one. Instead, you can open the connection only once, send all pending messages, then close connection after.


[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/1/communication-channel.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/1/communication-channel.svg)

<em>1.1 Very real example of transaction (clickable)</em>

Alright, let’s think about more abstract things then. Imagine that ‘send message’ is any operation you want to perform and ‘open/close connection’ is pre/post processing during performing an operation. And, then, imagine that you can define any open-close pairs separately and use them with any methods you want (we can name them wrappers, because in fact, each pair wraps action methods). Sounds cool, right.

Moving back to React. Transaction is a widely used pattern inside React. Apart from wrapping behavior, transaction allows the application to reset transaction flow, block simultaneous execution if a transaction is already in progress, and more. There are many different transaction classes, each of them describes specific behavior, but all of them are extended from the `Transaction` module. The key differences between transactions are specific to the exact transaction wrapper's list. Wrappers are just an object that contain initialize and close methods.

So, **the idea is**:
* call each wrapper.initialize and cache the returned values (it can be used further)
* call the transaction method itself
* call each wrapper.close

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/1/transaction.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/1/transaction.svg)

<em>1.2 Transaction implementation (clickable)</em>


Let’s see some **other use cases** for transactions in React:
* Preserving the input selection ranges before/after reconciliation restoring selection even in the event of an unexpected error.
* Deactivating events while rearranging the DOM preventing blurs/focuses, while guaranteeing that afterwards, the event system is reactivated.
* Flushing a queue of collected DOM mutations to the main UI thread after a reconciliation takes place in a worker thread.
* Invoking any collected `componentDidUpdate` callbacks after rendering new content.

Well, let’s come back to our exact case.

As we can see, React uses `ReactDefaultBatchingStrategyTransaction` (1). Like we just went over, the key thing about a transaction is its wrappers. So, we can look at the wrappers and figure out what's the exact transaction defined. Alright, there are two wrappers: `FLUSH_BATCHED_UPDATES`, `RESET_BATCHED_UPDATES`. Let’s check the code:

```javascript
//\src\renderers\shared\stack\reconciler\ReactDefaultBatchingStrategy.js#19
var RESET_BATCHED_UPDATES = {
	  initialize: emptyFunction,
	  close: function() {
		ReactDefaultBatchingStrategy.isBatchingUpdates = false;
	  },
};

var FLUSH_BATCHED_UPDATES = {
	 initialize: emptyFunction,
	 close: ReactUpdates.flushBatchedUpdates.bind(ReactUpdates),
}

var TRANSACTION_WRAPPERS = [FLUSH_BATCHED_UPDATES, RESET_BATCHED_UPDATES];
```

So, you can see how it looks. For this transaction there are no pre-conditions. The `initialize` methods are empty, but one of the `close` methods is pretty interesting. It calls `ReactUpdates.flushBatchedUpdates`. What does it mean? Well, it actually starts the verification of dirty components with further re-rendering. So, you follow, right? We call the mounting method and wrap it in this exact transaction because after mount, React checks to see what is affected by the mounted components and updates them.

Alright, let’s take a look at the method that was wrapped in the transaction. Well, in fact, it brings us to another transaction...


### Alright, we’ve finished *Part 1*.

Let’s recap how we got here. Let's look at the scheme one more time, then remove redundant less important pieces, and it becomes this:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/1/part-1-A.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/1/part-1-A.svg)

<em>1.3 Part 1 simplified (clickable)</em>

And we should probably fix spaces and alignment as well:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/1/part-1-B.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/1/part-1-B.svg)

<em>1.4 Part 1 simplified & refactored (clickable)</em>

Nice. In fact, that’s all that happens here. So, we can take the essential value from *Part 1* and use it for the final `mounting` scheme:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/1/part-1-C.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/1/part-1-C.svg)

<em>1.5 Part 1 essential value (clickable)</em>

And then we're done!


[To the next page: Part 2 >>](./Part-2.md)

[<< To the previous page: Part 0](./Part-0.md)


[Home](../../README.md)
