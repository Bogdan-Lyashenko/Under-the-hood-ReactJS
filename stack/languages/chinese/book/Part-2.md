## 第二部分

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/2/part-2.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/2/part-2.svg)

<em>2.0 第二部分</em>

### 另一个事务

这次我们将讨论 `ReactReconcileTransaction`事务。正如你所知道的，对我们来说主要感兴趣的是事务包装器。其中包括三个包装器：

```javascript
//\src\renderers\dom\client\ReactReconcileTransaction.js#89
var TRANSACTION_WRAPPERS = [
  SELECTION_RESTORATION,
  EVENT_SUPPRESSION,
  ON_DOM_READY_QUEUEING,
];
```

我们可以看到，这些包装器主要用来 *保留实际状态*，React 将确保在事务的方法调用之前锁住某些可变值，调用完后再释放它们。举个例子，范围选择（输入当前选择的文本）不会被事务的方法执行干扰（在 `initialize` 时选中并在 `close` 时恢复）。此外，它阻止因为高级 DOM 操作（例如，临时从 DOM 中移除文本）而无意间触发的事件（例如模糊/选中焦点），React在 `initialize` 时 *暂时禁用 `ReactBrowserEventEmitter`* 并在事务执行到 `close` 时重新启用。

到这里，我们已经非常接近组件的挂载了，挂载将会把我们准备好的（HTML）标记插入到 DOM 中。实际上，`ReactReconciler.mountComponent` 只是一个包装，更准确的说，它是一个中介者。它将代理组件模块的挂载方法。这是一个重要的部分，画个重点。

> 在实现某些和平台相关的逻辑时，`ReactReconciler` 模块总是会被调用，例如这个确切的例子。挂载过程在每个平台上都是不同的，所以 “主模块” 会询问 `ReactReconciler`，`ReactReconciler` 知道下一步应该怎么做。

好的，让我们将目光移到组件方法 `mountComponent` 上。这可能是你已经听说过的方法了。它初始化组件，渲染标记以及注册事件监听函数。你看，千辛万苦我们终于看到了调用组件加载。调用加载之后，我们应该可以得到可以插入到文档中的 HTML 元素了。


### 我们完成了 *第二部分*


让我们回顾一下这一部分，我们再一次流程图，然后删除一些不重要的信息，它将变成这样：

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/2/part-2-A.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/2/part-2-A.svg)

<em>2.1 第二部分 简化</em>

让我们优化一下排版：

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/2/part-2-B.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/2/part-2-B.svg)

<em>2.2 第二部分 简化与重构</em>

很好，其实这就是这一部分所发生的一切。我们可以从 *第一部分* 中取下必要的信息，然后完善 `mounting`（挂载） 的流程图：

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/2/part-2-C.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/2/part-2-C.svg)

<em>2.3 第二部分 必要信息</em>

完成啦！

[下一页：第三部分 >>](./Part-3.md)

[<< 上一页：第一部分](./Part-1.md)

[首页](./README.md)
