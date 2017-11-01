## Intro

### 스키마와의 첫만남


[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/7c2372e1/stack/images/intro/all-page-stack-reconciler-25-scale.jpg)](../images/intro/all-page-stack-reconciler.svg)

<em>Intro.0 전체 스키마 (클릭 가능)</em>

자.. 천천히 봅시다. 전체적으로 복잡해 보이지만 사실 mount와 update 이 두 가지 프로세스만을 설명하고 있습니다. unmount는 스킵 했는데, 그건 일종의 "reversed mount" 이고, 그것을 제거함으로써 스키마를 더 간소화 시킬 수 있기 때문입니다. 또한, 이건 코드와 **100% 일치하지는 않지만**, 아키텍처를 설명하는 주요 부분들을 다루고 있습니다. 전체적인 코드의 60%는 시각적으로 볼 가치가 있지만, 나머지 40%는 그렇지 않습니다. 다시 말하지만, 저는 단순함을 위해 생략했습니다.

처음 보셨을때, 아마 스키마안에 많은 색들이 있다는것을 알아채셨을 겁니다. 각 논리 항목(스키마의 모양)은 부모 모듈의 색상으로 표시됩니다. 예를 들어, 빨간색인 `moduleB`에서 호출된 `methodA`는 빨간색을 갖습니다. 아래는 각 파일의 경로와 스키마안의 모듈에 대한 범례입니다.

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/7c2372e1/stack/images/intro/modules-src-path.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/7c2372e1/stack/images/intro/modules-src-path.svg)

<em>Intro.1 모듈의 색깔들 (클릭 가능)</em>

**모듈들간의 의존성**들을 확인하기 위해 스키마로 표현해봅시다.

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/7c2372e1/stack/images/intro/files-scheme.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/7c2372e1/stack/images/intro/files-scheme.svg)

<em>Intro.2 모듈들간 의존성 (클릭 가능)</em>

아시다시피 리엑트는 **많은 환경을 지원**하도록 만들어졌습니다.
- 모바일 (**ReactNative**)
- 브라우저 (**ReactDOM**)
- 서버 렌더링
- **ReactART** (벡터 그래픽을 그리기 위한 리엑트)
- etc.

결과적으로는 위의 스키마보다 실제로는 더 많은 파일들이 있습니다. 다음은 다중지원이 포함된 스키마입니다.

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/7c2372e1/stack/images/intro/modules-per-platform-scheme.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/7c2372e1/stack/images/intro/modules-per-platform-scheme.svg)

<em>Intro.3 플랫폼 의존성들 (클릭 가능)</em>

몇개의 항목들은 중첩되어 있는게 보이실겁니다. 이건 각 플랫폼마다 별도로 구현되어 있음을 보여줍니다. ReactEventListener와 같은 간단한 것을 살펴봅시다. 분명히 그건 플랫폼마다 구현이 다를 것입니다! 여러분이 상상해볼 수 있듯이, 기술적으로 플랫폼 종속 모듈은 어떻게든 현재의 논리 흐름에 주입되거나 연결되어야하며, 실제로 그러한 많은 injectors가 있습니다. 사용법은 표준 컴포지션 패턴의 일부이기 때문에 생략했습니다. 다시 말하자면 단순함을 위해서 입니다.

**일반 브라우저**에서의 **리엑트 DOM**의 논리 흐름을 배워봅시다. 이건 가장 많이 사용되는 플랫폼이며 리엑트의 모든 아키텍처 아이디어를 완벽하게 다루고 있습니다.


### 샘플 코드

프레임워크 또는 라이브러리의 코드를 배우는 가장 좋은 방법은 무엇일까요? 맞습니다, 바로 코드를 읽고 디버깅하는 것입니다. 이제 **두 개의 프로세스**를 디버깅해봅시다. : mount와 update할 때 매핑되는 **ReactDOM.render**와 **component.setState** 입니다. 코드를 살펴보도록 합시다. 뭐가 필요할까요? 아마도 간단한 렌더러를 가진 여러 개의 작은 컴포넌트들은 디버깅하기 쉬울 것입니다.

```javascript
class ChildCmp extends React.Component {
    render() {
        return <div> {this.props.childMessage} </div>
    }
}

class ExampleApplication extends React.Component {
    constructor(props) {
        super(props);
        this.state = {message: 'no message'};
    }

    componentWillMount() {
        //...
    }

    componentDidMount() {
        /* setTimeout(()=> {
            this.setState({ message: 'timeout state message' });
        }, 1000); */
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return true;
    }

    componentDidUpdate(prevProps, prevState, prevContext) {
        //...
    }

    componentWillReceiveProps(nextProps) {
        //...
    }

    componentWillUnmount() {
        //...
    }

    onClickHandler() {
        /* this.setState({ message: 'click state message' }); */
    }

    render() {
        return <div>
            <button onClick={this.onClickHandler.bind(this)}> set state button </button>
            <ChildCmp childMessage={this.state.message} />
            And some text as well!
        </div>
    }
}

ReactDOM.render(
    <ExampleApplication hello={'world'} />,
    document.getElementById('container'),
    function() {}
);
```

시작할 준비를 마쳤습니다. 스키마의 첫 번째 부분으로 가봅시다. 차근차근하면 전체를 다 살펴볼 수 있을 것입니다. 

[다음 페이지: 파트 0 >>](./Part-0.md)


[홈](./README.md)