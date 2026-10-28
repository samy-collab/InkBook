# InkBook — Diário de Ideias de Tatuagens

**TDE 2 — Spec-Driven Development (SDD)**

## Descrição e objetivo

ooooO InkBook é um aplicativo para registrar e organizar ideias de tatuagens ou desenhos e acompanhar o andamento de cada uma. O usuário pode cadastrar, visualizar, editar, excluir e filtrar ideias nas telas **Minhas Ideias** e **Cadastro/Edição**. Os dados são armazenados localmente no dispositivo, sem login, backend ou sincronização em nuvem.

## Tecnologias utilizadas

- **React Native com Expo SDK 58 e TypeScript** para o aplicativo.
- **Expo Router** para navegar entre as duas telas.
- **FlatList** para apresentar as ideias, da mais recente para a mais antiga.
- **AsyncStorage** para persistir os dados localmente.
- **React Hooks** para o estado das telas e **StyleSheet** para os estilos.
- **expo-crypto** para gerar identificadores únicos.
- **React Native Web** para uma prévia opcional no navegador.

As versões instaladas estão em [mobile/package.json](mobile/package.json) e [mobile/package-lock.json](mobile/package-lock.json).

## User stories e critérios de aceite

As cinco histórias abaixo reproduzem as histórias e os critérios de aceite da [especificação final](specs/001-diario-ideias-tatuagem/spec.md).

### US01 — Cadastrar ideia

Como usuário, quero cadastrar ideias de tatuagens, para organizar os desenhos que pretendo criar.

**Critérios de aceite:**

- Informar título, estilo, dificuldade e status.
- Descrição é opcional.
- Título obrigatório, mínimo de 3 caracteres sem contar espaços nas extremidades.
- Mostrar erros quando o formulário estiver inválido.
- Após salvar, exibir a ideia na lista.

### US02 — Visualizar ideias

Como usuário, quero visualizar minhas ideias cadastradas, para acompanhar meus desenhos.

**Critérios de aceite:**

- Exibir título, estilo, dificuldade e status.
- Apresentar mensagem quando a lista estiver vazia.
- Manter ideias após fechar e reabrir o aplicativo.

### US03 — Atualizar andamento

Como usuário, quero alterar o status de uma ideia, para acompanhar minha evolução.

**Critérios de aceite:**

- Status possíveis: Quero desenhar, Em andamento e Concluído.
- Permitir alterar o status na edição.
- Atualizar a listagem e manter a alteração salva.

### US04 — Editar e excluir

Como usuário, quero editar ou excluir ideias, para manter meu catálogo organizado.

**Critérios de aceite:**

- Editar os dados de uma ideia existente.
- Validar o formulário de edição.
- Solicitar confirmação antes de excluir.
- Remover definitivamente a ideia após confirmação.

### US05 — Filtrar por status

Como usuário, quero filtrar ideias pelo status, para encontrar rapidamente os desenhos.

**Critérios de aceite:**

- Filtros: Todos, Quero desenhar, Em andamento e Concluído.
- Mostrar apenas os itens correspondentes.
- Mostrar mensagem caso não existam resultados.

Após as cinco histórias iniciais, foram acrescentadas a busca por título ou descrição e a marcação de ideias favoritas. Esses requisitos estão registrados como FR-016 e FR-017 na especificação.

## Processo SDD com Spec Kit

O desenvolvimento foi organizado em cinco etapas:

1. **Constitution:** a [constituição](.specify/memory/constitution.md) definiu as regras do projeto, como uso de Expo Go, interface em português, armazenamento local e verificação dos critérios de aceite.
2. **Specify:** a [especificação](specs/001-diario-ideias-tatuagem/spec.md) registrou as cinco user stories, regras de negócio, critérios verificáveis e casos de sucesso e erro.
3. **Plan:** o [plano](specs/001-diario-ideias-tatuagem/plan.md) definiu tecnologias, arquitetura, modelo de dados, navegação e persistência.
4. **Tasks:** a [lista de tarefas](specs/001-diario-ideias-tatuagem/tasks.md) organizou a implementação em sequência e registra as etapas concluídas e pendentes.
5. **Implement:** o aplicativo foi desenvolvido em [mobile/](mobile/), seguindo o plano e atualizando o checklist de tarefas.

## Revisão da especificação

AApós revisar a especificação gerada pela IA, acrescentei a validação que impede cadastrar ideias com títulos compostos apenas por espaços.

## Instalação e execução com Expo Go

É necessário **Node.js 22.13 ou superior**. O projeto registra Node 24 em `mobile/.nvmrc`. Instale no celular uma versão do **Expo Go compatível com o Expo SDK 58**.

Na raiz do repositório, execute:

```bash
cd mobile
nvm use
npm install
npx expo start --port 8082
```

Se não usar `nvm`, ative manualmente uma versão compatível do Node.js e ignore a linha `nvm use`. O Expo mostra um **QR code no terminal**; ele não abre automaticamente o aplicativo no computador. Deixe o terminal aberto. No Android, abra o Expo Go e leia o QR code. O celular e o computador devem estar na mesma rede Wi-Fi.

Para abrir a prévia no navegador, interrompa o servidor anterior com `Ctrl+C` e execute, dentro de `mobile/`:

```bash
npx expo start --web --port 8082 --clear
```

Verificações automáticas disponíveis:

```bash
npm run typecheck
npm run lint
npx expo install --check
```

Os testes manuais no celular, incluindo permanência dos dados após fechar e reabrir o aplicativo, devem ser realizados e registrados separadamente. O [guia de verificação](specs/001-diario-ideias-tatuagem/quickstart.md) reúne os cenários previstos.

## Capturas de tela

Os espaços abaixo estão reservados para **capturas reais** a serem adicionadas na entrega.

### 1. Listagem

_Inserir aqui a captura da tela Minhas Ideias._

### 2. Formulário

_Inserir aqui a captura da tela de Cadastro/Edição._

### 3. Lista com ideias cadastradas

_Inserir aqui a captura da listagem com ideias salvas._

## Artefatos do Spec Kit

- [Constituição](.specify/memory/constitution.md)
- [Especificação — spec.md](specs/001-diario-ideias-tatuagem/spec.md)
- [Plano — plan.md](specs/001-diario-ideias-tatuagem/plan.md)
- [Tarefas — tasks.md](specs/001-diario-ideias-tatuagem/tasks.md)
