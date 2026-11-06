
(() => {
  "use strict";

  // ============================================
  // BLACK FRIDAY EVOLUA - ENTER + LOVABLE
  // Imagem clicavel + botao pulsante
  // Identificacao automatica do polo via Axios
  // ============================================

  if (location.pathname.toLowerCase() !== "/inicio/painel") {
    return;
  }

  if (window.__evoluaBFUrlInitialized) return;
  window.__evoluaBFUrlInitialized = true;

  const C = {
    marker: "evolua-black-friday",
    destino: "https://evolua-friday.lovable.app/",
    tokenPath: "/Configuracoes/TokenPolo",
    textoBotao: "🎁 DESBLOQUEAR MEU BENEFÍCIO",
    timeout: 8000
  };

  const initialized = new WeakSet();
  let observer = null;
  let poloPromise = null;

  // ============================================
  // IDENTIFICACAO DO POLO COM AXIOS
  // ============================================

  async function obterPolo() {
    if (!poloPromise) {
      poloPromise = (async () => {
        if (!window.axios) {
          throw new Error("Axios indisponivel no ENTER");
        }

        const resposta = await window.axios.get(
          C.tokenPath,
          {
            timeout: C.timeout
          }
        );

        const doc = new DOMParser().parseFromString(
          String(resposta.data || ""),
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

        throw new Error("Codigo comercial do polo nao encontrado");
      })().catch(erro => {
        poloPromise = null;
        throw erro;
      });
    }

    return poloPromise;
  }

  // ============================================
  // REDIRECIONAMENTO PARA O LOVABLE
  // ============================================

  function abrirRoleta(polo) {
    if (!/^\d{6}$/.test(polo)) {
      throw new Error("Codigo de polo invalido");
    }

    const url = new URL(C.destino);

    // O Lovable identifica o polo por este parametro.
    url.searchParams.set("polo", polo);

    console.info(
      "[Evolua BF] Abrindo roleta para o polo:",
      polo
    );

    // Navegacao direta: sem POST externo e sem CORS.
    window.location.assign(url.toString());
  }

  // ============================================
  // ESTILOS DO AVISO
  // ============================================

  if (!document.getElementById("evolua-bf-estilos")) {
    const style = document.createElement("style");
    style.id = "evolua-bf-estilos";

    style.textContent = `
      @keyframes evoluaBFPulse {
        0%, 100% {
          transform: scale(1);
          box-shadow: 0 0 0 0 rgba(210, 30, 30, .50);
        }

        60% {
          transform: scale(1.035);
          box-shadow: 0 0 0 15px rgba(210, 30, 30, 0);
        }
      }

      .evolua-bf-img {
        display: block;
        width: 100%;
        height: auto;
        max-height: 65vh;
        object-fit: contain;
        border-radius: 8px;
        cursor: pointer;
        transition: transform .22s ease, filter .22s ease;
      }

      .evolua-bf-img:hover {
        transform: scale(1.012);
        filter: brightness(1.06);
      }

      .evolua-bf-img:focus-visible {
        outline: 3px solid #f5cc66;
        outline-offset: 4px;
      }

      .evolua-bf-btn {
        display: block;
        max-width: 95%;
        margin: 15px auto 8px;
        padding: 16px 28px;
        border: 2px solid #f5cc66;
        border-radius: 12px;
        background: linear-gradient(
          135deg,
          #e32828,
          #a50c16
        );
        color: #ffffff;
        font: 800 17px Arial, sans-serif;
        text-align: center;
        cursor: pointer;
        animation: evoluaBFPulse 1.8s infinite;
        transition: filter .2s ease;
      }

      .evolua-bf-btn:hover {
        filter: brightness(1.12);
      }

      .evolua-bf-btn:disabled {
        opacity: .7;
        cursor: wait;
        animation: none;
      }

      .evolua-bf-btn:focus-visible {
        outline: 3px solid #f5cc66;
        outline-offset: 4px;
      }

      .evolua-bf-status {
        margin: 8px auto;
        color: #333333;
        font: 14px Arial, sans-serif;
        line-height: 1.4;
      }

      @media (max-width: 600px) {
        .evolua-bf-img {
          max-height: 52vh;
        }

        .evolua-bf-btn {
          font-size: 14px;
          padding: 13px 18px;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .evolua-bf-btn {
          animation: none;
        }

        .evolua-bf-img {
          transition: none;
        }
      }
    `;

    document.head.appendChild(style);
  }

  // ============================================
  // CONSTRUCAO DO AVISO NO ENTER
  // ============================================

  function iniciar(marker) {
    const modal = marker.closest(".modal-content");
    const body = modal?.querySelector(".modal-body");

    if (!modal || !body) return false;
    if (initialized.has(body)) return true;

    // Captura a imagem cadastrada no aviso.
    const original = [...body.querySelectorAll("img")]
      .find(img => img.getAttribute("src"));

    const src = original?.currentSrc || original?.src;

    if (!src) {
      console.warn(
        "[Evolua BF] Nenhuma imagem encontrada no aviso."
      );
      return false;
    }

    initialized.add(body);

    // Expande o modal para exibir a arte completa.
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
    }).forEach(([chave, valor]) => {
      body.style.setProperty(
        chave,
        valor,
        "important"
      );
    });

    const wrap = document.createElement("div");

    wrap.style.cssText =
      "width:100%;" +
      "max-width:1200px;" +
      "margin:0 auto;" +
      "text-align:center;" +
      "font-family:Arial,sans-serif;";

    // ============================================
    // IMAGEM DA ROLETA CLICAVEL
    // ============================================

    const image = document.createElement("img");

    image.src = src;
    image.alt = "Clique na roleta para desbloquear seu benefício";
    image.title = "Participar da Black Friday Evolua";
    image.className = "evolua-bf-img";

    image.tabIndex = 0;
    image.setAttribute("role", "button");
    image.setAttribute(
      "aria-label",
      "Participar da roleta Black Friday Evolua"
    );

    // ============================================
    // BOTAO PULSANTE
    // ============================================

    const button = document.createElement("button");

    button.type = "button";
    button.className = "evolua-bf-btn";
    button.textContent = C.textoBotao;

    // ============================================
    // MENSAGENS DE STATUS
    // ============================================

    const status = document.createElement("p");

    status.className = "evolua-bf-status";
    status.setAttribute("role", "status");

    let busy = false;

    // ============================================
    // PARTICIPACAO E REDIRECIONAMENTO
    // ============================================

    async function participar() {
      if (busy) return;

      busy = true;
      button.disabled = true;
      button.textContent = "PREPARANDO SUA ROLETA...";
      status.textContent = "";

      try {
        // Captura o polo apenas depois do clique.
        const polo = await obterPolo();

        console.info(
          "[Evolua BF] Polo identificado:",
          polo
        );

        button.textContent = "ABRINDO SUA ROLETA...";

        abrirRoleta(polo);

      } catch (erro) {
        console.warn(
          "[Evolua BF] Falha na identificacao:",
          erro
        );

        status.textContent =
          "Não foi possível identificar sua escola. " +
          "Tente novamente.";

        button.textContent = C.textoBotao;
        button.disabled = false;
        busy = false;
      }
    }

    // Clique em qualquer parte da imagem.
    image.addEventListener("click", participar);

    // Acessibilidade via teclado.
    image.addEventListener("keydown", evento => {
      if (
        evento.key === "Enter" ||
        evento.key === " "
      ) {
        evento.preventDefault();
        participar();
      }
    });

    // Clique no botao pulsante.
    button.addEventListener("click", participar);

    marker.style.display = "none";

    // Remove a imagem original e recria sem cortes.
    wrap.append(image, button, status);
    body.replaceChildren(marker, wrap);

    console.info(
      "[Evolua BF] Aviso inicializado com imagem clicavel"
    );

    return true;
  }

  // ============================================
  // AGUARDAR O AVISO APARECER NO ENTER
  // ============================================

  function verificar() {
    const marker = document.getElementById(C.marker);

    if (marker && iniciar(marker)) {
      observer?.disconnect();
    }
  }

  verificar();

  observer = new MutationObserver(verificar);

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });

  setTimeout(() => {
    observer?.disconnect();
  }, 30000);

})();
