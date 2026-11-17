
/*
 * CENTRAL DE SPRINTS - EVOLUA EDUCACAO
 * VERSAO 4.0 - 17/11/2026
 *
 * - Utiliza a imagem ja cadastrada no ENTER
 * - Identifica o aviso pelo marcador exclusivo
 * - Reconstrui a imagem sem estilos de recorte
 * - Ajusta o modal ao conteudo
 * - Cria os seis botoes abaixo da imagem
 * - Gamificacao e Evolua Oferta: ESGOTADO
 * - Mantem os outros quatro grupos ativos
 * - Oculta "Nao mostrar novamente"
 * - Preserva o botao X do aviso
 * - Nao interfere em outros avisos
 */

(() => {
  "use strict";

  if (
    location.pathname.toLowerCase() !==
    "/inicio/painel"
  ) return;

  if (window.__evoluaCentralSprintsV4) return;
  window.__evoluaCentralSprintsV4 = true;

  const CONFIG = {
    marker: "evolua-central-sprints",
    title: "Central de Sprints - Evolua Educacao",
    message:
      "👇🏼 Clique nos botões abaixo e participe das Sprints! 👇🏼",
    maxWidth: 1350,
    observationTimeout: 45000
  };

  // ========================================
  // SPRINTS E STATUS DE INSCRICAO
  // ========================================

  const SPRINTS = [
    {
      name: "Gamificação",
      color: "#8526b8",
      url: null,
      esgotado: true
    },
    {
      name: "Evolua Oferta",
      color: "#e47711",
      url: null,
      esgotado: true
    },
    {
      name: "Inglês",
      color: "#087fbd",
      url:
        "https://chat.whatsapp.com/L7Cz72De12jH4Wga96uQfX",
      esgotado: false
    },
    {
      name: "Robótica",
      color: "#06a4ba",
      url:
        "https://chat.whatsapp.com/DRBpHNjDrfdCSQbROOAwAR",
      esgotado: false
    },
    {
      name: "Informática Kids",
      color: "#49a418",
      url:
        "https://chat.whatsapp.com/FAJCoDF6hi9ERIzJWPJTxB",
      esgotado: false
    },
    {
      name: "Inteligência Artificial",
      color: "#6240be",
      url:
        "https://chat.whatsapp.com/FB7RfRmQnjxH2rVDjjDUaB",
      esgotado: false
    }
  ];

  const modalObservers = new WeakMap();

  // ========================================
  // UTILITARIOS
  // ========================================

  function applyStyles(element, styles) {
    if (!element) return;

    Object.entries(styles).forEach(
      ([key, value]) => {
        element.style.setProperty(
          key,
          String(value),
          "important"
        );
      }
    );
  }

  function createElement(
    tag,
    styles = {},
    text = ""
  ) {
    const element = document.createElement(tag);

    applyStyles(element, styles);

    if (text) {
      element.textContent = text;
    }

    return element;
  }

  function normalizeText(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();
  }

  // ========================================
  // OCULTAR BOTAO NATIVO DO AVISO
  // ========================================

  function hideNativeButton(modal) {
    if (
      !modal ||
      modal.dataset.evoluaSprintsReady !== "1"
    ) return;

    const candidates = modal.querySelectorAll(
      "button, a, input[type='button'], " +
      "input[type='submit'], [role='button']"
    );

    candidates.forEach((element) => {
      const text = normalizeText(
        element.innerText ||
        element.value ||
        element.textContent ||
        element.getAttribute("aria-label")
      );

      if (
        text.includes("nao mostrar novamente")
      ) {
        applyStyles(element, {
          display: "none"
        });

        element.setAttribute(
          "aria-hidden",
          "true"
        );
      }
    });
  }

  function watchNativeButton(modal) {
    if (modalObservers.has(modal)) return;

    const observer = new MutationObserver(() => {
      hideNativeButton(modal);
    });

    observer.observe(modal, {
      childList: true,
      subtree: true
    });

    modalObservers.set(modal, observer);

    hideNativeButton(modal);
  }

  // ========================================
  // DIMENSIONAMENTO DO MODAL
  // ========================================

  function resizeModal(modal) {
    if (
      !modal ||
      modal.dataset.evoluaSprintsReady !== "1"
    ) return;

    const dialog = modal.querySelector(
      ".modal-dialog"
    );

    const content = modal.querySelector(
      ".modal-content"
    );

    const body = modal.querySelector(
      ".modal-body"
    );

    const wrap = modal.querySelector(
      '[data-evolua-sprints-wrap="1"]'
    );

    const image = wrap?.querySelector(
      '[data-evolua-sprints-image="1"]'
    );

    const links = wrap?.querySelector(
      '[data-evolua-sprints-links="1"]'
    );

    if (
      !dialog ||
      !content ||
      !body ||
      !wrap ||
      !image ||
      !links
    ) return;

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    const mobile = screenWidth < 700;

    const reservedHeight = mobile ? 260 : 190;

    const availableHeight = Math.max(
      220,
      screenHeight - reservedHeight
    );

    const widthByHeight =
      availableHeight * (16 / 9);

    const maxScreenWidth =
      screenWidth * (mobile ? 0.96 : 0.94);

    const desiredWidth = mobile
      ? maxScreenWidth
      : Math.min(
          CONFIG.maxWidth,
          maxScreenWidth,
          widthByHeight
        );

    const finalWidth = Math.floor(
      Math.max(250, desiredWidth)
    );

    applyStyles(dialog, {
      width: `${finalWidth}px`,
      "max-width": "96vw",
      margin: mobile
        ? "8px auto"
        : "12px auto"
    });

    applyStyles(content, {
      height: "auto",
      "min-height": "0",
      "max-height": "calc(100vh - 20px)",
      overflow: "auto"
    });

    applyStyles(body, {
      height: "auto",
      "min-height": "0",
      "max-height": "none",
      overflow: "visible"
    });

    applyStyles(wrap, {
      width: "100%",
      "max-width": "100%"
    });

    applyStyles(image, {
      width: "100%",
      height: "auto",
      display: "block",
      "object-fit": "contain",
      "max-height": mobile
        ? "none"
        : `${Math.floor(availableHeight)}px`
    });

    const contentWidth = Math.max(
      0,
      finalWidth - 24
    );

    let columns = 6;

    if (contentWidth < 550) {
      columns = 2;
    } else if (contentWidth < 900) {
      columns = 3;
    }

    applyStyles(links, {
      "grid-template-columns":
        `repeat(${columns}, minmax(0, 1fr))`
    });
  }

  // ========================================
  // CRIAR OS SEIS BOTOES
  // ========================================

  function createButtons() {
    const nav = createElement("nav", {
      display: "grid",
      "grid-template-columns":
        "repeat(6, minmax(0, 1fr))",
      gap: "8px",
      width: "100%",
      margin: "0",
      padding: "0",
      "box-sizing": "border-box"
    });

    nav.dataset.evoluaSprintsLinks = "1";

    nav.setAttribute(
      "aria-label",
      "Grupos oficiais das Sprints"
    );

    SPRINTS.forEach((sprint) => {
      const isDisabled = sprint.esgotado;

      // Sprints esgotadas nao recebem link.
      const button = document.createElement(
        isDisabled ? "span" : "a"
      );

      const label = isDisabled
        ? "ESGOTADO"
        : sprint.name;

      button.textContent = label;

      applyStyles(button, {
        display: "flex",
        "align-items": "center",
        "justify-content": "center",
        "text-align": "center",
        "min-width": "0",
        "min-height": "44px",
        padding: "9px 5px",

        background: isDisabled
          ? "#858585"
          : sprint.color,

        color: "#ffffff",

        "font-family": "Arial, sans-serif",
        "font-size": "13px",
        "font-weight": "700",
        "line-height": "1.25",
        "text-decoration": "none",
        "border-radius": "9px",

        "box-shadow": isDisabled
          ? "none"
          : "0 3px 9px rgba(0,0,0,.15)",

        "box-sizing": "border-box",
        "overflow-wrap": "break-word",

        cursor: isDisabled
          ? "not-allowed"
          : "pointer",

        opacity: isDisabled ? "0.85" : "1",

        transition:
          "filter .2s ease, transform .2s ease"
      });

      if (isDisabled) {
        button.setAttribute(
          "aria-label",
          `Sprint ${sprint.name} - inscrições esgotadas`
        );

        button.setAttribute(
          "title",
          `${sprint.name}: turma esgotada`
        );

        button.setAttribute(
          "aria-disabled",
          "true"
        );

      } else {
        button.href = sprint.url;
        button.target = "_blank";
        button.rel = "noopener noreferrer";

        button.setAttribute(
          "aria-label",
          `Entrar no grupo da Sprint ${sprint.name}`
        );

        button.addEventListener(
          "mouseenter",
          () => {
            button.style.filter =
              "brightness(1.12)";

            button.style.transform =
              "translateY(-2px)";
          }
        );

        button.addEventListener(
          "mouseleave",
          () => {
            button.style.filter = "";
            button.style.transform = "";
          }
        );
      }

      nav.appendChild(button);
    });

    return nav;
  }

  // ========================================
  // TEXTO ENTRE IMAGEM E BOTOES
  // ========================================

  function createMessage() {
    return createElement(
      "p",
      {
        margin: "10px 0 9px",
        padding: "0 6px",
        color: "#173257",
        "font-family": "Arial, sans-serif",
        "font-size":
          "clamp(14px,1.5vw,20px)",
        "font-weight": "800",
        "line-height": "1.3",
        "text-align": "center"
      },
      CONFIG.message
    );
  }

  // ========================================
  // INICIALIZAR O AVISO PERSONALIZADO
  // ========================================

  function initialize(marker) {
    if (!marker || !marker.isConnected) {
      return false;
    }

    const modal = marker.closest(".modal");

    const content = marker.closest(
      ".modal-content"
    );

    const body = marker.closest(
      ".modal-body"
    );

    if (!modal || !content || !body) {
      return false;
    }

    if (
      modal.dataset.evoluaSprintsReady === "1"
    ) {
      hideNativeButton(modal);
      resizeModal(modal);
      return true;
    }

    // Capturar imagem cadastrada no ENTER.
    const nativeImage = body.querySelector("img");

    if (!nativeImage) return false;

    const imageSource =
      nativeImage.currentSrc ||
      nativeImage.getAttribute("src") ||
      nativeImage.src;

    if (!imageSource) return false;

    const wrap = createElement("section", {
      width: "100%",
      margin: "0 auto",
      padding: "0",
      "box-sizing": "border-box",
      "font-family": "Arial, sans-serif"
    });

    wrap.dataset.evoluaSprintsWrap = "1";

    // Recriar a imagem sem o recorte nativo.
    const image = document.createElement("img");

    image.dataset.evoluaSprintsImage = "1";
    image.src = imageSource;
    image.alt = CONFIG.title;

    applyStyles(image, {
      display: "block",
      width: "100%",
      height: "auto",
      "object-fit": "contain",
      "border-radius": "10px"
    });

    const message = createMessage();
    const links = createButtons();

    marker.hidden = true;

    marker.setAttribute(
      "aria-hidden",
      "true"
    );

    // Recria somente o conteudo deste aviso.
    wrap.append(image, message, links);

    body.replaceChildren(marker, wrap);

    applyStyles(content, {
      height: "auto",
      "min-height": "0",
      overflow: "auto"
    });

    applyStyles(body, {
      display: "block",
      margin: "0",
      padding: "10px 12px 14px",
      height: "auto",
      "min-height": "0",
      "max-height": "none",
      overflow: "visible",
      "text-align": "initial"
    });

    const header = content.querySelector(
      ".modal-header"
    );

    if (header) {
      applyStyles(header, {
        "min-height": "0",
        padding: "10px 16px"
      });
    }

    modal.dataset.evoluaSprintsReady = "1";

    resizeModal(modal);

    // Oculta somente o botao nativo deste aviso.
    watchNativeButton(modal);

    image.addEventListener("load", () => {
      resizeModal(modal);
    });

    console.info(
      "[Central de Sprints] V4 inicializada."
    );

    console.info(
      "[Central de Sprints] " +
      "Gamificacao e Evolua Oferta esgotadas."
    );

    return true;
  }

  // ========================================
  // OBSERVAR CARREGAMENTO DO ENTER
  // ========================================

  function scan() {
    document.querySelectorAll(
      `#${CONFIG.marker}`
    ).forEach(initialize);
  }

  scan();

  const observer = new MutationObserver(scan);

  observer.observe(
    document.documentElement,
    {
      childList: true,
      subtree: true
    }
  );

  window.setTimeout(() => {
    observer.disconnect();
  }, CONFIG.observationTimeout);

  window.addEventListener("resize", () => {
    document.querySelectorAll(
      '.modal[data-evolua-sprints-ready="1"]'
    ).forEach(resizeModal);
  });

})();
