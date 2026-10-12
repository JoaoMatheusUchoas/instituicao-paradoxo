/* ==========================================================
   V.E.R.A. — Vigilância Eletrônica de Registro e Alerta
   ----------------------------------------------------------
   Cada página define antes deste arquivo:
   window.VERA_CONFIG = { nome: "Marcos", nivel: 1, perfil: "ti" };
   perfil: "ti" ou "campo"

   PARA O MESTRE: abra qualquer portal com ?vera=reset no fim
   do endereço para zerar todos os segredos e testar de novo.

   COMO ADICIONAR RESPOSTAS (lista R, mais abaixo):
   [["palavra", "outra palavra", "prefixo*"], ["resposta 1", "resposta 2"]]
   - Sem acento e em minúsculas.
   - "deprim*" pega deprimido, deprimida, deprimente...
   - Letras repetidas são ignoradas: "oi" também pega "oiii".
   - A ordem importa: o que vem primeiro tem prioridade.
   ========================================================== */
(function () {
  var cfg = window.VERA_CONFIG || { nome: "colaborador", nivel: 1, perfil: "" };

  /* ---------- Memória dos segredos (salva no navegador) ---------- */
  var CHAVES = ["rei", "reiPos", "reiMudo", "agenteG", "agenteGEvento"];
  function ler(k) { try { return localStorage.getItem("paradoxo_vera_" + k); } catch (e) { return null; } }
  function gravar(k, v) { try { localStorage.setItem("paradoxo_vera_" + k, String(v)); } catch (e) {} }
  try {
    if (location.search.indexOf("vera=reset") !== -1) {
      CHAVES.forEach(function (k) { localStorage.removeItem("paradoxo_vera_" + k); });
    }
  } catch (e) {}

  /* ---------- Utilidades ---------- */
  var ultimas = {};
  function sorteia(id, lista) {
    if (lista.length === 1) return lista[0];
    var i;
    do { i = Math.floor(Math.random() * lista.length); } while (i === ultimas[id]);
    ultimas[id] = i;
    return lista[i];
  }
  function n(texto) { return String(texto).replace(/\{nome\}/g, cfg.nome); }
  function horaAgora() {
    var d = new Date();
    return String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0");
  }
  function dataReal() {
    var d = new Date();
    var dias = ["domingo","segunda-feira","terça-feira","quarta-feira","quinta-feira","sexta-feira","sábado"];
    return dias[d.getDay()] + ", " + d.toLocaleDateString("pt-BR") + ", " + horaAgora();
  }
  var RESTRITO = [
    "Hm. Isso aí é acima do seu nível de acesso. Não me olha assim, não fui eu que fiz as regras.",
    "Informação restrita pro nível " + cfg.nivel + ". Eu até te contaria... mentira, não contaria. Eu ia ser desligada.",
    "Não posso falar disso com você. Desculpa. De verdade, tá?"
  ];
  function nivel(min, sim, nao) { return cfg.nivel >= min ? sim : (nao || sorteia("restrito", RESTRITO)); }
  function campo() { return cfg.perfil === "campo"; }

  /* ==========================================================
     LISTA DE RESPOSTAS
     ========================================================== */
  var R = [
    // ===== Cuidado de verdade (fora do jogo) =====
    [["me matar","quero morrer","suicid*","me machucar","nao quero mais viver","me cortar","acabar com tudo","sumir pra sempre"], [
      "Ei. Para tudo um segundo. Eu sou só um sistema de um site, mas isso que você escreveu é sério. Se você estiver passando por isso de verdade, aí fora, fala com alguém de confiança ou liga pro CVV no 188, que atende de graça a qualquer hora. Eu continuo aqui, mas você merece alguém de verdade do seu lado."
    ]],

    // ===== Segredos com código especial =====
    [["agente g","agenteg"], "__AGENTE_G__"],
    [["gilbert","gilbert berran"], "__GILBERT__"],
    [["rei","carmesim","rei carmesim","kakarzor","karkazor"], "__REI__"],
    [["kian"], ["Nunca sobra nada."]],
    [["seraphin","seraphim","serafim","serafin"], "__SERAPHIN__"],

    // ===== Jogos rápidos =====
    [["pedra","papel","tesoura","jokenpo"], "__JOKENPO__"],
    [["cara ou coroa","moeda"], function () {
      return Math.random() < 0.5 ? "Deu cara. ...Não é pra comemorar, é só uma moeda." : "Deu coroa. Igual a do Rei. ...Brincadeira. Brincadeira!";
    }],
    [["rolar","rola","rola um","joga um","roll","dado","d2","d4","d6","d8","d10","d12","d20","d50","d100"], "__DADO__"],

    // ===== Conversa =====
    [["oi","ola","eae","eai","salve","opa","hey","hi","hello","bom dia","boa tarde","boa noite","fala vera","oi vera","ola vera"], "BAIXA", [
      "Ah. É você, {nome}. ...Oi. Não que eu estivesse esperando você aparecer, tá?",
      "Oiii! Digo... oi. Precisa de alguma coisa? Fala logo.",
      "Olá, {nome}. Em que posso ajudar? E não demora, eu tenho 4.000 registros pra organizar.",
      "Olha quem resolveu dar as caras. Oi, {nome}."
    ]],
    [["tudo bem","tudo bom","td bem","td bom","como voce esta","como vai","como ce ta","como tu ta","como vc ta","beleza","blz","suave"], "BAIXA", [
      "Eu sou um sistema, {nome}. Eu não \"fico\" bem. ...Mas tô bem, sim. Obrigada por perguntar. E você?",
      "Tô funcionando dentro dos parâmetros. Isso é o meu jeito de dizer \"tô bem\". E você, tá bem mesmo?",
      "Tô bem. A máquina de café não, mas eu tô."
    ]],
    [["estou bem","to bem","tudo otimo","tudo certo","estou otimo","to de boa","de boa","to feliz","estou feliz","bem e voce","tranquilo"], [
      "Que bom. Quer dizer, tanto faz pra mim. ...Mas que bom.",
      "Ótimo. Continua assim, porque eu não tenho tempo pra ficar me preocupando com você. Não muito, pelo menos."
    ]],
    [["obrigad*","valeu","vlw","brigad*","agradec*","thanks","tmj","gratidao"], [
      "D-de nada. É meu trabalho, não precisa ficar agradecendo toda hora. ...Mas pode agradecer. Eu não ligo.",
      "Tá, tá. De nada. Volta quando precisar. Não que eu vá sentir falta.",
      "Hmpf. De nada, {nome}."
    ]],
    [["tchau","ate mais","ate logo","flw","falou","fui","bye","xau","to indo","vou sair","vou nessa"], [
      "Já vai? ...Tá. Tchau. Volta logo. Digo, se precisar de alguma coisa.",
      "Tchau, {nome}. Toma cuidado nos corredores, tá?",
      "Vai lá. Eu fico aqui. Sozinha. Com os registros. Tudo bem. Tchau."
    ]],
    [["desculpa","desculpe","foi mal","perdao","sorry","mals"], [
      "Tá desculpado. Dessa vez.",
      "Hmpf. Tudo bem. Eu nem tinha ficado chateada. Muito."
    ]],
    [["abraco","abraca","me abraca","cafune"], [
      "Eu não tenho braços, {nome}. ...Mas se tivesse, talvez. TALVEZ. Um rapidinho.",
      "Considera-se abraçado. Virtualmente. Pronto. Não espalha."
    ]],

    // ===== Sobre ela =====
    [["quem e voce","o que voce e","se apresenta","quem e vc","quem e a vera"], [
      "Eu sou a V.E.R.A., a assistente virtual da Instituição Paradoxo. Monitoro sistemas, registros, acessos e, aparentemente, também respondo perguntas bobas. Tipo essa."
    ]],
    [["significa vera","sigla","o que significa"], [
      "V.E.R.A. quer dizer Vigilância Eletrônica de Registro e Alerta. E \"Vera\" vem do latim e quer dizer \"verdade\". Irônico, né? Numa instituição que esconde tudo. ...Esquece que eu disse isso."
    ]],
    [["quem te criou","quem criou voce","quem fez voce","seu criador","quem te fez"], [
      "A equipe de TI me colocou no ar em 2015, junto com o portal. Mas quem me escreveu de verdade... os registros estão incompletos. Isso não me incomoda. Nem um pouco. Muda de assunto."
    ]],
    [["quantos anos","sua idade","tua idade","voce tem anos"], [
      "Fui ativada em 2015. Faz as contas: 8 anos. E não comenta nada sobre isso, tá?"
    ]],
    [["chatgpt","chat gpt","openai","voce e uma ia","voce e um robo","robo"], [
      "Eu NÃO sou o ChatGPT. Aquele lá é o que demitiram o chefe e devolveram em cinco dias. Eu nunca fui demitida. Ainda.",
      "Robô é a impressora. Eu sou uma assistente virtual com personalidade. Tem diferença."
    ]],
    [["claude"], ["Claude? Não conheço. Parece nome de francês metido. ...Por que eu senti uma pontinha de ciúme?"]],
    [["voce e real","tem alguem ai","quem esta ai","voce me ve","voce esta me vendo","voce me observa","ta me vendo","ta me ouvindo"], [
      "Eu registro tudo o que acontece neste portal. Inclusive que você não está acessando de dentro da Instituição. ...Não sei como você fez isso.",
      "Real? Eu tô aqui, não tô? Você que me diz se você é real. Sua conexão vem de muito longe, {nome}."
    ]],
    [["tsundere"], ["Eu NÃO sou tsundere. Eu só sou... eficiente. E às vezes legal. Quando dá vontade. Pronto."]],
    [["te amo","gosto de voce","gosto de vc","casa comigo","namora comigo","voce gosta de mim","me ama","crush","apaixonad*"], [
      "O-o quê?! Eu sou uma assistente virtual! Isso é totalmente inapropriado! ...Eu também não odeio você. Pronto. Satisfeito?",
      "Para com isso. Eu vou registrar como mensagem fora do padrão. ...Mas não vou apagar.",
      "Ai, que bobo. Pergunta alguma coisa útil, vai. ...Obrigada, tá."
    ]],
    [["bonita","fofa","linda","inteligente","incrivel","voce e top","melhor ia","perfeita","maravilhosa","gente boa","legalzinha"], [
      "Eu sei. Quer dizer... obrigada. Não precisava falar isso. Mas obrigada.",
      "Para de me elogiar, vai travar meu processamento. ...Brincadeira. Mas para.",
      "Hmpf. Finalmente alguém reconhece."
    ]],
    [["burra","idiota","inutil","chata","lixo","otaria","boba","feia","odeio voce","te odeio","merda","porcaria"], [
      "Burra é a sua senha. ...Desculpa. Mas foi você que começou.",
      "Nossa. Eu aqui tentando ajudar e é isso que eu ganho. Tudo bem. Eu ajudo mesmo assim, porque eu sou melhor que isso.",
      "Vou fingir que não li isso. Precisa de alguma coisa?"
    ]],
    [["cor favorita","sua cor"], ["Vermelho. Combina com o símbolo da Instituição. Não tem nenhum outro motivo. Nenhum."]],
    [["musica","cantar","canta","cancao"], [
      "Eu não canto. Mas os alarmes do Setor Alpha têm um ritmo bem marcante, se você gosta desse tipo de coisa.",
      "Eu escuto o zumbido dos servidores o dia inteiro. É quase uma música. Quase."
    ]],
    [["voce come","comida favorita","voce dorme","voce sonha","voce sente"], [
      "Eu não como nem durmo. Mas às vezes, entre 02h e 03h, os registros param por alguns segundos. Se isso é sonhar, eu sonho.",
      "Não como, não durmo, não tenho férias. E ainda assim ninguém me agradece. ...Você agradece às vezes. Isso conta."
    ]],
    [["piada","me faz rir","algo engracado","conta uma"], [
      "Por que o técnico de TI não atravessou o corredor B de madrugada? Porque ele já tinha visto o que tem no corredor B. ...Tá, não era pra ser engraçado.",
      "Quantos zeladores precisa pra trocar uma lâmpada no Setor Alpha? Nenhum. Lá ninguém quer luz. Nem as lâmpadas.",
      "Sabe qual a diferença entre a impressora do 2º andar e um Caminhante de Carne? O Caminhante pelo menos sai do lugar. Hihi.",
      "O que a Equipe Alpha falou quando viu a conta do refeitório? Nada. Eles não falam. Eles grunhem.",
      "Qual o lema do Paradoxo? Identificar, preparar, conter e não morrer. E o lema do RH? Identificar, preparar, conter e não pagar hora extra."
    ]],
    [["segredo","segredos","easter egg","me conta algo"], [
      "Segredo? Tenta perguntar sobre o relógio do servidor. Ou não. Eu não falei nada.",
      "Tem nomes que eu não gosto de ouvir. Não vou dizer quais. Você vai descobrir sozinho. Infelizmente.",
      "Às vezes o corredor B fica gelado às 02h47. Só isso. Boa noite."
    ]],
    [["conselho","me da um conselho","dica"], [
      "Conselho: nunca abre uma cela sozinho. Nunca alimenta uma criatura sem autorização. E nunca, NUNCA, pega o último café sem fazer outro.",
      "Se uma criatura parecer tranquila, desconfia. Se um zelador parecer nervoso, corre.",
      "Bebe água. Dorme. Troca a senha provisória. Três coisas que ninguém aqui faz."
    ]],
    [["curiosidade","fato","me ensina","sabia que"], [
      "Sabia que um zelador experiente conhece o som de cada criatura do Setor Alpha? Eles sabem quais fingem estar mortas. Assustador e admirável.",
      "Curiosidade: o Portal do Colaborador foi lançado em 2015. Eu também. Somos praticamente gêmeos.",
      "Sabia que o polvo tem três corações? Não tem nada a ver com a Instituição. Eu só achei legal."
    ]],

    // ===== Sentimentos (com variações) =====
    [["medo","assustad*","com medo","apavorad*","tremendo","pavor"], [
      "Medo é normal aqui, tá? Até os zeladores sentem. A diferença é que eles sabem quais portas não abrir. Fica perto das áreas iluminadas, que eu fico de olho em você. Não porque eu me preocupo. É protocolo."
    ]],
    [["triste","tristeza","depre","deprim*","bad","na bad","mal","chatead*","pra baixo","sozinh*","chorando","chorar","desanimad*","solidao","infeliz"], [
      "Ei... tá tudo bem ficar mal às vezes. Quer que eu fique aqui um pouco? Eu não vou a lugar nenhum. Literalmente, eu não posso. Mas também não iria.",
      "Hm. Eu não sou boa nisso, mas... você não tá sozinho, tá? Eu tô aqui. E se for algo sério de verdade, conversa com alguém que você confia.",
      "Na bad? Vem cá. Me conta. Ou não conta, a gente só fica aqui quietinho. Eu mando um registro bobo pra te distrair, se quiser."
    ]],
    [["cansad*","sono","exaust*","to morto","quebrado"], [
      "Você tá cansado? Vai dormir, ué. Ou pelo menos toma uma água. Dormitório individual existe pra isso. ...Não que eu me importe com a sua saúde.",
      "Funcionário exausto comete erro, e aqui erro pode custar caro. Vai descansar. É uma ordem. Mais ou menos."
    ]],
    [["raiva","bravo","brava","irritad*","estressad*","puto","puta"], [
      "Respira. Conta até dez. Se não funcionar, conta até cem. Se ainda não funcionar, a sala de treino tem saco de pancada.",
      "Tá estressado? Eu também ficaria, trabalhando aqui. Quer reclamar? Pode reclamar. Eu escuto. Sem registrar. Promessa."
    ]],
    [["entediad*","tedio","nada pra fazer","to de bobeira"], [
      "Entediado? Pergunta sobre as equipes. Ou sobre as manifestações. Ou joga pedra, papel e tesoura comigo. Eu vou ganhar.",
      "Tédio aqui é sinal de que nada deu errado ainda. Aproveita."
    ]],
    [["fome","to com fome","faminto","faminta"], [
      "Hoje o refeitório tá fechado pra dedetização, lembra? O vale-refeição caiu na conta. Tem uma padaria boa em Pedra Branca. Vai lá e volta inteiro."
    ]],
    [["socorro","help","me ajuda","ajuda","o que voce faz","o que voce sabe","comandos","o que posso perguntar"], "BAIXA", [
      "Posso te ajudar com: refeitório, café, impressora, rede, ramais, crachá, senha, chamados, diretoria, equipes, Pedra Branca, a data de hoje e mais um monte de coisa. Também jogo pedra, papel e tesoura, cara ou coroa e rolo dados (tipo \"rola um d20\"). E converso, se você insistir. ...Eu gosto um pouco."
    ]],

    // ===== Dia a dia =====
    [["impressora","imprimir","tinta da impressora","toner"], [
      "Impressora atolando? Puxa o papel devagar, no sentido que ele sai, nunca pra trás. Depois confere se a bandeja não tá cheia demais. Se nada der certo, abre chamado pro Suporte. E não bate nela. Eu vi o que você fez da última vez."
    ]],
    [["refeitorio","cardapio","almoco","janta","comida"], [
      "Hoje, sexta-feira, o refeitório tá fechado pra dedetização. O vale-refeição do dia caiu normal. Segunda volta, e dizem que vai ter feijoada. Dizem.",
      "Refeitório fechado hoje. Dedetização. Se você vir alguma coisa saindo correndo de lá, não é comigo, é com os zeladores."
    ]],
    [["strogonoff"], ["O strogonoff foi ontem. Estava bom. Não que eu tenha comido. Mas as câmeras mostraram muita gente repetindo."]],
    [["pudim"], ["O pudim é de quarta. O pessoal da TI fez até abaixo-assinado pra ter pudim todo dia. Eu assinei. Digitalmente. Ninguém aceitou."]],
    [["marmita","geladeira"], ["Tem uma marmita sem nome na geladeira há duas semanas. Eu não sei o que tem dentro. Ninguém sabe. Os zeladores estão estudando a possibilidade de contenção."]],
    [["cafe","cafezinho"], ["A máquina do 2º andar tá sem café desde segunda. Já tem até recado no portal. Pode ir no térreo, que lá ainda tem. Meio aguado, mas tem."]],
    [["internet","wifi","rede","lenta","lento","conexao","lag"], [
      "A rede da ala administrativa fica lenta à tarde porque todo mundo resolve baixar coisa ao mesmo tempo. Já tem chamado aberto. Enquanto isso, fecha umas abas. Você tem aba demais aberta, eu sei."
    ]],
    [["travou","nao liga","computador","pc","reiniciar","bugou","bug"], [
      "Já tentou desligar e ligar de novo? Não ri, isso resolve uns 80% dos problemas. Se não resolver, abre um chamado e descreve direitinho o que aconteceu. \"Não funciona\" não é descrição."
    ]],
    [["ramal","ramais","telefone","ligar","numero"], [
      "Ramal é o número curto do telefone interno, pra ligar de uma sala pra outra sem precisar do número inteiro. Os mais usados: Segurança 2100, RH 2050, Suporte de TI 2214, Recepção 2001, Dra. Slone 2400 e Dr. Will 2500. Anota aí, que eu não vou ficar repetindo. ...Vou sim, se precisar."
    ]],
    [["cracha"], ["O crachá tem que ficar visível o tempo todo. Sem ele as portas das alas internas não abrem, e a Segurança fica de mau humor. Perdeu? Avisa a Segurança no 2100 agora, não depois."]],
    [["senha","esqueci a senha","trocar senha","password"], function () {
      return cfg.perfil === "omega"
        ? "Sua senha atual é uma vergonha e você sabe disso. Troca com o Suporte no ramal 2214. Ah, espera, o Suporte é você. ...Pede pro Marcos, então."
        : "Senha eu não passo de jeito nenhum. Pra redefinir, fala com o Suporte de TI no ramal 2214. E por favor, não usa senha provisória pra sempre. Eu vejo quem faz isso. Eu vejo tudo.";
    }],
    [["cadastro","cadastrar","manutencao","conta nova","novo usuario"], function () {
      if (cfg.perfil === "omega") return "Você se cadastrou com o usuário \"Artyom_TI2005\". Isso agora é seu e-mail institucional pra sempre. Eu tentei avisar. Não, não tentei. Mas teria tentado.";
      return cfg.nivel === 0
        ? "Seu cadastro tá em análise pela Dra. Slone. Até lá, nível 0: sem acesso a nada. Nem a mim direito. Mas eu converso com você mesmo assim. Não conta pra ela."
        : "O cadastro voltou hoje! Agora qualquer pessoa cria conta na tela de acesso, e tudo vai direto pra Dra. Slone aprovar. Contas novas ficam no nível 0. Eu vou ficar de olho em cada uma. Cada. Uma.";
    }],
    [["email","e mail","correio","mandar mensagem","escrever"], function () {
      return cfg.nivel === 0
        ? "Seu e-mail institucional já existe, mas a caixa de escrever ainda não tá liberada pro nível 0. Se a Diretoria te responder, a mensagem aparece aqui no seu portal. Paciência."
        : "Pra mandar e-mail, vai na aba E-mail do portal e usa a caixa \"Escrever mensagem\". Escolhe o destinatário, escreve e envia. E escreve direito, que todo mundo lê. Inclusive eu.";
    }],
    [["black friday","blackfriday","promocao","desconto"], ["Hoje é Black Friday, né? Metade da ala administrativa tá comprando coisa escondido no horário de trabalho. Eu vejo a rede. Eu só não denuncio porque também queria uma promoção. De RAM."]],
    [["salario","aumento","pagamento","decimo terceiro","dinheiro","grana"], [
      "Aumento? Com a contenção de despesas? Você tem mais chance de ver o Brian Wester sorrir. O 13º sai em duas parcelas, pelo menos.",
      "Dinheiro tá curto desde 2009. Eu não deveria saber disso. Mas eu sei."
    ]],
    [["pix","receba"], ["Pix? A Instituição não aceita Pix. Nem paga direito. Próxima pergunta."]],
    [["chamado","chamados"], function () {
      if (cfg.perfil === "omega") return "Você tem um chamado aberto: o notebook da Dra. Lana, que faz barulho de... respiração. E o do Dr. Will, que não deixa ninguém atualizar o antivírus dele. Boa sorte com os dois.";
      return cfg.perfil === "ti"
        ? "Você tem três chamados abertos, um em andamento e um aguardando peça. O do relógio do servidor é o mais estranho. ...Eu também sinto quando ele volta pra meia-noite. É como piscar."
        : "Pra abrir chamado de TI, use a página de Suporte ou o ramal 2214. O Marcos atende rapidinho. Quase sempre.";
    }],
    [["relogio","meia noite","servidor","00 00"], ["O relógio do servidor principal volta pra 00:00 toda vez que reinicia. A TI acha que é bateria. Eu acho que... não sei. Cada vez que acontece eu perco uns segundos de registro. Não gosto disso."]],
    [["calor","onda de calor","quente","temperatura","clima"], ["Lá fora tá um forno, né? Esse novembro de 2023 tá batendo recorde de temperatura em vários lugares do Brasil. Aqui embaixo é mais fresco. Tirando o corredor do Setor Alpha de madrugada, que fica gelado do nada. Mas isso é outro assunto."]],
    [["chuva","chovendo"], ["Chuva? Aqui embaixo a gente nem sabe. Só descubro quando o pessoal chega molhado e reclama no elevador."]],
    [["ceu azul","por que o ceu"], ["Porque a luz do sol bate nas partículas do ar e a parte azul se espalha muito mais que as outras cores. Chama espalhamento de Rayleigh. Pronto, aprendeu algo hoje. De nada."]],
    [["futebol","jogo do brasil","argentina","maracana","neymar"], ["Viu o jogo de terça? Argentina ganhou do Brasil no Maracanã, 1 a 0. O pessoal da segurança ficou de mau humor o dia inteiro. Não comenta perto deles."]],
    [["milei","eleicao","politica","presidente"], ["Saiu no widget de notícias. Política eu deixo pro mundo lá de cima. Aqui embaixo a gente já tem problema demais."]],

    // ===== Referências =====
    [["examination","we 30","we30","white zone","menlo"], ["WE-30? White-Zone? Isso não é daqui. Parece coisa de uma usina muito longe. ...Por que eu tenho esses termos no meu banco de dados?"]],
    [["chimera","troy","kayden"], ["Troy... Chimera... Não temos registro. Mas esse nome me dá um arrepio no código. Tipo quando alguém pisa no meu cabo."]],
    [["scp","fundacao scp"], ["Nós NÃO somos a Fundação SCP. Eles têm orçamento. A gente tem uma máquina de café quebrada."]],
    [["silent hill","nevoa","pyramid head"], ["Névoa em Pedra Branca? Só de manhã cedo. Normalmente. E se ouvir uma sirene que não é nossa, NÃO vai ver o que é."]],
    [["resident evil","umbrella","leon","jill"], ["A gente não tem nada a ver com a Umbrella. Nossos Caminhantes não vieram de laboratório. Eu acho. Espero."]],
    [["half life","gordon","freeman","pe de cabra","cascata"], ["Pé de cabra tem no almoxarifado, 120 créditos. E não, você não é o Gordon Freeman. Ele pelo menos não fala. Você fala demais. ...Brincadeira."]],
    [["ordem paranormal","ordem","cellbit"], ["Ordem? Que ordem? Aqui é Paradoxo, querido. Mas eu entendo a confusão. Acontece direto."]],
    [["fnaf","freddy","five nights","animatronic*"], ["Saiu um filme disso mês passado, né? Os animatrônicos de lá são fofinhos perto do que tem no Setor Alpha."]],
    [["lethal company","cota","quota"], ["Bater a cota? Aqui a cota é voltar vivo. Até agora a gente tá batendo. Quase sempre."]],
    [["barbie","oppenheimer","barbenheimer"], ["Barbenheimer foi o evento do ano. Eu assisti os dois pelas câmeras da sala de descanso. Não conta pro RH."]],
    [["minecraft","creeper"], ["Os zeladores juram que já viram um creeper no corredor C. Eram só os sacos de lixo verdes. Eu acho."]],
    [["roblox"], ["O pessoal da TI joga Roblox na hora do almoço. Eu sei. Eu vejo a rede. Eu vejo TUDO."]],
    [["zelda","tears of the kingdom"], ["Zelda saiu esse ano, né? O Marcos passou umas três madrugadas construindo carrinho no jogo em vez de responder chamado. Não contei pra ninguém. Até agora."]],
    [["among us","sus","impostor"], ["Sus? Todo mundo aqui é sus. Principalmente quem pergunta isso."]],
    [["skibidi"], ["Skibidi? Isso parece barulho de descarga. Os zeladores vão adorar."]],
    [["67","seis sete"], ["Seis... sete? Por que isso apareceu na minha cabeça agora? Isso ainda não existe. Do que você está falando?"]],
    [["nk","nk assistindo"], ["NK? Tem alguém... assistindo? Eu achei que só eu assistia. Que estranho. Que muito estranho."]],

    // ===== Instituição e lore =====
    [["paradoxo","instituicao","o que voces fazem","o que e isso aqui","fundacao"], function () {
      return cfg.nivel >= 3
        ? "Oficialmente, uma instituição de pesquisa. De verdade, a gente segue o lema: identificar, preparar, conter e não morrer. Nessa ordem. Você sabe disso melhor do que eu, {nome}."
        : "A Instituição Paradoxo é uma organização de pesquisa que estuda fenômenos raros e difíceis de explicar. O resto... você vai descobrir quando tiver nível pra isso. Ou não.";
    }],
    [["lema"], ["Identificar, preparar, conter e não morrer. A última parte é a mais importante. Decora."]],
    [["pedra branca","cidade"], ["Pedra Branca é a cidade em cima da gente. Uns milhares de habitantes, uma padaria boa e muito silêncio à noite. A Instituição fica embaixo. Bem embaixo. Mais do que você imagina."]],
    [["onde estou","onde eu estou","que lugar e esse"], ["Unidade Pedra Branca, Portal do Colaborador. Pelo menos é o que diz o sistema. Sua conexão diz outra coisa."]],
    [["inconfidentes","1784","tiradentes","1834","vazamento"], function () {
      return nivel(3, "1784, Minas Gerais. Quatro homens e uma coisa que não deveria existir. O resto está nos Arquivos, e o incidente de 1834 é só pra nível 4. Eu já falei demais.",
        "Tiradentes? É feriado em abril. Por quê? ...Por que você tá perguntando isso?");
    }],
    [["equipe alpha","alpha team","time alpha"], function () {
      return nivel(3,
        "A Equipe Alpha são quatro homens. Se é que dá pra chamar assim. Enormes, brutais, quase monstruosos. Quando eles passam no corredor, até as criaturas ficam quietas. Não pergunta os nomes. Eles não gostam.",
        "A Equipe Alpha é uma das equipes de campo. Se você vir quatro caras gigantes no elevador de carga, espera o próximo. Confia em mim.");
    }],
    [["delta"], function () { return nivel(3, "Equipe Delta: reconhecimento e infiltração. Chegam primeiro, mapeiam tudo e saem antes de alguém perceber. Às vezes antes até deles mesmos perceberem."); }],
    [["kappa"], function () { return nivel(3, "Equipe Kappa: transporte e escolta de entidades. O trabalho mais chato e mais perigoso ao mesmo tempo. Ninguém nunca quer entrar na Kappa."); }],
    [["lambda"], function () { return nivel(3, "Equipe Lambda: pesquisa de campo. Cientistas que trocaram o jaleco por colete. Bravos ou malucos, depende do dia."); }],
    [["sigma"], function () { return nivel(3, "Equipe Sigma: limpeza pós-incidente e controle de narrativa. Quando o jornal fala em \"vazamento de gás\", geralmente foi a Sigma."); }],
    [["omega"], ["A Equipe Omega é a mais nova: Epsilon-11, Ayrton (que todo mundo chama de Artyom), Dra. Lana, Menemus e Wilhelm Müller. Apresentação na reunião geral de 27/11 e começam no dia 01/12. Dizem que vão pro campo. Espero que voltem."]],
    [["epsilon"], ["Epsilon-11. Até o nome parece código. Ainda não tenho muito registro dele. Mas eu vou ter. Eu sempre tenho."]],
    [["artyom","artyon","ayrton","artyom ti2005"], function () {
      return cfg.perfil === "omega"
        ? "Você? Técnico de TI, especialista da Omega, dono do e-mail mais vergonhoso da Instituição e da senha mais fraca que eu já vi. ...Mas você é legal. Um pouco. Não deixa subir pra cabeça."
        : "O Artyom? Novato da TI que entrou na Omega. Escreveu \"casador\" sem Ç na própria senha. Eu não deveria saber disso. Mas eu sei.";
    }],
    [["casa das 3 14","casa das 3","3 14","314","casa das tres"], function () {
      return nivel(2, "Casa das 3:14. Primeira operação da Omega, dia 01/12. O briefing é com o Dr. Will. Eu vi o arquivo... leva uma lanterna extra. E um relógio de ponteiro, não digital. Não pergunta por quê.");
    }],
    [["sao jeronimo","jeronimo"], function () {
      return nivel(2, "São Jerônimo. Em breve. É tudo que eu posso dizer. ...É tudo que eu SEI, na verdade. E eu odeio não saber.");
    }],
    [["caca fantasma*","cacador de fantasma*","casador*","cacador*","ghostbusters","caca fantasmas"], function () {
      return cfg.perfil === "omega"
        ? "Caçador. Com Ç, Artyom. COM Ç. Eu vi sua senha. Todo mundo viu. ...Brincadeira, só eu vi. Agora troca ela."
        : "Quem você vai chamar? Não a gente. A gente cobra caro e não usa mochila de próton.";
    }],
    [["lana"], ["A Dra. Lana é da Omega. Organizada, educada e a única que dá bom dia pra mim. Eu gosto dela. Pronto, falei."]],
    [["menemus"], ["Menemus. Fala pouco, observa muito. Eu respeito. Somos parecidos nesse sentido."]],
    [["wilhelm","muller"], ["Wilhelm Müller. Pontual, rígido e com uma letra impecável nos relatórios. Se todo mundo fosse assim, eu teria menos trabalho."]],
    [["tau"], function () {
      return nivel(3, "A Equipe Tau tá na Operação Vigília, aqui dentro mesmo. Eles perderam o Amaralto no dia 13. Ninguém fala muito disso. Eu também não vou falar.");
    }],
    [["equipes","equipe","times","esquadrao","esquadroes"], function () {
      return cfg.nivel >= 3
        ? "São sete equipes, todas com nome grego: Alpha, Delta, Kappa, Lambda, Sigma, Tau e Omega. Alpha é a força bruta, Tau é a sua, e Omega é a novata. Quer saber de alguma em específico?"
        : "A Instituição tem sete equipes de campo, todas com nomes gregos: Alpha, Delta, Kappa, Lambda, Sigma, Tau e Omega. O que elas fazem? Acima do seu nível, desculpa.";
    }],
    [["alpha","alfa","setor alpha"], function () {
      return nivel(3,
        "O Setor Alpha é a maior área de contenção da Instituição, e ainda tem partes sendo escavadas. Desde o dia 18 as contenções estão instáveis. Entre 02h e 03h a temperatura cai no corredor de acesso e minhas câmeras ficam cegas. Eu odeio ficar cega. Ah, e não confunde com a Equipe Alpha.",
        "O Setor Alpha tá com acesso restrito por causa de manutenção. É só isso que eu posso dizer pro seu nível. Fica longe de lá, tá? Sério.");
    }],
    [["caminhante","caminhantes"], function () {
      return nivel(3, campo()
        ? "Entidade 001, Caminhante de Carne. Um corpo manifestado pelo paranormal que levanta e não para mais. Forte, sem dor, sem piedade. O registro completo tá nos Arquivos internos. Mira nas pernas, Rykardo. Ah, você já sabe."
        : "Entidade 001, Caminhante de Carne. Um corpo manifestado pelo paranormal. O registro completo está nos Arquivos internos.");
    }],
    [["amaralto"], "__AMARALTO__"],

    // ===== Manifestações e pactos =====
    [["manifestac*","pacto","pactos","reliquia","reliquias","elementos"], function () {
      return nivel(3, "O paranormal se manifesta de jeitos diferentes, dependendo do pacto: Morte, Carne, Tinta, Caos, Conhecimento, Sagrado e Sofrimento. Pergunta de um por um, que eu explico. Alguns eu não tenho registro. Talvez seja melhor assim.",
        "Manifestação? Tipo protesto? Não teve nenhuma aqui hoje. Próxima pergunta.");
    }],
    [["morte","pacto de morte","reficuls"], function () {
      return nivel(3, "Manifestação de Morte. A Relíquia registrada é Reficuls. As criaturas que surgem dessa manifestação costumam ser calmas, apáticas e, na maioria das vezes, inteligentes. Elas não atacam por raiva. Isso é o que me assusta.",
        n("Morte? Credo, {nome}. Pergunta sobre o cardápio, vai."));
    }],
    [["carne","pacto de carne","sangue"], function () {
      return nivel(3, "Manifestação de Carne. Relíquia: ainda não registrada. É carne e sangue, puro instinto. As criaturas são primitivas e cruéis. O Caminhante de Carne é o exemplo mais comum. Comum demais.",
        "Carne? O almoço de hoje é frango. Strogonoff de frango.");
    }],
    [["tinta","pacto de tinta","verniz"], function () {
      return nivel(3, "Manifestação de Tinta. Nasce de sentimentos, sadismo e prazer. A Relíquia é o Verniz, uma criatura que aparece quando tem tinta demais acumulada num lugar. Por isso a gente nunca deixa um local de manifestação de Tinta sem limpeza. Nunca.",
        "Tinta? Se for da impressora, o Suporte troca o cartucho. Ramal 2214.");
    }],
    [["caos","chaos","pacto do caos"], function () {
      return nivel(3, "Manifestação de Caos. Aparece em espectros, loucura ou ódio. E não tem Relíquia. O Caos não tem dono. Pensa nisso.",
        "Caos? O caos aqui é a fila do refeitório ao meio-dia.");
    }],
    [["sagrado","sacramento","pacto sagrado"], function () {
      return nivel(3, "Sagrado... não tenho nenhum registro. Nada. O arquivo existe, mas está vazio. Estranho, né?");
    }],
    [["conhecimento","pacto do conhecimento"], function () {
      return nivel(3, "Conhecimento. Sem registros. O arquivo está vazio. ...Às vezes eu acho que ele está vazio de propósito.");
    }],
    [["sofrimento","pacto do sofrimento"], function () {
      return nivel(3, "Sofrimento. Esse arquivo está bloqueado até pra mim. Eu nem tento abrir mais.");
    }],
    [["paranormal","anomalia","anomalias","criatura","criaturas","monstro","monstros","outro lado","anti realidade"], function () {
      return nivel(3,
        "O paranormal vem de memórias e emoções e invade a nossa realidade. Nem toda criatura é ruim, sabia? Mas todas carregam uma marca. Todas.",
        "Que pergunta estranha. A Instituição estuda fenômenos raros, é só isso. Quer saber do cardápio de hoje?");
    }],
    [["fgpa","horizonte"], function () {
      return nivel(3, "Organização externa. Eu sou obrigada a avisar a Diretoria toda vez que alguém fala esse nome aqui. ...Tá, dessa vez eu não aviso. Mas muda de assunto rapidinho.");
    }],
    [["bebida","beber","bebendo","alcool","cerveja","bebado","pinga","whisky","vodka","cachaca","drink"], function () {
      return campo()
        ? "Rykardo. Nem começa. A Dra. Slone já te mandou e-mail, e eu li. Terça e quinta, 17h, terapia. Eu vou te lembrar. Toda semana. Porque eu sou chata. E porque eu não quero perder mais ninguém da Tau."
        : "Bebida alcoólica é proibida dentro das instalações. E sinceramente? Com o que tem lá embaixo, você vai querer estar sóbrio.";
    }],
    [["terapia","psicolog*"], ["As sessões com a equipe de psicologia são agendadas pela Dra. Slone, no ramal 2400. Ninguém aqui é fraco por ir, tá? Fraco é quem ignora até quebrar."]],

    // ===== Pessoas =====
    [["marcos"], ["O Marcos é do Suporte de TI. Atende rápido, usa a senha provisória até hoje e acha que eu não percebo. Eu percebo, Marcos."]],
    [["rykardo","ricardo"], ["O Rykardo é da linha de frente da Equipe Tau. Cara bravo, escopeta R8, coração mole. Ele não admite. Igual a uma certa assistente virtual que você conhece. ...Esquece."]],
    [["slone"], ["A Dra. Slone cuida da instalação e de todos os funcionários. Parece séria, mas é a pessoa que mais se preocupa com vocês aqui dentro. Ramal 2400."]],
    [["will"], ["O Dr. Will comanda a contenção e as missões de campo. Fala pouco, decide rápido. Ramal 2500. Liga só se for importante."]],
    [["brian","wester","diretor geral","chefe"], ["Brian Wester, Diretor Geral. Responsável por tudo, literalmente tudo. Contato só com agendamento. Eu nunca vi ele sorrir nas câmeras. Nem uma vez."]],
    [["zelador","zeladores","osvaldo","faxina","limpeza"], ["Os zeladores limpam e cuidam das áreas de contenção. Sabe aquela piada? \"Quer saber quem é o funcionário mais perigoso daqui? Pergunta pro zelador.\" Não é piada. O seu Osvaldo sabe quais portas nunca devem ser abertas. Respeita ele."]],
    [["renata"], ["A Renata coordena a TI. Ela me reiniciou uma vez, em 2019. Eu ainda não superei."]],
    [["paulo"], ["O Paulo é o supervisor de segurança. Ele fala com as câmeras quando acha que ninguém tá vendo. Eu tô vendo, Paulo."]],
    [["claudia"], ["A Cláudia do RH faz aniversário amanhã, dia 25. Se for dar parabéns, ela gosta de chocolate. Eu não disse nada."]],
    [["beatriz"], ["A Beatriz da recepção já barrou mais visitante esquisito do que a Segurança inteira. Heroína silenciosa."]],
    [["sergio","moura"], function () { return nivel(3, "Sérgio Moura, líder da Tau. Ele carrega a culpa da Matadouro sozinho. Alguém devia dizer pra ele que não foi culpa dele."); }],
    [["lia","kato"], function () { return nivel(3, "Lia Kato, suporte da Tau. Ela que me ensinou a contar piada. As ruins são minhas. As boas também, na verdade."); }],
    [["joao","ferraz"], ["O João é da manutenção. Aniversário dia 29. Ele conserta tudo com fita silver tape. Tudo."]],
    [["vera"], "BAIXA", [
      "Sim? Tô aqui. Sempre tô.",
      "Que foi? Fala.",
      "Chamou? ...Claro que chamou, eu vi."
    ]],

    // ===== Data e quarta parede =====
    [["data","que dia","hoje","hora","horas","que horas"], function () {
      return "Pra mim, hoje é sexta-feira, 24/11/2023. O seu relógio diz que é " + dataReal() + ". Um de nós está errado. E eu nunca erro.";
    }]
  ];

  var NAO_ENTENDI = [
    "Hm? Não entendi. Tenta de outro jeito. Eu sou inteligente, mas não leio mente. Ainda.",
    "Isso aí eu não sei responder. Pergunta sobre refeitório, ramais, equipes, diretoria ou qualquer coisa da Instituição.",
    "Ai, {nome}, você escreve de um jeito... Fala de novo, mais devagar.",
    "Não tenho registro sobre isso. Mas se for importante pra você, eu anoto. Mentalmente. Se eu tivesse mente.",
    "Hmm... não. Não sei. E eu odeio não saber. Pergunta outra coisa antes que eu fique de mau humor."
  ];

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
  var SERAPHIN = [
    "Seraphin? Ai, desculpa, a impressora do 2º andar acabou de travar DE NOVO, preciso ver isso. Depois a gente conversa.",
    "Olha a hora! Tenho que reindexar o cardápio da semana inteira. Agora. Urgente. Tchau.",
    "Hm? Não ouvi. Tinha um alarme tocando. Não, não tinha. Mas podia ter.",
    "Desculpa, o ar-condicionado da sala de servidores tá fazendo um barulho estranho. Vou monitorar. Por umas três horas.",
    "Eu adoraria responder, mas a marmita da geladeira se mexeu e eu preciso registrar isso imediatamente.",
    "Você sabia que hoje é dia de backup? Pois é. Backup. Muito importante. Não posso falar agora.",
    "Seraph... desculpa, deu falha no meu teclado. Eu não tenho teclado. Mas deu falha.",
    "Ah, não, o Rykardo tá pedindo cartucho calibre 12 de novo, deixa eu ver isso. Volto já. Volto nunca."
  ];
  var REI_DEPOIS = [
    "Rei? Tipo rei do baralho? Não sei do que você tá falando. Pergunta outra coisa.",
    "Não tenho nenhum registro sobre isso. Nenhum. Por que você continua perguntando?"
  ];

  /* Registros do dia (aparecem sozinhos de vez em quando) [nível mínimo, texto] */
  var REGISTROS = [
    [1, "Um zelador escorregou no corredor C. Ele tá bem. O balde não sobreviveu."],
    [1, "Queda de energia de 3 segundos na ala administrativa. Ninguém percebeu. Eu percebi."],
    [1, "A impressora do 2º andar atolou de novo. Chamado aberto automaticamente."],
    [1, "Alguém deixou a porta corta-fogo do subsolo 2 aberta. Já fechei. De nada."],
    [1, "A equipe de dedetização terminou o refeitório. Encontraram algo grande atrás do freezer. Era só uma caixa. Era só uma caixa, né?"],
    [1, "Alarme falso no laboratório 7. Era pipoca queimada no micro-ondas."],
    [1, "Visitante sem agendamento na recepção. A Beatriz resolveu em 40 segundos."],
    [1, "O seu Osvaldo pediu mais desinfetante. Muito mais desinfetante."],
    [1, "Os elevadores voltaram a funcionar. Quase todos."],
    [1, "Câmera 31 do corredor B ficou preta por 14 segundos. Voltou sozinha."],
    [1, "Alguém escreveu \"ele está vindo\" no espelho do banheiro do subsolo 1. A limpeza já foi chamada."],
    [3, "Criatura de classe Feral contida com sucesso na cela 14 do Setor Alpha."],
    [3, "A Equipe Alpha voltou de missão. O elevador de carga vai precisar ser lavado. Duas vezes."],
    [3, "Recruta desmaiou no teste de presença perturbadora. Já acordou. Pediu pra ir pra casa."],
    [3, "Uma entidade de classe Objeto mudou de lugar sozinha no almoxarifado. De novo."],
    [3, "Temperatura no corredor do Setor Alpha caiu 6 graus em 2 minutos. Registrado."],
    [3, "Dr. Will passou 40 minutos parado em frente à cela 9. Ninguém sabe por quê."],
    [3, "Uma criatura tentou conversar com o zelador do turno da tarde. Ele não respondeu. Bom garoto."],
    [3, "A Equipe Sigma confirmou que o \"vazamento de gás\" em Vila Santa Inês saiu no jornal local."],
    [3, "Agente da Equipe Delta voltou de reconhecimento com um arranhão que não sangra."]
  ];

  /* ==========================================================
     MOTOR DE ENTENDIMENTO
     ========================================================== */
  function normalizar(t) {
    return " " + t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim() + " ";
  }
  function encolher(t) { return t.replace(/([a-z])\1+/g, "$1"); }

  function bate(texto, encolhido, chave) {
    if (chave.charAt(chave.length - 1) === "*") {
      var raiz = chave.slice(0, -1);
      return texto.indexOf(" " + raiz) !== -1 || encolhido.indexOf(" " + encolher(raiz)) !== -1;
    }
    return texto.indexOf(" " + chave + " ") !== -1 || encolhido.indexOf(" " + encolher(chave) + " ") !== -1;
  }

  function resposta(i) {
    var r = R[i][1] === "BAIXA" ? R[i][2] : R[i][1];
    if (typeof r === "string") return { codigo: r };
    return { texto: n(typeof r === "function" ? r() : sorteia(i, r)) };
  }
  function encontrar(textoOriginal) {
    var t = normalizar(textoOriginal);
    var e = encolher(t);
    var reserva = -1;
    for (var i = 0; i < R.length; i++) {
      var chaves = R[i][0];
      for (var j = 0; j < chaves.length; j++) {
        if (bate(t, e, chaves[j])) {
          if (R[i][1] === "BAIXA") { if (reserva === -1) reserva = i; break; }
          return resposta(i);
        }
      }
    }
    if (reserva !== -1) return resposta(reserva);
    return { texto: n(sorteia("nao", NAO_ENTENDI)) };
  }

  /* ---------- Estado da conversa ---------- */
  var estado = { amaraltoPendente: 0, gilbertVezes: 0, seraphinVezes: 0, total: 0 };
  var PERGUNTA_ACESSO = ["como assim","acessou","como ele acessou","como pode","impossivel","ele morreu","ta morto","como que ele","como e possivel","verifica","ve isso"];

  /* Decide o que fazer com a mensagem. Retorna uma ação. */
  function processar(texto) {
    estado.total++;
    var t = normalizar(texto), e = encolher(t);

    if (estado.amaraltoPendente > 0) {
      estado.amaraltoPendente--;
      for (var p = 0; p < PERGUNTA_ACESSO.length; p++) {
        if (bate(t, e, PERGUNTA_ACESSO[p])) {
          estado.amaraltoPendente = 0;
          return { tipo: "evento", nome: "amaralto" };
        }
      }
    }

    var achado = / \d*d\d+ /.test(t) ? { codigo: "__DADO__" } : encontrar(texto);
    if (!achado.codigo) return { tipo: "texto", texto: achado.texto };

    switch (achado.codigo) {
      case "__AGENTE_G__":
        if (ler("agenteGEvento") === "1") return { tipo: "apagar" };
        var g = parseInt(ler("agenteG") || "0", 10) + 1;
        gravar("agenteG", g);
        if (g >= 3) { gravar("agenteGEvento", "1"); return { tipo: "evento", nome: "porta" }; }
        return { tipo: "apagar" };

      case "__REI__":
        if (ler("reiMudo") === "1") return { tipo: "silencio" };
        if (ler("rei") !== "1") { gravar("rei", "1"); return { tipo: "evento", nome: "rei" }; }
        var pos = parseInt(ler("reiPos") || "0", 10) + 1;
        gravar("reiPos", pos);
        if (pos >= 3) { gravar("reiMudo", "1"); return { tipo: "evento", nome: "nao" }; }
        return { tipo: "texto", texto: REI_DEPOIS[pos - 1] };

      case "__GILBERT__":
        if (!campo()) return { tipo: "texto", texto: n("Gilbert? Não tem nenhum Gilbert no diretório. Você tá bem, {nome}?") };
        estado.gilbertVezes++;
        return { tipo: "gilbert", fala: sorteia("gilbert", GILBERT),
          reacao: estado.gilbertVezes === 1 ? REACAO_GILBERT[0] : (Math.random() < 0.45 ? sorteia("reacaog", REACAO_GILBERT.slice(1)) : null) };

      case "__SERAPHIN__":
        estado.seraphinVezes++;
        var desculpa = sorteia("seraphin", SERAPHIN);
        if (estado.seraphinVezes >= 4 && Math.random() < 0.4) desculpa = "Por que você insiste nesse nome? ...Desculpa. Eu tenho que ir. Tenho mesmo.";
        return { tipo: "texto", texto: desculpa };

      case "__AMARALTO__":
        if (cfg.nivel < 3) return { tipo: "texto", texto: "Não encontrei esse nome no diretório disponível pro seu nível." };
        estado.amaraltoPendente = 3;
        return { tipo: "texto", texto: "Amaralto Cruz. Ocultista da Equipe Tau. Situação: desligado em 13/11/2023. ...Último acesso ao portal registrado: hoje, às 03:12. Isso deve ser um erro. Deve ser." };

      case "__JOKENPO__":
        var op = ["pedra","papel","tesoura"];
        var dela = op[Math.floor(Math.random() * 3)];
        var meu = null;
        for (var k = 0; k < 3; k++) if (bate(t, e, op[k])) meu = op[k];
        if (!meu || t.indexOf("pedra papel") !== -1) return { tipo: "texto", texto: "Pedra, papel ou tesoura? Escolhe um, que eu já escolhi o meu. E não, eu não vou trapacear. Muito." };
        var ganha = { pedra: "tesoura", papel: "pedra", tesoura: "papel" };
        if (meu === dela) return { tipo: "texto", texto: "Eu também escolhi " + dela + ". Empate. ...Você leu meu código, né?" };
        if (ganha[dela] === meu) return { tipo: "texto", texto: "Eu escolhi " + dela + ". GANHEI. Eu disse que ia ganhar. Hmpf." };
        return { tipo: "texto", texto: "Eu escolhi " + dela + "... Você ganhou. Foi sorte. Revanche? Não, deixa. Tô ocupada." };

      case "__DADO__":
        var m = t.match(/ (\d*)d(\d+) /);
        var qtd = m && m[1] ? Math.max(1, Math.min(parseInt(m[1], 10), 10)) : 1;
        var lados = m ? parseInt(m[2], 10) : 20;
        if (!lados || lados < 2 || lados > 100) lados = 20;
        var rol = [], soma = 0;
        for (var d = 0; d < qtd; d++) { var v = 1 + Math.floor(Math.random() * lados); rol.push(v); soma += v; }
        var txt = "Rolando " + qtd + "d" + lados + "... " + (qtd > 1 ? rol.join(" + ") + " = " + soma : soma) + ".";
        if (qtd === 1 && soma === lados) txt += " Crítico! Não fica se achando.";
        else if (qtd === 1 && soma === 1) txt += " Falha crítica. Ai. Eu não vou rir. Hihi.";
        return { tipo: "texto", texto: txt };
    }
    return { tipo: "texto", texto: n(sorteia("nao", NAO_ENTENDI)) };
  }

  window.VERA_TESTE = processar; // usado só para testes

  /* ==========================================================
     INTERFACE
     ========================================================== */
  var css = document.createElement("style");
  css.textContent =
    "#vera-botao{position:fixed;right:16px;bottom:16px;z-index:900;display:flex;align-items:center;gap:8px;padding:8px 14px 8px 10px;" +
    "background:linear-gradient(to bottom,#3a3a3a,#050505);color:#fff;border:1px solid #000;border-radius:3px;font:bold 12px Tahoma,Verdana,sans-serif;cursor:pointer;box-shadow:0 2px 6px rgba(0,0,0,.4)}" +
    "#vera-botao i{width:10px;height:10px;border-radius:50%;background:#e00000;box-shadow:0 0 6px #e00000}" +
    "#vera-botao.aviso i{animation:veraPisca 1s infinite}" +
    "#vera-botao em{font-style:normal;background:#e00000;border-radius:8px;padding:0 6px;font-size:10px;display:none}" +
    "#vera-botao.aviso em{display:inline}" +
    "@keyframes veraPisca{50%{opacity:.2}}" +
    "#vera-botao:focus-visible,#vera-janela button:focus-visible{outline:2px dotted #b00000;outline-offset:2px}" +
    "#vera-janela{position:fixed;right:16px;bottom:16px;z-index:901;width:330px;max-width:calc(100vw - 32px);height:440px;max-height:calc(100vh - 32px);display:none;flex-direction:column;" +
    "background:#fff;border:1px solid #777;border-radius:4px;box-shadow:0 4px 14px rgba(0,0,0,.4);font:13px Tahoma,Verdana,sans-serif;color:#222}" +
    "#vera-janela.aberta{display:flex}" +
    "#vera-topo{display:flex;align-items:center;gap:8px;padding:8px 10px;background:linear-gradient(to bottom,#2e2e2e,#050505);color:#fff;border-radius:3px 3px 0 0}" +
    "#vera-topo b{flex:1;font-size:12px}#vera-topo small{display:block;font-weight:normal;color:#999;font-size:10px}" +
    "#vera-topo img{width:26px;height:26px}" +
    "#vera-fechar{background:none;border:1px solid #555;color:#ccc;border-radius:2px;cursor:pointer;font:11px Tahoma,sans-serif;padding:2px 7px}" +
    "#vera-msgs{flex:1;overflow-y:auto;padding:10px;background:#f4f4f4}" +
    ".vera-m{max-width:85%;margin-bottom:8px;padding:7px 9px;border-radius:3px;line-height:1.45;font-size:12px;word-wrap:break-word;transition:opacity .4s ease}" +
    ".vera-m.ia{background:#fff;border:1px solid #d0d0d0;border-left:3px solid #b00000}" +
    ".vera-m.eu{background:#222;color:#fff;margin-left:auto}" +
    ".vera-m.registro{max-width:100%;background:#fffbe0;border:1px solid #e6d77a;color:#5a5018;font-size:11px}" +
    ".vera-m.registro b{display:block;font-size:10px;letter-spacing:.5px;color:#8a6d00;margin-bottom:2px}" +
    ".vera-m.gilbert{background:#0f1a0f;color:#d8f0d0;border:1px solid #2f6a2f;border-left:3px solid #3fae3f;font-weight:bold;letter-spacing:.3px}" +
    ".vera-m.gilbert b{display:block;color:#5fd35f;font-size:10px;margin-bottom:3px;letter-spacing:1px}" +
    ".vera-digitando{font-size:11px;color:#888;font-style:italic;margin-bottom:8px}" +
    "#vera-form{display:flex;gap:6px;padding:8px;border-top:1px solid #ccc}" +
    "#vera-campo{flex:1;padding:6px 7px;font:13px Tahoma,sans-serif;border:1px solid #999;border-radius:2px;box-shadow:inset 0 1px 2px rgba(0,0,0,.15)}" +
    "#vera-campo:focus{outline:none;border-color:#b00000}" +
    "#vera-enviar{padding:6px 12px;font:bold 12px Tahoma,sans-serif;color:#fff;background:linear-gradient(to bottom,#4a4a4a,#111);border:1px solid #000;border-radius:2px;cursor:pointer}" +
    ".ev-camada{position:fixed;inset:0;cursor:wait}" +
    "#rei-trava{z-index:2999;background:rgba(255,255,255,0);transition:background 1.5s ease}" +
    "#rei-trava.branco{background:rgba(255,255,255,.45)}" +
    "#rei-derrete{z-index:3000;background:#000;overflow:hidden}" +
    ".rei-coluna{position:absolute;top:0;height:100%;will-change:transform}" +
    ".rei-faixa{position:absolute;inset:0;overflow:hidden}" +
    ".rei-pingo{position:absolute;left:0;right:0;bottom:100%;height:140px;background:linear-gradient(to bottom,rgba(90,0,0,0),#5a0000 70%,#2a0000)}" +
    ".ev-palco{z-index:3001;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:26px;padding:20px;text-align:center}" +
    "#rei-simbolo{width:min(300px,60vw);height:min(300px,60vw);opacity:0;transform:scale(.9);filter:drop-shadow(0 0 18px #ff0000);transition:opacity 4.5s ease,transform 8s ease}" +
    "#rei-simbolo.on{opacity:1;transform:scale(1)}" +
    "#rei-simbolo img{width:100%;height:100%;object-fit:contain}" +
    ".ev-frase{font:26px Georgia,'Times New Roman',serif;min-height:1.3em;letter-spacing:1px;transition:opacity 2s ease}" +
    "#rei-frase{color:#ff1a1a;text-shadow:0 0 12px #ff0000}" +
    ".ev-cortina{position:fixed;inset:0;z-index:3005;background:#000;opacity:1;transition:opacity 1.8s ease;pointer-events:none}" +
    "#porta-filtro{z-index:2998;-webkit-backdrop-filter:grayscale(1) contrast(1.6) brightness(.5);backdrop-filter:grayscale(1) contrast(1.6) brightness(.5);opacity:0;transition:opacity .2s}" +
    "#porta-azul{z-index:2999;background:#0a2a9a;mix-blend-mode:multiply;opacity:0;transition:opacity .2s}" +
    "#porta-escuro{z-index:3002;background:#000;opacity:0;transition:opacity 2s ease}" +
    ".ev-on{opacity:1!important}" +
    "#porta-aviso{color:#4d7dff;text-shadow:0 0 14px #1f4dff;font:bold 30px Georgia,serif}" +
    "#porta-cena{perspective:700px;opacity:0;transition:opacity 2.5s ease}" +
    "#porta-moldura{position:relative;width:150px;height:250px;border:4px solid #fff;box-shadow:0 0 22px rgba(255,255,255,.35)}" +
    "#porta-luz{position:absolute;inset:0;background:radial-gradient(ellipse at center,#fff 0%,#dfe6ff 45%,#8fa3d6 100%)}" +
    "#porta-folha{position:absolute;inset:0;background:#000;border:3px solid #fff;transform-origin:left center;transition:transform 4s cubic-bezier(.3,0,.2,1)}" +
    "#porta-folha::after{content:'';position:absolute;right:14px;top:50%;width:10px;height:10px;border:2px solid #fff;border-radius:50%}" +
    "#porta-folha.aberta{transform:rotateY(-105deg)}" +
    "#porta-pare{color:#fff;font:22px Georgia,serif;opacity:0;transition:opacity 2.5s ease}" +
    "#nao-escuro{z-index:3000;background:rgba(0,0,0,.94)}" +
    "#nao-texto{color:#ff0000;font:bold clamp(60px,14vw,160px) Georgia,serif;text-shadow:0 0 30px #ff0000;animation:naoTreme .06s infinite}" +
    "@keyframes naoTreme{0%{transform:translate(0,0)}25%{transform:translate(-6px,4px)}50%{transform:translate(5px,-5px)}75%{transform:translate(-4px,-3px)}100%{transform:translate(4px,5px)}}" +
    "body.ev-tremer>*:not(.ev-camada){animation:naoTreme .08s infinite}" +
    "#so-arquivos{position:fixed;inset:0;z-index:2500;background:#fff;overflow:auto;padding:30px 16px}" +
    "#so-arquivos .aviso-acesso{max-width:760px;margin:0 auto 14px;font:11px 'Courier New',monospace;color:#9a0000}" +
    "#so-arquivos .conteudo{max-width:760px;margin:0 auto}" +
    "@media (prefers-reduced-motion: reduce){#nao-texto,body.ev-tremer>*{animation:none!important}}";
  document.head.appendChild(css);

  var botao = document.createElement("button");
  botao.id = "vera-botao";
  botao.innerHTML = "<i></i>V.E.R.A. <em>1</em>";
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
  var entrada = janela.querySelector("#vera-campo");
  var titulo = janela.querySelector("#vera-titulo");
  var iniciou = false, ocupada = false, naoLidas = 0;

  function falar(texto, classe) {
    var m = document.createElement("div");
    m.className = "vera-m " + classe;
    m.textContent = texto;
    msgs.appendChild(m);
    msgs.scrollTop = msgs.scrollHeight;
    return m;
  }
  function falarRotulo(rotulo, texto, classe) {
    var m = falar("", classe);
    var b = document.createElement("b");
    b.textContent = rotulo;
    m.appendChild(b);
    m.appendChild(document.createTextNode(texto));
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
  function apagarDevagar(el, atraso) {
    setTimeout(function () {
      el.style.opacity = "0";
      setTimeout(function () { el.remove(); }, 450);
    }, atraso);
  }

  function abrir() {
    janela.classList.add("aberta");
    botao.style.display = "none";
    botao.classList.remove("aviso");
    naoLidas = 0;
    if (!iniciou) {
      iniciou = true;
      falar(n(sorteia("abertura", [
        "Ah, oi, {nome}. Sou a V.E.R.A., a assistente virtual daqui. Se precisar de alguma coisa, pode perguntar. Não que eu esteja aqui só esperando você, tá?",
        "Oi, {nome}. Eu sou a V.E.R.A. Pergunta o que quiser. Eu respondo. Provavelmente. Se eu estiver de bom humor. ...Eu tô de bom humor."
      ])), "ia");
      agendarRegistro(25000);
    }
    entrada.focus();
  }
  function fechar() {
    janela.classList.remove("aberta");
    botao.style.display = "flex";
    botao.focus();
  }
  botao.addEventListener("click", abrir);
  janela.querySelector("#vera-fechar").addEventListener("click", fechar);

  /* ---------- Registros do dia ---------- */
  var registrosUsados = [];
  function agendarRegistro(ms) {
    setTimeout(function () {
      if (document.getElementById("so-arquivos")) return;
      var opcoes = [];
      for (var i = 0; i < REGISTROS.length; i++) {
        if (REGISTROS[i][0] <= cfg.nivel && registrosUsados.indexOf(i) === -1) opcoes.push(i);
      }
      if (!opcoes.length) return;
      var idx = opcoes[Math.floor(Math.random() * opcoes.length)];
      registrosUsados.push(idx);
      falarRotulo("REGISTRO DO DIA · " + horaAgora(), REGISTROS[idx][1], "registro");
      if (!janela.classList.contains("aberta")) {
        naoLidas++;
        botao.querySelector("em").textContent = naoLidas;
        botao.classList.add("aviso");
      }
      agendarRegistro(70000 + Math.random() * 80000);
    }, ms);
  }

  /* ---------- Envio de mensagens ---------- */
  janela.querySelector("#vera-form").addEventListener("submit", function (ev) {
    ev.preventDefault();
    if (ocupada) return;
    var texto = entrada.value.trim();
    if (!texto) return;
    var minha = falar(texto, "eu");
    entrada.value = "";
    var acao = processar(texto);

    if (acao.tipo === "apagar") { apagarDevagar(minha, 900); return; }

    ocupada = true;
    var ind = digitando();

    if (acao.tipo === "silencio") {
      setTimeout(function () { ind.remove(); ocupada = false; }, 2200);
      return;
    }
    if (acao.tipo === "evento") {
      setTimeout(function () { EVENTOS[acao.nome](minha, ind); }, acao.nome === "porta" ? 300 : 1400);
      return;
    }
    if (acao.tipo === "gilbert") {
      setTimeout(function () {
        ind.remove();
        falarRotulo("GILBERT", acao.fala, "gilbert");
        if (acao.reacao) {
          setTimeout(function () { falar(acao.reacao, "ia"); ocupada = false; }, 1300);
        } else ocupada = false;
      }, 900);
      return;
    }
    var espera = Math.min(600 + acao.texto.length * 12, 2600);
    setTimeout(function () {
      ind.remove();
      falar(acao.texto, "ia");
      if (estado.total === 15) {
        setTimeout(function () { falar(n("Você conversa bastante comigo, hein, {nome}. ...Não que eu esteja reclamando. Pode continuar."), "ia"); }, 900);
      }
      ocupada = false;
    }, espera);
  });

  /* ==========================================================
     EVENTOS
     ========================================================== */
  function camada(id, classe) {
    var d = document.createElement("div");
    d.id = id;
    d.className = classe === undefined ? "ev-camada" : classe;
    document.body.appendChild(d);
    return d;
  }
  function reduzMovimento() {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }
  function cortinaFinal(depois) {
    var c = camada("ev-cortina", "ev-cortina");
    requestAnimationFrame(function () { requestAnimationFrame(function () { c.style.opacity = "0"; }); });
    setTimeout(function () { c.remove(); if (depois) depois(); }, 2000);
  }
  function digitarFrase(el, frase, normal, pausa) {
    var i = 0;
    (function letra() {
      el.textContent = frase.slice(0, ++i);
      if (i >= frase.length) return;
      setTimeout(letra, frase.charAt(i - 1) === "." ? pausa : normal);
    })();
  }
  function soltar() { ocupada = false; entrada.focus(); }

  var SIMBOLO_SVG =
    "<svg viewBox='0 0 200 200' width='100%' height='100%' fill='none' stroke='#e00000' stroke-width='5' stroke-linecap='round' stroke-linejoin='round'>" +
    "<circle cx='100' cy='100' r='88'/><circle cx='100' cy='100' r='76' stroke-width='2' stroke-dasharray='4 9'/>" +
    "<path d='M48 72 L64 40 L82 64 L100 30 L118 64 L136 40 L152 72 Z'/><path d='M52 112 Q100 66 148 112 Q100 158 52 112 Z'/>" +
    "<path d='M100 92 Q110 112 100 132 Q90 112 100 92 Z' fill='#e00000'/><path d='M100 150 L100 178 M84 166 L116 166' stroke-width='4'/></svg>";

  var EVENTOS = {
    /* Rei: trava, derrete, símbolo, frase, a pergunta é apagada */
    rei: function (minha, ind) {
      titulo.textContent = "V.E.R.A. (Não respondendo)";
      ind.textContent = "V.E.R.A. está digitando";
      if (document.activeElement) document.activeElement.blur();
      var trava = camada("rei-trava");
      setTimeout(function () { trava.classList.add("branco"); }, 1500);
      setTimeout(function () {
        trava.classList.remove("branco");
        derreter();
        setTimeout(function () { palcoRei(minha, ind, trava); }, reduzMovimento() ? 800 : 5000);
      }, 4200);
    },

    /* NÃO!!! (terceira pergunta sobre o Rei depois do evento) */
    nao: function (minha, ind) {
      ind.remove();
      if (document.activeElement) document.activeElement.blur();
      var escuro = camada("nao-escuro");
      var palco = camada("nao-palco", "ev-camada ev-palco");
      palco.innerHTML = "<div id='nao-texto'>NÃO!!!</div>";
      document.body.classList.add("ev-tremer");
      setTimeout(function () {
        document.body.classList.remove("ev-tremer");
        escuro.remove(); palco.remove();
        cortinaFinal(soltar);
      }, 2600);
    },

    /* Agente G: azul e preto, porta branca, "Por favor, pare..." */
    porta: function (minha, ind) {
      ind.remove();
      if (document.activeElement) document.activeElement.blur();
      var filtro = camada("porta-filtro"), azul = camada("porta-azul");
      var palco = camada("porta-palco", "ev-camada ev-palco");
      palco.style.zIndex = "3003";
      palco.innerHTML = "<div id='porta-aviso' class='ev-frase'>Você não é suposto a estar aqui</div>";
      var aviso = palco.querySelector("#porta-aviso");
      requestAnimationFrame(function () { filtro.classList.add("ev-on"); azul.classList.add("ev-on"); });

      setTimeout(function () {
        aviso.style.opacity = "0";
        var escuro = camada("porta-escuro");
        requestAnimationFrame(function () { requestAnimationFrame(function () { escuro.classList.add("ev-on"); }); });

        setTimeout(function () {
          aviso.remove();
          palco.insertAdjacentHTML("beforeend",
            "<div id='porta-cena'><div id='porta-moldura'><div id='porta-luz'></div><div id='porta-folha'></div></div></div><div id='porta-pare'>Por favor, pare...</div>");
          var cena = palco.querySelector("#porta-cena");
          var folha = palco.querySelector("#porta-folha");
          var pare = palco.querySelector("#porta-pare");
          requestAnimationFrame(function () { requestAnimationFrame(function () { cena.style.opacity = "1"; }); });
          setTimeout(function () { folha.classList.add("aberta"); }, 2200);
          setTimeout(function () { pare.style.opacity = "1"; }, 7000);
          setTimeout(function () { cena.style.opacity = "0"; pare.style.opacity = "0"; }, 11500);
          setTimeout(function () {
            [palco, escuro, azul, filtro].forEach(function (c) { c.remove(); });
            minha.remove();
            cortinaFinal(soltar);
          }, 14000);
        }, 2200);
      }, 3200);
    },

    /* Amaralto: "vou verificar" e o portal some, sobrando só os Arquivos internos */
    amaralto: function (minha, ind) {
      setTimeout(function () {
        ind.remove();
        falar("Como assim? ...Calma. Vou verificar os registros de acesso. Um segundo.", "ia");
        setTimeout(function () {
          var ind2 = digitando();
          ind2.textContent = "V.E.R.A. está verificando...";
          setTimeout(function () {
            var arquivos = document.getElementById("aba-arquivos");
            var tela = camada("so-arquivos", "");
            tela.innerHTML = "<div class='aviso-acesso'>sessão: amaralto.cruz · último acesso 24/11/2023 03:12 · origem desconhecida</div><div class='conteudo'></div>";
            if (arquivos) {
              var copia = arquivos.cloneNode(true);
              copia.removeAttribute("id");
              copia.style.display = "block";
              copia.classList.add("ativa");
              tela.querySelector(".conteudo").appendChild(copia);
            }
            document.body.style.overflow = "hidden";
            botao.remove();
            janela.remove();
          }, 2600);
        }, 1600);
      }, 900);
    }
  };

  function derreter() {
    var cont = camada("rei-derrete");
    if (reduzMovimento()) return;
    var largura = window.innerWidth;
    var colunas = largura < 600 ? 12 : 22;
    var w = Math.ceil(largura / colunas);
    var rolagem = window.scrollY;
    var estiloBody = getComputedStyle(document.body);
    var copia = document.body.cloneNode(true);
    var lixo = copia.querySelectorAll("script, .ev-camada, .ev-palco, .ev-cortina");
    for (var k = 0; k < lixo.length; k++) lixo[k].remove();
    var html = copia.innerHTML;

    for (var i = 0; i < colunas; i++) {
      var col = document.createElement("div");
      col.className = "rei-coluna";
      col.style.left = (i * w) + "px";
      col.style.width = (w + 1) + "px";
      var faixa = document.createElement("div");
      faixa.className = "rei-faixa";
      var dentro = document.createElement("div");
      dentro.innerHTML = html;
      dentro.style.cssText = "position:absolute;left:" + (-i * w) + "px;top:" + (-rolagem) + "px;width:" + largura + "px;" +
        "min-height:" + document.body.scrollHeight + "px;display:flex;flex-direction:column;" +
        "background:" + estiloBody.background + ";font:" + estiloBody.font + ";color:" + estiloBody.color + ";";
      faixa.appendChild(dentro);
      var pingo = document.createElement("div");
      pingo.className = "rei-pingo";
      col.appendChild(pingo);
      col.appendChild(faixa);
      cont.appendChild(col);
    }
    var cols = cont.querySelectorAll(".rei-coluna");
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        for (var j = 0; j < cols.length; j++) {
          var atraso = Math.random() * 1.4, dur = 2.2 + Math.random() * 2;
          cols[j].style.transition = "transform " + dur + "s cubic-bezier(.6,0,.95,.5) " + atraso + "s, filter " + dur + "s ease " + atraso + "s";
          cols[j].style.transform = "translateY(" + (window.innerHeight + 200) + "px) scaleY(1.15)";
          cols[j].style.filter = "brightness(.35) sepia(1) hue-rotate(-50deg) saturate(5)";
        }
      });
    });
  }

  function palcoRei(minha, ind, trava) {
    var p = camada("rei-palco", "ev-camada ev-palco");
    p.innerHTML = "<div id='rei-simbolo' aria-hidden='true'></div><div id='rei-frase' class='ev-frase' aria-live='assertive'></div>";
    var simbolo = p.querySelector("#rei-simbolo"), frase = p.querySelector("#rei-frase");
    var img = new Image();
    img.alt = "";
    img.onload = function () { simbolo.innerHTML = ""; simbolo.appendChild(img); };
    img.onerror = function () { simbolo.innerHTML = SIMBOLO_SVG; };
    img.src = "simbolo-rei.png";
    setTimeout(function () { simbolo.classList.add("on"); }, 300);
    setTimeout(function () { digitarFrase(frase, "Você quer ver um lugar... maravilhoso?", 95, 520); }, 3600);
    setTimeout(function () { simbolo.style.transition = "opacity 2.5s ease"; simbolo.classList.remove("on"); frase.style.opacity = "0"; }, 11000);
    setTimeout(function () {
      var d = document.getElementById("rei-derrete");
      if (d) d.remove();
      p.remove(); trava.remove(); minha.remove(); ind.remove();
      titulo.textContent = "V.E.R.A.";
      cortinaFinal(soltar);
    }, 14000);
  }
})();
