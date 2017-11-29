## 파트 9

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/9/part-9.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/9/part-9.svg)

<em>9.0 파트 9 (클릭 가능)</em>

### 다시 돌아가봅시다.

스키마에서도 알 수 있듯, 조금 더 정확히 말하자면 `setState`메소드의 호출은 여러 가지 방법으로, 외부 영향(‘user action’을 의미)이 있을때나 없을때나 실행될 수 있습니다. 두 가지 경우를 생각해 봅시다. 첫 번째는 메서드 호출이 마우스 클릭에 의해 발생되는 경우이고, 두 번째는 `componentDidMount`에서 `setTimeout`이 호출되는 경우입니다.

차이점은 무엇일까요? 리엑트는 업데이트를 `batches`로 처리하는데, 그것은 업데이트 목록을 어떻게든 수집하고 `flushed`해야 함을 의미합니다. 마우스 이벤트가 발생되면, 최상위 레벨에서 해당 이벤트가 처리되고, 여러 레이어의 래퍼를 통해 일괄 업데이트가 시작됩니다. 스키마에서 볼 수 있듯이 `ReactEventListener`가 `enabled`(1) 일 때만 발생하는데, 컴포넌트 마운팅 단계에서는, `ReactReconcileTransaction` 래퍼 중 하나가 그 `ReactEventListener`를 비활성화해서, 안전하게 마운팅 할 수 있게 합니다. 그렇다면 `setTimeout case`는 어떨까요? 이것 또한 간단합니다. `dirtyComponents`리스트에 컴포넌트를 넣기 전에, 리엑트는 트랜잭션이 시작(opened)되었는지 확인한 후에 클로즈하고 업데이트를 플러시 해야합니다.

아시다시피, 리엑트는 ‘synthetic events’를 구현합니다. 사실 ‘syntax sugar’는 네이트브 이벤트를 래핑하고 있습니다. 그러나 그들은 여전히 우리 모두가 이벤트를 보던 방식대로 행동하려고 합니다. 코드에서 주석을 확인 할 수 있습니다.
> '개발을 돕기 위해 실제 브라우저 이벤트를 시뮬레이트하여 좀 더 나은 통합 개발 도구를 얻을 수 있습니다.'

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
좋습니다. 업데이트를 한번 더 확인해 봅시다. 다음과 같습니다.

1. setState 호출
2. 트랜잭션이 아직 오픈(시작)되지 안았다면, batching 트렌젝션 열기(시작)
3. `dirtyComponents`리스트에 영향받은 컴포넌트 추가
4. `ReactUpdates.flushBatchedUpdates`를 호출해서 트랜잭션을 클로즈하고, 실제로 `dirtyComponents`에 수집된 내용을 처리한다는 것을 의미.

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/9/set-state-update-start.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/9/set-state-update-start.svg)

<em>9.1 `setState` 시작 (클릭 가능)</em>

### 좋습니다, 이제 우리는 *파트 9*를 끝냈습니다.

우리가 어떻게 여기까지 왔는지 다시 한번 살펴보도록 합시다. 스키마에서 덜 중요한 부분을 제거하면 다음과 같습니다.

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/9/part-9-A.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/9/part-9-A.svg)

<em>9.2 간단히 보는 파트 9 (클릭 가능)</em>

공백제거와 정렬을 통해 보기 좋게 수정했습니다.

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/9/part-9-B.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/9/part-9-B.svg)

<em>9.3 간단히 보는 파트 9 리펙토링 버전 (클릭 가능)</em>

좋습니다. 사실, 이것이 여기서 일어나는 일 전부입니다. 이제 *파트 9*의 핵심들을 가지고 최종 `updating` 스키마에 사용할 수 있습니다.

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/9/part-9-C.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/9/part-9-C.svg)

<em>9.6 파트 9의 핵심 (클릭 가능)</em>

우리는 해냈습니다!


[다음 페이지 : 파트 10 >>](./Part-10.md)

[<< 이전 페이지 : 파트 8](./Part-8.md)


[홈](../../README.md)
