(()=>{
  const esconder=()=>{
    [...document.querySelectorAll("img.img-src")]
      .filter(i=>i.src.includes("/Aviso/Default/Capa/default.jpg"))
      .forEach(img=>{
        const b=img.closest(
          ".col-12.d-flex.justify-content-center.align-items-center"
        )||img.parentElement;

        if(!b)return;

        b.style.setProperty("display","none","important");
        b.style.setProperty("height","0","important");
        b.style.setProperty("min-height","0","important");
        b.style.setProperty("margin","0","important");
        b.style.setProperty("padding","0","important");
        b.style.setProperty("overflow","hidden","important");
      });
  };

  esconder();
  setTimeout(esconder,300);
  setTimeout(esconder,800);

  new MutationObserver(esconder)
    .observe(document.body,{
      childList:true,
      subtree:true
    });
})();
