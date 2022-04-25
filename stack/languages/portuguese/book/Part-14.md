## Parte 14

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/14/part-14.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/14/part-14.svg)

<em>14.0 Parte 14 (clicável)</em>

### A última!

O método reconcilia os filhos com as várias propriedades que afetam o conteúdo deles. Há muitos possíveis cenários, mas tecnicamente apenas dois grandes casos. Ou os filhos ainda são 'complexos', ou seja, são componentes React e o React deve passar várias vezes pelas suas camadas até chegar ao nível de conteúdo, ou, os filhos são simples, strings ou números (conteúdo).

O switcher é um tipo de `nextProps.children` (1), e para nosso caso, temos o componente `ExampleApplication` com três filhos: `button`, `ChildCmp` e `text string`.

Beleza, vamos ver como ele funciona.

A primeira iteração com `ExampleApplication children`. Obviamente, o tipo de filho não é 'conteúdo', então vamos para o caso 'complexo'. Pegamos todos os filhos e, um a um passamos por praticamente o mesmo cenário que fizemos com seu componente pai. Aliás, a parte de verificação do `shouldUpdateReactComponent` (2) pode confundir, parece que a verificação verifica a atualização ou não, mas na verdade, ele checa atualização ou deleta&cria (nós pulamos o ramo de NÃO no esquema pra manter simples). Também, depois, comparamos os filhos antigos e os atuais e se algum tiver sido removido, desmontamos o componente e também o removemos.

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/14/children-update.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/14/children-update.svg)

<em>14.1 Atualização dos filhos (clicável)</em>

Então, na segunda iteração, processamos `button`, esse será nosso caso simples, porque o tipo do botão `children` é do tipo 'text', porque o botão só contém o título 'set state button'. Então checamos se o texto anterior é o mesmo de agora, beleza, o texto não foi alterado, então não precisamos atualizar `button` então? Faz sentido. 'Coisas do DOM Virtual' em ação. Agora fica mais claro, o React mantém a representação interna do DOM e só toca o DOM real se for necessário. Tendo uma excelente performance como resultado.

Então, acho que você já pegou a ideia, colocamos o `ChildCmp` para atualizar, e seus filhos até que chegamos nos itens mais baixo-nível (conteúdo) e sermos capazes de atualizá-los. Seu conteúdo foi modificado, lembra que `this.props.message` é atualizada com o 'click state message' pelas chamadas `click` e `setState`.

```javascript
//...
onClickHandler() {
	this.setState({ message: 'click state message' });
}

render() {
    return <div>
		<button onClick={this.onClickHandler.bind(this)}>set state button</button>
		<ChildCmp childMessage={this.state.message} />
//...

```

Vamos dar uma olhada. Vamos atualizar o conteúdo do elemento, na verdade, substituí-lo. Bem, o que é o atualizar (update)? É meio que um objeto de configuração que será parseado e a ação configurada será aplicada. No nosso caso a atualização do texto ficará assim:

```javascript
{
  afterNode: null,
  content: "click state message",
  fromIndex: null,
  fromNode: null,
  toIndex: null,
  type: "TEXT_CONTENT"
}
```
Você pode ver, está quase vazio, o caso da atualização do texto é bem simples. Existem muitas propridades, porque quando você faz movimentação de nós pode ser mais complexo que só atualização de texto.

Dê uma olhada no código do método, para ficar mais claro.

```javascript
//src\renderers\dom\client\utils\DOMChildrenOperations.js#172
processUpdates: function(parentNode, updates) {
    for (var k = 0; k < updates.length; k++) {
      var update = updates[k];

      switch (update.type) {
        case 'INSERT_MARKUP':
          insertLazyTreeChildAt(
            parentNode,
            update.content,
            getNodeAfter(parentNode, update.afterNode)
          );
          break;
        case 'MOVE_EXISTING':
          moveChild(
            parentNode,
            update.fromNode,
            getNodeAfter(parentNode, update.afterNode)
          );
          break;
        case 'SET_MARKUP':
          setInnerHTML(
            parentNode,
            update.content
          );
          break;
        case 'TEXT_CONTENT':
          setTextContent(
            parentNode,
            update.content
          );
          break;
        case 'REMOVE_NODE':
          removeChild(parentNode, update.fromNode);
          break;
      }
    }
  }
```

Nosso caso é 'TEXT_CONTENT' e é o último passo, chamamos `setTextContent` (3) e modificamos o conteúdo do nó HTML (o real, do DOM).

Parabéns! O conteúdo foi atualizado e na página, é re-renderizado para o usuário. O que mais falta? Vamos terminar a atualização! Tudo está pronto, então nosso hook `componentDidUpdate` do componente será chamado. Como callbacks adiados são chamados geralmente? Certo, com wrapper de transação. Como se lembra, atualização de componente sujo foi feito wrap com `ReactUpdatesFlushTransaction` e um dos wrappers contém a lógica `this.callbackQueue.notifyAll()`, então, será chamado o `componentDidUpdate`. Boa!

Parece que terminamos. Completamente.

### Beleza, terminamos a *Parte 14*.

Vamos recapitular como chegamos aqui. Vamos olhar o esquema mais uma vez, e remover partes redundantes menos importantes e fica assim:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/14/part-14-A.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/14/part-14-A.svg)

<em>14.2 Parte 14 simplificada (clicável)</em>

E devemos provavelmente arrumar espaçamento e alinhamento também:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/14/part-14-B.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/14/part-14-B.svg)

<em>14.3 Parte 14 simplificada & refatorada (clicável)</em>

Boa. Na verdade, é isso o que acontece aqui. Então podemos pegar o essencial da *Parte 14* e usar para o esquema final de `updating`:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/14/part-14-C.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/14/part-14-C.svg)

<em>14.4 Parte 14 essencial (clicável)</em>

E terminamos! Na verdade, terminamos com updating. Vamos ver abaixo!

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/14/updating-parts-C.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/14/updating-parts-C.svg)

<em>14.5 Updating (clicável)</em>

[<< Página anterior: Parte 13](./Part-13.md)


[Home](../../README.md)
