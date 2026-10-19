
(function () {
  'use strict';

  const ID = 'E-games';
  const VIDEO = '1237229280';
  const LINK = 'https://linkhubtree.lovable.app/performance';
  const initialized = new WeakSet();

  function setup() {
    const marker = document.getElementById(ID);
    if (!marker) return;

    const modal = marker.closest('.modal');
    if (!modal) return;

    const dialog = modal.querySelector('.modal-dialog');
    const body = marker.closest('.modal-body');

    if (!dialog || !body) return;

    dialog.style.setProperty('width', '96vw', 'important');
    dialog.style.setProperty('max-width', '1600px', 'important');
    dialog.style.setProperty('margin', '1vh auto', 'important');

    body.style.setProperty('padding', '8px 12px', 'important');
    body.style.setProperty('overflow', 'hidden', 'important');
    body.style.setProperty('max-height', 'none', 'important');
    body.style.setProperty('display', 'flex', 'important');
    body.style.setProperty('flex-direction', 'column', 'important');
    body.style.setProperty('align-items', 'center', 'important');
    body.style.setProperty('justify-content', 'center', 'important');
    body.style.setProperty('gap', '10px', 'important');

    if (!initialized.has(body)) {
      body.replaceChildren();

      const player = document.createElement('div');
      player.id = 'mc-player';
      player.style.cssText = 'flex:0 0 auto;max-width:100%;';

      const iframe = document.createElement('iframe');
      iframe.src = 'https://player.vimeo.com/video/' + VIDEO +
        '?title=0&byline=0&portrait=0';
      iframe.title = 'Movimento Mundo de Criadores';
      iframe.allow = 'autoplay;fullscreen;picture-in-picture';
      iframe.allowFullscreen = true;
      iframe.style.cssText =
        'display:block;border:0;width:100%;height:100%;';

      player.appendChild(iframe);

      const cta = document.createElement('div');
      cta.id = 'mc-cta';
      cta.style.cssText =
        'width:100%;text-align:center;display:flex;' +
        'flex-direction:column;align-items:center;gap:9px;';

      const message = document.createElement('p');
      message.textContent =
        'Descubra como a Plataform E-GAMES pode ajudar sua escola a conquistar mais matrículas e aumentar o faturamento!';
      message.style.cssText =
        'margin:0;color:#001f3b;font-family:Arial,sans-serif;' +
        'font-size:clamp(14px,1.3vw,19px);font-weight:700;' +
        'line-height:1.35;';

      const button = document.createElement('a');
      button.href = LINK;
      button.target = '_blank';
      button.rel = 'noopener noreferrer';
      button.textContent = 'FALE COM SEU CONSULTOR';
      button.style.cssText =
        'display:inline-block;background:#007edf;color:#fff;' +
        'font-family:Arial,sans-serif;font-size:15px;' +
        'font-weight:700;text-decoration:none;' +
        'padding:12px 28px;border-radius:8px;' +
        'box-shadow:0 3px 10px rgba(0,126,223,.2);';

      cta.appendChild(message);
      cta.appendChild(button);
      body.appendChild(player);
      body.appendChild(cta);

      initialized.add(body);
    }

    const player = body.querySelector('#mc-player');
    const cta = body.querySelector('#mc-cta');
    if (!player || !cta) return;

    const maxWidth = Math.min(
      window.innerWidth * 0.90,
      1500
    );

    // Reserva altura para texto, botao e espacamentos.
    const ctaHeight = cta.getBoundingClientRect().height;
    const maxHeight = Math.max(
      160,
      window.innerHeight - 180 - ctaHeight - 14
    );

    const width = Math.min(maxWidth, maxHeight * 16 / 9);

    player.style.setProperty(
      'width',
      Math.floor(width) + 'px',
      'important'
    );

    player.style.setProperty(
      'height',
      Math.floor(width * 9 / 16) + 'px',
      'important'
    );
  }

  function start() {
    setup();
    window.addEventListener('resize', setup);

    const observer = new MutationObserver(function () {
      if (document.getElementById(ID)) setup();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
