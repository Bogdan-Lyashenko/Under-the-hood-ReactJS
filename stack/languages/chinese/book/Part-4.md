## 第 4 部分

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/4/part-4.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/4/part-4.svg)

<em>4.0 第 4 部分 (点击查看大图)</em>

### 子元素挂载

已经入迷了对吗? 让我们接续研究 `mount` 方法。

如果步骤 (1) 的 `_tag` 包含一个复杂的标签，比如 `video`、`form`、 `textarea` 等等，这些就需要更进一步的封装，对每个媒体事件需要绑上更多事件监听器，比如给 `audio` 标签增加 `volumechange` 事件监听，或者像 `select`、`textarea` 等标签只需要封装一些浏览器原生行为。

我们有很多封装器干这事，比如 `ReactDOMSelect` 和 `ReactDOMTextarea` 位于源码 (src\renderers\dom\client\wrappers\folder) 中。本文例子中只有简单的 `div` 标签。

### Props 验证

接下来要讲解的验证方法是为了确保内部 `props` 被设置正确，不然它就会抛出异常。举个例子，如果设置了 `props.dangerouslySetInnerHTML` (经常在我们需要基于一个字符串插入 HTML 时使用)，但是它的对象健值 `__html` 忘记设置，那么将会抛出下面的异常：

> `props.dangerouslySetInnerHTML` must be in the form `{__html: ...}`.  Please visit https://fb.me/react-invariant-dangerously-set-inner-html for more information.
>
> (`props.dangerouslySetInnerHTML` 必须符合 `{__html: ...}`的形式)

### 创建 HTML 元素

接着， `document.createElement` 方法会创建真实的 HTML 元素，实例出真实的 HTML `div`，在这一步之前我们只能用虚拟的表现形式表达，而现在你第一次能实际看到它了。

### 好，**第 4 部分**我们讲完了

我们来回顾一下我们学到的。我们再看一下这种模式，然后去掉冗余的部分：

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/4/part-4-A.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/4/part-4-A.svg)

<em>4.1 第 4 部分简化版 (点击查看大图)</em>

让我们适度在调整一下：

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/4/part-4-B.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/4/part-4-B.svg)

<em>4.2 第 4 部分简化和重构 (点击查看大图)</em>

很好，实际上，下面的示意图就是我们所讲的。因此，我们可以理解**第 4 部分**的本质，并将其用于最终的 `mount` 方案：

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/4/part-4-C.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/4/part-4-C.svg)

<em>4.3 *第 4 部分本质 (点击查看大图)*</em>

完成！


[下一节: 第 5 部分>>](./Part-5.md)

[<< 上一节: 第 3 部分](./Part-3.md)


[主页](./README.md)
