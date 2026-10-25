# Falhas de armazenamento

**Estado**: Pendente de simulação controlada. Não alterar permanentemente os dados reais do usuário.

| Caso | Resultado esperado | Resultado observado |
|------|--------------------|--------------------|
| `getItem` rejeita na abertura da lista | Erro de leitura e ação de tentar novamente; não mostrar catálogo vazio. | Pendente |
| Chave contém JSON inválido ou catálogo inválido | Erro de leitura; não sobrescrever com `[]`. | Pendente |
| `setItem` rejeita no cadastro | Manter dados digitados; não anunciar sucesso nem adicionar cartão. | Pendente |
| `setItem` rejeita na edição/status | Manter valores salvos anteriores; não anunciar sucesso. | Pendente |
| `setItem` rejeita após confirmar exclusão | Manter cartão e avisar falha. | Pendente |

Simular em ambiente de desenvolvimento com substituição temporária de `getItem`/`setItem`, restaurar os métodos e conferir o catálogo original depois. Registrar evidência e data para concluir T025.
