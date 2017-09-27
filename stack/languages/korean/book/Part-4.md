## 파트 4

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/4/part-4.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/4/part-4.svg)

<em>4.0 파트 4 (클릭 가능)</em>

### 자식 마운팅

계속해서 `mount` 메소드를 알아보도록 합시다.

`_tag`에 video, form, textarea 등과 같은 '복잡한' 태그(1)가 포함되어 있으면 추가 래핑이 필요합니다. `audio` 태그를 위한 'volumechange' 같이 각각의 미디어 이벤트에 대한 이벤트 리스너를 추가하거나 `select`, `textarea` 등에는 태그의 기본 동작을 래핑합니다.
`ReactDOMSelect`, `ReactDOMTextarea`(src\renderers\dom\client\wrappers\ 폴더 내부)과 같은 엘리먼트를 위한 래퍼가 많이 있습니다. 지금의 경우는 단지 `div`이고, 추가 처리는 없습니다.

### Props 유효성 검사

다음으로, 유효성 검사 메서드는 단지 내부 `props`가 올바르게 설정되었는지를 확인하기 위해 호출됩니다. 설정이 잘 안되어 있으면 오류가 발생합니다. 예를 들어 `props.dangerouslySetInnerHTML`가 설정(보통 문자열에서 HTML을 삽입하려고 할 때 그렇게합니다)되고 객체 키 `__html`이 누락되면 다음과 같은 오류가 발생합니다.

> `props.dangerouslySetInnerHTML` must be in the form `{__html: ...}`.  Please visit https://fb.me/react-invariant-dangerously-set-inner-html for more information.

### HTML 엘리먼트 생성 

`div`를 인스턴스화를 하는 `document.createElement`에 의해 실제 HTML 엘리먼트가 생성됩니다(3). 이전에 우리는 가상 표현(VDOM)으로만 작업했지만 이제는 처음으로 실제 HTML을 볼 수 있게 되었습니다.


### 좋습니다, 이제 우리는 *파트 4*를 끝냈습니다.

우리가 어떻게 여기까지 왔는지 다시 한번 살펴보도록 합시다. 스키마에서 덜 중요한 부분을 제거하면 다음과 같습니다.

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/4/part-4-A.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/4/part-4-A.svg)

<em>4.1 간단히 보는 파트 4 (클릭 가능)</em>

공백제거와 정렬을 통해 보기 좋게 수정했습니다.

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/4/part-4-B.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/4/part-4-B.svg)

<em>4.2 간단히 보는 파트 4 리펙토링 버전 (클릭 가능)</em>

좋습니다. 사실, 이것이 여기서 일어나는 일 전부입니다. 이제 *파트 4*의 핵심들을 가지고 최종 `mounting` 스키마에 사용할 수 있습니다.

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/4/part-4-C.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/4/part-4-C.svg)

<em>4.3 파트 4의 핵심 (클릭 가능)</em>

우리는 해냈습니다!


[다음 페이지 : 파트 5 >>](./Part-5.md)

[<< 이전 페이지 : 파트 3](./Part-3.md)


[홈](../../README.md)
