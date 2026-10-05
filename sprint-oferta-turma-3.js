(()=>{
  if(location.pathname.toLowerCase()!=="/inicio/painel") return;

  const LINK="https://chat.whatsapp.com/KdWe44sqcoZHKEIyEuPj0t";

  const ativar=()=>{
    const marcador=document.querySelector("#sprint-oferta-turma-3");
    if(!marcador) return false;

    const modal=
      marcador.closest(".modal-content") ||
      marcador.parentElement;

    if(!modal) return false;

    const body=
      modal.querySelector(".modal-body") ||
      marcador.parentElement;

    if(!body) return false;

    /* Usa a própria imagem já carregada pelo ENTER */
    const img=body.querySelector("img");
    if(!img) return false;

    if(img.dataset.sprintOferta==="1") return true;
    img.dataset.sprintOferta="1";

    /* Expande o modal */
    modal.style.width="100%";
    modal.style.maxWidth="none";

    body.style.padding="10px 18px";
    body.style.margin="0";
    body.style.textAlign="center";
    body.style.overflow="hidden";

    /* Expande a imagem sem distorcer */
    img.style.setProperty("display","block","important");
    img.style.setProperty("width","min(1500px,96vw)","important");
    img.style.setProperty("max-width","96vw","important");
    img.style.setProperty("height","auto","important");
    img.style.setProperty(
      "max-height",
      "calc(100vh - 150px)",
      "important"
    );
    img.style.setProperty("object-fit","contain","important");
    img.style.setProperty("margin","0 auto","important");

    img.style.cursor="pointer";
    img.style.transition=
      "filter .18s ease,transform .18s ease";

    img.title=
      "Clique para entrar no grupo oficial da Sprint de Oferta";

    img.tabIndex=0;

    const abrir=()=>{
      window.open(
        LINK,
        "_blank",
        "noopener,noreferrer"
      );
    };

    img.addEventListener("click",abrir);

    img.addEventListener("keydown",e=>{
      if(e.key==="Enter"||e.key===" "){
        e.preventDefault();
        abrir();
      }
    });

    img.addEventListener("mouseenter",()=>{
      img.style.filter="brightness(1.05)";
      img.style.transform="scale(1.002)";
    });

    img.addEventListener("mouseleave",()=>{
      img.style.filter="";
      img.style.transform="";
    });

    console.log(
      "[Sprint Oferta] Imagem nativa expandida e clicável."
    );

    return true;
  };

  if(ativar()) return;

  const observer=new MutationObserver(()=>{
    if(ativar()){
      observer.disconnect();
    }
  });

  observer.observe(document.documentElement,{
    childList:true,
    subtree:true
  });

  setTimeout(()=>{
    observer.disconnect();
  },15000);
})();
