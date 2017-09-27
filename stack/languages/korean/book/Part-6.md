## 파트 6

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/6/part-6.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/6/part-6.svg)

<em>6.0 파트 6 (클릭 가능)</em>

### 초기 자식(children) 생성

이제 엘리먼트가 완성된 것처럼 보입니다, 이제 자식들과 함께할 수 있습니다. 여기 두 단계가 있습니다. 자식들은 (`this.mountChildren`)(1)에 마운트 되어야 하고, 부모(`DOMLazyTree.queueChild`)(2)에 연결되어야 합니다. 자식들의 마운팅이 분명히 더 재미있을 것이기 때문에 그쪽으로 이동해 봅시다.

자식들을 관리하기 위한 `ReactMultiChild` (`src\renderers\shared\stack\reconciler\ReactMultiChild.js`)라 별도의 모듈이 있습니다. 이제 `mountChildren` 메소드를 확인해 봅시다. 여기에는 두 가지 주요 작업이 포함됩니다. 우선, 자식들을 인스턴스화하고(이를 위해 `ReactChildReconciler`를 사용) 그들을 마운트합니다. 실제로 어떤 자식들이 여기에 있을까요? 그건 단순한 HTML 태그이거나 다른 커스텀 컴포넌트 일 수 있습니다. HTML을 처리하기 위해 `ReactDOMComponent`를 인스턴스화하고 커스텀 컴포넌트를 위해서는 `ReactCompositeComponent`를 인스턴스화해야 합니다. 다시 말하자면, 마운트 흐름(flow)은 하위 유형(type)이 무엇인지에 따라 달라집니다.

### 다시 한번 더 봅시다.

만약 당신이 이 글을 아직 읽고 있다면, 아마도 전체 프로세스를 한 번 더 명확히 검토해야 할 때입니다. 객체의 순서를 되새겨 봅시다.

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/6/overall-mounting-scheme.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/6/overall-mounting-scheme.svg)

<em>6.1 전반적인 마운팅 스키마 (클릭 가능)</em>

1) 리엑트는 각각의 커스텀 컴포넌트(`componentWillMount` 등과 같은 컴포넌트 라이프 사이클 훅을 포함한)를 위해 `ReactCompositeComponent`를 인스턴스화하고 마운트합니다.

2) 마운트하는 과정 중에 가장 먼저 커스텀 컴포넌트의 인스턴스가 생성됩니다.(`constructor`가 호출 됨).

3) 그런 다음 render 메소드가 호출되고(간단한 예를 들면, render는 `div`를 리턴합니다), `React.createElement`는 리엑트 요소를 만듭니다. 리엑트 요소는 직접 호출 되거나, JSX가 Babel에 의해 파싱된 후에 호출 될 수 있고, 랜더시 태그를 대체(replacing) 할 수도 있지만 이러한 부분들은 현재 필요로하는 것이 아닙니다. 아래의 내용을보십시오. 

4) `div`위한 DOM 컴포넌트가 필요합니다. 그래서 인스턴스화 과정에서 엘리먼트 객체(위에서 언급한)로부터 `ReactDOMComponent`의 인스턴스를 생성합니다. 

5) 그런 다음 DOM 컴포넌트를 마운트해야합니다. 이는 실제로 DOM 엘리먼트를 만들고 이벤트 리스너등을 할당한다는 것을 의미합니다.

6) 이제, DOM 컴포넌트의 초기 자식 항목들을 처리합니다. 자식들의 인스턴스를 생성하고 마운트합니다. 각각의 자식들의 항목이 커스텀 컴포넌트인 경우 1단계 부터 반복하고, HTML 태그인경우 5단계 부터 반복합니다. 그리고 모든 내부 엘리먼트들에게도 적용됩니다.

이게 전부입니다. 보시는 것처럼 꽤 간단합니다.

이제 기본적으로 마운팅은 완료되었습니다. `componentDidMount` 메소드를 대기열에 넣으십시오! 잘 하셨습니다.

### 좋습니다, 이제 우리는 *파트 6*를 끝냈습니다.

우리가 어떻게 여기까지 왔는지 다시 한번 살펴보도록 합시다. 스키마에서 덜 중요한 부분을 제거하면 다음과 같습니다.

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/6/part-6-A.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/6/part-6-A.svg)

<em>6.2 간단히 보는 파트 6 (클릭 가능)</em>

공백을 처리하고 정렬을 통해 더 좋게 수정했습니다.

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/6/part-6-B.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/6/part-6-B.svg)

<em>6.3 간단히 보는 파트 6 리펙토링 버전 (클릭 가능)</em>

좋습니다. 사실, 이것이 여기서 일어나는 일 전부입니다. 이제 *파트 6*의 핵심들을 가지고 최종 `mounting` 스키마에 사용할 수 있습니다.

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/6/part-6-C.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/6/part-6-C.svg)

<em>6.4 파트 6의 핵심 (클릭 가능)</em>

우리는 해냈습니다!


[다음 페이지 : 파트 7 >>](./Part-7.md)

[<< 이전 페이지 : 파트 5](./Part-5.md)


[홈](../../README.md)
