# Under the hood: React
<em> Esse repositório contém uma explicação das partes internas do React. Na verdade, estava debuggando por todo o código e coloquei toda a lógica em esquemas visuais, fiz a análise, resumi e expliquei os principais conceitos e abordagens. já terminei com a versão Stack e agora trabalho com a próxima, a versão Fiber.</em>

### Queria automatizar o processo de "aprender e documentar" uma codebase complexa o máximo possível, então iniciar o [Codecrumbs project](https://codecrumbs.io/). Ele vai ajudar a construir projetos como o "Under the hood ReactJs" num tempo mais curto e de forma mais simples!


Cada esquema é clicável e pode ser aberto numa nova aba, use para fazer zoom e conseguir fazer a leitura. Mantenha o artigo e o esquema que você está lendo em abas separadas, isso vai ajudar a bater o texto com o fluxo de código mais facilmente.

Vamos falar aqui sobre as duas versões de React, atual com o reconciliados Stack e a próxima com Fiber (como você provavelmente sabe, a próxima versão de React será lançada em breve), então, você pode entender melhor como a versão atual de React funciona e dar valor pros grandes avanços do React-Fiber. Utilizamos o [React v15.4.2](https://github.com/facebook/react/tree/v15.4.2) para explicar como 'React legado' funciona e React v16.*.*** para ‘Fiber’. Vamos começar da antiga (me divirto dizendo isso) versão stack.


## Reconciliador stack
[![](../../../../stack/images/intro/all-page-stack-reconciler-25-scale.jpg)](../../../../stack/images/intro/all-page-stack-reconciler.svg)

O esquema inteiro é dividido em 15 partes, vamos iniciar.

> Leia em um melhor formado pelo [github-pages](https://bogdan-lyashenko.github.io/Under-the-hood-ReactJS/).

* [Intro](../../../../stack/languages/portuguese/book/Intro.md)
* [Parte 0](../../../../stack/languages/portuguese/book/Part-0.md)
* [Parte 1](../../../../stack/languages/portuguese/book/Part-1.md)
* [Parte 2](../../../../stack/languages/portuguese/book/Part-2.md)
* [Parte 3](../../../../stack/languages/portuguese/book/Part-3.md)
* [Parte 4](../../../../stack/languages/portuguese/book/Part-4.md)
* [Parte 5](../../../../stack/languages/portuguese/book/Part-5.md)
* [Parte 6](../../../../stack/languages/portuguese/book/Part-6.md)
* [Parte 7](../../../../stack/languages/portuguese/book/Part-7.md)
* [Parte 8](../../../../stack/languages/portuguese/book/Part-8.md)
* [Parte 9](../../../../stack/languages/portuguese/book/Part-9.md)
* [Parte 10](../../../../stack/languages/portuguese/book/Part-10.md)
* [Parte 11](../../../../stack/languages/portuguese/book/Part-11.md)
* [Parte 12](../../../../stack/languages/portuguese/book/Part-12.md)
* [Parte 13](../../../../stack/languages/portuguese/book/Part-13.md)
* [Parte 14](../../../../stack/languages/portuguese/book/Part-14.md)



## Fiber
Vai ser feito com a ajuda da [ferramenta js-code-to-svg-flowchart](https://github.com/Bogdan-Lyashenko/js-code-to-svg-flowchart) depois. 


