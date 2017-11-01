## 第 3 部分

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/3/part-3.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/3/part-3.svg)

<em>3.0 第 3 部分 (点击查看大图)</em>

### 挂载

`componentMount` 方法是我们整个系列中极其重要的一个部分。如图，我们关注 `ReactCompositeComponent.mountComponent` (1) 方法。

如果你还记得，我曾提到过 **组件树的入口组件** 是 `TopLevelWrapper` 组件 (React 底层内部类)。我们准备挂载它。由于它实际上是一个空的包装器，调试起来非常枯燥并且对实际的流程而言没有任何影响，所以我们跳过这个组件从他的孩子组件开始分析。

把组件挂载到组件树上的过程就是先挂载父亲组件，然后他的孩子组件，然后他的孩子的孩子组件，依次类推。可以肯定，当 `TopLevelWrapper` 挂载后，他的孩子组件 (用来管理 `ExampleApplication` 的组件 `ReactCompositeComponent`) 也会在同一阶段注入。

现在我们回到步骤 (1) 观察这个方法的内部实现，有一些重要行为会发生，接下来让我们深入研究这些重要行为。

### 给实例赋值 updater

从 `transaction.getUpdateQueue()` 方法返回的 `updater` 见图中(2)， 实际上就是 `ReactUpdateQueue` 模块。 为什么要在这里赋值一个 `updater` 呢？因为我们正在研究的类 `ReactCompositeComponent` 是一个全平台的共用的类，但是 `updater` 却依赖于平台环境有不同的实现，所以我们在这里根据不同的平台动态的将它赋值给实例。

然而，我们现在并不马上需要这个 `updater`，但是你要记住它是非常重要的，因为它很快就会应用于非常知名的组件内更新方法 **`setState`**。

事实上在这个过程中，不仅仅 `updater` 被赋值给实例，组件实例（你的自定义组件）也获得了继承的 `props`, `context`, 和 `refs`。

观察以下的代码:

```javascript
// \src\renderers\shared\stack\reconciler\ReactCompositeComponent.js#255
// 这些应该在构造方法里赋值，但是为了
// 使类的抽象更简单，我们在它之后赋值。
inst.props = publicProps;
inst.context = publicContext;
inst.refs = emptyObject;
inst.updater = updateQueue;
```

因此，你才可以通过一个实例从你的代码中获得 `props`，比如 `this.props`。

### 创建 ExampleApplication 实例

通过调用步骤 (3) 的方法  `_constructComponent` 然后经过几个构造方法的作用后，最终创建了 `new ExampleApplication()`。这就是我们代码中构造方法第一次被执行的时机，当然也是我们的代码第一次实际接触到 React 的生态系统，很棒。

### 执行首次挂载

接着我们研究步骤 (4)，第一个即将发生的行为是 `componentWillMount`(当然仅当它被定义时) 的调用。这是我们遇到的第一个生命周期钩子函数。当然，在下面一点你会看到 `componentDidMount` 函数, 只不过这时由于它不能马上执行，而是被注入了一个事务队列中，在很后面执行。他会在挂载系列操作执行完毕后执行。当然你也可能在 `componentWillMount` 内部调用 `setState`，在这种情况下 `state` 会被重新计算但此时不会调用 `render`。(这是合理的，因为这时候组件还没有被挂载)

官方文档的解释也证明这一点:

> `componentWillMount()` 在挂载执行之前执行，他会在 `render()` 之前被调用，因此在这个过程中设置组件状态不会触发重绘。

观察以下的代码，进一步验证：

```javascript
// \src\renderers\shared\stack\reconciler\ReactCompositeComponent.js#476
if (inst.componentWillMount) {
    //..
    inst.componentWillMount();

    // 当挂载时, 在 `componentWillMount` 中调用的 `setState` 会执行并改变状态
    // `this._pendingStateQueue` 不会触发重渲染
    if (this._pendingStateQueue) {
        inst.state = this._processPendingState(inst.props, inst.context);
    }
}
```

确实如此，但是当 state 被重新计算完成后，会调用我们在组件中申明的 render 方法。再一次接触 “我们的” 代码。

接下来下一步就会创建一个 React 的组件的实例。然后呢？我们已经看见过步骤 (5) `this._instantiateReactComponent` 的调用了，对吗？是的。在那个时候它为我们的 `ExampleApplication` 组件实例化了 `ReactCompositeComponent`，现在我们准备基于它的 `render` 方法获得的元素作为它的孩子创建 VDOM (虚拟 DOM) 实例。在我们的例子中，`render` 方法返回了一个`div`，所以准确的 VDOM 元素是一个`ReactDOMElement`。当该实例被创建后，我们会再次调用 `ReactReconciler.mountComponent`，但是这次我们传入刚刚新创建的 `ReactDOMComponent` 实例作为`internalInstance`。

然后继续调用此类中的 `mountComponent` 方法，这样递归往下...

### 好，**第 3 部分**我们讲完了

我们来回顾一下我们学到的。我们再看一下这种模式，然后去掉冗余的部分：

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/3/part-3-A.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/3/part-3-A.svg)

<em>3.1 第 3 部分简化版 (点击查看大图)</em>

让我们适度在调整一下:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/3/part-3-B.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/3/part-3-B.svg)

<em>3.2 第 3 部分简化和重构 (点击查看大图)</em>

很好，实际上，下面的示意图就是我们所讲的。因此，我们可以理解**第 3 部分**的本质，并将其用于最终的 `mount` 方案：

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/3/part-3-C.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/3/part-3-C.svg)

<em>3.3 第 3 部分本质 (点击查看大图)</em>

完成!


[下一节: 第 4 部分 >>](./Part-4.md)

[<< 上一节: 第 2 部分](./Part-2.md)


[主页](./README.md)
