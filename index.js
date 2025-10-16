require("dotenv").config();
const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const VERIFY_TOKEN = "cher3374";

// --- helpers ---
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function sendText(to, text) {
  const url = `https://graph.facebook.com/v17.0/${process.env.PHONE_NUMBER_ID}/messages`;
  const body = {
    messaging_product: "whatsapp",
    to,
    type: "text",
    text: { body: text },
  };
  const headers = {
    Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
    "Content-Type": "application/json",
  };
  try {
    await axios.post(url, body, { headers });
  } catch (e) {
    console.error("Erro ao enviar:", e?.response?.data || e.message);
  }
}

// --- Mensagem de Saudação ---
const WELCOME_1 = "Olá 👋, eu sou o assistente virtual do RH.";
//----- Menu inicial ----------
const ROOT_MENU = [
  "O que você deseja fazer hoje?",
  "",
  "1️⃣ Informações sobre Ponto (Multi / My Ahgora)",
  "",
  "2️⃣ Folha & Benefícios (Meu RH)",
  "",
  "3️⃣ Dúvidas sobre holerite",
"",
  "4️⃣ Falar com atendente",
].join("\n");

// -------Menu 1 Informações sobre Ponto (Multi / My Ahgora)-------
const PONTO_MENU = [
  "Por favor, escolha uma opção:",
  "",
  "1️⃣ Registrar ponto",
"",
  "2️⃣ Consultar ponto",
"",
  "3️⃣ Solicitar abonamento de horas",
"",
  "4️⃣ Cancelar batida de ponto",
"",
  "5️⃣ Incluir batida de ponto",
"",
  "6️⃣ Falar com atendente",
 "",
  "7️⃣ Retornar ao menu inicial",
].join("\n");

// ----------- Menu 2 Folha & Benefícios (Meu RH / TOTVS) --------
const FOLHA_MENU = [
  "Por favor, escolha uma opção:",
  "",
  "1️⃣ Enviar atestado",
"",
  "2️⃣ Acessar histórico de pagamentos",
"",
  "3️⃣ Consultar histórico salarial",
"",
  "4️⃣ Solicitar/consultar férias",
"",
  "5️⃣ Consultar informe de rendimentos",
"",
  "6️⃣ Retornar ao menu inicial",
"",
  "7️⃣ Falar com atendente",
].join("\n");


//---------Sub Menus da opção 2 (Folha & Benefícios (Meu RH / TOTVS)) -----------------
const PASSO_ATESTADO = [
  "*Passo a passo para enviar atestado:*",
  "",
  "🔷 Abra o app ou portal Meu RH e faça login com seu usuário e senha.",
  "🔷 Acesse a aba *Atestado* na parte inferior da tela.",
  "🔷 Preencha as informações: solicitadas, que correspondem aos dados presentes no atestado médico, como o tipo de atestado e o motivo de afastamento (Atestado Médico Faltas Justificadas).",
  "🔷 Anexe o documento: Toque em *Anexar Arquivo* para anexar a foto do atestado ou um documento escaneado em formato PDF.",
  "🔷 Escreva uma justificativa explicativa sobre o atestado.",
  "🔷 Confirme o envio para que o processo seja concluído e o atestado encaminhado ao departamento de Recursos Humanos.",
  "",
   "*Acesse o vídeo com o tutorial:*",
  "⏯️ https://youtube.com/shorts/RL4oRAvbiOI",
].join("\n");

const PASSO_HIST_PAGAMENTOS = [
  "*Passo a passo para acessar histórico de pagamentos:*",
  "",
  "🔷 Abra: o aplicativo Meu RH e faça o login.",
  "🔷 Acesse a aba «Pagamentos» na parte inferior da tela.",
  "🔷 Selecione *Envelope de Pagamento*: A partir daí, selecione a opção *Envelope de Pagamento*.",
  "🔷 Escolha o período desejado: O seu envelope de pagamentos estará disponível para visualização e poderá baixar o documento em formato PDF.",
  "",
   "*Acesse o vídeo com o tutorial:*",
  "⏯️ https://youtube.com/shorts/EUcOXLcAAW8",
].join("\n");

const PASSO_HIST_SALARIAL = [
  "*Passo a passo para consultar o histórico salarial:*",
  "",
  "🔷 Abra o app ou portal Meu RH e faça login com seu usuário e senha.",
  "🔷 Acesse a aba *Pagamentos* na parte inferior da tela",
  "🔷 Acesse *Histórico Salarial*",
  "🔷 Ao acessar esta seção, o aplicativo deve exibir o seu histórico salarial desde a admissão, detalhando alterações salariais, como promoções e reajustes.",
  "",
  "*Obs:* Utilize Filtros (se necessário) para buscar por um período específico (início e fim) ou por um motivo de alteração específico.",
  "",
   "*Acesse o vídeo com o tutorial:*",
  "⏯️ https://youtube.com/shorts/tSYB3c9iS_I",
].join("\n");

const PASSO_FERIAS = [
  "*Passo a passo para solicitar/consultar férias*",
  "",
  "🔷 Abra o app ou portal Meu RH e faça login com seu usuário e senha.",
  "🔷 Acesse a aba *Férias* na parte inferior da tela.",
  "🔷 Nesta aba você irá visualizar :",
  "   ▫️Saldo de dias disponíveis: Mostra quantos dias de férias lhe restam.",
  "   ▫️Status da solicitação: Indica o estado atual de qualquer pedido de férias que tenha feito (por exemplo, se não foi solicitado, está em processamento ou foi aprovado).",
  "   ▫️Período aquisitivo: Informa o período de referência para as férias, como de 1 de janeiro a 31 de dezembro do ano anterior.",
  "   ▫️Histórico: Apresenta um registro com informações básicas das férias que já usufruiu no passado.",
  "",
   "*Acesse o vídeo com o tutorial:*",
  "⏯️ https://youtube.com/shorts/qBv-vQE3srI",
].join("\n");

const PASSO_INFORME = [
  "*Passo a passo para consultar informe de rendimentos*",
  "",
  "🔷 Abra o app ou portal Meu RH e faça login com seu usuário e senha.",
  "🔷 Acesse a aba *Pagamentos* na parte inferior da tela.",
  "🔷 Acesse *Informe de Rendimentos*",
  "🔷 Ao clicar nesta opção, você poderá consultar, baixar ou até mesmo compartilhar o seu informe de rendimentos diretamente pelo aplicativo.",
  "",
   "*Acesse o vídeo com o tutorial:*",
  "⏯️ https://youtube.com/shorts/d4JYoBy1qns",
].join("\n");

// -----------------------------------------------------

// Sai do estado Hanover caso o usuário volte a interagir

const ASK_BACK = "Deseja voltar ao Menu Inicial?\\nSim\\nNão";
const THANKS = "Atendimento encerrado. Obrigado por entrar em contato com o RH Kert! Se precisar de mais informações, é só mandar uma nova mensagem. 😉";

const ASK_HANDOVER = "Como posso te ajudar agora?\n\n1️⃣ Retornar ao Menu inicial\n2️⃣ Aguardar o atendimento humano";


// envia saudação + menu (com intervalo de 1s)
async function sendWelcomeAndMenu(to) {
  await sendText(to, WELCOME_1);
  await wait(1000);
  await sendText(to, ROOT_MENU);
}

// envia o menu principal (sem saudação)
async function sendRootMenu(to) {
  await sendText(to, ROOT_MENU);
}

// envia submenu do ponto
async function sendPontoMenu(to) {
  await sendText(to, PONTO_MENU);
}

//---------Sub Menus da opção 1 Informações sobre Ponto (Multi / My Ahgora)-------
const PASSO_REGISTRAR = [
  "*Passo a passo para bater o ponto:*",
  "",
  "🔷 No seu smartphone, abra a aplicativo Multi.",
  "🔷 Na tela inicial do aplicativo, procure pelo botão *REGISTRAR PONTO*,","que permite registrar o ponto.",
  "🔷 Coloque a senha do smartphone para realizar a batida do ponto",
  "🔷 Após a confirmação da sua batida, um comprovante de ponto poderá ser fornecido.",
  "Sincronização offline: Caso não haja conexão de internet, o aplicativo permitirá fazer o registro normalmente,",
  "e os dados serão enviados automaticamente para os servidores assim que o sinal for restabelecido.",
  "",
   "*Acesse o vídeo com o tutorial:*",
  "⏯️ https://youtube.com/shorts/CVFHhDx3K9k",
].join("\n");

const PASSO_ESPELHO = [
  "*Passo a passo para acessar o espelho de ponto:*",
  "",
  "🔷 Na tela de login do aplicativo, insira o código da empresa, sua matrícula e senha, e toque em *Entrar*.",
  "🔷 Após o login, você será direcionado para a tela inicial do aplicativo.",
  "🔷 Toque em *Acessar espelho detalhado* para ver as informações do ponto.",
  "🔷 Toque no botão *Trocar competência*, localizado na parte superior esquerda do aplicativo.",
  "🔷 Escolha o período: Selecione o ano e mês do qual deseja visualizar o espelho de ponto e toque em *Ok*.",
  "",
   "*Acesse o vídeo com o tutorial:*",
  "⏯️ https://youtube.com/shorts/ZVTW7ijmqy8",
].join("\n");

const PASSO_ABONO = [
  "*Passo a passo para solicitar um abono:*",
  "",
  "🔷 Abra o aplicativo My Ahgora em seu smartphone.",
  "🔷 Na página inicial toque em *Solicitar abono*.",
  "🔷 Preencha os dados do abono:",
  "   ▫️ Selecione o Motivo do abono",
  "   ▫️ Selecione o período",
  "🔷 Digite uma mensagem para o seu gestor ou RH no campo Mensagem justificando o abonamento.",
  "🔷 Toque em *Adicionar anexo* para selecionar e anexar o arquivo da sua justificativa (como um atestado médico).",
  "🔷 Toque em *Enviar Solicitação de abono* para que o pedido seja encaminhado ao gestor para aprovação.",
  "",
   "*Acesse o vídeo com o tutorial:*",
  "⏯️ https://youtube.com/shorts/wdHo_ZivPbM",
].join("\n");

const PASSO_CANCELAR_BATIDA = [
  "*Passo a passo para solicitar o cancelamento de uma batida de ponto*",
  "",
  "⚠️ O Cancelamento da batida só pode ser realizado no mesmo  dia da marcação",
  "",
  "🔷 Acesse o aplicativo: Abra o aplicativo My Ahgora em seu smartphone.",
  "🔷 Inicie a solicitação: Toque em *Cancelar Batida*",
  "🔷 Selecione o horário que deseja desconsiderar",
  "🔷 Selecione o motivo",
  "🔷 Adicione uma mensagem: Digite uma mensagem para o seu gestor ou RH no campo Mensagem obrigatória.",
  "🔷 Envie a solicitação: Toque em *Incluir batida* para que o pedido seja encaminhado ao gestor para aprovação.",
  "",
  "*Acesse o vídeo com o tutorial:*",
  "⏯️ https://youtube.com/shorts/SFn-UeU7Zhk",
].join("\n");

const PASSO_INCLUIR = [
  "*Passo a passo para solicitar a inclusão de uma batida de ponto*",
  "",
  "🔷 Acesse o aplicativo: Abra o aplicativo My Ahgora em seu smartphone.",
  "🔷 Inicie a solicitação: Toque em *Incluir Batida*",
  "🔷 Selecione a data que deseja incluir a batida",
  "🔷 Selecione o horário que deseja incluir",
  "🔷 Selecione o motivo",
  "🔷 Adicione uma mensagem: Digite uma mensagem para o seu gestor ou RH no campo Mensagem obrigatória.",
  "🔷 Envie a solicitação: Toque em *Incluir batida* para que o pedido seja encaminhado ao gestor para aprovação.",
  "",
  "*Acesse o vídeo com o tutorial:*",
  "⏯️ https://youtube.com/shorts/V3FTCac-67c",
].join("\n");

const PASSO_ATENDENTE = [
  "🔄 Encaminhando para um atendente humano. Aguarde um momento...",
].join("\n");

// --- state machine --- O state machine é a parte do código que controla em que etapa da conversa o usuário está.
const state = new Map(); // phone -> stage

// ====== FLUXO HOLERITE (texto + imagem) ======
const holeriteSessions = new Map(); // phone -> { hasText: bool, hasImage: bool, forwardTimer: Timeout|null }

const HOLERITE_FORWARD_MS = 10 * 1000; // 30 segundos

function clearHoleriteTimer(from) {
  const sess = holeriteSessions.get(from);
  if (sess?.forwardTimer) {
    clearTimeout(sess.forwardTimer);
    sess.forwardTimer = null;
  }
}

function armHoleriteForward(from) {
  // agenda envio ao humano em 30s desde a última mensagem
  clearHoleriteTimer(from);
  const sess = holeriteSessions.get(from) || { hasText: false, hasImage: false, forwardTimer: null };
  sess.forwardTimer = setTimeout(async () => {
    await sendText(from, "🔄 Encaminhando para um atendente humano. Aguarde um momento...");
    state.set(from, "handover");
    stopInactivity(from); // não encerrar por inatividade durante handover
  }, HOLERITE_FORWARD_MS);
  holeriteSessions.set(from, sess);
}
// ====== FIM FLUXO HOLERITE ======

// ====== INATIVIDADE (ajustada para respeitar handover) ======
const inactivityTimers = new Map();
const INACTIVITY_MS = 5 * 60 * 1000; // 5 minutos

function stopInactivity(from) {
  if (inactivityTimers.has(from)) {
    clearTimeout(inactivityTimers.get(from));
    inactivityTimers.delete(from);
  }
}

function resetInactivityTimer(from) {
  // não agenda timer quando está com atendente humano
  if (state.get(from) === "handover") return;
  stopInactivity(from);
  const t = setTimeout(async () => {
    // só encerra se NÃO estiver em handover e não estiver já encerrado
    const current = state.get(from);
    if (current === "handover" || current === "ended") return;
    await sendText(from, THANKS);
    state.set(from, "ended");
  }, INACTIVITY_MS);
  inactivityTimers.set(from, t);
}
// ====== FIM INATIVIDADE ======

function normalize(txt) {
  return (txt || "").toString().trim().toLowerCase();
}

// GET para verificação ---Esse trecho do código é o endpoint de verificação do webhook que o Meta (WhatsApp Cloud API) exige quando conecta seu bot.
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];//geralmente vem como "subscribe", indicando que é uma verificação.
  const token = req.query["hub.verify_token"];// é o token secreto que você mesmo definiu no código (VERIFY_TOKEN).
  const challenge = req.query["hub.challenge"];//um número que o Meta gera e espera que você devolva para confirmar que seu servidor é válido.
  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    return res.status(200).send(challenge);/*Se o mode for "subscribe" e o token for igual ao que você definiu (VERIFY_TOKEN), então o bot responde com o challenge.
      Isso confirma a verificação e o Meta ativa o webhook.*/
  }
  return res.sendStatus(403);// Se algo estiver errado → retorna 403 Forbidden.
});

// POST webhook
app.post("/webhook", async (req, res) => {
  try {
    const change = req.body?.entry?.[0]?.changes?.[0];
    const msg = change?.value?.messages?.[0];
    if (!msg) return res.sendStatus(200);

    const from = msg.from;

    const text = msg.text?.body || msg.interactive?.button_reply?.title || msg.interactive?.list_reply?.title || "";
    const n = normalize(text);
    const stage = state.get(from) || "idle";

    // reinicia/agenda o timer de inatividade conforme estágio ATUAL
    resetInactivityTimer(from);

    // --- LOOPING FIX ---
    if (stage === "ended" || stage === "idle") {
      await sendWelcomeAndMenu(from);
      state.set(from, "await_main_choice");
      return res.sendStatus(200);
    }

// MENU PRINCIPAL: aguarda 1..4
if (stage === "await_main_choice") {
  if (["1", "2", "3", "4"].includes(n)) {
    if (n === "1") {
      await sendPontoMenu(from);
      state.set(from, "await_ponto_choice");
    } else if (n === "2") {
      // entrar no submenu Folha & Benefícios
      await sendText(from, FOLHA_MENU);
      state.set(from, "await_folha_choice");
    } else if (n === "3") {
      // Dúvidas sobre holerite
      await sendText(from, "Escreva a sua dúvida e envie um print de seu holerite para que eu possa te direcionar ao atendimento humano");
      holeriteSessions.set(from, { hasText: false, hasImage: false, forwardTimer: null });
      state.set(from, "await_holerite_question");
    } else if (n === "4") {
      await sendText(from, "🔄 Encaminhando para um atendente humano. Aguarde um momento...");
      state.set(from, "handover"); // agora está no humano
      stopInactivity(from); // não encerrar por inatividade durante handover
      return res.sendStatus(200);
    }
  } else {
    await sendText(from, "Não consegui identificar sua resposta.");
    await wait(1000);
    await sendRootMenu(from);
    state.set(from, "await_main_choice");
  }
  return res.sendStatus(200);
}

// MENU 3 COLETA DE DÚVIDA DE HOLERITE (texto + imagem)
    if (stage === "await_holerite_question") {
      // Atualiza flags conforme o tipo de mensagem recebida
      const sess = holeriteSessions.get(from) || { hasText: false, hasImage: false, forwardTimer: null };
      const hasText = !!(msg.text?.body);
      const hasImage = !!(msg.image);

      if (hasText) sess.hasText = true;
      if (hasImage) sess.hasImage = true;
      holeriteSessions.set(from, sess);

      // Feedback mínimo para guiar o usuário (sem alterar fluxo existente)
      if (!sess.hasText) {
        await sendText(from, "Recebi sua imagem. Agora, por favor, escreva a sua dúvida em texto.");
      } else if (!sess.hasImage) {
        await sendText(from, "Recebi sua mensagem. Agora, por favor, envie um print (imagem) do seu holerite.");
      }

      // Quando ambos existem, arma o temporizador de 30s após a última mensagem
      if (sess.hasText && sess.hasImage) {
        armHoleriteForward(from);
      }

      // Não muda de estado ainda; handover será disparado pelo timer
      return res.sendStatus(200);
    }

    // SUBMENU PONTO
if (stage === "await_ponto_choice") {
  // inclui o "7" na validação
  if (["1", "2", "3", "4", "5", "6", "7"].includes(n)) {
    if (n === "7") {
      // volta ao menu inicial SEM saudação
      await sendRootMenu(from);
      state.set(from, "await_main_choice");
      return res.sendStatus(200);
    }

    // 6 = falar com atendente (handover), sem pergunta de voltar ao menu
    if (n === "6") {
      await sendText(from, PASSO_ATENDENTE);
      state.set(from, "handover");
      stopInactivity(from); // << não encerrar por inatividade durante handover
      return res.sendStatus(200);
    }

    // envia o passo a passo conforme opção (1..5)
    const map = {
      "1": PASSO_REGISTRAR,
      "2": PASSO_ESPELHO,
      "3": PASSO_ABONO,
      "4": PASSO_CANCELAR_BATIDA,
      "5": PASSO_INCLUIR,
    };
    await sendText(from, map[n]);
    await wait(1000);
    await sendText(from, ASK_BACK);
    state.set(from, "await_back_menu");
  } else {
    await sendText(from, "Não consegui identificar sua resposta.");
    await wait(1000);
    await sendPontoMenu(from);
    state.set(from, "await_ponto_choice");
  }
  return res.sendStatus(200);
}

    // SUBMENU FOLHA & BENEFÍCIOS (Meu RH / TOTVS)
    if (stage === "await_folha_choice") {
      if (["1", "2", "3", "4", "5", "6", "7"].includes(n)) {
        if (n === "6") {
          // retornar ao menu inicial
          await sendRootMenu(from);
          state.set(from, "await_main_choice");
          return res.sendStatus(200);
        }
        if (n === "7") {
          // handover com looping natural
          await sendText(from, "🔄 Encaminhando para um atendente humano. Aguarde um momento...");
          state.set(from, "handover");
          stopInactivity(from); // << não encerrar por inatividade durante handover
          return res.sendStatus(200);
        }

        // 1..5 => envia passo a passo e permanece no submenu, reenviando o menu 2
        const map = {
          "1": PASSO_ATESTADO,
          "2": PASSO_HIST_PAGAMENTOS,
          "3": PASSO_HIST_SALARIAL,
          "4": PASSO_FERIAS,
          "5": PASSO_INFORME,
        };
         await sendText(from, map[n]);
    await wait(1000);
    await sendText(from, ASK_BACK);
    state.set(from, "await_back_menu");
  } else {
    await sendText(from, "Não consegui identificar sua resposta.");
    await wait(1000);
    await sendPontoMenu(from);
    state.set(from, "await_ponto_choice");
  }
  return res.sendStatus(200);
}


    // “Deseja voltar ao Menu Inicial? sim/não"
    if (stage === "await_back_menu") {
      if (["sim", "s"].includes(n)) {
        await sendRootMenu(from);               // apenas menu, sem saudação
        state.set(from, "await_main_choice");
      } else if (["nao", "não", "n"].includes(n)) {
        await sendText(from, THANKS);
        state.set(from, "ended");               // encerra; próxima mensagem reabre com saudação+menu
      } else {
        await sendText(from, 'Não consegui identificar. Responda com "sim" ou "não".');
        await wait(1000);
        await sendText(from, ASK_BACK);
        state.set(from, "await_back_menu");
      }
      return res.sendStatus(200);
    }

    // estado handover: oferecer saída do handover
    if (stage === "handover") {
      await sendText(from, ASK_HANDOVER);
      state.set(from, "await_handover_choice");
      return res.sendStatus(200);
    }

    // estado: aguarda escolha após handover
    if (stage === "await_handover_choice") {
      if (n === "1") {
        // voltar ao menu inicial
        await sendRootMenu(from);
        state.set(from, "await_main_choice");
        return res.sendStatus(200);
      } else if (n === "2") {
        // permanecer aguardando humano (reconfirma)
        await sendText(from, "🔄 Encaminhando para um atendente humano. Aguarde um momento...");
        state.set(from, "handover");
        stopInactivity(from); // mantém regra de não encerrar por inatividade no handover
        return res.sendStatus(200);
      } else {
        await sendText(from, "Não consegui identificar sua resposta. Por favor, escolha uma das opções.");
        await sendText(from, ASK_HANDOVER);
        return res.sendStatus(200);
      }
    }

    // fallback de segurança: volta para o menu principal (sem saudação)
    await sendRootMenu(from);
    state.set(from, "await_main_choice");
    return res.sendStatus(200);
  } catch (e) {
    console.error("Erro no webhook:", e?.response?.data || e.message);
    return res.sendStatus(200);
  }
});

app.get("/", (req, res) => res.send("Servidor do Bot RH ativo!"));

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log("DEBUG TOKEN len:", (process.env.WHATSAPP_TOKEN || "").length);
  console.log("DEBUG PHONE_NUMBER_ID:", process.env.PHONE_NUMBER_ID);
});
