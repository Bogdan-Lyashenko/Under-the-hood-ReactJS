## 파트 4

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/4/part-4.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/4/part-4.svg)

<em>4.0 파트 4 (클릭 가능)</em>

### 자식 마운팅

`mount` 메소드를 계속 알아보도록 합시다.

`_tag`에 video, form, textarea 등과 같은 'complex'태그(1)가 포함되어 있으면 추가 래핑이 필요합니다. `audio` 태그의 'volumechange'와 같은 이벤트에 대한 이벤트 리스너를 추가하거나 `select`, `textarea`와 같은 태그의 기본 동작을 래핑합니다.
`ReactDOMSelect`, `ReactDOMTextarea`(src\renderers\dom\client\wrappers\ 폴더 내부)과 같은 엘리먼트를 위한 래퍼가 있습니다. 이 경우는 단지 `div`이고, 추가 처리는 없습니다.

### Props 유효성 검사

유효성 검사 메서드는 내부 `props`가 올바르게 설정되었는지 확인하기 위해 호출됩니다. 그렇지 않으면 오류가 발생합니다. 예를 들어 `props.dangerouslySetInnerHTML`가 설정(대개 우리는 문자열에서 HTML을 삽입하려고 할 때 그렇게합니다)되고 객체 키 `__html`가 누락되면 다음 오류가 발생합니다 :

> `props.dangerouslySetInnerHTML`는 `{__html : ...}`형식이어야 합니다. 자세한 내용은 https://fb.me/react-invariant-dangerously-set-inner-html에서 확인하십시오.

### HTML 엘리먼트 생성 

그런 다음 실제 HTML 엘리먼트는 `document.createElement`에 의해 생성됩니다(3). 그러면 실제 HTML `div`가 인스턴스화됩니다. 이전에 우리는 가상 표현으로만 작업했지만 이제는 처음으로 그것을 볼 수 있게 되었습니다.


### 좋습니다, 이제 우리는 *파트 4*를 끝냈습니다.

우리가 어떻게 여기에 왔는지 다시 한번 살펴보도록 합시다. 스키마를 한번 더 보시고 덜 중요한 부분을 제거하면 다음과 같습니다:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/4/part-4-A.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/4/part-4-A.svg)

<em>4.1 간단히 보는 파트 4 (클릭 가능)</em>

우리는 공백하고 정렬 부분도 고쳐야 할것 같습니다:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/4/part-4-B.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/4/part-4-B.svg)

<em>4.2 간단히 보는 파트 4 리펙토링 버전 (클릭 가능)</em>

멋집니다. 사실 이게 여기서 일어나는 일 전부 입니다. 이제 우리는 *파트 4*에서 필수적인 가치를 취할 수 있고 그것을 최종 mounting 스키마로 사용할 수 있습니다:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/4/part-4-C.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/4/part-4-C.svg)

<em>4.3 파트 4 필수 가치 (클릭 가능)</em>

그리고 이제 우리는 해냈습니다!


[다음 페이지 : 파트 5 >>](./Part-5.md)

[<< 이전 페이지 : 파트 3](./Part-3.md)


[홈](../../README.md)
