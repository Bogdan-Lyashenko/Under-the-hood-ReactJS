## 第 12 部分

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/12/part-12.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/12/part-12.svg)

<em>12.0 第 12 部分(点击查看大图)</em>

### 当组件确实需要更新...

现在我们已经到更新行为的开始点，此时应该先调用步骤 (1) 的 `componentWillUpdate` (当然必须声明过) 的生命周期钩子。然后重绘组件并且把另一个知名的方法 `componentDidUpdate` 的调用压入队列 (推迟是因为它应该在更新操作结束后执行)。那怎么重绘呢？实际上这时候会调用组件的 render 方法，并且相应的更新 DOM。所以第一步，调用实例 (`ExampleApplication`) 中步骤 (2) 的 `render` 方法, 并且存储更新的结果 (这里会返回 React 元素)。然后我们会和之前已经渲染的元素对比并决策出哪些 DOM 应该被更新。

这个部分是 React 杀手级别的功能，它避免冗余的 DOM 更新，只更新我们需要的部分以提高性能。

我们来看源码对步骤 (3) 的 `shouldUpdateReactComponent` 方法的注释：

> 决定现有实例的更新是部分更新，还是被移除还是被一个新的实例替换

因此，通俗点讲，这个方法会检测这个元素是否应该被彻底的替换, 在彻底替换掉情况下，旧的部分需要先被 `unmounted`(卸载），然后从 `render` 获取的新的部分应该被挂载，然后把挂载后获得的元素替换现有的。这个方法还会检测是否一个元素可以被部分更新。彻底替换元素的主要条件是当一个新的元素是空元素 (意即被 render 逻辑移除了)。或者它的标签不同，比如原先是一个 `div`，然而是现在是其它的标签了。让我们来看以下代码，表达的非常清晰。

```javascript
///src/renderers/shared/shared/shouldUpdateReactComponent.js#25

function shouldUpdateReactComponent(prevElement, nextElement) {
    var prevEmpty = prevElement === null || prevElement === false;
    var nextEmpty = nextElement === null || nextElement === false;
    if (prevEmpty || nextEmpty) {
        return prevEmpty === nextEmpty;
    }

    var prevType = typeof prevElement;
    var nextType = typeof nextElement;
    if (prevType === 'string' || prevType === 'number') {
        return (nextType === 'string' || nextType === 'number');
    } else {
        return (
            nextType === 'object' &&
            prevElement.type === nextElement.type &&
            prevElement.key === nextElement.key
        );
    }
}
```

很好，实际上我们的 `ExampleApplication` 实例仅仅更新了 state 属性，并没有怎么影响 `render`。到现在我们可以进入下一个场景，`update` 后的反应。

### 好, 第 12 部分我们讲完了

我们来回顾一下我们学到的。我们再看一下这种模式，然后去掉冗余的部分：

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/12/part-12-A.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/12/part-12-A.svg)

<em>*第 12 部分简化版 (点击查看大图)*</em>

然后我们适当再调整一下：

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/12/part-12-B.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/12/part-12-B.svg)

<em>12.2 第 12 部分简化和重构 (点击查看大图)</em>

很好，实际上，下面的示意图就是我们所讲的。因此，我们可以理解**第 12 部分**的本质，并将其用于最终的 `updating` 方案：

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/12/part-12-C.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/12/part-12-C.svg)

<em>12.3 第 12 部分本质 (点击查看大图)</em>

完成!


[下一节: 第 13 部分>>](./Part-13.md)

[<< 上一节: 第 11 部分](./Part-11.md)


[主页](./README.md)
