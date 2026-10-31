// Historinha da extrusão: o João tem dúvida e a Maria explica com a seringa de massinha.
// As posições (--x) são em % da largura do palco. Cada fala tem um áudio gravado em audio/.

(function () {
  "use strict";

  const PASSOS = [
    { quem: "joao", joao: 22, audio: "audio/1-joao-apresentacao.mp3", texto: "Oi, me chamo João, sou estudante de Engenharia de Produção na UFC, campus Russas, estou fazendo a cadeira de Tópicos de Fabricação e estou com dúvida no processo de extrusão." },
    { quem: "maria", joao: 50, audio: "audio/2-maria-posso-explicar.mp3", texto: "Posso te explicar esse processo de forma fácil e prática!" },
    { quem: "maria", joao: 50, audio: "audio/3-maria-seringa-e-massinha.mp3", texto: "Com uma seringa e uma massinha de modelar, dá para ver como a extrusão funciona." },
    { seringa: true, audio: "audio/4-maria-aperte-a-seringa.mp3", texto: "Aperte a seringa e veja: a massinha sai com o formato do bico." },
    { quem: "maria", joao: 50, audio: "audio/5-maria-matriz.mp3", texto: "Na extrusão, o material é empurrado através de uma abertura chamada matriz e sai com o formato dela." },
    { quem: "maria", joao: 50, audio: "audio/6-maria-embolo-pistao.mp3", texto: "O êmbolo é o pistão que faz a força, a massinha é o material (como alumínio ou plástico) e o bico é a matriz." },
    { quem: "maria", joao: 50, audio: "audio/7-maria-exemplos.mp3", texto: "É assim que se fabricam tubos de PVC, perfis de alumínio de janelas e até macarrão!" },
    { quem: "joao", joao: 50, audio: "audio/8-joao-agora-entendi.mp3", texto: "Agora entendi! Obrigado, Maria!", fim: true },
  ];
  const MARIA = 74, ENTRADA = -12, INICIO = 22, ANDAR = 1800;
  const PAUSA = 1000; // intervalo entre uma fala e a próxima

  // ---------- Desenho dos personagens (viewBox 100 x 200) ----------
  const AZUL_UFC = "#0b4f9c";
  const PERSONAGENS = {
    joao: { pele: "#e8b48a", sombra: "#c98e63", cabelo: "#2e1f17", iris: "#5a3a22", calca: "#3b5b8c", labios: "#a2524a" },
    maria: { pele: "#b9825a", sombra: "#94643f", cabelo: "#3f2316", iris: "#3b2414", calca: "#2f4a78", labios: "#9a3f4f" },
  };

  function olho(x, c) {
    return `<g class="olho">
      <ellipse cx="${x}" cy="29" rx="3.3" ry="2.5" fill="#fff"/>
      <circle cx="${x}" cy="29.2" r="1.9" fill="${c.iris}"/>
      <circle cx="${x}" cy="29.2" r="0.95" fill="#1b1b1b"/>
      <circle cx="${x + 0.7}" cy="28.4" r="0.6" fill="#fff"/>
      <ellipse class="palpebra" cx="${x}" cy="29" rx="3.6" ry="2.8" fill="${c.pele}"/>
    </g>`;
  }

  function desenho(quem) {
    const c = PERSONAGENS[quem], ela = quem === "maria";
    const cabeloAtras = ela
      ? `<path d="M33 30 Q31 8 50 8 Q69 8 67 30 Q71 50 68 70 Q63 76 58 70 L58 46 L42 46 L42 70 Q37 76 32 70 Q29 50 33 30 Z" fill="${c.cabelo}"/>`
      : "";
    const franja = ela
      ? `<path d="M34.5 29 Q34 10 50 10 Q66 10 65.5 29 Q62 18 53 17 Q50 21 43 21 Q38 23 34.5 29 Z" fill="${c.cabelo}"/>
         <path d="M34.5 26 Q31 48 34 64 Q37 67 39 63 Q36 46 37.5 30 Z" fill="${c.cabelo}"/>
         <path d="M65.5 26 Q69 48 66 64 Q63 67 61 63 Q64 46 62.5 30 Z" fill="${c.cabelo}"/>
         <path d="M40.3 27.6 L39 26.6 M59.7 27.6 L61 26.6" stroke="#1b1b1b" stroke-width="0.8" stroke-linecap="round"/>`
      : `<path d="M34.5 28 Q33 10 50 9.5 Q67 10 65.5 28 Q64 20 60 18 Q56 21 49 19.5 Q42 19 38 22.5 Q36 25 34.5 28 Z" fill="${c.cabelo}"/>
         <path d="M38 22 Q44 15 52 17 Q47 18 44 21 Z" fill="${c.cabelo}"/>`;
    const perna = (x, outra) => `<g class="perna${outra ? " outra" : ""}">
      <rect x="${x}" y="106" width="12" height="74" rx="5" fill="${c.calca}"/>
      <path d="M${x - 3} 187 Q${x - 3} 179 ${x + 4} 178.5 L${x + 10} 178.5 Q${x + 16} 180 ${x + 16} 187 Z" fill="#f4f6fa" stroke="#9aa6bd" stroke-width="1"/>
      <rect x="${x - 3}" y="185" width="19" height="2.5" rx="1" fill="#5b6785"/>
    </g>`;
    const braco = (x, outra) => `<g class="braco${outra ? " outra" : ""}">
      <rect x="${x + 1.5}" y="70" width="7" height="36" rx="3.5" fill="${c.pele}"/>
      <circle cx="${x + 5}" cy="107.5" r="4.6" fill="${c.pele}"/>
      <rect x="${x}" y="55" width="10" height="19" rx="4" fill="#fff" stroke="#b8c4d8" stroke-width="1"/>
      <rect x="${x}" y="70.5" width="10" height="3" fill="${AZUL_UFC}"/>
    </g>`;
    return `<svg viewBox="0 0 100 200" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
      ${cabeloAtras}
      ${perna(36, false)}${perna(52, true)}
      <rect x="33" y="104" width="34" height="12" rx="3" fill="${c.calca}"/>
      <rect x="45" y="44" width="10" height="12" fill="${c.sombra}"/>
      <path d="M31 63 Q31 54 41 53 L59 53 Q69 54 69 63 L67.5 110 L32.5 110 Z" fill="#fff" stroke="#b8c4d8" stroke-width="1"/>
      <path d="M42 53 L50 62 L58 53" fill="none" stroke="${AZUL_UFC}" stroke-width="3" stroke-linejoin="round"/>
      <text x="50" y="84" text-anchor="middle" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="11" fill="${AZUL_UFC}">UFC</text>
      <text x="50" y="91" text-anchor="middle" font-family="Arial, sans-serif" font-weight="700" font-size="4.2" letter-spacing="0.6" fill="${AZUL_UFC}">RUSSAS</text>
      ${braco(23, false)}${braco(67, true)}
      ${ela ? "" : `<ellipse cx="35" cy="31" rx="3" ry="4.6" fill="${c.sombra}"/>
      <ellipse cx="65" cy="31" rx="3" ry="4.6" fill="${c.sombra}"/>`}
      <ellipse cx="50" cy="30" rx="15" ry="17.5" fill="${c.pele}"/>
      ${franja}
      <path d="M40 23.5 Q43.5 21.5 47 23" fill="none" stroke="${c.cabelo}" stroke-width="1.6" stroke-linecap="round"/>
      <path d="M53 23 Q56.5 21.5 60 23.5" fill="none" stroke="${c.cabelo}" stroke-width="1.6" stroke-linecap="round"/>
      ${olho(44, c)}${olho(56, c)}
      <path d="M50 31 Q48.3 35 49.4 35.8 Q50.6 36.3 52 35.4" fill="none" stroke="${c.sombra}" stroke-width="1.1" stroke-linecap="round"/>
      <circle cx="40" cy="36" r="2.6" fill="#f08a8a" opacity="0.35"/>
      <circle cx="60" cy="36" r="2.6" fill="#f08a8a" opacity="0.35"/>
      <g class="boca">
        <path class="boca-fechada" d="M45.5 39.6 Q50 43.2 54.5 39.6" fill="none" stroke="${c.labios}" stroke-width="1.5" stroke-linecap="round"/>
        <path class="boca-aberta" d="M45.5 39.2 Q50 40.2 54.5 39.2 Q50 45.5 45.5 39.2 Z" fill="#6e2424" stroke="${c.labios}" stroke-width="1"/>
      </g>
    </svg>`;
  }

  const app = document.getElementById("app");
  const historia = document.getElementById("historia");
  const joao = document.getElementById("joao"), maria = document.getElementById("maria");
  const balao = document.getElementById("balao");
  const balaoNome = document.getElementById("balao-nome"), balaoTexto = document.getElementById("balao-texto");
  const btnPular = document.getElementById("pular");
  const btnRever = document.getElementById("rever"), btnUsar = document.getElementById("usar");
  // as duas únicas ações pedidas durante a história: entrar no simulador e voltar dele
  const btnIrSimulador = document.getElementById("ir-simulador"), btnVoltar = document.getElementById("voltar-historia");
  const guiaTexto = document.getElementById("guia-texto");
  const guiaAvatar = document.getElementById("guia-avatar");
  const btnVoz = document.getElementById("voz");
  const semMovimento = window.matchMedia("(prefers-reduced-motion: reduce)");

  joao.innerHTML = desenho("joao");
  maria.innerHTML = desenho("maria");
  guiaAvatar.innerHTML = desenho("maria");

  // ---------- Voz (falas gravadas em audio/) ----------
  const audio = new Audio();
  audio.preload = "auto";
  let vozLigada = true;
  try { vozLigada = localStorage.getItem("seringa-voz") !== "desligada"; } catch (e) { /* sem armazenamento */ }
  let bocaTimer = 0, falaAtual = null;

  function calaBoca() {
    clearTimeout(bocaTimer);
    [joao, maria, guiaAvatar].forEach((el) => el.classList.remove("falando"));
  }

  function termina(f) {
    if (falaAtual !== f) return;
    falaAtual = null;
    calaBoca();
    f.depois();
  }

  // sem som (mudo ou áudio indisponível), a boca mexe pelo tempo que a fala levaria
  function mexeBoca(f, ms) {
    calaBoca();
    f.el.classList.add("falando");
    bocaTimer = setTimeout(() => termina(f), ms);
  }
  const duracaoEstimada = (texto) => 600 + texto.length * 60;

  // toca a fala e chama depois() quando ela acaba
  function diz(arquivo, texto, el, depois) {
    const f = { arquivo, texto, el, depois };
    falaAtual = f;
    audio.pause();
    calaBoca();
    if (!vozLigada) { mexeBoca(f, duracaoEstimada(texto)); return; }
    el.classList.add("falando");
    audio.src = arquivo;
    audio.onended = () => termina(f);
    audio.play().catch(() => { if (falaAtual === f) mexeBoca(f, duracaoEstimada(texto)); });
  }

  function cala() {
    falaAtual = null;
    audio.pause();
    calaBoca();
  }

  // ---------- Música da tela inicial (gerada no navegador, sem arquivo) ----------
  // O navegador só deixa tocar som depois de um clique ou tecla; até lá ela fica esperando.
  const VOLUME_MUSICA = 0.045;
  const PASSO_MUSICA = 0.3; // segundos por nota
  const MELODIA = [72, 76, 79, 76, 74, 79, 81, 79, 72, 76, 79, 81, 79, 76, 74, null];
  const BAIXO = [48, 45, 41, 43]; // dó, lá, fá, sol: um a cada 4 notas
  let somCtx = null, musica = null;
  const hz = (nota) => 440 * Math.pow(2, (nota - 69) / 12);

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
    if (musica || !vozLigada || !historia.classList.contains("inicio")) return;
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
      const resto = audio.duration ? (audio.duration - audio.currentTime) * 1000 : duracaoEstimada(f.texto);
      audio.pause();
      mexeBoca(f, resto);
    } else diz(f.arquivo, f.texto, f.el, f.depois);
  });

  // ---------- Roteiro ----------
  let passo = -1, timer = 0, espera = 0;
  const xJoao = () => Number(joao.style.getPropertyValue("--x"));

  function fala(p) {
    const cx = p.quem === "joao" ? xJoao() : MARIA;
    const bw = historia.clientWidth < 600 ? 92 : 60;
    const bx = Math.max(3, Math.min(97 - bw, cx - bw * 0.3));
    balao.style.setProperty("--bx", bx + "%");
    balao.style.setProperty("--bw", bw + "%");
    balao.style.setProperty("--cauda", Math.max(8, Math.min(92, ((cx - bx) / bw) * 100)) + "%");
    balaoNome.textContent = p.quem === "joao" ? "João" : "Maria";
    balaoTexto.textContent = p.texto;
    balao.classList.add("visivel");
    const quem = p.quem === "joao" ? joao : maria;
    quem.classList.remove("pulo");
    void quem.offsetWidth; // reinicia o pulinho de quem fala
    quem.classList.add("pulo");
    diz(p.audio, p.texto, quem, () => {
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
    joao.classList.add("andando");
    joao.style.setProperty("--x", x);
    clearTimeout(timer);
    timer = setTimeout(() => { joao.classList.remove("andando"); depois(); }, semMovimento.matches ? 0 : ANDAR);
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
      guiaTexto.textContent = p.texto;
      window.Seringa.encher();
      diz(p.audio, p.texto, guiaAvatar, () => {});
      return;
    }
    app.classList.add("modo-historia");
    app.classList.remove("modo-guiado");
    btnPular.hidden = !!p.fim;
    btnRever.hidden = btnUsar.hidden = !p.fim;
    if (xJoao() !== p.joao) anda(p.joao, () => fala(p));
    else fala(p);
  }

  function colocaJoao(x) {
    historia.classList.add("sem-transicao");
    joao.style.setProperty("--x", x);
    void joao.offsetWidth;
    historia.classList.remove("sem-transicao");
  }

  // tela inicial: o clique em "COMEÇAR" também libera as falas no navegador
  function abertura() {
    clearTimeout(timer); clearTimeout(espera); passo = -1;
    btnIrSimulador.hidden = true;
    cala();
    colocaJoao(INICIO);
    balao.classList.remove("visivel");
    historia.classList.add("inicio");
    app.classList.add("modo-historia");
    app.classList.remove("modo-guiado");
    btnRever.hidden = btnUsar.hidden = true;
    btnPular.hidden = false;
    tocaMusica();
  }
  function comeca() {
    clearTimeout(timer); clearTimeout(espera);
    paraMusica();
    historia.classList.remove("inicio");
    colocaJoao(ENTRADA);
    mostra(0);
  }
  function sai() {
    clearTimeout(timer); clearTimeout(espera);
    passo = -1;
    btnIrSimulador.hidden = true;
    cala();
    paraMusica();
    joao.classList.remove("andando");
    balao.classList.remove("visivel");
    historia.classList.remove("inicio");
    app.classList.remove("modo-historia", "modo-guiado");
  }

  document.getElementById("comecar").addEventListener("click", comeca);
  btnPular.addEventListener("click", sai);
  btnUsar.addEventListener("click", sai);
  btnRever.addEventListener("click", comeca);
  btnIrSimulador.addEventListener("click", () => mostra(passo + 1));
  btnVoltar.addEventListener("click", () => mostra(passo + 1));

  abertura();
})();
