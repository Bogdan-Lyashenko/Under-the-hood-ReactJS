## Part 0

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/0/part-0.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/0/part-0.svg)

<em>0.0 Parte 0 (clicável)</em>

### ReactDOM.render
Beleza, vamos começar com a chamada do ReactDOM.render.

O ponto de entrada é ReactDom.render. Nosso app inicia sua renderização no DOM por aqui. Criei um componente simples `<ExampleApplication/>` para debuggar mais facilmente. Então, a primeira coisa que acontece é **JSX vai ser transformado em elementos React**. Eles são bem simples, quase objetos em uma estrutura simples. Eles apenas representam o que foi retornado da renderização do componente, nada mais. Alguns campos já devem ser familiares como props, key e ref. Property type se refere ao objeto markup descrito pelo JSX. Então, no nosso caso, é a classe `ExampleApplication`, mas também pode ser apenas a string `button` pra tag Button, etc. Também, durante a criação do elemento React, React vai mergear `defaultProps` com `props` (se tiverem sido especificadas) e validar `propTypes`.

Dá uma olhada no código fonte pra mais detalhes: `src\isomorphic\classic\element\ReactElement.js`.

### ReactMount
Você pode ver o módulo chamado `ReactMount` (01). Ele contém a lógica da montagem de componentes. Na verdade, não existe lógica dentro do `ReactDOM`, é apenas uma interface pra trabalhar com o `ReactMount`, então quando você chama `ReactDOM.render` você tecnicamente chama `ReactMount.render`. O que é essa montagem?
> Montagem é o processo de inicializar um componente React ao criar seus elementos DOM representativos e inserindo eles no `container` fornecido.

Pelo menos o comentário no código descreve dessa forma. Bem, o que isso realmente quer dizer? Beleza, vamos imaginar a próxima transformação:


[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/0/mounting-scheme-1-small.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/0/mounting-scheme-1-small.svg)

<em>0.1 JSX para HTML (clicável)</em>

React precisa **transformar as descrições do(s) seu(s) componente(s) em HTML** para colocá-los em um documento. Como fazemos chegar lá? Ele precisa lidar com todas **props, event listeners, compenentes aninhados** e lógica. É necessário granular sua descrição alto nível (componentes) para dados baixo nível (HTML) que podem ser colocados numa página web. Isso é tudo que a montagem é.


[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/0/mounting-scheme-1-big.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/0/mounting-scheme-1-big.svg)

<em>0.1 JSX para HTML, estendido (clicável)</em>

Beleza, vamos continuar. Mas... é hora de fatos interessantes! Sim, vamos falar algumas coisas interessantes durante nossa jornada, pra ser mais "divertido".

>  Fato interessante: Tenha certeza que o scroll é monitorado (02)

> Engraçado, durante a primeira renderização do componente raiz, o React inicia scroll listeners e cacheia valores do scroll pra que a o código da aplicação consiga acessá-los sem que seja trigado reflows. Na verdade, devido a diferentes implementações de renderizações em browsers, alguns dos valores do DOM não são estáticos, eles são calculados toda vez que você os usa no código. Claro, isso afeta a performance. Na verdade, é apenas pra browsers mais antigos, que não suportam `pageX` e `pageY`. React tenta otimizar isso também. Legal. Como pode ver, fazer uma ferramenta rápida requer o uso de várias técnicas, essa do scroll é um bom exemplo.

### Instanciar o componente React

Olhe para o esquema, há uma criação de instância pelo número (03). Bem, é muito cedo para criar uma instância do `<ExampleApplication />` aqui. Na verdade, nós instanciamos `TopLevelWrapper` (classe interna do React). Vamos dar uma olhada no próximo esquema primeiro.

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/0/jsx-to-vdom.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/0/jsx-to-vdom.svg)

<em>0.3 JSX para VDOM (clicável)</em>

Você pode ver três fases, JSX para elementos React serão convertidos em um dos tipos internos de componentes React:
`ReactCompositeComponent` (para nossos próprios componentes), `ReactDOMComponent` (para tags HTML), e `ReactDOMTextComponent` (para nós de texto). Vamos omitir `ReactDOMTextComponent` e vamos apenas focar nos dois primeiros

Componentes internos? Interessante. Você já ouviu falar sobre **DOM Virtual** certo? DOM Virtual é meio que um componente interno do DOM que é usado pelo React pra não tocar diretamente no DOM durante as computações de diff e etc. Isso faz React ser rápido! Mas, na verdade, não há arquivos ou classes dentro do código fonte do React chamado "DOM Virtual". Estranho né? Bem, é porque o DOM Virtual é apenas um conceito, uma maneira de como trabalhar com o DOM real. Então, algumas pessoas dizem que o DOM Virtual se referem aos elementos React, mas na minha opinião, não é bem isso. Acho que o DOM Virtual se refere a essas três classes: `ReactCompositeComponent`, `ReactDOMComponent`, `ReactDOMTextComponent`. Você vai ver mais tarde o porquê.

OK, vamos terminar nossa instanciação aqui. Vamos criar uma instância de `ReactCompositeComponent`, mas na verdade não é porque colocamos `<ExampleApplication/>` no `ReactDOM.render`. React sempre inicia a renderização da árvore do componente pelo `TopLevelWrapper`. É como se fosse um wrapper ocioso, seu `render` (método de render do componente) vai retornar mais tarde `<ExampleApplication/>`, e só.

```javascript
//src\renderers\dom\client\ReactMount.js#277
TopLevelWrapper.prototype.render = function () {
  return this.props.child;
};

```

Então, só `TopLevelWrapper` é criado, nada mais por enquanto. Continuando. Mas... antes, um fato interessante!
>  Fato interessante: Validando DOM Nesting

> Quase sempre que componentes aninhados estão renderizando, eles estão sendo validados por um módulo dedicado para validação HTML chamado `validateDOMNesting`. Validação de DOM nesting significa verificação da hierarquia de tags `filho -> pai`. Por exemplo se uma tag pai é `<select>`, a tag filha deve ser apenas uma dessas: `option`, `optgroup`, ou `#text`. Essas regras são definidas em https://html.spec.whatwg.org/multipage/syntax.html#parsing-main-inselect. Você provavelmente já viu esse módulo em ação, ele popula errors como:
<em> &lt;div&gt; cannot appear as a descendant of &lt;p&gt; </em>.

### Beleza, terminamos a **Parte 0**

Vamos recapitular o que vimos aqui. Vamos olhar para o esquema mais uma vez, remover as partes redundantes menos importantes e fica assim:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/0/part-0-A.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/0/part-0-A.svg)

<em>0.4 Parte 0 simplificada (clicável)</em>

E provavelmente devemos arrumar espaços e alinhamentos também:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/0/part-0-B.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/0/part-0-B.svg)

<em>0.5 Parte 0 simplificado & refatorado (clicável)</em>

Boa. Na verdade, é isso que acontece aqui. Então podemos pegar o essencial da *Parte 0* e usar para o esquema final da `montagem`:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/0/part-0-C.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/0/part-0-C.svg)

<em>0.6 Parte 0 essencial (clicável)</em>

E terminamos!


[Próxima página: Parte 1 >>](./Part-1.md)

[<< Página anterior: Intro](./Intro.md)


[Home](../../README.md)
