## Part 5

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/5/part-5.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/5/part-5.svg)

<em>5.0 Part 5 (clickable)</em>

### Update DOM properties

Alright, that looks scary, right? The main idea is to apply the diff of previous and new `props` efficiently. Look at the method comment in the code:
> “Reconciles the properties by detecting differences in property values and updating the DOM as necessary. This function is probably the single most critical path for performance optimization.”

There are two loops actually. First, through previous `props` and then, through next `props`. In our case, with mounting, `lastProps` (previous) is empty (obviously, it’s the first time when we assign props), but still, let see what’s going on here.

### Last `props` loop
In the first step, we check if `nextProps` contains the same prop value. If so, we just skip it, because it will be handled later in the `nextProps` loop. Then, we reset style values, delete event listeners (if they were set before), and remove DOM attribute and DOM properties values. For attributes, we make sure they are not one of the `RESERVED_PROPS`, that it's actually `prop`, like `children` or `dangerouslySetInnerHTML`.

### Next `props` loop
Here, the first step is to check if `prop` was changed, meaning if the next value is different than the old one. If not, we don’t do anything. For `styles`, (you might have noticed it’s treated a bit special) we update values that have changed since `lastProp`. Then, we add the events listeners (yes, exactly the ones like `onClick`, etc). Let’s analyze that with more details.

The important thing is, across the React app, all work is passed through named ‘synthetic’ events. Nothing is special, it's just a few more wrappers for more efficient work. Next thing, the mediator module for managing event listeners is `EventPluginHub` (`src\renderers\shared\stack\event\EventPluginHub.js`). It contains a `listenerBank` map for caching and managing all listeners.
We are going to add our event listeners, but not right away. The point is, that we should add listeners when the component and DOM element is ready for handling events. Seems like we have delayed execution here, but you will probably ask, how can we know when that moment happens? Well, it’s time for the next answer! Do you remember when we passed `transaction` through all of the methods and calls? Exactly! We did that because it can be helpful exactly for such a situation. Let’s see the proof in the code:

```javascript
//src\renderers\dom\shared\ReactDOMComponent.js#222
transaction.getReactMountReady().enqueue(putListener, {
    inst: inst,
    registrationName: registrationName,
    listener: listener,
});
```

Okay, after the event listeners, we set DOM attribute and DOM property values. Same as before, for attributes we make sure they are not one of the `RESERVED_PROPS`, that it’s actually `prop`, like `children` or `dangerouslySetInnerHTML`.

During the processing of the last and next props, we computed the `styleUpdates` config and now pass it to the `CSSPropertyOperations` module.

Well, we’ve finished updating the properties. Let’s move on.

### Alright, we’ve finished *Part 5*.

Let’s recap how we got here. Let's look at the scheme one more time, then remove redundant less important pieces, and it becomes this:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/5/part-5-A.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/5/part-5-A.svg)

<em>5.1 Part 5 simplified (clickable)</em>

And we should probably fix spaces and alignment as well:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/5/part-5-B.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/5/part-5-B.svg)

<em>5.2 Part 5 simplified & refactored (clickable)</em>

Nice. In fact, that’s all that happens here. So, we can take the essential value from *Part 5* and use it for the final `mounting` scheme:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/5/part-5-C.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/5/part-5-C.svg)

<em>5.3 Part 5 essential value (clickable)</em>

And then we're done!


[To the next page: Part 6 >>](./Part-6.md)

[<< To the previous page: Part 4](./Part-4.md)


[Home](../../README.md)
