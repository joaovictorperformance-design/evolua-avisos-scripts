(()=>{
  if(location.pathname.toLowerCase()!=="/inicio/painel") return;

  const C={
    link:"https://chat.whatsapp.com/KdWe44sqcoZHKEIyEuPj0t",
    imagem:"https://cdn.jsdelivr.net/gh/joaovictorperformance-design/assets@d4cae38/sprint-oferta-turma-3.png"
  };

  const ativar=()=>{
    const marcador=document.querySelector("#sprint-oferta-turma-3");
    if(!marcador) return false;

    const modal=
      marcador.closest(".modal-content") ||
      marcador.parentElement;

    if(!modal) return false;

    if(modal.dataset.sprintOferta==="1") return true;
    modal.dataset.sprintOferta="1";

    /* Localiza área principal do destaque */
    const body=
      modal.querySelector(".modal-body") ||
      marcador.parentElement;

    if(!body) return false;

    /* Remove conteúdo visual antigo, preservando marcador/script */
    body.querySelectorAll("img").forEach(img=>img.remove());

    /* Ajusta o espaço do destaque */
    modal.style.maxWidth="none";
    modal.style.width="100%";

    body.style.padding="12px";
    body.style.margin="0";
    body.style.textAlign="center";
    body.style.overflow="hidden";

    /* Cria nosso banner */
    const banner=document.createElement("img");

    banner.src=C.imagem;
    banner.alt="Sprint de Oferta - Nova Turma";
    banner.title="Clique para entrar no grupo oficial da Sprint de Oferta";

    banner.style.cssText=
      "display:block;"+
      "width:min(1500px,96vw);"+
      "height:auto;"+
      "max-height:calc(100vh - 130px);"+
      "object-fit:contain;"+
      "margin:0 auto;"+
      "cursor:pointer;"+
      "border-radius:8px;"+
      "transition:filter .18s ease,transform .18s ease;";

    const abrir=()=>{
      window.open(
        C.link,
        "_blank",
        "noopener,noreferrer"
      );
    };

    banner.addEventListener("click",abrir);

    banner.addEventListener("mouseenter",()=>{
      banner.style.filter="brightness(1.06)";
      banner.style.transform="scale(1.003)";
    });

    banner.addEventListener("mouseleave",()=>{
      banner.style.filter="";
      banner.style.transform="";
    });

    banner.tabIndex=0;

    banner.addEventListener("keydown",e=>{
      if(e.key==="Enter"||e.key===" "){
        e.preventDefault();
        abrir();
      }
    });

    body.prepend(banner);

    console.log(
      "[Sprint Oferta] Banner expandido ativado."
    );

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
