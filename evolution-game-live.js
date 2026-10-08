
(()=>{
  const CONFIG = {
    marcador: "evolution-game-live",
    link: "https://chat.whatsapp.com/CJ2BA22DwgYAGoPL5J3hKw"
  };

  if(location.pathname.toLowerCase()!=="/inicio/painel") return;

  const ativar=()=>{
    const marcador=document.getElementById(CONFIG.marcador);
    if(!marcador) return false;

    const modal=marcador.closest(".modal-content");
    if(!modal) return false;

    const dialog=modal.closest(".modal-dialog");
    const body=modal.querySelector(".modal-body");
    if(!body) return false;

    if(modal.dataset.evolutionGameLive==="1") return true;

    const original=body.querySelector("img");
    if(!original) return false;

    // Aproveita a imagem nativa do ENTER.
    const src=original.currentSrc || original.src;
    if(!src) return false;

    modal.dataset.evolutionGameLive="1";

    // Expande o modal.
    if(dialog){
      dialog.style.setProperty("width","94vw","important");
      dialog.style.setProperty("max-width","1600px","important");
      dialog.style.setProperty("margin","30px auto","important");
    }

    modal.style.setProperty("width","100%","important");
    modal.style.setProperty("max-width","none","important");
    modal.style.setProperty("overflow","visible","important");

    // Reconstrói a área visual.
    body.replaceChildren();

    const estilos={
      padding:"14px",
      margin:"0",
      width:"100%",
      height:"auto",
      "min-height":"0",
      "max-height":"none",
      overflow:"visible",
      display:"flex",
      "justify-content":"center",
      "align-items":"flex-start"
    };

    Object.entries(estilos).forEach(([prop,valor])=>{
      body.style.setProperty(prop,valor,"important");
    });

    // Link clicável contendo a imagem limpa.
    const link=document.createElement("a");

    link.href=CONFIG.link;
    link.target="_blank";
    link.rel="noopener noreferrer";
    link.title="Clique para participar da live do Evolution Game";

    link.style.cssText=
      "display:block;width:100%;max-width:1500px;"+
      "margin:0 auto;cursor:pointer;";

    const banner=document.createElement("img");

    banner.src=src;
    banner.alt="Evolution Game - Um Novo Ciclo";
    banner.decoding="async";

    const estilosImagem={
      display:"block",
      width:"100%",
      "max-width":"1500px",
      height:"auto",
      "max-height":"none",
      "object-fit":"contain",
      margin:"0 auto"
    };

    Object.entries(estilosImagem).forEach(([prop,valor])=>{
      banner.style.setProperty(prop,valor,"important");
    });

    banner.style.transition="filter .18s ease";

    banner.addEventListener("mouseenter",()=>{
      banner.style.filter="brightness(1.06)";
    });

    banner.addEventListener("mouseleave",()=>{
      banner.style.filter="";
    });

    link.appendChild(banner);
    body.appendChild(link);

    console.log("[Evolution Game] Destaque ativado.");
    return true;
  };

  if(ativar()) return;

  const observer=new MutationObserver(()=>{
    if(ativar()) observer.disconnect();
  });

  observer.observe(document.documentElement,{
    childList:true,
    subtree:true
  });

  setTimeout(()=>observer.disconnect(),15000);
})();
