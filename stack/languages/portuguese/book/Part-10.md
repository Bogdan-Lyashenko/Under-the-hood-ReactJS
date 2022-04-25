## Parte 10

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/10/part-10.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/10/part-10.svg)

<em>10.0 Parte 10 (clicável)</em>

### Componentes sujos

Como pode ver, o React faz o loop pelo `dirtyComponents`(1), e chama `ReactUpdates.runBatchedUpdates`(2), pela transação! Transação? A nova, mas por quê? Vamos ver.

O tipo de transação é `ReactUpdatesFlushTransaction` e, como já mencionamos antes, precisamos checar os `wrappers` pra entender o que a transação realmente faz. Uma pequena dica do comentário do código:

> 'Os wrappers do ReactUpdatesFlushTransaction vão limpar o array do dirtyComponents e fazer qualquer atualização enfileirada pelos handlers prontos para montagem (ou seja, componentDidUpdate)'

Mas, de toda forma, precisamos provar isso. Existem dois wrappers `NESTED_UPDATES` e `UPDATE_QUEUEING`. Na fase `initialize` armazenamos `dirtyComponentsLength` (3) e, como pode ver no `close`, React compara, talvez durante a atualização o número de flush dos componentes sujos mudou, então obviamente é necessário rodar `flushBatchedUpdates` mais uma vez. Sem mágica, tudo bem direto.

Bem... uma mágica na verdade acontece. `ReactUpdatesFlushTransaction` sobrescreve o método `Transaction.perform`, porque... na verdade ele precisa do comportamento do `ReactReconcileTransaction` (transação que é usada durante a montagem e permite manter o estado do app seguro). Então, dentro do método `ReactUpdatesFlushTransaction.perform`, `ReactReconcileTransaction` é usado também, então é feito o wrapper do método da transação mais uma vez

Tecnicamente, ele tem essa cara:

```javascript
[NESTED_UPDATES, UPDATE_QUEUEING].initialize()
[SELECTION_RESTORATION, EVENT_SUPPRESSION, ON_DOM_READY_QUEUEING].initialize()

method -> ReactUpdates.runBatchedUpdates

[SELECTION_RESTORATION, EVENT_SUPPRESSION, ON_DOM_READY_QUEUEING].close()
[NESTED_UPDATES, UPDATE_QUEUEING].close()
```

Vamos voltar a transação no final para ter certeza de como isso ajuda a terminar o trabalho do método, mas agora vamos ver os detalhes do `ReactUpdates.runBatchedUpdates`(2) (`\src\renderers\shared\stack\reconciler\ReactUpdates.js#125`).

A primeira coisa que devemos fazer logo no início é ordenar o array do `dirtyComponents`. Como ordenar? Pelo `mount order` (número inteiro que foi setado para um componente quando a instância foi montada), isso significa que os pais (que foram montados primeiro) serão atualizados primeiros, os filhos depois, assim por diante.

O próximo passo é aumentarmos o `updateBatchNumber`, é algo como o ID para a reconciliação atual. De acordo com o comentário no código:

> 'Qualquer atualização enfileirada durante a reconciliação precisar ser feitas depois desse batch inteiro. Se não, se o dirtyComponents é [A, B] onde A possui filhos B e C, B poderia ser atualizado duas vezes num único batch se a renderização do C enfilera uma atualização ao B (já que B já foi atualizado, deveríamos pulá-lo, e a única forma de saber se foi é checando a contagem do batch).'

Isso ajuda a evitar atualizações duplicadas para os mesmos componentes.

Parabéns, agora fazemos o loop pelo `dirtyComponents` e passamos cada componente pro `ReactReconciler.performUpdateIfNecessary` (5), onde o método `performUpdateIfNecessary` será chamado pela instância `ReactCompositeComponent`, então, vamos para o código do `ReactCompositeComponent` novamente e seu método `updateComponent`. Podemos achar algo interessante para nós, então, vamos olhar mais a fundo.

### Beleza, terminamos a *Parte 10*.

Vamos recapitular como chegamos aqui. Vamos olhar o esquema mais uma vez, e remover partes redundantes menos importantes e fica assim:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/10/part-10-A.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/10/part-10-A.svg)

<em>10.1 Parte 10 simplificada (clicável)</em>

E devemos provavelmente arrumar espaçamento e alinhamento também:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/10/part-10-B.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/10/part-10-B.svg)

<em>10.2 Parte 10 simplificada & refatorada (clicável)</em>

Boa. Na verdade, é isso o que acontece aqui. Então podemos pegar o essencial da *Parte 10* e usar para o esquema final de `updating`:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/10/part-10-C.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/10/part-10-C.svg)

<em>10.3 Parte 10 essencial (clicável)</em>

E terminamos!


[Próxima página: Parte 11 >>](./Part-11.md)

[<< Página anterior: Parte 9](./Part-9.md)


[Home](../../README.md)
