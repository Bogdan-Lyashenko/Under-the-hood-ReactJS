## 第七部分

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/7/part-7.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/7/part-7.svg)

<em>7.0 第七部分（可点击查看大图）</em>

### 回到开始的地方

在执行加载后，我们就准备好了可以插入文档的 HTML 元素。实际上生成的是 `markup`，但是无论 `mountComponent` 是如何命名的，它们并非等同于 HTML 标记。它是一种包括子节点、节点（也就是实际 DOM 节点）等的数据结构。但是，我们最终将 HTML 元素放入在 `ReactDOM.render` 的调用中指定的容器中。在将其添加到 DOM 中时，React 会清除容器中的所有内容。`DOMLazyTree` 是一个对树形结构执行一些操作的工具类，也是我们在使用 DOM 时实际在做的事。

最后一件事是 `parentNode.insertBefore(tree.node)`，其中 `parentNode` 是容器 `div` 节点，而 `tree.node` 实际上是 `ExampleAppliication` 的 div 节点。很好，加载创建的 HTML 元素终于被插入到文档中了。

那么，这就是所有？并未如此。也许你还记得，`mount` 的调用被包装到一个事务中。这意味着我们需要关闭这个事务。让我们来看看我们的 `close` 包装。多数情况下，我们应该恢复一些被锁定的行为，例如 `ReactInputSelection.restoreSelection()`，`ReactBrowserEventEmitter.setEnabled(previouslyEnabled)`，而且我们也需要使用 `this.reactMountReady.notifyAll` 来通知我们之前在 `transaction.reactMountReady` 中添加的所有回调函数。其中之一就是我们最喜欢的 `componentDidMount`，它将在 `close` 中被触发。

现在你对“组件已加载”的意思有了清晰的了解。恭喜！

### 还有一个事务需要关闭

实际上，不止一个事务需要关闭。我们忘记了另一个用来包装 `ReactMount.batchedMountComponentIntoNode` 的事务。我们也需要关闭它。

这里我们需要检查将处理 `dirtyComponents` 的包装器 `ReactUpdates.flushBatchedUpdates`。听起来很有趣吗？那是好消息还是坏消息。我们只做了第一次加载，所以我们还没有脏组件。这意味着它是一个空置的调用。因此，我们可以关闭这个事务，并说批量策略更新已完成。

### 好的，我们已经完成了**第 7 部分**

让我们回顾一下我们是如何到达这里的。首先再看一下整体流程，然后去除多余的不太重要的部分，它就变成了：

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/7/part-7-A.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/7/part-7-A.svg)

<em>7.1 第 7 部分 简化（点击查看大图）</em>

我们也应该修改空格和对齐：

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/7/part-7-B.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/7/part-7-B.svg)

<em>7.2 第 7 部分 简化并重构（点击查看大图）</em>

其实这就是这里发生的所有。我们可以从第 7 部分中的重要部分来组成最终的 `mounting` 流程：

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/7/part-7-C.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/7/part-7-C.svg)

<em>7.3 第 7 部分 基本价值（点击查看大图）</em>

完成！其实我们完成了加载。让我们来看看下图吧！


[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/7/mounting-parts-C.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/7/mounting-parts-C.svg)

<em>7.4 Mounting 过程（点击查看大图）</em>

[下一节：第 8 部分 >>](./Part-8.md)

[<< 上一节：第 6 部分](./Part-6.md)


[主页](./README.md)
