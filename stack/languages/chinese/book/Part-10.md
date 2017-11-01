## 第 10 部分

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/10/part-10.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/10/part-10.svg)

<em>10.0 第十部分 (点击查看大图)</em>

### 脏组件

就像流程图所示那样，React 会遍历步骤 (1) 的 `dirtyComponents`，并且通过事务调用步骤 (2) 的 `ReactUpdates.runBatchedUpdates`。事务? 又是一个新的事务，它怎么工作呢，我们一起来看。

这个事务的类型是 `ReactUpdatesFlushTransaction`，之前我们也说过，我们需要通过事务包装器来理解事务具体干什么。以下是从代码注释中获得的启示：

> ReactUpdatesFlushTransaction 的封装器组会清空 dirtyComponents 数组，并且执行 mount-ready 处理器组压入队列的更新 (mount-ready 处理器是指那些在 mount 成功后触发的生命周期函数。例如 `componentDidUpdate`) 

但是，不管怎样，我们需要证实它。现在有两个 `wrappers`： `NESTED_UPDATES` 和 `UPDATE_QUEUEING`。在初始化的过程中，我们存下步骤 (3) 的 `dirtyComponentsLength`。然后观察下面的 `close` 处，React 在更新过程中会不断检查对比 `dirtyComponentsLength`，当一批脏组件变更了，我们把它们从中数组中移出并再次执行 `flushBatchedUpdates`。 你看, 这里并没有什么黑魔法，每一步都清晰简单。

然而... 一个神奇的时刻出现了。`ReactUpdatesFlushTransaction` 复写了 `Transaction.perform` 方法。因为它实际上是从 `ReactReconcileTransaction` (在挂载的过程中应用到的事务，用来保障应用 `state` 的安全) 中获得的行为。因此在 `ReactUpdatesFlushTransaction.perform` 方法里，`ReactReconcileTransaction` 也被使用到，这个事务方法实际上又被封装了一次。

因此，从技术角度看，它可能形如：

```javascript
[NESTED_UPDATES, UPDATE_QUEUEING].initialize()
[SELECTION_RESTORATION, EVENT_SUPPRESSION, ON_DOM_READY_QUEUEING].initialize()

method -> ReactUpdates.runBatchedUpdates

[SELECTION_RESTORATION, EVENT_SUPPRESSION, ON_DOM_READY_QUEUEING].close()
[NESTED_UPDATES, UPDATE_QUEUEING].close()
```

我们之后会回到这个事务，再次理解它是如何帮助我们的。但是现在，让我们来看步骤 (2) `ReactUpdates.runBatchedUpdates` (`\src\renderers\shared\stack\reconciler\ReactUpdates.js#125`)。

我们要做的第一件事就是给 `dirtyComponets` 排序，我们来看步骤 (4)。怎么排序呢？通过 `mount order` (当实例挂载时组件获得的序列整数)，这将意味着父组件 (先挂载) 会被先更新，然后是子组件，然后往下以此类推。

下一步我们提升批号 `updateBatchNumber`，批号是一个类似当前差分对比更新状态的 ID。
代码注释中提到：

> ‘任何在差分对比更新过程中压入队列的更新必须在整个批处理结束后执行。 否则, 如果 dirtyComponents 为[A, B]。 其中 A 有孩子 B 和 C, 那么如果 C 的渲染压入一个更新给 B，则 B 可能在一个批次中更新两次 (由于 B 已经更新了，我们应该跳过它，而唯一能感知的方法就是检查批号)。’

这将避免重复更新同一个组件。

非常好，最终我们遍历 `dirtyComponents` 并传递其每个组件给步骤 (5) 的 `ReactReconciler.performUpdateIfNecessary`，这也是 `ReactCompositeComponent` 实例里调用 `performUpdateIfNecessary` 的地方。然后，我们将继续研究 `ReactCompositeComponent` 代码以及它的 `updateComponent` 方法，在那里我们会发现更多有趣的事，让我们继续深入研究。

### 好, 第 10 部分我们讲完了

我们来回顾一下我们学到的。我们再看一下这种模式，然后去掉冗余的部分：

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/10/part-10-A.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/10/part-10-A.svg)

<em>10.1 第 10 部分简化版 (点击查看大图)</em>

让我们适度调整一下：

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/10/part-10-B.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/10/part-10-B.svg)

<em>10.2 第 10 部分重构与简化 (点击查看大图)</em>

很好，实际上，下面的示意图就是我们所讲的。因此，我们可以理解**第 10 部分**的本质，并将其用于最终的 `updating` 方案：

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/10/part-10-C.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/10/part-10-C.svg)

<em>10.3 第 10 部分 本质 (点击查看大图)</em>

完成!


[下一节: 第 11 部分>>](./Part-11.md)

[<< 上一节: 第 9 部分](./Part-9.md)


[主页](./README.md)
