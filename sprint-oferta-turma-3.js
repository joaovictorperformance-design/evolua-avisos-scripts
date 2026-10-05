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
    img.style.display="block";
    img.style.maxWidth="100%";
    img.title="Clique para entrar no grupo da Sprint de Oferta";
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

    /* CRIA BLOCO VERTICAL: IMAGEM + TEXTO */
    if(!document.querySelector("#sprint-oferta-wrapper")){

      const wrapper=document.createElement("div");

      wrapper.id="sprint-oferta-wrapper";
      wrapper.style.cssText=
        "width:100%;"+
        "display:flex;"+
        "flex-direction:column;"+
        "align-items:center;"+
        "justify-content:center;"+
        "text-align:center;"+
        "margin:0 auto;";

      img.parentNode.insertBefore(wrapper,img);
      wrapper.appendChild(img);

      const aviso=document.createElement("div");

      aviso.id="sprint-oferta-orientacao";

      aviso.innerHTML=
        '👆 <b>Quer participar da nova turma?</b><br>'+
        'Clique na imagem acima para entrar no grupo oficial da Sprint de Oferta.';

      aviso.style.cssText=
        "font-family:Arial,sans-serif;"+
        "font-size:16px;"+
        "line-height:1.45;"+
        "color:#172033;"+
        "margin:14px auto 6px;"+
        "padding:8px 16px;"+
        "width:100%;"+
        "box-sizing:border-box;"+
        "text-align:center;"+
        "cursor:pointer;";

      aviso.addEventListener("click",abrir);

      wrapper.appendChild(aviso);
    }

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
