# Contratos de interface e armazenamento: InkBook

**Referência**: [spec.md](../spec.md). Estes contratos descrevem o comportamento observável e os limites da camada local; não expõem API de rede.

## Navegação

| Origem | Ação | Destino e resultado |
|--------|------|---------------------|
| Minhas Ideias | Tocar em cadastrar | Cadastro/Edição em modo novo, sem `id`. |
| Minhas Ideias | Tocar em editar um cartão | Cadastro/Edição em modo edição, com `id` da ideia. |
| Cadastro/Edição | Salvar com sucesso | Voltar a Minhas Ideias e mostrar os valores persistidos. |
| Cadastro/Edição | Voltar sem salvar | Voltar a Minhas Ideias sem alterar os dados. |

A rota funcional de formulário é única. Um `id` desconhecido no modo edição produz mensagem de erro e impede salvamento; não cria uma nova ideia implicitamente.

## Minhas Ideias

**Entrada**: Ao abrir ou receber foco, carregar o catálogo local. Enquanto carrega, mostrar estado de carregamento. Se houver falha de leitura, mostrar erro e ação de tentar novamente; não mostrar mensagem de catálogo vazio nesse caso.

**Lista**: Renderizar com FlatList. Cada cartão exibe título, estilo, dificuldade e status e oferece acesso à edição e à exclusão. A ordem é do cadastro mais recente para o mais antigo. O filtro inicial é Todos; as outras escolhas são Quero desenhar, Em andamento e Concluído. Ao trocar o filtro, a lista muda imediatamente com base nas ideias carregadas.

**Estados vazios**: Sem ideias cadastradas, mostrar mensagem de catálogo vazio e acesso ao cadastro. Com ideias cadastradas e filtro sem correspondências, mostrar mensagem de ausência de resultados. Após salvar, alterar status ou excluir, os itens e estados vazios refletem os dados persistidos.

**Busca e favoritos**: Buscar em título e descrição sem diferenciar maiúsculas ou acentos, em conjunto com o filtro ativo. Mostrar ausência de resultados e ação para limpar quando a busca não encontrar ideias. Cada cartão tem uma estrela para marcar ou desmarcar favorito; o botão Favoritas permanece visível ao lado dos filtros de status, mostra somente as ideias marcadas e informa quando estiver vazio. Um segundo toque no botão volta a Todos. Só atualizar a marcação visual depois de salvar com sucesso; falha de gravação mantém a marcação anterior e mostra erro. Registros anteriores sem esse campo são tratados como não favoritos.

**Exclusão**: Antes de remover, apresentar confirmação que identifique a ideia, com ações cancelar e excluir. Cancelar não grava nem remove. Confirmar grava o catálogo sem o item; durante a operação, impedir repetição. Após sucesso, remover o cartão; em falha, manter o cartão e mostrar erro sem confirmação de exclusão.

## Cadastro/Edição

**Campos**: Título, descrição opcional, estilo, dificuldade e status. Estilo, dificuldade e status oferecem apenas as opções do modelo de dados; em novo cadastro, status inicial é Quero desenhar. Em edição, preencher os campos com os valores da ideia encontrada.

**Validação**: Ao salvar, mostrar erros em português junto aos campos inválidos. O título é válido se tiver pelo menos três caracteres após desconsiderar espaços nas extremidades; estilo e dificuldade devem estar selecionados; status deve pertencer às opções. Não gravar enquanto houver erro. O mesmo contrato vale para cadastro e edição.

**Salvamento**: Em sucesso, persistir primeiro e só depois voltar à lista. Em falha, manter os valores digitados, mostrar erro de armazenamento e permitir nova tentativa. Durante a gravação, impedir envios duplicados. A edição conserva `id`, `createdAt` e a posição de cadastro.

## Camada de armazenamento

| Operação planejada | Entrada | Saída esperada | Falha |
|--------------------|---------|----------------|-------|
| `loadIdeas` | Nenhuma | Array validado de `TattooIdea`; `[]` se a chave não existir. | Rejeitar com erro de leitura em caso de falha de acesso ou conteúdo inválido. |
| `saveIdeas` | Array validado de `TattooIdea` | Conclusão somente após gravação local. | Rejeitar com erro de gravação; estado visual anterior permanece. |

As operações de cadastro, edição e exclusão montam um novo array a partir do catálogo carregado e chamam `saveIdeas`. A interface só anuncia sucesso após a conclusão da operação. Nenhuma falha de leitura pode disparar gravação de array vazio, para evitar perda de dados locais.

## Textos e acessibilidade

Rótulos, erros, confirmação e mensagens de estado serão em português brasileiro. Campos e ações terão nomes compreensíveis para leitores de tela e áreas de toque utilizáveis em celular. O layout deve permanecer legível com teclado aberto e em tamanhos de tela diferentes; isso será verificado no dispositivo durante a implementação.
