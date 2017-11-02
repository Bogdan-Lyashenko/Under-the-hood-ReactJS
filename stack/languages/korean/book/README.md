# Under the hood: ReactJS
<em> 여기에는 리엑트의 내부 작업에 대한 설명을 담았습니다. 전체 코드 기반을 디버깅하면서 모든 로직을 시각적인 블록 스키마에 넣고 분석하고, 주요 개념과 접근 방법을 요약 및 설명했습니다. Stack 버전은 끝났으며, 앞으로는 다음 버전인 Fiber 버전을 작업할 예정입니다.</em>

>> 더 나은 포맷으로 보고싶으시면 이곳에서 확인하실수 있습니다. : [github-pages website](https://bogdan-lyashenko.github.io/Under-the-hood-ReactJS/)

> 좋은 아이디어가 있다면, 부담없이 언제든지 issue를 open해주시기 바랍니다. 

각 스키마는 클릭 가능하고, 새로운 탭에서 열리며, 확대/축소를 하여 보실 수 있습니다. 별도의 창(탭)을 띄워서 아티클과 스키마를 유지시키면, 텍스트와 코드 흐름을 더 쉽게 매칭시키는 데 도움이 될 것입니다.

우리는 Stack reconciler가 있는 현재 버전과 다음 버전인 Fiber(아시겠지만, ReactJS의 다음 버전이 곧 공개 될 것입니다.)에 대하여 이야기 할 것입니다. 따라서 당신은 현재의 리엑트가 어떻게 작동하는지 더 잘 이해할 수 있고, Fiber버전에 대한 큰 개선점을 알 수 있을 것입니다. ‘legacy React’가 어떻게 작동되는지 설명하기 위해 [React v15.4.2](https://github.com/facebook/react/tree/v15.4.2)를 사용하며, ‘Fiber’에서는 v16.*.***를 사용합니다. 자 이제, 오래된(이렇게 말하는게 웃깁네요.) 스택 버전부터 시작해보겠습니다.


## Stack reconciler
[![](../../../../stack/images/intro/all-page-stack-reconciler-25-scale.jpg)](./stack/images/intro/all-page-stack-reconciler.svg)

전체 스키마는 열다섯개로 나누어져 있습니다. 그럼, 시작하겠습니다.

* [Intro](../../../../stack/languages/korean/book/Intro.md)
* [Part 0](../../../../stack/languages/korean/book/Part-0.md)
* [Part 1](../../../../stack/languages/korean/book/Part-1.md)
* [Part 2](../../../../stack/languages/korean/book/Part-2.md)
* [Part 3](../../../../stack/languages/korean/book/Part-3.md)
* [Part 4](../../../../stack/languages/korean/book/Part-4.md)
* [Part 5](../../../../stack/languages/korean/book/Part-5.md)
* [Part 6](../../../../stack/languages/korean/book/Part-6.md)
* [Part 7](../../../../stack/languages/korean/book/Part-7.md)
* [Part 8](../../../../stack/languages/korean/book/Part-8.md)
* [Part 9](../../../../stack/languages/korean/book/Part-9.md)
* [Part 10](../../../../stack/languages/korean/book/Part-10.md)
* [Part 11](../../../../stack/languages/korean/book/Part-11.md)
* [Part 12](../../../../stack/languages/korean/book/Part-12.md)
* [Part 13](../../../../stack/languages/korean/book/Part-13.md)
* [Part 14](../../../../stack/languages/korean/book/Part-14.md)



## Fiber
1. [Intro](../../../../fiber/book/Intro.md) [TODO]


