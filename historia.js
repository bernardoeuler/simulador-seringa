// Historinha da extrusão: o João tem dúvida e a Maria explica com a seringa de massinha.
// As posições (--x) são em % da largura do palco.

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
  const MARIA = 74, ENTRADA = -12, ANDAR = 1800;
  const MASSINHA_MINIMA = 60; // quanto a massinha precisa sair para liberar o "Continuar"

  const app = document.getElementById("app");
  const historia = document.getElementById("historia");
  const joao = document.getElementById("joao"), maria = document.getElementById("maria");
  const balao = document.getElementById("balao");
  const balaoNome = document.getElementById("balao-nome"), balaoTexto = document.getElementById("balao-texto");
  const btnProximo = document.getElementById("proximo"), btnPular = document.getElementById("pular");
  const btnRever = document.getElementById("rever"), btnUsar = document.getElementById("usar");
  const guiaTexto = document.getElementById("guia-texto"), btnContinuar = document.getElementById("continuar");
  const semMovimento = window.matchMedia("(prefers-reduced-motion: reduce)");

  document.getElementById("guia-avatar").appendChild(maria.querySelector("svg").cloneNode(true));

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
    [joao, maria].forEach((b) => b.classList.remove("falando"));
    void joao.offsetWidth; // reinicia a animação de fala
    (p.quem === "joao" ? joao : maria).classList.add("falando");
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
    if (p.seringa) {
      app.classList.remove("modo-historia");
      app.classList.add("modo-guiado");
      guiaTexto.textContent = p.texto;
      btnContinuar.hidden = true;
      window.Seringa.encher();
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
    if (andando || passo < 0 || passo >= PASSOS.length - 1) return;
    if (PASSOS[passo].seringa && btnContinuar.hidden) return;
    mostra(passo + 1);
  }
  function volta() {
    if (andando || passo <= 0) return;
    mostra(passo - 1);
  }

  function comeca() {
    clearTimeout(timer); andando = false;
    historia.classList.add("sem-transicao");
    joao.style.setProperty("--x", ENTRADA);
    void joao.offsetWidth;
    historia.classList.remove("sem-transicao");
    mostra(0);
  }
  function sai() {
    clearTimeout(timer); clearInterval(vigia);
    andando = false; passo = -1;
    joao.classList.remove("andando");
    balao.classList.remove("visivel");
    app.classList.remove("modo-historia", "modo-guiado");
  }

  historia.addEventListener("click", (e) => { if (!e.target.closest("button")) avanca(); });
  btnProximo.addEventListener("click", avanca);
  btnContinuar.addEventListener("click", avanca);
  btnPular.addEventListener("click", sai);
  btnUsar.addEventListener("click", sai);
  btnRever.addEventListener("click", comeca);
  document.getElementById("ver-historia").addEventListener("click", comeca);

  document.addEventListener("keydown", (e) => {
    if (passo < 0) return;
    if (e.target.closest && e.target.closest("button, input, textarea")) return;
    if (e.key === "Enter" || e.key === "ArrowRight") { e.preventDefault(); avanca(); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); volta(); }
  });

  comeca();
})();
