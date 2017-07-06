## Part 4

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/4/part-4.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/4/part-4.svg)

<em>4.0 Part 4 (clickable)</em>

### Child mounting

Going crazy, right. Let’s continue with investigating mount method.

So, if `_tag` is one of ‘complex’ tags (1), like video, form, textarea, etc. it will requires additional wrapping with adding more event listeners (e.g. for each media event, like ‘volumechange’ etc) for `audio` tag, or just wrapping native behavior of `select`, `textarea` etc.
There is a bunch of wrappers for that, like `ReactDOMSelect`, `ReactDOMTextarea` (inside src\renderers\dom\client\wrappers\ folder). In our case it’s just simply `div`, no additional processing then.

### Props validation

The next validation method called just make sure that internal `props` set correctly, or otherwise throw errors. For example, if `props.dangerouslySetInnerHTML` is set (usually we do that when try to insert HTML from a string) and object key `__html` is missed, the next error will be thrown:

> `props.dangerouslySetInnerHTML` must be in the form `{__html: ...}`.  Please visit https://fb.me/react-invariant-dangerously-set-inner-html for more information.

### Create HTML element

Then, the actually HTML element will be created (3), exactly, `document.createElement` will instantiate that real HTML `div` for us. Before we worked only with virtual representation and now, you can see it for the first time.


### Alright, we’ve finished *Part 4*.

Let’s recap how we got here. Let's look at the scheme one more time, then remove redundant less important pieces, and it becomes this:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/4/part-4-A.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/4/part-4-A.svg)

<em>4.1 Part 4 simplified (clickable)</em>

And we should probably fix spaces and alignment as well:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/4/part-4-B.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/4/part-4-B.svg)

<em>4.2 Part 4 simplified & refactored (clickable)</em>

Nice. In fact, that’s all that happens here. So, we can take the essential value from *Part 4* and use it for the final `mounting` scheme:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/4/part-4-C.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/4/part-4-C.svg)

<em>4.3 Part 4 essential value (clickable)</em>

And then we're done!


[To the next page: Part 5 >>](./Part-5.md)

[<< To the previous page: Part 3](./Part-3.md)


[Home](../../README.md)
