# Rancho

> O controle da sua compra na palma da sua mão.

**Rancho** é um app mobile para planejar e fazer a compra do mês com menos esquecimentos, sem contas na calculadora e com o orçamento sempre à vista.

Projeto de portfólio de Product Design, do discovery à versão funcional. O documento de visão completo está em [`docs/product-brief.md`](docs/product-brief.md).

## O problema

Na compra do mês, a lista fica no bloco de notas e as contas na calculadora do celular. Somar 12 molhos de tomate a R$ 5,99, guardar o total parcial e continuar somando interrompe a compra, e mesmo assim às vezes algum item fica para trás.

## A proposta (hipótese)

1. **Planejar:** montar a lista antes de sair de casa.
2. **Comprar:** registrar preço unitário e quantidade; subtotal, total e saldo do orçamento são calculados na hora.
3. **Aprender:** usar compras anteriores para facilitar a próxima.

## Escopo do MVP (hipótese)

- [ ] Criar uma compra com orçamento
- [ ] Adicionar produtos à lista
- [ ] Informar preço unitário e quantidade
- [ ] Calcular subtotal, total acumulado e saldo automaticamente
- [ ] Marcar produtos como comprados
- [ ] Ver os itens pendentes

Lista compartilhada, inventário da casa e histórico ficam para depois do discovery.

## Stack

- [Expo](https://expo.dev) (SDK 57) + React Native + TypeScript
- [Expo Router](https://docs.expo.dev/router/introduction/) para navegação (rotas em `src/app/`)

## Rodando localmente

Pré-requisitos: Node.js 20+ e o app **Expo Go** no celular.

```bash
npm install
npx expo start
```

Escaneie o QR code com a câmera (iOS) ou com o Expo Go (Android).

## Estrutura

```
src/
  app/        # telas (cada arquivo é uma rota)
  theme/      # tokens de cor, espaçamento e raio (paleta provisória)
docs/
  product-brief.md   # visão do produto
  references/        # referências visuais
```

## Status

Conceito inicial. Decisões de produto ainda dependem de entrevistas e testes. Nada aqui é resultado validado.
