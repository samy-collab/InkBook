# Pesquisa técnica: InkBook

**Data**: 2026-10-25  
**Escopo**: decisões necessárias para planejar US01–US05; nenhum aplicativo foi criado nesta etapa.

## 1. Scaffold, SDK e Expo Go

**Decisão**: Criar o projeto Expo em `mobile/` com o template padrão, que já inclui TypeScript e Expo Router e organiza as rotas em `src/app/`. Em 2026-10-25, usar como alvo inicial o SDK 57 para avaliação em Android físico com Expo Go, confirmar a versão efetiva após a criação e manter o `package-lock.json`. As versões de bibliotecas nativas serão selecionadas pela CLI do SDK instalado, não por números copiados de outro SDK.

**Justificativa**: Não há `package.json` nem SDK Expo instalado no repositório. A documentação do Expo indica que, durante a transição para SDK 58, o comando de criação sem `--template` gera SDK 57 e é recomendado para uso em dispositivo físico. O template padrão inclui Expo Router e TypeScript. A versão de Expo Go precisa corresponder ao SDK da aplicação.

**Alternativas consideradas**: SDK 58 agora exigiria confirmar distribuição de Expo Go compatível no dispositivo físico; SDK 54 permitiria Expo Go da App Store no iPhone, mas adotaria SDK mais antigo. O alvo Android físico com SDK 57 atende à constituição sem fluxo de distribuição iOS. Se o aparelho de avaliação for um iPhone físico, a escolha de SDK precisará ser revista antes de criar o projeto.

**Fontes**: [create-expo-app](https://docs.expo.dev/more/create-expo/), [criar projeto](https://docs.expo.dev/get-started/create-a-project/), [compatibilidade do Expo Go](https://docs.expo.dev/troubleshooting/expo-go-version-mismatch/).

## 2. Dependências compatíveis

**Decisão**: Usar as versões de React Native, Expo Router, TypeScript e React trazidas pelo template; instalar `@react-native-async-storage/async-storage` e `expo-crypto` com `npx expo install`; verificar com `npx expo install --check` e `npx expo-doctor@latest`.

**Justificativa**: A CLI Expo escolhe versões compatíveis com o SDK instalado. AsyncStorage e expo-crypto constam como disponíveis no Expo Go. `expo-crypto` oferece `randomUUID()` para identificadores únicos sem contador persistido adicional.

**Alternativas consideradas**: Versões manuais de pacotes nativos podem divergir do SDK; gerar IDs apenas com relógio ou aleatoriedade comum não garante unicidade; contador persistido exigiria mais estado e lógica. Bibliotecas de estado ou de formulário acrescentariam complexidade ao MVP.

**Fontes**: [Expo CLI e gerenciamento de dependências](https://docs.expo.dev/more/expo-cli/), [AsyncStorage no Expo](https://docs.expo.dev/versions/latest/sdk/async-storage/), [expo-crypto](https://docs.expo.dev/versions/latest/sdk/crypto/).

## 3. Navegação e estado entre telas

**Decisão**: Usar duas rotas funcionais do Expo Router: `index` para Minhas Ideias e `idea` para Cadastro/Edição, com parâmetro `id` opcional. Cada tela mantém seu estado com React Hooks; a lista recarrega o armazenamento ao receber foco. Não introduzir Context API inicialmente.

**Justificativa**: O template já configura o Router. O recarregamento no foco faz a lista refletir mudanças salvas pela tela de formulário sem estado global para um catálogo pequeno.

**Alternativas consideradas**: Rotas separadas para cadastro e edição duplicariam a composição da tela; Context API criaria sincronização global sem necessidade atual. Se o recarregamento no foco não cumprir o desempenho definido, o desenho poderá ser revisto com medição.

**Fonte**: [Expo Router](https://docs.expo.dev/router/introduction/).

## 4. Persistência e política de erro

**Decisão**: Armazenar um array de ideias como JSON sob uma chave versionada do aplicativo. `getItem` com valor ausente representa lista vazia; rejeição ou JSON inválido representam erro de leitura. `setItem` precisa concluir antes de atualizar a lista e indicar sucesso. Durante a gravação, os controles da operação ficam ocupados para evitar envios concorrentes.

**Justificativa**: AsyncStorage trabalha com valores de texto e operações assíncronas que podem falhar. O comportamento evita que uma falha apareça como lista vazia ou salvamento concluído, conforme FR-013.

**Alternativas consideradas**: Banco relacional ou SQLite acrescentariam estrutura desnecessária a até 100 ideias; atualização otimista exigiria reversão em caso de falha. O uso de uma única chave é suficiente para o MVP.

**Fontes**: [API do AsyncStorage](https://react-native-async-storage.github.io/2.0/API/), [uso do AsyncStorage](https://react-native-async-storage.github.io/2.0/Usage/). A política de interface após falha é uma decisão do projeto baseada na especificação.

## 5. Lista e estilos

**Decisão**: Usar FlatList com `id` como chave, array na ordem de cadastro mais recente e estado vazio distinto para catálogo vazio e filtro sem correspondências. Usar `StyleSheet.create` para os estilos e componentes reutilizáveis de cartão e campo.

**Justificativa**: FlatList atende à constituição e oferece `ListEmptyComponent`; StyleSheet é a ferramenta exigida e adequada para estilos tipados. Os filtros operam em memória sobre as ideias carregadas, sem outra dependência.

**Alternativas consideradas**: ScrollView não atende à exigência de FlatList; biblioteca de componentes ou de estilos acrescentaria dependências e decisões visuais desnecessárias.

**Fontes**: [FlatList](https://reactnative.dev/docs/flatlist), [StyleSheet](https://reactnative.dev/docs/stylesheet.html).
