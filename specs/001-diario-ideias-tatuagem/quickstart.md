# Guia de execução e verificação: InkBook

**Estado atual**: O aplicativo existe em `mobile/` com Expo SDK 58. A execução em celular físico ainda não foi verificada.

## Preparação em um clone do repositório

Executar na raiz deste repositório, preservando `.specify/`, `specs/` e `AGENTS.md`. É necessário Node.js 22.13 ou superior; este projeto registra Node 24 em `mobile/.nvmrc`:

```bash
cd mobile
nvm use
npm install
npx expo install --check
npx expo-doctor@latest
```

O SDK efetivo está em `mobile/package.json`. Usar Expo Go compatível com SDK 58 no aparelho Android de avaliação; os arquivos do Spec Kit ficam na raiz e não precisam ser recriados.

## Execução posterior

Depois que o aplicativo existir:

```bash
cd mobile
npx expo start --port 8082
```

O comando mostra um QR code no terminal e não abre o aplicativo automaticamente no computador. A porta 8081 estava ocupada neste ambiente; 8082 evita a pergunta interativa. Deixe o terminal aberto e, no Android, escaneie o código pelo Expo Go. Celular e computador devem usar a mesma rede Wi-Fi. A versão do Expo Go pode ser escolhida em [expo.dev/go](https://expo.dev/go). A documentação oficial explica as diferenças de distribuição em [incompatibilidade de versões](https://docs.expo.dev/troubleshooting/expo-go-version-mismatch/).

Para conferir no Chrome, pare o servidor anterior e inicie `npx expo start --web --port 8082 --clear` em `mobile/`. Essa prévia usa `react-native-web` e `react-dom` instalados pelo Expo; não substitui a verificação obrigatória no celular.

## Verificações para concluir a implementação

Antes da avaliação funcional, executar em `mobile/`:

```bash
npx tsc --noEmit
npx expo install --check
npx expo-doctor@latest
```

Registrar o resultado de cada verificação e testar em Android físico com Expo Go:

| Verificação | Resultado a registrar |
|-------------|-----------------------|
| US01 | Cadastro válido; título inválido e campos pendentes; descrição vazia; ideia aparece primeiro. |
| US02 | Campos do cartão, catálogo vazio, ordem e persistência após fechar e reabrir. |
| US03 | Troca entre os três status, lista atualizada e persistência após reinício. |
| US04 | Edição válida e inválida; cancelamento e confirmação de exclusão; permanência após reinício. |
| US05 | Quatro filtros, somente itens correspondentes e mensagem sem resultados. |
| Falhas locais | Leitura, gravação e exclusão simuladas; erro visível sem sucesso indevido ou perda silenciosa de dados. |
| Interface | Navegação entre duas telas, FlatList, português brasileiro, teclado e tamanhos de tela distintos. |
| Desempenho e uso | Até 100 ideias com lista/filtro em até 2 segundos; avaliação de cadastro conforme SC-001. |

Falhas nos fluxos obrigatórios devem ser corrigidas antes de declarar a implementação concluída. Itens não executados permanecem pendentes no registro de verificação.
