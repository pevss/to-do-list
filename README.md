To Do List 📝
=== 

[Clique aqui e fique a vontade para usar meu projeto como uma ferramenta para se organizar!](https://pevss.github.io/to-do-list/)

A ideia 
===

Após finalizar a Seção 13 do [curso de JavaScript](https://www.udemy.com/course/the-complete-javascript-course/?couponCode=KEEPLEARNING), que fala sobre manipulação avançada do DOM (DOM Treversing, Event Bubbling, Event Delegation, Intersection Observer API, criação programática de elementos, alteração programática de atributos e propriedades, etc), decidi que antes de avançar para a próxima seção (Programação Orientada ao Objeto), eu gostaria de por tudo aquilo que eu aprendi em prática. Assim, decidi criar essa to-do list (assim como todo aspirante a desenvolvimento Front-End 😂).

Para esse projeto eu escrevi uma lista com as técnicas aprendidas que eu gostaria de praticar sozinho:

-  Criação de elementos do DOM
-  Exclusao de elementos do DOM
-  setTimeout e setInterval
-  new intl
-  new date
-  Delegação de eventos

E já devo adiantar que todos essas (e muitas outras) habilidades foram aplicadas!

Atualmente, uso o bloco de notas para organizar minhas tarefas (quando elas são muitas), não uso o Notion nem nada do tipo pois não acho legal eu ter que sempre abrir um software extra para alguma tarefa específica que pode ser facilmente feita com ferramentas nativas do sistema operacional. Então, usei de base a maneira que eu anoto minhas tarefas:

-  As tarefas são divididas entre três prazos diferentes: Hoje, Amanhã e Para essa semana.
-  As tarefas podem ter subtarefas.

A execução
===

Protótipo e estruturação do HTML
---

Para começar, é claro, criei o [protótipo](https://www.figma.com/file/OZoExm6g7MWVfyUnalp1XR/Todo-app?type=design&node-id=0%3A1&mode=design&t=pW87gJ2zF4JjFoVz-1) no Figma para eu não começar o desenvolvimento as cegas, afinal de contas, eu queria que o projeto tivese um acabamento especial (e, por de experiência própria, que eu sei que tentar fazer uma interface com dois temas (claro e escuro) na improvisação é impossível).

  Observação: Do protótipo que vieram as variáveis de cor do CSS ;)

Ao finalizar o protótipo, comecei a traduzir ele para o HTML, indo de componente em componente, de camada em camada, afim de deixar o produto final o mais fiel ao seu protótipo. Essa habilidade para mim, é uma das mais importantes de um desenvolvedor Front-End.

Css
---

Com a estrutura do HTML pronta, parti para a estilização. Nessa etapa do processo, usei diversos seletores interessantes e me aproveitei dos atributos dos elementos ao máximo, aqui vão alguns exemplos:

-  .radio-prazo:nth-of-type(1):has(input:checked) div
-  .tarefas>*:last-child
-  .tarefa-child:has(.check-tarefa[data-concluido="true"]) .tarefa-risco

Também me aproveitei bastante de transições de propriedades de elementos baseados em atributos específicos, por exemplo quando uma tarefa foi completa, sem JS nenhum, ela é "riscada". E eu acho que práticas como essa (resolver o mínimo de coisas com JS) podem aumentar a performance de um sistema. 

JavaScript
---

Com toda a parte de estruturação e estilização feitas, parti para a codificação das funcionalidades. 

Tratei meu sistema como se eu estivesse recebendo dados de uma API externa ligada a um banco de dados relacional que me devolve dois arrays no formato JSON: "tarefas" e "subtarefas". Para fazer com que o sistema "se lembre" coloquei essa "API" no localStorage, mas acho que peguei a noção de como trabalhar com dados assim.

Para começar, eu tinha que dar um jeito de agrupar as tarefas vindas do "banco de dados" por prazo (hoje, amanha, essa semana). Para fazer isso, usei a propriedade "dataPrazo" de cada tarefa e as comparei com a data atual usando "new Date().getTime()", e após alguns testes lógicos, criei um novo objeto que agrupa todas as tarefas por prazo, assim como o desejado.

Depois disso, eu precisava, nesse mesmo objeto criado, atrelar as subtarefas de tarefas que tenham subtarefas as suas respectivas tarefas. Para isso, eu loopei por esse novo objeto criado e dentro desse loop eu checkei se alguma subtarefa tinha o id da tarefa da iteração atual, caso tivesse, uma nova propriedade "subtarefas" no objeto da tarefa seria criada, contendo o valor de todas as subtarefas relacionadas ao seu id.

Feito isso, agora, eu tenho o objeto que irá ser consumido pelo meu código para gerar todas as tarefas na interface.

Durante a codificação, me preocupei em deixar o ambiente de variáveis global o mais limpo possível, criando uma função para cada uma das funcionalidades do meu sistema. Isso se provou bastante valioso conforme o código foi crescendo, pois quando eu chegava em algum erro ou alguma interações esquisita acontecia, era muito fácil de identificá-lo. Além disso, adicionar novas funcionalidades que não estavam 100% previstas no protótipo foi bem menos doloroso por conta dessa prática.

Após finalizar a codificação, revisei meu código para tentar idenficar alguma redundância, e eu percebi que a função "criarTarefas()" estava COLOSSAL, e eu não sabia muito bem como resumir ela, não sabia se ela estava redundante ou se ela era naturalmente grande. Depois de tentar refatorá-la sem sucesso, me voltei ao ChatGPT como ferramenta de aprendizado e pedi para ele me oferecer uma maneira de deixá-la mais otimizada. 

A solução da IA foi: 

-  Criar uma função que cria um novo elemento ao mesmo tempo que define suas classes e seu conteúdo de texto.
-  Criar uma função para cada tipo de tarefa.

Mas fora isso, nenhuma a alteração a lógica principal foi criada (o que para mim foi um grande boost no ego).

Refatorei a minha função dessa maneira nova e acho que nunca mais criarei um elemento sem essa função personalizada! Essa refatoração poupou em torno de 75 linhas!

Aproveitei e voltei para outra função que estava bem grande, a "handleModeSwitch()", onde eu repetia o comando "document.documentElement.style.setProperty("--variavel-css", "valor")" para cada cor que eu queria mudar para cada esquema de cor, ou seja, 28 vezes.

A alterativa que a IA me ofereceu foi, criar um objeto para cada esquema de cor, onde a chave é o nome da propriedade e o valor é o valor da variável, e então loopar esse objeto de acordo com o modo desejado pelo usuário.

Conclusão
===

Com o projeto pronto, criei um sistema de organização de tarefas baseado em datas que se auto ordena de acordo com o dia atual. Concluí todo o projeto em 5 dias e estou bastante satisfeito com o resultado final! 

Algumas features que desejo adicionar no futuro:

-  Drag and drop para reorganizar a ordem em que as tarefas são exibidas.
-  Responsividade para uso da ferramenta em celulares e outros dispositivos menores. (Não sei como posso deixar uma tabela resposiva, elas ão muito longas. Devo aprender isso quando eu fizer o [curso de css](https://www.udemy.com/course/advanced-css-and-sass/?couponCode=KEEPLEARNING))
-  Adição de tarefas diárias (tarefas fixas que reaparecem todos os dias).
