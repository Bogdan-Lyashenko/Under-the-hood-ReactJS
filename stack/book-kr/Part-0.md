## 파트 0

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/0/part-0.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/0/part-0.svg)

<em>0.0 파트 0 (클릭 가능)</em>

### ReactDOM.render
좋습니다! 이제 ReactDOM.render 부터 시작해보도록 하죠.

시작₩은 ReactDom.render입니다. 우리의 앱은 여기서부터 DOM 렌더링을 시작합니다. 저는 쉽게 디버깅 할 수 있도록 간단한 컴포넌트 `<ExampleApplication/>`를 만들었습니다. 첫번째로 발생되는 작업은 **JSX가 리엑트의 elements로 변형되는 겁니다**. 그건 매우 단순하며, 간단한 구조를 한 plain objects 입니다. 단지 컴포넌트의 렌더링에서 return 된 것을 나타낸 것 일 뿐 특별한게 없죠. props, key, ref와 같은 몇 가지 필드들은 친숙해져야 할 것입니다. Property type은 JSX에서 설명하는 마크 업 객체를 참조합니다. 이 경우에 `ExampleApplication` 클래스는 버튼 태그에 대한 문자열 `button`일 수도 있습니다. 또한 리엑트 element를 생성하는 동안 리엑트는 `defaultProps`를 `props`(지정된 경우)와 merge하고 `propTypes`을 확인합니다.

더 자세한 내용은 소스 코드를 확인하십시오.: `src\isomorphic\classic\element\ReactElement.js`

### ReactMount
`ReactMount` (01)라는 모듈이 보이실겁니다. 이건 컴포넌트 마운팅의 로직을 포함하고 있습니다. `ReactDOM`에는 로직이 없습니다. 이건 단지 `ReactMount`를 사용하기위한 인터페이스일 뿐이죠. 따라서 `ReactDOM.render`를 호출하면 기술적으로 `ReactMount.render`를 호출합니다. 그렇다면 마운팅이란건 뭘까요?
> 마운팅이란 대표적인 DOM elements를 생성하고 제공된 `container`에 삽입하여 리엑트 컴포넌트를 초기화하는 프로세스.

최소한 코드의 주석은 그렇게 설명하고 있습니다. 그것의 진짜 의미는 무엇일까요? 다음의 변환을 상상해 보도록 하죠:


[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/0/mounting-scheme-1-small.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/0/mounting-scheme-1-small.svg)

<em>0.1 JSX에서 HTML로 (클릭 가능)</em>

React는 **컴포넌트 명세를 HTML로 변환하여 document에** 넣어야합니다. 그럼 그걸 어떻게 전달할 수 있을 까요? 맞습니다, 그건 모든 **props, 이벤트 리스너, 중첩 컴포넌트,** 로직들로 처리할 수 있습니다. 이건 높은 수준의 명세(컴포넌트)를 웹 페이지에 넣을 수 있는 낮은 수준의 데이터(HTML)로 세분화 합니다. 이게 마운팅에 대한 전부입니다.


[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/0/mounting-scheme-1-big.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/0/mounting-scheme-1-big.svg)

<em>0.1 JSX에서 HTML, 확장 (클릭 가능)</em>

좋아요, 계속 해보도록 하죠. 그런데... 잠깐 재미있는 사실을 좀 알아볼까요? 이 여정의 즐거움을 위해 "재미"를 더해봅시다.

> 흥미로운 사실 : 스크롤이 모니터링 중인지 확인해보세요.(02)

> 재밌는 점은 root 컴포넌트를 처음 렌더링하는 동안, 리엑트는 스크롤 리스너 초기화, 스크롤 값을 캐시를 통해 응용프로그램 코드가 reflows시 발생 없이 동작할 수 있게 합니다. 사실, 다른 브라우저 렌더링 구현으로 인해 일부 DOM 값은 정적이 아니며 코드에서 사용할 때마다 계산됩니다. 물론, 이건 성능에 영향을 미칩니다. 이전 버전의 브라우저는 `pageX` 및 `pageX`를 지원하지 않습니다. 리엑트는 이것을 최적화 하려고 하고있습니다. 보시다시피, 빠른 도구를 만들려면 많은 기술들이 사용됩니다. 스크롤같은게 좋은 예 입니다.

### React 컴포넌트 인스턴스화

스키마를 보시면, 숫자(03)으로 표현된 인스턴스 생성이 있습니다. 아직 여기에 `<ExampleApplication />`의 인스턴스를 만드는 것은 이른것 같습니다. 사실, `TopLevelWrapper`(내부 React 클래스)를 인스턴스화합니다. 이제 다음 스키마를 확인해 봅시다.

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/0/jsx-to-vdom.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/0/jsx-to-vdom.svg)

<em>0.3 JSX에서 VDOM으로 (클릭 가능)</em>

3단계를 확인하실 수 있는데, 리엑트 elements를 통한 JSX는 내부 리엑트 구성 요소 유형 중 하나로 변환됩니다. : `ReactCompositeComponent` (자체 컴포넌트 용), `ReactDOMComponent` (HTML 태그 용), `ReactDOMTextComponent` (text nodes 용). 우리는 `ReactDOMTextComponent`를 생략하고 처음 두 개만 집중하도록 하겠습니다.

내부 컴포넌트란 뭘까요? 음, 이건 좀 흥미롭습니다. 가상 DOM에 대해 들어 보신적 있을겁니다. 가상 DOM은 리엑트가 diff 중에 DOM을 직접 건드리지 않는데 사용되는 DOM 표현의 일종입니다. 이것이 리엑트를 빠르게 하죠. 그러나 실제로 리엑트 소스코드에는 '가상 DOM'이라는 파일이나 클래스가 없습니다. 재밋지 않나요? 가상 DOM은 단지 개념일 뿐이며, 실제 DOM에 접근하기 위한 접근방식 입니다. 그래서 몇몇 사람들은 가상 DOM 항목이 리엑트 elements를 참조하고 있다고 말합니다. 그러나 그건 정확하게 맞지 않다고 생각됩니다. 제 생각에 가상 DOM은 `ReactCompositeComponent`, `ReactDOMComponent`, `ReactDOMTextComponent`라는 세 클래스를 참조한다고 생각합니다. 왜 그렇게 되는지 확인해보도록 하죠.

좋습니다, 여기서 인스턴스 만드는 작업을 끝내보도록 하죠. 우리는 `ReactCompositeComponent`를 만들었다고 생각하지만 그렇지 않습니다. 왜냐하면 실제로는 `<ExampleApplication/>`을 `ReactDOM.render`에 넣었기 때문이죠. 리엑트는 항상 `TopLevelWrapper`에서 컴포넌트 트리를 렌더링하기 시작합니다. 이것은 거의 idle wrapper이며, 렌더링(컴포넌트의 렌더링 메서드)은 나중에 `<ExampleApplication />`을 반환합니다.

```javascript
// src\renderers\dom\client\ReactMount.js #277
TopLevelWrapper.prototype.render = function () {
  return this.props.child;
};
```
그래서, 오직`TopLevelWrapper`만이 생성되었습니다, 지금은 더 이상 없습니다.
더 해보도록 하죠. 하지만... 먼저, 또 재미있는 사실을 알아볼까요?

>  흥미로운 사실 : DOM 중첩 유효성 검사

> 중첩된 컴포넌트들이 렌더링 될 때마다 `validateDOMNesting`이라는 HTML 유효성 검사를위한 전용 모듈에 의해 유효성이 검사됩니다. DOM 중첩 유효성 검사는 `child -> parent` 태그 계층의 검증을 의미합니다. 예를 들어 부모 태그가 `<select>`이면 자식 태그는`option`,`optgroup`,`#text` 중 하나만 있어야합니다. 이 규칙은 실제로 https://html.spec.whatwg.org/multipage/syntax.html#parsing-main-inselect에 정의되어 있습니다. 이미 다음과 같은 에러를 내는 모듈을 봤을겁니다. : <em> &lt;div&gt; cannot appear as a descendant of &lt;p&gt; </em>.


### 좋아요, 우리는 *파트 0*을 잘 마쳤습니다.

살펴본걸 한번 정리해보도록 하죠. 스키마를 한번 더 보시고 덜 중요한 부분을 제거하면 다음과 같습니다 : 

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/0/part-0-A.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/0/part-0-A.svg)

<em>0.4 파트 0 단순화 (클릭 가능)</em>

그리고 공간과 정렬을 수정해야합니다:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/0/part-0-B.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/0/part-0-B.svg)

<em>0.5 파트 0 단순화 & 리펙토링 (클릭 가능)</em>

멋집니다. 사실 이게 여기서 일어나는 일 전부 입니다. 이제 우리는 *파트 0*에서 필수적인 가치를 취할 수 있고 그것을 최종 `mounting` 스키마로 사용할 수 있습니다. :

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/0/part-0-C.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/0/part-0-C.svg)

<em>0.6 파트 0 필수 가치 (클릭 가능)</em>

그리고 이제 우리는 해냈습니다!


[다음 페이지 : 파트 1 >>](./Part-1.md)

[<< 이전 페이지 : 인트로](./Intro.md)


[홈](../../README.md)
