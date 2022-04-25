## Parte 1

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/1/part-1.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/1/part-1.svg)

<em>1.0 Parte 1 (clicável)</em>

### Transação

Bem, a instância do componente deve ser de alguma forma **conectada** com o ecossistema do React e, obviamente, **ter alguma influência** sobre ela. Tem um módulo dedicado `ReactUpdates` que ajuda com isso. Como você sabe, **React faz atualizações em pedaços**, isso significa que coleta operações e processa elas **juntas**. Isso é sempre melhor porque permite aplicar algumas **pré-condições** e **pós-condições** apenas uma vez para toda a lista de itens (pedaço) ao invés de fazer para cada item.

O que realmente ajuda a lidar com esse pré/pós processamento? Verdade, **transação**! Para alguns pode ser uma palavra nova, ou pelo menos a interpretação para as necessidades de UI, então vamos falar um pouco mais sobre isso e começar com um exemplo simples.

Imagine o "canal de comunicações". Você precisa abrir uma conexão, enviar a mensagem e fechar a conexão. Isso pode ser muito se você enviar várias mensagens uma a uma. Ao invés, você pode abrir a conexão apenas uma vez, mandar todas as mensagens pendentes e fechar a conexão depois.

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/1/communication-channel.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/1/communication-channel.svg)

<em>1.1 Exemplo bem real de uma transação (clicável)</em>

Beleza, vamos pensar em coisas mais abstratas então. Imagine que "mandar mensagem" é qualquer operação que você queira fazer e "abrir/fechar conexão"  é pré/pós processamento durante o ato da operação. E então, imagine que você pode definir qualquer par abrir-fechar separadamente e usá-los com quaisquer métodos que você queira (podemos chamá-los de envolvedores (wrappers), porque na verdade, cada par envolve métodos de ações). Soa bem, né?

Voltando ao React. Transação é um pattern muito utilizado dentro do React. Tirando o comportamento de wrapping, a transação permite que a aplicação resete o fluxo de transação, bloquear execuções simultâneas se a transação está já em progresso e mais. Existem muitas classes diferentes de transação, cada uma descreve um comportamento específico, mas todas elas estendem do módulo `Transaction`. As diferenças entre transações são específicas pela lista exata de wrappers de transação. Wrappers são só um objeto que contêm métodos de inicialização e fechamento.

Então, **a ideia é**:
* chamar cada wrapper.initialize e cachear os valores retornados (podem ser utilizados depois)
* chamar o próprio método de transação
* chamar cada wrapper.close

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/1/transaction.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/1/transaction.svg)

<em>1.2 Implementação do Transaction (clicável)</em>

Vamos ver alguns **outros casos de uso** para transações em React:
* Preservar os ranges de inputs de seleção antes/depois da reconciliação restaurando a seleção mesmo no evento de um erro inesperado.
* Desativando eventos enquanto rearranja o DOM prevenindo focos/blur, enquanto garante que depois, o sistema de eventos é reativado.
* Fazer um flush de uma fila de mutações do DOM para a thread de UI principal depois que uma reconciliação acontece na thread worker.
* Invocar qualquer callback coletado de `componentDidUpdate` depois de renderizar o novo conteúdo.

Bem, vamos voltar ao nosso caso.

Como podemos ver, React usa `ReactDefaultBatchingStrategyTransaction` (1). Como já vimos, a principal coisa sobre uma transação são seus wrappers. Então, podemos dar uma olhada nos wrappers e descobrir qual é exatamente a transação definida. Beleza, existem dois wrappers: `FLUSH_BATCHED_UPDATES`, `RESET_BATCHED_UPDATES`. Vamos olhar o código:

```javascript
//\src\renderers\shared\stack\reconciler\ReactDefaultBatchingStrategy.js#19
var RESET_BATCHED_UPDATES = {
	  initialize: emptyFunction,
	  close: function() {
		ReactDefaultBatchingStrategy.isBatchingUpdates = false;
	  },
};

var FLUSH_BATCHED_UPDATES = {
	 initialize: emptyFunction,
	 close: ReactUpdates.flushBatchedUpdates.bind(ReactUpdates),
}

var TRANSACTION_WRAPPERS = [FLUSH_BATCHED_UPDATES, RESET_BATCHED_UPDATES];
```

Então, você consegue ver qual a cara dele. Para essa transação não há pré-condições. Os métodos `initialize` estão vazios, mas um dos métodos `close` é bem interessante. Ele chama `ReactUpdates.flushBatchedUpdates`. O que isso significa? Ele na verdade inicia a verificação de componentes sujos com mais re-renderização. Está acompanhando? Nós chamamos o método de montagem e fazemos um wrap exatamente nessa transação porque depois da montagem, React checa pra ver o que foi afetado pelo componente montado e o atualiza.

Beleza, vamos dar uma olhada no método que foi feito um wrap na transação. Bem, na verdade, isso nos leva a outra transação...

### Beleza, acabamos a *Parte 1*.

Vamos recapitular como chegamos aqui. Vamos olhar o esquema mais uma vez, e remover partes redundantes menos importantes e fica assim:
[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/1/part-1-A.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/1/part-1-A.svg)

<em>1.3 Parte 1 simplificada (clicável)</em>

E devemos provavelmente arrumar espaçamento e alinhamento também:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/1/part-1-B.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/1/part-1-B.svg)

<em>1.4 Parte 1 simplificada & refatorada (clicável)</em>

Boa. Na verdade, é isso o que acontece aqui. Então podemos pegar o essencial da *Parte 1* e usar para o esquema final de `mounting`:

[![](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/1/part-1-C.svg)](https://rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/master/stack/images/1/part-1-C.svg)

<em>1.5 Parte 1 essencial (clicável)</em>

E terminamos!


[Próxima página: Parte 2 >>](./Part-2.md)

[<< Página anterior: Parte 0](./Part-0.md)


[Home](../../README.md)
