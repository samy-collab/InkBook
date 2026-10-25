<!--
Relatório de impacto de sincronização
Versão: 1.0.0 → 2.0.0. Alteração MAJOR: as obrigações da proposta anterior
foram redefinidas para o MVP acadêmico solicitado.
Princípios modificados:
- I. Usabilidade → I. Tecnologia e compatibilidade com Expo Go
- II. Manutenibilidade → II. MVP orientado por user stories
- III. Confiabilidade → III. Interface e navegação
- IV. Desempenho → IV. Formulário e persistência local
- V. Segurança → V. Código simples e verificação
Seções adicionadas: nenhuma. Seções removidas: nenhuma.
Modelos do Spec Kit revisados; sincronização pendente por escopo desta etapa:
- ⚠ .specify/templates/plan-template.md: exemplos de mobile com API e estrutura
  nativa não refletem o aplicativo local com Expo.
- ⚠ .specify/templates/spec-template.md: exemplos de autenticação e serviços
  externos e idioma dos exemplos precisam ser ajustados antes da especificação.
- ⚠ .specify/templates/tasks-template.md: exemplos de backend e autenticação e
  testes opcionais conflitam com as verificações obrigatórias desta constituição.
- .specify/templates/commands/*.md: diretório ausente; nada a sincronizar.
Plano atual, README e quickstart: ausentes na raiz; nada a sincronizar.
Hooks de extensão: .specify/extensions.yml ausente na raiz.
Pendências: sincronizar os três modelos nas próximas etapas do Spec Kit.
Nenhum placeholder de conteúdo foi adiado.
-->

# InkBook — Constituição

## Core Principles

### I. Tecnologia e compatibilidade com Expo Go

O aplicativo DEVE usar React Native com Expo e TypeScript. Dependências e recursos
nativos DEVEM ser compatíveis com o Expo Go, e os fluxos principais DEVEM funcionar
em um dispositivo físico por meio dele. O plano DEVE registrar as versões
compatíveis e os passos para executar essa verificação.

**Justificativa:** a entrega acadêmica precisa ser reproduzível sem uma compilação
nativa personalizada.

### II. MVP orientado por user stories

A entrega DEVE ser um MVP pequeno e funcional para organizar ideias de tatuagens e
acompanhar o progresso de desenhos. A seleção e a ordem das funcionalidades DEVEM
seguir as user stories e seus critérios de aceite. Backend, autenticação, APIs
externas e funcionalidades sem relação com essas histórias NÃO DEVEM integrar o
MVP.

**Justificativa:** o escopo reduzido permite demonstrar os fluxos exigidos na
atividade acadêmica.

### III. Interface e navegação

O aplicativo DEVE ter pelo menos duas telas conectadas por navegação. A listagem
de ideias DEVE usar `FlatList`. Textos da interface, rótulos, mensagens de erro
e feedback DEVEM estar em português brasileiro.

**Justificativa:** esses requisitos tornam a navegação e a apresentação das ideias
observáveis durante a avaliação.

### IV. Formulário e persistência local

O aplicativo DEVE conter pelo menos um formulário com validação de entradas e
mensagens de erro compreensíveis. Ideias e dados necessários ao acompanhamento do
progresso DEVEM ser persistidos localmente com `AsyncStorage` e continuar
disponíveis após fechar e reabrir o aplicativo. Falhas de leitura ou gravação
DEVEM ser comunicadas ao usuário sem indicar sucesso indevidamente.

**Justificativa:** o formulário impede registros inválidos, e o armazenamento local
sustenta o uso do MVP sem serviços remotos.

### V. Código simples e verificação

O código DEVE ser simples, legível, organizado por responsabilidades e tipado em
TypeScript. Antes de considerar a implementação concluída, a equipe DEVE testar
as funcionalidades, conferir os critérios de aceite das user stories e registrar
o resultado das verificações. Falhas conhecidas nos fluxos obrigatórios DEVEM ser
corrigidas antes da conclusão.

**Justificativa:** uma base pequena e verificável facilita a manutenção e a
apresentação acadêmica.

## Restrições técnicas e de escopo

O aplicativo DEVE operar com dados locais, sem depender de backend, autenticação
ou APIs externas. A especificação DEVE definir os campos das ideias, a forma de
representar o progresso dos desenhos e os fluxos detalhados a partir das user
stories. O plano DEVE escolher apenas bibliotecas compatíveis com o Expo Go e
necessárias para cumprir esses fluxos.

Requisitos adicionais só podem entrar no MVP se estiverem ligados a uma user story
priorizada e seus critérios de aceite forem definidos. A estrutura e as abstrações
DEVEM permanecer proporcionais ao tamanho da atividade acadêmica.

## Fluxo de desenvolvimento e qualidade

Os artefatos produzidos pelo Spec Kit, incluindo constituição, especificação,
plano e tarefas quando existirem, DEVEM ser preservados e mantidos sob controle de
versão. A especificação DEVE registrar user stories priorizadas e critérios de
aceite verificáveis. O plano e as tarefas DEVEM refletir as restrições desta
constituição e priorizar o que essas histórias exigem.

A validação final DEVE cobrir navegação entre pelo menos duas telas, formulário
com entrada válida e inválida, mensagens de erro, listagem com `FlatList`,
persistência após reiniciar o aplicativo e execução em dispositivo físico com
Expo Go. O resultado de cada verificação DEVE ser registrado; itens não testados
DEVEM permanecer pendentes.

## Governance

Esta constituição orienta a especificação, o plano, as tarefas, a implementação
e a revisão do InkBook. Em caso de conflito, os artefatos afetados DEVEM ser
ajustados à constituição antes de considerar o trabalho concluído.

Emendas DEVEM registrar motivo, impacto nos artefatos dependentes, nova versão e
data no relatório de sincronização. A versão segue MAJOR.MINOR.PATCH: MAJOR para
remoção ou redefinição incompatível de princípios; MINOR para novos princípios ou
obrigações ampliadas; PATCH para esclarecimentos sem mudança de obrigação.

Cada revisão da especificação, do plano, das tarefas e da implementação DEVE
verificar conformidade com os princípios aplicáveis. Exceções DEVEM ser
justificadas e registradas no artefato afetado antes de a entrega ser declarada
concluída.

**Version**: 2.0.0 | **Ratified**: 2026-10-25 | **Last Amended**: 2026-10-25
