(()=>{
  if(location.pathname.toLowerCase()!=="/inicio/painel") return;

  const LINK="https://chat.whatsapp.com/KdWe44sqcoZHKEIyEuPj0t";

  const ativar=()=>{
    const marcador=document.querySelector("#sprint-oferta-turma-3");
    if(!marcador) return false;

    const area=
      marcador.closest(".modal-content") ||
      marcador.parentElement;

    if(!area) return false;

    const img=area.querySelector("img");
    if(!img) return false;

    if(img.dataset.sprintClicavel==="1") return true;

    img.dataset.sprintClicavel="1";
    img.style.cursor="pointer";
    img.style.transition="transform .15s ease,filter .15s ease";
    img.title="Clique para entrar no grupo da Sprint Evolua Oferta";
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
      img.style.filter="brightness(1.06)";
      img.style.transform="scale(1.005)";
    });

    img.addEventListener("mouseleave",()=>{
      img.style.filter="";
      img.style.transform="";
    });

    console.log(
      "[Sprint Oferta] Arte clicável ativada."
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
