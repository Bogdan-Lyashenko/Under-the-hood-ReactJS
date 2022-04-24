## Parte 6

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/6/part-6.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/6/part-6.svg)

<em>6.0 Parte 6 (clicável)</em>

### Criar os filhos iniciais

Parece que o elemento em si terminou, então podemos continuar com os filhos. Dois passos aqui: filhos devem ser montados (`this.mountChildren`)(1) e conectados ao pai (`DOMLazyTree.queueChild`)(2). Vamos olhar para a montagem dos filhos porque é obviamente mais interessante.

Existe um módulo separado chamado `ReactMultiChild` (`src\renderers\shared\stack\reconciler\ReactMultiChild.js`) para gerenciar filhos. Boa, vamos olhar o método `mountChildren` então. Ele também contém duas principais tarefas. Primeiro, instaciamos os filhos (usando `ReactChildReconciler` pra isso) e montamos. O que os filhos são aqui? Podem ser uma simples tag HTML ou outro componente customizado. Para lidar com o HTML precisamos instaciar `ReactDOMComponent` e para componentes customizados `ReactCompositeComponent`. O fluxo de montagem, de novo, depende de qual tipo de filho ele é.

### Mais uma vez

Se você ainda está lendo isso, provavelmente é hora de clarificar e revisar o processo geral mais uma vez. Vamos fazer uma pausa e recoletar a sequência de objetos.

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/6/overall-mounting-scheme.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/6/overall-mounting-scheme.svg)

<em>6.1 Esquema geral de montagem (clicável)</em>

1) React instancia `ReactCompositeComponent` pra cada um de seus componentes customizados (com lifecycle hooks como `componentWillMount`, etc.) e o monta.

2) Durante a montagem, inicialmente, uma instância de seu componente customizado será criada (`constructor` é chamado).

3) Então, o método render é chamado (para um exemplo simples, render retorna `div`) e `React.createElement` cria os elementos React. Ele pode ser chamado diretamente ou depois do parsing do JSX pelo Babel e substituindo tags na sua renderização. Mas, não é exatamente o que precisamos, vamos ver o próximo abaixo.

4) Precisamos de um componente DOM para nossa `div`. Então, durante o processo de instanciação, criamos instâncias do `ReactDOMComponent` pelos elementos-objetos (mencionados acima).

5) Então, precisamos montar o componente DOM. Isso significa que criamos os elementos DOM e atribuímos event listeners, etc.

6) Então, processamos os filhos iniciais do nosso componente DOM. Criamos instâncias deles e os montamos também. Dependendo do que cada item dos filhos são, uma componente customizado ou só uma tag HTML, voltamos para o passo 1) ou 5) respectivamente. E então novamente para todos os elementos aninhados.

É isso. Bem direto como pode ver.

Então, a montagem basicamente terminou. Terminou o método `componentDidMount`! Parabéns.

### Beleza, terminamos a *Parte 6*.

Vamos recapitular como chegamos aqui. Vamos olhar o esquema mais uma vez, e remover partes redundantes menos importantes e fica assim:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/6/part-6-A.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/6/part-6-A.svg)

<em>6.2 Parte 6 simplificada (clicável)</em>

E devemos provavelmente arrumar espaçamento e alinhamento também:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/6/part-6-B.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/6/part-6-B.svg)

<em>6.3 Parte 6 simplificada & refatorada (clicável)</em>

Boa. Na verdade, é isso o que acontece aqui. Então podemos pegar o essencial da *Parte 2* e usar para o esquema final de `mounting`:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/6/part-6-C.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/6/part-6-C.svg)

<em>6.4 Parte 6 essencial (clicável)</em>

E terminamos!


[Próxima página: Part 7 >>](./Part-7.md)

[<< Página anterior: Part 5](./Part-5.md)


[Home](../../README.md)
