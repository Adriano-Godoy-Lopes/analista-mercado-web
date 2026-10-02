import type { GlossaryEntry, Trend } from "./types";

export type MacroQuote = {
  label: string;
  value: string;
  change: number;
};

export const MACRO_TAPE: MacroQuote[] = [
  { label: "IBOV", value: "131.842", change: 0.62 },
  { label: "S&P 500", value: "6.412,30", change: 0.35 },
  { label: "NASDAQ", value: "21.087,55", change: 0.81 },
  { label: "USD/BRL", value: "5,38", change: -0.21 },
  { label: "SELIC", value: "10,50%", change: 0 },
  { label: "US10Y", value: "4,12%", change: -0.04 },
  { label: "OURO", value: "US$ 2.684", change: 0.47 },
  { label: "BRENT", value: "US$ 76,40", change: -1.12 },
  { label: "BTC", value: "US$ 68.950", change: 2.38 },
];

export const BASE_GLOSSARY: GlossaryEntry[] = [
  {
    term: "P/L (Preço/Lucro)",
    definition:
      "Quantos anos de lucro atual você paga ao comprar o ativo. P/L 20x significa pagar 20 vezes o lucro anual. Alto pode indicar otimismo; baixo pode indicar desconto ou desconfiança.",
  },
  {
    term: "P/VP (Preço/Valor Patrimonial)",
    definition:
      "Compara o preço de mercado com o patrimônio contábil. Abaixo de 1x, o mercado paga menos do que os ativos valem no balanço.",
  },
  {
    term: "Dividend Yield (DY)",
    definition:
      "Quanto o ativo pagou em proventos nos últimos 12 meses dividido pelo preço atual. É o 'aluguel' que o investimento rende.",
  },
  {
    term: "Momentum",
    definition:
      "Indicador de 0 a 100 que combina tendência de preço e força relativa. Acima de 75: tendência forte; abaixo de 40: perda de tração.",
  },
  {
    term: "Volume",
    definition:
      "Valor financeiro negociado. Alta com volume crescente costuma ser mais confiável do que alta com pouco volume.",
  },
];

export const TRENDS: Trend[] = [
  {
    id: "ia-semicondutores",
    ticker: "SMH",
    name: "IA & Semicondutores",
    sector: "Tecnologia",
    vehicle: "ETF · VanEck Semiconductor",
    currency: "USD",
    price: 284.36,
    change: { d1: 1.84, d30: 7.42, y1: 42.1 },
    avgVolume: 1_240_000_000,
    valuation: { pe: 34.2, pb: 8.1, dy: 0.42 },
    momentum: 86,
    volatility: 0.34,
    seed: 1101,
    events: [
      { barsAgo: 6, title: "Guidance de data centers acima do consenso", kind: "positivo" },
      { barsAgo: 34, title: "Novas restrições à exportação de chips", kind: "negativo" },
      { barsAgo: 77, title: "Hyperscalers elevam capex de IA para 2027", kind: "positivo" },
      { barsAgo: 141, title: "Fed inicia ciclo de cortes de juros", kind: "positivo" },
      { barsAgo: 205, title: "Correção por temor de bolha em IA", kind: "negativo" },
      { barsAgo: 610, title: "Lançamento de modelos generativos em escala", kind: "positivo" },
    ],
    thesis: {
      drivers: [
        {
          title: "Capex de IA em expansão",
          detail:
            "Os grandes provedores de nuvem seguem ampliando investimentos em data centers, e GPUs/aceleradores são o item mais caro dessa conta.",
        },
        {
          title: "Poder de precificação",
          detail:
            "Poucos fornecedores dominam litografia, design de chips de ponta e empacotamento avançado, o que sustenta margens elevadas.",
        },
        {
          title: "Novos ciclos de demanda",
          detail:
            "PCs e smartphones com IA embarcada, carros elétricos e automação industrial ampliam o mercado além dos data centers.",
        },
      ],
      risks: [
        {
          title: "Valuation esticado",
          detail:
            "P/L acima de 30x já embute muito crescimento. Qualquer desaceleração do capex pode provocar quedas de 30%+.",
        },
        {
          title: "Geopolítica",
          detail:
            "Concentração produtiva em Taiwan e restrições comerciais EUA–China podem interromper cadeias de suprimento.",
        },
        {
          title: "Ciclicidade histórica",
          detail:
            "Semicondutores alternam ciclos de escassez e excesso de estoque; o setor já caiu mais de 40% em ciclos anteriores.",
        },
      ],
      verdict: [
        "Tendência estrutural de longo prazo, mas com preço que exige disciplina na entrada.",
        "Preferir aportes graduais em vez de comprar tudo de uma vez após altas fortes.",
        "Posição satélite: limitar a uma fatia moderada da carteira por causa da volatilidade.",
      ],
      stance: "Construtiva",
      conviction: 78,
      horizon: "3–5 anos",
    },
    explainer: {
      summary:
        "Um ETF é uma cesta de ações negociada como se fosse uma só. Este reúne as maiores fabricantes e projetistas de chips do mundo: quem desenha, quem fabrica e quem vende as máquinas que fabricam.",
      howItMakesMoney: [
        "Designers (ex.: GPUs) vendem chips de alto valor e cobram caro pela tecnologia.",
        "Fundições fabricam chips sob encomenda para várias empresas e ganham com escala.",
        "Fornecedores de equipamentos vendem máquinas de litografia que custam centenas de milhões.",
      ],
      composition: [
        { label: "Design de GPUs/aceleradores", weight: 31 },
        { label: "Fundições", weight: 22 },
        { label: "Equipamentos", weight: 19 },
        { label: "Memória", weight: 12 },
        { label: "Analógicos & outros", weight: 16 },
      ],
      glossary: [
        {
          term: "Capex",
          definition:
            "Investimento em bens físicos, como servidores e fábricas. Quando big techs aumentam capex de IA, compram mais chips.",
        },
        {
          term: "Fabless",
          definition:
            "Empresa que projeta chips mas terceiriza a fabricação para uma fundição.",
        },
      ],
    },
  },
  {
    id: "reits",
    ticker: "VNQ",
    name: "REITs Globais",
    sector: "Imobiliário",
    vehicle: "ETF · Vanguard Real Estate",
    currency: "USD",
    price: 92.18,
    change: { d1: 0.41, d30: 2.14, y1: 9.8 },
    avgVolume: 380_000_000,
    valuation: { pe: 28.5, pb: 2.3, dy: 3.9 },
    momentum: 58,
    volatility: 0.19,
    seed: 2202,
    events: [
      { barsAgo: 9, title: "Queda dos juros longos dos EUA", kind: "positivo" },
      { barsAgo: 52, title: "Vacância de escritórios em nova máxima", kind: "negativo" },
      { barsAgo: 118, title: "Data centers lideram aquisições do setor", kind: "positivo" },
      { barsAgo: 230, title: "Inflação acima do esperado pressiona juros", kind: "negativo" },
    ],
    thesis: {
      drivers: [
        {
          title: "Ciclo de queda de juros",
          detail:
            "REITs competem com títulos públicos pela renda do investidor; juros menores tornam o dividendo mais atraente e reduzem o custo da dívida.",
        },
        {
          title: "Segmentos estruturais",
          detail:
            "Data centers, galpões logísticos e torres de telecom crescem com digitalização e e-commerce.",
        },
        {
          title: "Reajustes atrelados à inflação",
          detail:
            "Muitos contratos de aluguel têm correção anual, protegendo a renda em termos reais.",
        },
      ],
      risks: [
        {
          title: "Escritórios em transformação",
          detail:
            "O trabalho híbrido mantém a vacância alta em lajes corporativas, pressionando parte do setor.",
        },
        {
          title: "Sensibilidade a juros",
          detail:
            "Se a inflação voltar e os juros subirem, REITs tendem a cair junto com os títulos de longo prazo.",
        },
        {
          title: "Refinanciamento",
          detail:
            "Dívidas contratadas a juros baixos vencem e precisam ser roladas a taxas maiores.",
        },
      ],
      verdict: [
        "Bom gerador de renda passiva em dólar, com potencial de valorização se os juros caírem.",
        "Priorizar segmentos com demanda estrutural (logística, data centers) em vez de escritórios.",
      ],
      stance: "Neutra",
      conviction: 61,
      horizon: "2–4 anos",
    },
    explainer: {
      summary:
        "REITs são o equivalente americano dos fundos imobiliários (FIIs): empresas donas de imóveis que alugam espaços e são obrigadas a distribuir a maior parte do lucro aos cotistas.",
      howItMakesMoney: [
        "Recebem aluguéis de inquilinos em contratos de longo prazo.",
        "Vendem imóveis valorizados e reciclam o capital em novos ativos.",
        "Repassam ao menos 90% do lucro tributável como dividendos.",
      ],
      composition: [
        { label: "Data centers & torres", weight: 24 },
        { label: "Logística & industrial", weight: 21 },
        { label: "Residencial", weight: 18 },
        { label: "Saúde", weight: 14 },
        { label: "Varejo & escritórios", weight: 23 },
      ],
      glossary: [
        {
          term: "FFO",
          definition:
            "Funds From Operations: lucro operacional de um REIT sem a depreciação contábil. É a métrica mais usada no setor no lugar do lucro.",
        },
        {
          term: "Vacância",
          definition: "Percentual de área disponível sem inquilino. Quanto menor, melhor.",
        },
      ],
    },
  },
  {
    id: "dividend-aristocrats",
    ticker: "NOBL",
    name: "Dividend Aristocrats",
    sector: "Renda",
    vehicle: "ETF · ProShares S&P 500 Aristocrats",
    currency: "USD",
    price: 104.72,
    change: { d1: 0.18, d30: 1.32, y1: 11.6 },
    avgVolume: 72_000_000,
    valuation: { pe: 21.4, pb: 3.6, dy: 2.1 },
    momentum: 52,
    volatility: 0.15,
    seed: 3303,
    events: [
      { barsAgo: 14, title: "Rotação para setores defensivos", kind: "positivo" },
      { barsAgo: 88, title: "Rally de tecnologia deixa defensivas para trás", kind: "negativo" },
      { barsAgo: 160, title: "Temporada de aumentos de dividendos", kind: "positivo" },
    ],
    thesis: {
      drivers: [
        {
          title: "Histórico comprovado",
          detail:
            "Empresas que aumentam dividendos há 25+ anos consecutivos atravessaram recessões, crises e ciclos de juros.",
        },
        {
          title: "Qualidade e balanços sólidos",
          detail:
            "Geração de caixa previsível e dívida controlada reduzem o risco de cortes de proventos.",
        },
        {
          title: "Proteção em quedas",
          detail:
            "Historicamente caem menos que o S&P 500 em mercados de baixa, suavizando a jornada.",
        },
      ],
      risks: [
        {
          title: "Pouca exposição a crescimento",
          detail:
            "Baixa presença de tecnologia faz o ETF ficar para trás em rallies liderados por big techs.",
        },
        {
          title: "Concorrência da renda fixa",
          detail:
            "Com títulos americanos pagando 4%+, um DY de ~2% perde atratividade relativa.",
        },
      ],
      verdict: [
        "Núcleo defensivo para quem busca renda crescente e menor volatilidade.",
        "Retorno total tende a ser consistente, não explosivo: combina bem com posições de crescimento.",
      ],
      stance: "Construtiva",
      conviction: 66,
      horizon: "5+ anos",
    },
    explainer: {
      summary:
        "Reúne empresas do S&P 500 que aumentaram seus dividendos todos os anos por pelo menos 25 anos seguidos, com peso igual entre elas.",
      howItMakesMoney: [
        "As empresas vendem produtos essenciais (consumo, saúde, indústria) com demanda estável.",
        "Parte do lucro volta ao acionista em dividendos que crescem ano a ano.",
        "O ETF rebalanceia trimestralmente para manter pesos iguais.",
      ],
      composition: [
        { label: "Industriais", weight: 23 },
        { label: "Consumo básico", weight: 22 },
        { label: "Materiais", weight: 12 },
        { label: "Saúde", weight: 11 },
        { label: "Financeiro & outros", weight: 32 },
      ],
      glossary: [
        {
          term: "Payout",
          definition:
            "Parte do lucro distribuída como dividendos. Payout muito alto (acima de 90%) pode ser difícil de sustentar.",
        },
        {
          term: "Equal weight",
          definition: "Cada empresa tem o mesmo peso no fundo, independentemente do tamanho.",
        },
      ],
    },
  },
  {
    id: "energia-limpa",
    ticker: "ICLN",
    name: "Energia Limpa",
    sector: "Energia",
    vehicle: "ETF · iShares Global Clean Energy",
    currency: "USD",
    price: 14.82,
    change: { d1: -1.24, d30: 5.61, y1: 18.3 },
    avgVolume: 46_000_000,
    valuation: { pe: 19.8, pb: 1.6, dy: 1.5 },
    momentum: 64,
    volatility: 0.31,
    seed: 4404,
    events: [
      { barsAgo: 3, title: "Leilão de energia eólica abaixo do esperado", kind: "negativo" },
      { barsAgo: 25, title: "Demanda elétrica de data centers dispara", kind: "positivo" },
      { barsAgo: 96, title: "Revisão de subsídios em debate no Congresso", kind: "negativo" },
      { barsAgo: 175, title: "Custo de baterias atinge mínima histórica", kind: "positivo" },
      { barsAgo: 520, title: "Pico do setor após juros zero", kind: "neutro" },
    ],
    thesis: {
      drivers: [
        {
          title: "Demanda por eletricidade",
          detail:
            "Data centers de IA, eletrificação de frotas e reindustrialização elevam o consumo de energia pela primeira vez em décadas.",
        },
        {
          title: "Queda de custos",
          detail:
            "Solar, eólica e baterias ficaram mais baratas que fontes fósseis em muitos mercados.",
        },
        {
          title: "Valuation descontado",
          detail:
            "Após forte queda desde o pico, o setor negocia com múltiplos abaixo da média histórica.",
        },
      ],
      risks: [
        {
          title: "Dependência regulatória",
          detail:
            "Mudanças em subsídios e créditos fiscais podem alterar a rentabilidade dos projetos rapidamente.",
        },
        {
          title: "Sensível a juros",
          detail:
            "Projetos são intensivos em capital e financiados com dívida; juros altos corroem o retorno.",
        },
        {
          title: "Concorrência e preços",
          detail:
            "Excesso de oferta de painéis solares pressiona margens de fabricantes.",
        },
      ],
      verdict: [
        "Recuperação em curso com tese de demanda elétrica forte, mas trajetória volátil.",
        "Indicado para horizonte longo e tolerância a oscilações de 30%+.",
      ],
      stance: "Neutra",
      conviction: 57,
      horizon: "3–5 anos",
    },
    explainer: {
      summary:
        "Carteira global de empresas que geram energia renovável ou fabricam equipamentos para isso: painéis solares, turbinas eólicas, inversores e utilities verdes.",
      howItMakesMoney: [
        "Geradoras vendem energia em contratos de longo prazo (PPAs) com preço definido.",
        "Fabricantes vendem equipamentos para novos parques solares e eólicos.",
        "Utilities cobram tarifas reguladas pela transmissão e distribuição.",
      ],
      composition: [
        { label: "Solar", weight: 34 },
        { label: "Utilities renováveis", weight: 29 },
        { label: "Eólica", weight: 17 },
        { label: "Armazenamento & redes", weight: 12 },
        { label: "Outros", weight: 8 },
      ],
      glossary: [
        {
          term: "PPA",
          definition:
            "Power Purchase Agreement: contrato de venda de energia de longo prazo que dá previsibilidade de receita.",
        },
        {
          term: "Utility",
          definition: "Empresa de serviço público, como geração e distribuição de energia.",
        },
      ],
    },
  },
  {
    id: "commodities",
    ticker: "DBC",
    name: "Commodities",
    sector: "Matérias-primas",
    vehicle: "ETF · Invesco DB Commodity",
    currency: "USD",
    price: 23.41,
    change: { d1: -0.62, d30: -2.38, y1: 3.2 },
    avgVolume: 31_000_000,
    valuation: { pe: null, pb: null, dy: 4.6 },
    momentum: 38,
    volatility: 0.22,
    seed: 5505,
    events: [
      { barsAgo: 11, title: "OPEP+ amplia produção de petróleo", kind: "negativo" },
      { barsAgo: 63, title: "Estímulos na China animam metais", kind: "positivo" },
      { barsAgo: 150, title: "Tensões no Oriente Médio elevam o Brent", kind: "positivo" },
      { barsAgo: 240, title: "Dólar forte pressiona matérias-primas", kind: "negativo" },
    ],
    thesis: {
      drivers: [
        {
          title: "Proteção contra inflação",
          detail:
            "Commodities costumam subir quando a inflação surpreende para cima, compensando perdas em ações e títulos.",
        },
        {
          title: "Subinvestimento em oferta",
          detail:
            "Anos de baixo investimento em mineração e petróleo limitam a capacidade de aumentar a produção.",
        },
        {
          title: "Transição energética",
          detail: "Cobre, alumínio e outros metais são essenciais para redes elétricas e veículos elétricos.",
        },
      ],
      risks: [
        {
          title: "Desaceleração global",
          detail: "Crescimento fraco na China e na Europa reduz a demanda por energia e metais.",
        },
        {
          title: "Custo de rolagem",
          detail:
            "O ETF compra contratos futuros; quando o futuro é mais caro que o preço à vista, a rolagem corrói o retorno.",
        },
        {
          title: "Sem fluxo de caixa",
          detail: "Commodities não geram lucro nem dividendos próprios: o retorno depende só do preço.",
        },
      ],
      verdict: [
        "Momentum fraco no curto prazo; funciona mais como seguro de carteira do que como aposta de alta.",
        "Considerar posição pequena (5–10%) para diversificação contra choques inflacionários.",
      ],
      stance: "Cautelosa",
      conviction: 42,
      horizon: "1–3 anos",
    },
    explainer: {
      summary:
        "Em vez de ações, este ETF compra contratos futuros de matérias-primas: petróleo, gás, ouro, metais industriais e grãos. Você investe no preço das commodities, não em empresas.",
      howItMakesMoney: [
        "Ganha quando os preços futuros das commodities sobem.",
        "Rola os contratos antes do vencimento, comprando os do mês seguinte.",
        "O caixa parado como garantia rende juros em títulos do Tesouro americano.",
      ],
      composition: [
        { label: "Energia", weight: 55 },
        { label: "Metais industriais", weight: 15 },
        { label: "Agrícolas", weight: 18 },
        { label: "Metais preciosos", weight: 12 },
      ],
      glossary: [
        {
          term: "Contango",
          definition:
            "Situação em que o contrato futuro é mais caro que o preço à vista. Prejudica quem precisa rolar posições.",
        },
        {
          term: "Contrato futuro",
          definition: "Acordo para comprar ou vender algo em uma data futura por um preço definido hoje.",
        },
      ],
    },
  },
  {
    id: "ibovespa",
    ticker: "BOVA11",
    name: "Ibovespa",
    sector: "Brasil",
    vehicle: "ETF · iShares Ibovespa",
    currency: "BRL",
    price: 127.94,
    change: { d1: 0.58, d30: 3.05, y1: 14.7 },
    avgVolume: 1_850_000_000,
    valuation: { pe: 8.4, pb: 1.5, dy: 6.8 },
    momentum: 61,
    volatility: 0.21,
    seed: 6606,
    events: [
      { barsAgo: 8, title: "Copom sinaliza fim do ciclo de alta da Selic", kind: "positivo" },
      { barsAgo: 44, title: "Ruído fiscal derruba a bolsa", kind: "negativo" },
      { barsAgo: 102, title: "Fluxo estrangeiro positivo pelo 5º mês", kind: "positivo" },
      { barsAgo: 196, title: "Minério de ferro em queda pressiona índice", kind: "negativo" },
    ],
    thesis: {
      drivers: [
        {
          title: "Valuation descontado",
          detail:
            "P/L abaixo de 9x, bem abaixo da média histórica e de outros emergentes: muito pessimismo já está no preço.",
        },
        {
          title: "Dividendos elevados",
          detail:
            "Bancos, petróleo e mineração distribuem muito lucro, com DY do índice perto de 7%.",
        },
        {
          title: "Potencial de corte de juros",
          detail:
            "Uma queda da Selic reduz o custo de capital e tende a reprecificar as ações domésticas para cima.",
        },
      ],
      risks: [
        {
          title: "Risco fiscal",
          detail:
            "Dúvidas sobre as contas públicas elevam juros futuros e o dólar, derrubando a bolsa.",
        },
        {
          title: "Concentração",
          detail:
            "Petróleo, mineração e bancos pesam muito no índice; ele depende de commodities e crédito.",
        },
        {
          title: "Selic alta por mais tempo",
          detail: "Com a renda fixa pagando dois dígitos, sobra pouco apetite por risco.",
        },
      ],
      verdict: [
        "Assimetria favorável pelo preço baixo, mas exige tolerância ao ruído político-fiscal.",
        "Combina valorização potencial com renda alta via dividendos.",
        "Aportes escalonados ajudam a navegar a volatilidade doméstica.",
      ],
      stance: "Construtiva",
      conviction: 64,
      horizon: "2–4 anos",
    },
    explainer: {
      summary:
        "O Ibovespa é o principal índice da bolsa brasileira, reunindo as ações mais negociadas da B3. O BOVA11 replica esse índice: comprar uma cota é como comprar um pedaço de todas essas empresas.",
      howItMakesMoney: [
        "Acompanha a valorização das maiores empresas brasileiras.",
        "Os dividendos das empresas do índice são reinvestidos no próprio fundo.",
        "Taxa de administração baixa em relação a fundos ativos.",
      ],
      composition: [
        { label: "Financeiro", weight: 26 },
        { label: "Commodities (minério & petróleo)", weight: 29 },
        { label: "Utilities & energia", weight: 13 },
        { label: "Consumo & varejo", weight: 11 },
        { label: "Outros", weight: 21 },
      ],
      glossary: [
        {
          term: "Selic",
          definition:
            "Taxa básica de juros do Brasil, definida pelo Copom. Quanto maior, mais atraente a renda fixa e mais caro o crédito.",
        },
        {
          term: "Fluxo estrangeiro",
          definition: "Saldo de compras e vendas de investidores de fora do país na B3.",
        },
      ],
    },
  },
];
