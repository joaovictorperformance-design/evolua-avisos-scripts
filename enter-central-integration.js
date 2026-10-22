/*
 * ENTER Central + aviso Mundo de Criadores | HOMOLOGACAO
 *
 * Este arquivo substitui o script anterior desta homologacao: ele combina
 * a validacao de campanha/polo no Supabase com o video e o CTA existentes.
 * O marcador configurado no painel da Central deve existir dentro do modal
 * nativo do ENTER. Se a API falhar, o aviso nativo original permanece visivel.
 */
(() => {
  'use strict';

  // Executa somente na tela inicial/painel do ENTER.
  if (location.pathname.toLowerCase() !== '/inicio/painel') return;

  // O ID precisa ser igual ao marcador vinculado a campanha na Central.
  const CONFIG = {
    markerId: 'ec-teste-dois-polos',
    functionBase: 'https://twfjwozgnvghaphkbqpy.supabase.co/functions/v1',
    publishableKey: 'sb_publishable_lM7U0En3xP_7LNM4ryYsdg_wwCUEMYV',
    tokenPath: '/Configuracoes/TokenPolo',
    videoId: '1238378621',
    link: 'https://linkhubtree.lovable.app/performance',
    requestTimeoutMs: 3500,
    defaultMinIntervalSeconds: 86400,
  };

  const initializedBodies = new WeakSet();
  const processingModals = new WeakSet();
  const lifecycleBound = new WeakSet();
  let poloPromise = null;

  async function getPoloCode() {
    if (!poloPromise) {
      poloPromise = (async () => {
        const response = await fetch(CONFIG.tokenPath, {
          credentials: 'same-origin',
        });

        if (!response.ok) {
          throw new Error(`Falha ao consultar polo: HTTP ${response.status}`);
        }

        const html = await response.text();
        const doc = new DOMParser().parseFromString(html, 'text/html');

        const selectors = [
          '#inputCodigo',
          '#CodigoPolo',
          '[name="CodigoPolo"]',
          '[name="CodigoExterno"]',
          '[name="CodigoExternoPolo"]',
        ];

        for (const selector of selectors) {
          const field = doc.querySelector(selector);
          if (!field) continue;

          const rawValue =
            field.value ||
            field.getAttribute('value') ||
            field.textContent ||
            '';

          const digits = String(rawValue).replace(/\D/g, '');

          if (digits && digits.length <= 6) {
            return digits.padStart(6, '0');
          }
        }

        throw new Error('Código comercial do polo não identificado.');
      })();
    }

    return poloPromise;
  }

  async function postFunction(functionName, payload) {
    const controller = new AbortController();

    const timeout = window.setTimeout(
      () => controller.abort(),
      CONFIG.requestTimeoutMs
    );

    try {
      const response = await fetch(
        `${CONFIG.functionBase}/${functionName}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: CONFIG.publishableKey,
          },
          body: JSON.stringify(payload),
          signal: controller.signal,
        }
      );

      if (!response.ok) {
        throw new Error(`${functionName}: HTTP ${response.status}`);
      }

      return await response.json();
    } finally {
      window.clearTimeout(timeout);
    }
  }

  function closeNativeNotice(modal) {
    if (!modal) return false;

    const focused = document.activeElement;

    if (focused && modal.contains(focused)) {
      focused.blur();
    }

    if (
      window.jQuery &&
      typeof window.jQuery.fn.modal === 'function'
    ) {
      window.jQuery(modal).modal('hide');
      return true;
    }

    if (window.bootstrap?.Modal) {
      const instance = window.bootstrap.Modal.getInstance(modal);

      if (instance) {
        instance.hide();
        return true;
      }
    }

    console.warn(
      '[ENTER Central] Não encontrei o controlador do modal Bootstrap.'
    );

    return false;
  }

  function resizeVideo(body) {
    const player = body.querySelector('#ec-video-player');
    const cta = body.querySelector('#ec-video-cta');

    if (!player || !cta) return;

    const maxWidth = Math.min(window.innerWidth * 0.90, 1500);
    const ctaHeight = cta.getBoundingClientRect().height;

    const maxHeight = Math.max(
      160,
      window.innerHeight - 180 - ctaHeight - 14
    );

    const width = Math.min(maxWidth, maxHeight * 16 / 9);

    player.style.setProperty(
      'width',
      `${Math.floor(width)}px`,
      'important'
    );

    player.style.setProperty(
      'height',
      `${Math.floor(width * 9 / 16)}px`,
      'important'
    );
  }

  function buildVideo(body, marker) {
    body.style.setProperty('padding', '8px 12px', 'important');
    body.style.setProperty('overflow', 'hidden', 'important');
    body.style.setProperty('max-height', 'none', 'important');
    body.style.setProperty('display', 'flex', 'important');
    body.style.setProperty('flex-direction', 'column', 'important');
    body.style.setProperty('align-items', 'center', 'important');
    body.style.setProperty('justify-content', 'center', 'important');
    body.style.setProperty('gap', '10px', 'important');

    if (!initializedBodies.has(body)) {
      const dialog = body
        .closest('.modal')
        ?.querySelector('.modal-dialog');

      if (dialog) {
        dialog.style.setProperty('width', '96vw', 'important');
        dialog.style.setProperty('max-width', '1600px', 'important');
        dialog.style.setProperty('margin', '1vh auto', 'important');
      }

      const player = document.createElement('div');
      player.id = 'ec-video-player';
      player.style.cssText = 'flex:0 0 auto;max-width:100%;';

      const iframe = document.createElement('iframe');

      iframe.src =
        `https://player.vimeo.com/video/${encodeURIComponent(CONFIG.videoId)}` +
        '?title=0&byline=0&portrait=0';

      iframe.title = 'Movimento Mundo de Criadores';
      iframe.allow = 'autoplay;fullscreen;picture-in-picture';
      iframe.allowFullscreen = true;
      iframe.style.cssText =
        'display:block;border:0;width:100%;height:100%;';

      player.appendChild(iframe);

      const cta = document.createElement('div');
      cta.id = 'ec-video-cta';
      cta.style.cssText =
        'width:100%;text-align:center;display:flex;' +
        'flex-direction:column;align-items:center;gap:9px;';

      const message = document.createElement('p');

      message.textContent =
        'Descubra como o Evolua Oferta pode ajudar sua escola ' +
        'a conquistar mais matrículas e aumentar o faturamento!';

      message.style.cssText =
        'margin:0;color:#001f3b;font-family:Arial,sans-serif;' +
        'font-size:clamp(14px,1.3vw,19px);font-weight:700;' +
        'line-height:1.35;';

      const button = document.createElement('a');

      button.href = CONFIG.link;
      button.target = '_blank';
      button.rel = 'noopener noreferrer';
      button.textContent = 'FALE COM SEU CONSULTOR';
      button.style.cssText =
        'display:inline-block;background:#007edf;color:#fff;' +
        'font-family:Arial,sans-serif;font-size:15px;font-weight:700;' +
        'text-decoration:none;padding:12px 28px;border-radius:8px;' +
        'box-shadow:0 3px 10px rgba(0,126,223,.2);';

      cta.append(message, button);

      // Mantém o marcador no modal para permitir nova validação ao reabrir.
      marker.hidden = true;
      marker.setAttribute('aria-hidden', 'true');

      body.replaceChildren(marker, player, cta);
      initializedBodies.add(body);
    }

    resizeVideo(body);
  }

  function bindModalLifecycle(modal, body) {
    if (lifecycleBound.has(modal)) return;

    lifecycleBound.add(modal);

    modal.addEventListener('hidden.bs.modal', () => {
      processingModals.delete(modal);
      body.style.removeProperty('visibility');
    });

    modal.addEventListener('shown.bs.modal', () => {
      const marker = modal.querySelector(
        `#${CSS.escape(CONFIG.markerId)}`
      );

      if (marker) {
        void processMarker(marker);
      }
    });
  }

  async function processMarker(marker) {
    if (!marker || marker.id !== CONFIG.markerId) return;

    const modal = marker.closest('.modal');
    const body = marker.closest('.modal-body');

    if (!modal || !body || processingModals.has(modal)) return;

    processingModals.add(modal);
    bindModalLifecycle(modal, body);

    const oldVisibility = body.style.visibility;

    body.style.setProperty(
      'visibility',
      'hidden',
      'important'
    );

    try {
      const poloCode = await getPoloCode();
      const frequencyKey =
        `enter-central:${CONFIG.markerId}:${poloCode}`;

      let lastShown = 0;
      let savedIntervalSeconds =
        CONFIG.defaultMinIntervalSeconds;

      try {
        lastShown = Number(
          localStorage.getItem(frequencyKey) || 0
        );

        savedIntervalSeconds = Number(
          localStorage.getItem(`${frequencyKey}:interval`) ||
          CONFIG.defaultMinIntervalSeconds
        );
      } catch {
        // Se o navegador bloquear localStorage, a decisão da API continua valendo.
      }

      if (
        lastShown &&
        Date.now() - lastShown < savedIntervalSeconds * 1000
      ) {
        closeNativeNotice(modal);
        return;
      }

      const decision = await postFunction(
        'resolve-notice',
        {
          marker: CONFIG.markerId,
          polo_code: poloCode,
        }
      );

      if (decision?.reason === 'temporarily_unavailable') {
        // Se a função não conseguiu consultar os dados, mantém o aviso nativo.
        body.style.visibility = oldVisibility;

        console.warn(
          '[ENTER Central] Supabase temporariamente indisponível; ' +
          'aviso original mantido.'
        );

        return;
      }

      if (!decision?.show) {
        closeNativeNotice(modal);

        console.info(
          '[ENTER Central] Aviso não elegível para este polo:',
          decision?.reason || 'sem motivo informado'
        );

        return;
      }

      const minIntervalSeconds = Math.max(
        0,
        Math.min(
          31536000,
          Number(
            decision.frequency?.min_interval_seconds ??
            CONFIG.defaultMinIntervalSeconds
          )
        )
      );

      try {
        localStorage.setItem(frequencyKey, String(Date.now()));
        localStorage.setItem(
          `${frequencyKey}:interval`,
          String(minIntervalSeconds)
        );
      } catch {
        // A exibição continua mesmo sem armazenamento local.
      }

      buildVideo(body, marker);
      body.style.visibility = oldVisibility;

      void postFunction(
        'track-notice-event',
        {
          marker: CONFIG.markerId,
          polo_code: poloCode,
          event_type: 'impression',
        }
      ).catch(error => {
        console.warn(
          '[ENTER Central] Falha ao registrar impressão:',
          error
        );
      });

      if (modal.dataset.ecClickListener !== 'bound') {
        modal.dataset.ecClickListener = 'bound';

        modal.addEventListener('click', event => {
          if (
            !event.target?.closest?.(
              'a,button,[role="button"]'
            )
          ) {
            return;
          }

          void postFunction(
            'track-notice-event',
            {
              marker: CONFIG.markerId,
              polo_code: poloCode,
              event_type: 'click',
            }
          ).catch(error => {
            console.warn(
              '[ENTER Central] Falha ao registrar clique:',
              error
            );
          });
        });
      }

      console.info(
        '[ENTER Central] Campanha validada para o polo',
        poloCode
      );
    } catch (error) {
      // Erro de rede/API não bloqueia o aviso que já existe no ENTER.
      body.style.visibility = oldVisibility;
      processingModals.delete(modal);

      console.warn(
        '[ENTER Central] Falha na validação; aviso original mantido.',
        error
      );
    }
  }

  function scanForMarker() {
    const marker = document.getElementById(CONFIG.markerId);

    if (marker) {
      void processMarker(marker);
    }
  }

  window.addEventListener('resize', () => {
    const player = document.getElementById('ec-video-player');
    const body = player?.closest('.modal-body');

    if (body) {
      resizeVideo(body);
    }
  });

  scanForMarker();

  const observer = new MutationObserver(scanForMarker);

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });

  // Evita deixar um observador permanente na página do ENTER.
  window.setTimeout(() => observer.disconnect(), 30000);
})();
