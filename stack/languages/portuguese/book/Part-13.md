## Parte 13

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/13/part-13.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/13/part-13.svg)

<em>13.0 Parte 13 (clicável)</em>

### Receber o componente (próximo elemento, sendo mais preciso)

Bem, pelo `ReactReconciler.receiveComponent` o React na verdade chama `receiveComponente` pelo `ReactDOMComponent` e passa o próximo elemento ali. Faz a reatribuição dele na instância do componente DOM e chama o método de atualização. O método `updateComponent` na verdade faz duas ações: atualiza as propriedades do DOM e os filhos DOM, baseado nas props `prev` e `next`. Bom pra nós, já analisamos o método `_updateDOMProperties` (`src\renderers\dom\shared\ReactDOMComponent.js#946`). Como se lembra, esse método basicamente processa propriedades e atributos de elementos HTML, computa estilos, lida com event listeners, etc. O que sobra é `_updateDOMChildren` (`src\renderers\dom\shared\ReactDOMComponent.js#1076`).

### Beleza, terminamos a *Parte 13*. Essa foi curta.)

Vamos recapitular como chegamos aqui. Vamos olhar o esquema mais uma vez, e remover partes redundantes menos importantes e fica assim:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/13/part-13-A.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/13/part-13-A.svg)

<em>13.1 Parte 13 simplificada (clicável)</em>

E devemos provavelmente arrumar espaçamento e alinhamento também:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/13/part-13-B.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/13/part-13-B.svg)

<em>13.2 Parte 13 simplificada & refatorada (clicável)</em>

Boa. Na verdade, é isso o que acontece aqui. Então podemos pegar o essencial da *Parte 13* e usar para o esquema final de `updating`:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/13/part-13-C.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/13/part-13-C.svg)

<em>13.3 Parte 13 essencial (clicável)</em>

E terminamos!


[Próxima página: Parte 14 >>](./Part-14.md)

[<< Página anterior: Parte 12](./Part-12.md)


[Home](../../README.md)
