## 第 0 部分

[![图 0-0](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/0/part-0.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/0/part-0.svg)



### ReactDOM.render
让我们从 ReactDOM.render 的调用开始。

入口点是 ReactDom.render，我们的应用程序是从这里开始渲染到 DOM 中的。为了方便调试，我创建了一个简单的 `<ExampleApplication />` 组件。因此，发生的第一件事就是 **JSX 会被转换成 React 元素(element)**。它们是简单的、直白的对象。具有简单的结构。它们仅仅展示从本组件渲染中返回的内容，没有其他了。一些字段应该是你已经熟悉的，像 props、key 和 ref。属性类型是指由 JSX 描述的标记对象。所以，在我们的例子中，它就是 `ExampleApplication` 类，但是它也可以仅仅是 Button 标签的 `button` 字符串等其他类。另外，在 React 组件创建过程中，它会将 `defaultProps` 与 `props` 合并（如果显式声明了），并验证 `propTypes`。

更多详细信息可参考源码：`src\isomorphic\classic\element\ReactElement.js`。

### ReactMount
你可以看到一个叫做 `ReactMount`（01）的模块。它包含组件挂载的逻辑。实际上，在 `ReactDOM` 里面没有逻辑，它只是一个与`ReactMount` 一起使用的接口，所以当你调用 `ReactDOM.render` 的时候，实际上调用了 `ReactMount.render`。那“挂载”指的是什么呢？
> 挂载是初始化 React 组件的过程。该过程通过创建组件所代表的 DOM 元素，并将它们插入到提供的 `container` 中来实现。

至少源码中的注释是这样描述的。那这真实的含义是什么呢？好吧，让我们想象一下下方的转换：


[![图 0-1 JSX 到 HTML](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/0/mounting-scheme-1-small.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/0/mounting-scheme-1-small.svg)



React 需要**将你的组件描述转换为 HTML** 以将其放入到 DOM 中。那怎样才能做到呢？没错，它需要处理所有的**属性、事件监听、内嵌的组件**和逻辑。它需要将你的高阶描述（组件）转换成实际可以放入到网页中的低阶数据（HTML）。这就是真正的挂载过程。


[![图 0-2 JXS 到 HTML 2](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/0/mounting-scheme-1-big.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/0/mounting-scheme-1-big.svg)



让我们继续深入下去。接下来是有趣的事实时间！是的，让我们在探索过程中添加一些有趣的东西，让它变得更“有趣”。

> 有趣的事实：确保滚动正在监听（02）

> 有趣的是，在第一次渲染根组件时，React 初始化滚动监听并缓存滚动值，以便应用程序代码可以访问它们而不触发重排。实际上，由于浏览器渲染机制的不同，一些 DOM 值不是静态的，因此每次在代码中使用它们时都会进行计算。当然，这会影响性能。事实上，这只影响了不支持`pageX` 和 `pageY` 的旧版浏览器。React 也试图优化这一点。可以看到，制作一个运行快速的工具需要使用很多技术，这个滚动就是一个很好的例子。

### 实例化 React 组件

看下流程图，在图中（03）处标明了一个创建的实例。在这里创建一个 `<ExampleApplication />` 的实例还为时过早。实际上该处实例化了 `TopLevelWrapper`（一个 React 内部的类）。让我们先来看看下面这个流程图。

[![图 0-3 JSX 到 虚拟 DOM](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/0/jsx-to-vdom.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/0/jsx-to-vdom.svg)



你可以看到有三个部分，JSX 会被转换为 React 内部三种组件类型中的一种：`ReactCompositeComponent`（我们自定义的组件），`ReactDOMComponent`（HTML 标签）和 `ReactDOMTextComponent`（文本节点）。我们将略过描述`ReactDOMTextComponent` 并将重点放在前两个。

内部组件？这很有趣。你已经听说过 **虚拟 DOM** 了吧？虚拟 DOM 是一种 DOM 的表现形式。 React 用虚拟 DOM 进行组件差异计算等过程。该过程中无需直接操作 DOM 。这使得 React 在更新视图时候更快。但在 React 的源码中没有名为“Virtual DOM”的文件或者类。这是因为 虚拟DOM 只是一个概念，一种如何操作真实 DOM 的方法。所以，有些人说 虚拟DOM 元素等同于 React 组件，但在我看来，这并不完全正确。我认为虚拟 DOM 指的是这三个类：`ReactCompositeComponent`、`ReactDOMComponent` 和 `ReactDOMTextComponent`。后面你会知道到为什么。

好了，让我们在这里完成实例化过程。我们将创建一个 `ReactCompositeComponent` 实例，但实际上这并不是因为我们把`<ExampleApplication />` 放在了 `ReactDOM.render` 里。React 总是从 `TopLevelWrapper` 开始渲染一棵组件的树。它几乎是一个空的包装器，其 `render` 方法（组件的 render）随后将返回 `<ExampleApplication />`。
```javascript
//src\renderers\dom\client\ReactMount.js#277
TopLevelWrapper.prototype.render = function () {
  return this.props.child;
};

```

所以，目前为止只有 `TopLevelWrapper` 被创建了。但是……先看一下一个有趣的事实。
> 有趣的事实：验证 DOM 内嵌套

> 几乎每次内嵌的组件渲染时，都被一个专门用于进行 HTML 验证的 `validateDOMNesting` 模块验证。DOM 内嵌验证指的是 `子标签 -> 父标签` 的标签层级的验证。例如，如果父标签是 `<select>`，则子标签应该是以下其中一个标签：`option`、`optgroup` 或者 `＃text`。这些规则实际上是在 <https://html.spec.whatwg.org/multipage/syntax.html#parsing-main-electlect> 中定义的。你可能已经看到过这个模块是如何工作的，它像这样报错：
<em> &lt;div&gt; cannot appear as a descendant of &lt;p&gt; </em>.


### 小结

让我们回顾一下上面的内容。再看一下流程图，然后删除多余的不太重要的部分，变成下面这样：

[![图 0-4 简述](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/0/part-0-A.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/0/part-0-A.svg)



再调整一下间距和对齐：

[![图 0-5 简述和调整](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/0/part-0-B.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/0/part-0-B.svg)



实际上，这就是本部分的所有内容。因此，我们可以从 **第 0 部分** 中得到重点，并将它用于最终的 `mounting` 流程中：

[![图 0-6 重点](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/0/part-0-C.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/0/part-0-C.svg)



完成了！


[下一页：第 1 部分 >>](./Part-1.md)

[<< 上一页：介绍](./Intro.md)


[首页](./README.md)
