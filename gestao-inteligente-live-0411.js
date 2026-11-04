
(()=>{
  "use strict";

  // ==========================================
  // LIVE GESTAO INTELIGENTE - 04/11/2026
  // ==========================================

  if(location.pathname.toLowerCase()!=="/inicio/painel") return;

  const C={
    marker:"gestao-inteligente-live-0411",
    title:"Gestão Inteligente: Sua Escola no Controle",
    start:"2026-11-04T15:00:00-03:00",
    end:"2026-11-04T17:00:00-03:00",
    url:"https://teams.microsoft.com/meet/2379999480640009?p=Fp0WKXtDBIZoXCQbm3",
    storageKey:"evolua:gestao-inteligente:2026-11-04:redirected"
  };

  if(window.__gestaoInteligente0411Initialized) return;
  window.__gestaoInteligente0411Initialized=true;

  const start=Date.parse(C.start);
  const end=Date.parse(C.end);

  if(!Number.isFinite(start)||!Number.isFinite(end)||end<=start){
    console.error("[Gestao Inteligente] Datas invalidas");
    return;
  }

  let interval=null;
  let observer=null;
  let rendered=false;
  let redirecting=false;

  // Evita redirecionamentos repetidos
  const seen=()=>{
    try{
      return localStorage.getItem(C.storageKey)==="1";
    }catch(e){
      return window.__gestaoInteligente0411Seen===true;
    }
  };

  const markSeen=()=>{
    window.__gestaoInteligente0411Seen=true;
    try{
      localStorage.setItem(C.storageKey,"1");
    }catch(e){
      console.warn("[Gestao Inteligente] Armazenamento indisponivel",e);
    }
  };

  // Redirecionamento para o Microsoft Teams
  const go=()=>{
    if(redirecting) return;
    redirecting=true;
    markSeen();
    location.assign(C.url);
  };

  // Formata a contagem regressiva
  const format=ms=>{
    const s=Math.max(0,Math.ceil(ms/1000));
    const d=Math.floor(s/86400);
    const h=Math.floor(s%86400/3600);
    const m=Math.floor(s%3600/60);
    const sec=s%60;
    const p=n=>String(n).padStart(2,"0");

    return (d?d+"d ":"")+p(h)+":"+p(m)+":"+p(sec);
  };

  const make=(tag,styles={},content="")=>{
    const el=document.createElement(tag);
    Object.assign(el.style,styles);
    if(content) el.textContent=content;
    return el;
  };

  // ==========================================
  // INICIALIZACAO DO DESTAQUE ENTER
  // ==========================================

  const init=()=>{
    if(rendered) return true;

    const marker=document.getElementById(C.marker);
    if(!marker) return false;

    const modal=marker.closest(".modal-content");
    const body=modal?.querySelector(".modal-body");

    if(!modal||!body) return false;

    // Captura a imagem original cadastrada
    const original=body.querySelector("img");
    const src=original?.currentSrc||original?.src;

    if(!src) return false;

    rendered=true;

    const dialog=modal.closest(".modal-dialog");

    // Expande a janela do destaque
    if(dialog){
      dialog.style.setProperty("width","94vw","important");
      dialog.style.setProperty("max-width","1300px","important");
      dialog.style.setProperty("margin","24px auto","important");
    }

    modal.style.setProperty("overflow","visible","important");

    // Remove a imagem original para evitar cortes
    body.replaceChildren();

    Object.entries({
      padding:"14px",
      margin:"0",
      overflow:"visible",
      height:"auto",
      "max-height":"none"
    }).forEach(([k,v])=>{
      body.style.setProperty(k,v,"important");
    });

    const wrap=make("div",{
      width:"100%",
      maxWidth:"1250px",
      margin:"0 auto",
      fontFamily:"Arial,sans-serif",
      textAlign:"center"
    });

    // Recria a imagem sem as limitacoes do ENTER
    const image=make("img",{
      display:"block",
      width:"100%",
      height:"auto",
      objectFit:"contain",
      borderRadius:"8px",
      cursor:"pointer"
    });

    image.src=src;
    image.alt=C.title;
    image.title="Clique para acessar a live";

    // Permite acessar a live clicando na imagem
    image.addEventListener("click",go);

    const info=make("div",{
      padding:"18px 10px",
      color:"#152238"
    });

    const heading=make("div",{
      fontSize:"21px",
      fontWeight:"700",
      marginBottom:"9px"
    });

    const detail=make("div",{
      fontSize:"16px",
      lineHeight:"1.5"
    });

    const countdown=make("div",{
      fontSize:"36px",
      fontWeight:"800",
      color:"#d49b28",
      margin:"12px 0",
      fontVariantNumeric:"tabular-nums"
    });

    const btn=make("button",{
      display:"none",
      border:"0",
      borderRadius:"10px",
      padding:"14px 24px",
      background:"#1145a4",
      color:"white",
      fontSize:"16px",
      fontWeight:"700",
      cursor:"pointer",
      marginTop:"14px"
    },"▶ VOLTAR PARA A LIVE");

    btn.type="button";
    btn.addEventListener("click",go);

    info.append(heading,detail,countdown,btn);
    wrap.append(info,image);
    body.append(wrap);

    // ==========================================
    // CONTROLE DE HORARIO DA LIVE
    // ==========================================

    const update=()=>{
      const now=Date.now();

      // ANTES DAS 15H
      if(now<start){
        heading.textContent="Gestão Inteligente começa em:";
        detail.textContent="Hoje, 04/11, às 15h (horário de Brasília).";
        countdown.textContent=format(start-now);
        btn.style.display="none";

      // ENTRE 15H E 17H
      }else if(now<=end){

        // Redirecionamento automatico uma unica vez
        if(!seen()){
          go();
          return;
        }

        heading.textContent="🔴 Gestão Inteligente está AO VIVO!";
        detail.textContent="Anderson Ilaris, COO do Grupo Evolua. Clique abaixo para acompanhar.";
        countdown.textContent="";
        btn.style.display="inline-block";

      // APOS AS 17H
      }else{
        heading.textContent="Gestão Inteligente: Sua Escola no Controle";
        detail.textContent="O horário previsto da transmissão terminou. Você ainda pode tentar acessar pelo link abaixo.";
        countdown.textContent="";
        btn.textContent="▶ ACESSAR O LINK DA LIVE";
        btn.style.display="inline-block";

        clearInterval(interval);
      }
    };

    update();

    // Atualiza a contagem a cada segundo
    if(!redirecting){
      interval=setInterval(update,1000);
    }

    console.log(
      "[Gestao Inteligente] Destaque inicializado",
      C.start
    );

    return true;
  };

  // Aguarda o ENTER carregar o destaque
  if(!init()){
    observer=new MutationObserver(()=>{
      if(init()) observer.disconnect();
    });

    observer.observe(document.documentElement,{
      childList:true,
      subtree:true
    });

    setTimeout(()=>observer?.disconnect(),20000);
  }

})();
