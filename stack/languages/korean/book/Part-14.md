## 파트 14

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/14/part-14.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/14/part-14.svg)

<em>14.0 파트 14 (클릭 가능)</em>

### 마지막 하나!

이 메서드는 자식 컨텐츠에 영향을 주는 다양한 properties 사용하여 자식들을 조정합니다. 몇 가지 가능한 시나리오가 있지만 기술적으로는 두 가지 경우만 있습니다. 자식들이 아직 '복잡하다'라는 의미는 그것들이 리엑트 컴포넌트라는 뜻이며, 리엑트는 최종적으로 콘텐츠 레벨이나 자식들이 문자열 또는 숫자(컨텐츠)와 같은 단순한 타입에 도달 할 때까지 레이어를 통해 여러 번 반복합니다.

`nextProps.children`(1) 타입에 의해서 분기가 되는데, 우리의 경우에는 `button`, `ChildCmp`, `text string` 3개의 컴포넌트를 가진 `ExampleApplication` 컴포넌트가 있습니다.

좋네요, 어떻게 작동하는지 살펴봅시다.

`ExampleApplication children`을 사용한 첫 번째 반복입니다. 분명히, 자식의 타입은 'content'가 아닐것이므로 '복잡한'경우로 가보겠습니다. 이전에 부모 컴포넌트를 만든 것과 거의 동일한 사나리오를 모든 자식들에게 각각 적용합니다. 이때, `shouldUpdateReactComponent`(2)와 같은 검증 블록은 헷갈릴 수 있는데, 이것은 업데이트 여부를 검증하는것 처럼 보이지만, 실제로는 그것의 업데이트 혹은 삭제, 생성을 체크합니다.(스키마를 심플하게하기 위해 생략했습니다.) 또한, 이전과 현재의 자식들을 비교해서 어떠한 자식이 제거되었다면, 그 컴포넌트를 언마운트하고 제거합니다.

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/14/children-update.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/14/children-update.svg)

<em>14.1 자식 업데이트 (클릭 가능)</em>

두번째 반복으로 `button`을 처리할 것인데, 이건 매우 간단한 케이스입니다. 버튼은 오직 ‘set state button’이라는 타이틀만 가지고 있으므로 `children`버튼의 타입은 단지 ‘text’일 뿐입니다. 그러면, 이전 텍스트와 현재가 같은지 확인하고, 텍스트가 변경되지 않았으므로 `button`을 업데이트 할 필요가 없습니다. 이제는 ‘VirtualDOM things’이 동작합니다. 이제는 그렇게 추상적으로 들리지 않습니다, 리엑트는 DOM의 내부 표현을 유지하고 필요한 경우에만 실제 DOM에 접근합니다. 결과적으로 성능이 탁월합니다. 이미 여러분은 이 개념을 다 이해하셨을것 같습니다. 우리는 업데이트를 위해 `ChildCmp`를 넣고, 그것의 자식들이 가장 낮은 레벨의 아이템(컨텐츠)에 도달 할 때까지 업데이트 할 수 있습니다. `this.props.message`는 `click`과 `setState`호출을 통해 'click state message'로 업데이트 되었기 때문에, 이 컨텐츠는 실제로 수정된다는 것을 기억하십시오.

```javascript
//...
onClickHandler() {
	this.setState({ message: 'click state message' });
}

render() {
    return <div>
		<button onClick={this.onClickHandler.bind(this)}>set state button</button>
		<ChildCmp childMessage={this.state.message} />
//...

```

이제, 엘리먼트의 컨텐츠를 업데이트 하려고 합니다. 사실은, 그것을 대체(replace)하는 겁니다. 실제로 어떤 업데이트가 있을까요? 이건 파싱될 설정 객체의 종류이며 설정된 동작이 적용됩니다. 텍스트 업데이트를 사용하는 경우는 다음과 같습니다. 

```javascript
{
  afterNode: null,
  content: "click state message",
  fromIndex: null,
  fromNode: null,
  toIndex: null,
  type: "TEXT_CONTENT"
}
```
거의 비어 있음을 알 수 있는데, 텍스트 업데이트의 경우에는 꽤 직관적입니다. 보시다시피, 많은 properties들이 있는데 이건 노드를 옮길 때 텍스트 업데이트보다 더 복잡 할 수 있기 때문입니다.

명확하게 하기위해 메소드 코드를 확인해봅시다.

```javascript
// src\renderers\dom\client\utils\DOMChildrenOperations.js #172
processUpdates: function(parentNode, updates) {
    for (var k = 0; k < updates.length; k++) {
      var update = updates[k];

      switch (update.type) {
        case 'INSERT_MARKUP':
          insertLazyTreeChildAt(
            parentNode,
            update.content,
            getNodeAfter(parentNode, update.afterNode)
          );
          break;
        case 'MOVE_EXISTING':
          moveChild(
            parentNode,
            update.fromNode,
            getNodeAfter(parentNode, update.afterNode)
          );
          break;
        case 'SET_MARKUP':
          setInnerHTML(
            parentNode,
            update.content
          );
          break;
        case 'TEXT_CONTENT':
          setTextContent(
            parentNode,
            update.content
          );
          break;
        case 'REMOVE_NODE':
          removeChild(parentNode, update.fromNode);
          break;
      }
    }
  }
```
우리의 경우는 ‘TEXT_CONTENT’이고 실제로 마지막 단계인 `setTextContent`(3)을 호출하고 HTML 노드(DOM에서의 실제 노드)의 내용을 수정합니다. 

잘하셨습니다. 콘텐츠가 업데이트되고 페이지는 사용자를 위해 리렌더링됩니다. 그 밖에 놓친것들이 있을까요? 업데이트를 마무리 지어봅시다! 모든 것이 준비되었으므로 컴포넌트의 훅인 `componentDidUpdate`가 호출됩니다. 보통 연기된 콜백(postpone callbacks)은 어떻게 호출되나요? 맞습니다. 트랜잭션 레퍼를 이용합니다. dirty 컴포넌트 업데이트는 `ReactUpdatesFlushTransaction`로 래핑되었고, 래퍼 중 하나는 실제로 `this.callbackQueue.notifyAll()` 로직을 포함하므로 `componentDidUpdate`를 호출 할 것입니다.

이제 완벽히 끝난것 같습니다.

### 좋습니다, 이제 우리는 *파트 14*를 끝냈습니다.

우리가 어떻게 여기까지 왔는지 다시 한번 살펴보도록 합시다. 스키마에서 덜 중요한 부분을 제거하면 다음과 같습니다.

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/14/part-14-A.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/14/part-14-A.svg)

<em>14.2 간단히 보는 파트 14 (클릭 가능)</em>

공백제거와 정렬을 통해 보기 좋게 수정했습니다.

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/14/part-14-B.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/14/part-14-B.svg)

<em>14.3 간단히 보는 파트 14 리펙토링 버전 (클릭 가능)</em>

좋습니다. 사실, 이것이 여기서 일어나는 일 전부입니다. 이제 *파트 14*의 핵심들을 가지고 최종 `updating` 스키마에 사용할 수 있습니다.

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/14/part-14-C.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/14/part-14-C.svg)

<em>14.4 파트 14의 핵심 (클릭 가능)</em>

우리는 해냈습니다! 사실 우리는 업데이팅을 끝냈습니다. 아래를 보십시오.

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/14/updating-parts-C.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/14/updating-parts-C.svg)

<em>14.5 업데이팅 (클릭 가능)</em>

[<< 이전 페이지 : 파트 13](./Part-13.md)


[홈](../../README.md)
