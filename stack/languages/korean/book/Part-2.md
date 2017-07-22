## 파트 2

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/2/part-2.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/2/part-2.svg)

<em>2.0 파트 2 (클릭 가능)</em>

### 또 하나의 트랜젝션

이제는 `ReactReconcileTransaction`를 알아볼 시간입니다. 이미 알고 있겠지만, 중요한 것은 트랜잭션 래퍼는 우리에게 매우 흥미롭다는 것입니다. 여기 3개의 래퍼가 있습니다.

```javascript
// \src\renderers\dom\client\ReactReconcileTransaction.js #89
var TRANSACTION_WRAPPERS = [
  SELECTION_RESTORATION, // 선택 복구
  EVENT_SUPPRESSION,     // 이벤트 억제
  ON_DOM_READY_QUEUEING, // DOM 준비 대기열
];
```

보이는 것처럼 래퍼는 주로 **실제 상태**를 유지하며, 메소드 호출 전에 변경 가능한 값을 락하고, 이후에 릴리즈 하는데 사용됩니다. 따라서 리엑트는 트랜잭션을 수행하여 선택 범위(현재 선택한 텍스트 입력)가 방해받지 않도록합니다.(`initialize`에서 선택하고 `close`에서 복원). 또한, DOM에서 높은 수준의 DOM 조작(마치 일시적으로 DOM에서 텍스트 입력을 제거하는 것)으로 인해 실수로 발생 될 수 있는 이벤트(blur/focus)를 억제하므로 **`ReactBrowserEventEmitter`를 사용하지 않도록** `initialize` 할 때 설정하고, `close`할때 사용하도록 설정합니다.


컴포넌트 마운트까지 거의 다 왔습니다. 이제는 DOM에 넣을 준비가 된 마크업을 리턴 해야합니다. 실제로 `ReactReconciler.mountComponent`는 래퍼일 뿐이며, ‘중재인(mediator)’라고 말하는것이 더 정확합니다. 이건 컴포넌트 모듈로 메소드 마운팅을 위임합니다. 이건 정말 중요하니까 강조하도록 하겠습니다.


> `ReactReconciler` 모듈은 어떤 로직의 구현이 **플랫폼에 의존**하는 경우 항상 호출됩니다. 마운트는 플랫폼마다 다르므로 `ReactReconciler` 및 `ReactReconciler`에 대한 '메인 모듈'은 다음에 수행 할 작업을 알고 있습니다.


이제는 컴포넌트 메소드인 `mountComponent`로 넘어가봅시다. 아마 이미 들어본적이 있는 메소드 일겁니다. 이건 컴포넌트를 초기화하고, 마크업을 렌더링하며, 이벤트 리스너를 등록합니다. 보세요, 우리는 먼길을 지나 마침내 컴포넌트 마운팅을 호출을 앞두고 있습니다. 마운팅을 호출한 후에는, 실제 document에 넣을 수있는 실제 HTML 엘리먼트를 가져와야합니다.



### 좋습니다, 이제 우리는 *파트 2*를 끝냈습니다.


우리가 어떻게 여기까지 왔는지 다시 한번 살펴보도록 합시다. 스키마를 한번 더 보시고, 덜 중요한 부분을 제거하면 다음과 같습니다.


[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/2/part-2-A.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/2/part-2-A.svg)


<em>2.1 간단히 보는 파트 2 (클릭 가능)</em>


공백을 처리하고 정렬을 통해 더 좋게 수정했습니다:


[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/2/part-2-B.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/2/part-2-B.svg)


<em>2.2 간단히 보는 파트 2 리펙토링 버전 (클릭 가능)</em>


좋습니다. 사실, 이것이 여기서 일어나는 일 전부입니다. 이제 *파트 6*에서 필수 가치를 취할 수 있고 그것을 최종 `mounting` 스키마에 사용할 수 있습니다.


[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/2/part-2-C.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/2/part-2-C.svg)


<em>2.3 파트 2의 필수 가치 (클릭 가능)</em>


우리는 해냈습니다!


[다음 페이지 : 파트 3 >>](./Part-3.md)

[<< 이전 페이지 : 파트 1](./Part-1.md)


[홈](../../README.md)
