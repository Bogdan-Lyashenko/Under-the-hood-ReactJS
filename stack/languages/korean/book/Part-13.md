## 파트 13

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/13/part-13.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/13/part-13.svg)

<em>13.0 파트 13 (클릭 가능)</em>

### Receive component(다음 엘리먼트, 보다 정확하게)

`ReactReconciler.receiveComponent`를 통해 리엑트는 실제로 `ReactDOMComponent`에서 `receiveComponent`를 호출하고 그곳에서 다음 엘리먼트를 전달합니다. DOM 컴포넌트 인스턴스에 다음 엘리먼트를 다시 할당하고 update 메소드를 호출합니다. `updateComponent` 메소드는 실제로 `prev`와 `next` props를 기반으로 DOM properties와 DOM 자식을 업데이트하는 두 가지 주요 동작을 수행합니다. 우리는 이미 `_updateDOMProperties`(`src\renderers\dom\shared\ReactDOMComponent.js #946`)메소드를 분석했습니다. 이 메소드는 주로 HTML 요소의 properties와 attributes을 처리하고, 스타일을 계산하며, 이벤트 리스너를 처리합니다. 이제 남은 것은 `_updateDOMChildren`(`src\renderers\dom\shared\ReactDOMComponent.js #1076`)입니다.

### 좋습니다, 이제 우리는 *파트 13*를 끝냈습니다. 정말 짧았네요.

우리가 어떻게 여기까지 왔는지 다시 한번 살펴보도록 합시다. 스키마를 한번 더 보시고, 덜 중요한 부분을 제거하면 다음과 같습니다.

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/13/part-13-A.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/13/part-13-A.svg)

<em>13.1 간단히 보는 파트 13 (클릭 가능)</em>

공백을 처리하고 정렬을 통해 더 좋게 수정했습니다:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/13/part-13-B.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/13/part-13-B.svg)

<em>13.2 간단히 보는 파트 13 리펙토링 버전 (클릭 가능)</em>

좋습니다. 사실, 이것이 여기서 일어나는 일 전부입니다. 이제 *파트 13*의 핵심들을 가지고 최종 `updating` 스키마에 사용할 수 있습니다.

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/13/part-13-C.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/13/part-13-C.svg)

<em>13.3 파트 13의 핵심 (클릭 가능)</em>

우리는 해냈습니다!


[다음 페이지 : 파트 14 >>](./Part-14.md)

[<< 이전 페이지 : 파트 12](./Part-12.md)


[홈](../../README.md)
