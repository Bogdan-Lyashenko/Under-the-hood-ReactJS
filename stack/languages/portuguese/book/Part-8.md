## Parte 8

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/8/part-8.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/8/part-8.svg)

<em>8.0 Parte 8 (clicável)</em>

### `this.setState`

Sabemos como a montagem funciona, mas agora, vamos pro outro lado. Sim, o método `setStade`, mais um pedaço do bolo!

Antes de tudo, por que podemos chamar um método chamado `setState`? Bem, isso é bem claro, herdamos nosso componente pelo `ReactComponent`. Beleza, então é fácil achar essa classe no código do React e olhar esse método `setState`.

```javascript
//src\isomorphic\modern\class\ReactComponent.js#68
this.updater.enqueueSetState(this, partialState)
```
Como pode ver, existe uma interface `updater`. Mas o que `updater` é? Bem, se você checar o processo de montagem que acabamos de analisar, durante `mountComponent`, a instância recebe a propriedade `updater` como uma referência a `ReactUpdateQueue` (`src\renderers\shared\stack\reconciler\ReactUpdateQueue.js`).

Bem, indo fundo dentro do método `enqueueSetState` (1) e vendo que, primeiramente, ele passa o estado parcial (uma estado parcial é um objeto que você passa pelo `this.setState`) para `_pendingStateQueue` (2) de instância interna (apenas pra lembrar: instância pública é na verdade nosso componente customizado `ExampleApplication` e, instância interna é o `ReactCompositeComponent` que foi criado durante a montagem), depois, fazemos o `enqueueUpdate`, que checa se atualizações estão em progresso e colocam nosso componente na lsita de `dirtyComponents`, se não, iniciamos a transação de atualização e colocamos o componente na lista de `dirtyComponents`.

Resumindo, cada componente possui sua própria lista de estados pendentes, ou seja, cada vez que você chama `setState` em uma transação, você só está colocando os objetos numa fila e então depois eles serão mergeados num estado do componente um a um. E, quando você chama `setState`, você adiciona seu componente na lista de `dirtyComponents`. Provavelmente, você está pensando, como o `dirtyComponents` é processado? Certo, essa é a próxima parte importante do quebra-cabeças...

### Beleza, terminamos a *Parte 8*.

Vamos recapitular como chegamos aqui. Vamos olhar o esquema mais uma vez, e remover partes redundantes menos importantes e fica assim:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/8/part-8-A.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/8/part-8-A.svg)

<em>8.1 Parte 8 simplificada (clicável)</em>

E devemos provavelmente arrumar espaçamento e alinhamento também:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/8/part-8-B.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/8/part-8-B.svg)

<em>8.2 Parte 8 simplificada & refatorada (clicável)</em>

Boa. Na verdade, é isso o que acontece aqui. Então podemos pegar o essencial da *Parte 8* e usar para o esquema final de `updating`:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/8/part-8-C.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/8/part-8-C.svg)

<em>8.3 Parte 8 essencial (clicável)</em>

E terminamos!


[Próxima página: Parte 9 >>](./Part-9.md)

[<< Página anterior: Parte 7](./Part-7.md)


[Home](../../README.md)
