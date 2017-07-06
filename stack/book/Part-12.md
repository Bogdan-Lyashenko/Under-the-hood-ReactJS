## Part 12

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/12/part-12.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/12/part-12.svg)

<em>12.0 Part 12 (clickable)</em>

### If components actually should update..

So, it’s the very beginning of the update, it means it’s a good place to call `componentWillUpdate` hook if it’s specified (1). Then, re-render component and enqueue the call of one more well-known method `componentDidUpdate` (postpone the call, because it should be called in the very end of the update).
What about re-render? Actually, what we need to do here it’s to call the component's `render` method and update the DOM accordingly. So, the first step, we call `render`(2) method from our instance (`ExampleApplication`) and store the result of render (React elements which were returned from a method call). Then, we compare it previous rendered element and see, if DOM actually should be updated.

You see this, right, it’s actually one of React’s killer features, it avoids redundant DOM updates, what makes React performance really good.
Due to the code comment `shouldUpdateReactComponent`(3)  method:
> ‘determines if the existing instance should be updated as opposed to being destroyed or replaced by a new instance’.

So, roughly speaking, the method check if element should be replaced completely, it means, old one should be `unmounted` first, then new element (got from `render`) should be mounted and markup, received from the `mount` method,  should be placed instead of current element, or, if element can be partially updated. The major reason to replace element completely is a case when a new element is empty (was removed by `render` logic) or its type is different, e.g. it was `div` but now it’s something else. Let’s see the code, it’s simple enough.

```javascript
///src/renderers/shared/shared/shouldUpdateReactComponent.js#25

function shouldUpdateReactComponent(prevElement, nextElement) {
    var prevEmpty = prevElement === null || prevElement === false;
    var nextEmpty = nextElement === null || nextElement === false;
    if (prevEmpty || nextEmpty) {
        return prevEmpty === nextEmpty;
    }

    var prevType = typeof prevElement;
    var nextType = typeof nextElement;
    if (prevType === 'string' || prevType === 'number') {
        return (nextType === 'string' || nextType === 'number');
    } else {
        return (
            nextType === 'object' &&
            prevElement.type === nextElement.type &&
            prevElement.key === nextElement.key
        );
    }
}
```

Alright, in the case with our `ExampleApplication` we just updated `state` property which doesn’t affect `render` so much, so, we go with the second scenario, meaning `update`.

### Alright, we’ve finished *Part 12*.

Let’s recap how we got here. Let's look at the scheme one more time, then remove redundant less important pieces, and it becomes this:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/12/part-12-A.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/12/part-12-A.svg)

<em>12.1 Part 12 simplified (clickable)</em>

And we should probably fix spaces and alignment as well:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/12/part-12-B.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/12/part-12-B.svg)

<em>12.2 Part 12 simplified & refactored (clickable)</em>

Nice. In fact, that’s all that happens here. So, we can take the essential value from *Part 12* and use it for the final `updating` scheme:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/12/part-12-C.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/12/part-12-C.svg)

<em>12.3 Part 12 essential value (clickable)</em>

And then we're done!


[To the next page: Part 13 >>](./Part-13.md)

[<< To the previous page: Part 11](./Part-11.md)


[Home](../../README.md)
