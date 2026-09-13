# Arquitetura da demonstração Kurio

O app React usa TanStack Router para rotas e parâmetros de catálogo, TanStack Query para cache e Axios para `/api`. Em `dev:mocks` e `build:demo`, o MSW responde no navegador com uma base versionada em `localStorage` (`src/mocks/database.ts`). O layout desktop e a experiência mobile usam os mesmos contratos. Sem MSW, o repositório precisa de um backend externo que ofereça `/api`.

## Dados e contratos

| Recurso | Endpoints principais | Regras |
| --- | --- | --- |
| Catálogo | `GET /api/nfts`, `GET /api/nfts/:id` | Busca, filtros e paginação de oito itens na interface; preço e estoque por edição. |
| Conta | `/api/auth/register`, `/login`, `/session`, `/logout` | Sessões de uma hora; credenciais de demonstração derivadas com PBKDF2-SHA256. |
| Perfil | `GET/PATCH /api/profile`, `POST /api/profile/password` | Avatar PNG/JPEG/WebP limitado; troca de senha invalida sessões. |
| Carteiras | `GET/POST /api/wallets`, `PUT/DELETE /api/wallets/:id` | Registros isolados por usuário, com indicação de carteira principal. Não se conecta ao provedor real. |
| Favoritos | `/api/favorites` | Dados isolados por usuário autenticado. |
| Carrinho | `GET /api/cart`, `POST/PUT /api/cart/items` | Item identificado por NFT e edição; visitante migra ao entrar; quantidade limitada ao estoque. |
| Compra | `GET /api/checkout/quote`, `GET/POST /api/orders`, `GET /api/orders/:id` | Cupom `KURIO10`, taxa estimada, cotação de cinco minutos, idempotência, recibo persistido e dedução de estoque na confirmação. |

Preços são strings ETH; `src/lib/eth.ts` faz a aritmética em wei com `BigInt`, sem arredondamento de ponto flutuante. Mutations invalidam as consultas relevantes. A base valida o formato persistido e recupera fixtures quando o JSON ou a versão é incompatível. Os controles `window.kurioMocks` alteram cenário/preço/estoque e fazem reset da base.

O modo demo usa Socket.IO sobre o worker MSW para avisar sobre mudanças de NFT e pedido. Cada evento leva identificador e versão; o cliente descarta eventos antigos e reconcilia as consultas REST ao reconectar. Como a base está em `localStorage`, a sincronização entre abas depende do evento `storage` do mesmo navegador. O pedido pendente é persistido, consultado periodicamente e concluído pelo mock; a chave de idempotência permite recuperar a mesma tentativa após timeout ou refresh. `src/lib/realtime.ts` contém o cliente e `src/mocks/realtime.ts` contém o transporte simulado.

## Limites de produção

O MSW simula respostas e estados de erro, inclusive pagamento recusado, mas persiste tudo no navegador do visitante. Não há custódia, conexão de carteira, assinatura, pagamento on-chain, blockchain, backend multiusuário ou proteção contra edição local dos dados. Logo, o build `:demo` é um protótipo funcional para avaliação, não uma loja apta a receber compras reais.

A sincronização entre navegadores ou dispositivos separados requer um servidor real; a simulação atual cobre abas do mesmo navegador. Os baselines visuais automatizados cobrem telas desktop e mobile, mas não substituem uma comparação aprovada com o arquivo Figma. A auditoria Lighthouse gera relatórios reproduzíveis, mas desempenho e acessibilidade precisam ser revalidados no ambiente público. A implantação pública ainda não foi verificada. Para tornar o produto transacional, implemente backend seguro para os contratos acima e integração real com carteira/chain, substituindo o MSW; depois faça auditorias de acessibilidade, desempenho, segurança e operação.
