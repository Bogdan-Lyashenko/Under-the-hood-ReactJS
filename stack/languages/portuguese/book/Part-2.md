## Parte 2

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/2/part-2.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/2/part-2.svg)

<em>2.0 Parte 2 (clicável)</em>

### Mais uma transação

Dessa vez é `ReactReconcileTransaction`. Como você já sabe, o que mais nos interessa é o wrapper da transação. Existem três wrappers:

```javascript
//\src\renderers\dom\client\ReactReconcileTransaction.js#89
var TRANSACTION_WRAPPERS = [
  SELECTION_RESTORATION,
  EVENT_SUPPRESSION,
  ON_DOM_READY_QUEUEING,
];
```

Como podemos ver esses wrappers são mais usados para **manter o estado atual**, travar alguns valores mutáveis antes de chamadas de métodos, e liberá-los após. Então, o React se assegura que, por exemplo, a lista de seleção (o input de texto atualmente selecionado) não é atrapalhado pelo realização da transação (ser selecionado no `initialize` e restaurar no `close`). Ele também suprime eventos (foco/blur) que podem ser despachados inadvertidamente devido a manipulações de alto nível no DOM (como temporariamente remover um input de texto do DOM) então ele **desabilita `ReactBrowserEventEmitter`** no `initialize` e habilita no `close`.

Bem, estamos bem próximos de iniciar a montagem do componente, que vai nos retornar um markup pronto pra ser colocado no DOM. Na verdade `ReactReconciler.mountComponent` é apenas um wrapper, ou, é mais correto dizer "mediador". Ele delega o método de montagem para os módulos de componentes. Esse é um momento importante, então vamos destacá-lo:

> O módulo`ReactReconciler` sempre é chamado em casos que a implementação de alguma lógica **depende da plataforma**, como esse caso. Montagem é diferente por plataforma, então o "módulo principal" conversa com o `ReactReconciler` e `ReactReconciler` sabe o que fazer depois.

Beleza, vamos para o método do componente `mountComponent`. Provavelmente esse método você já ouviu falar. Ele inicializa o componente, renderiza o markup, e registra os event listeners. Depois de um longo caminho, finalmente vemos uma chamada de montagem de componente. Depois de chamar a montagem, devemos pegar os elementos HTML que por sua vez podem ser colocados no documento.

### Beleza, terminamos a *Parte 2*.

Vamos recapitular como chegamos aqui. Vamos olhar o esquema mais uma vez, e remover partes redundantes menos importantes e fica assim:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/2/part-2-A.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/2/part-2-A.svg)

<em>2.1 Parte 2 simplificada (clicável)</em>

E devemos provavelmente arrumar espaçamento e alinhamento também:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/2/part-2-B.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/2/part-2-B.svg)

<em>2.2 Parte 2 simplificada & refatorada (clicável)</em>

Boa. Na verdade, é isso o que acontece aqui. Então podemos pegar o essencial da *Parte 2* e usar para o esquema final de `mounting`:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/2/part-2-C.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/2/part-2-C.svg)

<em>2.3 Parte 2 essencial (clicável)</em>

E terminamos!


[Próxima página: Parte 3 >>](./Part-3.md)

[<< Página anterior: Parte 1](./Part-1.md)


[Home](../../README.md)
