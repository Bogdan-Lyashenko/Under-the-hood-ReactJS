## 파트 7

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/7/part-7.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/7/part-7.svg)

<em>7.0 파트 7 (클릭 가능)</em>

### 처음으로 돌아가기

메소드 실행의 결과로 인한 마운팅 이후에 document에 세팅할 준비가 된 HTML 엘리먼트를 가질 수 있습니다. `mountComponent`에 의해 `markup`(1)이 생성되었지만, 이 `markup`(1)은 실제 HTML 마크업이 아닙니다. `children`, `node`(실제 DOM 노드)등의 필드를 가진 데이터 구조입니다. 그러나 컨테이너(`ReactDOM.render` 호출에서 컨테이너로 지정된)에 넣을 HTML 엘리먼트는 있습니다. 리엑트는 `markup`(1)를 DOM에 추가하는 동안 이전에 있던 모든 것을 지울것입니다. `DOMLazyTree`(2)는 트리 데이터 구조로 DOM 조작을 하는 중에 몇 가지 연산을 수행하는 util 클래스입니다.

마지막으로 볼건 `parentNode.insertBefore (tree.node)`(3)입니다. `parentNode`는 컨테이너`div` 노드이고 `tree.node`는 `ExampleAppliication` div 노드입니다. 마운팅 중 생성된 HTML 엘리먼트는 마침내 document에 삽입되었습니다.

이게 끝일까요? 그렇지 않습니다. 기억하고 있듯이, 래핑된 `mount` 호출은 트랜잭션에 안에 있습니다. 그렇다면 우리는 그걸 클로즈해야 한다는 것을 의미합니다. `close` 래퍼 리스트를 확인해 봅시다. 락을 해놓은 `ReactInputSelection.restoreSelection()`, `ReactBrowserEventEmitter.setEnabled(previousEnabled)`를 복원하고, 이전에 `transaction.reactMountReady`대기열에 넣은 모든 콜백을 `this.reactMountReady.notifyAll`(4)로 알려야 할 것입니다. 그 중 하나는 우리가 가장 잘 알고있는 `componentDidMount`이며, 이는 `close` 래퍼에 의해 트리거 될 것입니다.

이제 '컴포넌트가 실제로 마운팅 된 것'에 대한 명확한 그림을 얻었습니다. 건배!

### 트랜젝션 클로즈 한번 더

사실, 트랜젝션은 하나만 있는게 아닙니다. `ReactMount.batchedMountComponentIntoNode` 호출을 래핑하는데 사용 된 트랜젝션을 잊고 있었습니다. 그것을 클로즈 하도록 합시다.

여기에서는 `dirtyComponents`를 처리하는 `ReactUpdates.flushBatchedUpdates`(5) 래퍼를 검사합니다. 흥미롭지 않은가요? 좋든 나쁘든, 우리는 처음 마운트를 했으므로 dirty components가 아직 없습니다. 그것은 빈 호출을 의미합니다. 따라서 이 트랜잭션 또한 클로즈하고 batching strategy updates가 완료되었다고 말할 수 있습니다.

### 좋습니다, 이제 우리는 *파트 7*를 끝냈습니다.

우리가 어떻게 여기까지 왔는지 다시 한번 살펴보도록 합시다. 스키마에서 덜 중요한 부분을 제거하면 다음과 같습니다.

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/7/part-7-A.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/7/part-7-A.svg)

<em>7.1 간단히 보는 파트 7 (클릭 가능)</em>

공백제거와 정렬을 통해 보기 좋게 수정했습니다.

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/7/part-7-B.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/7/part-7-B.svg)

<em>7.2 간단히 보는 파트 7 리펙토링 버전 (클릭 가능)</em>

좋습니다. 사실, 이것이 여기서 일어나는 일 전부입니다. 이제 *파트 7*의 핵심들을 가지고 최종 `mounting` 스키마에 사용할 수 있습니다.

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/7/part-7-C.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/7/part-7-C.svg)

<em>7.3 파트 7의 핵심 (클릭 가능)</em>

우리는 해냈습니다! 사실 우리는 마운팅을 끝냈습니다. 아래를 보십시오.

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/7/mounting-parts-C.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/7/mounting-parts-C.svg)

<em>7.4 마운팅 (클릭 가능)</em>

[다음 페이지 : 파트 8 >>](./Part-8.md)

[<< 이전 페이지 : 파트 6](./Part-6.md)


[홈](../../README.md)
