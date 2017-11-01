## 第 13 部分

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/13/part-13.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/13/part-13.svg)

<em>13.0 第 13 部分（点击查看大图）</em>

### 接收组件（更精确的下一个元素）

通过 `ReactReconciler.receiveComponent`，React 实际上从 `ReactDOMComponent` 调用 `receiveComponent` 并传递给下一个元素。在 DOM 组件实例上重新分配并调用 update 方法。`updateComponent` 方法实际上主要是两步： 基于 `prev` 和 `next` 的属性，更新 DOM 属性和 DOM 元素的子节点。好在我们已经分析了 `_updateDOMProperties`(`src\renderers\dom\shared\ReactDOMComponent.js#946`) 方法。就像你记得的那样，这个方法大部分处理了 HTML 元素的属性和特质，计算样式以及处理事件监听等。剩下的就是 `_updateDOMChildren`(`src\renderers\dom\shared\ReactDOMComponent.js#1076`) 方法了。

### 好了，我们已经完成了*第 13 部分*。好短的一章。
让我们概括一下我们怎么到这里的。再看一下这张图，然后移除掉冗余的不那么重要的部分，它就变成了这样：

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/13/part-13-A.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/13/part-13-A.svg)

<em>13.1 第 13 部分 简化（点击查看大图）</em>

我们也应该尽可能的修改空格和对齐方式:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/13/part-13-B.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/13/part-13-B.svg)

<em>13.2 第 13 部分 简化和重构（点击查看大图）</em>

很好。实际上它就是这儿所发生的一切。我们可以从*第 13 部分*中获得基本价值，并将其用于最终的“更新”图表：

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/13/part-13-C.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/13/part-13-C.svg)

<em>13.3 第 13 部分本质（点击查看大图）</em>

完成！


[下一节：第 14 部分 >>](./Part-14.md)

[<< 上一节：第 12 部分](./Part-12.md)


[主页](./README.md)
