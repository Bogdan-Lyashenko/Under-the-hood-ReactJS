## 파트 5

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/5/part-5.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/5/part-5.svg)

<em>5.0 파트 5 (클릭 가능)</em>

### DOM properties 업데이트

무서워 보이죠? 위의 스키마의 핵심은 이전과 새로운 `props`의 diff를 효율적으로 적용하고 있다는 것입니다. 코드에서 메소드에 달린 주석을 살펴보십시오.
> "property 값들의 차이점을 감지하고 필요하다면 DOM을 업데이트하여 properties를 조정한다. 이 함수는 성능 최적화를 위한 가장 중요한 단일경로이다."

여기에는 두 개의 루프가 있습니다. 이전 `props` 통하는 것과 다음 `props`를 통하는 것입니다. 우리의 경우 마운트에서 `lastProps`(이전)는 비어 있습니다(처음으로 props를 할당하기 때문에). 여기에서 무슨 일이 일어나는지 보도록 하겠습니다.

### 이전 `props` 루프
첫 번째 단계에서 우리는 `nextProps`가 같은 prop 값을 가졌는지 확인합니다. 만약 그렇다면 `nextProps` 루프에서 나중에 처리될 것이므로 그냥 건너뜁니다. 그런 다음 스타일 값을 재설정하고, 이벤트 리스너(이전에 설정 한 경우)를 삭제하고, DOM attribute 와 DOM properties 값을 제거합니다. attribute 의 경우, `RESERVED_PROPS`가 아니라 `children` 또는 `dangerouslySetInnerHTML`과 같은 실제 `prop`인지 확인합니다.

### 다음 `props` 루프
여기서는 가장 먼저 `prop`가 변경되었는지 즉, 다음 값이 이전 값과 다른지 확인합니다. 그렇지 않다면, 아무 것도 하지 않습니다. `styles`의 경우 (스타일은 조금 특별하게 취급되는 것을 눈치챘을 것입니다.) `lastProp` 이후에 변경된 값들을 업데이트합니다. 그후 이벤트 리스너를 추가합니다(예를 들어,`onClick` 과 같은 것들). 자세한 내용을 분석해 봅시다.

리엑트에서는 모든 작업이 ‘결합(synthetic)’이라는 이벤트를 통과한다는 것이 중요합니다. 좀 더 효율적인 작업을 위한 래퍼일 뿐, 별로 특별할 건 없습니다. 다음으로, 이벤트 리스너를 관리하기 위한 중재인(mediator) 모듈은 `EventPluginHub` (`src\renderers\shared\stack\event\EventPluginHub.js`)입니다. 이것은 모든 리스너를 캐싱하고 관리하기 위한 `listenerBank` 맵을 포함합니다.
이벤트 리스너를 추가 할 예정이지만 지금 하지는 않습니다. 핵심은 컴포넌트와 DOM 엘리먼트가 이벤트를 처리 할 준비가 되었을 때 리스너를 추가해야한다는 것입니다. 준비된 시점을 어떻게 알수 있는지 궁금하고, 이 부분이 실행을 지연시키는 것처럼 보이지만 모든 메소드와 호출들을 `transaction`에 전달했던것을 기억하고 계십니까? 이러한 상황을 위해 그렇게했었습니다. 코드에서 그 증거를 봅시다.

```javascript
// src\renderers\dom\shared\ReactDOMComponent.js #222
transaction.getReactMountReady().enqueue(putListener, {
    inst: inst,
    registrationName: registrationName,
    listener: listener,
});
```

이벤트 리스너를 추가한 후에 DOM attribute과 DOM property 값을 설정합니다. 이전과 마찬가지로 attributes가 `RESERVED_PROPS` 가 아니고, `children`, `dangerouslySetInnerHTML`와 같은 실제 `prop`인지 확인합니다.

마지막으로 다음 props을 처리하는 동안 `styleUpdates` 설정을 계산하고 그것을 `CSSPropertyOperations` 모듈에 전달합니다.

이제 properties 업데이트를 마쳤습니다. 계속 가보도록 합시다.

### 좋습니다, 이제 우리는 *파트 5*를 끝냈습니다.

우리가 어떻게 여기까지 왔는지 다시 한번 살펴보도록 합시다. 스키마에서 덜 중요한 부분을 제거하면 다음과 같습니다.

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/5/part-5-A.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/5/part-5-A.svg)

<em>5.1 간단히 보는 파트 5 (클릭 가능)</em>

공백제거와 정렬을 통해 보기 좋게 수정했습니다.

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/5/part-5-B.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/5/part-5-B.svg)

<em>5.2 간단히 보는 파트 5 리펙토링 버전 (클릭 가능)</em>

좋습니다. 사실, 이것이 여기서 일어나는 일 전부입니다. 이제 *파트 5*의 핵심들을 가지고 최종 `mounting` 스키마에 사용할 수 있습니다.

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/5/part-5-C.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/5/part-5-C.svg)

<em>5.3 파트 5의 핵심 (클릭 가능)</em>

우리는 해냈습니다!


[다음 페이지 : 파트 6 >>](./Part-6.md)

[<< 이전 페이지 : 파트 4](./Part-4.md)


[홈](../../README.md)
