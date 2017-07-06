## Part 14

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/14/part-14.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/14/part-14.svg)

<em>14.0 Part 14 (clickable)</em>

### The final one!

The method reconciles the children with the various properties that affect the children content. There are several possible scenarios, but technically just two major cases. Either children still are ‘complex’, it the meaning, they are React components and React should recurse several times through their layers till finally reach to content level, or, children are simple types, strings or numbers (content).

The switcher is a type of `nextProps.children`(1), and for our case, we have `ExampleApplication` component with three children: `button`, `ChildCmp` and `text string`.

Alright, let’s see how it works.

So, the first iteration with `ExampleApplication children`. Obviously, type of children is not ‘content’, so we go with ‘complex’ case then. We take all children, and, one by one pass through almost the same scenario we made previously for their parent component. By the way, block with the verification `shouldUpdateReactComponent`(2) can confuse, it looks like verification checks update or not, but in reality, it checks update or delete&create (we skip NO branch on the scheme to keep it simple). Also, after, we compare old and current children, and if some child was removed, we unmount component and remove it as well.

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/14/children-update.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/14/children-update.svg)

<em>14.1 Children update (clickable)</em>

So, the second iteration, we process `button`, it will be the simple case, because the type of button `children` is just ‘text’, because button contains only title ‘set state button’. Then we check if the previous text is the same as now, alright, the text was not changed, so we don’t need to update `button` then? Fair enough. So, ‘VirtualDOM things’ in action. Now it doesn’t sound so abstractive, React maintenance internal representation of DOM and touch real DOM only if it’s required. Excellent performance as result.
So, I think you’ve already got the idea, then we put `ChildCmp` for  update, and its children till reach the lowest level items (content) and be able to update it. Its content is modified actually, you remember that `this.props.message` is updated with 'click state message' via `click` and `setState` call.

```javascript
//...
onClickHandler() {
	this.setState({ message: 'click state message' });
}

render() {
    return <div>
		<button onClick={this.onClickHandler.bind(this)}>set state button</button>
		<ChildCmp childMessage={this.state.message} />
//...

```

So, let’s see. We are gonna to update the content of the element, in fact - replace it. Well, what update actually is? So, it’s kind of configuration object which will be parsed and the configured action will be applied. For our case with text update it looks like:

```javascript
{
  afterNode: null,
  content: "click state message",
  fromIndex: null,
  fromNode: null,
  toIndex: null,
  type: "TEXT_CONTENT"
}
```
You can see, it’s almost empty, the case with text update is pretty straightforward. As you can see, there are many properties, that’s because when you, let’s move nodes, it could be more complex than just text update.

Checkout the method code, to have a clear picture.

```javascript
//src\renderers\dom\client\utils\DOMChildrenOperations.js#172
processUpdates: function(parentNode, updates) {
    for (var k = 0; k < updates.length; k++) {
      var update = updates[k];

      switch (update.type) {
        case 'INSERT_MARKUP':
          insertLazyTreeChildAt(
            parentNode,
            update.content,
            getNodeAfter(parentNode, update.afterNode)
          );
          break;
        case 'MOVE_EXISTING':
          moveChild(
            parentNode,
            update.fromNode,
            getNodeAfter(parentNode, update.afterNode)
          );
          break;
        case 'SET_MARKUP':
          setInnerHTML(
            parentNode,
            update.content
          );
          break;
        case 'TEXT_CONTENT':
          setTextContent(
            parentNode,
            update.content
          );
          break;
        case 'REMOVE_NODE':
          removeChild(parentNode, update.fromNode);
          break;
      }
    }
  }
```

Our case is ‘TEXT_CONTENT’ and actually it’s the final step, we call `setTextContent` (3) and modify the content of the HTML node ( the real one, from the DOM).

Well done! Content is updated and on the page, it’s re-rendered for a user as well. What else is missed? Let’s finish our update! Everything is ready, so our component’s hook `componentDidUpdate` will be called. How postpone callbacks usually are called? Right, with transaction wrapper. As you remember, dirty component update was wrapped with `ReactUpdatesFlushTransaction`, and one of its wrappers actually contains logic `this.callbackQueue.notifyAll()`, so, it will call `componentDidUpdate`. Nice!

Looks like we are done. Completely.

### Alright, we’ve finished *Part 14*.

Let’s recap how we got here. Let's look at the scheme one more time, then remove redundant less important pieces, and it becomes this:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/14/part-14-A.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/14/part-14-A.svg)

<em>14.2 Part 14 simplified (clickable)</em>

And we should probably fix spaces and alignment as well:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/14/part-14-B.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/14/part-14-B.svg)

<em>14.3 Part 14 simplified & refactored (clickable)</em>

Nice. In fact, that’s all that happens here. So, we can take the essential value from *Part 14* and use it for the final `updating` scheme:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/14/part-14-C.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/14/part-14-C.svg)

<em>14.4 Part 14 essential value (clickable)</em>

And then we're done! In fact, we're done with updating. Let's see it below!

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/14/updating-parts-C.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/14/updating-parts-C.svg)

<em>14.5 Updating (clickable)</em>

[<< To the previous page: Part 13](./Part-13.md)


[Home](../../README.md)
