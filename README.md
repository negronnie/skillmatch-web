# Projeto Avaliativo - Lucas Ponciano

Projeto Avaliativo do Módulo 1 do SCTEC, proposto na Semana 12 do curso.

A proposta é migrar o sistema desenvolvido no mini-projeto executado na semana 6 do curso, de uma execução do tipo CLI para uma interface web completa.

Assim como no mini-projeto, sustentei a complexidade extra, que é o nível de senioridade por habilidade.

## Dados do Projeto

- [Kanban do Github](https://github.com/users/negronnie/projects/4)
- [Link do Vídeo Explicativo (YouTube)]()
- [Link do Vídeo Explicativo (Google Drive)]()
- [Excalidraw]()
- [Lista de Issues](https://github.com/negronnie/skillmatch-web/issues?q=is%3Aissue)
- [Lista de Pull Requests](https://github.com/negronnie/skillmatch-web/pulls?q=is%3Apr+state%3Aclosed)
- [Lista de Branches](https://github.com/negronnie/skillmatch-web/branches)

### Nome para o software
- Nome: **Talent Catcher**
- Tagline/slogan: **Você compatível com o mercado!**
- Cor Principal: **#6366F1**

![Logo](https://raw.githubusercontent.com/negronnie/skillmatch-web/0980b715824fee6a4700866e66fbe6d4f838419b/assets/img/logo-full.svg)

### Problema que resolve
Facilita a comparação entre candidatos e vagas, indicando exatamente quais habilidades são faltantes ou insuficientes para atender aos requisitos da vaga, gerando um percentual de compatibilidade e sugestões de estudo.

### Tech Stack
- VS Code *(Editor de código)*
- Live Server *(Extensão)*
- HTML
- CSS
- JavaScript

### Como rodar
Basta rodar o código usando o *live server*.
Além disso, o site está disponível no GitHub Pages através deste [link](https://negronnie.github.io/skillmatch-web/).
E também no [meu site](https://negronnie.com.br/sctec/projetom1/).

### Possíveis melhorias
- Um cadastro de vagas, para que elas também sejam dinâmicas;
- Um cadastro de usuários, para que eles possam ser recuperados mediante usuário e senha.

## Uso de IA

Usei IA para as seguintes situações:

| Objetivo | Comentário |
| --- | --- |
| Gerar os dados das vagas no arquivo JSON. | Não estava tão criativo. E assim eu garanto que não vou repetir a memsa |
| Gerar o esquema de cores light/dark. | Não estava conseguindo criar uma combinação harmoniosa e que atendesse às exigências do LightHouse. |
| Gerar o logo e a animação do hero. | Apenas itens estéticos que não faziam parte das exigências. |
| Auxiliou na construção da barra de progresso de índice de match. | Não havia associado, que bastava definir um estilo local com o score como parâmetro. |
| Sugeriu duas soluções para alterar o logo conforme o tema definido.  | Eu queria usar as variáveis css pra alterar as cores no logo para atender ao tema escuro também. Isso exigia que o svg fosse inline, porque o svg isola os estilos. <br/> A solução escolhida foi usar dois arquivos e alterar os arquivos conforme o tema definido. |
| Me ajudou a gerenciar os estados de erro | Eu iria fazer usando uma série de **_getElementById()_**, a IA me sugeriu através uma única função recebendo o id do campo e a mensagem. |


## Orquestração

1. A função principal é iniciada assim que o conteúdo da DOM é carregado. E ela dispara a função que registra os listeners.
2. Os dados são carregados do JSON após o loading, há fallbacks (quando há erro e quando está vazio).
3. As vagas são renderizadas após análise do perfil (quando existente). Quando não existe perfil, os parâmetros considerados são os mínimos, para gerar uma "Baixa Compatibilidade".
4. O submit do formulário salva o perfil, dispara a análise, que renderiza o melhor resultado, e compara as habilidades do candidato com a vaga baseado nas regras do motor.

### Código preditivo e Autocomplete
Em grande parte das implementações o próprio VS Code já fazia a sugestão de parte do código. O que tornou a codificação muito mais rápida e intuitiva.

## Kanban, Commits e Branches

Cada passo do processo de descoberta da solução foi documentada no <u>Kanban do GitHub</u>, que pode ser acessado [clicando aqui](https://github.com/users/negronnie/projects/4).

Cada *issue* possuia um objetivo central, e era lançada inicialmente no *backlog*, e arrastadas para as colunas condizentes com o estado da atividade. Além disso cada issue dava origem à uma nova *branch*, onde o código era desenvolvido isolado da *main*.

Assim que o código desenvolvido ou parte dele estava pronto, era *commitado* e enviado ao GitHub. Quando a solução da issue era atingida, se abria um *pull request*. Inclusive, eu forcei conflitos de código, mantendo duas branches originadas da main ativas sem merge por um breve período.

- [Lista de Issues](https://github.com/negronnie/skillmatch-web/issues?q=is%3Aissue)
- [Lista de Pull Requests](https://github.com/negronnie/skillmatch-web/pulls?q=is%3Apr+state%3Aclosed)
- [Lista de Branches](https://github.com/negronnie/skillmatch-web/branches)
