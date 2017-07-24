## 파트 9

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/9/part-9.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/9/part-9.svg)

<em>9.0 파트 9 (클릭 가능)</em>

### 하지만 다시 돌아갑시다.

스키마에서도 알 수 있듯, `setState`메소드의 호출은 여러 가지 방법으로, 보다 정확하게, 외부 충격(‘user action’을 의미)과 함께 또는 없이도 실행될 수 있습니다. 두 가지 경우를 생각해 봅시다. 첫 번째는 메서드 호출이 마우스 클릭에 의해 발생되는 경우이고, 두 번째로는 `componentDidMount`에서 `setTimeout`을 호출되는 경우입니다.

차이점은 무엇입니까? 리엑트 프로세스 업데이트를 `batches`로 처리하면, 업데이트 목록을 어떻게든 수집하고 `flushed`해야 함을 의미합니다. 문제는 마우스 이벤트가 나타나면 최상위 레벨에서 처리되고 여러 레이어의 래퍼를 통해 일괄(batched) 업데이트가 시작된다는 것입니다. 어쨌든, 그건 `ReactEventListener`가 `enabled`(1) 일 때만 발생하고, 컴포넌트 마운팅 단계에서 `ReactReconcileTransaction` 래퍼 중 하나가 비활성화 되어서 안전하게 마운팅합니다. 그렇다면 `setTimeout case`는 어떨까요? 이것 또한 간단합니다. `dirtyComponents`리스트에 컴포넌를 넣기 전에, 리엑트는 트랜잭션이 시작(opened)되었는지 확인한 후에 클로즈하고 업데이트를 플러시 해야합니다.

알다시피, 리엑트는 ‘syntetic events’를 구현합니다. ‘syntax sugar’ 실제로 네이트 이벤트를 처리합니다. 그러나 그들은 여전히 우리 모두가 이벤트를 보던 방식대로 행동하려고 합니다. 코드에서 주석을 불 수 있습니다.
> '개발을 돕기 위해 실제 브라우저 이벤트를 시뮬레이트하여 개발자 도구 통합을 향상시킬 수 있습니다.'

```javascript
var fakeNode = document.createElement('react');

ReactErrorUtils.invokeGuardedCallback = function (name, func, a) {
      var boundFunc = func.bind(null, a);
      var evtType = 'react-' + name;

      fakeNode.addEventListener(evtType, boundFunc, false);

      var evt = document.createEvent('Event');
      evt.initEvent(evtType, false, false);

      fakeNode.dispatchEvent(evt);
      fakeNode.removeEventListener(evtType, boundFunc, false);
};
```
좋습니다. 업데이트로 돌아가서 한번 더 봅시다. 다음과 같습니다.

1. setState 호출
2. 트랜잭션이 아직 오픈되지 않았을때 일괄(batching) 트렌젝션 열기
3. `dirtyComponents`리스트에 양향받은 컴포넌트 추가
4. close 트랜잭션을 `ReactUpdates.flushBatchedUpdates`라고 부르며, 실제로 `dirtyComponents`에 수집된 내용을 처리한다는 것을 의미.

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/9/set-state-update-start.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/9/set-state-update-start.svg)

<em>9.1 `setState` 시작 (클릭 가능)</em>

### 좋습니다, 이제 우리는 *파트 9*를 끝냈습니다.

우리가 어떻게 여기까지 왔는지 다시 한번 살펴보도록 합시다. 스키마를 한번 더 보시고, 덜 중요한 부분을 제거하면 다음과 같습니다.

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/9/part-9-A.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/9/part-9-A.svg)

<em>9.2 간단히 보는 파트 9 (클릭 가능)</em>

공백을 처리하고 정렬을 통해 더 좋게 수정했습니다:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/9/part-9-B.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/9/part-9-B.svg)

<em>9.3 간단히 보는 파트 9 리펙토링 버전 (클릭 가능)</em>

좋습니다. 사실, 이것이 여기서 일어나는 일 전부입니다. 이제 *파트 9*에서 필수 가치를 취할 수 있고 그것을 최종 `updating` 스키마에 사용할 수 있습니다.

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/9/part-9-C.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/9/part-9-C.svg)

<em>9.6 파트 9의 필수 가치 (클릭 가능)</em>

우리는 해냈습니다!


[다음 페이지 : 파트 10 >>](./Part-10.md)

[<< 이전 페이지 : 파트 8](./Part-8.md)


[홈](../../README.md)
