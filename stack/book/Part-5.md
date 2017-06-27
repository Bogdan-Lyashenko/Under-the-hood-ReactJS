## Part 5

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/5/part-5.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/5/part-5.svg)

<em>5.0 Part 5 (clickable)</em>

### Update DOM properties

Alright, that looks scary, right? The main idea is to apply diff of previous and new `props` efficiently. Look at the method comment in the code:
> “Reconciles the properties by detecting differences in property values and updating the DOM as necessary. This function is probably the single most critical path for performance optimization.”

There are two loops actually, first, by previous `props`, and then, by next `props`. In our case, with mounting, `lastProps` (previous) is empty (obviously, it’s the first time when we assign props), but, still, let see what’s going on here.

### Last `props` loop
So, the first step, we check if `nextProps` contains the same prop new value, if so, just skip it, because it will be handled later in `nextProps` loop. Then, we reset style values and delete event listeners (if they were set before), remove DOM attributes and DOM properties values. For attributes, make sure there are not one of `RESERVED_PROPS`, it’s actually `prop` like `children` or `dangerouslySetInnerHTML`.

### Next `props` loop
Here, the first step is to check if `prop` was changed, means if next value is different that old one. If no, so, we don’t do anything. For `styles` (as you noticed it’s treated a bit especially) update values that changed since `lastProp`. Then, we put events listeners (yes, exactly that ones, like `onClick` etc). Let’s analyze that with more details. First important thing, across React app all work goes with such named ‘syntetic’ events, well, nothing special, just a few more wrappers for more efficient work. Next thing, the mediator module for managing event listeners is `EventPluginHub` (`src\renderers\shared\stack\event\EventPluginHub.js`). It contains `listenerBank` map for caching and managing all listeners.
We are going to add our event listeners. But, not straight. The point is, that we should add listeners when component and DOM element is ready for handling events. Seems like we have delayed execution here. But, you will ask probably, how we can know, where that moment happens? Well, it’s time for the next answer! Do you remember we pass `transaction` through all methods and calls? Exactly! Because it can be helpful exactly for such situation. Let’s see the proof in the code:

```javascript
//src\renderers\dom\shared\ReactDOMComponent.js#222
transaction.getReactMountReady().enqueue(putListener, {
    inst: inst,
    registrationName: registrationName,
    listener: listener,
});
```

Okay, after event listeners we set DOM attributes and DOM properties values. Same as before, for attributes, make sure there are not one of `RESERVED_PROPS, it’s actually `prop` like `children` or `dangerouslySetInnerHTML`.

During processing last and next props we computed `styleUpdates` config and pass it now to `CSSPropertyOperations` module.
Well, and we’ve finished with properties updating. Let’s move on.

### Alright, we’ve finished *Part 5*.

Let’s recap what we get here. Look at the scheme one more time, then, let’s remove redundant less important pieces, so it becomes like that:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/5/part-5-A.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/5/part-5-A.svg)

<em>5.1 Part 5 simplified (clickable)</em>

And, probably, let’s fix spaces and alignment as well:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/5/part-5-B.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/5/part-5-B.svg)

<em>5.2 Part 5 simplified&refactored (clickable)</em>

5ice. In fact, that’s all that happens here. So, we can take essential value from the *Part 5*, it will be used for the final `mounting` scheme:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/5/part-5-C.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/5/part-5-C.svg)

<em>5.3 Part 5 essential value (clickable)</em>

And then, we have done!


[To the next page: Part 6 >>](./Part-6.md)

[<< To the previous page: Part 4](./Part-4.md)


[Home](../../README.md)
