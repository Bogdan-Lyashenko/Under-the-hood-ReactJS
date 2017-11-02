## 第 6 部分

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/6/part-6.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/6/part-6.svg)

<em>6.0 第 6 部分（点击查看大图）</em>

### 创建最初的子组件

好像组件本身已经创建完成了，现在我们可以继续创建它的子组件了。这个分为以下两步：（1）子组件应该由（`this.mountChildren`）加载，（2）并与它的父级通过（`DOMLazyTree.queueChild`）连接。我们来讨论一下子组件的挂载。

有一个单独的 `ReactMultiChild` (`src\renderers\shared\stack\reconciler\ReactMultiChild.js`) 模块来操作子组件。我们来查看一下 `mountChildren` 方法。它包括两个主要任务。首先我们初始化子组件（使用 `ReactChildReconciler`）并加载他们。这里到底是什么子组件呢？它可能是一个简单的 HTML 标签或者一个其他自定义的组件。为了处理 HTML，我们需要初始化 `ReactDOMComponent`，对于自定义组件，我们使用 `ReactCompositeComponent`。加载流程也是依赖于子组件是什么类型。

### 再一次

如果你还在阅读这篇文章，那么现在可能是再一次阐述和整理整个过程的时候了。现在我们休息一下，重新整理下对象的顺序。

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/6/overall-mounting-scheme.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/6/overall-mounting-scheme.svg)

<em>6.1 所有加载图示（点击查看大图）</em>

1) 在React 中使用 `ReactCompositeComponent` 实例化你的自定义组件（通过使用像`componentWillMount` 这类的组件生命周期钩子）并加载它。

2) 在加载过程中，首先会创建一个你自定义组件的实例（调用`构造器`函数）。

3) 然后，调用该组件的渲染函数（举个简单的例子，渲染返回的 `div`）并且 `React.createElement` 来创建 React 元素。它可以直接被调用或者通过Babel解析JSX后来替换渲染中的标签。但是，它可能不是我们所需要的，看看接下来是什么。

4) 我们对于 `div` 需要一个 DOM 组件。所以，在实例化过程中，我们从元素-对象（上文提到过）出发创建 `ReactDOMComponent` 的实例。

5) 然后，我们需要加载 DOM 组件。这实际上就意味者我们创建 DOM 元素，并加载了事件监听等。

6) 然后，我们处理我们的DOM组件的直接子组件。我们创建它们的实例并且加载它们。根据子组件的是什么(自定义组件或只是HTML标签)，我们分别跳转到步骤1）或步骤5）。然后再一次处理所有的内嵌元素。

加载过程就是这个。就像你看到的一样非常直接。

加载基本完成。下一步是 `componentDidMount` 方法。大功告成。

### 好的，我们已经完成了*第 6 部分*

让我们概括一下我们怎么到这里的。再一次看一下示例图，然后移除掉冗余的不那么重要的部分，它就变成了这样：

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/6/part-6-A.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/6/part-6-A.svg)

<em>6.2 第 6 部分 简化（点击查看大图）</em>

我们也应该尽可能的修改空格和对齐方式:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/6/part-6-B.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/6/part-6-B.svg)

<em>6.3 第 6 部分 简化和重构（点击查看大图）</em>

很好。实际上它就是这儿所发生的一切。我们可以从*第 6 部分*中获得基本精髓，并将其用于最终的“加载”图表：

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/6/part-6-C.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/6/part-6-C.svg)

<em>6.4 第 6 部分本质 (点击查看大图)</em>

完成！


[下一节：第 7 部分 >>](./Part-7.md)

[<< 上一节：第 5 部分](./Part-5.md)


[主页](./README.md)
