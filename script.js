// Seringa de Massinha — simulador de extrusão
// A cena é desenhada num <canvas> com coordenadas lógicas de 1600 x 800.

(function () {
  "use strict";

  // ---------- Formatos dos bicos (vista de frente: x para a direita, y para baixo) ----------
  function normaliza(pts) {
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    pts.forEach(([x, y]) => { minX = Math.min(minX, x); maxX = Math.max(maxX, x); minY = Math.min(minY, y); maxY = Math.max(maxY, y); });
    const cx = (minX + maxX) / 2, cy = (minY + maxY) / 2;
    const k = 1 / Math.max((maxX - minX) / 2, (maxY - minY) / 2);
    return pts.map(([x, y]) => [(x - cx) * k, (y - cy) * k]);
  }
  function poligonoRegular(n, r, rot) {
    const p = [];
    for (let i = 0; i < n; i++) { const a = (rot + (i * 360) / n) * Math.PI / 180; p.push([r * Math.cos(a), r * Math.sin(a)]); }
    return p;
  }
  function estrela(pontas, ri) {
    const p = [];
    for (let i = 0; i < pontas * 2; i++) {
      const a = (-90 + (i * 180) / pontas) * Math.PI / 180, r = i % 2 ? ri : 1;
      p.push([r * Math.cos(a), r * Math.sin(a)]);
    }
    return p;
  }
  function coracao() {
    const p = [];
    for (let i = 0; i < 48; i++) {
      const t = (i / 48) * Math.PI * 2;
      p.push([16 * Math.sin(t) ** 3, -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t))]);
    }
    return p;
  }

  const BICOS = [
    { id: "estrela", nome: "Estrela", pts: normaliza(estrela(6, 0.55)) },
    { id: "circulo", nome: "Círculo", pts: normaliza(poligonoRegular(40, 1, 0)) },
    { id: "coracao", nome: "Coração", pts: normaliza(coracao()) },
    { id: "quadrado", nome: "Quadrado", pts: normaliza([[-1, -1], [1, -1], [1, 1], [-1, 1]]) },
    { id: "triangulo", nome: "Triângulo", pts: normaliza(poligonoRegular(3, 1, -90)) },
    { id: "fita", nome: "Fita", pts: normaliza([[-1, -0.3], [1, -0.3], [1, 0.3], [-1, 0.3]]) },
    { id: "cruz", nome: "Cruz", pts: normaliza([[-0.35, -1], [0.35, -1], [0.35, -0.35], [1, -0.35], [1, 0.35], [0.35, 0.35], [0.35, 1], [-0.35, 1], [-0.35, 0.35], [-1, 0.35], [-1, -0.35], [-0.35, -0.35]]) },
  ];

  // Faces laterais de cada formato (prisma visto de lado): v = y (altura na tela), z = x (profundidade)
  BICOS.forEach((b) => {
    const pts = b.pts;
    let area = 0;
    for (let i = 0; i < pts.length; i++) { const [x1, y1] = pts[i], [x2, y2] = pts[(i + 1) % pts.length]; area += x1 * y2 - x2 * y1; }
    const faces = [];
    for (let i = 0; i < pts.length; i++) {
      const [x1, y1] = pts[i], [x2, y2] = pts[(i + 1) % pts.length];
      const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy) || 1;
      let nz = dy / L, nv = -dx / L;
      if (area < 0) { nz = -nz; nv = -nv; }
      if (nz > 0.02) {
        const luz = Math.max(0, nz * 0.72 - nv * 0.69);
        faces.push({ v1: Math.min(y1, y2), v2: Math.max(y1, y2), z: (x1 + x2) / 2, brilho: 0.55 + 0.62 * luz });
      }
    }
    faces.sort((a, b2) => a.z - b2.z);
    b.faces = faces;
    b.vmin = Math.min(...pts.map((p) => p[1]));
    b.vmax = Math.max(...pts.map((p) => p[1]));
  });

  const CORES = [
    { nome: "Rosa", hex: "#ff5fa2" },
    { nome: "Azul", hex: "#3d8bff" },
    { nome: "Verde", hex: "#2fbf71" },
    { nome: "Amarelo", hex: "#ffc23c" },
    { nome: "Roxo", hex: "#9b5de5" },
    { nome: "Laranja", hex: "#ff7a2f" },
  ];
  function rgb(hex) { const n = parseInt(hex.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
  function tom(hex, f) {
    const c = rgb(hex).map((v) => (f >= 1 ? v + (255 - v) * (f - 1) * 1.4 : v * f));
    return `rgb(${c.map((v) => Math.round(Math.max(0, Math.min(255, v)))).join(",")})`;
  }

  // ---------- Geometria da cena ----------
  const LW = 1600, LH = 800;
  const CY = 260, B0 = 380, B1 = 800, BO = 60, BI = 52;
  const N1 = 860, NT = 905, R = 28;
  const HX0 = 404, HX1 = 772, HASTE = 364;
  const CHAO = 700;

  function bezier(p0, p1, p2, p3, n) {
    const out = [];
    for (let i = 0; i <= n; i++) {
      const t = i / n, u = 1 - t;
      out.push([u ** 3 * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t ** 3 * p3[0],
                u ** 3 * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t ** 3 * p3[1]]);
    }
    return out;
  }
  const yChao = CHAO - R - 2;
  let bruto = [];
  for (let x = NT; x <= 960; x += 2) bruto.push([x, CY]);
  bruto = bruto.concat(bezier([960, CY], [1070, CY + 4], [1110, yChao], [1220, yChao], 300).slice(1));
  for (let x = 1222; x <= 1575; x += 2) bruto.push([x, yChao]);
  const CAM = [bruto[0]], ACC = [0];
  for (const p of bruto.slice(1)) {
    const ult = CAM[CAM.length - 1], d = Math.hypot(p[0] - ult[0], p[1] - ult[1]);
    if (d >= 1.8) { CAM.push(p); ACC.push(ACC[ACC.length - 1] + d); }
  }
  const TAN = CAM.map((_, i) => {
    const a = CAM[Math.max(0, i - 3)], b = CAM[Math.min(CAM.length - 1, i + 3)];
    const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1;
    return [dx / L, dy / L];
  });
  const TOTAL = ACC[ACC.length - 1];
  const K = TOTAL / (HX1 - HX0);
  function indice(s) { let lo = 0, hi = ACC.length - 1; while (lo < hi) { const m = (lo + hi) >> 1; if (ACC[m] < s) lo = m + 1; else hi = m; } return lo; }

  // ---------- Estado ----------
  const estado = {
    bico: BICOS[0], cor: CORES[0].hex,
    hx: HX0, apertando: false, auto: false,
    t: 0,
  };
  const extrudado = () => (estado.hx - HX0) * K;

  // ---------- Canvas ----------
  const cv = document.getElementById("cena");
  const ctx = cv.getContext("2d");
  let escala = 1;
  const palco = cv.parentElement;
  function ajusta() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    let w;
    if (document.fullscreenElement && document.fullscreenElement.contains(cv)) {
      // em tela cheia: a cena inteira cabe no espaço livre (largura e altura)
      const r = palco.getBoundingClientRect();
      w = Math.max(200, Math.floor(Math.min(r.width, r.height * 2)));
      cv.style.width = w + "px";
    } else {
      cv.style.width = "";
      w = cv.clientWidth || 800;
    }
    const bw = Math.round(w * dpr);
    if (cv.width !== bw) { cv.width = bw; cv.height = Math.round((w / 2) * dpr); }
    escala = cv.width / LW;
  }
  const ro = new ResizeObserver(ajusta);
  ro.observe(cv); ro.observe(palco);
  document.addEventListener("fullscreenchange", () => requestAnimationFrame(ajusta));
  ajusta();

  let tema = {}, temaLido = -Infinity;
  function leTema(now) {
    if (now - temaLido < 400) return;
    temaLido = now;
    const cs = getComputedStyle(document.documentElement);
    ["scene-top", "scene-bot", "floor-top", "floor-bot", "glass", "glass-line", "metal", "ink", "muted", "card", "accent"].forEach((k) => { tema[k] = cs.getPropertyValue("--" + k).trim(); });
    tema.fonte = cs.getPropertyValue("--font-body").trim();
    tema.titulo = cs.getPropertyValue("--font-display").trim();
  }

  function retArred(x, y, w, h, r) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); }

  function faixa(i0, i1, a, b) {
    ctx.beginPath();
    for (let i = i0; i <= i1; i++) { const p = CAM[i], t = TAN[i]; ctx.lineTo(p[0] - t[1] * a, p[1] + t[0] * a); }
    for (let i = i1; i >= i0; i--) { const p = CAM[i], t = TAN[i]; ctx.lineTo(p[0] - t[1] * b, p[1] + t[0] * b); }
    ctx.closePath(); ctx.fill();
  }

  function formaEm(cx, cy, pts, r, tx, ty, achata) {
    // tx,ty = direção do caminho; normal = (-ty, tx)
    ctx.beginPath();
    pts.forEach(([x, y]) => {
      ctx.lineTo(cx + tx * x * r * achata - ty * y * r, cy + ty * x * r * achata + tx * y * r);
    });
    ctx.closePath();
  }

  function desenhaMassinhaFora(ext) {
    if (ext < 2) return;
    const bico = estado.bico, cor = estado.cor;
    const i1 = Math.max(1, Math.min(indice(ext), CAM.length - 1));
    // contorno
    ctx.fillStyle = tom(cor, 0.5);
    faixa(0, i1, bico.vmin * R - 1.6, bico.vmax * R + 1.6);
    bico.faces.forEach((f) => {
      ctx.fillStyle = tom(cor, f.brilho);
      faixa(0, i1, f.v1 * R - 0.4, f.v2 * R + 0.4);
    });
    // ponta (tampa) mostrando o formato
    const i = Math.min(indice(ext), CAM.length - 1);
    const p = CAM[i], t = TAN[i];
    formaEm(p[0] + t[0] * 2, p[1] + t[1] * 2, estado.bico.pts, R + 1, t[0], t[1], 0.5);
    ctx.fillStyle = tom(cor, 1.12); ctx.fill();
    ctx.lineWidth = 2.5; ctx.strokeStyle = tom(cor, 0.5); ctx.stroke();
  }

  function desenhaSeringa(now) {
    const hx = estado.hx, cor = estado.cor, bico = estado.bico;
    const vazia = estado.hx >= HX1 - 0.5;
    const meia = Math.max(Math.abs(bico.vmin), Math.abs(bico.vmax)) * R;
    // massinha dentro do corpo
    if (!vazia) {
      ctx.fillStyle = tom(cor, 1);
      ctx.fillRect(hx + 12, CY - BI, B1 - hx - 10, BI * 2);
      ctx.fillStyle = tom(cor, 1.18); ctx.fillRect(hx + 12, CY - BI, B1 - hx - 10, 12);
      ctx.fillStyle = tom(cor, 0.78); ctx.fillRect(hx + 12, CY + BI - 10, B1 - hx - 10, 10);
    }
    // massinha no cone e no bico (fica com um restinho mesmo vazia)
    ctx.fillStyle = tom(cor, vazia ? 0.85 : 1);
    ctx.beginPath();
    ctx.moveTo(B1 - 2, CY - BI); ctx.lineTo(N1, CY - meia); ctx.lineTo(NT, CY - meia);
    ctx.lineTo(NT, CY + meia); ctx.lineTo(N1, CY + meia); ctx.lineTo(B1 - 2, CY + BI); ctx.closePath(); ctx.fill();

    // haste do êmbolo e borracha
    const px = hx - HASTE;
    ctx.fillStyle = tema.metal; ctx.strokeStyle = tema["glass-line"]; ctx.lineWidth = 3;
    ctx.fillRect(px + 8, CY - 12, hx - px - 8, 24); ctx.strokeRect(px + 8, CY - 12, hx - px - 8, 24);
    ctx.fillStyle = "#4b4e5c"; retArred(hx - 4, CY - BI - 1, 18, BI * 2 + 2, 5); ctx.fill();
    ctx.strokeStyle = "#757a8c"; ctx.lineWidth = 3;
    [-30, 0, 30].forEach((d) => { ctx.beginPath(); ctx.moveTo(hx - 4, CY + d); ctx.lineTo(hx + 14, CY + d); ctx.stroke(); });

    // vidro / plástico do corpo
    ctx.fillStyle = tema.glass; ctx.strokeStyle = tema["glass-line"]; ctx.lineWidth = 3.5;
    retArred(B0, CY - BO, B1 - B0, BO * 2, 9); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,0.55)"; retArred(B0 + 18, CY - BO + 9, B1 - B0 - 36, 9, 5); ctx.fill();
    ctx.strokeStyle = tema["glass-line"]; ctx.lineWidth = 2.5;
    for (let i = 0, x = B0 + 36; x < B1 - 16; x += 26, i++) {
      const L = i % 5 === 0 ? 24 : 12;
      ctx.beginPath(); ctx.moveTo(x, CY + BO - 4); ctx.lineTo(x, CY + BO - 4 - L); ctx.stroke();
    }
    // aba para os dedos
    ctx.fillStyle = tema.metal; ctx.lineWidth = 3.5;
    retArred(B0 - 16, CY - 112, 20, 224, 7); ctx.fill(); ctx.stroke();
    // cone e ponta
    ctx.fillStyle = tema.glass;
    ctx.beginPath(); ctx.moveTo(B1, CY - BO + 6); ctx.lineTo(N1, CY - meia - 6); ctx.lineTo(N1, CY + meia + 6); ctx.lineTo(B1, CY + BO - 6); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.rect(N1, CY - meia - 6, NT - N1, meia * 2 + 12); ctx.fill(); ctx.stroke();

    // apoio do polegar
    ctx.fillStyle = tema.metal; ctx.strokeStyle = tema["glass-line"];
    retArred(px - 12, CY - 86, 22, 172, 8); ctx.fill(); ctx.stroke();

    // seta "Aperte!"
    const ext = extrudado();
    if (!vazia) {
      const bob = estado.apertando || estado.auto ? 0 : Math.sin(now / 160) * 8;
      const ax = px - 26 + bob;
      if (ax > 60) {
        ctx.fillStyle = "#ff9b24";
        ctx.fillRect(ax - 110, CY - 15, 72, 30);
        ctx.beginPath(); ctx.moveTo(ax - 40, CY - 38); ctx.lineTo(ax, CY); ctx.lineTo(ax - 40, CY + 38); ctx.closePath(); ctx.fill();
        if (ext < 1) {
          ctx.font = `800 34px ${tema.fonte}`; ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
          ctx.fillStyle = "#e07400"; ctx.fillText("Aperte!", ax - 62, CY - 56);
        }
      }
    }
  }

  function desenhaDetalhe(ext) {
    const cx = 1250, cy = 150, r = 78;
    const font = tema.fonte;
    function disco(x, rotulo, sub) {
      ctx.fillStyle = tema.card; ctx.strokeStyle = tema["glass-line"]; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.arc(x, cy, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.textAlign = "center"; ctx.fillStyle = tema.ink;
      ctx.font = `800 24px ${font}`; ctx.fillText(rotulo, x, cy + r + 32);
      ctx.fillStyle = tema.muted; ctx.font = `600 19px ${font}`; ctx.fillText(sub, x, cy + r + 56);
    }
    disco(cx, "Bico da seringa", "(visto de frente)");
    ctx.fillStyle = "#c3cfe2"; ctx.strokeStyle = tema["glass-line"]; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(cx, cy, 58, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    formaEm(cx, cy, estado.bico.pts, 44, 1, 0, 1);
    const vazia = estado.hx >= HX1 - 0.5;
    ctx.fillStyle = vazia ? "#3b4258" : tom(estado.cor, 1); ctx.fill();
    ctx.strokeStyle = vazia ? "#2a3044" : tom(estado.cor, 0.5); ctx.lineWidth = 3; ctx.stroke();

    if (ext > 4) {
      const c2 = 1470;
      ctx.fillStyle = tema.ink; ctx.font = `800 60px ${font}`; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText("=", (cx + c2) / 2, cy + 2); ctx.textBaseline = "alphabetic";
      disco(c2, "Massinha", "(cortada)");
      formaEm(c2, cy, estado.bico.pts, 50, 1, 0, 1);
      ctx.fillStyle = tom(estado.cor, 1); ctx.fill(); ctx.strokeStyle = tom(estado.cor, 0.5); ctx.lineWidth = 3; ctx.stroke();
      formaEm(c2 - 5, cy - 5, estado.bico.pts, 22, 1, 0, 1);
      ctx.fillStyle = tom(estado.cor, 1.2); ctx.fill();
    }
  }

  function desenhaFundo() {
    let g = ctx.createLinearGradient(0, 0, 0, CHAO);
    g.addColorStop(0, tema["scene-top"]); g.addColorStop(1, tema["scene-bot"]);
    ctx.fillStyle = g; ctx.fillRect(0, 0, LW, CHAO);
    g = ctx.createLinearGradient(0, CHAO, 0, LH);
    g.addColorStop(0, tema["floor-top"]); g.addColorStop(1, tema["floor-bot"]);
    ctx.fillStyle = g; ctx.fillRect(0, CHAO, LW, LH - CHAO);
    ctx.fillStyle = "rgba(255,255,255,0.25)"; ctx.fillRect(0, CHAO, LW, 5);
    ctx.strokeStyle = "rgba(0,0,0,0.08)"; ctx.lineWidth = 2;
    for (let x = -200; x < LW; x += 230) { ctx.beginPath(); ctx.moveTo(x, CHAO + 30); ctx.lineTo(x + 360, LH); ctx.stroke(); }
    // sombra da seringa
    ctx.save(); ctx.translate(640, CHAO + 6); ctx.scale(1, 0.06);
    const sg2 = ctx.createRadialGradient(0, 0, 10, 0, 0, 340); sg2.addColorStop(0, "rgba(40,25,10,0.3)"); sg2.addColorStop(1, "rgba(40,25,10,0)");
    ctx.fillStyle = sg2; ctx.beginPath(); ctx.arc(0, 0, 340, 0, Math.PI * 2); ctx.fill(); ctx.restore();
  }

  function desenhaLegenda(ext) {
    const vazia = estado.hx >= HX1 - 0.5;
    let txt = "Segure o botão (ou a barra de espaço) para apertar";
    if (vazia) txt = "A seringa esvaziou! Clique em “Encher de novo”";
    else if (ext > 4) txt = `A massinha sai com o formato do bico: ${estado.bico.nome.toLowerCase()}`;
    ctx.font = `800 32px ${tema.fonte}`; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    const w = ctx.measureText(txt).width + 60;
    ctx.fillStyle = tema.card; retArred(LW / 2 - w / 2, 722, w, 58, 29); ctx.fill();
    ctx.fillStyle = tema.ink; ctx.fillText(txt, LW / 2, 752); ctx.textBaseline = "alphabetic";
  }

  // ---------- Laço de animação ----------
  let antes = performance.now();
  const VEL = 95; // px lógicos por segundo do êmbolo
  function quadro(now) {
    const dt = Math.min(0.05, (now - antes) / 1000); antes = now;
    if ((estado.apertando || estado.auto) && estado.hx < HX1) {
      estado.hx = Math.min(HX1, estado.hx + VEL * dt);
      if (estado.hx >= HX1) { estado.auto = false; avisa("A seringa esvaziou. Clique em “Encher de novo” para recomeçar."); }
    }
    leTema(now);
    ctx.setTransform(escala, 0, 0, escala, 0, 0);
    desenhaFundo();
    const ext = extrudado();
    desenhaMassinhaFora(ext);
    desenhaSeringa(now);
    desenhaDetalhe(ext);
    desenhaLegenda(ext);
    requestAnimationFrame(quadro);
  }

  // ---------- Controles ----------
  const status = document.getElementById("status");
  function avisa(msg) { status.textContent = msg; }

  const boxBicos = document.getElementById("bicos");
  BICOS.forEach((b, i) => {
    const btn = document.createElement("button");
    btn.className = "chip"; btn.type = "button"; btn.id = "bico-" + b.id;
    btn.setAttribute("aria-pressed", i === 0 ? "true" : "false");
    const pts = b.pts.map(([x, y]) => `${(x * 11 + 13).toFixed(2)},${(y * 11 + 13).toFixed(2)}`).join(" ");
    btn.innerHTML = `<svg viewBox="0 0 26 26" aria-hidden="true"><polygon points="${pts}"/></svg><span>${b.nome}</span>`;
    btn.addEventListener("click", () => escolheBico(i));
    boxBicos.appendChild(btn);
  });
  function escolheBico(i) {
    estado.bico = BICOS[i];
    boxBicos.querySelectorAll(".chip").forEach((c, j) => c.setAttribute("aria-pressed", j === i ? "true" : "false"));
    avisa(`Bico trocado para ${BICOS[i].nome.toLowerCase()}.`);
  }

  const boxCores = document.getElementById("cores");
  CORES.forEach((c, i) => {
    const btn = document.createElement("button");
    btn.className = "swatch"; btn.type = "button"; btn.id = "cor-" + i;
    btn.style.background = c.hex; btn.title = c.nome; btn.setAttribute("aria-label", c.nome);
    btn.setAttribute("aria-pressed", i === 0 ? "true" : "false");
    btn.addEventListener("click", () => {
      estado.cor = c.hex;
      boxCores.querySelectorAll(".swatch").forEach((s, j) => s.setAttribute("aria-pressed", j === i ? "true" : "false"));
    });
    boxCores.appendChild(btn);
  });

  const btnApertar = document.getElementById("apertar");
  function comeca(e) { if (e) e.preventDefault(); estado.apertando = true; btnApertar.classList.add("ativo"); if (estado.hx < HX1) avisa(""); }
  function para() { estado.apertando = false; btnApertar.classList.remove("ativo"); }
  btnApertar.addEventListener("pointerdown", (e) => { btnApertar.setPointerCapture?.(e.pointerId); comeca(e); });
  btnApertar.addEventListener("pointerup", para);
  btnApertar.addEventListener("pointercancel", para);
  btnApertar.addEventListener("lostpointercapture", para);
  btnApertar.addEventListener("keydown", (e) => { if (e.key === "Enter") comeca(e); });
  btnApertar.addEventListener("keyup", (e) => { if (e.key === "Enter") para(); });
  // apertar também clicando/segurando na própria cena
  cv.addEventListener("pointerdown", (e) => { cv.setPointerCapture?.(e.pointerId); comeca(e); });
  cv.addEventListener("pointerup", para);
  cv.addEventListener("pointercancel", para);

  document.getElementById("tudo").addEventListener("click", () => { if (estado.hx < HX1) { estado.auto = true; avisa(""); } });
  function encher() {
    estado.hx = HX0; estado.auto = false; estado.apertando = false;
    avisa("Seringa cheia de novo.");
  }
  document.getElementById("encher").addEventListener("click", encher);

  const app = document.getElementById("app");
  document.getElementById("tela").addEventListener("click", () => {
    if (document.fullscreenElement) document.exitFullscreen?.();
    else if (app.requestFullscreen) app.requestFullscreen().catch(() => avisa("A tela cheia não está disponível aqui. Use F11 no navegador."));
    else avisa("A tela cheia não está disponível aqui. Use F11 no navegador.");
  });

  document.addEventListener("keydown", (e) => {
    if (e.target.closest && e.target.closest("input, textarea")) return;
    if (app.classList.contains("modo-historia")) return; // a seringa fica escondida durante a história
    if (e.code === "Space") { e.preventDefault(); if (!e.repeat) comeca(); }
    else if (e.key === "r" || e.key === "R") encher();
    else if (/^[1-7]$/.test(e.key)) escolheBico(Number(e.key) - 1);
  });
  document.addEventListener("keyup", (e) => { if (e.code === "Space") para(); });
  window.addEventListener("blur", para);

  // usado pela historinha (historia.js)
  window.Seringa = { extrudado, encher };

  requestAnimationFrame(quadro);
})();
