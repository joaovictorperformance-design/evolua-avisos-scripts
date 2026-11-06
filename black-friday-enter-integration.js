
(() => {
  'use strict';

  if (location.pathname.toLowerCase() !== '/inicio/painel') return;
  if (window.__evoluaBlackFridayEnterLoaded) return;
  window.__evoluaBlackFridayEnterLoaded = true;

  const CONFIG = {
    markerId: 'evolua-black-friday',
    tokenPath: '/Configuracoes/TokenPolo',
    postUrl: 'https://evolua-friday.lovable.app/api/public/enter/identificar',
    fallbackUrl: 'https://evolua-friday.lovable.app/',
  };

  const initialized = new WeakSet();
  let poloPromise = null;

  async function getPoloCode() {
    if (!poloPromise) {
      poloPromise = (async () => {
        const response = await fetch(CONFIG.tokenPath, {
          credentials: 'same-origin'
        });

        if (!response.ok) {
          throw new Error(`Consulta do polo: HTTP ${response.status}`);
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

          const raw =
            field.value ||
            field.getAttribute('value') ||
            field.textContent ||
            '';

          const digits = String(raw).replace(/\D/g, '');

          if (digits && digits.length <= 6) {
            return digits.padStart(6, '0');
          }
        }

        throw new Error('Codigo comercial do polo nao identificado');
      })().catch(error => {
        poloPromise = null;
        throw error;
      });
    }

    return poloPromise;
  }

  function postNavigate(polo) {
    // Navegacao por POST:
    // Nao depende de CORS e nao coloca o polo na URL.

    const form = document.createElement('form');
    form.method = 'POST';
    form.action = CONFIG.postUrl;
    form.enctype = 'application/x-www-form-urlencoded';
    form.target = '_self';
    form.style.display = 'none';

    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'polo_code';
    input.value = polo;

    form.appendChild(input);
    document.body.appendChild(form);
    form.submit();
  }

  function initMarker(marker) {
    const modal = marker.closest('.modal-content');
    const body = modal?.querySelector('.modal-body');

    if (!modal || !body || initialized.has(body)) {
      return false;
    }

    const nativeImage = body.querySelector('img');
    const src = nativeImage?.currentSrc || nativeImage?.src;

    if (!src) return false;

    initialized.add(body);

    const dialog = modal.closest('.modal-dialog');

    if (dialog) {
      dialog.style.setProperty('width', '94vw', 'important');
      dialog.style.setProperty('max-width', '1250px', 'important');
      dialog.style.setProperty('margin', '24px auto', 'important');
    }

    modal.style.setProperty('overflow', 'visible', 'important');

    body.style.setProperty('padding', '12px', 'important');
    body.style.setProperty('overflow', 'visible', 'important');
    body.style.setProperty('height', 'auto', 'important');
    body.style.setProperty('max-height', 'none', 'important');

    const wrapper = document.createElement('div');

    wrapper.style.cssText =
      'max-width:1200px;margin:0 auto;text-align:center;font-family:Arial,sans-serif;';

    const image = document.createElement('img');
    image.src = src;
    image.alt = 'Black Friday Evolua - Acessar roleta';

    image.style.cssText =
      'display:block;width:100%;height:auto;object-fit:contain;border-radius:8px;cursor:pointer;';

    image.tabIndex = 0;
    image.setAttribute('role', 'button');

    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = 'GIRAR MINHA ROLETA';

    button.style.cssText =
      'margin:14px 0 4px;padding:14px 25px;border:0;border-radius:9px;background:#b91c1c;color:white;font:700 16px Arial,sans-serif;cursor:pointer;';

    const status = document.createElement('p');
    status.setAttribute('role', 'status');

    status.style.cssText =
      'margin:7px 0;color:#333;font:14px Arial,sans-serif;';

    let busy = false;
    let manualFallback = false;

    async function go() {
      if (manualFallback) {
        location.assign(CONFIG.fallbackUrl);
        return;
      }

      if (busy) return;

      busy = true;
      button.disabled = true;
      button.textContent = 'IDENTIFICANDO SUA ESCOLA...';
      status.textContent = '';

      try {
        const polo = await getPoloCode();

        console.info(
          '[Evolua BF] Polo identificado para envio:',
          polo
        );

        postNavigate(polo);

      } catch (error) {
        console.warn(
          '[Evolua BF] Nao foi possivel identificar o polo:',
          error
        );

        status.textContent =
          'Nao foi possivel identificar sua escola automaticamente. Use o acesso manual.';

        button.textContent = 'ACESSAR COM CODIGO DO POLO';
        button.disabled = false;
        busy = false;
        manualFallback = true;
      }
    }

    button.addEventListener('click', go);
    image.addEventListener('click', go);

    image.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        go();
      }
    });

    wrapper.append(image, button, status);
    body.replaceChildren(marker, wrapper);
    marker.style.display = 'none';

    return true;
  }

  function scan() {
    const marker = document.getElementById(CONFIG.markerId);

    if (marker) {
      initMarker(marker);
    }
  }

  scan();

  const observer = new MutationObserver(scan);

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });

  setTimeout(() => observer.disconnect(), 30000);
})();
