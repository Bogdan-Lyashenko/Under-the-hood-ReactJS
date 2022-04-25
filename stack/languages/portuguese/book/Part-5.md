## Parte 5

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/5/part-5.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/5/part-5.svg)

<em>5.0 Parte 5 (clicável)</em>

### Atualizar propriedades DOM

Beleza, isso dá um pouco de medo né? A ideia principal é aplicar o diff de forma eficiente da `props` antiga e a nova. Olha o comentário do método no código:

> "Reconcilia as propriedades ao detectar diferenças nos valores da propriedade e atualiza o DOM como necessário. Essa função é provavelmente a parte mais crítica para otimização de performance."

São dois loops na verdade. Primeiro, pelo `props` anterior e depois pelo próximo `props`. No nosso caso, com a montagem, `lastProps` (anterior) é vazia (obviamente, é a primeira vez que atribuímos props), mas, vamos ver o que está acontecendo aqui.

### Último loop em `props`

No primeiro passo, checamos se `nextProps` contém o mesmo valor. Se sim, apenas pulamos, porque vai ser tratado depois no próximo loop de `nextProps`. Então, resetamos os valores de estilo, deletamos event listeners (se eles tiverem sido setados antes), e removemos os atributos e propriedades do DOM. Para atributos, conferimos que não são uma das `RESERVED_PROPS`, que é `prop`, como `children` ou `dangerouslySetInnerHTML`.

### Próximo loop em `props`

Aqui, o primeiro passo é checar se `prop` mudou, ou seja se o próximo valor é diferente do antigo. Se não, não fazemos nada. Para `styles` (você pode ter notado que é tratado de forma levemente diferente) nós atualizamos os valores que mudaram desde `lastProp`. Então, adicionamos os event listeners (sim, exatamente aqueles como `onClick`, etc.). Vamos analisar com mais detalhes.

O importante é, por todo o app React, todo trabalho é passado por eventos 'sintéticos'. Nada especial, são só mais alguns wrappers para um trabalho mais eficiente. A próxima coisa, o módulo mediador para gerenciar event listeners é `EventPluginHub` (`src\renderers\shared\stack\event\EventPluginHub.js`). Ele contém um mapa `listenerBank` para cacheamento e gerenciar todos os listeners.

Nós vamos adicionar nossos event listeners mas não agora. O ponto é que devemos adicionar listeners quando o componente e o elemento DOM está pronto para lidar com eventos. Parece que atrasamos a execução aqui, mas você pode se perguntar, como saberemos quando esse momento chegar? Bem, é hora da próxima resposta! Você lembra que passamos `transaction` por todos os métodos e chamadas? Exatamente! Fizemos isso porque pode ser útil exatamente para esse tipo de situação. Vamos ver o código.

```javascript
//src\renderers\dom\shared\ReactDOMComponent.js#222
transaction.getReactMountReady().enqueue(putListener, {
    inst: inst,
    registrationName: registrationName,
    listener: listener,
});
```

Ok, depois dos event listeners, setamos os atributos e valores do DOM. Assim como antes, pra atributos precisamos ter certeza que não são uma das `RESERVED_PROPS`, que é uma `prop`, como `children` ou `dangerouslySetInnerHTML`.

Durante o processamento da última e próxima props, computamos a configuração de `styleUpdates` e passamos para o módulo `CSSPropertyOperations`.

Terminamos de atualizar as propriedades. Seguimos.

### Beleza, terminamos a *Parte 5*.

Vamos recapitular como chegamos aqui. Vamos olhar o esquema mais uma vez, e remover partes redundantes menos importantes e fica assim:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/5/part-5-A.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/5/part-5-A.svg)

<em>5.1 Parte 5 simplificada (clicável)</em>

E devemos provavelmente arrumar espaçamento e alinhamento também:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/5/part-5-B.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/5/part-5-B.svg)

<em>5.2 Parte 5 simplificada & refatorada (clicável)</em>

Boa. Na verdade, é isso o que acontece aqui. Então podemos pegar o essencial da *Parte 5* e usar para o esquema final de `mounting`:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/5/part-5-C.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/5/part-5-C.svg)

<em>5.3 Parte 5 essencial (clicável)</em>

E terminamos!


[Próxima página: Parte 6 >>](./Part-6.md)

[<< Página anterior: Parte 4](./Part-4.md)


[Home](../../README.md)
