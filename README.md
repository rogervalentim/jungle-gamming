# Kurio — Marketplace de NFTs

Aplicação React, TypeScript, Vite e Tailwind com catálogo, detalhe, conta, favoritos, carrinho e checkout demonstráveis. O layout e os assets originais foram mantidos. **As compras são simuladas:** a carteira é um cadastro local e nenhuma transação é assinada ou enviada a uma blockchain.

## Executar

Requer Node 24 ou superior.

```sh
npm ci
npm run dev:mocks
```

Abra `http://localhost:3000`. O modo demo inicia o MSW antes da interface e persiste os dados simulados no navegador. Para verificar o pacote otimizado:

```sh
npm run build:demo
npm run preview
```

`npm run dev` e `npm run build` também ativam a demonstração por padrão. `npm run build:api` gera um pacote sem mocks para integração futura com um backend que implemente `/api`.

## Usar a demonstração

O catálogo tem 24 NFTs, oito por página. Busca, gênero, rede, faixa de preço, categoria, ordenação e página são refletidos na URL. Cada NFT possui edições e estoque próprios. Valores ETH usam strings decimais e são calculados em wei.

Cadastre uma conta pela interface ou use um dos perfis fictícios:

| E-mail | Senha |
| --- | --- |
| `ana@kurio.test` | `KurioAna!2026` |
| `bruno@kurio.test` | `KurioBruno!2026` |

É possível adicionar NFTs ao carrinho antes do login; os itens são incorporados à conta ao entrar. Cadastre uma carteira em **Carteiras**, escolha um provedor no pagamento e confirme o pedido simulado. O pedido usa cotação de cinco minutos, valida preço/estoque e aceita tentativas repetidas sem criar compras duplicadas. O cupom de demonstração é `KURIO10`. O recibo pode ser recuperado pela URL `pagamento?order=<id>`, inclusive após recarregar a página. Pagamentos pendentes são consultados até serem confirmados ou recusados; uma falha de rede pode ser recuperada pela mesma tentativa.

Perfil, avatar, senha e carteiras ficam persistidos por conta no navegador. Trocar a senha encerra as sessões da conta. Favoritos exigem login. As telas de perfil e carteiras também estão acessíveis no celular.

## Cenários e reset

No console do navegador, após iniciar o modo demo:

```js
await window.kurioMocks.configure({ scenario: 'slow', latencyMs: 1500 })
await window.kurioMocks.configure({ scenario: 'error', latencyMs: 0 })
await window.kurioMocks.configure({ scenario: 'success', latencyMs: null })
await window.kurioMocks.updateNft('emerald-042', { price: '2.5', availableQuantity: 3 })
await window.kurioMocks.reset()
```

Os cenários simulados são `success`, `empty`, `slow`, `error`, `declined`, `pending`, `timeout`, `offline`, `expired` e `variable`. `pending` conclui o pedido depois de cerca de dois segundos; `timeout` cria o pedido mas devolve falha de rede, permitindo recuperar a tentativa; `expired` invalida a sessão; `variable` varia preço/estoque. `reset()` restaura a base inicial e limpa os dados da Kurio. Eventos Socket.IO simulados atualizam NFT e pedido entre abas do mesmo navegador, com consulta REST na reconexão. Use apenas dados fictícios: o MSW e o armazenamento local são editáveis pelo usuário e não constituem um backend de produção.

## Verificar

```sh
npm run typecheck
npm run lint
npm run build:demo
npm run test:e2e
npm run audit:lighthouse
```

No Windows com Chrome instalado, use `$env:PLAYWRIGHT_CHANNEL='chrome'` antes de `npm run test:e2e`. Os testes iniciam o preview na porta 4173. O Lighthouse mede início e detalhe em perfis mobile e desktop, três vezes cada, e grava medianas e relatórios em `reports/lighthouse`. As imagens de referência do Playwright ficam em `tests/e2e/visual.spec.ts-snapshots`. Consulte [ARCHITECTURE.md](ARCHITECTURE.md) para os contratos e [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md) para o histórico e as pendências de produção.

## Publicação da demonstração

O comando `npm run build` gera `dist` com os mocks ativados. Para publicar pela Vercel, use o framework Vite, o comando de build padrão e a pasta `dist`; `vercel.json` preserva o acesso direto às rotas da aplicação. Após publicar, verifique o carregamento de `/`, `/mercado?item=emerald-042`, `/login` e `/carrinho-de-nfts`, inclusive após refresh. Uma URL pública só deve ser informada depois dessa verificação. O build demonstrativo não é adequado para pagamentos reais.
