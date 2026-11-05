// Northorya — Mapa dos Seus Padrões V1.1
// Script de Renderização da Devolutiva e Integração Google Calendar

(function() {
  'use strict';

  const urlParams = new URLSearchParams(window.location.search);
  const leadId = urlParams.get('leadId') || localStorage.getItem('northorya_lead_id');

  // Elementos do DOM
  const userGreeting = document.getElementById('user-greeting');
  const dominantSummaryTitle = document.getElementById('dominant-summary-title');
  const dominantSummaryLead = document.getElementById('dominant-summary-lead');
  const dimensionsContainer = document.getElementById('dimensions-container');
  const themesContainer = document.getElementById('themes-container');
  const connectionsContainer = document.getElementById('connections-container');
  const resourcesContainer = document.getElementById('resources-container');
  const reflectionsContainer = document.getElementById('reflections-container');

  const btnOpenCalendar = document.getElementById('btn-open-calendar');
  const btnFinish = document.getElementById('btn-finish');
  const intentFeedback = document.getElementById('intent-feedback');
  const modalFinished = document.getElementById('modal-finished');

  let officialBookingUrl = 'https://calendar.app.google/fLHxUx7qa3H547bv7';

  async function loadData() {
    // 1. Carrega configuração da URL oficial de agendamento via API
    try {
      const configRes = await fetch('/api/config');
      const configData = await configRes.json();
      if (configData.googleCalendarBookingUrl) {
        officialBookingUrl = configData.googleCalendarBookingUrl;
      }
    } catch (e) {
      console.warn('Usando URL de agendamento padrão:', e);
    }

    // 2. Carrega os dados do resultado (do backend ou cache local)
    let devolutiva = null;
    let userName = localStorage.getItem('northorya_user_name') || null;

    if (leadId) {
      try {
        const res = await fetch(`/api/quiz/result/${encodeURIComponent(leadId)}`);
        if (res.ok) {
          const data = await res.json();
          devolutiva = data.devolutiva;
          if (data.name) userName = data.name;
        }
      } catch (e) {
        console.warn('Falha na busca remota do resultado, testando cache local...');
      }
    }

    // Fallback para cache local se a API não respondeu
    if (!devolutiva) {
      const cached = localStorage.getItem('northorya_devolutiva');
      if (cached) {
        devolutiva = JSON.parse(cached);
      }
    }

    if (!devolutiva) {
      alert('Não encontramos um resultado registrado. Redirecionando para o início do mapeamento.');
      window.location.href = '/';
      return;
    }

    renderDevolutiva(devolutiva, userName);
  }

  function renderDevolutiva(data, name) {
    const { map, themes, connections, resources, reflectionQuestions } = data;

    // Saudação personalizada se houver nome
    if (name) {
      userGreeting.innerText = `Diagnóstico Comportamental de ${name}`;
    }

    // Título de Destaque
    dominantSummaryTitle.innerText = `Padrão Predominante: ${map.dominantTitle}`;
    dominantSummaryLead.innerText = `Seu mapa registrou um Índice Global de Tensão de ${map.globalIndex}%. A dimensão com maior ativação automática é "${map.dominantTitle}", seguida por "${map.secondaryTitle}".`;

    // 1. Gráfico das 5 Dimensões
    dimensionsContainer.innerHTML = '';
    const dimsArray = map.sortedDimensions || Object.values(map.dimensions);

    dimsArray.forEach(dim => {
      let colorClass = 'medium';
      if (dim.percentage >= 65) colorClass = 'high';
      else if (dim.percentage < 40) colorClass = 'low';

      const barCard = document.createElement('div');
      barCard.className = 'dim-bar-card';
      barCard.innerHTML = `
        <div class="dim-bar-header">
          <span class="dim-bar-title">${dim.title}</span>
          <span class="dim-bar-score">${dim.percentage}% • ${dim.level}</span>
        </div>
        <div class="dim-bar-track">
          <div class="dim-bar-fill ${colorClass}" style="width: 0%;"></div>
        </div>
        <p class="dim-bar-desc">${dim.description}</p>
      `;
      dimensionsContainer.appendChild(barCard);

      // Animação da barra de progresso
      setTimeout(() => {
        const fill = barCard.querySelector('.dim-bar-fill');
        if (fill) fill.style.width = `${dim.percentage}%`;
      }, 100);
    });

    // 2. Temas Identificados
    themesContainer.innerHTML = '';
    (themes || []).forEach(t => {
      const card = document.createElement('div');
      card.className = 'item-card terracota';
      card.innerHTML = `
        <div class="item-title">${t.title}</div>
        <div class="item-body">${t.description}</div>
      `;
      themesContainer.appendChild(card);
    });

    // 3. Conexões Comportamentais
    connectionsContainer.innerHTML = '';
    (connections || []).forEach(c => {
      const card = document.createElement('div');
      card.className = 'item-card petroleo';
      card.innerHTML = `
        <div class="item-title">Interação entre: ${c.dimensions.join(' ↔ ')}</div>
        <div class="item-body">${c.insight}</div>
      `;
      connectionsContainer.appendChild(card);
    });

    // 4. Recursos Pessoais
    resourcesContainer.innerHTML = '';
    (resources || []).forEach(r => {
      const card = document.createElement('div');
      card.className = 'item-card';
      card.innerHTML = `
        <div class="item-title">✦ ${r.title}</div>
        <div class="item-body">${r.description}</div>
      `;
      resourcesContainer.appendChild(card);
    });

    // 5. Perguntas para Reflexão
    reflectionsContainer.innerHTML = '';
    (reflectionQuestions || []).forEach((q, idx) => {
      const card = document.createElement('div');
      card.className = 'item-card';
      card.style.borderLeftColor = 'var(--petroleo)';
      card.innerHTML = `
        <div class="item-title">Reflexão #${idx + 1}</div>
        <div class="item-body" style="font-style: italic; font-size: 1rem;">"${q}"</div>
      `;
      reflectionsContainer.appendChild(card);
    });
  }

  // Ação Principal: Clicar em "Escolher meu dia e horário"
  // Regras Técnicas V1.1:
  // - Abrir link oficial do Google Calendar em nova aba
  // - Não enviar respostas na URL (privacidade)
  // - Não declarar reserva confirmada automaticamente (registra apenas 'link_agendamento_acessado')
  btnOpenCalendar.addEventListener('click', async () => {
    // 1. Registra a intenção de agendamento na API sem bloquear a navegação
    if (leadId) {
      try {
        fetch('/api/quiz/track-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            leadId,
            action: 'click_calendar_button'
          })
        }).catch(err => console.warn('Tracking de clique:', err));
      } catch (e) {
        // silencioso para não impactar a experiência
      }
    }

    // 2. Abre a página oficial do Google Calendar
    window.open(officialBookingUrl, '_blank', 'noopener,noreferrer');

    // 3. Exibe feedback de intenção registrada
    intentFeedback.style.display = 'block';
  });

  // Ação Secundária: Concluir por aqui
  btnFinish.addEventListener('click', () => {
    modalFinished.style.display = 'block';
    modalFinished.scrollIntoView({ behavior: 'smooth' });
  });

  loadData();
})();
