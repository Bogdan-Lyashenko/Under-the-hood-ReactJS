## 파트 11

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/11/part-11.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/11/part-11.svg)

<em>11.0 파트 11 (클릭 가능)</em>

### Update component

메소드에 대해 설명하는 코드에 있는 주석입니다:
> '마운팅된 컴포넌트의 업데이트를 수행합니다. componentWillReceiveProps와 shouldComponentUpdate메서드가 호출되면(업데이트를 건너 뛰지 않은 경우) 나머지 업데이트 라이프 사이클 메서드가 호출되고 DOM 표현이 업데이트됩니다. 기본적으로, 리엑트의 렌더링 및 조정 알고리즘을 구현합니다. 복잡한 클라이언트는 이것을 오버라이드해서 사용하길 원할 것입니다.'

좋습니다… 합리적인것 같네요.

우리는 가장먼저 `props`(1)가 변경되었는지 확인합니다. 기술적으로, `setState`가 호출되거나 `props`가 변경되는 두가지 시나리오로 `updateComponent`메소드가 호출 될 수 있습니다. 만약 `props`가 실제로 변경되면, 라이프 사이클 메소드인 `componentWillReceiveProps`가 호출 될 것입니다. 그 후, 리엑트는 `pending state queue`(우리가 전에 설정 한 부분 상태 객체의 대기열은 [{message : "click state message"}]와 같습니다.)에 기반하여 `nextState`(2)를 다시 계산합니다. 물론, 단지 `props`의 경우에는 업데이트 상태는 변경되지 않습니다.

다음 단계에서는 `shouldUpdate`를 디폴트값 `true`(3)로 설정합니다. 실제로 `shouldComponentUpdate`가 지정되지 않은 경우에도 컴포넌트가 기본적으로 업데이트되는 이유입니다. 그런 다음 `force update`가 아닌지 확인합니다. 아시다시피, `state`나 `props`를 변경하는 대신 컴포넌트에서 `forceUpdate`를 호출하여 업데이트 할 수 있지만, 리엑트 공식 문서에 따르면 이 방법을 사용하는 않는것이 좋습니다. 따라서 강제 업데이트(force Update)의 경우 컴포넌트가 영구적으로 업데이트되며, 그렇지 않으면 `shouldComponentUpdate` 메소드가 호출되어 `shouldUpdate`의 결과 값으로 다시 할당됩니다. 컴포넌트가 업데이트 되지 않아야한다고 판단되면, 리엑트는 여전히 `props`와 `state`를 설정해야 하고 이건 나머지 업데이트들의 지름길입니다.

### 좋습니다, 이제 우리는 *파트 11*를 끝냈습니다.

우리가 어떻게 여기까지 왔는지 다시 한번 살펴보도록 합시다. 스키마를 한번 더 보시고, 덜 중요한 부분을 제거하면 다음과 같습니다.

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/11/part-11-A.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/11/part-11-A.svg)

<em>11.1 간단히 보는 파트 11 (클릭 가능)</em>

공백을 처리하고 정렬을 통해 더 좋게 수정했습니다:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/11/part-11-B.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/11/part-11-B.svg)

<em>11.2 간단히 보는 파트 11 리펙토링 버전 (클릭 가능)</em>

좋습니다. 사실, 이것이 여기서 일어나는 일 전부입니다. 이제 *파트 11*에서 필수 가치를 취할 수 있고 그것을 최종 `updating` 스키마에 사용할 수 있습니다.

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/11/part-11-C.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/11/part-11-C.svg)

<em>11.3 파트 11의 필수 가치 (클릭 가능)</em>

우리는 해냈습니다!


[다음 페이지: 파트 12 >>](./Part-12.md)

[<< 이전 페이지: 파트 10](./Part-10.md)


[홈](../../README.md)
