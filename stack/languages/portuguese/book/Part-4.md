## Parte 4

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/4/part-4.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/4/part-4.svg)

<em>4.0 Parte 4 (clicável)</em>

### Montagem do filho

Loucura, né? Vamos continuar com a investigação do método `mount`.

Então, se `_tag` contêm uma tag 'complexa' (1), como video, form, textarea, etc., será necessário wrapping adicional. Isso adiciona mais event listeners para cada evento de mídia, como 'volumeChange' pra tags `audio`, ou apenas faz o wrap de comportamentos nativos de tags como `select`, `textarea`, etc.

Existem muitos wrappers para elementos como esse, como `ReactDOMSelect` e `ReactDOMTextarea` (dentro de src\renderers\dom\client\wrappers\ ). No nosso caso é simplesmente `div`, sem processamento adicional.

### Validação de props

O próximo método de validação é chamado para ter certeza que as `props` internas são setadas corretamente, se não vai resultar em erros. Por exemplo, se `props.dangerouslySetInnerHTML` é setada (geralmente fazemos isso quando tentamos inserir HTML por uma string) e o objeto `__html` está faltando, esse erro irá acontecer:

> `props.dangerouslySetInnerHTML` must be in the form `{__html: ...}`.  Please visit https://fb.me/react-invariant-dangerously-set-inner-html for more information.

### Criar elemento HTML

Então, o elemento HTML será criado (3) por `document.createElement`, que vai instanciar o HTML real `div` para a gente. Antes trabalhávamos apenas com a representação virtual e agora, você pode ver pela primeira vez.

### Beleza, terminamos a *Parte 4*.

Vamos recapitular como chegamos aqui. Vamos olhar o esquema mais uma vez, e remover partes redundantes menos importantes e fica assim:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/4/part-4-A.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/4/part-4-A.svg)

<em>4.1 Parte 4 simplificada (clicável)</em>

E devemos provavelmente arrumar espaçamento e alinhamento também:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/4/part-4-B.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/4/part-4-B.svg)

<em>4.2 Parte 4 simplificada & refatorada (clicável)</em>

Boa. Na verdade, é isso o que acontece aqui. Então podemos pegar o essencial da *Parte 4* e usar para o esquema final de `mounting`:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/4/part-4-C.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/4/part-4-C.svg)

<em>4.3 Parte 4 essencial (clicável)</em>

E terminamos!


[Próxima página: Parte 5 >>](./Part-5.md)

[<< Página anterior: Parte 3](./Part-3.md)


[Home](../../README.md)
