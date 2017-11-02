## 第 14 部分

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/14/part-14.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/14/part-14.svg)

<em>14.0 第 14 部分(点击查看大图)</em>

### 最后一章!

在发起子组件更新操作时会有很多属性影响子组件内容。这里有几种可能的情况，不过其实就只有两大主要情况。即子组件是不是 “复杂”。这里的复杂的含义是，它们是React组件，React应当通过它们不断递归直到触及内容层，或者，该子组件只是简单数据类型，比如字符串、数字。

这个判断条件就是步骤 (1) 的 `nextProps.children` 的类型，在我们的情形中，`ExampleApplication` 有三个孩子 `button`, `ChildCmp` 和 `text string`。

很好，现在让我们来看它的工作原理。

首先，在首次迭代时，我们分析 `ExampleApplication children`。很明显可以看出子组件的类型不是 “纯内容类型”，因此情况为 “复杂” 情况。然后我们一层层往下递归，每层都会判断 children 的类型。顺便说一下，步骤 (2) 的 `shouldUpdateReactComponent` 判断条件可能让你有些困惑，它看上去是在验证更新与否，但实际上它会检查类型是更新还是删除与创建（为了简化流程我们跳过此条件为否的情形，假定是更新）。当然接下来我们对比新旧子组件，如果有孩子被移除，我们也会去除挂载组件，并把它移除。

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/14/children-update.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/14/children-update.svg)

<em>14.1 Children 更新 (点击查看大图)</em>

在第二轮迭代时，我们分析 `button`，这是一个很简单的案例，由于它仅包含一个标题文字 `set state button`，它的孩子只是一个字符串。因此我们对比一下之前和现在的内容。很好，这些文字并没有变化，因此我们不需要更新 `button`？这非常的合理，因此所谓的 “虚拟 DOM”，现在听上去也不是那么的抽象，React 维护了一个对 DOM 的内部表达对象，并且在需要的时候更改真实 DOM，这样取得了很不错的性能。因此我想你应该已经了解了这个设计模式。那我们接着来更新 `ChildCmp`，然后它的孩子也到达我们可以更新的最底层。可以看到在这层的内容已经被修改了，当时我们通过 `click` 和 `setState` 的调用，`this.props.message` 已经更新成 `'click state message` 了。

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

从这里可以看出已经可以更新元素的内容，事实上也就是替换它。那么真正的行为是怎样的呢，其实它会生成一个“配置对象”并且其配置的动作会被相应地应用。在我们的场景下这个文字的更新操作可能形如：

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
我们可以看到很多字段是空，因为文字更新是比较简单的。但是它有很多属性字段，因为当你移动节点就会比仅仅更新字符串要复杂得多。我们来看这部分的源码加深理解。

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

在我们的情况下，更新类型是 `TEXT_CONTENT`，因此实际上这是最后一步，我们调用步骤 (3) 的 `setTextContent` 方法并且更新 HTML 节点（从真实 DOM 中操作）。

非常好！内容已经被更新，界面上也做了重绘。我们还有什么遗忘的吗？让我们结束更新！这些事都做完了，我们的组件生命周期钩子函数 `componentDidUpdate` 会被调用。这样的延迟回调是怎么调用的呢？实际上就是通过事务的封装器。如果你还记得，脏组件的更新会被 `ReactUpdatesFlushTransaction` 封装器修饰，并且其中的一个封装器实际上包含了 `this.callbackQueue.notifyAll()` 逻辑，所以它回调用 `componentDidUpdate`。很好，现在看上去我们已经讲完了全部内容。

### 好, 第 14 部分我们讲完了

我们来回顾一下我们学到的。我们再看一下这种模式，然后去掉冗余的部分：

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/14/part-14-A.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/14/part-14-A.svg)

<em>14.2 第 14 部分简化板 (点击查看大图)</em>

然后我们适当再调整一下：

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/14/part-14-B.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/14/part-14-B.svg)

<em>14.3 第 14 简化和重构 (点击查看大图)</em>

很好，实际上，下面的示意图就是我们所讲的。因此，我们可以理解**第 14 部分**的本质，并将其用于最终的 `updating` 方案：

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/14/part-14-C.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/14/part-14-C.svg)

<em>14.4 第 14 部分 本质 (点击查看大图)</em>

我们已经完成了更新操作的学习，让我们重头整理一下。

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/14/updating-parts-C.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/14/updating-parts-C.svg)

<em>14.5 更新 (点击查看大图)</em>

[<< 上一节: 第 13 部分](./Part-13.md)


[主页](./README.md)
