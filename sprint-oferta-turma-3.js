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

    const dialog=
      modal.closest(".modal-dialog");

    const body=
      modal.querySelector(".modal-body") ||
      marcador.parentElement;

    if(!body) return false;

    /*
      Localiza a imagem original carregada pelo ENTER.
      Vamos aproveitar apenas a URL dela.
    */
    const imagemOriginal=body.querySelector("img");
    if(!imagemOriginal) return false;

    if(modal.dataset.sprintOfertaFinal==="1"){
      return true;
    }

    modal.dataset.sprintOfertaFinal="1";

    const SRC=
      imagemOriginal.currentSrc ||
      imagemOriginal.src;

    if(!SRC) return false;

    /*
      EXPANDE O MODAL
    */
    if(dialog){
      dialog.style.setProperty(
        "width",
        "94vw",
        "important"
      );

      dialog.style.setProperty(
        "max-width",
        "1600px",
        "important"
      );

      dialog.style.setProperty(
        "margin",
        "30px auto",
        "important"
      );
    }

    modal.style.setProperty(
      "width",
      "100%",
      "important"
    );

    modal.style.setProperty(
      "max-width",
      "none",
      "important"
    );

    modal.style.setProperty(
      "overflow",
      "visible",
      "important"
    );

    /*
      LIMPA O CORPO DO DESTAQUE

      Aqui eliminamos a imagem antiga e os estilos/classes
      que o ENTER colocou nela.
    */
    body.innerHTML="";

    body.style.setProperty(
      "padding",
      "14px",
      "important"
    );

    body.style.setProperty(
      "margin",
      "0",
      "important"
    );

    body.style.setProperty(
      "width",
      "100%",
      "important"
    );

    body.style.setProperty(
      "height",
      "auto",
      "important"
    );

    body.style.setProperty(
      "min-height",
      "0",
      "important"
    );

    body.style.setProperty(
      "max-height",
      "none",
      "important"
    );

    body.style.setProperty(
      "overflow",
      "visible",
      "important"
    );

    body.style.setProperty(
      "display",
      "flex",
      "important"
    );

    body.style.setProperty(
      "justify-content",
      "center",
      "important"
    );

    body.style.setProperty(
      "align-items",
      "flex-start",
      "important"
    );

    /*
      CRIA UMA NOVA IMAGEM

      Sem classes nem estilos herdados da imagem antiga.
    */
    const banner=document.createElement("img");

    banner.src=SRC;

    banner.alt=
      "Sprint de Oferta - Nova Turma";

    banner.title=
      "Clique para entrar no grupo oficial da Sprint de Oferta";

    banner.style.setProperty(
      "display",
      "block",
      "important"
    );

    banner.style.setProperty(
      "width",
      "100%",
      "important"
    );

    banner.style.setProperty(
      "max-width",
      "1500px",
      "important"
    );

    banner.style.setProperty(
      "height",
      "auto",
      "important"
    );

    banner.style.setProperty(
      "max-height",
      "none",
      "important"
    );

    banner.style.setProperty(
      "object-fit",
      "contain",
      "important"
    );

    banner.style.setProperty(
      "object-position",
      "center",
      "important"
    );

    banner.style.setProperty(
      "margin",
      "0 auto",
      "important"
    );

    banner.style.cursor="pointer";

    banner.style.transition=
      "filter .18s ease, transform .18s ease";

    banner.tabIndex=0;

    const abrir=()=>{
      window.open(
        LINK,
        "_blank",
        "noopener,noreferrer"
      );
    };

    banner.addEventListener(
      "click",
      abrir
    );

    banner.addEventListener(
      "keydown",
      e=>{
        if(
          e.key==="Enter" ||
          e.key===" "
        ){
          e.preventDefault();
          abrir();
        }
      }
    );

    banner.addEventListener(
      "mouseenter",
      ()=>{
        banner.style.filter=
          "brightness(1.05)";

        banner.style.transform=
          "scale(1.002)";
      }
    );

    banner.addEventListener(
      "mouseleave",
      ()=>{
        banner.style.filter="";
        banner.style.transform="";
      }
    );

    body.appendChild(banner);

    console.log(
      "[Sprint Oferta] Banner reconstruído, expandido e clicável."
    );

    return true;
  };

  /*
    Tenta imediatamente.
  */
  if(ativar()) return;

  /*
    Caso o ENTER carregue o destaque depois.
  */
  const observer=
    new MutationObserver(()=>{
      if(ativar()){
        observer.disconnect();
      }
    });

  observer.observe(
    document.documentElement,
    {
      childList:true,
      subtree:true
    }
  );

  setTimeout(()=>{
    observer.disconnect();
  },15000);

})();
