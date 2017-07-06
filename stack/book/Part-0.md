## Part 0

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/0/part-0.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/0/part-0.svg)

<em>0.0 Part 0 (clickable)</em>

### ReactDOM.render
Alright, let’s start with a call of ReactDOM.render.

The entry point is ReactDom.render. Our app starts rendering into the DOM from here. I created a simple component `<ExampleApplication/>` to debug easier. So, the first thing that happens is **JSX will be transformed into React elements**. They are pretty simple, almost plain objects with a simple structure. They just represent what was returned from the component’s render, nothing more. Some fields should already be familiar to you like props, key, and ref. Property type refers to the markup object described by JSX. So, in our case, it’s class `ExampleApplication`, but it also can be just string `button` for Button tag, etc. Also, during React element creation, React will merge `defaultProps` with `props` (if they were specified) and validate `propTypes`.

Check the source code for more details: `src\isomorphic\classic\element\ReactElement.js`

### ReactMount
You can see the module called `ReactMount` (01). It contains the logic of components mounting. Actually, there is no logic inside `ReactDOM`, it is just an interface to work with `ReactMount`, so when you call `ReactDOM.render` you technically call `ReactMount.render`. What is all that mounting about?
> Mounting is the process of initializing a React component by creating its representative DOM elements and inserting them into a supplied `container`.

At least the comment from the code describes it in that way. Well, what does that really mean? Alright, well imagine the next transformation:


[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/0/mounting-scheme-1-small.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/0/mounting-scheme-1-small.svg)

<em>0.1 JSX to HTML (clickable)</em>

React needs to **transform your component(s) description into HTML** to put it into a document. How do we get it get there? Right, it needs to handle all **props, events listeners, nested components**, and logic. It’s needed to granulate your high-level description (components)  to really low-level data (HTML) which can be put into a webpage. That is all that mounting really is.


[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/0/mounting-scheme-1-big.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/0/mounting-scheme-1-big.svg)

<em>0.1 JSX to HTML, extended (clickable)</em>

Alright, let’s continue. But… it’s interesting fact time! Yes, let’s add some interesting things during our journey, to have more "fun".

>  Interesting fact: Ensure that scroll is monitoring (02)

> Funny thing, during the first rendering of a root component, React initializes scroll listeners and caches scroll values so that the application code can access them without triggering reflows. Actually, due to different browser render implementations, some DOM values are not static, they are calculated each time you use them in the code. Of course, this affects the performance. In fact, it’s only for older browsers, which don’t support `pageX` and `pageY`.  Reacts tries to optimize this as well. Nice. As you can see, making a fast tool requires a bunch of techniques to be used, this one with scroll is a good example.

### Instantiate React component

Look at the scheme, there is an instance creation by number (03). Well, it's too early to create an instance of `<ExampleApplication />` here. In fact, we instantiate `TopLevelWrapper` (internal React class). Let’s check out the next scheme first.

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/0/jsx-to-vdom.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/0/jsx-to-vdom.svg)

<em>0.3 JSX to VDOM (clickable)</em>

You can see three phases, JSX through React elements will be converted into one of internal React component types:  `ReactCompositeComponent` (for our own components),  `ReactDOMComponent` (for HTML tags), and `ReactDOMTextComponent` (for text nodes). We will omit `ReactDOMTextComponent` and will just focus on the first two.

Internal components? Well, that’s interesting. You’ve already heard about **Virtual DOM**, right? Virtual DOM is a kind of DOM representation which is used by React to not touch the DOM directly during diff computations and so on. It makes React fast! But, in fact, there is no files or classes inside React's source code called ‘Virtual DOM’. That’s funny, right? Well, it’s because V-DOM is just a concept, an approach of how to work with the real DOM. So, some people say that V-DOM items refer to React elements, but in my opinion, it’s not exactly true. I think that Virtual DOM refers to these three classes: `ReactCompositeComponent`, `ReactDOMComponent`, `ReactDOMTextComponent`. And you will see later why.

OK, let’s finish with our instantiating here. We will create an instance of `ReactCompositeComponent`, but, in fact, it’s not because we put  `<ExampleApplication/>` in `ReactDOM.render`. React always starts rendering a component's tree from `TopLevelWrapper`. It’s almost an idle wrapper, its `render` (render method of a component) will later return `<ExampleApplication />`, that’s it.
```javascript
//src\renderers\dom\client\ReactMount.js#277
TopLevelWrapper.prototype.render = function () {
  return this.props.child;
};

```

So, only `TopLevelWrapper` is created, nothing more for now. Moving forward. But... first, an interesting fact!
>  Interesting fact: Validate DOM Nesting

> Almost every time nested components are rendering, they are being validated by a dedicated module for HTML validation called `validateDOMNesting`. DOM nesting validation means verification of `child -> parent` tag hierarchy. For example, if a parent tag is `<select>`, the child tag should be only one of the following: `option`, `optgroup`, or `#text`. These rules actually are defined in https://html.spec.whatwg.org/multipage/syntax.html#parsing-main-inselect. You’ve probably already seen this module at work, it populates errors like:
<em> &lt;div&gt; cannot appear as a descendant of &lt;p&gt; </em>.


### Alright, we’ve finished *Part 0*.

Let’s recap how we got here. Let's look at the scheme one more time, then remove redundant less important pieces, and it becomes this:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/0/part-0-A.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/0/part-0-A.svg)

<em>0.4 Part 0 simplified (clickable)</em>

And we should probably fix spaces and alignment as well:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/0/part-0-B.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/0/part-0-B.svg)

<em>0.5 Part 0 simplified & refactored (clickable)</em>

Nice. In fact, that’s all that happens here. So, we can take the essential value from *Part 0* and use it for the final `mounting` scheme:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/0/part-0-C.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/0/part-0-C.svg)

<em>0.6 Part 0 essential value (clickable)</em>

And then we're done!


[To the next page: Part 1 >>](./Part-1.md)

[<< To the previous page: Intro](./Intro.md)


[Home](../../README.md)
