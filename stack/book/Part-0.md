## Part 0

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/0/part-0.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/0/part-0.svg)

<em>0.0 Part 0 (clickable)</em>

### ReactDOM.render
Alright, let’s start with a call of ReactDOM.render.

The entry point is ReactDom.render, our app is started rendering into DOM from here. I created simple component `<ExampleApplication/>` to debug easier. So, the first thing which happens is JSX will be transformed into React elements. They are pretty simple, almost plain objects with a simple structure. They just represent what was returned from component’s render, nothing more. Some fields are already familiar for you, fields like props, key, ref. Property type refers to markup object described by JSX. So, in our case, it’s class `ExampleApplication`, but it also can be just string ‘button’ for Button tag etc. Also, during React element creation React will merge `defaultPtops` with props (if they were specified) and validate propTypes. Check source code for more details
(`src\isomorphic\classic\element\ReactElement.js`)

### ReactMount
You can see the module called `ReactMount` (01), it contains the logic of components mounting. Actually, there is no logic inside `ReactDOM`, it is just an interface to work with `ReactMount`, so when you call `ReactDOM.render` you technically call `ReactMount.render`. What is all that mounting about?
> Mounting is the process of initializing a React component by creating its representative DOM elements and inserting them into a supplied `container`.

At least the comment from the code describes it in that way. Well, what that really means? Alright, imagine the next transformation:


[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/0/mounting-scheme-1-small.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/0/mounting-scheme-1-small.svg)

<em>0.1 JSX to HTML (clickable)</em>

React needs to transform your component(s) description into HTML to put in into a document.
How to get there? Right, it needs to handle all props, events listeners, nested components, and logic. It’s needed to granulate your high-level description (components)  to really low-level data (HTML) which can be put into a web-page. That is all that mounting is about.


[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/0/mounting-scheme-1-big.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/0/mounting-scheme-1-big.svg)

<em>0.1 JSX to HTML, extended (clickable)</em>

Alright, let’s continue. But… it’s interesting fact time! Yes, let’s add some interesting things during our journey, to have more ‘fun’.

>  Interesting fact: Ensure that scroll is monitoring (02)

> Funny thing, during the first rendering of root component, React init scroll listeners and caches scroll values so that application code can access them without triggering reflows. Due to browser render implementation, actually, some DOM values are not static, they are calculated each time when you use them from code, it affects the performance of course. In fact, it’s only for older browsers, which don’t support pageX, pageY.  Reacts tries to optimize this as well. Nice. As you can see, to make a fast tool requires a bunch of techniques to be used, this one with the scroll is a good example.

### Instantiate React component

An instance of what should be created (03)? Component… right, but which one? Well, it’s a good point. No, not `<ExampleApllication />` that’s 100% :) We actually should instantiate some internal class.
Let’s check out the next scheme at first.

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/0/jsx-to-vdom.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/0/jsx-to-vdom.svg)

<em>0.3 JSX to VDOM (clickable)</em>


You can see three phases, JSX through React elements will be converted into one of internal React component types:  `ReactCompositeComponent` (for our own components),  `ReactDOMComponent` (for HTML tags) and `ReactDOMTextComponent` (for text nodes). We will omit `ReactDOMTextComponent`, and will focus on the first two.

Internal components? Well, that’s interesting. You’ve already heard about Virtual DOM, right? Virtual DOM is a kind of DOM representation which is used by React to not touch DOM directly while diff computations and so on. It makes React fast actually. But, in fact, there is no files or classes inside React source code called ‘Virtual DOM’. That’s funny, right? Well, it’s because of V-DOM is just conception, just an approach how to work with real DOM. So, someone says that V-DOM item refers to React element, but in my opinion, it’s not exactly true. I think that Virtual DOM refers to these three classes: `ReactCompositeComponent`, `ReactDOMComponent`, `ReactDOMTextComponent`. And you will see later why.

OK, let’s finish with our instantiating here. We have still interested an instance of what should we create. Alright, we will create an instance of `ReactCompositeComponent`, but, in fact, it’s not because we put  `<ExampleApplication/>` in `ReacrDOM.render`. React always starts rendering components tree from `TopLevelWrapper`. It’s almost idle wrapper, its `render` (render method of a component) will return `<ExampleApplication />` later, that’s it.
```javascript
//src\renderers\dom\client\ReactMount.js#277
TopLevelWrapper.prototype.render = function () {
  return this.props.child;
};

```

So, `TopLevelWrapper` only is created, no more for now. Moving forward. But.. interesting fact at first!
>  Interesting fact: Validate DOM nesting
>Almost each time when nested components are rendering, they are validating by a dedicated module for HTML validation called `validateDOMNesting`. DOM nesting validation means verification of `child -> parent` tag hierarchy. For example, if parent tag is `<select>`, child tag should be only one of the following: `option`, `optgroup`, or `#text`. These rules actually are defined in https://html.spec.whatwg.org/multipage/syntax.html#parsing-main-inselect. You’ve probably already seen this module in works, it populates errors like:
<em> &lt;div&gt; cannot appear as a descendant of &lt;p&gt; </em>.


### Alright, we’ve finished *Part 0*.

Let’s recap what we get here. Look at the scheme one more time, then, let’s remove redundant less important pieces, so it becomes like that:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/0/part-0-A.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/0/part-0-A.svg)

<em>0.4 Part 0 simplified (clickable)</em>

And, propably, let’s fix spaces and alignment as well:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/0/part-0-B.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/0/part-0-B.svg)

<em>0.5 Part 0 simplified&refactored (clickable)</em>

Nice. In fact, that’s all that happens here. So, we can take essential value from the *Part 0*, it will be used for the final `mounting` scheme:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/0/part-0-C.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/0/part-0-C.svg)

<em>0.6 Part 0 essential value (clickable)</em>

And then, we have done!


[To the next page: Part 1 >>](./Part-1.md)

[<< To the previous page: Intro](./Intro.md)


[Home](../../README.md)
