## 파트 1

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/1/part-1.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/1/part-1.svg)

<em>1.0 파트 1 (클릭 가능)</em>

### 트랜잭션(Transaction)

컴포넌트 인스턴스는 어떻게든 리엑트의 생태계에 **연결** 되어야 하며 **영향**을 끼쳐야합니다. 이것에 도움이되는 전용 모듈`ReactUpdates`가 있습니다. 아시다시피, **리엑트는 덩어리(chunks)로 업데이트를 수행을 하는데,** 이는 작업을 수집하고 **함께** 수행한다는 것을 의미합니다. 각각의 항목마다 매번 **사전 조건** 및 **사후 조건**을 적용하는 대신에, 전체 항목에 대하여 한번만 수행할 수 있으므로 더 좋습니다.

실제로 이 사전/사후 처리를 처리하는데 도움이 되는 것은 무엇일까요? 맞습니다. 바로 **트랜잭션**입니다! 어떤분들에게는 이건 새로운 단어일 수도 있고, 적어도 UI 요구 사항에 대한 설명일 수 있습니다. 그래서 트랜잭션 대해 조금 더 이야기하고 간단한 예를 들어 봅시다.

'통신 채널'을 상상해보십시오. 커넥션을 열고 메시지를 보낸 다음 커넥션을 닫아야합니다. 여러 개의 메시지를 하나씩 보내면 이와 같은 일이 많이 발생할 수 있습니다. 대신, 커넥션을 한 번만 열어 보류중인 모든 메시지를 보낸 다음 커넥션을 닫을 수 있습니다.


[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/1/communication-channel.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/1/communication-channel.svg)

<em>1.1 트랜잭션의 가장 현실적인 예제 (클릭 가능)</em>

자, 이제 더 추상적인 것들에 대해 생각해봅시다. '메시지 보내기'는 수행하려는 작업이고, '커넥션의 열기/닫기'는 작업 수행 중 사전/사후 처리라고 가정하도록 하겠습니다. 그런 다음, 열기-닫기 쌍을 따로따로 정의하여 원하는 모든메소드와 함께 사용할 수 있다고 가정해보겠습니다. (실제로 각 쌍이 액션 메소드를 래핑하기 때문에 래퍼의 이름을 지정할 수 있습니다.).

리엑트로 돌아가 봅시다. 트랜잭션은 리엑트 내부에서 널리 사용되는 패턴입니다. 래핑 동작 외에도 트랜잭션을 사용해 응용 프로그램에서 트랜잭션 흐름을 재설정하고 트랜잭션이 이미 진행중인 경우 동시 실행을 차단할 수도 있습니다. 여러 다른 트랜잭션 클래스가 있으며, 각각 특정 동작을 설명하지만, 모두 `Transaction` 모듈에서 확장됩니다. 트랜잭션간의 주요 차이점은 트랜잭션 래퍼 목록에 따라 다릅니다. 래퍼는 초기화 및 클로즈 메소드가 포함 된 객체입니다.

그래서, **개념**은 :
* 각 wrapper.initialize를 호출하고 반환된 값을 캐시합니다.(이후에 사용 가능)
* 자체 트랜잭션 메소드를 호출합니다.
* 각 wrapper.close를 호출합니다.

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/1/transaction.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/1/transaction.svg)

<em>1.2 트랜잭션 구현 (클릭 가능)</em>


리엑트의 트랜잭션에 대한 **다른 사용 사례**를 보도록 합시다.
* 조정 전후에 input selection ranges(번역가 각주 : 예를 들어, 포커스된 `<input/>`)를 보존해서 예기치 못한 오류가 발생했을 때에도 그 input selection을 복원합니다.
* DOM을 재배치하는 동안 이벤트를 비활성화하여 blurs/focuses를 막고, 이후에 이벤트 시스템이 다시 활성화되는것을 보장합니다.
* 작업 쓰레드에서의 조정 이후에 큐에 쌓아놓았던 돔 변화를 메인 UI 쓰레드로 내보냅니다.
* 새로운 내용을 렌더링 한 후 수집 된 `componentDidUpdate` 콜백을 호출합니다.

예시로 돌아가 보도록 합시다.

위에서 볼 수 있듯이, 리엑트는 `ReactDefaultBatchingStrategyTransaction`(1)을 사용합니다. 우리가 방금 지나온 것 것처럼, 트랜잭션에 대한 핵심은 래퍼입니다. 그렇기 때문에, 래퍼를 살펴보고 정의된 트랜잭션이 정확히 무엇인지 파악할 수 있습니다. 좋습니다. 여기 두 개의 래퍼가있습니다 : `FLUSH_BATCHED_UPDATES`,`RESET_BATCHED_UPDATES`. 한번 코드를 확인해 보도록 합시다 :

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

어떻게 되어있는지 보이시나요. 이 트랜잭션에는 사전 조건이 없습니다. `initialize` 메소드는 비어 있지만, `close` 메소드 중 하나는 꽤 흥미롭습니다. 그것은 `ReactUpdates.flushBatchedUpdates`를 호출합니다. 이것은 무엇을 의미할까요? 이건 실제로 이후의 리렌더링을 통해 dirty 컴포넌트에 대한 검증을 시작합니다. 잘 따라 오셨죠? 마운팅 메소드를 호출하고 트랜잭션으로 랩핑합니다. 마운트 이후에 리엑트는 마운트 된 컴포넌트의 영향을 받는지 확인하고 업데이트합니다.

자, 다음은 트랜잭션에 랩핑된 메소드를 살펴 보겠습니다. 실제로, 이건 또 다른 트랜잭션으로 이어집니다...


### 좋습니다, 이제 우리는 *파트 1*를 끝냈습니다.

우리가 어떻게 여기까지 왔는지 다시 한번 살펴보도록 합시다. 스키마에서 덜 중요한 부분을 제거하면 다음과 같습니다.

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/1/part-1-A.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/1/part-1-A.svg)

<em>1.3 간단히 보는 파트 1 (클릭 가능)</em>

공백제거와 정렬을 통해 보기 좋게 수정했습니다.

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/1/part-1-B.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/1/part-1-B.svg)

<em>1.4 간단히 보는 파트 1 리펙토링 버전 (클릭 가능)</em>

좋습니다. 사실, 이것이 여기서 일어나는 일 전부입니다. 이제 *파트 1*의 핵심들을 가지고 최종 `mounting` 스키마에 사용할 수 있습니다.

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/1/part-1-C.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/1/part-1-C.svg)

<em>1.5 파트 1의 핵심 (클릭 가능)</em>

우리는 해냈습니다!


[다음 페이지 : 파트 2 >>](./Part-2.md)

[<< 이전 페이지 : 파트 0](./Part-0.md)


[홈](../../README.md)
