
/*
 * =====================================================
 * CENTRAL DE SPRINTS - EVOLUA EDUCACAO
 * Integracao personalizada com avisos do ENTER
 *
 * VERSAO 2.0 - 16/11/2026
 *
 * FUNCIONALIDADES:
 * - Identifica o aviso pelo marcador exclusivo
 * - Captura a imagem cadastrada no ENTER
 * - Reconstrói a imagem sem recortes nativos
 * - Ajusta o tamanho do modal ao conteudo
 * - Exibe mensagem de chamada para acao
 * - Cria 6 botoes coloridos com links WhatsApp
 * - Mantem os 6 botoes na mesma linha no desktop
 * - Adapta o layout para tablets e celulares
 * - Preserva o cabecalho e o rodape do ENTER
 * - Nao interfere nos demais avisos
 *
 * MARCADOR OBRIGATORIO:
 * <span id="evolua-central-sprints"
 *       style="display:none"></span>
 * =====================================================
 */

(() => {
  "use strict";

  // Executar somente no painel inicial do ENTER.
  if (
    location.pathname.toLowerCase() !==
    "/inicio/painel"
  ) {
    return;
  }

  // Impedir inicializacao duplicada.
  if (window.__evoluaCentralSprintsV2) {
    return;
  }

  window.__evoluaCentralSprintsV2 = true;

  // =====================================================
  // CONFIGURACOES
  // =====================================================

  const CONFIG = {
    marker: "evolua-central-sprints",

    title: "Central de Sprints - Evolua Educacao",

    message:
      "👇🏼 Clique nos botões abaixo e participe das Sprints! 👇🏼",

    maxWidth: 1350,

    observationTimeout: 45000
  };

  // =====================================================
  // GRUPOS OFICIAIS
  // =====================================================

  const SPRINTS = [
    {
      name: "Gamificação",
      color: "#8526b8",
      url:
        "https://chat.whatsapp.com/FLn07Zl095fHhZCq8dPuIC"
    },
    {
      name: "Evolua Oferta",
      color: "#e47711",
      url:
        "https://chat.whatsapp.com/B84gmv6Vx6h88fUG4VwSci"
    },
    {
      name: "Inglês",
      color: "#087fbd",
      url:
        "https://chat.whatsapp.com/L7Cz72De12jH4Wga96uQfX"
    },
    {
      name: "Robótica",
      color: "#06a4ba",
      url:
        "https://chat.whatsapp.com/DRBpHNjDrfdCSQbROOAwAR"
    },
    {
      name: "Informática Kids",
      color: "#49a418",
      url:
        "https://chat.whatsapp.com/FAJCoDF6hi9ERIzJWPJTxB"
    },
    {
      name: "Inteligência Artificial",
      color: "#6240be",
      url:
        "https://chat.whatsapp.com/FB7RfRmQnjxH2rVDjjDUaB"
    }
  ];

  // =====================================================
  // UTILITARIOS
  // =====================================================

  function applyStyles(element, styles) {
    if (!element) return;

    Object.entries(styles).forEach(([property, value]) => {
      element.style.setProperty(
        property,
        String(value),
        "important"
      );
    });
  }

  function createElement(tag, styles = {}, text = "") {
    const element = document.createElement(tag);

    applyStyles(element, styles);

    if (text) {
      element.textContent = text;
    }

    return element;
  }

  // =====================================================
  // DIMENSIONAMENTO RESPONSIVO
  // =====================================================

  function resizeModal(modal) {
    if (!modal) return;

    if (
      modal.dataset.evoluaSprintsReady !== "1"
    ) {
      return;
    }

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
    ) {
      return;
    }

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    // Em celulares, permitir rolagem do conteudo.
    const mobile = screenWidth < 700;

    // Reservar espaco para titulo, mensagem,
    // botoes e controles nativos do ENTER.
    const reservedHeight = mobile ? 260 : 220;

    const availableHeight = Math.max(
      220,
      screenHeight - reservedHeight
    );

    // Imagem original possui proporcao 16:9.
    const widthByHeight =
      availableHeight * (16 / 9);

    // O modal nao pode ultrapassar a tela.
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

    // Usar a largura real disponivel no modal
    // para definir o numero de colunas.
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

  // =====================================================
  // CRIACAO DOS BOTOES
  // =====================================================

  function createButtons() {
    const nav = createElement("nav", {
      display: "grid",

      "grid-template-columns":
        "repeat(6, minmax(0, 1fr))",

      gap: "10px",

      width: "100%",

      margin: "0",

      padding: "0",

      "box-sizing": "border-box"
    });

    nav.dataset.evoluaSprintsLinks = "1";

    nav.setAttribute(
      "aria-label",
      "Acessar grupos oficiais das Sprints"
    );

    SPRINTS.forEach((sprint) => {
      const button = createElement(
        "a",
        {
          display: "flex",

          "align-items": "center",

          "justify-content": "center",

          "text-align": "center",

          "min-width": "0",

          "min-height": "50px",

          padding: "10px 6px",

          background: sprint.color,

          color: "#ffffff",

          "font-family":
            "Arial, Helvetica, sans-serif",

          "font-size": "14px",

          "font-weight": "700",

          "line-height": "1.25",

          "text-decoration": "none",

          "border-radius": "10px",

          "box-shadow":
            "0 4px 10px rgba(0,0,0,.16)",

          "box-sizing": "border-box",

          "overflow-wrap": "break-word",

          cursor: "pointer",

          transition:
            "filter .2s ease, transform .2s ease"
        },
        sprint.name
      );

      button.href = sprint.url;

      button.target = "_blank";

      button.rel = "noopener noreferrer";

      button.setAttribute(
        "aria-label",
        `Entrar no grupo da Sprint ${sprint.name}`
      );

      // Efeito ao passar o mouse.
      button.addEventListener(
        "mouseenter",
        () => {
          button.style.filter = "brightness(1.12)";
          button.style.transform = "translateY(-2px)";
        }
      );

      button.addEventListener(
        "mouseleave",
        () => {
          button.style.filter = "";
          button.style.transform = "";
        }
      );

      button.addEventListener(
        "focus",
        () => {
          button.style.outline =
            "3px solid #ffd34a";
          button.style.outlineOffset = "2px";
        }
      );

      button.addEventListener(
        "blur",
        () => {
          button.style.outline = "";
          button.style.outlineOffset = "";
        }
      );

      nav.appendChild(button);
    });

    return nav;
  }

  // =====================================================
  // TEXTO ENTRE A IMAGEM E OS BOTOES
  // =====================================================

  function createMessage() {
    return createElement(
      "p",
      {
        margin: "12px 0 10px",

        padding: "0 6px",

        color: "#173257",

        "font-family":
          "Arial, Helvetica, sans-serif",

        "font-size":
          "clamp(14px, 1.5vw, 21px)",

        "font-weight": "800",

        "line-height": "1.3",

        "text-align": "center"
      },
      CONFIG.message
    );
  }

  // =====================================================
  // RECONSTRUCAO DO AVISO
  // =====================================================

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

    // Evitar recriar o aviso ja processado.
    if (
      modal.dataset.evoluaSprintsReady === "1"
    ) {
      resizeModal(modal);
      return true;
    }

    // Localizar a imagem cadastrada no ENTER.
    const nativeImage = body.querySelector("img");

    if (!nativeImage) {
      return false;
    }

    // Capturar somente o endereco da imagem.
    // A imagem nativa sera descartada para
    // eliminar estilos de recorte do ENTER.
    const imageSource =
      nativeImage.currentSrc ||
      nativeImage.getAttribute("src") ||
      nativeImage.src;

    if (!imageSource) {
      return false;
    }

    // Container principal.
    const wrap = createElement("section", {
      width: "100%",

      margin: "0 auto",

      padding: "0",

      "box-sizing": "border-box",

      "font-family":
        "Arial, Helvetica, sans-serif"
    });

    wrap.dataset.evoluaSprintsWrap = "1";

    // Nova imagem sem estilos herdados.
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

    // Mensagem de chamada para acao.
    const message = createMessage();

    // Seis botoes clicaveis.
    const links = createButtons();

    // Preservar o marcador para futuras
    // verificacoes do ENTER.
    marker.hidden = true;

    marker.setAttribute(
      "aria-hidden",
      "true"
    );

    // Reconstruir o conteudo visual.
    wrap.appendChild(image);

    wrap.appendChild(message);

    wrap.appendChild(links);

    // Remove a imagem nativa e os estilos
    // que causavam cortes e espacos vazios.
    body.replaceChildren(marker, wrap);

    // Ajustar janela e conteudo do ENTER.
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

    // Registrar inicializacao concluida.
    modal.dataset.evoluaSprintsReady = "1";

    // Aplicar dimensoes finais.
    resizeModal(modal);

    // Recalcular apos carregar a imagem.
    image.addEventListener("load", () => {
      resizeModal(modal);
    });

    console.info(
      "[Central de Sprints] Versao 2.0 inicializada."
    );

    console.info(
      "[Central de Sprints] 6 grupos configurados."
    );

    return true;
  }

  // =====================================================
  // DETECCAO DO MARCADOR
  // =====================================================

  function scan() {
    const markers = document.querySelectorAll(
      `#${CONFIG.marker}`
    );

    markers.forEach((marker) => {
      initialize(marker);
    });
  }

  // Executar ao carregar.
  scan();

  // Aguardar a criacao dinamica do aviso.
  const observer = new MutationObserver(() => {
    scan();
  });

  observer.observe(
    document.documentElement,
    {
      childList: true,
      subtree: true
    }
  );

  // Evitar observador permanente.
  window.setTimeout(() => {
    observer.disconnect();
  }, CONFIG.observationTimeout);

  // Recalcular ao redimensionar o navegador.
  window.addEventListener("resize", () => {
    document.querySelectorAll(
      '.modal[data-evolua-sprints-ready="1"]'
    ).forEach((modal) => {
      resizeModal(modal);
    });
  });

})();
