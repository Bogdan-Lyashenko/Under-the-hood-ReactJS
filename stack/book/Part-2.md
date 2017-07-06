## Part 2

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/2/part-2.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/2/part-2.svg)

<em>2.0 Part 2 (clickable)</em>

### One more transaction

This time it’s `ReactReconcileTransaction`. As you already know, the major thing that is interesting to us is transaction wrappers. There are three wrappers:

```javascript
//\src\renderers\dom\client\ReactReconcileTransaction.js#89
var TRANSACTION_WRAPPERS = [
  SELECTION_RESTORATION,
  EVENT_SUPPRESSION,
  ON_DOM_READY_QUEUEING,
];
```

As we can see these wrappers are used mostly to **keep the actual state**, lock some changeable values before method calls, and release them after. So, React ensures that, for example, the selection range (currently selected text input) is not disturbed by performing the transaction (get selected on `initialize` and restore on `close`). Also, it suppresses events (blur/focus) that could be inadvertently dispatched due to high-level DOM manipulations (like temporarily removing a text input from the DOM) so it **disables `ReactBrowserEventEmitter`** on `initialize` and enables on `close`.

Well, we are really close to starting the component mount, which will return us markup ready to put into DOM. Actually, `ReactReconciler.mountComponent` is just wrapper, or, it's more correct to say ‘mediator’. It delegates method mounting to component modules. This is an important moment, so let’s highlight:

> `ReactReconciler` module is always called in cases when implementation of some logic **depends on platform**, like this exact case. Mount is different per platform, so the ‘main module’ talks to `ReactReconciler` and `ReactReconciler` knows what to do next.

Alright, let's move on to the component’s method `mountComponent`. It's probably the method you have already heard about. It initializes the component, renders markup, and registers event listeners.  You see, a long way through and we finally see a component mounting call. After calling mount, we should get actual HTML elements which can be put into the document.


### Alright, we’ve finished *Part 2*.

Let’s recap how we got here. Let's look at the scheme one more time, then remove redundant less important pieces, and it becomes this:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/2/part-2-A.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/2/part-2-A.svg)

<em>2.1 Part 2 simplified (clickable)</em>

And we should probably fix spaces and alignment as well:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/2/part-2-B.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/2/part-2-B.svg)

<em>2.2 Part 2 simplified & refactored (clickable)</em>

Nice. In fact, that’s all that happens here. So, we can take the essential value from *Part 1* and use it for the final `mounting` scheme:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/2/part-2-C.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/2/part-2-C.svg)

<em>2.3 Part 2 essential value (clickable)</em>

And then we're done!


[To the next page: Part 3 >>](./Part-3.md)

[<< To the previous page: Part 1](./Part-1.md)


[Home](../../README.md)
