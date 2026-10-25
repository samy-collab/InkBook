# Verificação técnica e em dispositivo

**Data das verificações locais**: 2026-10-25. **Dispositivo físico**: pendente de teste pelo usuário.

| Verificação | Resultado |
|-------------|-----------|
| Expo SDK instalado | 58.0.19 no scaffold; conferir valor resolvido em `mobile/package-lock.json`. |
| Node usado | 24.22.1. |
| `npm run typecheck` | Passou. |
| `npm run lint` | Passou com `eslint src`. |
| `npx expo install --check` | Passou: dependências em dia. |
| `npx expo-doctor@latest` | Passou: 20/20 verificações. |
| `npx expo export --platform android` | Passou: bundle Android gerado. |
| `npx expo export --platform web` | Passou após instalar `react-native-web` e `react-dom`; confirmação visual no Chrome pendente. |
| Abrir em Android físico com Expo Go compatível | Pendente. |
| Navegação, textos em português, layout e teclado no celular | Pendente. |
| SC-004: abrir lista e filtrar 100 ideias em até 2 segundos | Pendente de medição em celular. |

O `npm audit --omit=dev` identificou cinco avisos altos em dependências transitivas da CLI Expo (`node-forge` e `zod`). A correção automática com `--force` sugeriu trocar Expo 58 por Expo 44, o que quebraria a compatibilidade do projeto; essa troca não foi aplicada. Reavaliar quando houver atualização compatível do SDK.

Concluir T024 somente após registrar o aparelho, a versão do Expo Go, a data, os tempos e os resultados visuais.
