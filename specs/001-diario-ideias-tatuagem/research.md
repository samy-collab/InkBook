# Pesquisa técnica: InkBook

**Data**: 2026-10-25  
**Escopo**: decisões para US01–US05, atualizadas com a versão efetivamente criada na implementação.

## 1. Scaffold, SDK e Expo Go

**Decisão**: O projeto Expo foi criado em `mobile/` com o template padrão, TypeScript, Expo Router e rotas em `src/app/`. A CLI efetivamente instalou SDK 58.0.19. Usar Node 24.22.1, já disponível neste ambiente, e manter o `package-lock.json`. As versões de bibliotecas nativas foram selecionadas pela CLI do SDK instalado.

**Justificativa**: Antes da implementação não havia SDK instalado. A documentação consultada indicava SDK 57 como padrão durante a transição, mas a execução de `create-expo-app@latest` retornou SDK 58. Como Node 24 já estava instalado, manter o SDK efetivo evitou uma recriação desnecessária. Expo Doctor e a checagem de dependências passaram; a versão de Expo Go precisa corresponder ao SDK da aplicação no teste físico.

**Alternativas consideradas**: Recriar com SDK 57 seguiria o alvo inicial do plano, mas ainda dependeria de Expo Go correspondente no Android. SDK 54 adotaria versão mais antiga para possível uso no iPhone. A implementação mantém SDK 58 e deixa a compatibilidade no aparelho físico para verificação do usuário; se não houver Expo Go correspondente, será preciso alinhar SDK e aplicativo antes dessa avaliação.

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
