// Historinha da extrusão: o João tem dúvida e a Maria explica com a seringa de massinha.
// As posições (--x) são em % da largura do palco. As falas usam a voz do navegador (pt-BR).

(function () {
  "use strict";

  const PASSOS = [
    { quem: "joao", joao: 22, texto: "Oi, me chamo João, sou estudante de Engenharia de Produção na UFC, campus Russas, estou fazendo a cadeira de Tópicos de Fabricação e estou com dúvida no processo de extrusão." },
    { quem: "maria", joao: 50, texto: "Posso te explicar esse processo de forma fácil e prática!" },
    { quem: "maria", joao: 50, texto: "Com uma seringa e uma massinha de modelar, dá para ver como a extrusão funciona." },
    { seringa: true, texto: "Aperte a seringa e veja: a massinha sai com o formato do bico." },
    { quem: "maria", joao: 50, texto: "Na extrusão, o material é empurrado através de uma abertura chamada matriz e sai com o formato dela." },
    { quem: "maria", joao: 50, texto: "O êmbolo é o pistão que faz a força, a massinha é o material (como alumínio ou plástico) e o bico é a matriz." },
    { quem: "maria", joao: 50, texto: "É assim que se fabricam tubos de PVC, perfis de alumínio de janelas e até macarrão!" },
    { quem: "joao", joao: 50, texto: "Agora entendi! Obrigado, Maria!", fim: true },
  ];
  const MARIA = 74, ENTRADA = -12, INICIO = 22, ANDAR = 1800;
  const MASSINHA_MINIMA = 60; // quanto a massinha precisa sair para liberar o "Continuar"

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
  const btnProximo = document.getElementById("proximo"), btnPular = document.getElementById("pular");
  const btnRever = document.getElementById("rever"), btnUsar = document.getElementById("usar");
  const guiaTexto = document.getElementById("guia-texto"), btnContinuar = document.getElementById("continuar");
  const guiaAvatar = document.getElementById("guia-avatar");
  const btnVoz = document.getElementById("voz");
  const semMovimento = window.matchMedia("(prefers-reduced-motion: reduce)");

  joao.innerHTML = desenho("joao");
  maria.innerHTML = desenho("maria");
  guiaAvatar.innerHTML = desenho("maria");

  // ---------- Voz ----------
  const temVoz = "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
  let vozLigada = true;
  try { vozLigada = localStorage.getItem("seringa-voz") !== "desligada"; } catch (e) { /* sem armazenamento */ }
  const vozes = { joao: null, maria: null };
  let bocaTimer = 0, falaAtual = null;

  function escolheVozes() {
    const pt = speechSynthesis.getVoices().filter((v) => /^pt[-_]BR/i.test(v.lang));
    const ordena = (l) => l.sort((a, b) => Number(b.localService) - Number(a.localService));
    const acha = (re) => ordena(pt.filter((v) => re.test(v.name)))[0] || null;
    const qualquer = ordena(pt.slice())[0] || null;
    vozes.maria = acha(/maria|francisca|luciana|vit[oó]ria|thalita|female|feminin/i) || qualquer;
    vozes.joao = acha(/daniel|ant[oô]nio|f[aá]bio|donato|\bmale\b|masculin/i) || qualquer;
  }
  if (temVoz) {
    escolheVozes();
    speechSynthesis.addEventListener?.("voiceschanged", escolheVozes);
  }

  // frases longas em pedaços, para o navegador não cortar a fala no meio
  function pedacos(texto) {
    const out = [];
    texto.split(/(?<=[,.!?:])\s+/).forEach((p) => {
      const ult = out[out.length - 1];
      if (ult && ult.length + p.length < 110) out[out.length - 1] = ult + " " + p;
      else out.push(p);
    });
    return out;
  }

  function calaBoca() {
    clearTimeout(bocaTimer);
    [joao, maria, guiaAvatar].forEach((el) => el.classList.remove("falando"));
  }

  function diz(quem, texto, el) {
    falaAtual = { quem, texto, el };
    if (temVoz) speechSynthesis.cancel();
    calaBoca();
    el.classList.add("falando");
    if (!temVoz || !vozLigada) {
      bocaTimer = setTimeout(calaBoca, Math.min(6000, 600 + texto.length * 45));
      return;
    }
    const partes = pedacos(texto);
    const mesmaVoz = vozes.joao === vozes.maria;
    partes.forEach((t, i) => {
      const u = new SpeechSynthesisUtterance(t);
      u.lang = "pt-BR";
      if (vozes[quem]) u.voice = vozes[quem];
      u.pitch = mesmaVoz ? (quem === "joao" ? 0.85 : 1.2) : 1;
      u.rate = 1;
      if (i === partes.length - 1) u.onend = u.onerror = () => { if (falaAtual && falaAtual.el === el) calaBoca(); };
      speechSynthesis.speak(u);
    });
  }

  function cala() {
    falaAtual = null;
    if (temVoz) speechSynthesis.cancel();
    calaBoca();
  }

  function atualizaBotaoVoz() {
    const rotulo = vozLigada ? "Desligar voz" : "Ligar voz";
    btnVoz.setAttribute("aria-pressed", String(vozLigada));
    btnVoz.setAttribute("aria-label", rotulo);
    btnVoz.title = rotulo;
  }
  btnVoz.hidden = !temVoz;
  atualizaBotaoVoz();
  btnVoz.addEventListener("click", () => {
    vozLigada = !vozLigada;
    try { localStorage.setItem("seringa-voz", vozLigada ? "ligada" : "desligada"); } catch (e) { /* sem armazenamento */ }
    atualizaBotaoVoz();
    const atual = falaAtual;
    if (!vozLigada) { if (temVoz) speechSynthesis.cancel(); calaBoca(); }
    else if (atual) diz(atual.quem, atual.texto, atual.el);
  });

  // ---------- Roteiro ----------
  let passo = -1, andando = false, timer = 0, vigia = 0;
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
    diz(p.quem, p.texto, quem);
  }

  function anda(x, depois) {
    andando = true;
    balao.classList.remove("visivel");
    joao.classList.add("andando");
    joao.style.setProperty("--x", x);
    clearTimeout(timer);
    timer = setTimeout(() => { andando = false; joao.classList.remove("andando"); depois(); }, semMovimento.matches ? 0 : ANDAR);
  }

  function mostra(i) {
    passo = i;
    const p = PASSOS[i];
    clearInterval(vigia);
    cala();
    if (p.seringa) {
      app.classList.remove("modo-historia");
      app.classList.add("modo-guiado");
      guiaTexto.textContent = p.texto;
      btnContinuar.hidden = true;
      window.Seringa.encher();
      diz("maria", p.texto, guiaAvatar);
      vigia = setInterval(() => {
        if (window.Seringa.extrudado() > MASSINHA_MINIMA) { btnContinuar.hidden = false; clearInterval(vigia); }
      }, 200);
      return;
    }
    app.classList.add("modo-historia");
    app.classList.remove("modo-guiado");
    btnProximo.hidden = btnPular.hidden = !!p.fim;
    btnRever.hidden = btnUsar.hidden = !p.fim;
    if (xJoao() !== p.joao) anda(p.joao, () => fala(p));
    else fala(p);
  }

  function avanca() {
    if (historia.classList.contains("inicio")) { comeca(); return; }
    if (andando || passo < 0 || passo >= PASSOS.length - 1) return;
    if (PASSOS[passo].seringa && btnContinuar.hidden) return;
    mostra(passo + 1);
  }
  function volta() {
    if (andando || passo <= 0) return;
    mostra(passo - 1);
  }

  function colocaJoao(x) {
    historia.classList.add("sem-transicao");
    joao.style.setProperty("--x", x);
    void joao.offsetWidth;
    historia.classList.remove("sem-transicao");
  }

  // tela de abertura: o clique em "Começar" também libera a voz no navegador
  function abertura() {
    clearTimeout(timer); andando = false; passo = -1;
    cala();
    colocaJoao(INICIO);
    balao.classList.remove("visivel");
    historia.classList.add("inicio");
    app.classList.add("modo-historia");
    app.classList.remove("modo-guiado");
    btnProximo.hidden = btnRever.hidden = btnUsar.hidden = true;
    btnPular.hidden = false;
  }
  function comeca() {
    clearTimeout(timer); andando = false;
    historia.classList.remove("inicio");
    colocaJoao(ENTRADA);
    mostra(0);
  }
  function sai() {
    clearTimeout(timer); clearInterval(vigia);
    andando = false; passo = -1;
    cala();
    joao.classList.remove("andando");
    balao.classList.remove("visivel");
    historia.classList.remove("inicio");
    app.classList.remove("modo-historia", "modo-guiado");
  }

  historia.addEventListener("click", (e) => { if (!e.target.closest("button")) avanca(); });
  document.getElementById("comecar").addEventListener("click", comeca);
  btnProximo.addEventListener("click", avanca);
  btnContinuar.addEventListener("click", avanca);
  btnPular.addEventListener("click", sai);
  btnUsar.addEventListener("click", sai);
  btnRever.addEventListener("click", comeca);
  document.getElementById("ver-historia").addEventListener("click", comeca);

  document.addEventListener("keydown", (e) => {
    if (!app.classList.contains("modo-historia") && !app.classList.contains("modo-guiado")) return;
    if (e.target.closest && e.target.closest("button, input, textarea")) return;
    if (e.key === "Enter" || e.key === "ArrowRight") { e.preventDefault(); avanca(); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); volta(); }
  });

  abertura();
})();
