# Northorya — Mapa dos Seus Padrões
## Atualização Oficial V1.1 — Agendamento Google Calendar

Aplicativo independente para realização de diagnóstico comportamental com devolutiva determinística individual e convite estruturado para aprofundamento via **Google Calendar** com Edson Batista.

---

### 1. Visão Geral e Fluxo

```
[ Visitante acessa o Quiz via link (Instagram / WhatsApp) ]
                          ↓
[ Responde 20 perguntas calibradas nas 5 dimensões ]
                          ↓
[ Preenchimento opcional de Nome e WhatsApp (LGPD) ]
                          ↓
[ Devolutiva Determinística Imediata ]
    1. Mapa de Padrões Individual (Gráfico das 5 dimensões e Índice Global)
    2. Temas e comportamentos identificados
    3. Possíveis conexões comportamentais
    4. Recursos pessoais relatados
    5. Perguntas para reflexão
    6. Convite para aprofundamento com Edson Batista (30 min Google Meet)
                          ↓
[ Botão Principal: "Escolher meu dia e horário" ]
    • Registra intenção: 'link_agendamento_acessado'
    • Abre a página oficial do Google Calendar em nova aba
                          ↓
[ Painel Administrativo & CRM ]
    • Gestão de Leads, Origens, Estados e Anotações
    • Configuração dinâmica da URL de agendamento sem alterar o código
```

---

### 2. Configurações de Ambiente

No arquivo `.env.example` e `.env`:

```env
# Link oficial da página de agendamento de Edson Batista
GOOGLE_CALENDAR_BOOKING_URL=https://calendar.app.google/fLHxUx7qa3H547bv7

# Porta do Servidor Web
PORT=3000

# Senha de Acesso ao Painel Administrativo / CRM
ADMIN_PASSWORD=northorya-admin-2026
```

---

### 3. Como Executar a Aplicação

A aplicação utiliza arquitetura nativa com Node.js e banco SQLite embutido, sem dependências externas pesadas:

```powershell
# Iniciar o servidor
agy-node src/server.js

# Executar a suíte de testes automatizados
agy-node tests/run-tests.js
```

Após iniciar, acesse no navegador:
* **Quiz do Participante:** `http://localhost:3000`
  * Link para campanha no Instagram: `http://localhost:3000/?origem=instagram`
  * Link para lista no WhatsApp: `http://localhost:3000/?origem=whatsapp`
* **Painel Administrativo / CRM:** `http://localhost:3000/admin` (Senha padrão: `northorya-admin-2026`)

---

### 4. As 5 Dimensões de Análise e as 20 Perguntas

1. **Gestão de Energia e Limites (P1 a P4):** Ritmo de trabalho, imposição de limites, postura diante da exaustão e capacidade de pausa consciente.
2. **Tomada de Decisão e Autonomia (P5 a P8):** Paralisia por análise, dependência da aprovação de terceiros e firmeza de autonomia.
3. **Dinâmica de Relacionamentos e Comunicação (P9 a P12):** Manejo de atritos, clareza no posicionamento, assunção de dores alheias e vulnerabilidade.
4. **Relação com Erro, Exigência e Controle (P13 a P16):** Perfeccionismo, rigidez com imprevistos, facilidade ou bloqueio em delegar.
5. **Alinhamento de Propósito e Rumo de Vida (P17 a P20):** Coerência entre rotina e valores essenciais, priorização de projetos autênticos e transições de rota.

---

### 5. Regras Técnicas Cumpridas (V1.1)

- [x] Abre a página oficial do Google Calendar (`https://calendar.app.google/fLHxUx7qa3H547bv7`).
- [x] Não cria calendário paralelo ou horários fictícios.
- [x] Não envia respostas comportamentais na URL (respeito estrito à privacidade).
- [x] Não exige WhatsApp para abrir o agendamento (dados são 100% opcionais).
- [x] O clique no botão registra apenas a intenção (`link_agendamento_acessado`), sem declarar reserva confirmada automaticamente.
- [x] O administrador pode alterar o link de agendamento a qualquer momento diretamente no Painel Administrativo.
- [x] O resultado continua salvo e disponível se a pessoa fechar e reabrir o navegador.
- [x] Experiência 100% responsiva para celulares e computadores.
- [x] Infraestrutura independente do Forms Studio e da Horya.

---

### 6. Estados do Funil (CRM)

1. `quiz_iniciado` — Participante abriu o teste e iniciou as respostas.
2. `quiz_concluido` — 20 perguntas finalizadas e devolutiva gerada.
3. `interesse_sessao` — Demonstrou intenção de prosseguir.
4. `link_agendamento_acessado` — Clicou em "Escolher meu dia e horário".
5. `sessao_confirmada_manual` — Administrador confirmou a reunião na agenda do Google.
6. `sessao_realizada` — Sessão de 30 minutos realizada com sucesso.
7. `acompanhamento_iniciado` — Lead entrou em acompanhamento ou mentoria Northorya.
