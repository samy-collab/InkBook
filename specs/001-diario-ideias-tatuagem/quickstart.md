# Guia de execução e verificação: InkBook

**Estado atual**: Somente planejamento. Os comandos abaixo são para a etapa de implementação; ainda não existe `mobile/` nem aplicativo programado.

## Preparação do projeto na implementação

Executar na raiz deste repositório, preservando `.specify/`, `specs/` e `AGENTS.md`:

```bash
npx create-expo-app@latest mobile --no-agents-md
cd mobile
npx expo install @react-native-async-storage/async-storage expo-crypto
npx expo install --check
npx expo-doctor@latest
```

Em 2026-10-25, o template padrão de `create-expo-app@latest` é documentado como SDK 57 durante a transição para SDK 58. Confirmar o SDK real em `mobile/package.json` antes de escrever código e usar o Expo Go correspondente no aparelho. Se o padrão tiver mudado, selecionar explicitamente um template compatível com o aparelho de avaliação, sem misturar versões de dependências. O projeto ficará em `mobile/`, dentro deste repositório, para preservar os artefatos Spec Kit. Remover as telas e recursos de demonstração do template que não correspondem às cinco histórias.

## Execução posterior

Depois que o aplicativo existir:

```bash
cd mobile
npx expo start
```

Abrir no Expo Go de um dispositivo Android físico com SDK compatível. A versão do Expo Go pode ser escolhida em [expo.dev/go](https://expo.dev/go). A documentação oficial explica as diferenças de distribuição em [incompatibilidade de versões](https://docs.expo.dev/troubleshooting/expo-go-version-mismatch/); o Expo Go da App Store no iPhone não atende aos SDKs 55 ou posteriores sem outra forma de distribuição.

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
