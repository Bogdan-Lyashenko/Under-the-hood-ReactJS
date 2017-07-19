## 파트 1

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/1/part-1.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/1/part-1.svg)

<em>1.0 파트 1 (클릭 가능)</em>

### 트랜잭션(Transaction)

컴포넌트 인스턴스는 어떻게든 React의 생태계에 **연결** 되어야하며 물론 **영향력**이 미쳐야합니다. 이것에 도움이되는 전용 모듈`ReactUpdates`가 있습니다. 아시다시피, **리엑트는 덩어리(chunks)로 업데이트를 수행을 하는데,** 이는 작업을 수집하고 **함께** 수행한다는 것을 의미합니다. 각각의 항목(item)을 수행하는 대신 전체 항목의 리스트(chunk)에 대해 **사전 조건** 및 **사후 조건**을 한 번만 적용 할 수 있으므로 항상 유용합니다.

실제로 이 사전/사후 처리를 처리하는데 도움이 되는 것은 무엇일까요? 맞습니다. 바로 **트랜잭션**입니다! 어떤분들에게는 이건 새로운 단어일 수도 있고, 적어도 UI 요구 사항에 대한 해석일 수 있습니다. 그래서 트랜잭션 대해 조금 더 이야기하고 간단한 예를 들어 시작해 봅시다.

'통신 채널'을 상상해보십시오. 연결(connection)을 열고 메시지를 보낸 다음 연결을 닫아야합니다. 여러 개의 메시지를 하나씩 보내면 이와 같은 일이 많이 발생할 수 있습니다. 대신, 연결을 한 번만 열어 보류중인 모든 메시지를 보낸 다음 연결을 닫을 수 있도 있죠.


[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/1/communication-channel.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/1/communication-channel.svg)

<em>1.1 트랜잭션의 가장 리얼한 예제 (클릭 가능)</em>

자, 이제 더 추상적인 것들에 대해 생각해 보도록 해봅시다. '메시지 보내기'는 수행하려는 작업이고,'연결(connection)의 열기/닫기'는 작업 수행 중 사전/사후 처리라고 상상 해보십시오. 그런 다음, 개폐식 쌍을 따로따로 정의하여 원하는 모든 방법으로 사용할 수 있다고 상상해보십시오. (실제로 각 쌍이 액션 메소드를 래핑하기 때문에 래퍼의 이름을 지정할 수 있습니다.). 아주 멋집니다.

리엑트로 돌아가 봅시다. 트랜잭션은 리엑트 내부에서 널리 사용되는 패턴입니다. 래핑 동작 외에도 트랜잭션을 사용해 응용 프로그램에서 트랜잭션 흐름을 재설정하고 트랜잭션이 이미 진행중인 경우 동시 실행을 차단할 수도 있습니다. 많은 다른 트랜잭션 클래스가 있으며, 각각 특정 동작을 설명하지만, 모두 'Transaction` 모듈에서 확장됩니다. 트랜잭션 간의 주요 차이점은 정확한 트랜잭션 래퍼 목록에 따라 다릅니다. 래퍼는 초기화 및 닫기 메소드가 포함 된 객체입니다.

그래서, **아이디어**는 :
* 각 wrapper.initialize를 호출하고 반환 된 값을 캐시합니다.(추가 사용 가능)
* 트랜잭션 메소드 자체를 호출합니다.
* 각 wrapper.close를 호출합니다.

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/1/transaction.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/1/transaction.svg)

<em>1.2 트랜잭션 구현 (클릭 가능)</em>


리엑트의 트랜잭션에 대해 **다른 사용 사례**를 보도록하죠 :
* 예상치 못한 오류가 발생했을 때에도 선택 복원 조정 전후의 입력 선택 범위를 유지합니다.
* DOM을 재배치하는 동안 이벤트를 비활성화하여 blurs/focuses를 막고, 이후에는 이벤트 시스템이 다시 활성화되도록 합니다.
* 조정 후에 주요 UI 프로세스 모임에 수집된 DOM 변화 대기열을 내보내는 것이 작업자 프로세스 모임에서 발생한다.
* 새로운 내용을 렌더링 한 후 수집 된`componentDidUpdate` 콜백 호출하기

정확한 사례로 돌아가 보도록 합시다.

위에서 볼 수 있듯이, 리엑트는`ReactDefaultBatchingStrategyTransaction` (1)을 사용합니다. 우리가 방금 지나온 것 것처럼, 트랜잭션에 대한 핵심은 래퍼입니다. 그렇기 때문에, 래퍼를 살펴보고 정의된 정확한 트랜잭션이 무엇인지 파악할 수 있습니다. 좋습니다. 여기 두 개의 래퍼가있습니다 : FLUSH_BATCHED_UPDATES`,`RESET_BATCHED_UPDATES`. 한번 코드를 확인해 보도록 하죠 :

```javascript
// \src\renderers\shared\stack\reconciler\ReactDefaultBatchingStrategy.js #19
var RESET_BATCHED_UPDATES = {
	  initialize: emptyFunction,
	  close: function() {
		ReactDefaultBatchingStrategy.isBatchingUpdates = false;
	  },
};

var FLUSH_BATCHED_UPDATES = {
	 initialize: emptyFunction,
	 close: ReactUpdates.flushBatchedUpdates.bind(ReactUpdates),
}

var TRANSACTION_WRAPPERS = [FLUSH_BATCHED_UPDATES, RESET_BATCHED_UPDATES];
```

이제, 어떻게 보이는지 보실 수 있습니다. 이 트랜잭션에는 사전 조건이 없습니다. `initialize` 메소드는 비어 있지만,`close` 메소드 중 하나는 꽤 흥미 롭습니다. 그것은 `ReactUpdates.flushBatchedUpdates`를 호출합니다. 이것은 무엇을 의미할까요? 이건 실제로 더 많은 리렌더링을 통해 dirty 컴포넌트에 대한 검증을 시작합니다. 잘 따라오고 있나요? 마운팅 메소드를 호출하고 정확한 트랜잭션으로 랩핑합니다. 마운트 후 React가 마운트 된 컴포넌트의 영향을 받는지 확인하고 업데이트합니다.

자, 트랜잭션에 랩핑 된 메소드를 살펴 보겠습니다. 실제로, 그것은 우리에게 또 다른 트랜젝션을 가져옵니다 ...


### 좋습니다. 우리는 *파트 1* 을 끝냈습니다.

살펴본걸 한번 정리해보도록 하죠. 스키마를 한번 더 보시고 덜 중요한 부분을 제거하면 다음과 같습니다:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/1/part-1-A.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/1/part-1-A.svg)

<em>1.3 파트 1 단순화 (클릭 가능)</em>

그리고 공간과 정렬을 수정해야합니다 :

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/1/part-1-B.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/1/part-1-B.svg)

<em>1.4 파트 1 단순화 & 리펙토링 (클릭 가능)</em>

멋집니다. 사실 이게 여기서 일어나는 일 전부 입니다. 이제 우리는 *파트 1*에서 필수적인 가치를 취할 수 있고 그것을 최종 mounting 스키마로 사용할 수 있습니다:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/1/part-1-C.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/1/part-1-C.svg)

<em>1.5 파트 1 필수 가치 (클릭 가능)</em>

그리고 이제 우리는 해냈습니다!


[다음 페이지 : 파트 2 >>](./Part-2.md)

[<< 이전 페이지 : 파트 0](./Part-0.md)


[홈](../../README.md)