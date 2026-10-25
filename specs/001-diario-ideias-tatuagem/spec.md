# Feature Specification: InkBook — Diário de Ideias de Tatuagens

**Feature Branch**: `main`  
**Created**: 2026-10-25  
**Status**: Draft  
**Input**: Aplicativo móvel para registrar, visualizar, editar, excluir e filtrar ideias de tatuagens ou desenhos, acompanhando o status de cada uma com dados locais.

## User Scenarios & Testing *(mandatory)*

### US01 — Cadastrar ideia

**Prioridade**: P1. O cadastro cria o conteúdo que sustenta os demais fluxos.

Como usuário, quero cadastrar ideias de tatuagens, para organizar os desenhos que pretendo criar.

**Critérios de aceite**:

- Informar título, estilo, dificuldade e status.
- Descrição é opcional.
- Título obrigatório, mínimo de 3 caracteres sem contar espaços nas extremidades.
- Mostrar erros quando o formulário estiver inválido.
- Após salvar, exibir a ideia na lista.

**Teste independente**: Criar uma ideia válida na tela Cadastro/Edição e confirmar sua presença na tela Minhas Ideias; tentar salvar um título inválido e verificar a mensagem de erro.

**Cenários de sucesso**:

1. **Dado** que o usuário abriu Cadastro/Edição para uma nova ideia, **quando** informa título válido, estilo e dificuldade e mantém o status inicial, **então** consegue salvar e vê a nova ideia no início da lista.
2. **Dado** que o usuário preenche os campos obrigatórios, **quando** deixa a descrição vazia ou escolhe outro status permitido, **então** consegue salvar a ideia com esses valores.

**Casos de erro**:

1. **Dado** um título ausente, composto só de espaços ou com menos de três caracteres após desconsiderar espaços nas extremidades, **quando** tenta salvar, **então** recebe um erro compreensível e a ideia não é cadastrada.
2. **Dado** que estilo ou dificuldade não foi selecionado, **quando** tenta salvar, **então** recebe indicação do campo pendente e a ideia não é cadastrada.
3. **Dado** que a gravação local falha, **quando** tenta salvar, **então** recebe aviso de falha, permanece no formulário com os dados informados e não recebe confirmação de sucesso.

### US02 — Visualizar ideias

**Prioridade**: P1. A lista permite consultar o catálogo e conferir os registros criados.

Como usuário, quero visualizar minhas ideias cadastradas, para acompanhar meus desenhos.

**Critérios de aceite**:

- Exibir título, estilo, dificuldade e status.
- Apresentar mensagem quando a lista estiver vazia.
- Manter ideias após fechar e reabrir o aplicativo.

**Teste independente**: Abrir Minhas Ideias com registros já salvos, conferir os quatro campos visíveis e reabrir o aplicativo para verificar a permanência dos dados.

**Cenários de sucesso**:

1. **Dado** que há ideias cadastradas, **quando** abre Minhas Ideias, **então** vê título, estilo, dificuldade e status de cada ideia, da mais recente para a mais antiga.
2. **Dado** que salvou ideias, **quando** fecha e reabre o aplicativo, **então** encontra os registros e seus valores preservados.
3. **Dado** que nenhuma ideia foi cadastrada, **quando** abre Minhas Ideias, **então** vê uma mensagem de lista vazia.

**Casos de erro**:

1. **Dado** que a leitura dos dados locais falha, **quando** abre Minhas Ideias, **então** vê uma mensagem de erro que distingue a falha de uma lista realmente vazia.

### US03 — Atualizar andamento

**Prioridade**: P2. O status permite acompanhar a evolução de uma ideia já registrada.

Como usuário, quero alterar o status de uma ideia, para acompanhar minha evolução.

**Critérios de aceite**:

- Status possíveis: Quero desenhar, Em andamento e Concluído.
- Permitir alterar o status na edição.
- Atualizar a listagem e manter a alteração salva.

**Teste independente**: Abrir uma ideia existente, trocar o status, salvar, conferir a lista e reabrir o aplicativo.

**Cenários de sucesso**:

1. **Dado** uma ideia com status Quero desenhar, **quando** o usuário a edita para Em andamento ou Concluído e salva, **então** a lista mostra o novo status.
2. **Dado** um status alterado e salvo, **quando** o usuário fecha e reabre o aplicativo, **então** o novo status permanece.

**Casos de erro**:

1. **Dado** que a gravação da alteração falha, **quando** tenta salvar, **então** o usuário recebe aviso e a lista não indica falsamente que a alteração foi persistida.

### US04 — Editar e excluir

**Prioridade**: P2. A edição corrige informações e a exclusão mantém o catálogo útil.

Como usuário, quero editar ou excluir ideias, para manter meu catálogo organizado.

**Critérios de aceite**:

- Editar os dados de uma ideia existente.
- Validar o formulário de edição.
- Solicitar confirmação antes de excluir.
- Remover definitivamente a ideia após confirmação.

**Teste independente**: Alterar os dados de uma ideia e verificar a lista; tentar uma edição inválida; cancelar e confirmar uma exclusão em tentativas separadas.

**Cenários de sucesso**:

1. **Dado** uma ideia existente, **quando** o usuário modifica seus dados e salva uma edição válida, **então** vê os novos valores na lista e após reabrir o aplicativo.
2. **Dado** uma ideia existente, **quando** solicita sua exclusão, **então** recebe um pedido de confirmação que identifica a ideia; ao confirmar, ela desaparece da lista e não retorna após reabrir o aplicativo.
3. **Dado** o pedido de confirmação de exclusão, **quando** o usuário cancela, **então** a ideia permanece com seus dados.

**Casos de erro**:

1. **Dado** que uma edição viola as regras dos campos, **quando** tenta salvar, **então** vê os erros do formulário e os dados salvos anteriormente permanecem.
2. **Dado** que a exclusão local falha após confirmação, **quando** a operação termina, **então** o usuário recebe aviso e a ideia continua disponível, sem mensagem de exclusão concluída.

### US05 — Filtrar por status

**Prioridade**: P3. O filtro facilita localizar ideias quando a lista cresce.

Como usuário, quero filtrar ideias pelo status, para encontrar rapidamente os desenhos.

**Critérios de aceite**:

- Filtros: Todos, Quero desenhar, Em andamento e Concluído.
- Mostrar apenas os itens correspondentes.
- Mostrar mensagem caso não existam resultados.

**Teste independente**: Com ideias nos três status, alternar entre os quatro filtros e conferir os itens visíveis e a mensagem sem resultados.

**Cenários de sucesso**:

1. **Dado** ideias em status diferentes, **quando** o usuário escolhe um status, **então** vê somente ideias com esse status, da mais recente para a mais antiga.
2. **Dado** qualquer conjunto de ideias, **quando** escolhe Todos, **então** vê todas as ideias cadastradas.
3. **Dado** que não há ideias no status escolhido, **quando** aplica esse filtro, **então** vê uma mensagem de ausência de resultados.

**Casos de erro**:

1. **Dado** um filtro ativo, **quando** uma ideia muda de status ou é excluída, **então** a lista filtrada reflete os dados salvos e mostra a mensagem de ausência de resultados se nenhum item corresponder.

### Edge Cases

- Um título com três caracteres e espaços nas extremidades é válido; um título que se torna vazio ou tem dois caracteres após desconsiderar esses espaços é inválido.
- O status inicial Quero desenhar já aparece selecionado no novo cadastro, mas o usuário pode escolher outro status antes de salvar.
- A descrição vazia não impede cadastro nem edição.
- A edição não altera a posição cronológica original da ideia; uma ideia recém-cadastrada aparece primeiro.
- Ao excluir o último item, Minhas Ideias mostra a mensagem de lista vazia; quando existem ideias mas nenhuma corresponde ao filtro, mostra a mensagem de ausência de resultados.
- Se a leitura ou a gravação local falhar, a interface comunica a falha sem apresentar dados potencialmente desatualizados como resultado confirmado.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O aplicativo DEVE oferecer duas telas principais conectadas: Minhas Ideias, com lista, filtros e ação de cadastro; e Cadastro/Edição, com formulário para criar ou modificar uma ideia.
- **FR-002**: Cada ideia DEVE ter identificador único, título, estilo, dificuldade, status e descrição opcional.
- **FR-003**: O formulário de cadastro e edição DEVE exigir título, estilo e dificuldade; o status DEVE iniciar como Quero desenhar em um novo cadastro e permitir seleção explícita.
- **FR-004**: O formulário DEVE aceitar apenas títulos com pelo menos três caracteres após desconsiderar espaços nas extremidades e apresentar erros compreensíveis para campos inválidos.
- **FR-005**: O estilo DEVE ser selecionado entre Tradicional, Realismo, Minimalista, Blackwork e Outro; a dificuldade, entre Fácil, Média e Difícil; o status, entre Quero desenhar, Em andamento e Concluído.
- **FR-006**: Após cadastro ou edição salvos, Minhas Ideias DEVE exibir os dados atualizados; cada item da lista DEVE mostrar título, estilo, dificuldade e status.
- **FR-007**: A lista DEVE ordenar as ideias pela data de cadastro, da mais recente para a mais antiga; editar uma ideia NÃO DEVE modificar sua posição por esse motivo.
- **FR-008**: O usuário DEVE poder abrir uma ideia existente para editar seus dados, incluindo o status, com as mesmas validações do cadastro.
- **FR-009**: Antes de excluir, o aplicativo DEVE solicitar confirmação; cancelamento DEVE preservar a ideia e confirmação DEVE removê-la definitivamente dos dados locais.
- **FR-010**: Minhas Ideias DEVE oferecer os filtros Todos, Quero desenhar, Em andamento e Concluído; filtros de status DEVEM exibir apenas correspondências e Todos DEVE exibir todas as ideias.
- **FR-011**: O aplicativo DEVE mostrar mensagem de lista vazia quando não houver ideias e mensagem de ausência de resultados quando um filtro não encontrar correspondências.
- **FR-012**: As ideias e alterações DEVEM permanecer disponíveis após fechar e reabrir o aplicativo no mesmo celular.
- **FR-013**: Falhas de leitura, gravação ou exclusão local DEVEM ser comunicadas ao usuário; uma operação que falhou NÃO DEVE ser apresentada como concluída.
- **FR-014**: Os textos de interface, erros e confirmações DEVEM estar em português brasileiro.
- **FR-015**: Esta versão DEVE funcionar sem login, imagens, sincronização em nuvem ou backend; os dados DEVEM permanecer armazenados localmente no celular.

### Key Entities

- **Ideia**: Registro de tatuagem ou desenho com identificador único, título, estilo, dificuldade, status, descrição opcional e ordem de cadastro.
- **Status**: Estado de andamento de uma ideia, limitado a Quero desenhar, Em andamento ou Concluído.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Em avaliação com pelo menos cinco usuários, ao menos 90% conseguem cadastrar uma ideia válida e encontrá-la na lista em até dois minutos, sem orientação adicional.
- **SC-002**: Em todos os cenários de aceitação de dados válidos, cadastro, edição, mudança de status e exclusão confirmada apresentam o resultado correto na lista e após fechar e reabrir o aplicativo.
- **SC-003**: Em todos os testes com título inválido, estilo ou dificuldade ausente, o formulário informa o problema e impede o salvamento.
- **SC-004**: Com até 100 ideias cadastradas, a abertura da lista e a aplicação de cada filtro mostram o resultado esperado em até dois segundos em um celular de avaliação.
- **SC-005**: Em todos os testes de lista vazia, filtro sem resultados, cancelamento de exclusão e falha simulada de armazenamento, a mensagem ou o estado exibido corresponde ao resultado real da operação.

## Assumptions

- O aplicativo é usado por uma pessoa em um único celular; não há contas nem compartilhamento de dados nesta versão.
- A ordem por recência usa o momento do cadastro, preservado quando a ideia é editada.
- A descrição pode ser deixada vazia e não tem formato obrigatório.
- Os filtros atuam sobre as ideias já salvas; Todos é a seleção inicial ao abrir Minhas Ideias.
- A exclusão confirmada é permanente dentro do armazenamento local do aplicativo, sem lixeira ou desfazer nesta versão.
- A disponibilidade de armazenamento local no celular é necessária para persistir as ideias; não há serviço externo como dependência.
