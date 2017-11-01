## 介绍

### 初识流程图


[![](https://github.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/raw/master/stack/images/intro/all-page-stack-reconciler-25-scale.jpg)](https://github.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/raw/master/stack/images/intro/all-page-stack-reconciler-25-scale.svg)

图 介绍-0：整体流程

你可以先花点时间看下整体的流程。虽然看起来很复杂，但它实际上只描述了两个流程：(组件的)挂载和更新。我跳过了卸载，因为它是一种“反向挂载”，而且删除这部分简化了流程图。另外，**这图并不是100%** 同源代码匹配，而只是描述架构的主要部分。总体来说，它大概是源代码的 60%，而另外的 40% 没有多少视觉价值，为了简单起见，我省略了那部分。

乍一看，你可能会注意到流程图中有很多颜色。每个逻辑项（流程图上的形状）都以其父模块的颜色高亮显示。例如，如果是从红色的 `模块 B` 调用 `方法 A`，那 `方法 A` 也是红色的。以下是流程图中模块的图例以及每个文件的路径。

[![图 介绍-1：模块颜色](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/7c2372e1/stack/images/intro/modules-src-path.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/7c2372e1/stack/images/intro/modules-src-path.svg)



让我们把它们放在一张流程图中，看看**模块之间的依赖关系**。

[![图 介绍-2 模块依赖关系](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/7c2372e1/stack/images/intro/files-scheme.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/7c2372e1/stack/images/intro/files-scheme.svg)



你可能知道，React 是为**支持多种环境**而构建的。
- 移动端（**ReactNative**）
- 浏览器（**ReactDOM**）
- 服务端渲染
- **ReactART**（使用 React 绘制矢量图形）
- 其它

因此，一些文件实际上比上面流程图中列出的要更大。以下是包含多环境支持的相同的流程图。

[![介绍 图-3 多平台模块依赖关系](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/7c2372e1/stack/images/intro/modules-per-platform-scheme.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/7c2372e1/stack/images/intro/modules-per-platform-scheme.svg)



如你所见，有些项似乎翻倍了。这表明它们对每个平台都有一个独立的实现。让我们来看一些简单例子，例如 ReactEventListener，显然，不同平台会有不同的实现。从技术上讲，你可以想象，这些依赖于平台的模块，应该以某种方式注入或连接到当前的逻辑流程中。实际上有很多这样的注入器，因为它们的用法是标准组合模式的一部分。同样，为了简单起见，我选择忽略它们。

让我们来学习下**常规浏览器**中 **React DOM** 的逻辑流程。这是最常用的平台，并完全覆盖了所有 React 的架构设计理念。


### 代码示例

学习框架或者库的源码的最佳方式是什么？没错，研读并调试源码。那好，我们将要调试这**两个流程**：**ReactDOM.render** 和 **component.setState** 这两者对应了组件的挂载和更新。让我们来看一下我们能编写一些什么样的代码来开始学习。我们需要什么呢？或许几个具有简单渲染的小组件就可以了，因为更容易调试。

```javascript
class ChildCmp extends React.Component {
    render() {
        return <div> {this.props.childMessage} </div>
    }
}

class ExampleApplication extends React.Component {
    constructor(props) {
        super(props);
        this.state = {message: 'no message'};
    }

    componentWillMount() {
        //...
    }

    componentDidMount() {
        /* setTimeout(()=> {
            this.setState({ message: 'timeout state message' });
        }, 1000); */
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return true;
    }

    componentDidUpdate(prevProps, prevState, prevContext) {
        //...
    }

    componentWillReceiveProps(nextProps) {
        //...
    }

    componentWillUnmount() {
        //...
    }

    onClickHandler() {
        /* this.setState({ message: 'click state message' }); */
    }

    render() {
        return <div>
            <button onClick={this.onClickHandler.bind(this)}> set state button </button>
            <ChildCmp childMessage={this.state.message} />
            And some text as well!
        </div>
    }
}

ReactDOM.render(
    <ExampleApplication hello={'world'} />,
    document.getElementById('container'),
    function() {}
);
```

我们已经准备好开始学习了。让我们先来分析流程图中的第一部分。一个接一个，我们会将它们全部分析完。

[下一页：Part 0 >>](./Part-0.md)


[首页](./README.md)
