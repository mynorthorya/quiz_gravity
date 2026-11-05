/**
 * NORTHORYA — MAPA DOS SEUS PADRÕES
 * Motor Determinístico de Avaliação Comportamental V1.1
 * 
 * Estrutura: 20 perguntas calibradas divididas em 5 dimensões comportamentais fundamentais.
 */

export const DIMENSIONS = {
  energia_limites: {
    id: 'energia_limites',
    title: 'Gestão de Energia e Limites',
    short: 'Energia & Limites',
    description: 'Capacidade de reconhecer ritmos biológicos e psicológicos, estabelecer fronteiras protetivas e sustentar pausas conscientes sem culpa.'
  },
  decisao_autonomia: {
    id: 'decisao_autonomia',
    title: 'Tomada de Decisão e Autonomia',
    short: 'Decisão & Autonomia',
    description: 'Postura frente à incerteza, grau de dependência da validação de terceiros e firmeza para sustentar as próprias escolhas.'
  },
  relacionamentos_comunicacao: {
    id: 'relacionamentos_comunicacao',
    title: 'Dinâmica de Relacionamentos e Comunicação',
    short: 'Vínculos & Expressão',
    description: 'Manejo de atritos interpessoais, clareza no posicionamento, tendência a assumir cargas alheias e abertura à vulnerabilidade.'
  },
  erro_controle: {
    id: 'erro_controle',
    title: 'Relação com Erro, Exigência e Controle',
    short: 'Controle & Perfeccionismo',
    description: 'Nível de tolerância à imperfeição, rigidez com imprevistos, facilidade ou resistência em delegar e autocobrança interna.'
  },
  proposito_futuro: {
    id: 'proposito_futuro',
    title: 'Alinhamento de Propósito e Rumo de Vida',
    short: 'Propósito & Direção',
    description: 'Grau de coerência entre os valores essenciais e as ações rotineiras, investimento em projetos próprios e coragem de redirecionamento.'
  }
};

export const QUESTIONS = [
  // --- DIMENSÃO 1: GESTÃO DE ENERGIA E LIMITES (P1 a P4) ---
  {
    id: 1,
    dimension: 'energia_limites',
    text: 'Quando suas demandas e compromissos começam a ultrapassar sua capacidade real, qual tende a ser sua reação imediata?',
    options: [
      { id: 'a', score: 1, text: 'Paro imediatamente, recalibro prioridades e cancelo o que for excessivo.' },
      { id: 'b', score: 2, text: 'Sinto o aperto, seleciono o essencial e negocio prazos antes de estourar.' },
      { id: 'c', score: 3, text: 'Acelero o ritmo, durmo menos e tento dar conta de tudo para não deixar ninguém na mão.' },
      { id: 'd', score: 4, text: 'Entro em piloto automático, me sinto refém das exigências e só paro quando o corpo adoece ou colapsa.' }
    ]
  },
  {
    id: 2,
    dimension: 'energia_limites',
    text: 'Dizer "não" para pedidos, novos projetos ou convites quando você já está sobrecarregado(a) costuma ser:',
    options: [
      { id: 'a', score: 1, text: 'Tranquilo e natural; reconheço meus limites sem culpa.' },
      { id: 'b', score: 2, text: 'Desconfortável, mas consigo recusar quando é estritamente necessário.' },
      { id: 'c', score: 3, text: 'Difícil; costumo justificar em excesso e fico com remorso por ter recusado.' },
      { id: 'd', score: 4, text: 'Quase impossível; aceito quase tudo por receio de desapontar, ser julgado(a) ou perder espaço.' }
    ]
  },
  {
    id: 3,
    dimension: 'energia_limites',
    text: 'Como você se relaciona com momentos de pausa, lazer ou ócio descompromissado na sua rotina?',
    options: [
      { id: 'a', score: 1, text: 'Desfruto com plenitude, sabendo que a pausa é parte vital da minha clareza.' },
      { id: 'b', score: 2, text: 'Consigo descansar, embora às vezes lembre de pendências.' },
      { id: 'c', score: 3, text: 'Sinto uma inquietação constante de que "deveria estar produzindo algo útil".' },
      { id: 'd', score: 4, text: 'Não consigo parar; mesmo no descanso fico monitorando mensagens, tarefas ou novos problemas.' }
    ]
  },
  {
    id: 4,
    dimension: 'energia_limites',
    text: 'Ao notar os primeiros sinais de fadiga mental ou esgotamento físico, o que você costuma fazer?',
    options: [
      { id: 'a', score: 1, text: 'Respeito o sinal do corpo e ajusto a rotina para repor a energia.' },
      { id: 'b', score: 2, text: 'Diminuo um pouco o ritmo e busco uma folga rápida no fim de semana.' },
      { id: 'c', score: 3, text: 'Uso estimulantes (café, energéticos) e empurro com a barriga até o próximo intervalo.' },
      { id: 'd', score: 4, text: 'Ignoro totalmente os sinais e continuo exigindo rendimento máximo de mim mesmo(a).' }
    ]
  },

  // --- DIMENSÃO 2: TOMADA DE DECISÃO E AUTONOMIA (P5 a P8) ---
  {
    id: 5,
    dimension: 'decisao_autonomia',
    text: 'Diante de decisões cruciais que envolvem incerteza e riscos consideráveis, seu processo costuma ser:',
    options: [
      { id: 'a', score: 1, text: 'Analiso os cenários com serenidade, confio na minha bússola interna e decido sem hesitação excessiva.' },
      { id: 'b', score: 2, text: 'Avalio com cuidado, busco dados suficientes e tomo a decisão no prazo adequado.' },
      { id: 'c', score: 3, text: 'Fico preso(a) na análise de todos os riscos possíveis, adiando o veredito por receio de errar.' },
      { id: 'd', score: 4, text: 'Entro em paralisia e angústia; espero que as circunstâncias ou outros decidam por mim.' }
    ]
  },
  {
    id: 6,
    dimension: 'decisao_autonomia',
    text: 'O quanto a aprovação ou opinião de outras pessoas pesa nas escolhas que você faz?',
    options: [
      { id: 'a', score: 1, text: 'Ouço perspectivas construtivas, mas a decisão final é pautada nos meus próprios princípios.' },
      { id: 'b', score: 2, text: 'Levo em consideração pessoas de confiança, equilibrando com minha vontade.' },
      { id: 'c', score: 3, text: 'Costumo moldar minhas escolhas para agradar ou evitar olhares de reprovação.' },
      { id: 'd', score: 4, text: 'Tenho imensa dificuldade de bancar o que desejo se houver qualquer sinal de desagrado alheio.' }
    ]
  },
  {
    id: 7,
    dimension: 'decisao_autonomia',
    text: 'Quando uma escolha sua não produz o resultado esperado, qual é a sua reação mental predominante?',
    options: [
      { id: 'a', score: 1, text: 'Extraio o aprendizado como feedback e corrijo a rota com maturidade.' },
      { id: 'b', score: 2, text: 'Fico chateado(a) momentaneamente, mas sigo em frente procurando consertar.' },
      { id: 'c', score: 3, text: 'Passo dias me martirizando mentalmente com pensamentos de "eu deveria ter previsto isso".' },
      { id: 'd', score: 4, text: 'Assumo o erro como uma falha pessoal de competência ou caráter, abalando profundamente minha autoconfiança.' }
    ]
  },
  {
    id: 8,
    dimension: 'decisao_autonomia',
    text: 'No seu dia a dia, quem ou o que dita a maior parte das suas ações prioritárias?',
    options: [
      { id: 'a', score: 1, text: 'Meus objetivos intencionais e aquilo que realmente move meu projeto de vida.' },
      { id: 'b', score: 2, text: 'Um equilíbrio entre meus planos e as demandas operacionais do contexto.' },
      { id: 'c', score: 3, text: 'As urgências e solicitações das outras pessoas que chegam a todo momento.' },
      { id: 'd', score: 4, text: 'Sensação de estar sempre apagando incêndios, sem tempo algum para o que é meu.' }
    ]
  },

  // --- DIMENSÃO 3: DINÂMICA DE RELACIONAMENTOS E COMUNICAÇÃO (P9 a P12) ---
  {
    id: 9,
    dimension: 'relacionamentos_comunicacao',
    text: 'Quando surge um desacordo ou conflito iminente em uma relação pessoal ou profissional:',
    options: [
      { id: 'a', score: 1, text: 'Trato a questão com clareza, firmeza e respeito, buscando alinhar as expectativas.' },
      { id: 'b', score: 2, text: 'Espero a poeira baixar e converso abertamente sobre o ocorrido.' },
      { id: 'c', score: 3, text: 'Tendo a engolir o incômodo e me calar para manter a paz aparente.' },
      { id: 'd', score: 4, text: 'Fico na defensiva ou acumulo ressentimento até explodir de forma desproporcional.' }
    ]
  },
  {
    id: 10,
    dimension: 'relacionamentos_comunicacao',
    text: 'Em relação aos problemas e cargas emocionais das pessoas ao seu redor, qual é sua postura?',
    options: [
      { id: 'a', score: 1, text: 'Ofereço apoio e empatia sem tomar a responsabilidade delas para mim.' },
      { id: 'b', score: 2, text: 'Ajudo quando posso, preservando meu próprio equilíbrio.' },
      { id: 'c', score: 3, text: 'Frequentemente me vejo como o(a) "salvador(a)" responsável por resolver as dores dos outros.' },
      { id: 'd', score: 4, text: 'Absorvo a angústia dos outros como se fosse minha, sacrificando meu bem-estar sem perceber.' }
    ]
  },
  {
    id: 11,
    dimension: 'relacionamentos_comunicacao',
    text: 'Quando você precisa expressar um incômodo ou colocar um limite firme a alguém:',
    options: [
      { id: 'a', score: 1, text: 'Falo com tranquilidade, sem rodeios e sem agressividade.' },
      { id: 'b', score: 2, text: 'Penso bem nas palavras para não magoar, mas consigo passar a mensagem.' },
      { id: 'c', score: 3, text: 'Adio a conversa ao máximo e, quando falo, sinto que pedi desculpas por me posicionar.' },
      { id: 'd', score: 4, text: 'Não consigo falar diretamente; uso indiretas ou me afasto bruscamente da pessoa.' }
    ]
  },
  {
    id: 12,
    dimension: 'relacionamentos_comunicacao',
    text: 'Em seus vínculos mais próximos, o quanto você se permite demonstrar vulnerabilidade e pedir ajuda?',
    options: [
      { id: 'a', score: 1, text: 'Tenho total abertura para pedir suporte e mostrar minhas fragilidades.' },
      { id: 'b', score: 2, text: 'Peço ajuda apenas em casos extremos e a pouquíssimas pessoas selecionadas.' },
      { id: 'c', score: 3, text: 'Mantenho uma postura de que "está tudo sob controle", evitando parecer frágil.' },
      { id: 'd', score: 4, text: 'Nunca demonstro vulnerabilidade; sinto que se baixar a guarda serei julgado(a) ou explorado(a).' }
    ]
  },

  // --- DIMENSÃO 4: RELAÇÃO COM ERRO, EXIGÊNCIA E CONTROLE (P13 a P16) ---
  {
    id: 13,
    dimension: 'erro_controle',
    text: 'Qual é o nível de exigência e rigor que você aplica a si mesmo(a) em suas entregas?',
    options: [
      { id: 'a', score: 1, text: 'Busco excelência com flexibilidade, celebrando o progresso real sem perfeccionismo.' },
      { id: 'b', score: 2, text: 'Sou exigente, mas aceito que nem tudo sairá 100% perfeito.' },
      { id: 'c', score: 3, text: 'Tenho um padrão implacável; mesmo com ótimos resultados, só enxergo o detalhe que faltou.' },
      { id: 'd', score: 4, text: 'Uma cobrança interna sufocante que gera angústia, procrastinação e sensação constante de insuficiência.' }
    ]
  },
  {
    id: 14,
    dimension: 'erro_controle',
    text: 'Quando algo totalmente fora do seu controle altera seus planos minuciosos:',
    options: [
      { id: 'a', score: 1, text: 'Adapto-me com agilidade e fluidez às novas circunstâncias.' },
      { id: 'b', score: 2, text: 'Fico desconfortável no início, mas reorganizo a rota sem grande desgaste.' },
      { id: 'c', score: 3, text: 'Sinto uma forte irritação e fico remoendo a quebra do que estava previsto.' },
      { id: 'd', score: 4, text: 'Sinto uma crise de ansiedade e perda de chão, com imensa dificuldade de aceitar a realidade.' }
    ]
  },
  {
    id: 15,
    dimension: 'erro_controle',
    text: 'Delegar responsabilidades ou deixar processos sob a tutela de outros significa para você:',
    options: [
      { id: 'a', score: 1, text: 'Uma prática indispensável e saudável de liderança e colaboração.' },
      { id: 'b', score: 2, text: 'Consigo delegar, acompanhando os pontos-chave de entrega.' },
      { id: 'c', score: 3, text: 'Um teste de paciência; acho sempre que faria mais rápido e melhor sozinho(a).' },
      { id: 'd', score: 4, text: 'Algo intolerável; centralizo tudo em mim para garantir que nada saia do padrão esperado.' }
    ]
  },
  {
    id: 16,
    dimension: 'erro_controle',
    text: 'Ao perceber uma falha cometida por um colega, parceiro ou colaborador:',
    options: [
      { id: 'a', score: 1, text: 'Foco na solução conjunta e na capacitação da pessoa.' },
      { id: 'b', score: 2, text: 'Aponto o erro de maneira construtiva e solicito o ajuste.' },
      { id: 'c', score: 3, text: 'Sinto profunda impaciência interna, embora tente disfarçar.' },
      { id: 'd', score: 4, text: 'Assumo o trabalho da pessoa imediatamente com descontentamento evidente.' }
    ]
  },

  // --- DIMENSÃO 5: ALINHAMENTO DE PROPÓSITO E RUMO DE VIDA (P17 a P20) ---
  {
    id: 17,
    dimension: 'proposito_futuro',
    text: 'Ao olhar com sinceridade para o momento atual da sua vida pessoal e profissional, o sentimento predominante é de:',
    options: [
      { id: 'a', score: 1, text: 'Coerência, significado e alinhamento genuíno com o que valorizo.' },
      { id: 'b', score: 2, text: 'Estabilidade razoável, embora saiba que posso expandir e ajustar alguns pontos.' },
      { id: 'c', score: 3, text: 'Desconexão silenciosa; realizo minhas tarefas, mas sinto um vazio de sentido no final do dia.' },
      { id: 'd', score: 4, text: 'Profunda sensação de estar vivendo a vida de outra pessoa ou correndo em uma esteira sem fim.' }
    ]
  },
  {
    id: 18,
    dimension: 'proposito_futuro',
    text: 'Os projetos pessoais, aspirações autênticas e sonhos de longo prazo costumam ficar em que posição na sua vida?',
    options: [
      { id: 'a', score: 1, text: 'Têm espaço protegido e investimento constante na minha rotina.' },
      { id: 'b', score: 2, text: 'Avançam em ritmo mais lento do que gostaria, mas não foram esquecidos.' },
      { id: 'c', score: 3, text: 'São constantemente adiados para "quando sobrar tempo" ou "quando a fase conturbada passar".' },
      { id: 'd', score: 4, text: 'Foram engavetados há anos em troca de obrigações diárias e sobrevivência imediata.' }
    ]
  },
  {
    id: 19,
    dimension: 'proposito_futuro',
    text: 'Quando você vislumbra fazer uma mudança estrutural de rota (carreira, estilo de vida, projetos):'
    ,
    options: [
      { id: 'a', score: 1, text: 'Estruturo planos consistentes e ajo com coragem prudente.' },
      { id: 'b', score: 2, text: 'Tenho receios naturais, mas me movimento quando a necessidade se impõe.' },
      { id: 'c', score: 3, text: 'O medo do desconhecido e o apego à segurança me mantêm estagnado(a) por muito tempo.' },
      { id: 'd', score: 4, text: 'Sinto que estou preso(a) às amarras atuais e não tenho condições de mudar de rumo.' }
    ]
  },
  {
    id: 20,
    dimension: 'proposito_futuro',
    text: 'Hoje, o quanto suas escolhas cotidianas refletem seus valores essenciais mais profundos?',
    options: [
      { id: 'a', score: 1, text: 'Refletem com fidelidade; vivo com integridade às minhas prioridades.' },
      { id: 'b', score: 2, text: 'Na maioria dos dias consigo ser fiel, com pequenos desvios normais.' },
      { id: 'c', score: 3, text: 'Muitas vezes abro mão do que acredito para me adequar às expectativas ao meu redor.' },
      { id: 'd', score: 4, text: 'Sinto um abismo crônico entre quem eu gostaria de ser e a rotina que realmente vivo.' }
    ]
  }
];

/**
 * Motor Determinístico de Avaliação
 * Recebe as respostas do usuário { [questionId]: optionId (ou score) }
 * e gera a devolutiva personalizada completa conforme especificação V1.1.
 */
export function evaluateQuiz(answers) {
  // Inicialização de escores por dimensão
  const dimStats = {
    energia_limites: { raw: 0, count: 0 },
    decisao_autonomia: { raw: 0, count: 0 },
    relacionamentos_comunicacao: { raw: 0, count: 0 },
    erro_controle: { raw: 0, count: 0 },
    proposito_futuro: { raw: 0, count: 0 }
  };

  const detailedAnswers = [];

  for (const q of QUESTIONS) {
    const userVal = answers[q.id] || answers[String(q.id)];
    let selectedOption = null;

    if (userVal) {
      if (typeof userVal === 'string' && ['a', 'b', 'c', 'd'].includes(userVal.toLowerCase())) {
        selectedOption = q.options.find(o => o.id === userVal.toLowerCase());
      } else if (typeof userVal === 'number') {
        selectedOption = q.options.find(o => o.score === userVal);
      }
    }

    // Default caso não respondida (score médio = 2)
    if (!selectedOption) {
      selectedOption = q.options[1];
    }

    dimStats[q.dimension].raw += selectedOption.score;
    dimStats[q.dimension].count += 1;

    detailedAnswers.push({
      questionId: q.id,
      dimension: q.dimension,
      selectedOptionId: selectedOption.id,
      score: selectedOption.score,
      text: selectedOption.text
    });
  }

  // Normalização percentual dos escores (4 min -> 0%, 16 max -> 100% de tensão/padrão reativo)
  const dimensionsSummary = {};
  let totalTensionScore = 0;

  for (const [dimKey, stat] of Object.entries(dimStats)) {
    const min = stat.count * 1;
    const max = stat.count * 4;
    const percentage = Math.round(((stat.raw - min) / (max - min)) * 100);
    totalTensionScore += percentage;

    let level = 'Equilibrado';
    if (percentage >= 70) level = 'Tensão Elevada';
    else if (percentage >= 45) level = 'Tensão Moderada';
    else level = 'Harmonia Funcional';

    dimensionsSummary[dimKey] = {
      id: dimKey,
      title: DIMENSIONS[dimKey].title,
      short: DIMENSIONS[dimKey].short,
      description: DIMENSIONS[dimKey].description,
      rawScore: stat.raw,
      percentage,
      level
    };
  }

  const globalIndex = Math.round(totalTensionScore / 5);

  // Ordenação das dimensões pela intensidade de tensão
  const sortedDims = Object.values(dimensionsSummary).sort((a, b) => b.percentage - a.percentage);
  const dominantDim = sortedDims[0];
  const secondaryDim = sortedDims[1];

  // 1. Temas e comportamentos identificados
  const themes = generateIdentifiedThemes(dominantDim, secondaryDim, sortedDims);

  // 2. Possíveis conexões comportamentais
  const connections = generateBehavioralConnections(dominantDim, secondaryDim);

  // 3. Recursos pessoais relatados
  const resources = generatePersonalResources(sortedDims, detailedAnswers);

  // 4. Perguntas para reflexão
  const reflectionQuestions = generateReflectionQuestions(dominantDim, secondaryDim);

  return {
    map: {
      globalIndex,
      dominantDimension: dominantDim.id,
      dominantTitle: dominantDim.title,
      secondaryDimension: secondaryDim.id,
      secondaryTitle: secondaryDim.title,
      dimensions: dimensionsSummary,
      sortedDimensions: sortedDims
    },
    themes,
    connections,
    resources,
    reflectionQuestions,
    detailedAnswers
  };
}

// Gerador determinístico de temas comportamentais
function generateIdentifiedThemes(dom, sec, allDims) {
  const mapThemes = {
    energia_limites: [
      {
        title: 'Hiper-comprometimento e Dificuldade de Fronteiras',
        description: 'Seus relatos revelam uma tendência consistente de colocar as demandas do ambiente à frente das suas necessidades básicas de recuperação, gerando um custo biológico e mental cumulativo.'
      },
      {
        title: 'Vulnerabilidade à Sobrecarga Reativa',
        description: 'Dizer "não" é frequentemente interpretado como risco de desapontar pessoas ou romper expectativas, tornando sua agenda permeável às urgências alheias.'
      }
    ],
    decisao_autonomia: [
      {
        title: 'Paralisia por Hiper-análise ou Busca de Validação',
        description: 'Diante de encruzilhadas ou escolhas de vida, há um dispêndio excessivo de energia buscando antecipar todos os riscos ou dependendo da concordância externa para avançar.'
      },
      {
        title: 'Diálogo Crítico Pós-Decisão',
        description: 'Tendência a remoer escolhas passadas quando os desdobramentos saem do planejado, associando frustrações circunstanciais a falhas pessoais de discernimento.'
      }
    ],
    relacionamentos_comunicacao: [
      {
        title: 'Guarda Alta e Centralização de Cargas Emocionais',
        description: 'Forte propensão a assumir a resolução do mal-estar alheio, acompanhada de grande resistência em demonstrar as próprias fragilidades ou pedir apoio genuíno.'
      },
      {
        title: 'Paz Aparente em Detrimento da Expressão Genuína',
        description: 'Contenção de incômodos para evitar atritos imediatos, o que a médio prazo acumula ruídos relacionais e sensação de isolamento.'
      }
    ],
    erro_controle: [
      {
        title: 'Régua de Autoexigência Inflexível',
        description: 'O sarrafo interno para a sua própria entrega está em um nível de perfeição que raramente permite saborear conquistas reais, gerando autocrítica corrosiva.'
      },
      {
        title: 'Dificuldade Estrutural de Delegação e Confiança',
        description: 'Desejo de controlar minuciosamente variáveis para prevenir falhas, tornando o ato de delegar desgastante e gerando gargalos na sua produtividade.'
      }
    ],
    proposito_futuro: [
      {
        title: 'Dissonância entre Rotina e Valores Fundamentais',
        description: 'Existe uma distância perceptível entre aquilo que realmente dá sentido à sua existência e as ações cotidianas que preenchem seus dias.'
      },
      {
        title: 'Engavetamento Recorrente de Projetos de Vida',
        description: 'Aspirações autênticas são sistematicamente empurradas para um futuro indefinido ("quando tudo acalmar"), enquanto o presente é ocupado por pura manutenção operacional.'
      }
    ]
  };

  const list = [...(mapThemes[dom.id] || [])];
  if (sec && mapThemes[sec.id]) {
    list.push(mapThemes[sec.id][0]);
  }
  return list;
}

// Gerador determinístico de conexões comportamentais causais
function generateBehavioralConnections(dom, sec) {
  const connections = [];

  const crossMap = {
    'energia_limites-erro_controle': 'A sua necessidade de controle e alta exigência (Dimensão de Controle) impede que você delegue tarefas com tranquilidade, o que diretamente retroalimenta sua sobrecarga de agenda e drena seus limites energéticos.',
    'erro_controle-energia_limites': 'O perfeccionismo severo com os seus próprios resultados impede que você encerre o expediente mentalmente, mantendo seu sistema em vigília e esgotando sua reserva vital.',
    'energia_limites-relacionamentos_comunicacao': 'A dificuldade de dizer "não" para pedidos e o receio de impor fronteiras firmes nas relações faz com que você absorva responsabilidades que não são suas, sacrificando seu próprio descanso.',
    'relacionamentos_comunicacao-energia_limites': 'Ao tentar proteger o bem-estar e as expectativas das pessoas próximas, sua energia pessoal é constantemente drenada antes mesmo de você atender às suas prioridades.',
    'decisao_autonomia-proposito_futuro': 'A dependência de validação externa e o medo de errar ao decidir mantém você postergando movimentos estruturais de carreira ou vida que trariam verdadeiro alinhamento de propósito.',
    'proposito_futuro-decisao_autonomia': 'A ausência de um norte claro e intencional para o seu futuro faz com que qualquer demanda externa pareça urgente, retirando a autonomia da sua tomada de decisão diária.',
    'erro_controle-decisao_autonomia': 'A aversão ao erro gera paralisia analítica nas decisões: você adia a escolha esperando ter certeza absoluta de um cenário que é inerentemente incerto.',
    'relacionamentos_comunicacao-erro_controle': 'O medo de falhar ou decepcionar os outros faz com que você queira controlar como as pessoas enxergam suas entregas, gerando isolamento e recusa em aceitar apoio.'
  };

  const key1 = `${dom.id}-${sec.id}`;
  const key2 = `${sec.id}-${dom.id}`;

  if (crossMap[key1]) {
    connections.push({
      dimensions: [dom.short, sec.short],
      insight: crossMap[key1]
    });
  } else if (crossMap[key2]) {
    connections.push({
      dimensions: [sec.short, dom.short],
      insight: crossMap[key2]
    });
  } else {
    connections.push({
      dimensions: [dom.short, sec.short],
      insight: `O padrão observado em ${dom.title} intensifica as tensões em ${sec.title}: quando o sistema não encontra espaço para sustentação em uma área, a outra é sobrecarregada como mecanismo de compensação automática.`
    });
  }

  connections.push({
    dimensions: ['Padrão Sistêmico Geral', dom.short],
    insight: `Esses padrões não são falhas morais ou de caráter; são estratégias adaptativas inteligentes que você desenvolveu ao longo da sua história para sobreviver a ambientes exigentes, mas que hoje podem estar custando caro demais.`
  });

  return connections;
}

// Gerador determinístico de recursos pessoais identificados
function generatePersonalResources(sortedDims, answers) {
  const resources = [
    {
      title: 'Capacidade de Sustentação e Entrega',
      description: 'Você demonstra um compromisso notável com as suas obrigações e uma disposição de manter o rumo mesmo em condições adversas.'
    },
    {
      title: 'Cuidado e Lealdade com o Coletivo',
      description: 'Há uma consideração profunda pelo impacto das suas atitudes no entorno e um respeito genuíno pelos acordos estabelecidos.'
    },
    {
      title: 'Rigor e Busca por Relevância',
      description: 'Uma recusa natural à mediocridade, acompanhada de um desejo intrínseco de produzir contribuições de valor consistente.'
    }
  ];

  // Adiciona recurso específico da dimensão mais saudável (menor pontuação)
  const healthiest = sortedDims[sortedDims.length - 1];
  if (healthiest && healthiest.percentage < 45) {
    resources.push({
      title: `Ponto de Ancoragem: ${healthiest.short}`,
      description: `Sua área de maior equilíbrio funcional é ${healthiest.title}, representando uma fortaleza onde você já possui clareza e que pode servir de base de segurança para transformar as demais dimensões.`
    });
  }

  return resources;
}

// Gerador determinístico de perguntas para reflexão profunda
function generateReflectionQuestions(dom, sec) {
  const mapReflections = {
    energia_limites: [
      'Se você continuasse mantendo exatamente o mesmo ritmo de entrega e concessões nos próximos dois anos, onde seu corpo e sua mente chegariam?',
      'Qual é o custo silencioso que você tem pago por adiar a imposição de limites claros?'
    ],
    decisao_autonomia: [
      'Se você não precisasse da aprovação ou validação de absolutamente ninguém, qual decisão que já está madura você tomaria hoje?',
      'O que de pior você teme que aconteça se você fizer uma escolha que desaponte alguém, mas que seja fiel a você?'
    ],
    relacionamentos_comunicacao: [
      'Que incômodo recorrente você tem engolido em silêncio para manter uma harmonia que é apenas superficial?',
      'O que você teme que aconteça se permitir que as pessoas próximas vejam que você também não tem todas as respostas?'
    ],
    erro_controle: [
      'Quem você seria e com que leveza viveria se abrisse mão de conferir e controlar cada detalhe do que acontece ao seu redor?',
      'A quem você ainda está tentando provar seu valor por meio da perfeição inabalável?'
    ],
    proposito_futuro: [
      'Qual projeto, desejo ou mudança de rota você vem tratando como "um dia quem sabe", enquanto sua vida real vai passando?',
      'O que hoje na sua rotina já perdeu o sentido há tempos, mas você continua sustentando por pura inércia?'
    ]
  };

  const list = [...(mapReflections[dom.id] || [])];
  if (sec && mapReflections[sec.id]) {
    list.push(mapReflections[sec.id][0]);
  }
  return list;
}
