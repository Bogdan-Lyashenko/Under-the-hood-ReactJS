## 파트 8

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/8/part-8.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/8/part-8.svg)

<em>8.0 파트 8 (클릭 가능)</em>

### `this.setState`

우리는 이제 마운팅이 어떻게 작동하는지 알고 있으니, 다른 파트도 알아보도록 합시다. 바로, `setState`메소드 입니다!

`setState`메소드를 호출할 수 있는 이유는 무엇일까요? 그건 분명, `ReactComponent`로 부터 컴포넌트를 상속받았기 때문입니다. 그렇다면 이제 리엑트 소스코드에서 이 클래스를 찾아 `setState`메소드를 확인하는 것은 쉽습니다.

```javascript
// src\isomorphic\modern\class\ReactComponent.js #68
this.updater.enqueueSetState(this, partialState)
```
보시다시피, 여기 `updater` 인터페이스가 있습니다. `updater`란 뭔가요? 우리가 방금 분석 한 마운팅 프로세스를 확인해보면, `mountComponent` 하는 동안, 인스턴스는 `ReactUpdateQueue`(`src\renderers\shared\stack\reconciler\ReactUpdateQueue.js`)를 참조하는 `updater` property를 받습니다.

`enqueueSetState`(1) 메소드 안으로 들어가서 봅시다. 우선 부분상태(partial state: `this.setState`에 전달하는 객체)를 내부 인스턴스 `_pendingStateQueue`(2)로 푸시합니다.(되집어 봅시다: public 인스턴스는 실제로 커스텀 컴포넌트인 `ExampleApplication`이고, 내부 인스턴스는 마운트 중에 생성 된 `ReactCompositeComponent`입니다.). 다음엔, `enqueueUpdate` 입니다. 실제로 진행중인 업데이트가 있다면 컴포넌트를 `dirtyComponents`리스트에 넣고, 그렇지 않다면 - update transaction 초기화 하고, `dirtyComponents`리스트에 컴포넌트를 넣습니다.

요약하자면, 각 컴포넌트는 자신의 보류 상태(pending states)의 목록을 가지고 있습니다. 즉, 하나의 트랜잭션에서 `setState`를 호출 할 때마다 그 객체를 대기열에 넣은 다음 나중에 하나씩 컴포넌트 상태(state)로 머지합니다. 그리고 `setState`를 호출하면, 컴포넌트를 `dirtyComponents`리스트에 추가 됩니다. 아마 `dirtyComponents`가 어떻게 처리되는지 궁금할것입니다. 맞습니다. 그것이 이 프로세스 중요한 부분입니다.

### 좋습니다, 이제 우리는 *파트 8*를 끝냈습니다.

우리가 어떻게 여기까지 왔는지 다시 한번 살펴보도록 합시다. 스키마에서 덜 중요한 부분을 제거하면 다음과 같습니다.

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/8/part-8-A.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/8/part-8-A.svg)

<em>8.1 간단히 보는 파트 8 (클릭 가능)</em>

공백제거와 정렬을 통해 보기 좋게 수정했습니다.

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/8/part-8-B.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/8/part-8-B.svg)

<em>8.2 간단히 보는 파트 8 리펙토링 버전 (클릭 가능)</em>

좋습니다. 사실, 이것이 여기서 일어나는 일 전부입니다. 이제 *파트 8*의 핵심들을 가지고 최종 `updating` 스키마에 사용할 수 있습니다.

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/8/part-8-C.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/8/part-8-C.svg)

<em>8.3 파트 8의 핵심 (클릭 가능)</em>

우리는 해냈습니다!


[다음 페이지 : 파트 9 >>](./Part-9.md)

[<< 이전 페이지 : 파트 7](./Part-7.md)


[홈](../../README.md)
