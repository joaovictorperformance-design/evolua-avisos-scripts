
(function () {
  'use strict';

  const ID = 'mundo-criadores-video';
  const VIDEO = '1236570278';
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

    body.style.setProperty('padding', '8px', 'important');
    body.style.setProperty('overflow', 'hidden', 'important');
    body.style.setProperty('max-height', 'none', 'important');
    body.style.setProperty('display', 'flex', 'important');
    body.style.setProperty('justify-content', 'center', 'important');
    body.style.setProperty('align-items', 'center', 'important');

    if (!initialized.has(body)) {
      // Remove o conteudo visual original do aviso,
      // incluindo o espaco reservado para o sino.
      body.replaceChildren();

      const container = document.createElement('div');
      container.id = 'mc-player';
      container.style.cssText =
        'width:100%;display:flex;justify-content:center;align-items:center;';

      const iframe = document.createElement('iframe');
      iframe.src =
        'https://player.vimeo.com/video/' + VIDEO +
        '?title=0&byline=0&portrait=0';

      iframe.title = 'Movimento Mundo de Criadores';
      iframe.allow = 'autoplay;fullscreen;picture-in-picture';
      iframe.allowFullscreen = true;
      iframe.style.cssText =
        'display:block;border:0;width:100%;height:100%;';

      container.appendChild(iframe);
      body.appendChild(container);

      initialized.add(body);
    }

    const player = body.querySelector('#mc-player');
    if (!player) return;

    // Calcula o maior tamanho 16:9 que cabe na janela.
    const maxWidth = Math.min(
      dialog.clientWidth - 24,
      window.innerWidth * 0.94
    );

    const maxHeight = Math.max(
      200,
      window.innerHeight - 180
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

    player.style.setProperty('flex', '0 0 auto', 'important');
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
