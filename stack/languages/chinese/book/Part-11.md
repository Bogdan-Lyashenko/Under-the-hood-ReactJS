## 第 11 部分

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/11/part-11.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/11/part-11.svg)

<em>11.0 第 11 部分(点击查看大图)</em>

### 更新组件方法

源码中的注释是这样介绍这个方法的：

>对一个已经挂载后的组件执行再更新操作的时候，`componentWillReceiveProps` 以及 `shouldComponentUpdate` 方法会被调用，然后 (假定这个更新有效) 调用其他更新中其余的生命周期钩子方法，并且需要变化的 DOM 也会被更新。默认情况下这个过程会使用 React 的渲染和差分对比更新算法。对于一些复杂的实现，客户可能希望重写这步骤。

很好… 听起来很合理。

首先我们会去检查步骤 (1) 的 `props` 是否改变了，原理上讲，`updateComponent` 方法会在 setState 方法被调用或者 props 变化这两种情况下使用。如果 `props` 确实改变了，那么生命周期函数`componentWillReceiveProps` 就会被执行. 接着, React 会根据 `pending state queue` (指我们之前设置的`partialState` 队列，现在可能形如 [{ message: "click state message" }]) 重新计算步骤 (2) 的 `nextState`。当然在只有 props 更新的情况下， state 是不会受到影响的。

很好，下一步，我们把 `shouldUpdate` 初始化为步骤 (3) 的 `true`。这里可以看出即使`shouldComponentUpdate` 没有申明，组件也会按照此默认行为更新。然后检查一下 `force update `的状态，因为我们也可以在组件里调用`forceUpdate` 方法，不管`state` 和`props`是不是变化，都强制更新。当然，React 的官方文档不推荐这样的实践。在使用 `forceUpdate` 的情况下，组件将会被持久化的更新，否则，`shouldUpdate` 将会是 `shouldComponentUpdate` 的返回结果。如果 `shouldUpdate` 为否，组件不应该更新时，React 依然会设置新的 `props` and `state`, 不过会跳过更新的余下部分。

### 好, 第 11 部分我们讲完了

我们来回顾一下我们学到的。我们再看一下这种模式，然后去掉冗余的部分：

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/11/part-11-A.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/11/part-11-A.svg)

<em>11.1 第 11 部分简化版 (点击查看大图)</em>

然后我们适当再调整一下：

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/11/part-11-B.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/11/part-11-B.svg)

<em>11.2 第 11 部分简化和重构 (点击查看大图)</em>

很好，实际上，下面的示意图就是我们所讲的。因此，我们可以理解**第 11 部分**的本质，并将其用于最终的 `updating` 方案：

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/11/part-11-C.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/11/part-11-C.svg)

<em>11.3 第 11 部分本质 (点击查看大图)</em>

完成!


[下一节: 第 12 部分>>](./Part-12.md)

[<< 上一节: 第 10 部分](./Part-10.md)


[主页](./README.md)
