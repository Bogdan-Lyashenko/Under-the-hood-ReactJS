## 파트 10

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/10/part-10.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/10/part-10.svg)

<em>10.0 파트 10 (클릭 가능)</em>

### Dirty components

보시다시피, 리엑트는 `dirtyComponents`(1)를 통해 루프를 수행하고, 트랜잭션을 통해 `ReactUpdates.runBatchedUpdates`(2)를 호출합니다. 또 하나의 새로운 트랜잭션이네요? 한번 살펴 보겠습니다.

트랜잭션의 타입은 `ReactUpdatesFlushTransaction`이며, 앞서 언급했듯이 트랜잭션이 실제로 무엇을 하는지 이해하기 위해서는 `wrappers`를 체크해봐야합니다. 코드의 주석에 힌트가 있습니다.
> 'ReactUpdatesFlushTransaction의 래퍼는 dirtyComponents 배열을 지우고, 마운트 핸들러(예: componentDidUpdate)가 대기열에 추가 한 모든 업데이트를 수행합니다.'

그렇다면, 실제로 한번 확인해 봅시다. 여기에, 두 개의 래퍼 `NESTED_UPDATES`와 `UPDATE_QUEUEING`가 있습니다. `initialize` 단계에서 우리는 `dirtyComponentsLength`(3)'를 저장하고, `close`에서 검증할 수 있습니다. (리엑트는`initialize`에서 저장한 `dirtyComponentsLength`와 현재 `dirtyComponentsLength`를 비교합니다.) 업데이트 중에 플러시 된 dirty 컴포넌트의 수(dirtyComponentsLength)가 변경됬기 때문에, `flushBatchedUpdates`실행이 한 번 더 필요합니다. 보시다시피, 마법도 없고, 모든 것이 꽤 간단합니다.

음 .. 사실 한 번의 마법의 순간이 있습니다. `ReactUpdatesFlushTransaction`는 `Transaction.perform`메소드를 오버라이드합니다. 왜냐하면, 실제로는 `ReactReconcileTransaction`(트랜잭션은 마운트 중에 사용되며 앱 상태를 안전하게 유지할 수 있습니다.)의 동작이 필요하기 때문입니다. `ReactUpdatesFlushTransaction.perform` 메소드 내부에서 `ReactReconcileTransaction`도 사용되기 때문에, 실제로 트랜잭션 메소드가 한 번 더 래핑됩니다.

따라서, 기술적으로는, 다음과 같습니다:

```javascript
[NESTED_UPDATES, UPDATE_QUEUEING].initialize()
[SELECTION_RESTORATION, EVENT_SUPPRESSION, ON_DOM_READY_QUEUEING].initialize()

method -> ReactUpdates.runBatchedUpdates

[SELECTION_RESTORATION, EVENT_SUPPRESSION, ON_DOM_READY_QUEUEING].close()
[NESTED_UPDATES, UPDATE_QUEUEING].close()
```
마지막으로 이것이 메소드 작업을 끝내는데 어떻게 도움이되는지 다시 한번 확인하기 위해 트랜잭션으로 돌아가지만, 이제는 `ReactUpdates.runBatchedUpdates`(2)(`\src\renderers\shared\stack\reconciler\ReactUpdates.js #125`)의 세부 사항을 보도록하겠습니다.

우리가 처음부터해야 할 일은 `dirtyComponets`배열(4)을 정렬하는 것입니다. 어떻게 정렬을 할까요? `mount order`(인스턴스 마운트시 컴포넌트에 정수가 설정 됨)는 부모(먼저 마운트 된 것)가 먼저 업데이트되고, 다음으로 자식들이 업데이트된다는 것을 의미합니다. 다음 단계는 `updateBatchNumber`를 증가시키는 것입니다. 이건 현재 조정(reconciling)을 위한 ID와 같습니다. 코드의 주석에 따르면:

> '조정하는 동안 대기열에 추가 된 모든 업데이트는 전체 일괄처리 이후에 수행되어야합니다. 그렇지 않으면, dirtyComponents가 [A, B]일때, A가 자식 B와 C를 갖는 경우, C의 렌더가 B(B가 이미 업데이트 되었으므로 이를 건너 뛰어야하며, 우리가 알 수있는 유일한 방법은 배치 카운터를 확인하는 것입니다.)에 대한 업데이트를 대기열에 넣으면 B는 단일 배치에서 두 번 업데이트 될 수 있습니다'

이건 실제로 동일한 컴포넌트에 대한 이중 업데이트를 피하는 데 도움이됩니다.

마지막으로 `dirtyComponents`를 루프 돌면서 각 컴포넌트를 `ReactReconciler.performUpdateIfNecessary`(5)로 전달합니다. 실제로 `performUpdateIfNecessary`메소드가 `ReactCompositeComponent`인스턴스에서 호출 될 것이므로 `ReactCompositeComponent` 코드와 그것의 메소드인 `updateComponent`로 이동하겠습니다. 여기서 흥미로운 것을 발견 할 수 있습니다. 이제 더 깊이 들어가 봅시다.

### 좋습니다, 이제 우리는 *파트 10*를 끝냈습니다.

우리가 어떻게 여기까지 왔는지 다시 한번 살펴보도록 합시다. 스키마에서 덜 중요한 부분을 제거하면 다음과 같습니다.

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/10/part-10-A.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/10/part-10-A.svg)

<em>10.1 간단히 보는 파트 10 (클릭 가능)</em>

공백을 처리하고 정렬을 통해 더 좋게 수정했습니다:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/10/part-10-B.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/10/part-10-B.svg)

<em>10.2 간단히 보는 파트 10 리펙토링 버전 (클릭 가능)</em>

좋습니다. 사실, 이것이 여기서 일어나는 일 전부입니다. 이제 *파트 10*의 핵심들을 가지고 최종 `mounting` 스키마에 사용할 수 있습니다.

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/10/part-10-C.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/10/part-10-C.svg)

<em>10.3 파트 10의 핵심 (클릭 가능)</em>

우리는 해냈습니다!


[다음 페이지 : 파트 11 >>](./Part-11.md)

[<< 이전 페이지 : 파트 9](./Part-9.md)


[홈](../../README.md)
