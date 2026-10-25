# InkBook — Diário de Ideias de Tatuagens

Aplicativo móvel para guardar ideias de tatuagens ou desenhos e acompanhar o andamento de cada uma. Os dados ficam no próprio celular; não há login, imagens de ideias, backend nem sincronização em nuvem.

## Executar no Expo Go

É necessário Node.js 22.13 ou superior. O projeto foi criado com Expo SDK 58 e usa Node 24 (`mobile/.nvmrc`). Instale no celular uma versão do Expo Go compatível com esse SDK.

```bash
cd mobile
nvm use          # se usar nvm; caso contrário, ative Node 22.13+
npm install
npx expo start --port 8082
```

O comando inicia o servidor e mostra um QR code no terminal; ele não abre uma janela do aplicativo no computador. A porta 8081 estava ocupada neste ambiente, por isso o exemplo usa 8082. Deixe o terminal aberto. No Android, abra o Expo Go, toque em **Ler QR code** e aponte para o código. Celular e computador precisam estar na mesma rede Wi-Fi. O teste em celular físico ainda está pendente e será realizado pelo usuário. A [documentação do Expo](https://docs.expo.dev/troubleshooting/expo-go-version-mismatch/) explica como obter uma versão compatível do Expo Go.

Para abrir no Chrome, pare o servidor anterior com `Ctrl+C` e execute em `mobile/`:

```bash
npx expo start --web --port 8082 --clear
```

O suporte web usa `react-native-web` e `react-dom` nas versões escolhidas pelo Expo. Se a aba antiga estiver aberta, atualize-a depois que o terminal indicar que o bundle web terminou.

Para verificar o projeto localmente:

```bash
cd mobile
npm run typecheck
npm run lint
npx expo install --check
npx expo-doctor@latest
```

## Histórias do MVP

| História | O que permite fazer |
|----------|---------------------|
| US01 — Cadastrar ideia | Registrar título, estilo, dificuldade, status e descrição opcional, com validação. |
| US02 — Visualizar ideias | Ver as ideias da mais recente para a mais antiga, com dados preservados no celular. |
| US03 — Atualizar andamento | Trocar o status entre Quero desenhar, Em andamento e Concluído. |
| US04 — Editar e excluir | Corrigir dados e excluir uma ideia após confirmação. |
| US05 — Filtrar por status | Ver todas as ideias ou somente as de um status escolhido. |

Os critérios completos estão na [especificação](specs/001-diario-ideias-tatuagem/spec.md). O [plano](specs/001-diario-ideias-tatuagem/plan.md), as [tarefas](specs/001-diario-ideias-tatuagem/tasks.md) e o [guia de verificação](specs/001-diario-ideias-tatuagem/quickstart.md) ficam no mesmo diretório da feature.

## Estrutura

```text
mobile/src/app/               telas e navegação
mobile/src/components/        cartão e campos reutilizáveis
mobile/src/features/ideas/    tipos, validação e armazenamento local
specs/001-diario-ideias-tatuagem/  especificação e planejamento
```

## Screenshots

| Minhas Ideias | Cadastro/Edição |
|--------------|-----------------|
| _Inserir captura após o teste no celular._ | _Inserir captura após o teste no celular._ |

## Verificação manual pendente

No celular, conferir cadastro válido e inválido, lista vazia e ordenação, permanência após fechar e reabrir, edição e mudança de status, cancelamento e confirmação da exclusão, quatro filtros e mensagem sem resultados. Também conferir legibilidade, teclado e tamanhos de tela. Falhas de armazenamento e os critérios de tempo/usabilidade têm roteiros próprios nas tarefas de verificação e ainda não foram validados em dispositivo físico.
