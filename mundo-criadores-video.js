
/* Aviso ENTER - Movimento Mundo de Criadores (Vimeo corporativo) */
(function () {
  'use strict';
  var MARKER = 'mundo-criadores-video';
  var VIDEO = '1236570278';
  var STYLE_ID = 'mundo-criadores-video-style';
  var busy = false;

  function installStyle() {
    if (document.getElementById(STYLE_ID)) return;
    var css = '.mc-video-shell{width:100%!important;max-width:none!important;margin:0 auto!important;display:flex;justify-content:center;align-items:center;box-sizing:border-box}' +
      '.mc-video-frame{width:100%;position:relative;background:#001f3b;overflow:hidden;aspect-ratio:16/9}' +
      '.mc-video-frame iframe{position:absolute;inset:0;width:100%;height:100%;border:0;display:block}';
    var el = document.createElement('style');
    el.id = STYLE_ID;
    el.textContent = css;
    document.head.appendChild(el);
  }

  function findModal(marker) {
    return marker.closest('.modal') || marker.closest('[role="dialog"]');
  }

  function update() {
    if (busy) return;
    busy = true;
    try {
      var marker = document.getElementById(MARKER);
      if (!marker) return;
      var modal = findModal(marker);
      if (!modal) return;
      var dialog = modal.querySelector('.modal-dialog') || modal;
      var body = marker.closest('.modal-body') || modal.querySelector('.modal-body');
      if (!body) return;
      installStyle();

      // Oculta a capa padrao, preservando cabecalho e rodape.
      var images = body.querySelectorAll('img');
      for (var i = 0; i < images.length; i++) {
        if (!images[i].closest('.mc-video-shell')) {
          images[i].style.setProperty('display', 'none', 'important');
        }
      }

      dialog.style.setProperty('width', '96vw', 'important');
      dialog.style.setProperty('max-width', '1600px', 'important');
      dialog.style.setProperty('margin', '1vh auto', 'important');

      body.style.setProperty('padding', '8px 12px', 'important');
      body.style.setProperty('overflow-y', 'auto', 'important');
      body.style.setProperty('max-height', 'calc(98vh - 140px)', 'important');

      var shell = body.querySelector('.mc-video-shell');

      if (!shell) {
        shell = document.createElement('div');
        shell.className = 'mc-video-shell';

        var frame = document.createElement('div');
        frame.className = 'mc-video-frame';

        var iframe = document.createElement('iframe');
        iframe.src = 'https://player.vimeo.com/video/' + VIDEO +
          '?title=0&byline=0&portrait=0';

        iframe.setAttribute('allow', 'autoplay; fullscreen; picture-in-picture');
        iframe.setAttribute('allowfullscreen', '');
        iframe.setAttribute('title', 'Movimento Mundo de Criadores');
        iframe.setAttribute('loading', 'eager');

        frame.appendChild(iframe);
        shell.appendChild(frame);
        marker.parentNode.insertBefore(shell, marker.nextSibling);
      }

      // Ajusta o video em 16:9 conforme largura e altura disponiveis.
      var frameEl = shell.querySelector('.mc-video-frame');
      var widthAvailable = Math.max(240, body.clientWidth - 24);
      var heightAvailable = Math.max(180, window.innerHeight * 0.98 - 150);
      var width = Math.min(widthAvailable, heightAvailable * 16 / 9);

      frameEl.style.setProperty('width', Math.floor(width) + 'px', 'important');
      frameEl.style.setProperty('height', Math.floor(width * 9 / 16) + 'px', 'important');
      frameEl.style.setProperty('flex', '0 0 auto', 'important');
    } finally {
      busy = false;
    }
  }

  function start() {
    update();
    window.addEventListener('resize', update);

    var observer = new MutationObserver(function () {
      if (!document.getElementById(MARKER)) return;
      update();
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
