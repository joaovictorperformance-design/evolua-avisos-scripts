(async()=>{
  if(location.pathname.toLowerCase()!=="/inicio/painel")return;

  const C={
    gateway:"https://evolua-trackr.lovable.app/gateway/atualizacao-cadastral-2026",
    destaque:4724,
    parametro:"cadastro"
  };

  const obterPolo=async()=>{
    const r=await axios.get("/Configuracoes/TokenPolo");
    const doc=new DOMParser().parseFromString(String(r.data||""),"text/html");

    const seletores=[
      "#inputCodigo",
      "#CodigoPolo",
      "[name='CodigoPolo']",
      "[name='CodigoExterno']",
      "[name='CodigoExternoPolo']"
    ];

    for(const seletor of seletores){
      const el=doc.querySelector(seletor);

      const valor=
        el?.value||
        el?.getAttribute("value")||
        el?.textContent||
        "";

      const digitos=String(valor).replace(/\D/g,"");

      if(digitos&&digitos.length<=6){
        return digitos.padStart(6,"0");
      }
    }

    throw new Error("Código do polo não identificado.");
  };

  const ocultarAviso=async()=>{
    await axios.post(
      "/Destaque/AddDestaqueVisualizacao",
      C.destaque,
      {
        headers:{
          "Content-Type":"application/json"
        }
      }
    );
  };

  const limparUrl=()=>{
    const u=new URL(location.href);

    u.searchParams.delete(C.parametro);

    history.replaceState(
      {},
      "",
      u.pathname+u.search+u.hash
    );
  };

  const limparInterface=()=>{
    document.querySelectorAll(".modal,.modal-backdrop")
      .forEach(e=>e.remove());

    document.body.classList.remove("modal-open");
    document.body.style.removeProperty("padding-right");
    document.body.style.removeProperty("overflow");
  };

  const mostrarTransicao=texto=>{
    if(document.getElementById("evolua-gateway-overlay"))return;

    const tela=document.createElement("div");

    tela.id="evolua-gateway-overlay";

    tela.style.cssText=
      "position:fixed;inset:0;z-index:999999;background:#111827;"+
      "display:flex;align-items:center;justify-content:center;"+
      "font-family:Arial;text-align:center;color:#fff;padding:25px";

    tela.innerHTML=
      '<div>'+
      '<div style="font-size:28px;font-weight:bold;color:#ffcc00;margin-bottom:12px">'+
      '⚠️ Atualização cadastral obrigatória</div>'+
      '<p style="font-size:18px;max-width:650px;line-height:1.5">'+
      texto+
      '</p><p>Aguarde...</p></div>';

    document.body.appendChild(tela);
  };

  try{
    const urlAtual=new URL(location.href);
    const retorno=urlAtual.searchParams.get(C.parametro);

    if(retorno==="ok"||retorno==="ja-concluido"){
      await ocultarAviso().catch(console.warn);

      limparUrl();
      limparInterface();

      console.log(
        retorno==="ok"
          ?"Atualização cadastral concluída."
          :"Atualização cadastral já estava concluída."
      );

      return;
    }

    const polo=await obterPolo();

    mostrarTransicao(
      "Estamos verificando a situação cadastral da sua unidade."
    );

    const destino=
      `${C.gateway}?polo=${encodeURIComponent(polo)}`;

    setTimeout(()=>{
      location.href=destino;
    },1200);

  }catch(erro){
    console.error("Evolua Gateway:",erro);

    const aviso=document.createElement("div");

    aviso.style.cssText=
      "position:fixed;bottom:20px;left:20px;right:20px;z-index:999999;"+
      "background:#fff3cd;color:#664d03;padding:14px;border-radius:8px;"+
      "font-family:Arial;text-align:center";

    aviso.textContent=
      "Não foi possível validar a atualização cadastral. Tente novamente em instantes.";

    document.body.appendChild(aviso);
  }
})();
