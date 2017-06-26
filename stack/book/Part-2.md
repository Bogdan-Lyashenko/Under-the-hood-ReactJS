## Part 2

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/2/part-2.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/2/part-2.svg)

<em>2.0 Part 2 (clickable)</em>

### One more transaction

This time it’s `ReactReconcileTransaction`. As you already know, the major thing what is interesting for us is transaction wrappers. There are three wrappers:

```javascript
//\src\renderers\dom\client\ReactReconcileTransaction.js#89
var TRANSACTION_WRAPPERS = [
  SELECTION_RESTORATION,
  EVENT_SUPPRESSION,
  ON_DOM_READY_QUEUEING,
];
```

And, as we can see these wrappers are used mostly to keep state actual, lock some changeable values before method call and release after. So, React ensures that, for example, the selection range (currently selected text input) is not disturbed by performing the transaction (get selected on `initialize` and restore on `close`). Also, suppresses events (blur/focus) that could be inadvertently dispatched due to high-level DOM manipulations (like temporarily removing a text input from the DOM), so disable `ReactBrowserEventEmitter` on `initialize` and enable on `close`.

Well, we are really close to starting component mount, which will return us markup ready to put into DOM.
Actually, `ReactReconciler.mountComponent` just wrapper, or, it will be correct to say ‘mediator’, it delegates method mounting to component module, the important moment is here, let’s highlight:
> `ReactReconciler` module always is called in that cases, when implementation of some logic depends on platform, like this exact case. Mount is different per platform, so ‘main module’ talk to `ReactReconciler` and `ReactReconciler` knows what to do next.

Alright, move on to component’s method `mountComponent`. That’s exactly that method you probably have already heard about. It initializes the component, renders markup, and registers event listeners.  You see, so long way and we finally see a component mounting call. After calling mount we should get actually HTML elements which can be put into the document.


### Alright, we’ve finished *Part 2*.

Let’s recap what we get here. Look at the scheme one more time, then, let’s remove redundant less important pieces, so it becomes like that:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/2/part-2-A.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/2/part-2-A.svg)

<em>2.4 Part 2 simplified (clickable)</em>

And, propably, let’s fix spaces and alignment as well:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/2/part-2-B.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/2/part-2-B.svg)

<em>2.5 Part 2 simplified&refactored (clickable)</em>

Nice. In fact, that’s all that happens here. So, we can take essential value from the *Part 1*, it will be used for the final `mounting` scheme:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/2/part-2-C.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/2/part-2-C.svg)

<em>2.6 Part 2 essential value (clickable)</em>

And then, we have done!


[To the next page: Part 3 >>](./Part-3.md)

[<< To the previous page: Part 1](./Part-1.md)


[Home](../../README.md)
