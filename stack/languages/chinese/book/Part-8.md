## 第 8 部分

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/8/part-8.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/8/part-8.svg)

<em>8.0 Part 8 (点击查看大图)</em>

### `this.setState`

我们已经学习了挂载的工作原理，现在从另一个角度来学习。嗯，比如 `setState` 方法，其实也很简单。

首先，为什么我们可以在自己的组件中调用 `setState` 方法呢？很明显我们的组件继承自 `ReactComponent`，这个类我们可以很方便的在 React 源码中找到。

```javascript
//src\isomorphic\modern\class\ReactComponent.js#68
this.updater.enqueueSetState(this, partialState)
```
我们发现，这里有一些 `updater` 接口。什么是 `updater` 呢？在讲解挂载过程时我们讲过，在 `mountComponent` 过程中，实例会接受一个 `ReactUpdateQueue`(`src\renderers\shared\stack\reconciler\ReactUpdateQueue.js`) 的引用作为 `updater` 属性。

很好，我们现在深入研究步骤 (1) 的 `enqueueSetState`。首先，它会往步骤 (2) 的 `_pendingStateQueue` (来自于内部实例。注意，这里我们说的外部实例是指用户的组件 `ExampleApplication`，而内部实例则挂载过程中创建的 `ReactCompositeComponent`) 注入 `partialState` (这里的 `partialState` 就是指给 `this.setState` 传递的对象)。然后，执行 `enqueueUpdate`，这个过程会检查更新是否已经在进展中，如果是则把我们的组件注入到 `dirtyComponents` 列表中，如果不是则先初始化打开更新事务，然后把组件注入到 `dirtyComponents` 列表。

总结一下，每个组件都有自己的一组处于等待的”状态“的列表，当你在一次事务中调用 `setState` 方法，其实只是把那个状态对象注入一个队列里，它会在之后一个一个依次被合并到组件 `state` 中。调用此`setState`方法同时，你的组件也会被添加进 `dirtyComponents` 列表。也许你很好奇 `dirtyComponents` 是如何工作的，这就是另一个研究重点。

### 好, 第 8 部分我们讲完了

我们来回顾一下我们学到的。我们再看一下这种模式，然后去掉冗余的部分：

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/8/part-8-A.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/8/part-8-A.svg)

<em>8.1 第 8 部分简化版 (点击查看大图)</em>

让我们适度在调整一下：

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/8/part-8-B.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/8/part-8-B.svg)

<em>8.2 第 8 部分简化和重构 (点击查看大图)</em>

很好，实际上，下面的示意图就是我们所讲的。因此，我们可以理解**第 8 部分**的本质，并将其用于最终的 `updating` 方案：

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/8/part-8-C.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/8/part-8-C.svg)

<em>8.3 Part 8 本质 (点击查看大图)</em>

完成!


[下一节: 第 9 部分>>](./Part-9.md)

[<< 上一节: 第 7 部分](./Part-7.md)


[主页](./README.md)
