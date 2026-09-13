# Plano de implementação — Marketplace de NFTs

> **Estado atual (13/09/2026):** o texto detalhado abaixo registra etapas históricas e contém afirmações de pendência que já foram superadas. O estado executável e os limites atuais estão em [README.md](README.md) e [ARCHITECTURE.md](ARCHITECTURE.md). Catálogo/detalhe, autenticação, favoritos, carrinho, cotação, checkout simulado, pedidos, perfil e carteiras estão integrados à API MSW. Pedidos pendentes, recuperação de timeout/refresh, eventos Socket.IO simulados entre abas, testes E2E, baselines visuais e auditoria Lighthouse foram acrescentados sem redesenhar o layout. Ainda faltam backend e pagamento reais, validação final de acessibilidade/desempenho e publicação pública verificada. Não considere o protótipo pronto para transações reais.

Atualizado em 12/09/2026. Fonte dos requisitos: enunciado “Desafio Frontend — Marketplace de NFTs”, fornecido em `C:\Users\valen\.codex\attachments\083a383e-c395-4323-83b6-21b045ccb872\pasted-text.txt`.

## Forma de execução

- Preservar a identidade visual, os assets, os componentes aproveitáveis e todas as alterações locais existentes. O repositório já apresentava muitos arquivos alterados antes desta rodada; este diagnóstico não atribui essas alterações a uma única execução.
- Executar uma etapa pequena por rodada, validar o resultado, registrar evidências e aguardar o usuário solicitar a continuação. Dividir etapas que crescerem demais.
- `Concluído` significa implementação identificada para o item específico; quando houver validação em execução, registrar separadamente. Uma dependência instalada, um formulário desenhado ou um texto de sucesso não comprovam um fluxo completo.
- Manter mocks na camada de rede, contratos tipados e regras compartilhadas entre demonstração, desenvolvimento e testes. Migrar gradualmente as regras locais existentes.
- Testar proporcionalmente cada mudança; registrar problemas anteriores separadamente das regressões. Não declarar auditorias, testes, fidelidade visual ou deploy sem evidência de execução.
- Não realizar commits, push ou publicação nesta rodada. A preparação e a realização do deploy permanecem no plano de entrega.

## Diagnóstico do código

**Estado atual: etapa 2A implementada; reexecução final do Playwright pendente.** O catálogo desktop/mobile contém 24 NFTs, com busca, filtros combináveis, ordenação e oito itens por página controlados pela URL. A próxima etapa funcional é **2B — detalhe por identificador e disponibilidade**. Os registros das etapas 1A–1C abaixo preservam o escopo e os resultados observados na época.

| Requisito | Situação | Evidência e limite atual |
| --- | --- | --- |
| React, TypeScript, Vite e Tailwind | Concluído no código | `package.json`, `vite.config.ts`, `src/main.tsx` e `src/styles.css` compõem a aplicação existente. Isso não representa aprovação dos fluxos ou auditoria de qualidade. |
| Componentes shadcn/ui adaptados | Parcial | `components.json` e `src/components/ui/` fornecem componentes e configuração. Ainda faltam revisão de uso, consistência e acessibilidade no conjunto das telas. |
| Rotas TanStack Router | Parcial no desafio; catálogo com URL concluído | `src/routes/index.tsx` e `src/lib/catalog-search.ts` validam os parâmetros e controlam a navegação desktop/mobile. Faltam proteção dos fluxos privados, retorno após login e tratamento completo das demais rotas/recursos. |
| Interface de início e detalhe | Parcial | `src/routes/mercado.tsx` e `src/components/mobile-flow.tsx` localizam o NFT selecionado na resposta REST, inclusive os novos itens das páginas seguintes, e tratam carregamento, erro e inexistente. O detalhe ainda depende de uma consulta ampla da listagem; o contrato próprio por ID e os estados completos de edição/quantidade ficam na etapa 2B. |
| Catálogo desktop com Axios, Query e MSW | Concluído no escopo das etapas 1A e 2A | `src/api/nfts.ts`, `src/mocks/handlers.ts`, `src/main.tsx`, `src/routes/index.tsx` e `src/components/nft/nft-category.tsx` integram busca/filtros/ordenação/paginação REST com parâmetros tipados na URL. Os demais recursos do marketplace ainda precisam migrar. |
| Carregamento, vazio, erro e recuperação | Parcial no desafio; catálogo desktop validado | `src/components/nft/nft-category.tsx` inclui skeleton, resultado vazio, erro, nova tentativa e atualização em segundo plano. Utilitários Tailwind e a animação definida no tema de `src/styles.css` incluem shimmer e movimento reduzido. Os cenários iniciais passaram em Playwright; ainda não há cobertura equivalente em detalhe, carrinho e demais recursos. |
| Contratos e cache remoto | Parcial | `src/api/nfts.ts` define `NftDto`, resposta e parâmetros de listagem, preços como strings ETH, chave de consulta por parâmetros, `staleTime` de 30 segundos, retries automáticos desativados e `signal` passado ao Axios. Faltam contratos dos demais recursos, mutations, invalidações, isolamento por sessão e documentação consolidada. |
| Fixtures e cenários MSW | Parcial no desafio; etapas 1B e ampliação 2A concluídas | `src/mocks/database.ts` implementa base versionada persistida com 24 NFTs/edições, gêneros/redes, dois usuários com hashes, configuração e tabelas reservadas por identidade. Bases válidas com os oito NFTs anteriores são ampliadas preservando alterações. Os controles REST alteram preço/estoque e cenário/latência e restauram o estado inicial. Faltam integração das tabelas reservadas aos fluxos e a matriz completa de falhas. |
| Mocks configuráveis no build | Concluído na fatia 1A; entrega pública pendente | `src/main.tsx` inicia MSW quando `VITE_ENABLE_MOCKS=true`; `.env.demo`, `.env.example` e `public/mockServiceWorker.js` dão suporte à configuração. Playwright validou a resposta via service worker no build de demonstração servido por preview. A versão pública ainda não foi verificada. |
| Mobile | Parcial no desafio; catálogo até 2A concluído | `src/components/mobile-flow.tsx` usa a listagem REST compartilhada e endereço do TanStack Router, com busca/filtros/ordenação/paginação de oito itens e estados de carregamento, vazio, erro, refresh e acesso direto. Detalhe ainda depende da listagem e demais fluxos não formam integrações completas. |
| Busca, filtros, ordenação, paginação e histórico | Concluído na etapa 2A | `src/lib/catalog-search.ts` define os parâmetros compartilhados da URL; `src/mocks/handlers.ts` aplica busca por nome, gênero, rede, categoria, preço, ordenação e paginação na API. Desktop/mobile restauram o estado por refresh/histórico; alteração de filtros reinicia a página. `tests/e2e/catalog-url.spec.ts` cobre esses cenários e a troca rápida de busca. |
| Favoritos | Parcial | `src/lib/shop.ts` persiste nomes em `kurio-favorites`; no mobile há também um booleano local. Faltam autenticação, REST, isolamento por usuário e atualização otimista com rollback. |
| Carrinho | Parcial | `src/lib/shop.ts` e `src/components/shopping-cart.tsx` implementam quantidades, remoção e persistência em `kurio-cart-v2`. Os itens são identificados por nome, sem regras completas de estoque por edição, API de carrinho, merge de visitante ou cotação REST. A compra dos novos NFTs está indisponível; controles legados de compra exigem correspondência de preço e estoque disponível na resposta do catálogo. |
| Valores ETH e cupom | Parcial | A nova listagem transporta strings decimais e o handler compara valores com inteiros. `src/lib/shop.ts` e resumos de pagamento ainda calculam valores com `number` e taxa local. A precisão exata, o cupom e a cotação autoritativa precisam alcançar todo o fluxo. |
| Cadastro, login, logout e sessão | Pendente como fluxo integrado | Dois usuários fictícios com hashes PBKDF2 estão preparados na base. `mobile-flow.tsx` contém formulários visuais e informa autenticação indisponível. Não há contratos/handlers de sessão, usuários autenticados, refresh de sessão, expiração, guards ou isolamento dos dados privados. |
| Perfil e carteiras | Parcial | `src/routes/perfil-do-colecionador.tsx`, `src/routes/carteiras.tsx` e `src/components/payment/collector-profile-form.tsx` contêm campos e composição. Não há API persistente de perfil, avatar, senha e carteiras; falta validação completa e uso das carteiras cadastradas no pagamento. |
| Checkout e confirmação | Parcial na interface; pedidos pendentes | `src/routes/pagamento.tsx`, `src/components/payment/nft-order-summary.tsx` e `order-confirmation.tsx` exibem revisão e resultado por estado local. `mobile-flow.tsx` também altera um booleano para exibir resultado. Não há pedido criado/confirmado pela API, idempotência, recibo imutável ou recuperação após refresh. |
| Socket.IO e reconciliação REST | Pendente | Não há implementação identificada de cliente, eventos, subscriptions ou mocks compatíveis com o protocolo Socket.IO. Mudanças de catálogo e pedido ainda não são sincronizadas em tempo real. |
| Responsividade, Figma e acessibilidade | Parcial, sem verificação nova completa | Os componentes usam utilitários Tailwind; `src/styles.css` contém apenas a entrada e o tema Tailwind. `design-qa.md` registra uma comparação anterior em 414 × 896; não comprova a matriz exigida de 390/768/1440, fidelidade ao Figma nesta rodada, nem os fluxos completos. |
| Playwright | Parcial; cobertura ampliada na etapa 2A | As etapas 1A–1C registraram 22 testes aprovados, incluindo sete testes puros de ETH. `tests/e2e/catalog-url.spec.ts` acrescenta cobertura de URL, busca, filtros, ordenação, paginação e consulta mais recente. A matriz completa, baselines revisadas e relatórios de todos os fluxos continuam pendentes; resultados de execução ficam nos registros ao final. |
| Lighthouse | Pendente | Faltam configuração versionada, execução das três medições por página/perfil, medianas e relatórios HTML/JSON. |
| Documentação e entrega pública | Parcial | `README.md` documenta setup, comandos, controles de cenário/reset, usuários fictícios, URL do catálogo e limites. `ARCHITECTURE.md` documenta contratos e decisões até a etapa 2A. Demais contratos, auditorias e evidência de deploy público estão pendentes. |

## Rodada concluída — 1A: listagem de NFTs desktop

**Estado: concluída dentro do escopo de listagem desktop.** A etapa 1 como um todo continua parcial; a rodada seguinte implementa a base persistente/reset e a integração mobile permanece pendente.

Implementação identificada:

- [x] Cliente Axios com base `/api` e timeout, QueryClient e provider.
- [x] Contratos de listagem com identificador estável e preço ETH como string decimal.
- [x] MSW ativado por configuração, worker e oito NFTs em fixtures.
- [x] `GET /api/nfts` com faixa de preço e categoria na requisição.
- [x] Catálogo desktop consumindo a consulta, com carregamento, vazio, erro, retry manual e feedback de atualização.
- [x] Cenários básicos selecionáveis em `localStorage['kurio-mock-scenario']`: `success`, `empty`, `slow`, `error`.
- [x] Chave de cache que inclui os parâmetros e cancelamento via `AbortSignal`.
- [x] Registrar verificações de tipos, build e lint, distinguindo falhas anteriores; resultados no final deste documento.
- [x] Executar quatro testes Playwright da interface e das respostas MSW para os estados desta fatia.
- [x] Executar o modo de demonstração via build/preview nos testes e documentar instruções reproduzíveis no README.

Critérios de aceite: o catálogo desktop deve exibir os oito NFTs do cenário padrão; preço/categoria enviados devem alterar a resposta; carregamento deve apresentar skeleton; vazio e falha devem ter mensagens acessíveis; retornar ao cenário de sucesso e tentar novamente deve recuperar a listagem. A consulta não deve substituir resultados atuais por uma resposta obsoleta. O modo de demonstração deve inicializar os mocks por configuração.

Limites desta etapa: o mobile, detalhe, cards auxiliares, favoritos, carrinho, perfil, carteiras e pagamento ainda podem usar as implementações locais existentes. A nova listagem não significa migração completa do catálogo ou dos fluxos. A chave de cenário controla comportamento de rede; não é um reset integral da futura base de dados.

## Próximas rodadas

### 1B — Base de dados simulada persistente e reset

Estado: concluída no escopo desta rodada. Base versionada em `src/mocks/database.ts`, compartilhada pelos handlers, com NFTs/edições, dois usuários fictícios e persistência local. Preços usam strings e comparação/multiplicação em wei (`src/lib/eth.ts`). O reset restaura a seed, remove as chaves legadas, cancela consultas, limpa cache e recarrega a página. Credenciais derivadas são persistidas sem senhas em claro; README e ARCHITECTURE documentam os detalhes e limites.

- [x] IDs estáveis, versões e projeção de preços/estoque das edições para a API de catálogo.
- [x] Persistência de alterações e configuração; validação de schema e restauração de dados inválidos.
- [x] Controles de demonstração via Axios/MSW: state, configure, updateNft, reset.
- [x] Reset seletivo de dados da aplicação e proteção contra operação iniciada antes do reset.
- [x] Dois colecionadores e tabelas por identidade preparadas; autenticação e demais fluxos continuam pendentes.
- [x] Tipos e lint dos arquivos desta rodada aprovados.
- [x] Suíte integrada final: 16 testes aprovados em 47,4 segundos, saída 0, no build de demonstração (Chrome/Chromium). O teste de resposta atrasada foi sincronizado com a resposta inicial da API após uma falha de espera; a repetição completa passou.

Limites: nesta etapa apenas catálogo/edições e configuração são mutáveis; tabelas de favoritos/carrinho/carteiras/pedidos/sessões permanecem vazias e reservadas. Os fluxos legados ainda serão migrados. Não há promessa de transações entre abas nem implementação de Socket.IO. O reset mantém os IDs e dados iniciais, mas renova o token que identifica a geração da base.

Aceite: refresh preserva alterações simuladas; reset restaura o mesmo estado conhecido; dados/identificadores suportam futuros recursos de favoritos, carrinho, perfil, carteiras e pedidos sem cópias divergentes. Cenário e latência podem ser controlados em testes isolados.

### 1C — Catálogo mobile usando os mesmos contratos

Estado: concluída no escopo desta rodada. A listagem mobile usa `nftListOptions`, compartilha resposta/cache REST com desktop, apresenta oito NFTs e os cenários de carregamento, vazio, erro e recuperação. Abas usam categorias da API; busca por nome ainda filtra a resposta no cliente até 2A. Os caminhos mobile passaram a usar TanStack Router; `/login` e `/cadastro` têm rotas e acesso direto, ainda sem autenticação.

- [x] Remover array local da vitrine mobile; cards usam IDs, nomes, imagens e preços da resposta MSW.
- [x] Skeleton, lista vazia, erro, retry e atualização em segundo plano no mobile.
- [x] Navegar pelos caminhos do Router e suportar refresh, acesso direto ao detalhe e histórico.
- [x] Validar 390 px e 768 px com Playwright, inclusive ausência de overflow horizontal.
- [x] Suíte completa: 22 testes aprovados em 1,3 min, saída 0. Verificação de tipos, lint dos arquivos alterados, formatação e diff sem problemas. Build de demonstração/preview usado pelos testes.

Limites: o detalhe mobile seleciona o item por nome na listagem, até existir GET de detalhe por ID na etapa 2B. Carrinho e checkout não compartilham ainda os preços/estoque da API. Login/cadastro são apenas caminhos preparados. Alterar filtro/busca não grava estado na URL até a etapa 2A.

Aceite: desktop e mobile refletem a mesma resposta e os mesmos cenários de sucesso, vazio, carregamento, erro e recuperação. Preservar layout e acessibilidade em 390 e 768 pixels. Não duplicar regras de negócio na UI.

### 2A — Busca, filtros, ordenação e paginação na URL

Estado: implementada, com validação final em navegador pendente. Desktop e mobile usam os parâmetros tipados `q`, `genre`, `network`, `category`, `sort`, `minPrice`, `maxPrice` e `page` no TanStack Router. O cliente traduz `q` para `search` na API e solicita oito itens por página. Busca/filtros/ordenação são executados pelo handler MSW antes da paginação; alterações reiniciam a página. A seed foi ampliada para 24 NFTs e bases válidas antigas são migradas preservando as alterações dos oito itens originais.

- [x] Busca por nome sem distinção de caixa/acentos, combinável com coleção/gênero, rede, categoria e faixa de preço.
- [x] Ordenação determinística por ordem das fixtures ou preço crescente/decrescente, com desempate por ID.
- [x] Paginação REST com `total`, `page`, `pageSize` e `totalPages`, exibindo oito itens por página em desktop/mobile.
- [x] URL, refresh e histórico restauram filtros, ordenação e página; valores inválidos usam padrões seguros.
- [x] Consultas isoladas por parâmetros e cancelamento, preservando o resultado da busca atual.
- [x] Detalhes abrem o NFT selecionado, inclusive os novos itens de outras páginas, sem substituí-lo pelo primeiro NFT.
- [x] Compra dos novos NFTs permanece indisponível; compra legada exige preço compatível e estoque disponível.
- [x] Testes em `tests/e2e/catalog-url.spec.ts` cobrem a nova fatia.
- [ ] Reexecutar a suíte Playwright após o ajuste final da leitura dos parâmetros de preço na URL.

Verificação desta rodada: tipos, build de demonstração, formatação dos arquivos alterados e lint global passaram. Na última execução do navegador, **15 de 16 testes direcionados passaram**. O caso restante mostrou que a leitura padrão da URL convertia valores decimais em número antes da validação; a leitura foi corrigida para preservar texto e precisão. A tentativa de repetir o teste no Chrome foi recusada, então a correção final ainda não tem comprovação E2E. A suíte completa anterior teve 21 de 27 testes aprovados antes das correções seguintes.

Limites: `recent` usa a ordem determinística das fixtures; “Em alta” não representa popularidade real. O detalhe ainda consulta a listagem ampla, sem endpoint próprio por ID, seleção completa de edição ou carrinho integrado. Próxima etapa: **2B**.

Aceite: requisições correspondem à URL, refresh/histórico recuperam o estado, parâmetros inválidos têm tratamento previsível, respostas fora de ordem não substituem resultados atuais e a UI anuncia resultados/atualizações adequadamente. Cobrir desktop/mobile com Playwright.

### 2B — Detalhe por identificador e disponibilidade

Estado: pendente; próxima rodada. Implementar detalhe REST tipado por identificador, galeria, informações, edição e seleção de quantidade conforme estoque. Substituir a consulta ampla de listagem atualmente usada para abrir o item correto. Usar rotas/acesso direto sem depender de estado da navegação anterior.

Aceite: identificador válido abre o NFT correto; inexistente tem resposta/tela apropriada; edição indisponível e limites de quantidade impedem ações inválidas; carregamento apresenta skeleton acessível e falha permite recuperação. Favoritar/comprar serão integrados às etapas seguintes.

### 3A — Cadastro, login e recuperação de sessão

Estado: pendente. Implementar endpoints de cadastro, login, consulta de sessão e logout; UI desktop/mobile; erros de validação e conflito. Usar dados fictícios da base e política explícita de sessão.

Aceite: dois usuários podem autenticar de forma independente, cadastro trata conflito e erros, refresh recupera sessão e logout a encerra. Formulários possuem labels, mensagens associadas e foco previsível. Senhas não persistem em claro.

### 3B — Proteção, expiração e troca de usuário

Estado: pendente. Proteger checkout, perfil, carteiras, favoritos e pedidos via Router. Guardar destino/contexto para retomada e limpar cache privado/subscriptions ao sair ou trocar de usuário.

Aceite: acesso direto privado exige login; expiração na navegação e no checkout retorna ao contexto após autenticação; nenhum dado/evento da sessão anterior aparece para outro usuário. REST representa sessão inválida e falta de permissão separadamente.

### 4A — Favoritos remotos com atualização otimista

Estado: pendente. Implementar consulta/inclusão/remoção por usuário, mutations Query, feedback acessível, invalidação e rollback.

Aceite: favorito permanece após refresh, falha restaura estado anterior e permite tentar novamente; duas sessões não compartilham favoritos; desktop e mobile mostram o mesmo recurso.

### 4B — Carrinho remoto, estoque e união após login

Estado: pendente. Implementar consulta, inclusão, alteração e remoção de itens por NFT/edição. Migrar da identificação local por nome. Definir união determinística do carrinho visitante ao autenticar e persistência após refresh.

Aceite: quantidades inteiras respeitam estoque; remover/alterar não duplica operações; refresh e login preservam itens; conflitos de disponibilidade têm feedback; cache e UI acompanham a resposta remota. Incluir skeleton no resumo.

### 4C — Cotação, cupom e precisão monetária

Estado: pendente. Criar cotação REST com subtotal, desconto, taxa de rede, total, validade/versão e validação de disponibilidade. Implementar aplicação e remoção de cupom, incluindo inválido e expirado. Transportar ETH como strings e calcular/apresentar sem perda de precisão.

Aceite: todos os resumos usam a cotação retornada; cupom válido/invalidado gera resultado coerente; alterações de quantidade geram nova cotação; falha preserva itens e impede conclusão com dados inválidos. Valores de recibo serão derivados do snapshot da etapa 6.

### 5A — Perfil, avatar e senha

Estado: pendente. Integrar consulta/edição de perfil, avatar e alteração de senha com validações locais e erros REST, incluindo mobile.

Aceite: dados salvos permanecem após refresh, erros são associados aos campos, alterações privadas pertencem ao usuário correto e senha não é exposta/persistida em claro. Assets do avatar devem funcionar localmente.

### 5B — Carteiras cadastradas e conexão simulada

Estado: pendente. Implementar consulta, cadastro e edição das carteiras principal/secundária e seleção de rede. Simular conexão, recusa e desconexão sem extensões ou blockchain reais.

Aceite: carteiras persistem após refresh e são utilizáveis no checkout; rede/campos inválidos retornam erros; conexão recusada/desconectada impede confirmação indevida; mobile permite administrar as mesmas carteiras.

### 6A — Revisão de compra e criação idempotente do pedido

Estado: pendente. Integrar dados do colecionador, carteira/rede e revisão. Revalidar preço, disponibilidade, cupom e taxa imediatamente antes de concluir; qualquer mudança exige nova confirmação. Criar pedido com chave de idempotência e conteúdo validado.

Aceite: clique repetido e reenvio recuperam o mesmo pedido; chave reutilizada com conteúdo diferente retorna conflito; timeout após criação permite recuperar o pedido existente; cotação vencida/alterada impede envio sem nova aprovação da compra. Sem confirmação por setter local.

### 6B — Estado de pedido, recuperação e recibo

Estado: pendente. Consultar pedidos pendentes, confirmados e recusados com snapshot imutável. Recuperar pedido após refresh sem criar outra compra. Remover do carrinho apenas itens e quantidades efetivamente comprados após confirmação.

Aceite: somente resposta confirmada da simulação abre confirmação; falhas/recusa preservam itens; recibo traz identificação/transação simulada, itens, subtotal/descontos, taxas e total do snapshot; mudanças futuras no catálogo não o alteram. Estados confirmados/recusados são terminais. Confirmação funciona em mobile e por acesso direto autorizado.

### 7A — Socket.IO com MSW e atualização de NFT

Estado: pendente. Adicionar uso efetivo de `socket.io-client` e integração MSW compatível com o protocolo, como `@mswjs/socket.io-binding`. Implementar `nft.updated` com identidade estável, recurso e versão, compartilhando a mesma base dos handlers REST.

Aceite: evento atualiza preço/estoque em catálogo, detalhe e carrinho; resumo é recalculado e alteração é anunciada; checkout bloqueia cotação desatualizada. Testes passam pelo cliente Socket.IO, sem chamadas diretas a setters/cache para simular os eventos. Documentar transporte e limitações.

### 7B — Eventos de pedido, reconexão e isolamento

Estado: pendente. Implementar `order.updated`, tolerância a duplicatas/eventos antigos, reconciliação REST dos recursos ativos após reconexão, cleanup de listeners e subscriptions vinculadas à sessão.

Aceite: duplicatas não reaplicam efeitos; versões antigas não regridem dados e eventos não revertem estados terminais; sessão encerrada não atualiza outro usuário; desconexão durante pedido pendente seguida de reconexão/refresh recupera o mesmo pedido e resultado correto.

### 8A — Matriz completa de falhas determinísticas

Estado: pendente; ampliar os cenários também ao longo de cada etapa funcional. Cobrir sucesso/vazio, latência variável, respostas fora de ordem, timeout, conexão indisponível, HTTP 4xx/5xx, sessão expirada/não autorizada, conflito de cadastro/validação, cupom inválido/expirado, preço alterado, edição esgotada, timeout após criação, pagamento confirmado e recusado.

Aceite: cada cenário possui seleção/reset documentados e reprodução estável em desenvolvimento, demonstração e testes. REST e eventos refletem a mesma alteração da base. Nenhum hook/componente/cliente Axios contém um caminho alternativo de negócio para produzir o cenário.

### 8B — Responsividade, fidelidade e acessibilidade

Estado: pendente. Revisar todas as telas em 390, 768 e 1440 pixels, usando os frames Figma quando disponíveis e registrando o que não puder ser comparado. Preservar assets/fontes acessíveis localmente, proporções, hierarquia, cores e espaçamentos. Documentar substituições e ajustes de acessibilidade.

Aceite: teclado e foco visível funcionam; diálogos/drawers controlam e restauram foco; labels/erros são associados; imagens relevantes possuem alternativas; contraste/estados não dependem só de cor; mutations/eventos têm feedback acessível; não há overflow indevido ou perda de conteúdo com zoom. Skeletons de catálogo, detalhe e resumo preservam dimensões e respeitam movimento reduzido. Links/ações auxiliares são coerentes; funcionalidades fora do escopo não apresentam falso sucesso.

### 9A — Completar cobertura Playwright dos fluxos

Estado: pendente além da fatia inicial. Adicionar testes junto às etapas e consolidar a matriz completa: catálogo/URL/histórico; detalhe direto/inexistente; cadastro/login/expiração/logout/troca; favoritos com falha; carrinho/cupom/persistência/login; compra ao recibo; recusa/clique repetido/timeout; perfil/avatar/senha/carteiras; preço/estoque por Socket.IO; duplicatas/eventos antigos/reconexão; teclado/foco/formulários; skeleton/erro/retry.

Aceite: fluxos principais executáveis em Chromium desktop/mobile; cada teste parte de estado isolado e controla relógio, latência e eventos sensíveis ao tempo; verificações observam interface e resultados das operações com REST via MSW e tempo real via Socket.IO. Produzir relatório HTML e traces de falhas, registrando os resultados efetivos.

### 9B — Regressão visual estável

Estado: pendente. Criar baselines versionadas e revisadas de início, detalhe, carrinho e pagamento em desktop/mobile, com dados estáveis, fontes/imagens prontas e condições de captura controladas.

Aceite: diferenças são revisadas visualmente e justificadas, sem aceitar baselines automaticamente para esconder regressões. Registrar viewports e condições de execução.

### 10A — Lighthouse e correções medidas

Estado: pendente. Auditar início e detalhe em build otimizado, cenário padrão, mobile e desktop, com três medições por combinação (12 execuções). Versionar configuração e guardar relatórios HTML/JSON, versões, ambiente e condições.

Aceite: reportar medianas por categoria e LCP, CLS e TBT. Metas: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95 e SEO ≥ 90. Medir a aplicação entregue com imagens/fontes/funcionalidades reais da demonstração; investigar e documentar causas de resultados abaixo das metas. Correções devem ser medidas sem criar uma versão artificial para a auditoria.

### 10B — Documentação e execução em checkout limpo

Estado: pendente; documentar decisões também durante a implementação. Reescrever README com setup, variáveis, credenciais fictícias, seleção/reset dos cenários, fluxos de falha e comandos de desenvolvimento com mocks, build, preview, tipos, lint, Playwright e Lighthouse. Criar ARCHITECTURE com contratos REST/eventos, sessão, carrinho, precisão ETH, cache, retries, invalidação, reconciliação, UX e desvios/limitações.

Aceite: checkout limpo executa com lockfile, assets, fixtures, mocks, testes e configuração de auditoria, sem serviço privado/backend de produção. Contratos documentam erros de validação, sessão inválida, falta de permissão, inexistência, conflito e falha transitória; pedido documenta chave de idempotência e conflito de conteúdo. Instruções devem corresponder aos comandos e comportamento verificados.

### 10C — Preparação e verificação do deploy obrigatório

Estado: pendente. Preparar publicação em Vercel, Netlify ou Cloudflare Pages, incluindo fallback de rotas, assets, worker MSW e transporte Socket.IO suportado. Disponibilizar resultado concreto para a solicitação de publicação quando chegar esta etapa.

Aceite: entregar link do repositório e URL pública; versão publicada corresponde ao código entregue, permite acesso direto/refresh de qualquer rota prevista e mantém mocks/tempo real funcionais durante a avaliação. A preparação da configuração não encerra este requisito: publicação e verificação pública ainda são necessárias.

## Registro de validação — etapa 1A

O diagnóstico acima resulta de leitura do código e das verificações da fatia 1A. Execução em Windows com Node 24.21.0; scripts do Vite usam `--configLoader native`. Nenhuma aprovação de Lighthouse, fidelidade ao Figma, matriz E2E completa ou deploy é declarada por este documento.

| Verificação | Resultado registrado |
| --- | --- |
| Revisão da estrutura e das pendências | Realizada por inspeção; evidências na tabela de diagnóstico. |
| Tipos | `npm run typecheck` passou. |
| Build | Build sem mocks passou; `build:demo`/preview também executados pela configuração Playwright. |
| Lint dos arquivos modificados na fatia | Passou. Worker MSW gerado corretamente ignorado pelo ESLint. |
| Lint global | Mantém dois erros preexistentes: import de `catalog` usado apenas como tipo em `src/components/nft/nft-data.tsx` e import de tipo inline em `src/components/ui/button.tsx`. Não são regressões da fatia 1A. |
| Testes de interface da listagem desktop | Quatro testes Playwright passaram em 27,1 s, com saída 0, em Chrome (motor Chromium), 1440 × 1000: (1) resposta via service worker, ETH string, categorias/ordem/refresh; (2) vazio; (3) erro/retry; (4) skeleton lento/movimento reduzido. Ver `tests/e2e/catalog.spec.ts` e `playwright.config.ts`. |
| Limite dos testes de catálogo | Ainda não cobrem a futura matriz de URL, paginação, latência variável e respostas fora de ordem. O cancelamento tem suporte no código; a validação determinística completa fica na etapa 2A. |
| Mobile via REST | Pendente, etapa 1C. |
| Figma e matriz visual/acessibilidade completa | Não verificados nesta rodada. |
| Lighthouse e deploy público | Pendentes. |

## Registro de validação — etapa 1B

Rodada concluída em Windows, Node 24.21.0 e Chrome (Chromium) em 1440 × 1000. `npm run build` e o build de demonstração passaram. A verificação de tipos, o lint dos arquivos alterados, a formatação e a checagem de espaços do diff passaram. O lint global continua com os mesmos dois imports preexistentes registrados acima.

Suíte final: **16 testes aprovados em 47,4 s**, saída 0. São quatro testes de catálogo da etapa anterior, cinco testes de base persistente/reset via navegador e MSW e sete testes puros de precisão ETH. O teste de concorrência confirma `409 SCENARIO_RESET` para leitura iniciada antes do reset. Na primeira execução houve uma falha de espera na abertura inicial da UI; o trace mostrou resposta 200 com os oito itens. Após sincronizar a abertura com a resposta inicial, a suíte inteira passou.

Relatório HTML em `playwright-report/index.html`; traces de falhas são gerados automaticamente. Não foram validados fluxos privados, Socket.IO, mobile, Figma, Lighthouse ou deploy nesta rodada. Próxima etapa: **1C — integrar catálogo mobile à mesma API**. Aguardar solicitação de continuação.

## Registro de validação — etapa 1C

Seis testes novos em `tests/e2e/mobile-catalog.spec.ts` verificam a resposta MSW em 390 px, categorias e ordem da API, busca local, skeleton com movimento reduzido, vazio/erro/retry, preço mutável persistido, acesso direto/histórico para um NFT fora dos quatro cards antigos, rotas de login/cadastro e catálogo em 768 px sem overflow horizontal. A primeira execução teve uma asserção de URL específica para `%20`; o Router serializa espaços como `+`. O teste passou a validar pathname e parâmetro decodificado. Depois disso, a suíte completa passou: **22/22 testes em 1,3 min**, saída 0, build de demonstração e preview. Tipos e lint dos arquivos desta etapa passaram. O lint global mantém somente os dois erros antigos registrados em 1A.

Não houve verificação nova de fidelidade ao Figma, regressão visual com baselines, todos os fluxos mobile, Lighthouse ou deploy. Próxima etapa: **2A — busca, filtros, ordenação e paginação na URL**. Aguardar solicitação de continuação.

## Condições que impedem considerar o desafio completo

Continuam eliminatórios no enunciado: ausência de uso efetivo de qualquer parte da stack obrigatória, fluxos principais apenas visuais, compra confirmada sem resposta da simulação, exposição de dados entre usuários, eventos simulados diretamente na interface e ausência de E2E executáveis. A conclusão de uma etapa pequena não remove as pendências dessas condições. Integrações reais com blockchain, extensões de carteira, gateways, páginas editoriais, suporte, atividade, ofertas e downloads ficam fora do escopo.
