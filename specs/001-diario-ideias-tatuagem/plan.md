# Implementation Plan: InkBook — Diário de Ideias de Tatuagens

**Branch**: `001-diario-ideias-tatuagem` | **Date**: 2026-10-25 | **Spec**: [spec.md](spec.md)  
**Input**: Especificação funcional em `specs/001-diario-ideias-tatuagem/spec.md` e tecnologias obrigatórias informadas pelo usuário.

## Summary

Aplicativo móvel local para as cinco histórias US01–US05: cadastrar, listar, atualizar status, editar, excluir e filtrar ideias de tatuagens. O projeto Expo fica em `mobile/`, dentro deste repositório, preservando `.specify/` e `specs/`. Usa TypeScript, Expo Router com duas telas funcionais, FlatList, AsyncStorage, StyleSheet e componentes pequenos reutilizáveis. A tela de formulário atende cadastro e edição; uma camada de armazenamento concentra leitura e gravação.

## Technical Context

**Language/Version**: TypeScript do template Expo e Node.js 24 para a ferramenta local; versões efetivas registradas em `mobile/package-lock.json`.
**Primary Dependencies**: React Native, Expo SDK 58 instalado pelo scaffold, Expo Router, `@react-native-async-storage/async-storage` e `expo-crypto` instalados com `npx expo install`; React Hooks nativos; sem Context API. A prévia no Chrome acrescenta `react-native-web` e `react-dom` compatíveis com o mesmo SDK.
**Storage**: Uma chave de AsyncStorage para o catálogo local serializado; nenhum serviço remoto.  
**Testing**: Verificação de tipos, `npx expo install --check`, `npx expo-doctor@latest`, testes focados na validação e no armazenamento se a configuração de testes for adicionada, e roteiro manual das cinco histórias em dispositivo Android físico com Expo Go.  
**Target Platform**: Android físico com Expo Go compatível com o SDK instalado e prévia no Chrome; interface adaptável a diferentes tamanhos de tela. O funcionamento em iPhone físico depende de uma distribuição de Expo Go compatível com o SDK escolhido e não é critério de conclusão deste MVP.
**Project Type**: Aplicativo móvel Expo no subdiretório `mobile/` de um repositório Spec Kit.  
**Performance Goals**: Abrir lista e aplicar filtro em até 2 segundos com até 100 ideias; cadastro local concluível em até 2 minutos no teste de usabilidade da especificação.  
**Constraints**: Expo Go sem compilação nativa personalizada; português brasileiro; dados locais; duas telas funcionais, cinco user stories iniciais e as evoluções de busca e favoritos solicitadas depois; sem backend, autenticação, imagens ou nuvem.
**Scale/Scope**: Um usuário por instalação, até 100 ideias no cenário de desempenho, três status, cinco estilos e três dificuldades.

**Controle de versões**: O scaffold efetivamente criou Expo SDK 58.0.19; o Node 20 padrão do terminal não atende ao mínimo do SDK 58, então a implementação e as verificações usam Node 24.22.1 já instalado e registrado em `mobile/.nvmrc`. Os módulos nativos foram instalados com `npx expo install`; `npx expo install --check` e `expo-doctor` confirmaram compatibilidade. A versão do Expo Go no aparelho ainda deve ser conferida pelo usuário no teste físico.

## Constitution Check

*GATE: Avaliado antes da pesquisa e reavaliado após o desenho.*

| Princípio | Evidência no plano | Estado |
|-----------|--------------------|--------|
| I. Tecnologia e compatibilidade com Expo Go | Expo, React Native e TypeScript; dependências instaladas segundo o SDK; validação em Android físico com Expo Go. | PASSA |
| II. MVP orientado por user stories | US01–US05 e as evoluções de busca e favoritos autorizadas depois; sem backend, autenticação ou API externa. | PASSA |
| III. Interface e navegação | Duas telas via Expo Router; FlatList para a lista; textos em português brasileiro. | PASSA |
| IV. Formulário e persistência local | Validação simples; AsyncStorage isolado; erros de leitura e gravação visíveis sem confirmar operação falha. | PASSA |
| V. Código simples e verificação | Estrutura pequena por responsabilidade, TypeScript e roteiro de aceite com registro de resultados. | PASSA |

Nenhuma exceção à constituição é necessária. Busca e favoritos foram autorizados pelo usuário após o escopo inicial das cinco histórias. A limitação do Expo Go em iPhone físico para SDKs recentes está descrita em `research.md`; a verificação obrigatória em dispositivo físico será feita no Android.

## Project Structure

### Documentation (this feature)

```text
specs/001-diario-ideias-tatuagem/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── ui-and-storage.md
└── checklists/
    └── requirements.md
```

### Source Code (repository root; estrutura planejada para a implementação)

```text
.specify/                       # Artefatos do Spec Kit preservados
specs/                          # Especificação e planejamento preservados
mobile/                         # Novo projeto Expo criado na implementação
├── src/
│   ├── app/
│   │   ├── _layout.tsx          # Stack do Expo Router
│   │   ├── index.tsx            # Minhas Ideias
│   │   └── idea.tsx             # Cadastro/Edição, com id opcional na rota
│   ├── components/
│   │   ├── IdeaCard.tsx
│   │   └── FormField.tsx
│   └── features/ideas/
│       ├── types.ts             # TattooIdea e opções permitidas
│       ├── validation.ts        # Validação pura do formulário
│       └── storage.ts           # Leitura e gravação locais
├── package.json
├── package-lock.json
└── tsconfig.json
```

**Structure Decision**: Projeto Expo isolado em `mobile/` para que o scaffold não substitua a documentação já existente na raiz. `src/app/index.tsx` e `src/app/idea.tsx` são as duas telas funcionais; `id` ausente significa cadastro e `id` presente significa edição. Os componentes compartilhados concentram cartão e campo de formulário; não há Context API porque cada tela pode carregar dados ao receber foco e confirmar gravações pela camada local. O boilerplate de rotas e telas extras do template será removido durante a implementação.

## Implementation Approach

1. Criar `mobile/` com o template padrão do Expo, verificar SDK e Expo Go, remover telas demonstrativas e manter o lockfile; instalar AsyncStorage e expo-crypto com a CLI Expo. Executado com SDK 58 e Node 24; confirmação no Expo Go físico permanece pendente.
2. Definir `TattooIdea`, uniões de estilo, dificuldade e status e constantes de opções. `id` será UUID, `createdAt` será o instante ISO de cadastro e ficará imutável nas edições.
3. Implementar a camada local com `loadIdeas` e `saveIdeas`: chave ausente corresponde a catálogo vazio; erro de leitura ou conteúdo inválido corresponde a estado de erro e bloqueia alteração até nova leitura. Atualizar a interface somente depois da gravação concluída; impedir envio simultâneo durante a operação.
4. Implementar validação reutilizada por cadastro e edição: título com no mínimo três caracteres após `trim`, estilo e dificuldade obrigatórios, status limitado às três opções; descrição aceita vazia.
5. Montar Minhas Ideias com carregamento, erro e tentativa de nova leitura, FlatList ordenada por cadastro mais recente, mensagens distintas para lista vazia e filtro sem resultados, cartões e quatro filtros.
6. Montar Cadastro/Edição com campos e erros em português; valor inicial do status Quero desenhar; carregar uma ideia pelo `id` na edição e exibir erro se não existir; ao salvar, voltar à lista e recarregá-la. Excluir somente após confirmação; cancelamento preserva o registro.
7. Verificar as cinco histórias, reinício do aplicativo, erros simulados de armazenamento, filtro após edição ou exclusão, navegação, layout em telas de tamanhos diferentes e execução em Android físico com Expo Go. Registrar cada resultado; corrigir falhas nos fluxos obrigatórios antes de concluir.

## Phase 0: Research

Decisões, alternativas e fontes oficiais estão em [research.md](research.md). Todas as dúvidas de versão e integração identificadas para esta etapa foram resolvidas sem marcador de esclarecimento pendente.

## Phase 1: Design & Contracts

- [data-model.md](data-model.md) define campos, validação, ordenação, transições e invariantes do catálogo.
- [contracts/ui-and-storage.md](contracts/ui-and-storage.md) define ações e estados observáveis das duas telas e o contrato da camada local.
- [quickstart.md](quickstart.md) registra comandos e verificações para a implementação posterior.

**Reavaliação da constituição após o desenho**: PASSA nos cinco princípios. O modelo usa dados locais e os contratos cobrem validação, falhas, navegação, FlatList e persistência. A ampliação posterior de busca e favoritos permanece nas duas telas e no armazenamento local.

## Evolução posterior

A busca usa título e descrição em memória, após normalizar maiúsculas e acentos, junto ao filtro ativo. Favoritos usam um campo booleano no catálogo local existente. Na leitura, registros anteriores sem esse campo recebem falso em memória; a marcação só aparece como salva após a gravação local concluir. O filtro Favoritas e os estados vazios são apresentados na lista. A verificação manual foi adicionada ao roteiro de US05 e à tarefa T030.
