## 第 9 部分

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/9/part-9.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/9/part-9.svg)

<em>9.0 第 9 部分(点击查看大图)</em>

### 继续研究 `setState`

根据流程图我们发现，有很多方式来触发 `setState`。可以直接通过用户交互触发，也可能只是隐含在方法里触发。我们举两个例子：第一种情况下，它由用户的鼠标点击事件触发。而第二种情况，例如在 `componentDidMount` 里通过 `setTimeout` 调用来触发。

那么这两种方式有什么差异呢？如果你还记得 React 的更新过程是批量化进行的，这就意味着他先会收集这些更新操作，然后一起处理。当鼠标事件触发后，会被顶层先处理，然后经过多层封装器的作用，这个批更新操作才会开始。过程中你会发现，只有当步骤 (1) 的 `ReactEventListener` 是 `enabled` 的状态才会触发更新。然而你还记得在组件挂载过程中，`ReactReconcileTransaction` 中的一个封装器会使它 `disabled` 来确保挂载的安全。那么 `setTimeout` 案例是怎样的呢？这个也很简单，在把组件丢进 `dirtyComponents` 列表前，React会确保事务已经开始，那么，之后他应该会被关闭，然后一起处理列表中的组件。

就像你所知道的那样，React 有实现很多 “synthetic事件”，一些 “语法糖”，实际上包裹着原生事件。随后，他会表现为我们很熟悉的原生事件。你可以看下面的代码注释：

> 实验过程为了更方便和调试工具整合，我们模拟一个真实浏览器事件

```javascript
var fakeNode = document.createElement('react');

ReactErrorUtils.invokeGuardedCallback = function (name, func, a) {
      var boundFunc = func.bind(null, a);
      var evtType = 'react-' + name;

      fakeNode.addEventListener(evtType, boundFunc, false);

      var evt = document.createEvent('Event');
      evt.initEvent(evtType, false, false);

      fakeNode.dispatchEvent(evt);
      fakeNode.removeEventListener(evtType, boundFunc, false);
};
```
好，回到我们的更新，让我们总结一下，整个过程是：

1. 调用 setState
2. 如果批处理事务没有打开，则打开
3. 把受影响的组件添加入 `dirtyComponents` 列表
4. 在调用 `ReactUpdates.flushBatchedUpdates `的同时关闭事务, 并处理在所有 `dirtyComponents` 列表中的组件

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/9/set-state-update-start.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/9/set-state-update-start.svg)

<em>9.1 `setState` 执行过程 (点击查看大图)</em>

### 好，**第 9 部分**我们讲完了

我们来回顾一下我们学到的。我们再看一下这种模式，然后去掉冗余的部分：

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/9/part-9-A.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/9/part-9-A.svg)

<em>9.2 第 9 部分简化版 (点击查看大图)</em>

然后我们适当再调整一下：

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/9/part-9-B.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/9/part-9-B.svg)

<em>9.3 第 9 部分简化和重构 (点击查看大图)</em>

很好，实际上，下面的示意图就是我们所讲的。因此，我们可以理解**第 9 部分**的本质，并将其用于最终的 `updating` 方案：

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/9/part-9-C.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/9/part-9-C.svg)

<em>9.4 第 9 部分本质 (点击查看大图)</em>

完成!


[下一节: 第 10 部分>>](./Part-10.md)

[<< 上一节: 第 8 部分](./Part-8.md)


[主页](./README.md)
