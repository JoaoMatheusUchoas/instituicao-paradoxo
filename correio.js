/* ==========================================================
   CORREIO DA INSTITUIÇÃO PARADOXO
   ----------------------------------------------------------
   Tudo que é enviado no site (cadastros, suporte e e-mails
   escritos nos portais) chega no e-mail abaixo, pelo serviço
   gratuito FormSubmit (formsubmit.co).

   IMPORTANTE: na primeira vez que algo for enviado, o
   FormSubmit manda um e-mail de ativação para este endereço.
   Abra e clique em "Activate Form". Só depois disso as
   mensagens começam a chegar.
   ========================================================== */
var CORREIO_DESTINO = "suporteparadoxo114@gmail.com";

var Correio = (function () {
  var DATA_JOGO = "24/11/2023";

  function agoraReal() {
    var d = new Date();
    return d.toLocaleDateString("pt-BR") + " " + d.toLocaleTimeString("pt-BR");
  }

  /* Envia um e-mail. "campos" vira uma tabela no e-mail.
     Retorna uma Promise que resolve true/false. */
  function enviar(assunto, campos, responderPara) {
    var corpo = {
      _subject: "[Paradoxo] " + assunto,
      _template: "table",
      _captcha: "false"
    };
    if (responderPara) corpo._replyto = responderPara;
    for (var k in campos) if (campos.hasOwnProperty(k)) corpo[k] = campos[k];
    corpo["Data no jogo"] = DATA_JOGO;
    corpo["Enviado em (real)"] = agoraReal();

    return fetch("https://formsubmit.co/ajax/" + CORREIO_DESTINO, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(corpo)
    }).then(function (r) { return r.json(); })
      .then(function (j) { return j && (j.success === true || j.success === "true"); })
      .catch(function () { return false; });
  }

  /* ---------- Contas criadas pelo cadastro ----------
     Ficam salvas no navegador de quem se cadastrou. A senha
     é guardada embaralhada (hash) e NUNCA é enviada por e-mail. */
  var CHAVE_CONTAS = "paradoxo_contas";

  function lerContas() {
    try { return JSON.parse(localStorage.getItem(CHAVE_CONTAS) || "[]"); } catch (e) { return []; }
  }
  function salvarContas(lista) {
    try { localStorage.setItem(CHAVE_CONTAS, JSON.stringify(lista)); return true; } catch (e) { return false; }
  }

  function hash(texto) {
    var dados = new TextEncoder().encode("paradoxo::" + texto);
    if (window.crypto && crypto.subtle && crypto.subtle.digest) {
      return crypto.subtle.digest("SHA-256", dados).then(function (buf) {
        return Array.prototype.map.call(new Uint8Array(buf), function (b) {
          return ("0" + b.toString(16)).slice(-2);
        }).join("");
      });
    }
    // reserva simples, caso o navegador não tenha crypto.subtle
    var h = 0;
    for (var i = 0; i < dados.length; i++) { h = ((h << 5) - h + dados[i]) | 0; }
    return Promise.resolve("x" + (h >>> 0).toString(16));
  }

  function buscarConta(usuario) {
    var u = usuario.toLowerCase();
    var lista = lerContas();
    for (var i = 0; i < lista.length; i++) if (lista[i].usuario === u) return lista[i];
    return null;
  }

  function criarConta(usuario, email, senha) {
    return hash(senha).then(function (h) {
      var lista = lerContas();
      lista.push({ usuario: usuario.toLowerCase(), email: email, hash: h, criado: agoraReal() });
      return salvarContas(lista);
    });
  }

  function conferirSenha(usuario, senha) {
    var c = buscarConta(usuario);
    if (!c) return Promise.resolve(null);
    return hash(senha).then(function (h) { return h === c.hash ? c : null; });
  }

  /* ---------- Caixa de "Escrever" dos portais ----------
     Liga automaticamente um formulário com id="correio-form"
     (campos correio-para, correio-assunto, correio-msg,
     correio-status) e a lista id="correio-enviados". */
  function ligarFormulario() {
    var form = document.getElementById("correio-form");
    if (!form) return;
    var remetente = form.getAttribute("data-remetente") || "desconhecido";
    var nomeRemetente = form.getAttribute("data-nome") || remetente;
    var chaveEnviados = "paradoxo_enviados_" + remetente;
    var status = document.getElementById("correio-status");
    var lista = document.getElementById("correio-enviados");

    function lerEnviados() {
      try { return JSON.parse(localStorage.getItem(chaveEnviados) || "[]"); } catch (e) { return []; }
    }
    function desenhar() {
      if (!lista) return;
      var itens = lerEnviados();
      lista.innerHTML = "";
      if (!itens.length) {
        var vazio = document.createElement("li");
        vazio.className = "correio-vazio";
        vazio.textContent = "Nenhuma mensagem enviada.";
        lista.appendChild(vazio);
        return;
      }
      itens.slice().reverse().forEach(function (m) {
        var li = document.createElement("li");
        var b = document.createElement("b");
        b.textContent = m.assunto;
        var s = document.createElement("span");
        s.textContent = "Para: " + m.para + " · " + m.data;
        li.appendChild(b);
        li.appendChild(s);
        lista.appendChild(li);
      });
    }
    function aviso(tipo, texto) {
      if (!status) return;
      status.className = "correio-status " + tipo;
      status.textContent = texto;
    }

    desenhar();

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var para = document.getElementById("correio-para").value;
      var assunto = document.getElementById("correio-assunto").value.trim();
      var msg = document.getElementById("correio-msg").value.trim();
      if (!para || !assunto || !msg) { aviso("erro", "Preencha destinatário, assunto e mensagem."); return; }

      var botao = form.querySelector("button[type=submit]");
      botao.disabled = true;
      aviso("enviando", "Enviando...");

      var conta = buscarConta(remetente);
      enviar(remetente + " → " + para + ": " + assunto, {
        "De": nomeRemetente + " (" + remetente + ")",
        "Para": para,
        "Assunto": assunto,
        "Mensagem": msg
      }, conta ? conta.email : null).then(function (ok) {
        botao.disabled = false;
        if (ok) {
          var itens = lerEnviados();
          itens.push({ para: para, assunto: assunto, data: DATA_JOGO + " " + new Date().toLocaleTimeString("pt-BR").slice(0, 5) });
          try { localStorage.setItem(chaveEnviados, JSON.stringify(itens)); } catch (er) {}
          desenhar();
          form.reset();
          aviso("ok", "Mensagem enviada para " + para + ".");
        } else {
          aviso("erro", "Falha no servidor de e-mail. Tente novamente em alguns instantes.");
        }
      });
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", ligarFormulario);
  else ligarFormulario();

  return {
    enviar: enviar,
    buscarConta: buscarConta,
    criarConta: criarConta,
    conferirSenha: conferirSenha,
    dataJogo: DATA_JOGO
  };
})();
