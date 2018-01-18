## 第 5 部分

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/5/part-5.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/5/part-5.svg)

<em>5.0 第 5 部分(点击查看大图)</em>

### 更新 DOM 属性

这图片看上去有点复杂？这里主要讲的是如何高效的把diff作用到新老 `props` 上。我们来看一下源码对这块的代码注释：

> 差分对比更新算法通过探测属性的差异并更新需要更新的 DOM。该方法可能是性能优化上唯一且极其重要的一环。

这个方法实际上有两个循环。第一个循环遍历前一个 `props`，后一个循环遍历下一个 `props`。在我们的挂载场景下，`lastProps` (前一个) 是空的。(很明显这是第一次给我们的 props 赋值)，但是我们还是来看看这里发生了什么。

### `lastprops` 循环
第一步，我们检查 `nextProps` 对象是不是包含相同的 prop 值，如果相等的话，我们就跳过那个值，因为它之后会在 `nextProps` 循环中处理。然后我们重置样式的值，删除事件监听器 (如果监听器之前设置过的话)，然后去除 DOM 属性名以及 DOM 属性值。对于属性们，只要我们确定它们不是 `RESERVED_PROPS` 中的一员，而是实际的 `prop`，例如 `children` 或者 `dangerouslySetInnerHTML`。

### `nextprops` 循环
该循环中，第一步检查 `prop` 是不是变化了，也就是检查下一个值是不是和老的值不同。如果相同，我们不做任何处理。对于 `styles`（你也许已经注意到我们会区别对待它）我们更新从`lastProp` 到现在变化的部分值。然后我们添加事件监听器(比如 `onClick` 等等)。让我们更深入的分析它。

其中很重要的一点是，纵观 React app，所有的工作都会传入一个名叫 `synthetic` 的事件。没有一个例外。它其实是一些封装器来优化效率的。下一个重要部分是我们处理事件监听器的中介控制模块 `EventPluginHub` (位于源码中`src\renderers\shared\stack\event\EventPluginHub.js`)。它包含一个 `listenerBank` 的映射来缓存并管控所有的监听器。我们准备好了添加我们自己的事件监听器，但是不是现在。这里的关键在于我们应该在组件和 DOM 元素已经准备好处理事件的时候才增加监听器。看上去在这里我们执行迟了。也你许会问，我们如何知道 DOM 已经准备好了？很好，这就引出了下一个问题！你是否还记得我们曾把 `transaction` 传递给每个方法和调用？这就对了，我们那样做就是因为在这种场景它可以很好的帮助我们。让我们从代码中寻找佐证：

```javascript
//src\renderers\dom\shared\ReactDOMComponent.js#222
transaction.getReactMountReady().enqueue(putListener, {
    inst: inst,
    registrationName: registrationName,
    listener: listener,
});
```

在处理完事件监听器，我们开始设置 DOM 属性名和 DOM 属性值。就像之前说的一样，对于属性们，我们确定他们不是 `RESERVED_PROPS` 中的一员，而是实际的 `prop`，例如 `children` 或者 `dangerouslySetInnerHTML`。

在处理前一个和下一个 props 的时候，我们会计算 `styleUpdates` 的配置并且现在把它传递给 `CSSPropertyOperations` 模块。

很好，我们已经完成了更新属性这一部分，让我们继续

### 好, 第 5 部分我们讲完了

我们来回顾一下我们学到的。我们再看一下这种模式，然后去掉冗余的部分：

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/5/part-5-A.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/5/part-5-A.svg)

<em>5.1 第 5 部分简化版 (点击查看大图)</em>

然后我们适当再调整一下：

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/5/part-5-B.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/5/part-5-B.svg)

<em>5.2 第 5 部分简化和重构 (点击查看大图)</em>

很好，实际上，下面的示意图就是我们所讲的。因此，我们可以理解**第 5 部分**的本质，并将其用于最终的 `mounting` 方案：

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/5/part-5-C.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/5/part-5-C.svg)

<em>5.3 第 5 部分 本质 (点击查看大图)</em>

完成!


[下一节: 第 6 部分>>](./Part-6.md)

[<< 上一节: 第 4 部分](./Part-4.md)


[主页](./README.md)
