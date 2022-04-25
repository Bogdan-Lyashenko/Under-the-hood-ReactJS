## Parte 9

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/9/part-9.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/9/part-9.svg)

<em>9.0 Parte 9 (clicável)</em>

### Vamos voltar um pouco...

Como você percebeu no esquema, a chamada do método do `setState`, pode ser disparada de várias formas, com ou sem impacto externo (ou seja, 'ação do usuário'). Vamos pegar dois casos: no primeiro caso, a chamada do método é disparada pelo clique do mouse, e depois, vem do `setTimeout` no `componentDidMount`.

O que realmente faz essa diferença? Bem, como você se lembra, o React processa atualizações em massa (`batches`), isso significa que a lista de atualizações devem ser de alguma forma coletadas e depois fazer o `flush`. Mas quando o evento do mouse aparece, ele é tratado no topo e depois, passando por diversas camadas de wrappers, a atualização vai iniciar. 

Aliás, como pode ver isso acontece somente se `ReactEventListener` está `enabled` (1), e, se você se lembra, durante a fase de montagem do componente, um dos wrappers de `ReactReconcileTransaction` o desabilita e faz a montagem ser segura. Inteligente! Mas, e o caso do `setTimeout`? Também é simples, antes de colocar um componente na lista de `dirtyComponents`, o React vai se certificar que a transação iniciou (foi aberta), e então depois, vai ser fechada e fazer o flush das atualizações.

Como você sabe, React implementa 'eventos sintéticos', um 'açúcar sintático' que na verdade faz o wrap em eventos nativos. Mas depois, eles ainda tentam se comportar como estamos acostumados com eventos. Você pode ver o comentário no código:

> 'Para ajudar o desenvolvimento podemos ter uma melhor integração com ferramentas dev ao simular um evento real do browser'

```javascript
var fakeNode = document.createElement('react');

ReactErrorUtils.invokeGuardedCallback = function (name, func, a) {
      var boundFunc = func.bind(null, a);
      var evtType = 'react-' + name;

      fakeNode.addEventListener(evtType, boundFunc, false);

      var evt = document.createEvent('Event');
      evt.initEvent(evtType, false, false);

      fakeNode.dispatchEvent(evt);
      fakeNode.removeEventListener(evtType, boundFunc, false);
};
```
Beleza, de volta às nossas atualizações mais uma vez. A abordagem é:

1. Chamar setState
2. Abrir transação de batching se não estiver aberta ainda
3. Adicionar componentes afetados à lista `dirtyComponents`
4. Fechar transação chamando `ReactUpdates.flushBatchedUpdates`, que na verdade significa 'processar tudo que foi coletado no `dirtyComponents`'.

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/9/set-state-update-start.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/9/set-state-update-start.svg)

<em>9.1 `setState` inicia (clicável)</em>

### Beleza, terminamos a *Parte 9*.

Vamos recapitular como chegamos aqui. Vamos olhar o esquema mais uma vez, e remover partes redundantes menos importantes e fica assim:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/9/part-9-A.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/9/part-9-A.svg)

<em>9.2 Parte 9 simplificada (clicável)</em>

E devemos provavelmente arrumar espaçamento e alinhamento também:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/9/part-9-B.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/9/part-9-B.svg)

<em>9.3 Parte 9 simplificada & refatorada (clicável)</em>

Boa. Na verdade, é isso o que acontece aqui. Então podemos pegar o essencial da *Parte 9* e usar para o esquema final de `updating`:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/9/part-9-C.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/9/part-9-C.svg)

<em>9.6 Parte 9 essencial (clicável)</em>

E terminamos!


[Próxima página: Parte 10 >>](./Part-10.md)

[<< Página anterior: Parte 8](./Part-8.md)


[Home](../../README.md)
