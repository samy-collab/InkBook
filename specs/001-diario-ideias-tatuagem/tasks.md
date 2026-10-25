# Tasks: InkBook — Diário de Ideias de Tatuagens

**Input**: [plan.md](plan.md), [spec.md](spec.md), [research.md](research.md), [data-model.md](data-model.md), [contracts/ui-and-storage.md](contracts/ui-and-storage.md) e [quickstart.md](quickstart.md).  
**Escopo**: US01–US05 e as evoluções de busca e favoritos solicitadas depois do MVP. As tarefas concluídas estão marcadas abaixo; testes no celular permanecem pendentes.
**Ordem**: Segue as 13 etapas solicitadas pelo usuário. Por isso, US02 precede US01, e US04 precede US03, mesmo quando compartilham prioridade na especificação.  
**Formato**: `[P]` marca trabalho que pode ocorrer em paralelo depois de suas dependências; `[USn]` identifica a história correspondente.

## Phase 1: Setup — etapas 1 e 2

**Objetivo**: Criar o projeto Expo dentro deste repositório e garantir dependências compatíveis com Expo Go.

- [x] T001 Inicializar o template padrão Expo com TypeScript e Expo Router em `mobile/package.json`, `mobile/package-lock.json` e `mobile/tsconfig.json`, mantendo `.specify/`, `specs/` e `AGENTS.md`; concluído quando o projeto nasce em `mobile/`, o SDK efetivo está identificado e nenhum arquivo do Spec Kit foi substituído.
- [x] T002 Instalar `@react-native-async-storage/async-storage` e `expo-crypto` via `npx expo install` e conferir Router/React Native em `mobile/package.json` e `mobile/package-lock.json`; concluído quando `npx expo install --check` e `npx expo-doctor@latest` não apontam incompatibilidades com o SDK e o Expo Go escolhido para Android físico.

## Phase 2: Foundational — etapas 3 a 5

**Objetivo**: Preparar navegação, tipo compartilhado e armazenamento local antes das histórias.

- [x] T003 Configurar Stack do Expo Router e somente as rotas funcionais Minhas Ideias e Cadastro/Edição em `mobile/src/app/_layout.tsx`, `mobile/src/app/index.tsx` e `mobile/src/app/idea.tsx`, removendo rotas demonstrativas do template; concluído quando é possível ir à tela de formulário, voltar à lista e distinguir cadastro de edição pelo `id` opcional.
- [x] T004 Definir `TattooIdea` com `id`, `title`, `description`, `style`, `difficulty`, `status` e `createdAt`, mais as opções fechadas de estilo, dificuldade e status, em `mobile/src/features/ideas/types.ts`; concluído quando o tipo e as opções correspondem a [data-model.md](data-model.md) e código consumidor não aceita valores fora dos domínios.
- [x] T005 Implementar `loadIdeas` e `saveIdeas` isolados em `mobile/src/features/ideas/storage.ts`, usando a chave `@inkbook/ideas/v1` e validando o array carregado; concluído quando chave ausente retorna `[]`, dados válidos persistem após reinício, e falha de acesso ou JSON inválido gera erro sem sobrescrever os dados locais.

**Checkpoint**: Navegação, modelo e armazenamento prontos; nenhuma história depende de backend ou autenticação.

## Phase 3: US02 — Visualizar ideias (P1) — etapa 6

**Objetivo**: Mostrar as ideias cadastradas em ordem de recência.

**Teste independente**: Com catálogo de exemplo pré-carregado diretamente no AsyncStorage para verificação, sem recurso de seed no aplicativo, abrir Minhas Ideias, conferir título, estilo, dificuldade e status, ordem e permanência após reabrir o aplicativo. O critério de lista vazia é concluído em T016.

- [x] T006 [US2] Criar o cartão reutilizável em `mobile/src/components/IdeaCard.tsx` com título, estilo, dificuldade e status em português; concluído quando os quatro valores de uma `TattooIdea` são legíveis no cartão sem depender da tela de formulário.
- [x] T007 [US2] Carregar ideias ao abrir ou focar a tela e renderizá-las em FlatList em `mobile/src/app/index.tsx`, usando `id` como chave e ordem de cadastro mais recente; concluído quando a lista mostra todos os cartões na ordem prevista e recarrega dados persistidos após fechar e reabrir o aplicativo.

**Checkpoint**: O fluxo de listagem de US02 pode ser verificado com catálogo local de exemplo; a história inteira fica concluída após T016 e T017, conforme a etapa 11 solicitada.

## Phase 4: US01 — Cadastrar ideia (P1) — etapa 7

**Objetivo**: Criar uma ideia válida e exibi-la na lista.

**Teste independente**: Preencher dados válidos e descrição vazia, salvar e conferir a ideia no início da lista; tentar título inválido ou seleção obrigatória ausente e conferir os erros.

- [x] T008 [P] [US1] Criar campos reutilizáveis com rótulo e mensagem de erro em `mobile/src/components/FormField.tsx`; concluído quando título e descrição podem usar o mesmo componente e a mensagem de validação fica associada ao campo.
- [x] T009 [P] [US1] Implementar a validação pura de rascunhos em `mobile/src/features/ideas/validation.ts`, incluindo título com `trim` e mínimo de três caracteres, estilo/dificuldade obrigatórios e opções de status; concluído quando retorna erros por campo para entradas inválidas e aceita descrição vazia.
- [x] T010 [US1] Montar o modo cadastro em `mobile/src/app/idea.tsx`, com cinco campos, status inicial Quero desenhar, `id` UUID, `createdAt` ISO, `StyleSheet` e salvamento pela camada local; concluído quando uma ideia válida aparece primeiro em Minhas Ideias após gravação, um formulário inválido não grava e o usuário vê os erros.

**Checkpoint**: US01 e o fluxo principal de US02 podem ser demonstrados sem as histórias posteriores.

## Phase 5: US04 — Editar e excluir (P2) — etapas 8 e 9

**Objetivo**: Corrigir uma ideia e removê-la somente após confirmação.

**Teste independente**: Abrir uma ideia, alterar dados, tentar edição inválida, cancelar exclusão e confirmar exclusão em tentativas separadas; conferir os dados após reiniciar.

- [x] T011 [US4] Carregar pelo `id` e preencher o mesmo formulário em modo edição em `mobile/src/app/idea.tsx`; concluído quando a ideia certa aparece nos campos, `id` desconhecido não abre cadastro silencioso e voltar sem salvar preserva os dados anteriores.
- [x] T012 [US4] Salvar edições válidas com a validação de US01 em `mobile/src/app/idea.tsx`, preservando `id`, `createdAt` e posição original; concluído quando a lista mostra os valores novos após reinício e uma edição inválida mantém o registro anterior.
- [x] T013 [US4] Adicionar exclusão ao cartão e confirmação identificando a ideia em `mobile/src/components/IdeaCard.tsx` e `mobile/src/app/index.tsx`; concluído quando cancelar não altera o catálogo, confirmar remove definitivamente só a ideia escolhida e a lista muda apenas após gravação concluída.

**Checkpoint**: US04 funciona com o formulário reutilizado e o catálogo local.

## Phase 6: US03 — Atualizar andamento (P2) — primeira parte da etapa 10

**Objetivo**: Alterar o status de uma ideia existente no formulário de edição.

**Teste independente**: Alternar entre Quero desenhar, Em andamento e Concluído, salvar e conferir lista e valor após reabrir o aplicativo.

- [x] T014 [US3] Habilitar a escolha dos três status na edição em `mobile/src/app/idea.tsx`, reutilizando a validação e o salvamento existentes; concluído quando cada status permitido pode substituir o anterior, aparece no cartão e permanece após reinício.

**Checkpoint**: US03 permite acompanhar o estado atual sem criar histórico extra.

## Phase 7: US05 — Filtrar por status (P3) — segunda parte da etapa 10

**Objetivo**: Localizar ideias pelo status sem alterar os dados salvos.

**Teste independente**: Com ideias nos três status, selecionar Todos e cada status; conferir que só aparecem correspondências, em ordem de cadastro.

- [x] T015 [US5] Adicionar filtros Todos, Quero desenhar, Em andamento e Concluído em `mobile/src/app/index.tsx`, aplicados em memória à FlatList; concluído quando Todos exibe o catálogo completo, cada filtro exibe apenas seu status e a ordem de cadastro é preservada após edição ou exclusão.

**Checkpoint**: Os quatro filtros funcionam; US05 fica concluída após a mensagem sem resultados de T016, conforme a etapa 11 solicitada.

## Phase 8: Estados e erros — etapa 11

**Objetivo**: Completar os estados de carregamento, vazio e falhas de armazenamento das duas telas.

- [x] T016 Implementar carregamento, catálogo vazio e filtro sem correspondências em `mobile/src/app/index.tsx`; concluído quando cada situação mostra uma mensagem distinta em português e o catálogo vazio oferece acesso ao cadastro.
- [x] T017 Tratar erro de leitura com ação de tentar novamente em `mobile/src/app/index.tsx`; concluído quando falha ou conteúdo inválido não aparece como lista vazia e não permite sobrescrever os dados antes de uma leitura válida.
- [x] T018 Tratar falhas de cadastro/edição e exclusão em `mobile/src/app/idea.tsx` e `mobile/src/app/index.tsx`; concluído quando erro mantém formulário ou cartão, bloqueia confirmação falsa e controles impedem envios duplicados durante gravação.

**Checkpoint**: Todos os estados observáveis definidos em [contracts/ui-and-storage.md](contracts/ui-and-storage.md) estão presentes.

## Phase 9: Verificação de aceite — etapa 12

**Objetivo**: Executar e registrar todos os critérios de aceite das cinco histórias e os resultados mensuráveis da especificação. Estes são testes de aceitação após a implementação, conforme a ordem solicitada; cada arquivo registra resultado, evidência e pendências.

- [ ] T019 [P] Verificar todos os critérios de US01 e registrar casos válidos, título com espaços, título curto, seleções ausentes, descrição vazia e ordem após cadastro em `specs/001-diario-ideias-tatuagem/verification/us01.md`; concluído quando cada critério tem resultado e evidência.
- [ ] T020 [P] Verificar todos os critérios de US02 e registrar campos do cartão, lista vazia, ordem e persistência após fechar e reabrir em `specs/001-diario-ideias-tatuagem/verification/us02.md`; concluído quando cada critério tem resultado e evidência.
- [ ] T021 [P] Verificar todos os critérios de US03 e registrar os três status, atualização da lista e persistência em `specs/001-diario-ideias-tatuagem/verification/us03.md`; concluído quando cada critério tem resultado e evidência.
- [ ] T022 [P] Verificar todos os critérios de US04 e registrar edição válida/inválida, confirmação, cancelamento e remoção permanente em `specs/001-diario-ideias-tatuagem/verification/us04.md`; concluído quando cada critério tem resultado e evidência.
- [ ] T023 [P] Verificar todos os critérios de US05 e registrar Todos, três filtros por status, correspondência e ausência de resultados em `specs/001-diario-ideias-tatuagem/verification/us05.md`; concluído quando cada critério tem resultado e evidência.
- [ ] T024 Executar checagem TypeScript, `npx expo install --check`, `npx expo-doctor@latest` e fluxos em Android físico com Expo Go, registrando SDK, aparelho, navegação, português, layout e tempo de lista/filtro com 100 ideias em `specs/001-diario-ideias-tatuagem/verification/quality.md`; concluído quando SC-004 e as exigências técnicas da constituição têm resultado ou pendência explícita.
- [ ] T025 Simular de forma controlada rejeições de `getItem`/`setItem` e JSON inválido, restaurar os métodos após o teste, e registrar leitura, gravação e exclusão em `specs/001-diario-ideias-tatuagem/verification/storage-errors.md`; concluído quando FR-013 e os casos de erro de US01, US02, US03 e US04 têm resultado e evidência sem sucesso falso ou perda silenciosa de dados.
- [ ] T026 Avaliar cadastro com pelo menos cinco usuários sem orientação e registrar tempo e taxa de conclusão em `specs/001-diario-ideias-tatuagem/verification/usability.md`; concluído quando SC-001 tem amostra, contagem, tempos e conclusão sobre o limiar de 90% em até dois minutos.

**Checkpoint**: SC-001 a SC-005 e todos os critérios de US01–US05 estão verificados; falhas obrigatórias são corrigidas e novamente testadas antes de encerrar a implementação.

## Phase 10: Documentação — etapa 13

**Objetivo**: Entregar instruções de uso e espaço para evidências visuais.

- [x] T027 Preparar `README.md` na raiz com requisitos, comandos para executar `mobile/` no Expo Go, resumo das cinco user stories, localização da especificação e seções reservadas para screenshots das duas telas; concluído quando outra pessoa consegue iniciar o aplicativo seguindo o README e sabe onde inserir as capturas sem que imagens sejam inventadas.

## Phase 11: Evoluções solicitadas — busca e favoritos

- [x] T028 Adicionar busca por título e descrição na tela Minhas Ideias, combinada ao filtro ativo, com mensagem sem resultados e ação de limpar; concluído quando a lista reage ao texto digitado sem diferenciar maiúsculas ou acentos.
- [x] T029 Adicionar favorito persistente a cada ideia, botão de estrela no cartão e botão Favoritas fixo ao lado dos filtros de status, preservando registros antigos e tratando erro de gravação; concluído quando a marcação só muda após salvar, continua após nova leitura e o botão permanece visível em largura de celular.
- [ ] T030 Verificar busca e favoritos no celular e no navegador, incluindo visibilidade do botão Favoritas, combinação de filtros, ausência de resultados, dados antigos e persistência após reinício; concluído quando cada caso tem resultado e evidência registrados no roteiro de verificação.

## Dependencies & Execution Order

### Grafo de execução

```text
T001 → T002 → T003 → T004 → T005
                          ↓
                    US02: T006 → T007
                          ↓
                    US01: (T008 ∥ T009) → T010
                          ↓
                    US04: T011 → T012 → T013
                          ↓
                    US03: T014
                          ↓
                    US05: T015
                          ↓
                    T016 → T017 → T018
                          ↓
                    T019–T023 ∥; depois T024 → T025 → T026 → T027
```

**Dependências de histórias**: US02 usa os fundamentos e pode ser testada com catálogo local de exemplo. US01 usa a lista de US02 para confirmar o salvamento. US04 usa o formulário de US01. US03 usa a edição de US04. US05 usa a lista de US02 e é executada depois de US03 para seguir a ordem pedida. Estados e erros da etapa 11 completam as histórias antes da verificação final.

| História | Núcleo funcional | Conclusão de todos os critérios de aceite |
|----------|------------------|--------------------------------------------|
| US02 | T006–T007 | T016–T017 e verificação T020 |
| US01 | T008–T010 | T018 e verificação T019 |
| US04 | T011–T013 | T018 e verificação T022 |
| US03 | T014 | T018 e verificação T021 |
| US05 | T015 | T016 e verificação T023 |

### Oportunidades de paralelismo

- Depois de T005, T006 e o planejamento visual do formulário podem ser preparados em arquivos diferentes, mas as tarefas numeradas mantêm a ordem solicitada.
- T008 e T009 podem avançar em paralelo; T010 depende de ambas.
- Após T018, T019–T023 podem ser executadas em paralelo por pessoas com instalações/dispositivos independentes, cada uma registrando sua história em arquivo próprio. T024–T026 usam o aparelho de avaliação e seguem em sequência.

| História | Exemplo de execução em paralelo |
|----------|---------------------------------|
| US01 | T008 (`mobile/src/components/FormField.tsx`) e T009 (`mobile/src/features/ideas/validation.ts`) após T005. |
| US02 | T006 → T007; o cartão é necessário para compor a lista, então não há tarefas simultâneas nesta fase. |
| US03 | T014 é uma única alteração no formulário; a verificação T021 pode correr em paralelo às verificações das outras histórias depois de T018. |
| US04 | T011 → T012 → T013; a verificação T022 pode correr em paralelo às demais verificações depois de T018. |
| US05 | T015 altera a lista já pronta; a verificação T023 pode correr em paralelo às demais verificações depois de T018. |

## Implementation Strategy

**MVP demonstrável**: concluir Setup, Foundational, US02 e US01 (T001–T010), validando cadastro e consulta local antes de ampliar o escopo. US02 vem primeiro por pedido explícito, embora ambas sejam P1.

**Entrega incremental**: acrescentar US04, depois US03 e US05; completar estados e erros; executar todos os critérios de aceite; preparar o README por último. Cada checkpoint deve ser demonstrável, e os resultados finais são registrados nos arquivos de `verification/` criados na etapa 12. Não adicionar login, backend, imagens, sincronização em nuvem ou outras funcionalidades.
