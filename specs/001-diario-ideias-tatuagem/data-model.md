# Modelo de dados: InkBook

**Referência**: [spec.md](spec.md), requisitos FR-002 a FR-013.

## Entidade TattooIdea

Uma ideia é um registro local independente; não há usuário, conta, imagem ou relação com servidor. O tipo TypeScript `TattooIdea` contém os campos abaixo, incluindo a marcação de favorito adicionada depois do MVP inicial.

| Campo | Tipo planejado | Regra |
|-------|----------------|-------|
| `id` | string | UUID único, criado uma vez e imutável. |
| `title` | string | Obrigatório; salvar sem espaços nas extremidades; comprimento após esse ajuste de pelo menos 3 caracteres. |
| `description` | string | Opcional para o usuário; armazenar string vazia quando não informada. |
| `style` | união de strings | Uma das cinco opções de estilo. |
| `difficulty` | união de strings | Uma das três opções de dificuldade. |
| `status` | união de strings | Um dos três estados de andamento. |
| `createdAt` | string | Instante de cadastro em formato ISO 8601; imutável na edição. |
| `favorite` | boolean | Inicia falso; pode ser alternado no cartão e permanece salvo. |

### Domínios permitidos

| Campo | Valores |
|-------|---------|
| `style` | Tradicional, Realismo, Minimalista, Blackwork, Outro |
| `difficulty` | Fácil, Média, Difícil |
| `status` | Quero desenhar, Em andamento, Concluído |

## Estado do formulário

O rascunho do formulário pode ter `style` e `difficulty` ainda não selecionados; somente uma validação aprovada produz uma `TattooIdea`. Em cadastro, `status` começa em Quero desenhar e pode ser alterado antes de salvar. Em edição, todos os campos são preenchidos com a ideia carregada; `id` e `createdAt` são preservados.

Erros de validação são associados ao campo correspondente. Título ausente, só com espaços ou com menos de três caracteres após remover espaços das extremidades impede gravação. Estilo e dificuldade ausentes ou fora das opções impedem gravação. Status fora das opções também impede gravação. Descrição vazia é válida. A mesma função de validação atende cadastro e edição.

## Catálogo local

O catálogo é um array de `TattooIdea` armazenado sob a chave `@inkbook/ideas/v1`. O item mais recente é inserido no início; a ordem é preservada na edição e na filtragem. `createdAt` fornece a data de cadastro para conferência, e a posição do array resolve empates de instante. O identificador é a chave de renderização e de localização para edição ou exclusão.

### Invariantes

- Identificadores não se repetem no catálogo.
- Toda ideia carregada na interface tem os oito campos e valores válidos nos domínios definidos.
- Registros antigos sem a marcação de favorito são carregados com valor falso, sem perda dos demais campos.
- O catálogo carregado está em ordem de cadastro, do mais recente para o mais antigo.
- A edição substitui somente a ideia encontrada pelo `id` e não altera `id`, `createdAt` ou posição.
- A exclusão remove somente a ideia confirmada; depois da gravação bem-sucedida, ela não reaparece após reiniciar o aplicativo.
- Valor ausente na chave representa catálogo vazio. Rejeição de leitura, JSON inválido ou dados que violem as invariantes representam erro de armazenamento; o aplicativo não os converte em lista vazia nem os sobrescreve automaticamente.

## Transições de status

| Origem | Destino permitido | Ação |
|--------|-------------------|------|
| Novo cadastro | Quero desenhar por padrão; qualquer outro status permitido se selecionado | Salvar ideia válida. |
| Quero desenhar | Quero desenhar, Em andamento ou Concluído | Editar e salvar. |
| Em andamento | Quero desenhar, Em andamento ou Concluído | Editar e salvar. |
| Concluído | Quero desenhar, Em andamento ou Concluído | Editar e salvar. |

Não há histórico de mudanças de status nesta versão; o valor salvo é o estado atual da ideia.
