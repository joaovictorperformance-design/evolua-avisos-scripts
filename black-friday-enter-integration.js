
(() => {
  "use strict";

  // ==========================================
  // BLACK FRIDAY EVOLUA - ENTER + LOVABLE
  // Identificacao automatica por polo
  // ==========================================

  if (location.pathname.toLowerCase() !== "/inicio/painel") return;

  if (window.__evoluaBlackFridayLoaded) return;
  window.__evoluaBlackFridayLoaded = true;

  const CONFIG = {
    markerId: "evolua-black-friday",
    tokenPath: "/Configuracoes/TokenPolo",

    postUrl:
      "https://evolua-friday.lovable.app/api/public/enter/identificar",

    fallbackUrl:
      "https://evolua-friday.lovable.app/",

    buttonText: "CLIQUE AQUI E GANHE BENEFÍCIOS",

    timeoutMs: 6000
  };

  const initialized = new WeakSet();
  let observer = null;
  let poloPromise = null;

  // ==========================================
  // IDENTIFICACAO DO POLO
  // ==========================================

  async function getPoloCode() {
    if (!poloPromise) {
      poloPromise = (async () => {
        const controller = new AbortController();

        const timeout = setTimeout(
          () => controller.abort(),
          CONFIG.timeoutMs
        );

        try {
          const response = await fetch(CONFIG.tokenPath, {
            method: "GET",
            credentials: "same-origin",
            cache: "no-store",
            signal: controller.signal
          });

          if (!response.ok) {
            throw new Error(
              "Consulta do polo: HTTP " + response.status
            );
          }

          const html = await response.text();

          const doc = new DOMParser().parseFromString(
            html,
            "text/html"
          );

          const selectors = [
            "#inputCodigo",
            "#CodigoPolo",
            '[name="CodigoPolo"]',
            '[name="CodigoExterno"]',
            '[name="CodigoExternoPolo"]'
          ];

          for (const selector of selectors) {
            const field = doc.querySelector(selector);

            if (!field) continue;

            const raw =
              field.value ||
              field.getAttribute("value") ||
              field.textContent ||
              "";

            const digits = String(raw).replace(/\D/g, "");

            if (digits.length >= 1 && digits.length <= 6) {
              return digits.padStart(6, "0");
            }
          }

          throw new Error(
            "Codigo comercial do polo nao encontrado na resposta"
          );

        } finally {
          clearTimeout(timeout);
        }
      })().catch(error => {
        poloPromise = null;
        throw error;
      });
    }

    return poloPromise;
  }

  // ==========================================
  // ENVIO DO POLO PARA O LOVABLE
  // ==========================================

  function enviarPolo(polo) {
    if (!/^\d{6}$/.test(polo)) {
      throw new Error("Codigo de polo invalido");
    }

    const form = document.createElement("form");

    form.method = "POST";
    form.action = CONFIG.postUrl;
    form.enctype = "application/x-www-form-urlencoded";
    form.target = "_self";
    form.style.display = "none";

    const input = document.createElement("input");

    input.type = "hidden";
    input.name = "polo_code";
    input.value = polo;

    form.appendChild(input);
    document.body.appendChild(form);

    // Navegacao por POST sem depender de CORS.
    HTMLFormElement.prototype.submit.call(form);
  }

  // ==========================================
  // ESTILO DO BOTAO PULSANTE
  // ==========================================

  if (!document.getElementById("evolua-bf-styles")) {
    const style = document.createElement("style");
    style.id = "evolua-bf-styles";

    style.textContent = `
      @keyframes evoluaBFPulse {
        0%, 100% {
          transform: scale(1);
          box-shadow: 0 0 0 0 rgba(210,30,30,.5);
        }
        65% {
          transform: scale(1.035);
          box-shadow: 0 0 0 15px rgba(210,30,30,0);
        }
      }

      .evolua-bf-cta {
        display: block;
        max-width: 95%;
        margin: 15px auto;
        padding: 16px 28px;
        border: 2px solid #f4c55d;
        border-radius: 12px;
        background: linear-gradient(135deg,#e32828,#a50c16);
        color: white;
        font: 800 17px Arial,sans-serif;
        cursor: pointer;
        animation: evoluaBFPulse 1.8s infinite;
      }

      .evolua-bf-cta:disabled {
        opacity: .7;
        cursor: wait;
        animation: none;
      }

      .evolua-bf-cta:focus-visible {
        outline: 3px solid #f4c55d;
        outline-offset: 3px;
      }

      .evolua-bf-image {
        display: block;
        width: 100%;
        height: auto;
        max-height: 65vh;
        object-fit: contain;
        border-radius: 8px;
        cursor: pointer;
      }

      @media(max-width:600px) {
        .evolua-bf-cta {
          font-size: 14px;
          padding: 13px 18px;
        }
        .evolua-bf-image {
          max-height: 55vh;
        }
      }

      @media(prefers-reduced-motion:reduce) {
        .evolua-bf-cta {
          animation: none;
        }
      }
    `;

    document.head.appendChild(style);
  }

  // ==========================================
  // CONSTRUCAO DO AVISO
  // ==========================================

  function initMarker(marker) {
    const modal = marker.closest(".modal-content");
    const body = modal?.querySelector(".modal-body");

    if (!modal || !body) return false;
    if (initialized.has(body)) return true;

    const original = [...body.querySelectorAll("img")]
      .find(img => img.getAttribute("src"));

    const src = original?.currentSrc || original?.src;

    if (!src) return false;

    initialized.add(body);

    const dialog = modal.closest(".modal-dialog");

    if (dialog) {
      dialog.style.setProperty(
        "width", "94vw", "important"
      );

      dialog.style.setProperty(
        "max-width", "1250px", "important"
      );

      dialog.style.setProperty(
        "margin", "20px auto", "important"
      );
    }

    modal.style.setProperty(
      "overflow", "visible", "important"
    );

    Object.entries({
      padding: "12px",
      margin: "0",
      overflow: "auto",
      height: "auto",
      "max-height": "calc(100vh - 150px)"
    }).forEach(([key, value]) => {
      body.style.setProperty(key, value, "important");
    });

    const wrapper = document.createElement("div");

    wrapper.style.cssText =
      "max-width:1200px;margin:0 auto;" +
      "text-align:center;font-family:Arial,sans-serif;";

    const image = document.createElement("img");

    image.src = src;
    image.alt = "Black Friday Evolua";
    image.className = "evolua-bf-image";
    image.tabIndex = 0;
    image.setAttribute("role", "button");

    const button = document.createElement("button");

    button.type = "button";
    button.className = "evolua-bf-cta";
    button.textContent = CONFIG.buttonText;

    const status = document.createElement("p");

    status.setAttribute("role", "status");
    status.style.cssText =
      "color:#333;font:14px Arial,sans-serif;" +
      "margin:8px auto;";

    let busy = false;
    let fallback = false;

    async function participar() {
      if (busy) return;

      if (fallback) {
        location.assign(CONFIG.fallbackUrl);
        return;
      }

      busy = true;
      button.disabled = true;

      button.textContent = "IDENTIFICANDO SUA ESCOLA...";
      status.textContent = "";

      try {
        const polo = await getPoloCode();

        console.info(
          "[Evolua BF] Polo identificado:",
          polo
        );

        button.textContent = "ABRINDO SUA ROLETA...";

        enviarPolo(polo);

      } catch (error) {
        console.warn(
          "[Evolua BF] Falha ao identificar polo:",
          error
        );

        status.textContent =
          "Não foi possível identificar sua escola automaticamente.";

        button.textContent = "ACESSAR COM CÓDIGO DO POLO";
        button.disabled = false;

        fallback = true;
        busy = false;
      }
    }

    image.addEventListener("click", participar);

    image.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        participar();
      }
    });

    button.addEventListener("click", participar);

    marker.style.display = "none";

    wrapper.append(image, button, status);
    body.replaceChildren(marker, wrapper);

    console.info("[Evolua BF] Aviso inicializado");

    return true;
  }

  // ==========================================
  // MONITORAMENTO DO MODAL
  // ==========================================

  function scan() {
    const marker = document.getElementById(
      CONFIG.markerId
    );

    if (marker && initMarker(marker)) {
      observer?.disconnect();
    }
  }

  scan();

  if (!document.getElementById(CONFIG.markerId)) {
    observer = new MutationObserver(scan);

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });

    setTimeout(() => {
      observer?.disconnect();
    }, 30000);
  }
})();
