## Intro

### Esquema, primeira impressão


[![](../images/intro/all-page-stack-reconciler-25-scale.jpg)](../images/intro/all-page-stack-reconciler.svg)

<em>Intro.0 Todo o esquema (clicável)</em>

Vamos dar uma olhada. Sem press. No geral, parece complexo mas na verdade ele descreve só dois processos: montagem e atualização. Eu pulei a desmontagem porque é meio que uma "montagem reversa" e ao remover simplificava o esquema. Aliás, **isso não bate 100%** com o código, e sim só grandes partes que descrevem a arquitetura. No total é mais ou menos 60% do código, mas os outros 40% não traria muito valor visual. Então, novamente, por simplicidade, eu omiti.

Numa primeira impressão, você provavelmente percebeu muitas cores no esquema. Cada item lógico (forma no esquema) está destacado na cor do módulo pai. Por exemplo, o `methodA` será vermelho se for chamado do `moduleB`, que é vermelho. Abaixo tem uma legenda pros módulos no esquema junto com o caminho de cada arquivo.

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/7c2372e1/stack/images/intro/modules-src-path.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/7c2372e1/stack/images/intro/modules-src-path.svg)

<em>Intro.1 Cores dos módulos (clicável)</em>

Vamos colocá-los no esquece pra ver **dependências entre módulos**.

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/7c2372e1/stack/images/intro/files-scheme.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/7c2372e1/stack/images/intro/files-scheme.svg)

<em>Intro.2 Dependências dos módulos (clicável)</em>

Como você provavelmente sabe, React foi feito para **suportar vários ambientes**.
 
- Mobile (**ReactNative**)
- Browser (**ReactDOM**)
- Renderização do servidor
- **ReactART** (para desenhar vetores gráficos pro React)
- etc.

Como resultado, vários arquivos são na verdade maiores do que parecem no esquema acima. Abaixo, o mesmo esquema com multi-suporte incluído.

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/7c2372e1/stack/images/intro/modules-per-platform-scheme.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/7c2372e1/stack/images/intro/modules-per-platform-scheme.svg)

<em>Intro.3 Dependência de plataformas (clicável)</em>

Como você pode ver, alguns itens parecem duplicados. Isso mostra que eles tem uma implementação separada para cada plataforma. Vamos pegar algo simples como ReactEventListener. Obviamente, sua implementação vai ser diferente para diferentes plataformas!
Tecnicamente, como pode imaginar, esses módulos dependentes de plataformas devem de alguma forma serem injetados ou conectados com o fluxo lógico e, na verdade, existem muitos desses injetores. Devido ao seu uso ser parte de um pattern de composição padrão, escolhi omití-los. De novo, por simplicidade.

Vamos aprender o fluxo lógico do **React DOM** em um **browser padrão**. É a plataforma mais utilizada e cobre completamente todas as ideias arquiteturais do React. Então, vamos lá!


### Amostra de código

Qual é a melhor forma de aprender sobre o código de um framework ou biblioteca? Isso mesmo, lendo e debuggando o código. Beleza, vamos debuggar **dois processos**: **ReactDOM.render** e **componente.setState**, que mapeiam na montagem e na atualização. Vamos olhar o código que podemos escrever do começo. O que precisamos? Provavelmente vários pequenos componentes com renderizações simples, para que seja mais fácil debuggar.

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

Estamos pronto para começar. Vamos para a primeira parte do esquema. Um a um, vamos passar por todas elas.

[Próxima página: Parte 0 >>](./Part-0.md)


[Home](../../README.md)
