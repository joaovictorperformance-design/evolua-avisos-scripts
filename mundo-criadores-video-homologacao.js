
(function () {
  "use strict";

  // ==========================================
  // CONFIGURACOES
  // ==========================================

  const ID = "E-games";
  const VIDEO = "1238378621";
  const LINK = "https://linkhubtree.lovable.app/performance";

  const SEGMENTACAO = {
    modo: "exclusao",
    polos: ["014069", "000008"]
  };

  const inicializados = new WeakSet();
  const verificando = new WeakSet();

  let poloPromise = null;

  // ==========================================
  // IDENTIFICACAO DO POLO
  // ==========================================

  async function obterPolo() {
    if (poloPromise) return poloPromise;

    poloPromise = (async () => {
      const resposta = await fetch(
        "/Configuracoes/TokenPolo",
        { credentials: "same-origin" }
      );

      if (!resposta.ok) {
        throw new Error(
          "Falha ao consultar polo: " + resposta.status
        );
      }

      const html = await resposta.text();

      const doc = new DOMParser().parseFromString(
        html,
        "text/html"
      );

      const seletores = [
        "#inputCodigo",
        "#CodigoPolo",
        "[name='CodigoPolo']",
        "[name='CodigoExterno']",
        "[name='CodigoExternoPolo']"
      ];

      for (const seletor of seletores) {
        const el = doc.querySelector(seletor);

        if (!el) continue;

        const valor =
          el.value ||
          el.getAttribute("value") ||
          el.textContent ||
          "";

        const digitos = String(valor).replace(/\D/g, "");

        if (digitos && digitos.length <= 6) {
          return digitos.padStart(6, "0");
        }
      }

      throw new Error(
        "Codigo comercial do polo nao identificado."
      );
    })();

    return poloPromise;
  }

  // ==========================================
  // REGRA DE SEGMENTACAO
  // ==========================================

  function poloPermitido(polo) {
    const estaNaLista = SEGMENTACAO.polos.includes(polo);

    if (SEGMENTACAO.modo === "inclusao") {
      return estaNaLista;
    }

    if (SEGMENTACAO.modo === "exclusao") {
      return !estaNaLista;
    }

    // Configuracao invalida: nao liberar
    return false;
  }

  // ==========================================
  // FECHAMENTO NATIVO
  // ==========================================

  function fecharModal(modal) {
    if (!modal) return;

    // Evita o aviso de foco retido no modal
    const foco = document.activeElement;

    if (foco && modal.contains(foco)) {
      foco.blur();
    }

    if (
      window.jQuery &&
      typeof window.jQuery.fn.modal === "function"
    ) {
      window.jQuery(modal).modal("hide");

      console.log(
        "[Evolua Segmentacao] Fechamento via Bootstrap."
      );

      return;
    }

    if (window.bootstrap?.Modal) {
      const instancia =
        window.bootstrap.Modal.getInstance(modal);

      if (instancia) {
        instancia.hide();
        return;
      }
    }

    console.warn(
      "[Evolua Segmentacao] Bootstrap nao localizado."
    );
  }

  // ==========================================
  // CONSTRUCAO DO VIDEO ORIGINAL
  // ==========================================

  function montarVideo(modal, body, dialog) {
    dialog.style.setProperty(
      "width", "96vw", "important"
    );

    dialog.style.setProperty(
      "max-width", "1600px", "important"
    );

    dialog.style.setProperty(
      "margin", "1vh auto", "important"
    );

    body.style.setProperty(
      "padding", "8px 12px", "important"
    );

    body.style.setProperty(
      "overflow", "hidden", "important"
    );

    body.style.setProperty(
      "max-height", "none", "important"
    );

    body.style.setProperty(
      "display", "flex", "important"
    );

    body.style.setProperty(
      "flex-direction", "column", "important"
    );

    body.style.setProperty(
      "align-items", "center", "important"
    );

    body.style.setProperty(
      "justify-content", "center", "important"
    );

    body.style.setProperty(
      "gap", "10px", "important"
    );

    if (!inicializados.has(body)) {
      body.replaceChildren();

      const player = document.createElement("div");

      player.id = "mc-player";
      player.style.cssText =
        "flex:0 0 auto;max-width:100%;";

      const iframe = document.createElement("iframe");

      iframe.src =
        "https://player.vimeo.com/video/" +
        VIDEO +
        "?title=0&byline=0&portrait=0";

      iframe.title = "Movimento Mundo de Criadores";

      iframe.allow =
        "autoplay;fullscreen;picture-in-picture";

      iframe.allowFullscreen = true;

      iframe.style.cssText =
        "display:block;border:0;width:100%;height:100%;";

      player.appendChild(iframe);

      const cta = document.createElement("div");

      cta.id = "mc-cta";

      cta.style.cssText =
        "width:100%;text-align:center;display:flex;" +
        "flex-direction:column;align-items:center;gap:9px;";

      const mensagem = document.createElement("p");

      mensagem.textContent =
        "Descubra como o Evolua Oferta pode ajudar " +
        "sua escola a conquistar mais matriculas " +
        "e aumentar o faturamento!";

      mensagem.style.cssText =
        "margin:0;color:#001f3b;font-family:Arial,sans-serif;" +
        "font-size:clamp(14px,1.3vw,19px);font-weight:700;" +
        "line-height:1.35;";

      const botao = document.createElement("a");

      botao.href = LINK;
      botao.target = "_blank";
      botao.rel = "noopener noreferrer";

      botao.textContent = "FALE COM SEU CONSULTOR";

      botao.style.cssText =
        "display:inline-block;background:#007edf;color:#fff;" +
        "font-family:Arial,sans-serif;font-size:15px;" +
        "font-weight:700;text-decoration:none;" +
        "padding:12px 28px;border-radius:8px;" +
        "box-shadow:0 3px 10px rgba(0,126,223,.2);";

      cta.appendChild(mensagem);
      cta.appendChild(botao);

      body.appendChild(player);
      body.appendChild(cta);

      inicializados.add(body);
    }

    ajustarVideo(body);
  }

  // ==========================================
  // AJUSTE RESPONSIVO
  // ==========================================

  function ajustarVideo(body) {
    const player = body.querySelector("#mc-player");
    const cta = body.querySelector("#mc-cta");

    if (!player || !cta) return;

    const larguraMaxima = Math.min(
      window.innerWidth * 0.90,
      1500
    );

    const alturaCTA =
      cta.getBoundingClientRect().height;

    const alturaMaxima = Math.max(
      160,
      window.innerHeight - 180 - alturaCTA - 14
    );

    const largura = Math.min(
      larguraMaxima,
      alturaMaxima * 16 / 9
    );

    player.style.setProperty(
      "width",
      Math.floor(largura) + "px",
      "important"
    );

    player.style.setProperty(
      "height",
      Math.floor(largura * 9 / 16) + "px",
      "important"
    );
  }

  // ==========================================
  // LOCALIZACAO DO AVISO
  // ==========================================

  async function processarAviso() {
    const marcador = document.getElementById(ID);

    if (!marcador) return;

    const modal = marcador.closest(".modal");
    const dialog = modal?.querySelector(".modal-dialog");
    const body = marcador.closest(".modal-body");

    if (!modal || !dialog || !body) return;

    if (verificando.has(modal)) return;

    verificando.add(modal);

    // Evita construir o Vimeo antes da validacao
    body.style.setProperty(
      "visibility", "hidden", "important"
    );

    try {
      const polo = await obterPolo();

      const permitido = poloPermitido(polo);

      console.log(
        "[Evolua Segmentacao] Polo:", polo,
        "| Permitido:", permitido
      );

      if (!permitido) {
        fecharModal(modal);

        console.log(
          "[Evolua Segmentacao] Aviso bloqueado para o polo."
        );

        return;
      }

      montarVideo(modal, body, dialog);

      body.style.removeProperty("visibility");

      console.log(
        "[Evolua Segmentacao] Video liberado."
      );

    } catch (erro) {
      console.error(
        "[Evolua Segmentacao] Erro ao validar polo:",
        erro
      );

      fecharModal(modal);
    }
  }

  // ==========================================
  // INICIALIZACAO
  // ==========================================

  function iniciar() {
    processarAviso();

    window.addEventListener("resize", () => {
      const player = document.getElementById(
        "mc-player"
      );

      if (!player) return;

      const body = player.closest(".modal-body");

      if (body) ajustarVideo(body);
    });

    const observer = new MutationObserver(() => {
      if (document.getElementById(ID)) {
        processarAviso();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      iniciar
    );
  } else {
    iniciar();
  }

})();
