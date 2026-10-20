<!--
Relatório de impacto de sincronização
Versão: inexistente → 1.0.0 (constituição inicial).
Princípios adicionados: I. Usabilidade; II. Manutenibilidade; III. Confiabilidade;
IV. Desempenho; V. Segurança.
Seções adicionadas: Restrições técnicas e de escopo; Fluxo de desenvolvimento e qualidade;
Governança. Seções removidas: nenhuma.
Referência: skill speckit-constitution e constitution-template.md da instalação local
em /home/acer/Área de trabalho/racha-conta; nenhum requisito daquele projeto foi importado.
Templates do InkBook:
- constitution-template.md: ausente; estrutura do modelo de referência aplicada ao documento.
- plan-template.md: ausente; sincronização pendente quando o Spec Kit for inicializado.
- spec-template.md: ausente; sincronização pendente quando o Spec Kit for inicializado.
- tasks-template.md: ausente; sincronização pendente quando o Spec Kit for inicializado.
- templates/commands/*.md: ausentes; revisão pendente quando disponíveis.
README, documentos de execução e extensões: inexistentes; nenhuma atualização aplicável.
Pendências: inicializar os demais artefatos do Spec Kit antes de executar etapas dependentes,
sem avançar de etapa automaticamente. Revisão e aprovação desta constituição pelo usuário.
Nenhum placeholder de conteúdo foi adiado.
-->

# InkBook — Constituição

## Core Principles

### I. Usabilidade

A interface DEVE permitir cadastrar, listar, consultar, editar e excluir registros,
e alterar seu status com navegação consistente por Expo Router. A listagem DEVE usar
FlatList. A exclusão DEVE exigir confirmação e permitir cancelamento sem perda de dados.

Os formulários DEVEM exibir rótulos persistentes e erros próximos aos campos,
preservar os valores após falhas e bloquear submissões duplicadas enquanto houver
gravação em andamento. Carregamento, lista vazia, sucesso e falha DEVEM ter feedback
compreensível em português. Status e erros NÃO DEVEM depender apenas de cor.

A identidade visual DEVE priorizar preto, branco e cinza e tipografia legível.
Controles interativos DEVEM oferecer área de toque mínima de 48 × 48 unidades
lógicas; ações com ícones DEVEM ter nome acessível. Campos e controles DEVEM expor
rótulos, papéis e estados apropriados ao leitor de tela. Texto comum DEVE ter
contraste mínimo de 4,5:1. O layout DEVE respeitar áreas seguras, permitir rolagem
com teclado aberto e manter ações disponíveis com ampliação de fonte.

**Verificação:** executar os fluxos principais no dispositivo ou emulador definido
no plano; verificar uma largura de 320 unidades lógicas, fonte ampliada e leitor de
tela da plataforma avaliada. Registrar resultado, ambiente e eventuais limitações.

### II. Manutenibilidade

O aplicativo DEVE usar React Native, Expo, TypeScript em modo estrito e Expo Router.
Código de aplicação DEVE estar em arquivos TypeScript; configuração de ferramentas
pode usar o formato exigido por elas. Tipos de domínio DEVEM ser explícitos.
O uso de `any`, supressões de erros de tipo ou regras de lint DEVE ter justificativa
local e restrita ao caso necessário.

Rotas e telas, componentes reutilizáveis, tipos de domínio, validação e acesso ao
armazenamento DEVEM ter responsabilidades separadas. AsyncStorage NÃO DEVE ser
acessado diretamente por componentes visuais. Regras de validação e opções válidas
DEVEM ter uma única fonte compartilhada. A estrutura concreta de pastas será
definida no plano.

Dependências e abstrações novas DEVEM atender a um requisito ou reduzir duplicação
real. NÃO se exigem arquitetura distribuída, camadas sem responsabilidade concreta
ou infraestrutura de produção para esta entrega acadêmica.

**Verificação:** revisão de responsabilidades e dependências, checagem TypeScript
sem erros e lint sem erros. O plano DEVE definir comandos reproduzíveis e registrar
o gerenciador de pacotes e seu arquivo de lock.

### III. Confiabilidade

Entradas DEVEM ser validadas antes de criar ou atualizar registros. Título vazio
após remoção de espaços externos DEVE ser rejeitado; obrigatoriedade, limites de
texto e valores permitidos para estilo e dificuldade DEVEM ser definidos na
especificação. Status DEVE aceitar somente “Quero praticar”, “Praticando” e
“Concluído”. Identificadores DEVEM ser únicos e estáveis.

Dados lidos do AsyncStorage DEVEM ser tratados como desconhecidos e validados em
tempo de execução; conversões de tipo TypeScript não substituem essa validação.
Ausência de dados DEVE produzir lista vazia. Falhas de leitura, JSON inválido ou
estrutura incompatível DEVEM produzir erro recuperável, sem apagar ou sobrescrever
automaticamente o conteúdo original.

A camada de persistência DEVE centralizar leitura e escrita, usar chave com namespace
do InkBook e versão de formato, e impedir perda de atualizações concorrentes.
Nenhuma escrita DEVE ocorrer antes de concluir uma leitura inicial válida.
A interface só DEVE confirmar sucesso após a gravação terminar; falhas DEVEM manter
o último estado confirmado e oferecer nova tentativa sem duplicar registros.

**Verificação:** testes automatizados DEVEM cobrir entradas válidas e inválidas,
campos obrigatórios, limites e valores fora das opções; persistência ausente e válida,
JSON corrompido, estrutura inválida e rejeição de leitura ou escrita. Testes de
integração DEVEM verificar cadastro, edição, mudança de status, cancelamento e
confirmação de exclusão, além da preservação dos dados diante de falha de gravação.
Um roteiro manual DEVE confirmar persistência após encerrar e reabrir o aplicativo.

### IV. Desempenho

A lista DEVE usar FlatList com chave baseada no identificador estável do registro,
sem índice como identidade e sem ScrollView vertical envolvendo a mesma lista.
Leitura e serialização do armazenamento NÃO DEVEM ocorrer a cada renderização ou
a cada tecla; gravações DEVEM corresponder a alterações confirmadas.

O estado DEVE evitar fontes duplicadas de verdade. Otimizações como memoização,
ajuste de janelas da FlatList ou bibliotecas adicionais só DEVEM ser introduzidas
quando uma medição ou problema observado justificar seu custo.

**Verificação:** executar listagem, rolagem, abertura de detalhes e atualização com
100 registros sintéticos no ambiente documentado no plano. NÃO DEVE haver bloqueio
que impeça concluir as ações nem avisos de chaves duplicadas ou listas virtualizadas
aninhadas. Registrar observações; problemas detectados DEVEM ser investigados antes
da entrega, sem exigir metas de FPS ou infraestrutura de benchmark.

### V. Segurança

A primeira versão DEVE funcionar localmente sem backend, autenticação ou serviços
externos. Dados dos registros NÃO DEVEM ser enviados a servidores, analytics ou
telemetria adicionada pelo aplicativo. Dependências de desenvolvimento e obtenção
de pacotes não constituem serviços de execução do produto.

AsyncStorage DEVE conter somente dados necessários ao diário. NÃO DEVEM ser
armazenados senhas, tokens, documentos pessoais ou outros dados sensíveis
desnecessários. A documentação DEVE explicar que esse armazenamento não oferece
garantia de criptografia e que desinstalar ou limpar os dados do aplicativo pode
remover os registros; backup e sincronização não são garantidos nesta versão.

Permissões do dispositivo só DEVEM ser solicitadas por funcionalidades aprovadas
que as exijam. Textos do usuário DEVEM ser exibidos como dados, sem execução de código.
Logs NÃO DEVEM incluir conteúdo integral de desenhos ou outros dados pessoais.
Segredos e credenciais NÃO DEVEM ser incluídos no repositório.

**Verificação:** revisar permissões, dependências, logs, chamadas de rede do código
de aplicação e arquivos versionados. Validar em modo offline os fluxos principais.
Testes de validação DEVEM incluir dados locais adulterados.

## Restrições técnicas e de escopo

A entrega DEVE ser um aplicativo mobile pequeno, com pelo menos duas telas navegáveis,
formulário validado e armazenamento local com AsyncStorage. O domínio inclui título,
descrição, estilo de tatuagem, dificuldade e status dos registros.

Os fluxos obrigatórios são cadastro, listagem, detalhes, edição, exclusão com
confirmação e alteração de status. A especificação DEVE resolver as decisões ainda
abertas sobre imagens, catálogo de estilos, escala de dificuldade, campos opcionais,
limites e plataformas avaliadas. Sugestões feitas na conversa NÃO constituem
requisitos aprovados automaticamente.

Recursos adicionais, incluindo histórico de sessões, filtros, imagens, exportação
e estatísticas, só podem entrar após decisão explícita de escopo e atualização dos
artefatos afetados. O plano DEVE escolher uma combinação compatível das dependências
do Expo e registrar como executar a aplicação, sem fixar versões nesta constituição.

## Fluxo de desenvolvimento e qualidade

O desenvolvimento DEVE seguir, nesta ordem, as etapas individuais:
`/speckit-constitution`, `/speckit-specify`, `/speckit-plan`,
`/speckit-tasks` e `/speckit-implement`.
Cada etapa DEVE produzir artefato revisável e aguardar aprovação explícita do usuário
antes de iniciar a seguinte. A aprovação de uma etapa NÃO autoriza as demais.
Código de aplicação e componentes só podem ser criados na implementação autorizada.

A especificação DEVE atribuir identificadores estáveis às user stories, requisitos
e critérios de aceite e descrever cenários observáveis de sucesso e erro.
O plano DEVE incluir uma verificação dos cinco princípios e definir ambiente,
organização, estratégia de persistência e ferramentas mínimas de teste.
As tarefas DEVEM referenciar as histórias e requisitos atendidos e incluir as
verificações necessárias. Uma tabela simples em Markdown DEVE relacionar requisitos,
critérios de aceite, tarefas, arquivos implementados e evidências de teste;
não é necessário inserir identificadores em toda linha de código.

A entrega DEVE passar por checagem de tipos, lint, testes automatizados das regras
e persistência e roteiro manual dos fluxos principais. Os testes DEVEM verificar
comportamentos, incluindo erros e limites; snapshots isolados NÃO substituem esses
testes. Não há exigência de percentual arbitrário de cobertura, pipeline de CI,
publicação em lojas ou suíte automatizada completa em dispositivos.

As evidências DEVEM indicar comando ou roteiro executado, resultado e ambiente.
Verificações não executadas DEVEM ser marcadas como pendentes, sem alegação de
aprovação. Falhas relevantes DEVEM ser corrigidas ou tratadas como exceção explícita
aprovada pelo usuário antes de declarar a entrega concluída.

## Governance

Esta constituição rege especificação, planejamento, tarefas, implementação e revisão.
Conflitos entre artefatos DEVEM ser resolvidos antes de continuar o trabalho afetado.

Alterações DEVEM registrar motivo, impacto em requisitos e artefatos, versão e data,
e ser submetidas à aprovação explícita do usuário. Exceções DEVEM indicar regra,
justificativa, alcance e condição de revisão; não podem ser aplicadas silenciosamente.

A versão segue MAJOR.MINOR.PATCH: MAJOR para remoção ou redefinição incompatível
de princípios; MINOR para novos princípios ou ampliação material das obrigações;
PATCH para esclarecimentos sem mudança de obrigação. Toda emenda DEVE atualizar
o relatório de sincronização e os templates e documentos existentes afetados.

Esta é a versão inicial proposta para revisão, ainda não ratificada. A ratificação
DEVE ser registrada somente após aprovação explícita do conteúdo pelo usuário.
A data de última alteração registra a elaboração desta proposta.

**Version**: 1.0.0 | **Ratified**: Pendente de aprovação | **Last Amended**: 2026-10-19
