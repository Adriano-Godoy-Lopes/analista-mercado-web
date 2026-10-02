# MarketAnalyst // Terminal de Tendências

Dashboard de inteligência de investimentos (Next.js 16 + Tailwind CSS 4 + TradingView Lightweight Charts + Lucide).

- Radar de tendências com variação 24h/30d/1A, volume, P/L, P/VP, DY e momentum
- Gráfico interativo (1M, 6M, 1A, 5A, MÁX), área ou candlestick, tooltip com preço, volume e eventos
- Tese de investimento: drivers, riscos/contra-tese e veredito
- "Entenda o ativo": modelo de negócio, composição e glossário

Todos os dados são simulados (`lib/mock-data.ts`, séries determinísticas em `lib/series.ts`).

## Rodando

Requer Node 20.9+.

```bash
cd web
npm install
npm run dev        # http://localhost:3000
npm run lint
npm run typecheck
npm run build
```
