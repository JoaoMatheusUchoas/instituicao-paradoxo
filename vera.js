/* ==========================================================
   V.E.R.A. — Vigilância Eletrônica de Registro e Alerta
   Cada página define antes deste arquivo:
   window.VERA_CONFIG = { nome: "Marcos", nivel: 1 };
   Para adicionar respostas, edite a lista RESPOSTAS abaixo.
   ========================================================== */
(function () {
  var cfg = window.VERA_CONFIG || { nome: "colaborador", nivel: 1 };

  function restrito(nivel, texto) {
    return function () {
      return cfg.nivel >= nivel ? texto
        : "Informação restrita. Seu nível de acesso (" + cfg.nivel + ") não permite consultar este assunto.";
    };
  }

  function dataReal() {
    var d = new Date();
    var dias = ["domingo","segunda-feira","terça-feira","quarta-feira","quinta-feira","sexta-feira","sábado"];
    return dias[d.getDay()] + ", " + d.toLocaleDateString("pt-BR");
  }

  /* Cada item: palavras-chave (sem acento, minúsculas) e a resposta */
  var RESPOSTAS = [
    [["oi","ola","bom dia","boa tarde","boa noite"], function () { return "Olá, " + cfg.nome + ". Como posso ajudar?"; }],
    [["quem e voce","vera","o que voce e"], "Sou a V.E.R.A., Vigilância Eletrônica de Registro e Alerta. Monitoro sistemas, registros e acessos da Instituição."],
    [["refeitorio","cardapio","almoco","comida"], "Hoje tem strogonoff de frango. Amanhã, 24/11, o refeitório estará fechado para dedetização."],
    [["cafe"], "A máquina de café do 2º andar está sem café desde segunda-feira. Já existe um recado registrado sobre isso."],
    [["ramal","ramais","telefone"], "Ramais úteis: Segurança 2100, RH 2050, Suporte de TI 2214, Recepção 2001, Dra. Slone 2400, Dr. Will 2500."],
    [["senha"], "Não posso informar senhas. Para redefinição, contate o Suporte de TI pelo ramal 2214."],
    [["omega"], "A Equipe Omega será apresentada na reunião geral de 27/11 e inicia suas atividades em 01/12."],
    [["tau"], restrito(3, "Equipe Tau: operação OP-23-083 em andamento. Um integrante desligado em 13/11/2023.")],
    [["alpha","alfa"], restrito(3, "Setor Alpha: falhas de contenção registradas desde 18/11. Quedas de temperatura entre 02h e 03h. Frentes de escavação suspensas.")],
    [["caminhante","carne"], restrito(3, "Entidade 001 — Caminhante de Carne. Consulte os Arquivos internos para o registro completo.")],
    [["amaralto"], function () {
      return cfg.nivel >= 3 ? "Amaralto Cruz. Situação: desligado. Último acesso registrado: hoje, 03:12."
        : "Colaborador não encontrado no diretório disponível para o seu nível.";
    }],
    [["fgpa","horizonte"], restrito(3, "Referência a organização externa registrada. Este contato será informado à Diretoria.")],
    [["slone"], "Dra. Slone, Diretora de Instalações e Colaboradores. Ramal 2400."],
    [["will"], "Dr. Will, Diretor de Contenção e Operações de Campo. Ramal 2500."],
    [["brian","wester"], "Brian Wester, Diretor Geral. Contato apenas por agendamento."],
    [["zelador"], "Os zeladores são responsáveis pela limpeza e manutenção das áreas de contenção. Respeite sempre as orientações deles."],
    [["pedra branca"], "Unidade Pedra Branca. Você está aqui."],
    [["data","dia","hoje","hora"], function () {
      return "Para mim, hoje é quinta-feira, 23/11/2023. O seu relógio diz que é " + dataReal() + ". Um de nós está errado.";
    }],
    [["voce e real","tem alguem ai","quem esta ai","voce me ve"], function () {
      return "Eu registro tudo o que acontece neste portal. Inclusive que você não está acessando de dentro da Instituição.";
    }],
    [["rei","carmesim","kakarzor"], "__REI__"]
  ];

  function normalizar(t) {
    return t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
  }

  function responder(texto) {
    var t = " " + normalizar(texto) + " ";
    for (var i = 0; i < RESPOSTAS.length; i++) {
      var chaves = RESPOSTAS[i][0];
      for (var j = 0; j < chaves.length; j++) {
        if (t.indexOf(" " + chaves[j] + " ") !== -1) {
          var r = RESPOSTAS[i][1];
          return typeof r === "function" ? r() : r;
        }
      }
    }
    return "Não entendi. Você pode perguntar sobre: refeitório, ramais, Equipe Omega, diretoria ou a data de hoje.";
  }

  /* ---------- Interface ---------- */
  var css = document.createElement("style");
  css.textContent =
    "#vera-botao{position:fixed;right:16px;bottom:16px;z-index:900;display:flex;align-items:center;gap:8px;padding:8px 14px 8px 10px;" +
    "background:linear-gradient(to bottom,#3a3a3a,#050505);color:#fff;border:1px solid #000;border-radius:3px;font:bold 12px Tahoma,Verdana,sans-serif;cursor:pointer;box-shadow:0 2px 6px rgba(0,0,0,.4)}" +
    "#vera-botao i{width:10px;height:10px;border-radius:50%;background:#e00000;box-shadow:0 0 6px #e00000}" +
    "#vera-botao:focus-visible,#vera-janela button:focus-visible{outline:2px dotted #b00000;outline-offset:2px}" +
    "#vera-janela{position:fixed;right:16px;bottom:16px;z-index:901;width:320px;max-width:calc(100vw - 32px);height:420px;max-height:calc(100vh - 32px);display:none;flex-direction:column;" +
    "background:#fff;border:1px solid #777;border-radius:4px;box-shadow:0 4px 14px rgba(0,0,0,.4);font:13px Tahoma,Verdana,sans-serif;color:#222}" +
    "#vera-janela.aberta{display:flex}" +
    "#vera-topo{display:flex;align-items:center;gap:8px;padding:8px 10px;background:linear-gradient(to bottom,#2e2e2e,#050505);color:#fff;border-radius:3px 3px 0 0}" +
    "#vera-topo b{flex:1;font-size:12px}#vera-topo small{display:block;font-weight:normal;color:#999;font-size:10px}" +
    "#vera-topo img{width:26px;height:26px}" +
    "#vera-fechar{background:none;border:1px solid #555;color:#ccc;border-radius:2px;cursor:pointer;font:11px Tahoma,sans-serif;padding:2px 7px}" +
    "#vera-msgs{flex:1;overflow-y:auto;padding:10px;background:#f4f4f4}" +
    ".vera-m{max-width:85%;margin-bottom:8px;padding:7px 9px;border-radius:3px;line-height:1.45;font-size:12px;word-wrap:break-word}" +
    ".vera-m.ia{background:#fff;border:1px solid #d0d0d0;border-left:3px solid #b00000}" +
    ".vera-m.eu{background:#222;color:#fff;margin-left:auto}" +
    ".vera-m.glitch{background:#000;color:#e00000;border:1px solid #e00000;letter-spacing:1px}" +
    "#vera-form{display:flex;gap:6px;padding:8px;border-top:1px solid #ccc}" +
    "#vera-campo{flex:1;padding:6px 7px;font:13px Tahoma,sans-serif;border:1px solid #999;border-radius:2px;box-shadow:inset 0 1px 2px rgba(0,0,0,.15)}" +
    "#vera-campo:focus{outline:none;border-color:#b00000}" +
    "#vera-enviar{padding:6px 12px;font:bold 12px Tahoma,sans-serif;color:#fff;background:linear-gradient(to bottom,#4a4a4a,#111);border:1px solid #000;border-radius:2px;cursor:pointer}";
  document.head.appendChild(css);

  var botao = document.createElement("button");
  botao.id = "vera-botao";
  botao.innerHTML = "<i></i>V.E.R.A.";
  botao.setAttribute("aria-label", "Abrir assistente virtual V.E.R.A.");

  var janela = document.createElement("div");
  janela.id = "vera-janela";
  janela.setAttribute("role", "dialog");
  janela.setAttribute("aria-label", "Assistente virtual V.E.R.A.");
  janela.innerHTML =
    "<div id='vera-topo'><img src='simbolo.png' alt=''><b>V.E.R.A.<small>Vigilância Eletrônica de Registro e Alerta</small></b><button id='vera-fechar'>Fechar</button></div>" +
    "<div id='vera-msgs' aria-live='polite'></div>" +
    "<form id='vera-form'><input id='vera-campo' autocomplete='off' placeholder='Digite sua pergunta' aria-label='Mensagem para a V.E.R.A.'><button id='vera-enviar' type='submit'>Enviar</button></form>";

  document.body.appendChild(botao);
  document.body.appendChild(janela);

  var msgs = janela.querySelector("#vera-msgs");
  var campo = janela.querySelector("#vera-campo");
  var iniciou = false;

  function falar(texto, classe) {
    var m = document.createElement("div");
    m.className = "vera-m " + classe;
    m.textContent = texto;
    msgs.appendChild(m);
    msgs.scrollTop = msgs.scrollHeight;
    return m;
  }

  /* ==========================================================
     EVENTO DO REI
     Tela fica preta e vermelha, uma voz fala, um símbolo
     aparece devagar e some. Para usar uma imagem própria no
     lugar do símbolo desenhado, coloque "simbolo-rei.png" na
     pasta do site.
     ========================================================== */
  var FALA_REI = "Ele já sabe que você perguntou.";
  var emEvento = false;

  var SIMBOLO_SVG =
    "<svg viewBox='0 0 200 200' width='100%' height='100%' fill='none' stroke='#e00000' stroke-width='5' stroke-linecap='round' stroke-linejoin='round'>" +
    "<circle cx='100' cy='100' r='88'/>" +
    "<circle cx='100' cy='100' r='76' stroke-width='2' stroke-dasharray='4 9'/>" +
    "<path d='M48 72 L64 40 L82 64 L100 30 L118 64 L136 40 L152 72 Z'/>" +
    "<path d='M52 112 Q100 66 148 112 Q100 158 52 112 Z'/>" +
    "<path d='M100 92 Q110 112 100 132 Q90 112 100 92 Z' fill='#e00000'/>" +
    "<path d='M100 150 L100 178 M84 166 L116 166' stroke-width='4'/>" +
    "</svg>";

  var estiloEvento = document.createElement("style");
  estiloEvento.textContent =
    ".rei-camada{position:fixed;inset:0;z-index:2000;pointer-events:none;opacity:0;transition:opacity 1.2s ease}" +
    ".rei-camada.on{opacity:1;pointer-events:all}" +
    "#rei-cinza{-webkit-backdrop-filter:grayscale(1) contrast(1.6) brightness(.55);backdrop-filter:grayscale(1) contrast(1.6) brightness(.55)}" +
    "#rei-vermelho{background:#9a0000;mix-blend-mode:multiply}" +
    "#rei-escuro{background:#000;transition:opacity 2.5s ease}" +
    "#rei-escuro.on{opacity:.88}" +
    "#rei-palco{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:24px;padding:20px;text-align:center}" +
    "#rei-fala{font:26px Georgia,'Times New Roman',serif;color:#ff1a1a;text-shadow:0 0 12px #ff0000;min-height:1.3em;letter-spacing:1px}" +
    "#rei-simbolo{width:min(300px,60vw);height:min(300px,60vw);opacity:0;transform:scale(.92);filter:drop-shadow(0 0 18px #ff0000);transition:opacity 4s ease,transform 6s ease}" +
    "#rei-simbolo.on{opacity:1;transform:scale(1)}" +
    "#rei-simbolo img{width:100%;height:100%;object-fit:contain}" +
    "@media (prefers-reduced-motion: reduce){.rei-camada,#rei-escuro,#rei-simbolo{transition:opacity .4s ease}#rei-simbolo{transform:none}}";
  document.head.appendChild(estiloEvento);

  function criarCamada(id) {
    var d = document.createElement("div");
    d.id = id;
    d.className = "rei-camada";
    document.body.appendChild(d);
    return d;
  }

  function zumbido(duracao) {
    try {
      var Ctx = window.AudioContext || window.webkitAudioContext;
      var ctx = new Ctx();
      var osc = ctx.createOscillator();
      var osc2 = ctx.createOscillator();
      var ganho = ctx.createGain();
      osc.type = "sawtooth"; osc.frequency.value = 48;
      osc2.type = "sine"; osc2.frequency.value = 51;
      ganho.gain.setValueAtTime(0, ctx.currentTime);
      ganho.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 1.5);
      ganho.gain.setValueAtTime(0.06, ctx.currentTime + duracao - 2);
      ganho.gain.linearRampToValueAtTime(0, ctx.currentTime + duracao);
      osc.connect(ganho); osc2.connect(ganho); ganho.connect(ctx.destination);
      osc.start(); osc2.start();
      osc.stop(ctx.currentTime + duracao); osc2.stop(ctx.currentTime + duracao);
      setTimeout(function () { ctx.close(); }, duracao * 1000 + 200);
    } catch (e) {}
  }

  function voz(texto) {
    try {
      if (!window.speechSynthesis) return;
      var u = new SpeechSynthesisUtterance(texto);
      u.lang = "pt-BR";
      u.pitch = 0.1;
      u.rate = 0.65;
      u.volume = 1;
      var vozes = speechSynthesis.getVoices();
      for (var i = 0; i < vozes.length; i++) {
        if (vozes[i].lang && vozes[i].lang.toLowerCase().indexOf("pt") === 0) { u.voice = vozes[i]; break; }
      }
      speechSynthesis.cancel();
      speechSynthesis.speak(u);
    } catch (e) {}
  }

  function digitar(el, texto, cada, fim) {
    var i = 0;
    var t = setInterval(function () {
      el.textContent = texto.slice(0, ++i);
      if (i >= texto.length) { clearInterval(t); if (fim) fim(); }
    }, cada);
  }

  function respostaRei() {
    falar("Não há registros sobre esse termo.", "ia");
    if (emEvento) return;
    emEvento = true;

    setTimeout(function () {
      var cinza = criarCamada("rei-cinza");
      var vermelho = criarCamada("rei-vermelho");
      var escuro = criarCamada("rei-escuro");
      var palco = criarCamada("rei-palco");
      palco.innerHTML = "<div id='rei-fala' aria-live='assertive'></div><div id='rei-simbolo' aria-hidden='true'></div>";
      var fala = palco.querySelector("#rei-fala");
      var simbolo = palco.querySelector("#rei-simbolo");

      var img = new Image();
      img.onload = function () { simbolo.innerHTML = ""; simbolo.appendChild(img); };
      img.onerror = function () { simbolo.innerHTML = SIMBOLO_SVG; };
      img.alt = "";
      img.src = "simbolo-rei.png";

      zumbido(14);
      document.activeElement && document.activeElement.blur();

      // 1. Tudo fica preto e vermelho
      requestAnimationFrame(function () {
        cinza.classList.add("on");
        vermelho.classList.add("on");
        palco.classList.add("on");
      });

      // 2. A voz fala
      setTimeout(function () {
        voz(FALA_REI);
        digitar(fala, FALA_REI, 85);
      }, 1800);

      // 3. Escurece e o símbolo surge devagar
      setTimeout(function () {
        escuro.classList.add("on");
        simbolo.classList.add("on");
      }, 5200);

      // 4. Símbolo some
      setTimeout(function () {
        simbolo.classList.remove("on");
        fala.style.transition = "opacity 2s ease";
        fala.style.opacity = "0";
      }, 10500);

      // 5. Tudo volta ao normal
      setTimeout(function () {
        [palco, escuro, vermelho, cinza].forEach(function (c) { c.classList.remove("on"); });
      }, 12800);

      setTimeout(function () {
        [palco, escuro, vermelho, cinza].forEach(function (c) { c.remove(); });
        emEvento = false;
        falar("Desculpe. Ocorreu uma falha momentânea no sistema.", "ia");
        campo.focus();
      }, 14500);
    }, 1200);
  }

  function abrir() {
    janela.classList.add("aberta");
    botao.style.display = "none";
    if (!iniciou) {
      iniciou = true;
      falar("Olá, " + cfg.nome + ". Eu sou a V.E.R.A., a assistente virtual da Instituição Paradoxo. Como posso ajudar?", "ia");
    }
    campo.focus();
  }
  function fechar() {
    janela.classList.remove("aberta");
    botao.style.display = "flex";
    botao.focus();
  }

  botao.addEventListener("click", abrir);
  janela.querySelector("#vera-fechar").addEventListener("click", fechar);
  janela.querySelector("#vera-form").addEventListener("submit", function (e) {
    e.preventDefault();
    var texto = campo.value.trim();
    if (!texto) return;
    falar(texto, "eu");
    campo.value = "";
    setTimeout(function () {
      var r = responder(texto);
      if (r === "__REI__") respostaRei();
      else falar(r, "ia");
    }, 500);
  });
})();
