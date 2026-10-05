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

    /* Evita ativar mais de uma vez */
    if(img.dataset.sprintOferta==="1") return true;
    img.dataset.sprintOferta="1";

    /* Expande o espaço do destaque */
    modal.style.width="100%";
    modal.style.maxWidth="none";

    body.style.padding="10px 18px";
    body.style.margin="0";
    body.style.textAlign="center";
    body.style.overflow="visible";

    /* Faz a imagem usar o espaço disponível sem cortar */
    img.style.setProperty("display","block","important");
    img.style.setProperty("width","100%","important");
    img.style.setProperty("max-width","1500px","important");
    img.style.setProperty("height","auto","important");
    img.style.setProperty("max-height","none","important");
    img.style.setProperty("object-fit","contain","important");
    img.style.setProperty("margin","0 auto","important");

    /* Aparência clicável */
    img.style.cursor="pointer";
    img.style.transition=
      "filter .18s ease, transform .18s ease";

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

    /* Clique */
    img.addEventListener("click",abrir);

    /* Acessibilidade pelo teclado */
    img.addEventListener("keydown",e=>{
      if(e.key==="Enter"||e.key===" "){
        e.preventDefault();
        abrir();
      }
    });

    /* Pequeno efeito visual */
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

  /* Tenta ativar imediatamente */
  if(ativar()) return;

  /* Caso o ENTER monte o destaque depois */
  const observer=new MutationObserver(()=>{
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

  /* Segurança para não deixar observer rodando para sempre */
  setTimeout(()=>{
    observer.disconnect();
  },15000);

})();
