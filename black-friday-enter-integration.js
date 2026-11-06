
(() => {
  "use strict";

  // ========================================
  // BLACK FRIDAY EVOLUA - AVISO PREMIUM
  // ENTER + LOVABLE
  // ========================================

  if (location.pathname.toLowerCase() !== "/inicio/painel") return;
  if (window.__evoluaBFPremiumLoaded) return;
  window.__evoluaBFPremiumLoaded = true;

  const C = {
    marker: "evolua-black-friday",
    destino: "https://evolua-friday.lovable.app/",
    tokenPath: "/Configuracoes/TokenPolo",
    timeout: 8000
  };

  let observer = null;
  let poloPromise = null;
  const initialized = new WeakSet();

  // ========================================
  // CAPTURA DO POLO - METODO VALIDADO
  // ========================================

  async function obterPolo() {
    if (!poloPromise) {
      poloPromise = (async () => {
        if (!window.axios) {
          throw new Error("Axios indisponivel");
        }

        const r = await window.axios.get(C.tokenPath, {
          timeout: C.timeout
        });

        const doc = new DOMParser().parseFromString(
          String(r.data || ""),
          "text/html"
        );

        const seletores = [
          "#inputCodigo",
          "#CodigoPolo",
          '[name="CodigoPolo"]',
          '[name="CodigoExterno"]',
          '[name="CodigoExternoPolo"]'
        ];

        for (const seletor of seletores) {
          const el = doc.querySelector(seletor);
          if (!el) continue;

          const valor = String(
            el.value ||
            el.getAttribute("value") ||
            el.textContent ||
            ""
          );

          const digitos = valor.replace(/\D/g, "");

          if (digitos && digitos.length <= 6) {
            return digitos.padStart(6, "0");
          }
        }

        throw new Error("Polo nao encontrado");
      })().catch(erro => {
        poloPromise = null;
        throw erro;
      });
    }

    return poloPromise;
  }

  function abrirRoleta(polo) {
    if (!/^\d{6}$/.test(polo)) {
      throw new Error("Codigo do polo invalido");
    }

    const url = new URL(C.destino);
    url.searchParams.set("polo", polo);

    window.location.assign(url.toString());
  }

  // ========================================
  // ESTILOS VISUAIS
  // ========================================

  if (!document.getElementById("evolua-bf-premium-css")) {
    const style = document.createElement("style");
    style.id = "evolua-bf-premium-css";

    style.textContent = `
      .ebf-card, .ebf-card * {
        box-sizing: border-box;
      }

      .ebf-card {
        position: relative;
        width: 100%;
        max-width: 1200px;
        margin: auto;
        overflow: hidden;
        border-radius: 20px;
        border: 1px solid #b78a43;
        background:
          radial-gradient(
            ellipse at 77% 50%,
            rgba(189, 48, 25, .32),
            transparent 55%
          ),
          linear-gradient(
            125deg,
            #110d12 0%,
            #251015 55%,
            #110c10 100%
          );
        color: #fff;
        font-family: Arial, sans-serif;
        box-shadow: 0 15px 40px rgba(0,0,0,.16);
      }

      .ebf-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 8px;
        padding: 16px 24px;
        border-bottom: 1px solid rgba(229,181,86,.2);
      }

      .ebf-tag {
        display: inline-block;
        border: 1px solid #dcaa52;
        border-radius: 30px;
        padding: 7px 13px;
        background: rgba(228,178,77,.1);
        color: #f1c76c;
        font-size: 11px;
        font-weight: 800;
        letter-spacing: 2px;
      }

      .ebf-exclusive {
        color: #dfbe83;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 2px;
      }

      .ebf-layout {
        display: grid;
        grid-template-columns: 1fr 1fr;
        align-items: center;
        gap: 20px;
        padding: 20px 35px 24px;
      }

      .ebf-copy {
        text-align: left;
      }

      .ebf-kicker {
        margin: 0 0 12px;
        color: #edba56;
        font-size: 13px;
        font-weight: 800;
        letter-spacing: 4px;
      }

      .ebf-title {
        margin: 0;
        color: #fff;
        font-size: clamp(29px, 3.6vw, 52px);
        line-height: 1.07;
        font-weight: 900;
        letter-spacing: -1.2px;
      }

      .ebf-title span {
        color: #e7b65b;
      }

      .ebf-description {
        max-width: 430px;
        margin: 17px 0 20px;
        color: #e0cbd0;
        font-size: clamp(13px, 1.25vw, 16px);
        line-height: 1.6;
      }

      .ebf-cta {
        width: 100%;
        max-width: 390px;
        min-height: 59px;
        padding: 14px 22px;
        border: 2px solid #f4d080;
        border-radius: 12px;
        background: linear-gradient(
          135deg, #f5d27f, #dba33a
        );
        color: #211008;
        font: 900 16px Arial, sans-serif;
        cursor: pointer;
        animation: ebf-pulse 1.8s infinite;
      }

      .ebf-cta:hover {
        filter: brightness(1.1);
      }

      .ebf-cta:disabled {
        opacity: .75;
        cursor: wait;
        animation: none;
      }

      .ebf-cta:focus-visible,
      .ebf-wheel-button:focus-visible {
        outline: 3px solid white;
        outline-offset: 4px;
      }

      .ebf-status {
        margin: 12px 0 0;
        color: #f6d38d;
        font-size: 13px;
      }

      .ebf-note {
        margin: 15px 0 0;
        color: #aa9295;
        font-size: 12px;
      }

      .ebf-wheel-zone {
        position: relative;
        width: min(100%, 440px);
        margin: auto;
        aspect-ratio: 1;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .ebf-wheel-glow {
        position: absolute;
        inset: 12%;
        border-radius: 50%;
        background: #ed8c29;
        filter: blur(44px);
        opacity: .27;
        pointer-events: none;
      }

      .ebf-wheel-button {
        position: relative;
        display: block;
        width: 100%;
        padding: 0;
        border: 0;
        background: transparent;
        cursor: pointer;
        transition: transform .25s ease;
      }

      .ebf-wheel-button:hover {
        transform: scale(1.035);
      }

      .ebf-wheel-button svg {
        display: block;
        width: 100%;
        height: auto;
        filter: drop-shadow(
          0 10px 20px rgba(0,0,0,.35)
        );
      }

      .ebf-wheel-face {
        transform-origin: 200px 200px;
        animation: ebf-float 5s ease-in-out infinite;
      }

      .ebf-center {
        fill: #171319;
        stroke: #f4c767;
        stroke-width: 6;
      }

      .ebf-bottom {
        padding: 11px 18px;
        border-top: 1px solid rgba(231,187,90,.2);
        color: #bba5a3;
        text-align: center;
        font-size: 11px;
        letter-spacing: .5px;
      }

      @keyframes ebf-pulse {
        0%, 100% {
          transform: scale(1);
          box-shadow: 0 0 0 0 rgba(233,184,83,.5);
        }
        65% {
          transform: scale(1.025);
          box-shadow: 0 0 0 13px rgba(233,184,83,0);
        }
      }

      @keyframes ebf-float {
        0%, 100% {
          transform: rotate(-3deg);
        }
        50% {
          transform: rotate(3deg);
        }
      }

      @media (max-width: 720px) {
        .ebf-top {
          padding: 12px 16px;
        }

        .ebf-layout {
          grid-template-columns: 1fr;
          gap: 5px;
          padding: 18px;
        }

        .ebf-copy {
          text-align: center;
        }

        .ebf-title {
          font-size: clamp(28px, 7vw, 42px);
        }

        .ebf-description {
          margin: 12px auto;
        }

        .ebf-wheel-zone {
          max-width: 280px;
          grid-row: 1;
        }

        .ebf-cta {
          max-width: 100%;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .ebf-cta,
        .ebf-wheel-face {
          animation: none;
        }

        .ebf-wheel-button {
          transition: none;
        }
      }
    `;

    document.head.appendChild(style);
  }

  // ========================================
  // CONSTRUIR ROLETA ILUSTRATIVA EM SVG
  // ========================================

  function criarRoleta() {
    const NS = "http://www.w3.org/2000/svg";

    const svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", "0 0 400 400");
    svg.setAttribute("aria-hidden", "true");

    const grupo = document.createElementNS(NS, "g");
    grupo.setAttribute("class", "ebf-wheel-face");

    const cores = [
      "#e32125", "#17171d",
      "#e6b652", "#b51c25",
      "#e6b652", "#17171d",
      "#e32125", "#e6b652"
    ];

    const rotulos = [
      "BÔNUS", "SURPRESA", "BRINDE", "EXTRA",
      "PRÊMIO", "VANTAGEM", "ESPECIAL", "EVOLUA"
    ];

    function ponto(angulo, raio) {
      const rad = angulo * Math.PI / 180;

      return {
        x: 200 + Math.cos(rad) * raio,
        y: 200 + Math.sin(rad) * raio
      };
    }

    for (let i = 0; i < 8; i++) {
      const a1 = -90 + i * 45;
      const a2 = a1 + 45;

      const p1 = ponto(a1, 175);
      const p2 = ponto(a2, 175);

      const setor = document.createElementNS(NS, "path");

      setor.setAttribute(
        "d",
        `M200 200 L${p1.x} ${p1.y} ` +
        `A175 175 0 0 1 ${p2.x} ${p2.y} Z`
      );

      setor.setAttribute("fill", cores[i]);
      setor.setAttribute("stroke", "#bd893d");
      setor.setAttribute("stroke-width", "1.5");

      grupo.appendChild(setor);

      const meio = a1 + 22.5;
      const pos = ponto(meio, 118);

      const texto = document.createElementNS(NS, "text");

      texto.setAttribute("x", pos.x);
      texto.setAttribute("y", pos.y);
      texto.setAttribute("fill",
        cores[i] === "#e6b652" ? "#18151a" : "#ffffff"
      );
      texto.setAttribute("font-size", "13");
      texto.setAttribute("font-weight", "900");
      texto.setAttribute("text-anchor", "middle");
      texto.setAttribute("dominant-baseline", "middle");

      let rotacao = meio + 90;
      if (rotacao > 90 && rotacao < 270) {
        rotacao += 180;
      }

      texto.setAttribute(
        "transform",
        `rotate(${rotacao},${pos.x},${pos.y})`
      );

      texto.textContent = rotulos[i];
      grupo.appendChild(texto);
    }

    const borda = document.createElementNS(NS, "circle");
    borda.setAttribute("cx", "200");
    borda.setAttribute("cy", "200");
    borda.setAttribute("r", "184");
    borda.setAttribute("fill", "none");
    borda.setAttribute("stroke", "#e4b65c");
    borda.setAttribute("stroke-width", "13");
    grupo.appendChild(borda);

    for (let i = 0; i < 24; i++) {
      const p = ponto(i * 15, 184);
      const luz = document.createElementNS(NS, "circle");

      luz.setAttribute("cx", p.x);
      luz.setAttribute("cy", p.y);
      luz.setAttribute("r", "3.4");
      luz.setAttribute("fill", "#fff0bd");

      grupo.appendChild(luz);
    }

    const centro = document.createElementNS(NS, "circle");
    centro.setAttribute("cx", "200");
    centro.setAttribute("cy", "200");
    centro.setAttribute("r", "43");
    centro.setAttribute("class", "ebf-center");
    grupo.appendChild(centro);

    const marca = document.createElementNS(NS, "text");
    marca.setAttribute("x", "200");
    marca.setAttribute("y", "205");
    marca.setAttribute("text-anchor", "middle");
    marca.setAttribute("fill", "#f2cb76");
    marca.setAttribute("font-size", "17");
    marca.setAttribute("font-weight", "900");
    marca.textContent = "EVOLUA";
    grupo.appendChild(marca);

    svg.appendChild(grupo);

    const seta = document.createElementNS(NS, "path");
    seta.setAttribute("d", "M184 4 L216 4 L200 48 Z");
    seta.setAttribute("fill", "#fff0b5");
    seta.setAttribute("stroke", "#a87b31");
    seta.setAttribute("stroke-width", "3");
    seta.setAttribute("stroke-linejoin", "round");
    svg.appendChild(seta);

    return svg;
  }

  // ========================================
  // MONTAR O AVISO
  // ========================================

  function iniciar(marker) {
    const modal = marker.closest(".modal-content");
    const body = modal?.querySelector(".modal-body");

    if (!modal || !body) return false;
    if (initialized.has(body)) return true;

    initialized.add(body);

    const dialog = modal.closest(".modal-dialog");

    if (dialog) {
      dialog.style.setProperty("width", "96vw", "important");
      dialog.style.setProperty("max-width", "1250px", "important");
      dialog.style.setProperty("margin", "10px auto", "important");
    }

    body.style.setProperty("padding", "12px", "important");
    body.style.setProperty("overflow-y", "auto", "important");
    body.style.setProperty(
      "max-height",
      "calc(100dvh - 155px)",
      "important"
    );

    const card = document.createElement("section");
    card.className = "ebf-card";

    // HTML fixo, sem dados externos.
    card.innerHTML = `
      <div class="ebf-top">
        <span class="ebf-tag">BLACK FRIDAY 2026</span>
        <span class="ebf-exclusive">EXCLUSIVO PARA PARCEIROS</span>
      </div>

      <div class="ebf-layout">
        <div class="ebf-copy">
          <p class="ebf-kicker">EVOLUA EDUCAÇÃO</p>

          <h2 class="ebf-title">
            SUA SORTE PODE VIRAR
            <span>BENEFÍCIO!</span>
          </h2>

          <p class="ebf-description">
            Uma oportunidade especial chegou para sua escola.
            Descubra o benefício que preparamos para você!
          </p>

          <button type="button" class="ebf-cta">
            DESBLOQUEAR MEU BENEFÍCIO
          </button>

          <p class="ebf-status" role="status"></p>

          <p class="ebf-note">
            Uma participação por escola.
            O benefício será registrado para seu polo.
          </p>
        </div>

        <div class="ebf-wheel-zone">
          <div class="ebf-wheel-glow"></div>
          <button
            class="ebf-wheel-button"
            type="button"
            aria-label="Participar da Black Friday Evolua"
            title="Clique para descobrir seu benefício">
          </button>
        </div>
      </div>

      <div class="ebf-bottom">
        BLACK FRIDAY EVOLUA • BENEFÍCIOS EXCLUSIVOS
      </div>
    `;

    const button = card.querySelector(".ebf-cta");
    const wheelButton = card.querySelector(".ebf-wheel-button");
    const status = card.querySelector(".ebf-status");

    wheelButton.appendChild(criarRoleta());

    let busy = false;

    async function participar() {
      if (busy) return;

      busy = true;
      button.disabled = true;
      wheelButton.disabled = true;
      button.textContent = "IDENTIFICANDO SUA ESCOLA...";
      status.textContent = "";

      try {
        const polo = await obterPolo();

        button.textContent = "ABRINDO SUA ROLETA...";
        abrirRoleta(polo);

      } catch (erro) {
        console.warn("[Evolua BF] Falha:", erro);

        status.textContent =
          "Não conseguimos identificar sua escola. " +
          "Tente novamente.";

        button.disabled = false;
        wheelButton.disabled = false;
        button.textContent = "TENTAR NOVAMENTE";
        busy = false;
      }
    }

    button.addEventListener("click", participar);
    wheelButton.addEventListener("click", participar);

    marker.style.display = "none";
    body.replaceChildren(marker, card);

    console.info("[Evolua BF] Campanha visual carregada");
    return true;
  }

  // ========================================
  // AGUARDAR O AVISO DO ENTER
  // ========================================

  function verificar() {
    const marker = document.getElementById(C.marker);

    if (marker && iniciar(marker)) {
      observer?.disconnect();
    }
  }

  observer = new MutationObserver(verificar);

  verificar();

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });

  setTimeout(() => observer?.disconnect(), 30000);
})();
