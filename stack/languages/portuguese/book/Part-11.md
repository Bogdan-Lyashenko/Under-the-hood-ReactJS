## Parte 11

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/11/part-11.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/11/part-11.svg)

<em>11.0 Parte 11 (clicável)</em>

### Atualizar componente

Comentário no código que descreve o método diz:

> 'Fazer uma atualização em um componente montado. Os métodos componentWillReceiveProps e shouldComponentUpdate são chamados e então (assumindo que o estado não é pulado) os métodos de atualização do lifecycle que sobraram são chamados e a representação do DOM é atualizada. Por padrão, isso implementa o algoritmo de renderização e reconciliação do React. Clientes sofisticados podem querer sobrescrever isso.'

Beleza... parece fazer sentido.

A primeira coisa que checamos é se as `props` foram mudadas, tecnicamente, o método `updateComponent` pode ser chamado em dois cenários diferentes se `setState` foi chamado ou `props` mudarem. Se `props` foi realmente mudada, então o método de life-cycle `componentWillReceiveProps` será chamado. Depois, React recalcula o `nextState` (2) baseado no `pending state queue` (fila de objetos de estado parcial que fizemos antes, no nosso caso a fila será algo como [{message: "click state message"}]). Claro, no caso de apenas atualização da `props` o estado não será alterado.

Bem, próximo passo, nós fazemos o `shouldUpdate` ter o valor padrão `true` (3). É por isso que quando `shouldComponentUpdate` não está especificado, o componente é atualizado por padrão. Então, checamos se não é `force update`. Como você sabe, é possível chamar `forceUpdate` do componente para atualizá-lo, ao invés de mudar `state` ou `props`, mas, de acordo com a documentação oficial do React, usar esse método é má-prática. Então, no caso de um force update o componente vai ser atualizado permanentemente, se não o método `shouldComponentUpdate` será chamado, e `shouldUpdate` será re-atribuído com o resultado do valor. Se for determinado que um componente não deva ser atualizado, o React ainda precisa setar `props` e `state` mas encurta o resto da atualização.

### Beleza, terminamos a *Parte 11*.

Vamos recapitular como chegamos aqui. Vamos olhar o esquema mais uma vez, e remover partes redundantes menos importantes e fica assim:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/11/part-11-A.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/11/part-11-A.svg)

<em>11.1 Parte 11 simplificada (clicável)</em>

E devemos provavelmente arrumar espaçamento e alinhamento também:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/11/part-11-B.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/11/part-11-B.svg)

<em>11.2 Parte 11 simplificada & refatorada (clicável)</em>

Boa. Na verdade, é isso o que acontece aqui. Então podemos pegar o essencial da *Parte 11* e usar para o esquema final de `updating`:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/11/part-11-C.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/11/part-11-C.svg)

<em>11.3 Parte 11 essencial (clicável)</em>

E terminamos!


[Próxima página: Part 12 >>](./Part-12.md)

[<< Página anterior: Part 10](./Part-10.md)


[Home](../../README.md)
