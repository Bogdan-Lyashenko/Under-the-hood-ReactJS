## Parte 7

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/7/part-7.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/7/part-7.svg)

<em>7.0 Parte 7 (clicável)</em>

### De volta ao início

Depois da montagem sendo resultado da execução do método, temos elementos HTML prontos para serem inseridos em um documento. Na verdade, `markup` (1) é gerado, mas `mountComponent`, apesar do nome, não é markup HTML. É uma estrutura de dados com campos `children`, `node` (verdadeiros nós do DOM), etc. Mas, temos nosso elemento HTML para inserir no contêiner (aquele especificado como contêiner na chamada `ReactDOM.render`). Enquanto adicionamos no DOM, React vai apagar tudo que estava lá antes. `DOMLazyTree` (2) é uma classe que faz algumas operações com estruturas de dados de árvores, que é o que na verdade fazemos enquanto trabalhamos com o DOM.

A última coisa é `parentNode.insertBefore(tree.node)`(3), em que `parentNode` é o nó contêiner `div` e `tree.node` é nosso nó div `ExampleApplication`. Boa, os elementos HTML que foram criados durante a montagem foram finalmente inseridos no documento.

Então, é isso? Não exatamente. Como pode lembrar, a chamada `mount` foi feito um wrap numa transação. Isso significa que devemos fechá-la. Vamos olhar a lista de wrappers `close`. Basicamente, devemos restaurar alguns comportamentos trancados `ReactInputSelection.restoreSelection()`, `ReactBrowserEventEmitter.setEnabled(previouslyEnabled)`, mas também, precisamos notificar todos os callbacks `this.reactMountReady.notifyAll`(4) que colocamos na fila do `transaction.reactMountReady` antes. Um deles é o nosso conhecido `componentDidMount`, que será disparado exatamente no wrapper `close`.

Agora você tem clareza do que o 'component did mount' significa. Boa!

### Mais uma transação para fechar

Bem, na verdade, essa transação não foi a única. Esquecemos mais uma que foi usada para o wrap da chamada do `ReactMount.batchedMountComponentIntoNode`. Vamos fechá-la também.

Aqui, olhamos o wrapper `ReactUpdates.flushBatchedUpdates`(5), que irá processar `dirtyComponents`. Parece interessante, né? Bem, é uma boa ou má notícia. Acabamos de fazer nossa primeira montagem, então não tem nenhum componente sujo ainda. Isso significa que é uma chamada ociosa. Então, também podemos fechar essa transação e dizer que a estratégia de atualizações em batch terminou.

### Beleza, terminamos a *Parte 7*.

Vamos recapitular como chegamos aqui. Vamos olhar o esquema mais uma vez, e remover partes redundantes menos importantes e fica assim:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/7/part-7-A.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/7/part-7-A.svg)

<em>7.1 Parte 7 simplificada (clicável)</em>

E devemos provavelmente arrumar espaçamento e alinhamento também:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/7/part-7-B.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/7/part-7-B.svg)

<em>7.2 Parte 7 simplificada & refatorada (clicável)</em>

Boa. Na verdade, é isso o que acontece aqui. Então podemos pegar o essencial da *Parte 7* e usar para o esquema final de `mounting`:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/7/part-7-C.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/7/part-7-C.svg)

<em>7.3 Parte 7 essencial (clicável)</em>

E terminamos! Na verdade, terminamos a montagem. Vamos ver abaixo!


[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/7/mounting-parts-C.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/7/mounting-parts-C.svg)

<em>7.4 Montagem (clicável)</em>

[Próxima página: Parte 8 >>](./Part-8.md)

[<< Página anterior: Parte 6](./Part-6.md)


[Home](../../README.md)
