# Implementation Plan: InkBook — Diário de Ideias de Tatuagens

**Branch**: `001-diario-ideias-tatuagem` | **Date**: 2026-10-25 | **Spec**: [spec.md](spec.md)  
**Input**: Especificação funcional em `specs/001-diario-ideias-tatuagem/spec.md` e tecnologias obrigatórias informadas pelo usuário.

## Summary

Planejar um aplicativo móvel local para as cinco histórias US01–US05: cadastrar, listar, atualizar status, editar, excluir e filtrar ideias de tatuagens. Na implementação, criar o projeto Expo em `mobile/`, dentro deste repositório, preservando `.specify/` e `specs/`. Usar TypeScript, Expo Router com duas telas funcionais, FlatList, AsyncStorage, StyleSheet e componentes pequenos reutilizáveis. A tela de formulário atende cadastro e edição; uma camada de armazenamento concentra leitura e gravação. Nenhum código do aplicativo é criado nesta etapa.

## Technical Context

**Language/Version**: TypeScript fornecido pelo template Expo; fixar a versão efetiva pelo `package-lock.json` gerado.  
**Primary Dependencies**: React Native, Expo SDK 57 como alvo inicial de criação, Expo Router do template, `@react-native-async-storage/async-storage` e `expo-crypto` instalados com `npx expo install`; React Hooks nativos; sem Context API inicialmente.  
**Storage**: Uma chave de AsyncStorage para o catálogo local serializado; nenhum serviço remoto.  
**Testing**: Verificação de tipos, `npx expo install --check`, `npx expo-doctor@latest`, testes focados na validação e no armazenamento se a configuração de testes for adicionada, e roteiro manual das cinco histórias em dispositivo Android físico com Expo Go.  
**Target Platform**: Android físico com Expo Go compatível com o SDK instalado; interface adaptável a diferentes tamanhos de tela. O funcionamento em iPhone físico depende de uma distribuição de Expo Go compatível com o SDK escolhido e não é critério de conclusão deste MVP.  
**Project Type**: Aplicativo móvel Expo no subdiretório `mobile/` de um repositório Spec Kit.  
**Performance Goals**: Abrir lista e aplicar filtro em até 2 segundos com até 100 ideias; cadastro local concluível em até 2 minutos no teste de usabilidade da especificação.  
**Constraints**: Expo Go sem compilação nativa personalizada; português brasileiro; dados locais; somente duas telas funcionais e cinco user stories; sem backend, autenticação, imagens ou nuvem.  
**Scale/Scope**: Um usuário por instalação, até 100 ideias no cenário de desempenho, três status, cinco estilos e três dificuldades.

**Controle de versões**: Não existe SDK Expo instalado neste repositório nesta data. O comando de criação documentado atualmente produz SDK 57 sem `--template`; antes de programar, conferir a versão gerada em `mobile/package.json` e a versão do Expo Go do aparelho. Instalar módulos nativos apenas com `npx expo install`, conferir compatibilidade e registrar as versões resolvidas no lockfile. Se o template padrão ou o aparelho mudar, alinhar as versões antes da implementação; não fixar versões de React Native ou módulos nativos manualmente.

## Constitution Check

*GATE: Avaliado antes da pesquisa e reavaliado após o desenho.*

| Princípio | Evidência no plano | Estado |
|-----------|--------------------|--------|
| I. Tecnologia e compatibilidade com Expo Go | Expo, React Native e TypeScript; dependências instaladas segundo o SDK; validação em Android físico com Expo Go. | PASSA |
| II. MVP orientado por user stories | Somente US01–US05; sem backend, autenticação, API externa ou escopo adicional. | PASSA |
| III. Interface e navegação | Duas telas via Expo Router; FlatList para a lista; textos em português brasileiro. | PASSA |
| IV. Formulário e persistência local | Validação simples; AsyncStorage isolado; erros de leitura e gravação visíveis sem confirmar operação falha. | PASSA |
| V. Código simples e verificação | Estrutura pequena por responsabilidade, TypeScript e roteiro de aceite com registro de resultados. | PASSA |

Nenhuma exceção à constituição é necessária. A limitação do Expo Go em iPhone físico para SDKs recentes está descrita em `research.md`; a verificação obrigatória em dispositivo físico será feita no Android.

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

1. Criar `mobile/` com o template padrão do Expo, verificar SDK e Expo Go, remover telas demonstrativas e manter o lockfile; instalar AsyncStorage e expo-crypto com a CLI Expo.
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

**Reavaliação da constituição após o desenho**: PASSA nos cinco princípios. O modelo usa dados locais e os contratos cobrem validação, falhas, navegação, FlatList e persistência. Não há ampliação funcional além de US01–US05.
