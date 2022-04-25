## Parte 3

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/3/part-3.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/3/part-3.svg)

<em>3.0 Parte 3 (clicável)</em>

### Montagem

O método `componentMount` é uma das maiores partes da nossa jornada! O método que é interessante pra nós é o `ReactCompositeComponent.mountComponent` (1).

Se você se lembra, mencionei que o **primeiro componente que é colocado na árvore de componentes** é o `TopLevelWrapper` (classe interna do React). Aqui, nós vamos montá-lo. Mas... é basicamente um wrapper vazio, então é um pouco tedioso fazer o debug. Ele não afeta o fluxo em nada, então, sugiro pular e ir para o filho.

É assim que a montagem de uma árvore funciona, você monta o pai, depois o filho, e o filho do filho, daí em diante. Depois que o `TopLevelWrapper` é montado, o filho dele (`ReactCompositeComponent`, que gerencia o componente `ExampleApplication`) vai ser colocado na mesma fase.

Beleza, estamos de volta ao passo (1). Vamos ver o que tem dentro. Têm algumas ações importantes que vão acontecer, então vamos discutir a lógica com detalhes.

### Atribuindo uma instância updater

Esse `updater` (2), retornado do `transaction.getUpdateQueue()`, é na verdade o módulo `ReactUpdateQueue`. Então por que é **atribuído aqui**? Bem, porque `ReactCompositoComponent` (a classe que estamos estudando) é usada em todas as plataformas, mas updaters são diferentes, então o atribuímos dinamicamente durante a montagem dependendo da plataforma

Beleza. Não precisamos realmente desse `updater` no momento, mas fique com ele na memória. `updater` é muito **importante**, ele vai ser usado em breve por um método de componente bem conhecido, o **`setState`**.

Na verdade, o `updater` não é só atribuído a uma instância durante essa fase, a instância do componente (seu componente customizado) é também estendido com `props`, `context` e `refs`.

Olhe o código abaixo:

```javascript
// \src\renderers\shared\stack\reconciler\ReactCompositeComponent.js#255
// These should be set up in the constructor, but as a convenience for
// simpler class abstractions, we set them up after the fact.
inst.props = publicProps;
inst.context = publicContext;
inst.refs = emptyObject;
inst.updater = updateQueue;
```

E então você consegue acessar `props` no seu código por uma instância, por exemplo `this.props`.

### Criando uma instância ExampleApplication

Ao chamar `_constructComponent` (3) e passando por diversos métodos de construção, finalmente `new ExampleApplication()` vai ser criado. Esse é o momento que o construtor do nosso código será chamado. Então, é a primeira vez que nosso código foi tocado pelo ecossistema do React. Boa.

### Fazendo a montagem inicial

Então, passamos pela montagem (4) e a primeira coisa que deve acontecer aqui é a chamada de `componentWillMount` (se ele for especificado, claro). É o primeiro método que vemos dos life-cycle hooks. Aliás, um pouco mais abaixo você consegue ver `componentDidMOunt`, mas na verdade ele só é colocado na fila de transação porque ele não deve ser chamado diretamente. Só acontece bem no fim, quando as operações de montagem terminaram. Também, você possivelmente poderia adicionar chamadas `setState` dentro de `componentWillMount`. Nesse caso, o estamo com certeza será re-computado, mas sem chamar o método `render` (não faz sentido, porque o componente ainda não está montado).

A documentação oficial prva isso:

> `componentWillMount()` é invocado imediatamente antes da montagem ocorrer. Ele é chamado antes de `render()`, então mudar o estado nesse método não vai resultar numa re-renderização.

Vamos só olhar o código, só pra ter certeza :)

```javascript
// \src\renderers\shared\stack\reconciler\ReactCompositeComponent.js#476
if (inst.componentWillMount) {
    //..
    inst.componentWillMount();

    // When mounting, calls to `setState` by `componentWillMount` will set
    // `this._pendingStateQueue` without triggering a re-render.
    if (this._pendingStateQueue) {
        inst.state = this._processPendingState(inst.props, inst.context);
    }
}
```

Verdade. Bem, mas quando o `state` é recalculado, nós chamamos o método `render`. Sim, exatamente o que especificamos em nossos componentes! Então, mais um toque no 'nosso' código.

Beleza, agora é criar a instância do componente React. Hm... o que? Parece que já vimos essa chamada `this._instantiateReactComponent`(5) né? É verdade, mas daquela vez instanciamos um `ReactCompositeComponent` para o nosso componente `ExampleAppliaction`. Agora, vamos criar instâncias do DOM Virtual para seu filho baseado no elemento que pegamos do método `render`. Para o nosso caso, o método render retorna `div`, então a representação do DOM Virtual para ele é `ReactDOMComponent`. Quando a instância é criada, chamamos `ReactReconciler.mountComponent` novamente, mas dessa vez como `internalInstance`, nós passamos uma instância de `ReactDOMComponent` recém-criada.

E, chamamos `mountComponent` nela...

### Beleza, terminamos a *Parte 3*.

Vamos recapitular como chegamos aqui. Vamos olhar o esquema mais uma vez, e remover partes redundantes menos importantes e fica assim:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/3/part-3-A.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/3/part-3-A.svg)

<em>3.1 Parte 3 simplificada (clicável)</em>

And we should probably fix spaces and alignment as well:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/3/part-3-B.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/3/part-3-B.svg)

<em>3.2 Parte 3 simplificada & refatorada (clicável)</em>

Boa. Na verdade, é isso o que acontece aqui. Então podemos pegar o essencial da *Parte 3* e usar para o esquema final de `mounting`:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/3/part-3-C.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/3/part-3-C.svg)

<em>3.3 Parte 3 essencial (clicável)</em>

E terminamos!


[Próxima página: Parte 4 >>](./Part-4.md)

[<< Página anterior: Parte 2](./Part-2.md)


[Home](../../README.md)
