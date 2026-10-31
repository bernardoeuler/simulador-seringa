// Historinha da extrusão: o aluno escolhido tem dúvida e o professor Pedro explica com a seringa de massinha.
// As posições (--x) são em % da largura do palco. As falas usam as vozes do navegador (pt-BR), conforme o sexo.

(function () {
  "use strict";

  // ---------- Personagens ----------
  // cabelo: "curto", "topete", "liso", "ondulado", "black" (black power), "cacheado", "rabo" (rabo de cavalo)
  // oculos: false ou a cor da armação; altura: 1 = normal, maior que 1 = mais alto
  const ALUNOS = [
    { id: "livia", nome: "Lívia", sexo: "f", pele: "#b07a52", cabelo: "ondulado", longo: true, corCabelo: "#231711", oculos: false, altura: 1, calca: "#3b5b8c" },
    { id: "lidia", nome: "Lídia", sexo: "f", pele: "#a8714a", cabelo: "ondulado", repartido: true, corCabelo: "#1e1410", oculos: "#b89a6a", altura: 1, calca: "#2f4a78" },
    { id: "davi", nome: "Davi", sexo: "m", pele: "#edc4a2", cabelo: "topete", corCabelo: "#2a1d16", oculos: false, bigode: true, altura: 1, calca: "#34405e" },
    { id: "eduarda", nome: "Eduarda", sexo: "f", pele: "#f3d0b6", cabelo: "liso", corCabelo: "#1a1412", oculos: false, altura: 1, calca: "#3b5b8c" },
    { id: "marcele", nome: "Marcele", sexo: "f", pele: "#d8a17a", cabelo: "black", corCabelo: "#141010", oculos: false, altura: 1.07, calca: "#2f4a78" },
  ];
  const PEDRO = { id: "pedro", nome: "Professor Pedro", curto: "Prof. Pedro", sexo: "m", pele: "#f4d2b8", cabelo: "curto", corCabelo: "#6b5446", oculos: "#2b2b2b", altura: 1.04, calca: "#2b2f3a", roupa: "professor" };

  // texto de cada passo; "aluno" é quem foi escolhido
  const PASSOS = [
    { quem: "aluno", x: 22, texto: (a) => `Oi, me chamo ${a.nome}, sou estudante de Engenharia de Produção na UFC, campus Russas, estou fazendo a cadeira de Tópicos de Fabricação e estou com dúvida no processo de extrusão.` },
    { quem: "professor", x: 50, texto: () => "Posso te explicar esse processo de forma fácil e prática!" },
    { quem: "professor", x: 50, texto: () => "Com uma seringa e uma massinha de modelar, dá para ver como a extrusão funciona." },
    { seringa: true, texto: () => "Aperte a seringa e veja: a massinha sai com o formato do bico." },
    { quem: "professor", x: 50, texto: () => "Na extrusão, o material é empurrado através de uma abertura chamada matriz e sai com o formato dela." },
    { quem: "professor", x: 50, texto: () => "O êmbolo é o pistão que faz a força, a massinha é o material (como alumínio ou plástico) e o bico é a matriz." },
    { quem: "professor", x: 50, texto: () => "É assim que se fabricam tubos de PVC, perfis de alumínio de janelas e até macarrão!" },
    { quem: "aluno", x: 50, texto: (a) => `Agora entendi! ${a.sexo === "f" ? "Obrigada" : "Obrigado"}, professor Pedro!`, fim: true },
  ];
  const PROFESSOR = 74, ENTRADA = -12, INICIO = 22, ANDAR = 1800;
  const PAUSA = 1000; // intervalo entre uma fala e a próxima

  // ---------- Desenho (viewBox 100 x 200) ----------
  const AZUL_UFC = "#0b4f9c";

  function escurece(hex, f) {
    const n = parseInt(hex.slice(1), 16);
    const c = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => Math.round(v * f));
    return `rgb(${c.join(",")})`;
  }

  function olho(x, p) {
    return `<g class="olho">
      <ellipse cx="${x}" cy="29" rx="3.3" ry="2.5" fill="#fff"/>
      <circle cx="${x}" cy="29.2" r="1.9" fill="#3b2414"/>
      <circle cx="${x}" cy="29.2" r="0.95" fill="#1b1b1b"/>
      <circle cx="${x + 0.7}" cy="28.4" r="0.6" fill="#fff"/>
      <ellipse class="palpebra" cx="${x}" cy="29" rx="3.6" ry="2.8" fill="${p.pele}"/>
    </g>`;
  }

  // cabelo em duas camadas: atrás da cabeça e na frente (franja)
  function cabelo(p) {
    const c = p.corCabelo;
    switch (p.cabelo) {
      case "liso":
        return {
          atras: `<path d="M33 30 Q31 8 50 8 Q69 8 67 30 Q71 50 68 70 Q63 76 58 70 L58 46 L42 46 L42 70 Q37 76 32 70 Q29 50 33 30 Z" fill="${c}"/>`,
          frente: `<path d="M34.5 29 Q34 10 50 10 Q66 10 65.5 29 Q62 18 53 17 Q50 21 43 21 Q38 23 34.5 29 Z" fill="${c}"/>
            <path d="M34.5 26 Q31 48 34 64 Q37 67 39 63 Q36 46 37.5 30 Z" fill="${c}"/>
            <path d="M65.5 26 Q69 48 66 64 Q63 67 61 63 Q64 46 62.5 30 Z" fill="${c}"/>`,
          orelhas: false,
        };
      case "ondulado": {
        // longo e ondulado, passando dos ombros; "longo" desce até a cintura e tem mais volume
        const fim = p.longo ? 92 : 74, abre = p.longo ? 4 : 0;
        let ondas = "";
        const ys = p.longo ? [50, 60, 70, 80, 89] : [52, 62, 71];
        ys.forEach((y) => {
          ondas += `<circle cx="${31 - abre}" cy="${y}" r="${5.2 + abre / 3}" fill="${c}"/><circle cx="${69 + abre}" cy="${y}" r="${5.2 + abre / 3}" fill="${c}"/>`;
        });
        const franja = p.repartido
          ? `<path d="M34.5 30 Q33 9 50 10 Q67 9 65.5 30 Q62 19 52 14 L50 13 L48 14 Q38 19 34.5 30 Z" fill="${c}"/>`
          : `<path d="M34.5 29 Q33 9 50 9.5 Q66 10 65.5 29 Q63 19 56 17 Q51 22 44 21 Q38 23 34.5 29 Z" fill="${c}"/>`;
        return {
          atras: `<path d="M33 30 Q${30 - abre} 8 50 ${8 - abre} Q${70 + abre} 8 67 30 Q${73 + abre} 52 ${69 + abre} ${fim} Q63 ${fim + 5} 58 ${fim - 2} L58 46 L42 46 L42 ${fim - 2} Q37 ${fim + 5} ${31 - abre} ${fim} Q${27 - abre} 52 33 30 Z" fill="${c}"/>${ondas}`,
          frente: `${franja}
            <path d="M34.5 26 Q30 36 33.5 44 Q30 52 34 62 Q37 66 39 62 Q36 54 38.5 46 Q35.5 38 37.5 30 Z" fill="${c}"/>
            <path d="M65.5 26 Q70 36 66.5 44 Q70 52 66 62 Q63 66 61 62 Q64 54 61.5 46 Q64.5 38 62.5 30 Z" fill="${c}"/>`,
          orelhas: false,
        };
      }
      case "topete":
        // curto nas laterais, com volume em cima
        return {
          atras: "",
          frente: `<path d="M34.5 29 Q32 9 48 5 Q60 3 65 13 Q68 19 65.5 29 Q64 21 59 19 Q55 15 49 16 Q42 16 38 22 Q36 25 34.5 29 Z" fill="${c}"/>
            <path d="M41 14 Q48 2 60 6 Q53 7 50 12 Z" fill="${c}"/>`,
          orelhas: true,
        };
      case "black": {
        // black power: volume redondo em volta da cabeça, com textura de cachos na borda
        let cachos = "";
        for (let i = 0; i < 18; i++) {
          const a = (Math.PI * 2 * i) / 18;
          cachos += `<circle cx="${(50 + Math.cos(a) * 24).toFixed(1)}" cy="${(24 + Math.sin(a) * 22).toFixed(1)}" r="5.5" fill="${c}"/>`;
        }
        return {
          atras: `<ellipse cx="50" cy="24" rx="25" ry="23" fill="${c}"/>${cachos}`,
          frente: `<path d="M35 25 Q37 13 50 13 Q63 13 65 25 Q60 18 54 19 Q50 16 46 19 Q40 18 35 25 Z" fill="${c}"/>`,
          orelhas: false,
        };
      }
      case "cacheado": {
        let cachos = "";
        [[33, 34], [31, 44], [33, 54], [67, 34], [69, 44], [67, 54], [38, 14], [50, 10], [62, 14]].forEach(([x, y]) => {
          cachos += `<circle cx="${x}" cy="${y}" r="6" fill="${c}"/>`;
        });
        return {
          atras: `<path d="M32 30 Q30 9 50 9 Q70 9 68 30 L70 56 Q60 62 56 52 L44 52 Q40 62 30 56 Z" fill="${c}"/>${cachos}`,
          frente: `<path d="M35 27 Q35 12 50 12 Q65 12 65 27 Q61 19 55 20 Q52 17 48 20 Q43 18 39 22 Q36 24 35 27 Z" fill="${c}"/>
            <circle cx="40" cy="17" r="4" fill="${c}"/><circle cx="50" cy="14" r="4" fill="${c}"/><circle cx="60" cy="17" r="4" fill="${c}"/>`,
          orelhas: false,
        };
      }
      case "rabo":
        return {
          atras: `<path d="M62 16 Q78 18 76 38 Q75 56 68 64 Q66 52 68 40 Q68 28 60 22 Z" fill="${c}"/>`,
          frente: `<path d="M34.5 29 Q34 10 50 10 Q66 10 65.5 29 Q63 19 55 18 Q48 17 42 20 Q37 23 34.5 29 Z" fill="${c}"/>
            <rect x="61" y="16" width="5" height="4" rx="1.5" fill="${AZUL_UFC}" transform="rotate(30 63 18)"/>`,
          orelhas: true,
        };
      default: // curto
        return {
          atras: "",
          frente: `<path d="M34.5 28 Q33 10 50 9.5 Q67 10 65.5 28 Q64 20 60 18 Q56 21 49 19.5 Q42 19 38 22.5 Q36 25 34.5 28 Z" fill="${c}"/>
            <path d="M38 22 Q44 15 52 17 Q47 18 44 21 Z" fill="${c}"/>`,
          orelhas: true,
        };
    }
  }

  function oculos(cor) {
    return `<g fill="rgba(255,255,255,0.18)" stroke="${cor}" stroke-width="1.1">
      <rect x="39" y="25.5" width="10" height="7.5" rx="2.5"/>
      <rect x="51" y="25.5" width="10" height="7.5" rx="2.5"/>
      <path d="M49 28.5 Q50 27.5 51 28.5 M39 28 L35.5 27 M61 28 L64.5 27" fill="none"/>
    </g>`;
  }

  function roupa(p) {
    if (p.roupa === "professor") {
      // camisa social azul-clara de manga comprida, gravata e crachá da UFC
      const camisa = "#dce8f6", linha = "#9fb3cc";
      const braco = (x, outra) => `<g class="braco${outra ? " outra" : ""}">
        <rect x="${x}" y="55" width="10" height="50" rx="4.5" fill="${camisa}" stroke="${linha}" stroke-width="1"/>
        <circle cx="${x + 5}" cy="107.5" r="4.6" fill="${p.pele}"/>
      </g>`;
      return {
        corpo: `<path d="M31 63 Q31 54 41 53 L59 53 Q69 54 69 63 L67.5 110 L32.5 110 Z" fill="${camisa}" stroke="${linha}" stroke-width="1"/>
          <path d="M43 53 L50 60 L57 53 L54 52 L50 56 L46 52 Z" fill="#fff" stroke="${linha}" stroke-width="0.8"/>
          <path d="M48.5 58 L51.5 58 L52.5 62 L50 84 L47.5 62 Z" fill="#1f3a63"/>
          <rect x="56" y="70" width="9" height="11" rx="1.5" fill="#fff" stroke="${linha}" stroke-width="0.8"/>
          <rect x="56" y="70" width="9" height="3" rx="1" fill="${AZUL_UFC}"/>
          <text x="60.5" y="79" text-anchor="middle" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="3.6" fill="${AZUL_UFC}">UFC</text>`,
        bracos: braco(23, false) + braco(67, true),
        sapato: "#2b2f3a",
      };
    }
    // farda: camisa branca com gola em V azul e "UFC Russas" no peito
    const braco = (x, outra) => `<g class="braco${outra ? " outra" : ""}">
      <rect x="${x + 1.5}" y="70" width="7" height="36" rx="3.5" fill="${p.pele}"/>
      <circle cx="${x + 5}" cy="107.5" r="4.6" fill="${p.pele}"/>
      <rect x="${x}" y="55" width="10" height="19" rx="4" fill="#fff" stroke="#b8c4d8" stroke-width="1"/>
      <rect x="${x}" y="70.5" width="10" height="3" fill="${AZUL_UFC}"/>
    </g>`;
    return {
      corpo: `<path d="M31 63 Q31 54 41 53 L59 53 Q69 54 69 63 L67.5 110 L32.5 110 Z" fill="#fff" stroke="#b8c4d8" stroke-width="1"/>
        <path d="M42 53 L50 62 L58 53" fill="none" stroke="${AZUL_UFC}" stroke-width="3" stroke-linejoin="round"/>
        <text x="50" y="84" text-anchor="middle" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="11" fill="${AZUL_UFC}">UFC</text>
        <text x="50" y="91" text-anchor="middle" font-family="Arial, sans-serif" font-weight="700" font-size="4.2" letter-spacing="0.6" fill="${AZUL_UFC}">RUSSAS</text>`,
      bracos: braco(23, false) + braco(67, true),
      sapato: "#f4f6fa",
    };
  }

  function desenho(p) {
    const sombra = escurece(p.pele, 0.82), labios = escurece(p.pele, 0.62);
    const h = cabelo(p), r = roupa(p);
    const perna = (x, outra) => `<g class="perna${outra ? " outra" : ""}">
      <rect x="${x}" y="106" width="12" height="74" rx="5" fill="${p.calca}"/>
      <path d="M${x - 3} 187 Q${x - 3} 179 ${x + 4} 178.5 L${x + 10} 178.5 Q${x + 16} 180 ${x + 16} 187 Z" fill="${r.sapato}" stroke="#9aa6bd" stroke-width="1"/>
      <rect x="${x - 3}" y="185" width="19" height="2.5" rx="1" fill="#5b6785"/>
    </g>`;
    return `<svg viewBox="0 0 100 200" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
      ${h.atras}
      ${perna(36, false)}${perna(52, true)}
      <rect x="33" y="104" width="34" height="12" rx="3" fill="${p.calca}"/>
      <rect x="45" y="44" width="10" height="12" fill="${sombra}"/>
      ${r.corpo}
      ${r.bracos}
      ${h.orelhas ? `<ellipse cx="35" cy="31" rx="3" ry="4.6" fill="${sombra}"/><ellipse cx="65" cy="31" rx="3" ry="4.6" fill="${sombra}"/>` : ""}
      <ellipse cx="50" cy="30" rx="15" ry="17.5" fill="${p.pele}"/>
      ${h.frente}
      <path d="M40 23.5 Q43.5 21.5 47 23" fill="none" stroke="${p.corCabelo}" stroke-width="1.6" stroke-linecap="round"/>
      <path d="M53 23 Q56.5 21.5 60 23.5" fill="none" stroke="${p.corCabelo}" stroke-width="1.6" stroke-linecap="round"/>
      ${olho(44, p)}${olho(56, p)}
      ${p.sexo === "f" ? `<path d="M40.3 27.6 L39 26.6 M59.7 27.6 L61 26.6" stroke="#1b1b1b" stroke-width="0.8" stroke-linecap="round"/>` : ""}
      ${p.oculos ? oculos(p.oculos) : ""}
      ${p.bigode ? `<path d="M45.8 37.9 Q50 36.2 54.2 37.9" fill="none" stroke="${p.corCabelo}" stroke-width="1.3" stroke-linecap="round"/>` : ""}
      <path d="M50 31 Q48.3 35 49.4 35.8 Q50.6 36.3 52 35.4" fill="none" stroke="${sombra}" stroke-width="1.1" stroke-linecap="round"/>
      <circle cx="40" cy="36" r="2.6" fill="#f08a8a" opacity="0.35"/>
      <circle cx="60" cy="36" r="2.6" fill="#f08a8a" opacity="0.35"/>
      <g class="boca">
        <path class="boca-fechada" d="M45.5 39.6 Q50 43.2 54.5 39.6" fill="none" stroke="${labios}" stroke-width="1.5" stroke-linecap="round"/>
        <path class="boca-aberta" d="M45.5 39.2 Q50 40.2 54.5 39.2 Q50 45.5 45.5 39.2 Z" fill="#6e2424" stroke="${labios}" stroke-width="1"/>
      </g>
    </svg>`;
  }

  const app = document.getElementById("app");
  const historia = document.getElementById("historia");
  const elAluno = document.getElementById("aluno"), elProfessor = document.getElementById("professor");
  const balao = document.getElementById("balao");
  const balaoNome = document.getElementById("balao-nome"), balaoTexto = document.getElementById("balao-texto");
  const listaAlunos = document.getElementById("lista-alunos");
  const btnPular = document.getElementById("pular");
  const btnRever = document.getElementById("rever"), btnUsar = document.getElementById("usar");
  // as duas únicas ações pedidas durante a história: entrar no simulador e voltar dele
  const btnIrSimulador = document.getElementById("ir-simulador"), btnVoltar = document.getElementById("voltar-historia");
  const guiaTexto = document.getElementById("guia-texto");
  const guiaAvatar = document.getElementById("guia-avatar");
  const btnVoz = document.getElementById("voz");
  const semMovimento = window.matchMedia("(prefers-reduced-motion: reduce)");

  let aluno = ALUNOS[0];
  function vesteAluno(a) {
    aluno = a;
    elAluno.innerHTML = desenho(a);
    elAluno.setAttribute("aria-label", a.nome);
    elAluno.style.setProperty("--altura", a.altura);
  }
  vesteAluno(aluno);
  elProfessor.innerHTML = desenho(PEDRO);
  elProfessor.style.setProperty("--altura", PEDRO.altura);
  guiaAvatar.innerHTML = desenho(PEDRO);

  // ---------- Voz (vozes do navegador, uma para homens e outra para mulheres) ----------
  const temVoz = "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
  let vozLigada = true;
  try { vozLigada = localStorage.getItem("seringa-voz") !== "desligada"; } catch (e) { /* sem armazenamento */ }
  const vozes = { m: null, f: null };
  let bocaTimer = 0, falaAtual = null;

  function escolheVozes() {
    const pt = speechSynthesis.getVoices().filter((v) => /^pt[-_]BR/i.test(v.lang));
    const ordena = (l) => l.sort((a, b) => Number(b.localService) - Number(a.localService));
    const acha = (re) => ordena(pt.filter((v) => re.test(v.name)))[0] || null;
    const qualquer = ordena(pt.slice())[0] || null;
    vozes.f = acha(/maria|francisca|luciana|vit[oó]ria|thalita|female|feminin/i) || qualquer;
    vozes.m = acha(/daniel|ant[oô]nio|f[aá]bio|donato|\bmale\b|masculin/i) || qualquer;
  }
  if (temVoz) {
    escolheVozes();
    speechSynthesis.addEventListener?.("voiceschanged", escolheVozes);
  }

  // tom de cada um, para o Davi e o professor não soarem iguais
  function tom(p) {
    if (p === PEDRO) return 0.85;
    if (vozes.m === vozes.f) return p.sexo === "f" ? 1.25 : 1;
    return p.sexo === "f" ? 1.05 : 1.12;
  }

  // frases longas em pedaços, para o navegador não cortar a fala no meio
  function pedacos(texto) {
    const out = [];
    texto.split(/(?<=[,.!?:])\s+/).forEach((t) => {
      const ult = out[out.length - 1];
      if (ult && ult.length + t.length < 110) out[out.length - 1] = ult + " " + t;
      else out.push(t);
    });
    return out;
  }

  function calaBoca() {
    clearTimeout(bocaTimer);
    [elAluno, elProfessor, guiaAvatar].forEach((el) => el.classList.remove("falando"));
  }

  function termina(f) {
    if (falaAtual !== f || f.cancelada) return;
    falaAtual = null;
    calaBoca();
    f.depois();
  }

  // sem som, a boca mexe pelo tempo que a fala levaria
  function mexeBoca(f, ms) {
    calaBoca();
    f.el.classList.add("falando");
    bocaTimer = setTimeout(() => termina(f), ms);
  }
  const duracaoEstimada = (texto) => 600 + texto.length * 62;

  function silencia() {
    if (!falaAtual) return;
    falaAtual.cancelada = true;
    if (temVoz) speechSynthesis.cancel();
  }

  // fala o texto com a voz de quem fala e chama depois() quando acaba
  function diz(p, texto, el, depois) {
    silencia();
    calaBoca();
    const f = { p, texto, el, depois, inicio: performance.now() };
    falaAtual = f;
    if (!temVoz || !vozLigada) { mexeBoca(f, duracaoEstimada(texto)); return; }
    el.classList.add("falando");
    const partes = pedacos(texto);
    partes.forEach((t, i) => {
      const u = new SpeechSynthesisUtterance(t);
      u.lang = "pt-BR";
      const v = vozes[p.sexo];
      if (v) u.voice = v;
      u.pitch = tom(p);
      u.rate = 1;
      if (i === partes.length - 1) u.onend = () => termina(f);
      u.onerror = (e) => { if (e.error !== "interrupted" && e.error !== "canceled" && falaAtual === f) mexeBoca(f, 800); };
      speechSynthesis.speak(u);
    });
  }

  function cala() {
    silencia();
    falaAtual = null;
    calaBoca();
  }

  // ---------- Música da tela inicial e da escolha (gerada no navegador, sem arquivo) ----------
  // O navegador só deixa tocar som depois de um clique ou tecla; até lá ela fica esperando.
  const VOLUME_MUSICA = 0.045;
  const PASSO_MUSICA = 0.3; // segundos por nota
  const MELODIA = [72, 76, 79, 76, 74, 79, 81, 79, 72, 76, 79, 81, 79, 76, 74, null];
  const BAIXO = [48, 45, 41, 43]; // dó, lá, fá, sol: um a cada 4 notas
  let somCtx = null, musica = null;
  const hz = (n) => 440 * Math.pow(2, (n - 69) / 12);
  const telaDeMenu = () => historia.classList.contains("inicio") || historia.classList.contains("escolha");

  function nota(freq, inicio, dura, tipo, volume) {
    const osc = somCtx.createOscillator(), env = somCtx.createGain();
    osc.type = tipo; osc.frequency.value = freq;
    env.gain.setValueAtTime(0, inicio);
    env.gain.linearRampToValueAtTime(volume, inicio + 0.02);
    env.gain.exponentialRampToValueAtTime(0.001, inicio + dura);
    osc.connect(env).connect(musica.saida);
    osc.start(inicio); osc.stop(inicio + dura + 0.05);
  }

  function agendaMusica() {
    if (!musica || somCtx.state !== "running") return;
    if (musica.proxima < somCtx.currentTime) musica.proxima = somCtx.currentTime + 0.05;
    while (musica.proxima < somCtx.currentTime + 0.6) {
      const i = musica.i % MELODIA.length, t = musica.proxima;
      if (MELODIA[i] !== null) nota(hz(MELODIA[i]), t, PASSO_MUSICA * 1.6, "triangle", 0.6);
      if (i % 4 === 0) nota(hz(BAIXO[(i / 4) % BAIXO.length]), t, PASSO_MUSICA * 4, "sine", 0.9);
      musica.i++; musica.proxima += PASSO_MUSICA;
    }
  }

  function tocaMusica() {
    if (musica || !vozLigada || !telaDeMenu()) return;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    somCtx = somCtx || new Ctx();
    const saida = somCtx.createGain();
    saida.gain.setValueAtTime(0, somCtx.currentTime);
    saida.gain.linearRampToValueAtTime(VOLUME_MUSICA, somCtx.currentTime + 1.5);
    saida.connect(somCtx.destination);
    musica = { saida, i: 0, proxima: 0, timer: setInterval(agendaMusica, 150) };
    somCtx.resume().catch(() => {});
  }

  function paraMusica() {
    if (!musica) return;
    const m = musica;
    musica = null;
    clearInterval(m.timer);
    m.saida.gain.cancelScheduledValues(somCtx.currentTime);
    m.saida.gain.setTargetAtTime(0, somCtx.currentTime, 0.15);
    setTimeout(() => m.saida.disconnect(), 1000);
  }

  // primeiro clique ou tecla em qualquer lugar da página libera a música
  ["pointerdown", "keydown"].forEach((ev) => document.addEventListener(ev, () => {
    if (somCtx && somCtx.state === "suspended") somCtx.resume().catch(() => {});
  }));

  function atualizaBotaoVoz() {
    const rotulo = vozLigada ? "Desligar som" : "Ligar som";
    btnVoz.setAttribute("aria-pressed", String(vozLigada));
    btnVoz.setAttribute("aria-label", rotulo);
    btnVoz.title = rotulo;
  }
  atualizaBotaoVoz();
  btnVoz.addEventListener("click", () => {
    vozLigada = !vozLigada;
    try { localStorage.setItem("seringa-voz", vozLigada ? "ligada" : "desligada"); } catch (e) { /* sem armazenamento */ }
    atualizaBotaoVoz();
    if (vozLigada) tocaMusica(); else paraMusica();
    const f = falaAtual;
    if (!f) return;
    if (!vozLigada) {
      // a história continua no mesmo ritmo, só sem som
      const resto = Math.max(400, duracaoEstimada(f.texto) - (performance.now() - f.inicio));
      silencia();
      const g = { ...f, cancelada: false }; // nova marca: eventos da fala cancelada são ignorados
      falaAtual = g;
      mexeBoca(g, resto);
    } else diz(f.p, f.texto, f.el, f.depois);
  });

  // ---------- Tela de escolha do personagem ----------
  ALUNOS.forEach((a) => {
    const btn = document.createElement("button");
    btn.type = "button"; btn.className = "card-aluno"; btn.id = "aluno-" + a.id;
    btn.innerHTML = `<span class="card-aluno-figura">${desenho(a)}</span><span class="card-aluno-nome">${a.nome}</span>`;
    btn.addEventListener("click", () => { vesteAluno(a); comeca(); });
    listaAlunos.appendChild(btn);
  });

  // ---------- Roteiro ----------
  let passo = -1, timer = 0, espera = 0;
  const xAluno = () => Number(elAluno.style.getPropertyValue("--x"));

  function fala(p) {
    const quem = p.quem === "aluno" ? aluno : PEDRO;
    const el = p.quem === "aluno" ? elAluno : elProfessor;
    const texto = p.texto(aluno);
    const cx = p.quem === "aluno" ? xAluno() : PROFESSOR;
    const bw = historia.clientWidth < 600 ? 92 : 60;
    const bx = Math.max(3, Math.min(97 - bw, cx - bw * 0.3));
    balao.style.setProperty("--bx", bx + "%");
    balao.style.setProperty("--bw", bw + "%");
    balao.style.setProperty("--cauda", Math.max(8, Math.min(92, ((cx - bx) / bw) * 100)) + "%");
    balaoNome.textContent = quem.nome;
    balaoTexto.textContent = texto;
    balao.classList.add("visivel");
    el.classList.remove("pulo");
    void el.offsetWidth; // reinicia o pulinho de quem fala
    el.classList.add("pulo");
    diz(quem, texto, el, () => {
      if (p.fim) return;
      // antes do simulador a história para e espera o clique em "Ir para o simulador"
      if (PASSOS[passo + 1].seringa) btnIrSimulador.hidden = false;
      else proxima();
    });
  }

  function proxima() {
    clearTimeout(espera);
    espera = setTimeout(() => mostra(passo + 1), PAUSA);
  }

  function anda(x, depois) {
    balao.classList.remove("visivel");
    elAluno.classList.add("andando");
    elAluno.style.setProperty("--x", x);
    clearTimeout(timer);
    timer = setTimeout(() => { elAluno.classList.remove("andando"); depois(); }, semMovimento.matches ? 0 : ANDAR);
  }

  function mostra(i) {
    passo = i;
    const p = PASSOS[i];
    clearTimeout(espera);
    cala();
    btnIrSimulador.hidden = true;
    if (p.seringa) {
      // no simulador quem controla é o usuário: nada avança sozinho até "Continuar a história"
      app.classList.remove("modo-historia");
      app.classList.add("modo-guiado");
      const texto = p.texto(aluno);
      guiaTexto.textContent = texto;
      window.Seringa.encher();
      diz(PEDRO, texto, guiaAvatar, () => {});
      return;
    }
    app.classList.add("modo-historia");
    app.classList.remove("modo-guiado");
    btnPular.hidden = !!p.fim;
    btnRever.hidden = btnUsar.hidden = !p.fim;
    if (xAluno() !== p.x) anda(p.x, () => fala(p));
    else fala(p);
  }

  function colocaAluno(x) {
    historia.classList.add("sem-transicao");
    elAluno.style.setProperty("--x", x);
    void elAluno.offsetWidth;
    historia.classList.remove("sem-transicao");
  }

  function limpa() {
    clearTimeout(timer); clearTimeout(espera);
    passo = -1;
    btnIrSimulador.hidden = true;
    cala();
    elAluno.classList.remove("andando");
    balao.classList.remove("visivel");
  }

  // tela inicial: o clique em "COMEÇAR" também libera as falas no navegador
  function abertura() {
    limpa();
    colocaAluno(INICIO);
    historia.classList.add("inicio");
    app.classList.add("modo-historia");
    app.classList.remove("modo-guiado");
    btnRever.hidden = btnUsar.hidden = true;
    btnPular.hidden = false;
    tocaMusica();
  }
  function escolha() {
    limpa();
    historia.classList.remove("inicio");
    historia.classList.add("escolha");
    app.classList.add("modo-historia");
    app.classList.remove("modo-guiado");
    btnRever.hidden = btnUsar.hidden = true;
    btnPular.hidden = false;
    tocaMusica();
    document.getElementById("aluno-" + aluno.id).focus({ preventScroll: true });
  }
  function comeca() {
    limpa();
    paraMusica();
    historia.classList.remove("inicio", "escolha");
    colocaAluno(ENTRADA);
    mostra(0);
  }
  function sai() {
    limpa();
    paraMusica();
    historia.classList.remove("inicio", "escolha");
    app.classList.remove("modo-historia", "modo-guiado");
  }

  document.getElementById("comecar").addEventListener("click", escolha);
  btnPular.addEventListener("click", sai);
  btnUsar.addEventListener("click", sai);
  btnRever.addEventListener("click", escolha);
  btnIrSimulador.addEventListener("click", () => mostra(passo + 1));
  btnVoltar.addEventListener("click", () => mostra(passo + 1));

  abertura();
})();
