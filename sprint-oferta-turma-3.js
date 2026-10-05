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

    const abrir=()=>{
      window.open(
        LINK,
        "_blank",
        "noopener,noreferrer"
      );
    };

    img.style.cursor="pointer";
    img.style.display="block";
    img.style.maxWidth="100%";
    img.style.height="auto";
    img.style.transition="filter .15s ease";
    img.title="Clique para entrar no grupo da Sprint de Oferta";
    img.tabIndex=0;

    img.addEventListener("click",abrir);

    img.addEventListener("keydown",e=>{
      if(e.key==="Enter"||e.key===" "){
        e.preventDefault();
        abrir();
      }
    });

    img.addEventListener("mouseenter",()=>{
      img.style.filter="brightness(1.06)";
    });

    img.addEventListener("mouseleave",()=>{
      img.style.filter="";
    });

    if(!document.querySelector("#sprint-oferta-wrapper")){
      const wrapper=document.createElement("div");

      wrapper.id="sprint-oferta-wrapper";
      wrapper.style.cssText=
        "position:relative;"+
        "display:inline-block;"+
        "max-width:100%;"+
        "line-height:0;";

      img.parentNode.insertBefore(wrapper,img);
      wrapper.appendChild(img);

      const aviso=document.createElement("div");

      aviso.id="sprint-oferta-orientacao";

      aviso.innerHTML=
        '👆 <b>Clique na imagem para entrar no grupo oficial da Sprint</b>';

      aviso.style.cssText=
        "position:absolute;"+
        "left:50%;"+
        "bottom:10px;"+
        "transform:translateX(-50%);"+
        "width:calc(100% - 24px);"+
        "box-sizing:border-box;"+
        "padding:10px 14px;"+
        "border-radius:10px;"+
        "background:rgba(0,0,0,.72);"+
        "color:#fff;"+
        "font-family:Arial,sans-serif;"+
        "font-size:15px;"+
        "font-weight:500;"+
        "line-height:1.3;"+
        "text-align:center;"+
        "cursor:pointer;"+
        "z-index:10;"+
        "backdrop-filter:blur(4px);";

      aviso.addEventListener("click",e=>{
        e.stopPropagation();
        abrir();
      });

      wrapper.appendChild(aviso);
    }

    console.log("[Sprint Oferta] Arte clicável ativada.");
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

  setTimeout(()=>{
    observer.disconnect();
  },15000);
})();
