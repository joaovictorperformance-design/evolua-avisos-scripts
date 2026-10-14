
(()=>{
  "use strict";

  if(location.pathname.toLowerCase()!=="/inicio/painel") return;

  const C={
    marker:"evolution-game-live-1410",
    title:"Evolution Game - Novo Ciclo",
    start:"2026-10-14T15:00:00-03:00",
    end:"2026-10-14T17:00:00-03:00",
    url:"https://teams.microsoft.com/meet/285174258755172?p=7KJLR8UICQFHqCoIqA",
    storageKey:"evolua:eg-live:2026-10-14:redirected"
  };

  if(window.__egLive1410Initialized) return;
  window.__egLive1410Initialized=true;

  const start=Date.parse(C.start);
  const end=Date.parse(C.end);

  if(!Number.isFinite(start)||!Number.isFinite(end)||end<=start){
    console.error("[EG Live] Datas invalidas");
    return;
  }

  let interval=null;
  let observer=null;
  let rendered=false;
  let redirecting=false;

  const seen=()=>{
    try{
      return localStorage.getItem(C.storageKey)==="1";
    }catch(e){
      return window.__egLive1410Seen===true;
    }
  };

  const markSeen=()=>{
    window.__egLive1410Seen=true;
    try{
      localStorage.setItem(C.storageKey,"1");
    }catch(e){
      console.warn("[EG Live] Armazenamento indisponivel",e);
    }
  };

  const go=()=>{
    if(redirecting) return;
    redirecting=true;
    markSeen();
    location.assign(C.url);
  };

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

  const init=()=>{
    if(rendered) return true;

    const marker=document.getElementById(C.marker);
    if(!marker) return false;

    const modal=marker.closest(".modal-content");
    const body=modal?.querySelector(".modal-body");

    if(!modal||!body) return false;

    const original=body.querySelector("img");
    const src=original?.currentSrc||original?.src;

    if(!src) return false;

    rendered=true;

    const dialog=modal.closest(".modal-dialog");

    if(dialog){
      dialog.style.setProperty("width","94vw","important");
      dialog.style.setProperty("max-width","1300px","important");
      dialog.style.setProperty("margin","24px auto","important");
    }

    modal.style.setProperty("overflow","visible","important");

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

    const image=make("img",{
      display:"block",
      width:"100%",
      height:"auto",
      objectFit:"contain",
      borderRadius:"8px"
    });

    image.src=src;
    image.alt=C.title;

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
    wrap.append(image,info);
    body.append(wrap);

    const update=()=>{
      const now=Date.now();

      if(now<start){
        heading.textContent="O novo ciclo do Evolution Game começa em:";
        detail.textContent="Quarta-feira, 14/10, às 15h (horário de Brasília).";
        countdown.textContent=format(start-now);
        btn.style.display="none";

      }else if(now<=end){
        if(!seen()){
          go();
          return;
        }

        heading.textContent="🔴 O Evolution Game está ao vivo!";
        detail.textContent="Se você quiser voltar à transmissão, clique no botão abaixo.";
        countdown.textContent="";
        btn.style.display="inline-block";

      }else{
        heading.textContent="Encontro do Evolution Game";
        detail.textContent="O horário previsto da transmissão terminou. Você ainda pode tentar acessar pelo link abaixo.";
        countdown.textContent="";
        btn.textContent="▶ ACESSAR O LINK DA LIVE";
        btn.style.display="inline-block";
        clearInterval(interval);
      }
    };

    update();

    if(!redirecting){
      interval=setInterval(update,1000);
    }

    console.log("[EG Live] Destaque inicializado",C.start);
    return true;
  };

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
