## 파트 3

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/3/part-3.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/3/part-3.svg)

<em>3.0 파트 3 (클릭 가능)</em>

### 마운트(Mount)

`componentMount` 메소드는 우리 여행의 가장 큰 부분 중 하나입니다! 그래서, 우리에게 ReactCompositeComponent.mountComponent(1)는 흥미로운 메소드 입니다.

** 컴포넌트의 트리에 처음 삽입되는 ** 컴포넌트는`TopLevelWrapper`(내부 리엑트 클래스)라고 한 적이 있었습니다. 이제 우리는 그걸 마운팅 하려고 합니다. 하지만... 기본적으로 이건 빈 래퍼이므로 디버깅하는 것은 지루합니다. 이건 지금 흐름과 전혀 상관이 없기에, 지금은 건너 뛰고 그것의 child로 이동하겠습니다.

이건 실제로 트리의 마운트가 작동하는 방법입니다. parent, 그것의 child, 그 child의 chid 등등을 마운트합니다. `TopLevelWrapper`가 마운트 된 후에, 그것(ExampleApplication 컴포넌트를 관리하는`ReactCompositeComponent`)의 child은 같은 단계에 놓이게됩니다.

좋습니다, 이제 다시 step(1)로 돌아갑시다. 안에 뭐가 있는지 보십시오. 몇 가지 주요 동작이 발생하므로, 자세하게 이 로직을 살펴 보겠습니다.

### 인스턴스 updater 할당

`updater`(2)는 `transaction.getUpdateQueue()`에서 리턴되며 실제로는`ReactUpdateQueue` 모듈입니다. 그래서, 실제로 **여기에 할당**되는 이유는 무엇입니까? 왜냐하면 `ReactCompositeComponent`(우리가 현재보고있는 클래스)는 모든 플랫폼에서 사용었기 때문에, updater와는 다르므로 플랫폼에 따라 마운트하는 동안 동적으로 할당합니다.

지금 `updater`가 정말로 필요하지는 않지만 이것만은 명심하십시오. `updater`는 정말로 중요합니다. 잘 알려진 컴포넌트 메소드인 **`setState`**에 의해 우리는 곧 사용될하게 될 것입니다.

실제로, 이 단계에서는 인스턴스에 `updater '가 할당될뿐만 아니라 컴포넌트 인스턴스 (사용자 정의 컴포넌트)도 `props`, `context`, `refs'로 확장됩니다.

아래 코드를 확인하십시오 :

```javascript
// \src\renderers\shared\stack\reconciler\ReactCompositeComponent.js #255
// 이것들은 생성자에서 설정되어야하지만,
// 단순한 클래스 추상화의 편의를 위해, 우리는 사실 이후에 그들을 설정했다.
inst.props = publicProps;
inst.context = publicContext;
inst.refs = emptyObject;
inst.updater = updateQueue;
```

이제, 당신은 `this.props`와 같은 인스턴스에서 코드의 `props`에 접근 할 수 있습니다.

### ExampleApplication 인스턴스 생성

`_constructComponent`(3)을 호출하고 여러 가지 구성 메소드를 통해 마침내 `new ExampleApplication()`이 생성됩니다. 코드에서 생성자가 호출 될 때가 중요합니다. 코드가 리엑트의 생태계에 실제로 영향을 받은 첫번째 입니다.

### 초기 마운트 수행

mount(4)를 지나며, 첫 번째 발생되어야 하는건`componentWillMount`(명시된 경우)의 호출입니다. 이건 우리가 만나는 라이프 사이클 후크의 첫 번째 메소드입니다. 또한, 약간 아래에서 `componentDidMount`를 볼 수 있지만 직접 호출되어서는 안되기 때문에 실제로 트랜잭션 큐에 푸시됩니다. 이건 마운트 작업이 끝나면 맨 마지막에만 발생합니다. 또한, `setState` 호출을 `componentWillMount` 안에서도 할 수 있습니다. 이 경우, `render` 메소드 없이 state가 다시 계산됩니다.(컴포넌트가 아직 마운트되지 않았기 때문에 state를 알 수 없습니다).

공식 문서에서도 다음과 같이 증명하고 있습니다:

> `componentWillMount()`는 마운트가 일어나기 직전에 호출된다. `render()`전에 호출되기 때문에, 이 메소드의 state를 설정해도 리렌더링이 발생되지 않는다.

코드를 확인해 봅시다.

```javascript
// \src\renderers\shared\stack\reconciler\ReactCompositeComponent.js #476
if (inst.componentWillMount) {
    //..
    inst.componentWillMount();

    // 마운트 할 때,`componentWillMount`에 의한 `setState`호출은 리렌더링을 하지 않고,
    // `this._pendingStateQueue`를 설정합니다.
    if (this._pendingStateQueue) {
        inst.state = this._processPendingState(inst.props, inst.context);
    }
}
```

`state`가 다시 계산 될 때 우리는`render`메소드를 호출합니다. 정확히는 컴포넌트에서 우리가 지정하는 것입니다! 이제 한번더 '우리' 코드에 손대봅시다.

다음은 리엑트 컴포넌트 인스턴스를 만드는 것입니다. 음, 또 하는것 같나요? 이미 'this._instantiateReactComponent`(5) 호출을 본 것 같습니다. 맞나요? 사실이지만, 그때 우리는`ExampleApplication` 컴포넌트에 대해 `ReactCompositeComponent`를 인스턴스화했습니다. 이제 우리는`render` 메소드에서 얻은 element를 기반으로 그 child에 대한 VDOM 인스턴스를 생성 할 것입니다. 정확하게는 render 메서드는 `div`를 반환하므로 VDOM 표현은 `ReactDOMComponent`입니다. 인스턴스가 생성되면, 우리는`ReactReconciler.mountComponent`를 다시 호출합니다. 하지만 이번에는 `internalInstance`로 우리는 새로 생성 된 `ReactDOMComponent`의 인스턴스를 전달합니다.

그리고,`mountComponent`를 호출합니다.

### 좋습니다, 이제 우리는 *파트 3*를 끝냈습니다.

우리가 어떻게 여기에 왔는지 다시 한번 살펴보도록 합시다. 스키마를 한번 더 보시고 덜 중요한 부분을 제거하면 다음과 같습니다:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/3/part-3-A.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/3/part-3-A.svg)

<em>3.1 파트 3 단순화 (클릭 가능)</em>

우리는 공백하고 정렬 부분도 아마 고쳐야 할것 같습니다:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/3/part-3-B.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/3/part-3-B.svg)

<em>3.2 파트 3 단순화 & 리펙토링 (클릭 가능)</em>

멋집니다. 사실 이게 여기서 일어나는 일 전부 입니다. 이제 우리는 *파트 3*에서 필수적인 가치를 취할 수 있고 그것을 최종 mounting 스키마로 사용할 수 있습니다:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/3/part-3-C.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/3/part-3-C.svg)

<em>3.3 파트 3 필수 가치 (클릭 가능)</em>

그리고 이제 우리는 해냈습니다!


[다음 페이지 : 파트 4 >>](./Part-4.md)

[<< 이전 페이지 : 파트 2](./Part-2.md)


[홈](../../README.md)
