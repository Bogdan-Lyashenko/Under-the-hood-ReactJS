## 파트 12

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/12/part-12.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/12/part-12.svg)

<em>12.0 파트 12 (클릭 가능)</em>

### 실제로 컴포넌트를 업데이트 해야 하는 경우

우선, `componentWillUpdate` 훅이 지정된 경우 호출하도록 합니다(1). 다음에는 컴포넌트를 리렌더링하고 `componentDidUpdate` 호출을 대기열에 추가합니다.(업데이트가 끝날 때 호출되어야 하기 때문에 호출을 연기합니다)
그렇다면 여기에서 리렌더링이란 무엇을 의미하는 것일까요? 사실, 여기서 해야 할 일은 컴포넌트의 `render` 메소드를 호출하고, 그에 따라 DOM을 업데이트하는 것입니다. 첫 번째는 인스턴스(`ExampleApplication`)에서`render`(2) 메소드를 호출하고 render의 결과(메소드 호출로 리턴된 리엑트 컴포넌트)를 저장하는 것입니다. 다음엔 이전에 렌더링 된 엘리먼트와 비교하여 DOM을 실제로 업데이트해 하는지 확인합니다.

아시다시피, 이건 리엑트의 킬러 기능 중 하나입니다. 중복된 DOM 업데이트를 피하고 리엑트 성능을 향상시키죠.
코드 주석 `shouldUpdateReactComponent`(3) 메소드 :
> '기존 인스턴스가 새 인스턴스에 의해 제거되거나 대체되는 것과 반대로 기존 인스턴스를 업데이트해야 하는지 여부를 결정합니다.'

따라서 대략적으로 말하자면, 이 메소드는 엘리먼트를 완전히 대체해야 하는지 여부를 체크하는데, 이 의미는, 우선 기존 엘리먼트를 `unmounted`하고, `mount` 메소드로부터 받은 새 엘리먼트(`render`에서 가져온)를 마운트 해서, 이 마운트 메소드로 부터 받은 마크업을 현재 엘리먼트 대신 배치하거나, 엘리먼트를 부분적으로 업데이트 한다는 것입니다. 엘리먼트를 완전히 대체하는 가장 큰 이유는 새로운 엘리먼트가 비어 있거나(`render` 로직에 의해 제거 된) 유형이 다른 경우인데, 이건 `div`이지만 지금은 다른 것입니다. 코드를 봅시다. 간단합니다.

```javascript
// /src/renderers/shared/shared/shouldUpdateReactComponent.js #25

function shouldUpdateReactComponent(prevElement, nextElement) {
    var prevEmpty = prevElement === null || prevElement === false;
    var nextEmpty = nextElement === null || nextElement === false;
    if (prevEmpty || nextEmpty) {
        return prevEmpty === nextEmpty;
    }

    var prevType = typeof prevElement;
    var nextType = typeof nextElement;
    if (prevType === 'string' || prevType === 'number') {
        return (nextType === 'string' || nextType === 'number');
    } else {
        return (
            nextType === 'object' &&
            prevElement.type === nextElement.type &&
            prevElement.key === nextElement.key
        );
    }
}
```

좋습니다. `ExampleApplication`의 경우 `render`에 영향을 주지않는 `state` property을 방금 업데이트했으므로, 두번째 시나리오인 `update`로 가봅시다.

### 좋습니다, 이제 우리는 *파트 12*를 끝냈습니다.

우리가 어떻게 여기까지 왔는지 다시 한번 살펴보도록 합시다. 스키마를 한번 더 보시고, 덜 중요한 부분을 제거하면 다음과 같습니다.

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/12/part-12-A.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/12/part-12-A.svg)

<em>12.1 간단히 보는 파트 12 (클릭 가능)</em>

공백을 처리하고 정렬을 통해 더 좋게 수정했습니다:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/12/part-12-B.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/12/part-12-B.svg)

<em>12.2 간단히 보는 파트 12 리펙토링 버전 (클릭 가능)</em>

좋습니다. 사실, 이것이 여기서 일어나는 일 전부입니다. 이제 *파트 12*에서 필수 가치를 취할 수 있고 그것을 최종 `updating` 스키마에 사용할 수 있습니다.

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/12/part-12-C.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/12/part-12-C.svg)

<em>12.3 파트 12의 필수 가치 (클릭 가능)</em>

우리는 해냈습니다!


[다음 페이지: 파트 13 >>](./Part-13.md)

[<< 이전 페이지: 파트 11](./Part-11.md)


[홈](../../README.md)
