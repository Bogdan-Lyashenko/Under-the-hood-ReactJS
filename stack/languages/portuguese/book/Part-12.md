## Parte 12

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/12/part-12.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/12/part-12.svg)

<em>12.0 Parte 12 (clicável)</em>

### Se componentes devem realmente atualizar..

É bem no início da atualização, isso significa que é um bom lugar para chamar o hook `componentWillUpdate` se ele foi especificado (1). Então re-renderizamos o componente e enfileiramos a chamada de mais um método bem conhecido, o `componentDidUpdate` (adiamos a chamada, porque ele deve ser chamado bem no fim da atualização).
E a re-renderização? Na verdade, o que precisamos fazer aqui é chamar o método `render` do componente e atualizar o DOM de acordo. Então, o primeiro passo, chamamos o método `render` (2) da nossa instância (`ExampleApplication`) e guardamos o resultado da renderização (elementos React que foram retornados de uma chamada de método). Então, comparamos ao elemento previamente renderizado e vemos se o DOM deve ser realmente atualizado.

Essa é uma das melhores features do React, ele evita atualizações redundantes do DOM, o que faz a performance dele ser muito boa.
Pelo comentário no código, o método `shouldUpdateReactComponent` (3):
> 'determina se a instância existente deve ser atualizada ao invés de ser destruída ou substituída por uma nova instância'.

Então, resumindo, o método checa se o elemento deve ser completamente substituído, ou seja, o antigo deve ser `unmounted` primeiro, o novo elemento (pegamos do `render`) deve ser montado e markup, recebendo pelo método `mount`, deve ser colocado ao invés do elemento atual, ou, se o elemento deve ser parcialmente atualizado. A principal razão para substituir o elemento completamente é o caso de quando o novo elemento está vazio (foi removido pela lógica do `render`) ou o seu tipo é diferente, ex. era `div` mas agora é outra coisa. Vamos ver o código, é bem simples.

```javascript
///src/renderers/shared/shared/shouldUpdateReactComponent.js#25

function shouldUpdateReactComponent(prevElement, nextElement) {
    var prevEmpty = prevElement === null || prevElement === false;
    var nextEmpty = nextElement === null || nextElement === false;
    if (prevEmpty || nextEmpty) {
        return prevEmpty === nextEmpty;
    }

    var prevType = typeof prevElement;
    var nextType = typeof nextElement;
    if (prevType === 'string' || prevType === 'number') {
        return (nextType === 'string' || nextType === 'number');
    } else {
        return (
            nextType === 'object' &&
            prevElement.type === nextElement.type &&
            prevElement.key === nextElement.key
        );
    }
}
```

Beleza, no caso do nosso `ExampleApplication` nós acabamos de atualizar a propriedade `state` o que não afeta muito o `render` então vamos com o segundo cenário, ou seja `update`.

### Beleza, terminamos a *Parte 12*.

Vamos recapitular como chegamos aqui. Vamos olhar o esquema mais uma vez, e remover partes redundantes menos importantes e fica assim:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/12/part-12-A.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/12/part-12-A.svg)

<em>12.1 Parte 12 simplificada (clicável)</em>

E devemos provavelmente arrumar espaçamento e alinhamento também:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/12/part-12-B.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/12/part-12-B.svg)

<em>12.2 Parte 12 simplificada & refatorada (clicável)</em>

Boa. Na verdade, é isso o que acontece aqui. Então podemos pegar o essencial da *Parte 12* e usar para o esquema final de `updating`:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/12/part-12-C.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/12/part-12-C.svg)

<em>12.3 Parte 12 essencial (clicável)</em>

E terminamos!


[Próxima página: Parte 13 >>](./Part-13.md)

[<< Página anterior: Parte 11](./Part-11.md)


[Home](../../README.md)
