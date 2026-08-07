(()=>{
  const CONFIG={
    maxWidth:"760px",
    modalPaddingTop:"8px",
    descGap:"10px"
  };

  const esconderPlaceholder=()=>{
    const imgs=[...document.querySelectorAll("img.img-src")]
      .filter(img=>
        (img.src||"").includes("/Aviso/Default/Capa/default.jpg")
      );

    imgs.forEach(img=>{
      const bloco=
        img.closest(
          ".col-12.d-flex.justify-content-center.align-items-center"
        )||img.parentElement;

      if(!bloco)return;

      bloco.style.setProperty("display","none","important");
      bloco.style.setProperty("height","0","important");
      bloco.style.setProperty("min-height","0","important");
      bloco.style.setProperty("max-height","0","important");
      bloco.style.setProperty("margin","0","important");
      bloco.style.setProperty("padding","0","important");
      bloco.style.setProperty("overflow","hidden","important");
    });
  };

  const ajustarDescricao=()=>{
    const descs=[
      ...document.querySelectorAll(".content-desc")
    ];

    descs.forEach(desc=>{
      const iframe=desc.querySelector("iframe[src*='player.vimeo.com']");

      if(!iframe)return;

      desc.style.setProperty("margin-top","0","important");
      desc.style.setProperty("padding-top",CONFIG.modalPaddingTop,"important");
      desc.style.setProperty("padding-bottom","8px","important");
      desc.style.setProperty("text-align","center","important");

      const interno=desc.firstElementChild;

      if(interno){
        interno.style.setProperty("margin-top","0","important");
      }
    });
  };

  const ajustarVimeo=()=>{
    const iframes=[
      ...document.querySelectorAll(
        "iframe[src*='player.vimeo.com']"
      )
    ];

    iframes.forEach(iframe=>{
      iframe.style.setProperty("display","block","important");
      iframe.style.setProperty("width","100%","important");
      iframe.style.setProperty("height","100%","important");
      iframe.style.setProperty("border","0","important");
      iframe.style.setProperty("margin","0","important");
    });
  };

  const ajustarContainerSocial=()=>{
    const teasers=[
      ...document.querySelectorAll("[data-social-teaser]")
    ];

    teasers.forEach(container=>{
      container.style.setProperty("width","100%","important");
      container.style.setProperty(
        "max-width",
        CONFIG.maxWidth,
        "important"
      );
      container.style.setProperty("margin","0 auto","important");
      container.style.setProperty("padding","0","important");
    });
  };

  const ajustarModal=()=>{
    const modais=[
      ...document.querySelectorAll(".modal")
    ];

    modais.forEach(modal=>{
      if(!modal.querySelector("iframe[src*='player.vimeo.com']")){
        return;
      }

      const body=modal.querySelector(".modal-body");

      if(body){
        body.style.setProperty(
          "align-items",
          "flex-start",
          "important"
        );
      }

      const footer=modal.querySelector(".modal-footer");

      if(footer){
        footer.style.setProperty(
          "margin-top",
          "0",
          "important"
        );
      }
    });
  };

  const ajustarScrollInterno=()=>{
    const iframe=document.querySelector(
      "iframe[src*='player.vimeo.com']"
    );

    if(!iframe)return;

    let el=iframe.parentElement;

    while(el && el!==document.body){
      const estilo=getComputedStyle(el);

      if(
        estilo.overflowY==="auto"||
        estilo.overflowY==="scroll"
      ){
        if(el.scrollHeight<900){
          el.style.setProperty(
            "overflow-y",
            "visible",
            "important"
          );
          el.style.setProperty(
            "max-height",
            "none",
            "important"
          );
          el.style.setProperty(
            "height",
            "auto",
            "important"
          );
        }
      }

      el=el.parentElement;
    }
  };

  const aplicar=()=>{
    esconderPlaceholder();
    ajustarDescricao();
    ajustarVimeo();
    ajustarContainerSocial();
    ajustarModal();
    ajustarScrollInterno();
  };

  aplicar();

  setTimeout(aplicar,150);
  setTimeout(aplicar,400);
  setTimeout(aplicar,900);
  setTimeout(aplicar,1600);

  const observer=new MutationObserver(()=>{
    aplicar();
  });

  observer.observe(document.body,{
    childList:true,
    subtree:true
  });

  console.log(
    "[Social Teaser] Layout aplicado."
  );
})();
