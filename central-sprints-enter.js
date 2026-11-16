
/*
 * CENTRAL DE SPRINTS - EVOLUA EDUCACAO
 * Integracao com os avisos do ENTER
 * Versao: 16/11/2026
 *
 * O aviso precisa conter:
 * - A imagem cadastrada normalmente no ENTER
 * - O marcador #evolua-central-sprints
 *
 * O script modifica somente o aviso com esse marcador.
 */

(() => {
  'use strict';

  if (
    location.pathname.toLowerCase() !==
    '/inicio/painel'
  ) return;

  if (window.__evoluaCentralSprints2026) return;

  window.__evoluaCentralSprints2026 = true;

  const MARKER = 'evolua-central-sprints';

  // Grupos oficiais das seis Sprints
  const ITEMS = [
    [
      'Gamificacao',
      'https://chat.whatsapp.com/FLn07Zl095fHhZCq8dPuIC',
      '#8526b8'
    ],
    [
      'Evolua Oferta',
      'https://chat.whatsapp.com/B84gmv6Vx6h88fUG4VwSci',
      '#e47711'
    ],
    [
      'Ingles',
      'https://chat.whatsapp.com/L7Cz72De12jH4Wga96uQfX',
      '#087fbd'
    ],
    [
      'Robotica',
      'https://chat.whatsapp.com/DRBpHNjDrfdCSQbROOAwAR',
      '#06a4ba'
    ],
    [
      'Informatica Kids',
      'https://chat.whatsapp.com/FAJCoDF6hi9ERIzJWPJTxB',
      '#49a418'
    ],
    [
      'Inteligencia Artificial',
      'https://chat.whatsapp.com/FB7RfRmQnjxH2rVDjjDUaB',
      '#6240be'
    ]
  ];

  let observer;

  // Aplicar estilos com prioridade
  function apply(el, styles) {
    for (const [key, val] of Object.entries(styles)) {
      el.style.setProperty(key, val, 'important');
    }
  }

  // Ajustar dimensoes do modal
  function resize(modal) {
    if (!modal?.dataset.evoluaSprintsReady) return;

    const dialog = modal.querySelector('.modal-dialog');

    const wrap = modal.querySelector(
      '[data-evolua-sprints-wrap]'
    );

    if (!dialog || !wrap) return;

    const narrow = window.innerWidth < 700;

    // Reservar espaco para cabecalho e botoes
    const reserved = narrow ? 260 : 185;

    // Calcular largura respeitando a proporcao 16:9
    const byHeight = Math.max(
      310,
      (window.innerHeight - reserved) * 16 / 9
    );

    const maxWidth = Math.min(
      1400,
      window.innerWidth * 0.96,
      byHeight
    );

    apply(dialog, {
      width: `${Math.floor(maxWidth)}px`,
      'max-width': '96vw',
      margin: '12px auto'
    });

    apply(wrap, {
      'max-width': `${Math.floor(maxWidth - 24)}px`
    });
  }

  // Reconstruir o aviso
  function initialize(marker) {
    if (!marker?.isConnected) return false;

    const modal = marker.closest('.modal');

    const content = marker.closest('.modal-content');

    const body = marker.closest('.modal-body');

    if (!modal || !content || !body) return false;

    if (modal.dataset.evoluaSprintsReady === '1') {
      return true;
    }

    // Capturar somente a URL da imagem nativa
    const nativeImg = [
      ...body.querySelectorAll('img')
    ].find(el =>
      !el.closest('a') || el.getAttribute('src')
    );

    const src =
      nativeImg?.currentSrc ||
      nativeImg?.getAttribute('src') ||
      nativeImg?.src;

    if (!src) return false;

    // Container principal
    const wrap = document.createElement('section');

    wrap.dataset.evoluaSprintsWrap = '1';

    apply(wrap, {
      width: '100%',
      margin: '0 auto',
      'font-family': 'Arial,sans-serif'
    });

    // Recriar imagem sem os estilos de corte do ENTER
    const img = document.createElement('img');

    img.src = src;

    img.alt = 'Central de Sprints - Evolua Educacao';

    apply(img, {
      display: 'block',
      width: '100%',
      height: 'auto',
      'max-height': 'calc(100vh - 180px)',
      'object-fit': 'contain',
      'border-radius': '10px'
    });

    // Area dos botoes
    const links = document.createElement('nav');

    links.setAttribute(
      'aria-label',
      'Grupos oficiais das Sprints'
    );

    apply(links, {
      display: 'grid',
      'grid-template-columns':
        'repeat(auto-fit,minmax(min(100%,170px),1fr))',
      gap: '9px',
      margin: '12px 0 0'
    });

    // Criar os seis botoes
    for (const [label, href, color] of ITEMS) {
      const a = document.createElement('a');

      a.href = href;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';

      a.textContent = label;

      a.setAttribute(
        'aria-label',
        `Entrar no grupo de ${label}`
      );

      apply(a, {
        display: 'flex',
        'align-items': 'center',
        'justify-content': 'center',
        'text-align': 'center',
        'min-height': '44px',
        padding: '8px 10px',
        background: color,
        color: '#ffffff',
        'font-size': '14px',
        'font-weight': '700',
        'line-height': '1.2',
        'text-decoration': 'none',
        'border-radius': '9px',
        'box-shadow': '0 3px 8px rgba(0,0,0,.14)',
        'box-sizing': 'border-box'
      });

      // Efeito visual ao passar o mouse
      a.addEventListener('mouseenter', () => {
        a.style.filter = 'brightness(1.12)';
      });

      a.addEventListener('mouseleave', () => {
        a.style.filter = '';
      });

      links.appendChild(a);
    }

    // Preservar marcador no modal
    marker.hidden = true;

    marker.setAttribute(
      'aria-hidden',
      'true'
    );

    wrap.append(img, links);

    // Remover estrutura antiga e inserir conteudo novo
    body.replaceChildren(marker, wrap);

    apply(content, {
      height: 'auto',
      'min-height': '0',
      'max-height': 'calc(100vh - 24px)',
      overflow: 'auto'
    });

    apply(body, {
      display: 'block',
      margin: '0',
      padding: '10px 12px 14px',
      height: 'auto',
      'min-height': '0',
      'max-height': 'none',
      overflow: 'visible',
      'text-align': 'initial'
    });

    const header = content.querySelector(
      '.modal-header'
    );

    if (header) {
      apply(header, {
        'min-height': '0',
        padding: '10px 16px'
      });
    }

    modal.dataset.evoluaSprintsReady = '1';

    resize(modal);

    console.info(
      '[Central de Sprints] Aviso ajustado com 6 links.'
    );

    return true;
  }

  // Procurar o marcador do aviso
  function scan() {
    const markers = document.querySelectorAll(
      `#${MARKER}`
    );

    for (const marker of markers) {
      initialize(marker);
    }
  }

  scan();

  // Aguardar carregamento dinamico do ENTER
  observer = new MutationObserver(scan);

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });

  // Desligar observador apos 45 segundos
  window.setTimeout(() => {
    observer.disconnect();
  }, 45000);

  // Reajustar ao mudar tamanho da janela
  window.addEventListener('resize', () => {
    document.querySelectorAll(
      '.modal[data-evolua-sprints-ready="1"]'
    ).forEach(resize);
  });

})();
