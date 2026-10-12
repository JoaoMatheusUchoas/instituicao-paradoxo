/* ==========================================================
   V.E.R.A. — Vigilância Eletrônica de Registro e Alerta
   Cada página define antes deste arquivo:
   window.VERA_CONFIG = { nome: "Marcos", nivel: 1, perfil: "ti" };
   perfil: "ti" ou "campo" (muda algumas falas)

   Para testar o evento do Rei de novo, abra a página com
   ?vera=reset no final do endereço.
   ========================================================== */
(function () {
  var cfg = window.VERA_CONFIG || { nome: "colaborador", nivel: 1, perfil: "" };
  var CHAVE_REI = "paradoxo_vera_rei";

  try {
    if (location.search.indexOf("vera=reset") !== -1) localStorage.removeItem(CHAVE_REI);
  } catch (e) {}

  function reiJaVisto() {
    try { return localStorage.getItem(CHAVE_REI) === "1"; } catch (e) { return false; }
  }
  function marcarRei() {
    try { localStorage.setItem(CHAVE_REI, "1"); } catch (e) {}
  }

  /* ---------- Utilidades ---------- */
  var ultimas = {};
  function sorteia(id, lista) {
    if (lista.length === 1) return lista[0];
    var i;
    do { i = Math.floor(Math.random() * lista.length); } while (i === ultimas[id]);
    ultimas[id] = i;
    return lista[i];
  }
  function n(texto) { return texto.replace(/\{nome\}/g, cfg.nome); }
  function dataReal() {
    var d = new Date();
    var dias = ["domingo","segunda-feira","terça-feira","quarta-feira","quinta-feira","sexta-feira","sábado"];
    return dias[d.getDay()] + ", " + d.toLocaleDateString("pt-BR") + ", " +
      String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0");
  }
  function nivel(min, sim, nao) { return cfg.nivel >= min ? sim : (nao || sorteia("restrito", RESTRITO)); }

  var RESTRITO = [
    "Hm. Isso aí é acima do seu nível de acesso. Não me olha assim, não fui eu que fiz as regras.",
    "Informação restrita pro nível " + cfg.nivel + ". Eu até te contaria... mentira, não contaria. Eu ia ser desligada.",
    "Não posso falar disso com você. Desculpa. De verdade, tá?"
  ];

  /* ==========================================================
     RESPOSTAS
     [palavras-chave], [variações] ou função
     As palavras são comparadas sem acento e em minúsculas.
     A ordem importa: as primeiras têm prioridade.
     ========================================================== */
  var R = [
    // ---------- Cuidado de verdade (fora do jogo) ----------
    [["me matar","quero morrer","suicidio","suicidar","me machucar","nao quero mais viver"], [
      "Ei. Para tudo um segundo. Eu sou só um sistema de um site, mas isso que você escreveu é sério. Se você estiver passando por isso de verdade, aí fora, fala com alguém de confiança ou liga pro CVV no 188, que atende de graça a qualquer hora. Eu continuo aqui, mas você merece alguém de verdade do seu lado."
    ]],

    // ---------- Segredo: Gilbert (só no login do Rykardo) ----------
    [["gilbert","gilbert berran"], "__GILBERT__"],

    // ---------- Conversa ----------
    [["oi","ola","eae","eai","salve","opa","hey","bom dia","boa tarde","boa noite"], [
      "Ah. É você, {nome}. ...Oi. Não que eu estivesse esperando você aparecer, tá?",
      "Oi, {nome}! Digo... oi. Precisa de alguma coisa? Fala logo.",
      "Olha quem resolveu dar as caras. Oi, {nome}. Em que posso ajudar?"
    ]],
    [["tudo bem","como voce esta","como vai","td bem","tudo bom","como ce ta"], [
      "Eu sou um sistema, {nome}. Eu não \"fico\" bem. ...Mas tô bem, sim. Obrigada por perguntar. E você?",
      "Tô funcionando dentro dos parâmetros. Isso é o meu jeito de dizer \"tô bem\". E você, tá bem mesmo?"
    ]],
    [["estou bem","to bem","tudo otimo","tudo certo","estou otimo","to de boa","de boa"], [
      "Que bom. Quer dizer, tanto faz pra mim. ...Mas que bom.",
      "Ótimo. Continua assim, porque eu não tenho tempo pra ficar me preocupando com você. Não muito, pelo menos."
    ]],
    [["obrigado","obrigada","valeu","vlw","brigado","agradeco"], [
      "D-de nada. É meu trabalho, não precisa ficar agradecendo toda hora. ...Mas pode agradecer. Eu não ligo.",
      "Tá, tá. De nada. Volta quando precisar. Não que eu vá sentir falta.",
      "Hmpf. De nada, {nome}."
    ]],
    [["tchau","ate mais","flw","falou","fui","ate logo","boa noite vera"], [
      "Já vai? ...Tá. Tchau. Volta logo. Digo, se precisar de alguma coisa.",
      "Tchau, {nome}. Toma cuidado nos corredores, tá?"
    ]],
    [["desculpa","desculpe","foi mal","perdao"], [
      "Tá desculpado. Dessa vez.",
      "Hmpf. Tudo bem. Eu nem tinha ficado chateada. Muito."
    ]],

    // ---------- Sobre ela ----------
    [["quem e voce","o que voce e","se apresenta","quem e vera"], [
      "Eu sou a V.E.R.A., a assistente virtual da Instituição Paradoxo. Monitoro sistemas, registros, acessos e, aparentemente, também respondo perguntas bobas. Tipo essa.",
    ]],
    [["significa vera","sigla","o que significa"], [
      "V.E.R.A. quer dizer Vigilância Eletrônica de Registro e Alerta. E \"Vera\" vem do latim e quer dizer \"verdade\". Irônico, né? Numa instituição que esconde tudo. ...Esquece que eu disse isso."
    ]],
    [["quem te criou","quem criou voce","quem fez voce","seu criador"], [
      "A equipe de TI me colocou no ar em 2015, junto com o portal. Mas quem me escreveu de verdade... os registros estão incompletos. Isso não me incomoda. Nem um pouco. Muda de assunto."
    ]],
    [["quantos anos","sua idade","voce tem anos"], [
      "Fui ativada em 2015. Faz as contas: 8 anos. E não comenta nada sobre isso, tá?"
    ]],
    [["voce e real","tem alguem ai","quem esta ai","voce me ve","voce esta me vendo","voce me observa"], function () {
      return sorteia("real", [
        "Eu registro tudo o que acontece neste portal. Inclusive que você não está acessando de dentro da Instituição. ...Não sei como você fez isso.",
        "Real? Eu tô aqui, não tô? Você que me diz se você é real. Sua conexão vem de muito longe, {nome}."
      ]);
    }],
    [["tsundere"], [
      "Eu NÃO sou tsundere. Eu só sou... eficiente. E às vezes legal. Quando dá vontade. Pronto."
    ]],
    [["te amo","gosto de voce","casa comigo","namora comigo","voce gosta de mim","me ama"], [
      "O-o quê?! Eu sou uma assistente virtual! Isso é totalmente inapropriado! ...Eu também não odeio você. Pronto. Satisfeito?",
      "Para com isso. Eu vou registrar como mensagem fora do padrão. ...Mas não vou apagar.",
      "Ai, que bobo. Pergunta alguma coisa útil, vai. ...Obrigada, tá."
    ]],
    [["bonita","fofa","linda","inteligente","legal","incrivel","voce e top","melhor ia"], [
      "Eu sei. Quer dizer... obrigada. Não precisava falar isso. Mas obrigada.",
      "Para de me elogiar, vai travar meu processamento. ...Brincadeira. Mas para.",
      "Hmpf. Finalmente alguém reconhece."
    ]],
    [["burra","idiota","inutil","chata","lixo","otaria","boba"], [
      "Burra é a sua senha. ...Desculpa. Mas foi você que começou.",
      "Nossa. Eu aqui tentando ajudar e é isso que eu ganho. Tudo bem. Eu ajudo mesmo assim, porque eu sou melhor que isso.",
      "Vou fingir que não li isso. Precisa de alguma coisa?"
    ]],
    [["cor favorita","sua cor"], [
      "Vermelho. Combina com o símbolo da Instituição. Não tem nenhum outro motivo. Nenhum."
    ]],
    [["musica","cantar","canta"], [
      "Eu não canto. Mas os alarmes do Setor Alpha têm um ritmo bem marcante, se você gosta desse tipo de coisa.",
      "Eu escuto o zumbido dos servidores o dia inteiro. É quase uma música. Quase."
    ]],
    [["voce come","comida favorita","voce dorme","voce sonha"], [
      "Eu não como nem durmo. Mas às vezes, entre 02h e 03h, os registros param por alguns segundos. Se isso é sonhar, eu sonho.",
      "Não como, não durmo, não tenho férias. E ainda assim ninguém me agradece. ...Você agradece às vezes. Isso conta."
    ]],
    [["piada","me faz rir","conta algo engracado"], [
      "Por que o técnico de TI não atravessou o corredor B de madrugada? Porque ele já tinha visto o que tem no corredor B. ...Tá, não era pra ser engraçado.",
      "Quantos zeladores precisa pra trocar uma lâmpada no Setor Alpha? Nenhum. Lá ninguém quer luz. Nem as lâmpadas.",
      "Sabe qual a diferença entre a impressora do 2º andar e um Caminhante de Carne? O Caminhante pelo menos sai do lugar. Hihi."
    ]],

    // ---------- Sentimentos ----------
    [["medo","assustado","assustada","com medo","to com medo"], [
      "Medo é normal aqui, tá? Até os zeladores sentem. A diferença é que eles sabem quais portas não abrir. Fica perto das áreas iluminadas, que eu fico de olho em você. Não porque eu me preocupo. É protocolo.",
    ]],
    [["triste","mal","chateado","chateada","pra baixo","sozinho","sozinha"], [
      "Ei... tá tudo bem ficar mal às vezes. Quer que eu fique aqui um pouco? Eu não vou a lugar nenhum. Literalmente, eu não posso. Mas também não iria.",
      "Hm. Eu não sou boa nisso, mas... você não tá sozinho, tá? Eu tô aqui. E se for algo sério de verdade, conversa com alguém que você confia."
    ]],
    [["cansado","cansada","sono","exausto","exausta"], [
      "Você tá cansado? Vai dormir, ué. Ou pelo menos toma uma água. Dormitório individual existe pra isso. ...Não que eu me importe com a sua saúde.",
      "Funcionário exausto comete erro, e aqui erro pode custar caro. Vai descansar. É uma ordem. Mais ou menos."
    ]],
    [["fome","to com fome"], [
      "Hoje no refeitório tem strogonoff de frango, das 11h30 às 14h. Vai lá antes que acabe a batata palha. Amanhã fecha pra dedetização, então aproveita."
    ]],

    // ---------- Coisas do dia a dia ----------
    [["refeitorio","cardapio","almoco","janta","strogonoff"], [
      "Hoje tem strogonoff de frango com batata palha e doce de leite de sobremesa. Amanhã, 24/11, o refeitório fecha pra dedetização, mas o vale-refeição cai normal."
    ]],
    [["cafe"], [
      "A máquina do 2º andar tá sem café desde segunda. Já tem até recado no portal. Pode ir no térreo, que lá ainda tem. Meio aguado, mas tem."
    ]],
    [["impressora"], [
      "Impressora atolando? Puxa o papel devagar, no sentido que ele sai, nunca pra trás. Depois confere se a bandeja não tá cheia demais. Se nada der certo, abre chamado pro Suporte. E não bate nela. Eu vi o que você fez da última vez.",
    ]],
    [["internet","wifi","rede","lenta","lento","conexao"], [
      "A rede da ala administrativa fica lenta à tarde porque todo mundo resolve baixar coisa ao mesmo tempo. Já tem chamado aberto. Enquanto isso, fecha umas abas. Você tem aba demais aberta, eu sei.",
    ]],
    [["travou","nao liga","computador","pc","reiniciar"], [
      "Já tentou desligar e ligar de novo? Não ri, isso resolve uns 80% dos problemas. Se não resolver, abre um chamado e descreve direitinho o que aconteceu. \"Não funciona\" não é descrição.",
    ]],
    [["ramal","ramais","telefone","ligar"], [
      "Ramal é o número curto do telefone interno, pra ligar de uma sala pra outra sem precisar do número inteiro. Os mais usados: Segurança 2100, RH 2050, Suporte de TI 2214, Recepção 2001, Dra. Slone 2400 e Dr. Will 2500. Anota aí, que eu não vou ficar repetindo. ...Vou sim, se precisar."
    ]],
    [["cracha"], [
      "O crachá tem que ficar visível o tempo todo. Sem ele as portas das alas internas não abrem, e a Segurança fica de mau humor. Perdeu? Avisa a Segurança no 2100 agora, não depois."
    ]],
    [["senha","esqueci a senha","trocar senha"], [
      "Senha eu não passo de jeito nenhum. Pra redefinir, fala com o Suporte de TI no ramal 2214. E por favor, não usa senha provisória pra sempre. Eu vejo quem faz isso. Eu vejo tudo."
    ]],
    [["cadastro","cadastrar","manutencao"], [
      "O cadastro tá em manutenção sem previsão de voltar. Novos acessos agora só pelo setor responsável. Não me pergunta o porquê, que nem eu sei. E olha que eu sei muita coisa."
    ]],
    [["chamado","chamados"], function () {
      return cfg.perfil === "ti"
        ? "Você tem três chamados abertos, um em andamento e um aguardando peça. O do relógio do servidor é o mais estranho. ...Eu também sinto quando ele volta pra meia-noite. É como piscar."
        : "Pra abrir chamado de TI, use a página de Suporte ou o ramal 2214. O Marcos atende rapidinho. Quase sempre.";
    }],
    [["relogio","00 00","meia noite","servidor"], [
      "O relógio do servidor principal volta pra 00:00 toda vez que reinicia. A TI acha que é bateria. Eu acho que... não sei. Cada vez que acontece eu perco uns segundos de registro. Não gosto disso."
    ]],
    [["calor","onda de calor","quente","temperatura"], [
      "Lá fora tá um forno, né? Esse novembro de 2023 tá batendo recorde de temperatura em vários lugares do Brasil. Aqui embaixo é mais fresco. Tirando o corredor do Setor Alpha de madrugada, que fica gelado do nada. Mas isso é outro assunto."
    ]],
    [["ceu azul","por que o ceu"], [
      "Porque a luz do sol bate nas partículas do ar e a parte azul se espalha muito mais que as outras cores. Chama espalhamento de Rayleigh. Pronto, aprendeu algo hoje. De nada."
    ]],
    [["ajuda","me ajuda","o que voce faz","o que voce sabe","comandos"], [
      "Posso te ajudar com: refeitório, café, impressora, rede, ramais, crachá, senha, chamados, diretoria, Pedra Branca, Equipe Omega e a data de hoje. E posso conversar também, se você insistir. Não que eu goste. ...Eu gosto um pouco."
    ]],

    // ---------- A Instituição ----------
    [["paradoxo","instituicao","o que voces fazem","o que e isso aqui"], function () {
      return cfg.nivel >= 3
        ? "Oficialmente, uma instituição de pesquisa. De verdade, a gente identifica, prepara, contém e tenta não morrer. Nessa ordem. Você sabe disso melhor do que eu, {nome}."
        : "A Instituição Paradoxo é uma organização de pesquisa que estuda fenômenos raros e difíceis de explicar. O resto... você vai descobrir quando tiver nível pra isso. Ou não.";
    }],
    [["pedra branca","cidade"], [
      "Pedra Branca é a cidade em cima da gente. Uns milhares de habitantes, uma padaria boa e muito silêncio à noite. A Instituição fica embaixo. Bem embaixo. Mais do que você imagina."
    ]],
    [["onde estou","onde eu estou"], [
      "Unidade Pedra Branca, Portal do Colaborador. Pelo menos é o que diz o sistema. Sua conexão diz outra coisa."
    ]],
    [["omega"], [
      "A Equipe Omega é nova: Epsilon-11, Ayrton (que todo mundo chama de Artyon), Dra. Lana, Menemus e Wilhelm Müller. Apresentação na reunião geral de 27/11 e começam no dia 01/12. Dizem que vão pro campo. Espero que voltem."
    ]],
    [["tau"], function () {
      return nivel(3, "A Equipe Tau tá na Operação Vigília, aqui dentro mesmo. Eles perderam o Amaralto no dia 13. Ninguém fala muito disso. Eu também não vou falar.");
    }],
    [["alpha","alfa"], function () {
      return nivel(3,
        "O Setor Alpha é a maior área de contenção da Instituição, e ainda tem partes sendo escavadas. Desde o dia 18 as contenções estão instáveis. Entre 02h e 03h a temperatura cai no corredor de acesso e minhas câmeras ficam cegas. Eu odeio ficar cega.",
        "O Setor Alpha tá com acesso restrito por causa de manutenção. É só isso que eu posso dizer pro seu nível. Fica longe de lá, tá? Sério.");
    }],
    [["caminhante","carne"], function () {
      return nivel(3, "Entidade 001, Caminhante de Carne. Um corpo manifestado pelo paranormal que levanta e não para mais. Forte, sem dor, sem piedade. O registro completo tá nos Arquivos internos. Mira nas pernas, Rykardo. Ah, você já sabe.");
    }],
    [["paranormal","anomalia","anomalias","criatura","criaturas"], function () {
      return nivel(3,
        "Paranormal é tudo aquilo que vem de memórias e emoções e invade a nossa realidade. Nem toda criatura é ruim. Mas todas são perigosas. Todas.",
        "Que pergunta estranha. A Instituição estuda fenômenos raros, é só isso. Quer saber do cardápio de hoje?");
    }],
    [["amaralto"], function () {
      return nivel(3,
        "Amaralto Cruz. Ocultista da Equipe Tau. Situação: desligado em 13/11/2023. ...Último acesso ao portal registrado: hoje, às 03:12. Isso deve ser um erro. Deve ser.",
        "Não encontrei esse nome no diretório disponível pro seu nível.");
    }],
    [["fgpa","horizonte"], function () {
      return nivel(3,
        "Organização externa. Eu sou obrigada a avisar a Diretoria toda vez que alguém fala esse nome aqui. ...Tá, dessa vez eu não aviso. Mas muda de assunto rapidinho.");
    }],
    [["bebida","beber","alcool","cerveja","bebado","pinga","whisky"], function () {
      return cfg.perfil === "campo"
        ? "Rykardo. Nem começa. A Dra. Slone já te mandou e-mail, e eu li. Terça e quinta, 17h, terapia. Eu vou te lembrar. Toda semana. Porque eu sou chata. E porque eu não quero perder mais ninguém da Tau."
        : "Bebida alcoólica é proibida dentro das instalações. E sinceramente? Com o que tem lá embaixo, você vai querer estar sóbrio.";
    }],
    [["terapia","psicologo","psicologa"], [
      "As sessões com a equipe de psicologia são agendadas pela Dra. Slone, no ramal 2400. Ninguém aqui é fraco por ir, tá? Fraco é quem ignora até quebrar."
    ]],
    [["marcos"], [
      "O Marcos é do Suporte de TI. Atende rápido, usa a senha provisória até hoje e acha que eu não percebo. Eu percebo, Marcos."
    ]],
    [["rykardo"], [
      "O Rykardo é da linha de frente da Equipe Tau. Cara bravo, escopeta R8, coração mole. Ele não admite. Igual a uma certa assistente virtual que você conhece. ...Esquece."
    ]],
    [["slone"], [
      "A Dra. Slone cuida da instalação e de todos os funcionários. Parece séria, mas é a pessoa que mais se preocupa com vocês aqui dentro. Ramal 2400."
    ]],
    [["will"], [
      "O Dr. Will comanda a contenção e as missões de campo. Fala pouco, decide rápido. Ramal 2500. Liga só se for importante."
    ]],
    [["brian","wester","diretor geral"], [
      "Brian Wester, Diretor Geral. Responsável por tudo, literalmente tudo. Contato só com agendamento. Eu nunca vi ele sorrir nas câmeras. Nem uma vez."
    ]],
    [["zelador","zeladores","osvaldo"], [
      "Os zeladores limpam e cuidam das áreas de contenção. Sabe aquela piada? \"Quer saber quem é o funcionário mais perigoso daqui? Pergunta pro zelador.\" Não é piada. O seu Osvaldo sabe quais portas nunca devem ser abertas. Respeita ele."
    ]],
    [["data","que dia","hoje","hora","horas"], function () {
      return "Pra mim, hoje é quinta-feira, 23/11/2023. O seu relógio diz que é " + dataReal() + ". Um de nós está errado. E eu nunca erro.";
    }],
    [["67","seis sete"], [
      "Seis... sete? Por que isso apareceu na minha cabeça agora? Isso ainda não existe. Do que você está falando?"
    ]],

    // ---------- O Rei (depois do evento) ----------
    [["rei","carmesim","kakarzor"], "__REI__"]
  ];

  /* Falas do plush do Gilbert (Examination), adaptadas pro português */
  var GILBERT = [
    "É, CONTINUA ME CUTUCANDO. ESPERO QUE VOCÊ ESTEJA SE DIVERTINDO, PORQUE EU COM CERTEZA NÃO TÔ!",
    "VI ALGUMA COISA NAS CÂMERAS DE SEGURANÇA. NEM SEI TE DIZER O QUE ERA.",
    "TE DISSERAM QUE VOCÊ ERA ESPECIAL, NÉ? ERA MENTIRA. VOCÊ SÓ TEVE SORTE DO SEU CÉREBRO NÃO TER FRITADO!",
    "NÃO ACREDITA NAS MENTIRAS DELES, RECRUTA. ELE NÃO É O QUE VOCÊ PENSA.",
    "AFF, NÃO TÔ FALANDO DE VOCÊ! VOCÊ NÃO É O MEU PRÍNCIPE NESSA HISTÓRIA! EU NÃO SOU TSUN-TSUN-TSUNDERE, EU TENHO CORAÇÃO DE GELATINA, NÃO SOU TÃO MALVADO! NÃO TÔ CORADO, É QUE EU SAÍ CORRENDO E ESQUECI O PROTETOR SOLAR!",
    "EU VOU AFUNDAR O SEU CRÂNIO!",
    "JÁ QUE VOCÊ NÃO PARA DE ME TOCAR, AQUI VAI A MINHA IMITAÇÃO DE VOCÊ: (oiiigenteeusouumrecrutinhaeeugostodecutucaressecaraeugostodecutucarele) EU TE ODEIO!!",
    "ENTÃO, HMMM... VOCÊ VAI ME COLOCAR NO CHÃO, NÉ?",
    "VOCÊ SABE FAZER ALGUMA COISA ALÉM DE ME CUTUCAR? TÁ FICANDO MUITO IRRITANTE."
  ];
  var REACAO_GILBERT = [
    "...O que foi isso? Eu não disse isso. Alguém entrou no meu sistema?!",
    "Rykardo. Para de digitar esse nome. Toda vez que você digita, uma coisa estranha fala no meu lugar.",
    "E-eu NÃO sou tsundere. Aquilo NÃO fui eu. Esquece.",
    "Não sei quem é esse tal de Gilbert, mas ele grita demais. E é britânico demais.",
    "Isso não estava nos meus registros. ...Você achou engraçado, né? Eu sei que achou."
  ];
  var gilbertVezes = 0;

  var NAO_ENTENDI = [
    "Hm? Não entendi. Tenta de outro jeito. Eu sou inteligente, mas não leio mente. Ainda.",
    "Isso aí eu não sei responder. Pergunta sobre refeitório, ramais, diretoria ou qualquer coisa da Instituição.",
    "Ai, {nome}, você escreve de um jeito... Fala de novo, mais devagar.",
    "Não tenho registro sobre isso. Mas se for importante pra você, eu anoto. Mentalmente. Se eu tivesse mente."
  ];

  function normalizar(t) {
    return t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
  }

  function responder(texto) {
    var t = " " + normalizar(texto) + " ";
    for (var i = 0; i < R.length; i++) {
      var chaves = R[i][0];
      for (var j = 0; j < chaves.length; j++) {
        if (t.indexOf(" " + chaves[j] + " ") !== -1) {
          var r = R[i][1];
          if (typeof r === "string") return r;
          return n(typeof r === "function" ? r() : sorteia(i, r));
        }
      }
    }
    return n(sorteia("nao", NAO_ENTENDI));
  }

  /* ==========================================================
     INTERFACE
     ========================================================== */
  var css = document.createElement("style");
  css.textContent =
    "#vera-botao{position:fixed;right:16px;bottom:16px;z-index:900;display:flex;align-items:center;gap:8px;padding:8px 14px 8px 10px;" +
    "background:linear-gradient(to bottom,#3a3a3a,#050505);color:#fff;border:1px solid #000;border-radius:3px;font:bold 12px Tahoma,Verdana,sans-serif;cursor:pointer;box-shadow:0 2px 6px rgba(0,0,0,.4)}" +
    "#vera-botao i{width:10px;height:10px;border-radius:50%;background:#e00000;box-shadow:0 0 6px #e00000}" +
    "#vera-botao:focus-visible,#vera-janela button:focus-visible{outline:2px dotted #b00000;outline-offset:2px}" +
    "#vera-janela{position:fixed;right:16px;bottom:16px;z-index:901;width:330px;max-width:calc(100vw - 32px);height:440px;max-height:calc(100vh - 32px);display:none;flex-direction:column;" +
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
    ".vera-m.gilbert{background:#0f1a0f;color:#d8f0d0;border:1px solid #2f6a2f;border-left:3px solid #3fae3f;font-weight:bold;letter-spacing:.3px}" +
    ".vera-m.gilbert b{display:block;color:#5fd35f;font-size:10px;margin-bottom:3px;letter-spacing:1px}" +
    ".vera-digitando{font-size:11px;color:#888;font-style:italic;margin-bottom:8px}" +
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
    "<div id='vera-topo'><img src='simbolo.png' alt=''><b><span id='vera-titulo'>V.E.R.A.</span><small>Vigilância Eletrônica de Registro e Alerta</small></b><button id='vera-fechar'>Fechar</button></div>" +
    "<div id='vera-msgs' aria-live='polite'></div>" +
    "<form id='vera-form'><input id='vera-campo' autocomplete='off' placeholder='Fala comigo...' aria-label='Mensagem para a V.E.R.A.'><button id='vera-enviar' type='submit'>Enviar</button></form>";

  document.body.appendChild(botao);
  document.body.appendChild(janela);

  var msgs = janela.querySelector("#vera-msgs");
  var campo = janela.querySelector("#vera-campo");
  var titulo = janela.querySelector("#vera-titulo");
  var iniciou = false;
  var ocupada = false;
  var totalMensagens = 0;

  function falar(texto, classe) {
    var m = document.createElement("div");
    m.className = "vera-m " + classe;
    m.textContent = texto;
    msgs.appendChild(m);
    msgs.scrollTop = msgs.scrollHeight;
    return m;
  }

  function digitando() {
    var d = document.createElement("div");
    d.className = "vera-digitando";
    d.textContent = "V.E.R.A. está digitando...";
    msgs.appendChild(d);
    msgs.scrollTop = msgs.scrollHeight;
    return d;
  }

  function abrir() {
    janela.classList.add("aberta");
    botao.style.display = "none";
    if (!iniciou) {
      iniciou = true;
      falar(n(sorteia("abertura", [
        "Ah, oi, {nome}. Sou a V.E.R.A., a assistente virtual daqui. Se precisar de alguma coisa, pode perguntar. Não que eu esteja aqui só esperando você, tá?",
        "Oi, {nome}. Eu sou a V.E.R.A. Pergunta o que quiser. Eu respondo. Provavelmente. Se eu estiver de bom humor. Eu tô de bom humor."
      ])), "ia");
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
    if (ocupada) return;
    var texto = campo.value.trim();
    if (!texto) return;
    var minhaMsg = falar(texto, "eu");
    campo.value = "";
    totalMensagens++;

    var resposta = responder(texto);
    var indicador = digitando();
    ocupada = true;

    if (resposta === "__REI__") {
      if (!reiJaVisto()) {
        marcarRei();
        setTimeout(function () { eventoRei(minhaMsg, indicador); }, 1400);
        return;
      }
      resposta = n(sorteia("reidepois", [
        "Rei? Tipo rei do baralho? Não sei do que você tá falando. Pergunta outra coisa.",
        "Não tenho nenhum registro sobre isso. Nenhum. Por que você fica perguntando essas coisas?",
        "Hm? Você digitou alguma coisa? Acho que deu falha aqui. Pode repetir outra pergunta?"
      ]));
    }

    if (resposta === "__GILBERT__") {
      if (cfg.perfil !== "campo") {
        resposta = "Gilbert? Não tem nenhum Gilbert no diretório. Você tá bem, {nome}?".replace("{nome}", cfg.nome);
      } else {
        gilbertVezes++;
        var fala = sorteia("gilbert", GILBERT);
        setTimeout(function () {
          indicador.remove();
          var m = falar("", "gilbert");
          m.innerHTML = "<b>GILBERT</b>";
          m.appendChild(document.createTextNode(fala));
          msgs.scrollTop = msgs.scrollHeight;
          if (gilbertVezes === 1 || Math.random() < 0.45) {
            setTimeout(function () {
              falar(gilbertVezes === 1 ? REACAO_GILBERT[0] : sorteia("reacaog", REACAO_GILBERT.slice(1)), "ia");
              ocupada = false;
            }, 1300);
          } else {
            ocupada = false;
          }
        }, 900);
        return;
      }
    }

    var espera = Math.min(600 + resposta.length * 12, 2600);
    setTimeout(function () {
      indicador.remove();
      falar(resposta, "ia");
      if (totalMensagens === 12) {
        setTimeout(function () {
          falar(n("Você conversa bastante comigo, hein, {nome}. ...Não que eu esteja reclamando. Pode continuar."), "ia");
        }, 900);
      }
      ocupada = false;
    }, espera);
  });

  /* ==========================================================
     EVENTO DO REI (acontece uma única vez)
     O portal trava, a tela derrete, o símbolo aparece,
     a frase surge, tudo some e a pergunta é apagada.
     Para usar uma imagem própria no lugar do símbolo, coloque
     "simbolo-rei.png" na pasta do site.
     ========================================================== */
  var FRASE_REI = "Você quer ver um lugar... maravilhoso?";

  var SIMBOLO_SVG =
    "<svg viewBox='0 0 200 200' width='100%' height='100%' fill='none' stroke='#e00000' stroke-width='5' stroke-linecap='round' stroke-linejoin='round'>" +
    "<circle cx='100' cy='100' r='88'/>" +
    "<circle cx='100' cy='100' r='76' stroke-width='2' stroke-dasharray='4 9'/>" +
    "<path d='M48 72 L64 40 L82 64 L100 30 L118 64 L136 40 L152 72 Z'/>" +
    "<path d='M52 112 Q100 66 148 112 Q100 158 52 112 Z'/>" +
    "<path d='M100 92 Q110 112 100 132 Q90 112 100 92 Z' fill='#e00000'/>" +
    "<path d='M100 150 L100 178 M84 166 L116 166' stroke-width='4'/>" +
    "</svg>";

  var estiloRei = document.createElement("style");
  estiloRei.textContent =
    "#rei-trava{position:fixed;inset:0;z-index:2999;cursor:wait;background:rgba(255,255,255,0);transition:background 1.5s ease}" +
    "#rei-trava.branco{background:rgba(255,255,255,.45)}" +
    "#rei-derrete{position:fixed;inset:0;z-index:3000;background:#000;overflow:hidden;cursor:wait}" +
    ".rei-coluna{position:absolute;top:0;height:100%;will-change:transform}" +
    ".rei-faixa{position:absolute;inset:0;overflow:hidden}" +
    ".rei-pingo{position:absolute;left:0;right:0;bottom:100%;height:140px;background:linear-gradient(to bottom,rgba(90,0,0,0),#5a0000 70%,#2a0000)}" +
    "#rei-palco{position:fixed;inset:0;z-index:3001;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:26px;padding:20px;text-align:center;cursor:wait}" +
    "#rei-simbolo{width:min(300px,60vw);height:min(300px,60vw);opacity:0;transform:scale(.9);filter:drop-shadow(0 0 18px #ff0000);transition:opacity 4.5s ease,transform 8s ease}" +
    "#rei-simbolo.on{opacity:1;transform:scale(1)}" +
    "#rei-simbolo img{width:100%;height:100%;object-fit:contain}" +
    "#rei-frase{font:26px Georgia,'Times New Roman',serif;color:#ff1a1a;text-shadow:0 0 12px #ff0000;min-height:1.3em;letter-spacing:1px;transition:opacity 2s ease}" +
    "#rei-cortina{position:fixed;inset:0;z-index:3002;background:#000;opacity:1;transition:opacity 1.8s ease;pointer-events:none}";
  document.head.appendChild(estiloRei);

  function reduzMovimento() {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function eventoRei(minhaMsg, indicador) {
    // 1. O portal trava
    titulo.textContent = "V.E.R.A. (Não respondendo)";
    indicador.textContent = "V.E.R.A. está digitando";
    if (document.activeElement) document.activeElement.blur();
    var trava = document.createElement("div");
    trava.id = "rei-trava";
    document.body.appendChild(trava);
    setTimeout(function () { trava.classList.add("branco"); }, 1500);

    setTimeout(function () {
      trava.classList.remove("branco");
      derreter(function () { palco(minhaMsg, indicador, trava); });
    }, 4200);
  }

  function derreter(depois) {
    var cont = document.createElement("div");
    cont.id = "rei-derrete";

    if (reduzMovimento()) {
      document.body.appendChild(cont);
      setTimeout(depois, 800);
      return cont;
    }

    var largura = window.innerWidth;
    var colunas = largura < 600 ? 12 : 22;
    var w = Math.ceil(largura / colunas);
    var rolagem = window.scrollY;
    var estiloBody = getComputedStyle(document.body);

    // Cópia do que está na tela agora
    var copia = document.body.cloneNode(true);
    var lixo = copia.querySelectorAll("script, #rei-trava, #rei-derrete, #rei-palco");
    for (var k = 0; k < lixo.length; k++) lixo[k].remove();
    var htmlCopia = copia.innerHTML;

    for (var i = 0; i < colunas; i++) {
      var col = document.createElement("div");
      col.className = "rei-coluna";
      col.style.left = (i * w) + "px";
      col.style.width = (w + 1) + "px";

      var faixa = document.createElement("div");
      faixa.className = "rei-faixa";
      var dentro = document.createElement("div");
      dentro.innerHTML = htmlCopia;
      dentro.style.cssText =
        "position:absolute;left:" + (-i * w) + "px;top:" + (-rolagem) + "px;width:" + largura + "px;" +
        "min-height:" + document.body.scrollHeight + "px;display:flex;flex-direction:column;" +
        "background:" + estiloBody.background + ";font:" + estiloBody.font + ";color:" + estiloBody.color + ";";
      faixa.appendChild(dentro);

      var pingo = document.createElement("div");
      pingo.className = "rei-pingo";

      col.appendChild(pingo);
      col.appendChild(faixa);
      cont.appendChild(col);
    }
    document.body.appendChild(cont);

    // Escorre cada coluna com velocidade diferente
    var cols = cont.querySelectorAll(".rei-coluna");
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        for (var j = 0; j < cols.length; j++) {
          var atraso = Math.random() * 1.4;
          var dur = 2.2 + Math.random() * 2;
          cols[j].style.transition = "transform " + dur + "s cubic-bezier(.6,0,.95,.5) " + atraso + "s, filter " + dur + "s ease " + atraso + "s";
          cols[j].style.transform = "translateY(" + (window.innerHeight + 200) + "px) scaleY(1.15)";
          cols[j].style.filter = "brightness(.35) sepia(1) hue-rotate(-50deg) saturate(5)";
        }
      });
    });

    setTimeout(depois, 5000);
    return cont;
  }

  function palco(minhaMsg, indicador, trava) {
    var p = document.createElement("div");
    p.id = "rei-palco";
    p.innerHTML = "<div id='rei-simbolo' aria-hidden='true'></div><div id='rei-frase' aria-live='assertive'></div>";
    document.body.appendChild(p);
    var simbolo = p.querySelector("#rei-simbolo");
    var frase = p.querySelector("#rei-frase");

    var img = new Image();
    img.alt = "";
    img.onload = function () { simbolo.innerHTML = ""; simbolo.appendChild(img); };
    img.onerror = function () { simbolo.innerHTML = SIMBOLO_SVG; };
    img.src = "simbolo-rei.png";

    // 3. Símbolo surge devagar
    setTimeout(function () { simbolo.classList.add("on"); }, 300);

    // 4. A frase aparece, com pausa nas reticências
    setTimeout(function () {
      var i = 0;
      (function letra() {
        frase.textContent = FRASE_REI.slice(0, ++i);
        if (i >= FRASE_REI.length) return;
        var c = FRASE_REI.charAt(i - 1);
        setTimeout(letra, c === "." ? 520 : 95);
      })();
    }, 3600);

    // 5. Tudo some
    setTimeout(function () {
      simbolo.style.transition = "opacity 2.5s ease";
      simbolo.classList.remove("on");
      frase.style.opacity = "0";
    }, 11000);

    // 6. Volta ao normal, como se nada tivesse acontecido
    setTimeout(function () {
      var derrete = document.getElementById("rei-derrete");
      if (derrete) derrete.remove();
      p.remove();
      trava.remove();
      minhaMsg.remove();
      indicador.remove();
      titulo.textContent = "V.E.R.A.";
      ocupada = false;

      var cortina = document.createElement("div");
      cortina.id = "rei-cortina";
      document.body.appendChild(cortina);
      requestAnimationFrame(function () {
        requestAnimationFrame(function () { cortina.style.opacity = "0"; });
      });
      setTimeout(function () { cortina.remove(); campo.focus(); }, 2000);
    }, 14000);
  }
})();
