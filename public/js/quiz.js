// Northorya — Mapa dos Seus Padrões V1.1
// Script de Controle do Quiz e Registro de Estados

(function() {
  'use strict';

  // Captura da Origem (Instagram, WhatsApp, etc.)
  const urlParams = new URLSearchParams(window.location.search);
  const origin = urlParams.get('origem') || urlParams.get('origin') || urlParams.get('utm_source') || 'direto';

  // Estado do Aplicativo
  let questions = [];
  let dimensions = {};
  let currentIndex = 0;
  const answers = {};
  let leadId = localStorage.getItem('northorya_lead_id') || null;

  // Elementos do DOM
  const screenIntro = document.getElementById('screen-intro');
  const screenQuiz = document.getElementById('screen-quiz');
  const screenIdentification = document.getElementById('screen-identification');
  const screenLoading = document.getElementById('screen-loading');

  const btnStart = document.getElementById('btn-start');
  const btnPrev = document.getElementById('btn-prev');
  const btnSubmit = document.getElementById('btn-submit');

  const questionCounter = document.getElementById('question-counter');
  const dimensionLabel = document.getElementById('dimension-label');
  const progressBar = document.getElementById('progress-bar');
  const currentDimTag = document.getElementById('current-dim-tag');
  const questionText = document.getElementById('question-text');
  const optionsContainer = document.getElementById('options-container');

  const inputName = document.getElementById('input-name');
  const inputWhatsapp = document.getElementById('input-whatsapp');

  // Inicialização
  async function init() {
    try {
      const res = await fetch('/api/quiz/questions');
      const data = await res.json();
      questions = data.questions;
      dimensions = data.dimensions;
    } catch (e) {
      console.error('Erro ao carregar perguntas:', e);
    }

    // Se já havia resultado prévio salvo, verifica se o usuário quer ver
    const cachedLeadId = localStorage.getItem('northorya_lead_id');
    const cachedDevolutiva = localStorage.getItem('northorya_devolutiva');
    if (cachedLeadId && cachedDevolutiva && !urlParams.get('refazer')) {
      // Cria um link discreto para revisitar o resultado
      const revisitBox = document.createElement('div');
      revisitBox.style.cssText = 'margin-top: 14px; text-align: center; font-size: 0.88rem;';
      revisitBox.innerHTML = `<a href="/resultado.html?leadId=${encodeURIComponent(cachedLeadId)}" style="color: var(--petroleo); text-decoration: underline;">Você já concluiu o mapeamento anteriormente. Clique aqui para ver seu resultado.</a>`;
      screenIntro.appendChild(revisitBox);
    }
  }

  // Iniciar o Quiz
  btnStart.addEventListener('click', async () => {
    btnStart.disabled = true;
    btnStart.innerText = 'Iniciando...';

    try {
      const res = await fetch('/api/quiz/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ origin })
      });
      const data = await res.json();
      if (data.leadId) {
        leadId = data.leadId;
        localStorage.setItem('northorya_lead_id', leadId);
      }
    } catch (e) {
      console.warn('Iniciando em modo offline/local:', e.message);
    }

    screenIntro.style.display = 'none';
    screenQuiz.style.display = 'block';
    renderQuestion(0);
  });

  // Renderiza a pergunta atual
  function renderQuestion(index) {
    if (index < 0 || index >= questions.length) return;
    currentIndex = index;

    const q = questions[index];
    const dim = dimensions[q.dimension] || { title: 'Dimensão Comportamental' };

    questionCounter.innerText = `Pergunta ${index + 1} de ${questions.length}`;
    dimensionLabel.innerText = dim.title;
    currentDimTag.innerText = `Dimensão: ${dim.title}`;
    questionText.innerText = q.text;

    const progressPct = Math.round(((index + 1) / questions.length) * 100);
    progressBar.style.width = `${progressPct}%`;

    // Botão Voltar
    btnPrev.style.visibility = index > 0 ? 'visible' : 'hidden';

    // Opções
    optionsContainer.innerHTML = '';
    const letters = ['A', 'B', 'C', 'D'];

    q.options.forEach((opt, optIndex) => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      if (answers[q.id] === opt.id) {
        btn.classList.add('selected');
      }

      btn.innerHTML = `
        <span class="option-key">${letters[optIndex]}</span>
        <span>${opt.text}</span>
      `;

      btn.addEventListener('click', () => {
        selectOption(q.id, opt.id);
      });

      optionsContainer.appendChild(btn);
    });

    // Rolagem suave até o topo do card
    screenQuiz.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // Selecionar Opção e Avançar
  function selectOption(questionId, optionId) {
    answers[questionId] = optionId;

    if (currentIndex + 1 < questions.length) {
      // Pequeno delay visual para feedback do clique
      setTimeout(() => {
        renderQuestion(currentIndex + 1);
      }, 180);
    } else {
      // Concluiu as 20 perguntas -> Tela de Identificação Opcional
      setTimeout(() => {
        screenQuiz.style.display = 'none';
        screenIdentification.style.display = 'block';
        screenIdentification.scrollIntoView({ behavior: 'smooth' });
      }, 200);
    }
  }

  // Voltar para pergunta anterior
  btnPrev.addEventListener('click', () => {
    if (currentIndex > 0) {
      renderQuestion(currentIndex - 1);
    }
  });

  // Atalhos de teclado (1, 2, 3, 4 ou A, B, C, D)
  window.addEventListener('keydown', (e) => {
    if (screenQuiz.style.display !== 'block') return;
    const key = e.key.toLowerCase();
    const map = { '1': 'a', '2': 'b', '3': 'c', '4': 'd', 'a': 'a', 'b': 'b', 'c': 'c', 'd': 'd' };
    if (map[key] && questions[currentIndex]) {
      const q = questions[currentIndex];
      const opt = q.options.find(o => o.id === map[key]);
      if (opt) {
        selectOption(q.id, opt.id);
      }
    }
  });

  // Submissão Final do Quiz
  btnSubmit.addEventListener('click', async () => {
    btnSubmit.disabled = true;
    btnSubmit.innerText = 'Processando Devolutiva...';

    screenIdentification.style.display = 'none';
    screenLoading.style.display = 'block';

    const payload = {
      leadId,
      name: inputName.value.trim() || null,
      whatsapp: inputWhatsapp.value.trim() || null,
      origin,
      answers,
      lgpdConsent: true
    };

    try {
      const res = await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.leadId && data.devolutiva) {
        localStorage.setItem('northorya_lead_id', data.leadId);
        localStorage.setItem('northorya_devolutiva', JSON.stringify(data.devolutiva));
        if (payload.name) localStorage.setItem('northorya_user_name', payload.name);

        window.location.href = `/resultado.html?leadId=${encodeURIComponent(data.leadId)}`;
        return;
      }
    } catch (e) {
      console.error('Erro na submissão:', e);
      alert('Houve um erro ao processar seu resultado. Tentando novamente...');
      screenLoading.style.display = 'none';
      screenIdentification.style.display = 'block';
      btnSubmit.disabled = false;
      btnSubmit.innerText = 'Visualizar Meu Mapa de Padrões';
    }
  });

  init();
})();
