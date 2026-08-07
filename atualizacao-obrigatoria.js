(async()=>{
  if(location.pathname.toLowerCase()!=="/inicio/painel")return;

  const C={
    gateway:"https://evolua-trackr.lovable.app/gateway/atualizacao-cadastral-2026",
    destaque:4724,
    parametro:"cadastro"
  };

  const obterPolo=async()=>{
    const r=await axios.get("/Configuracoes/TokenPolo");

    const doc=new DOMParser().parseFromString(
      String(r.data||""),
      "text/html"
    );

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
    const r=await axios.post(
      "/Destaque/AddDestaqueVisualizacao",
      C.destaque,
      {
        headers:{
          "Content-Type":"application/json"
        }
      }
    );

    const status=
      Number(r.data?.StatusCode)||
      Number(r.status);

    if(status!==200){
      throw new Error(
        "Falha ao registrar ocultação do aviso."
      );
    }
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
    try{
      if(window.jQuery){
        $("#modal-detalhes").modal("hide");
      }
    }catch(e){}

    document
      .querySelectorAll(".modal.show,.modal-backdrop")
      .forEach(e=>e.remove());

    document.body.classList.remove("modal-open");
    document.body.style.removeProperty("padding-right");
    document.body.style.removeProperty("overflow");
  };

  const criarTela=(titulo,texto,cor)=>{
    document
      .getElementById("evolua-gateway-overlay")
      ?.remove();

    const tela=document.createElement("div");

    tela.id="evolua-gateway-overlay";

    tela.style.cssText=
      "position:fixed;inset:0;z-index:999999;background:#111827;"+
      "display:flex;align-items:center;justify-content:center;"+
      "font-family:Arial,sans-serif;text-align:center;color:#fff;"+
      "padding:25px";

    tela.innerHTML=
      '<div>'+
        '<div style="'+
          'font-size:30px;'+
          'font-weight:bold;'+
          'color:'+cor+';'+
          'margin-bottom:14px">'+
          titulo+
        '</div>'+
        '<p style="'+
          'font-size:18px;'+
          'max-width:650px;'+
          'line-height:1.5;'+
          'margin:0 auto 12px">'+
          texto+
        '</p>'+
      '</div>';

    document.body.appendChild(tela);

    return tela;
  };

  const mostrarVerificacao=()=>{
    criarTela(
      "⚠️ Atualização cadastral obrigatória",
      "Estamos verificando a situação cadastral da sua unidade.<br><br>Aguarde...",
      "#ffcc00"
    );
  };

  const finalizarAviso=async(tipo)=>{
    const concluidoAgora=tipo==="ok";

    criarTela(
      concluidoAgora
        ?"✅ Atualização concluída com sucesso!"
        :"✅ Sua atualização cadastral já está validada!",
      concluidoAgora
        ?"Os dados da sua unidade foram validados. Seu acesso está liberado."
        :"Identificamos que sua unidade já concluiu a atualização. Seu acesso está liberado.",
      "#4ade80"
    );

    try{
      await ocultarAviso();
    }catch(erro){
      console.warn(
        "[Evolua Gateway] Não foi possível ocultar o aviso:",
        erro
      );
    }

    limparUrl();

    setTimeout(()=>{
      document
        .getElementById("evolua-gateway-overlay")
        ?.remove();

      limparInterface();

      console.log(
        concluidoAgora
          ?"[Evolua Gateway] Atualização concluída."
          :"[Evolua Gateway] Atualização já validada."
      );
    },1600);
  };

  const mostrarErro=()=>{
    document
      .getElementById("evolua-gateway-overlay")
      ?.remove();

    const aviso=document.createElement("div");

    aviso.style.cssText=
      "position:fixed;bottom:20px;left:20px;right:20px;"+
      "z-index:999999;background:#fff3cd;color:#664d03;"+
      "border:1px solid #ffecb5;padding:14px;border-radius:8px;"+
      "font-family:Arial,sans-serif;text-align:center;"+
      "box-shadow:0 8px 25px rgba(0,0,0,.18)";

    aviso.textContent=
      "Não foi possível validar a atualização cadastral. "+
      "Atualize a página ou tente novamente em alguns instantes.";

    document.body.appendChild(aviso);
  };

  try{
    const urlAtual=new URL(location.href);

    const retorno=
      urlAtual.searchParams.get(C.parametro);

    if(
      retorno==="ok"||
      retorno==="ja-concluido"
    ){
      await finalizarAviso(retorno);
      return;
    }

    const polo=await obterPolo();

    console.log(
      "[Evolua Gateway] Polo identificado:",
      polo
    );

    console.log(
      "[Evolua Gateway] Origem identificada:",
      location.origin
    );

    mostrarVerificacao();

    const destino=
      `${C.gateway}?polo=${encodeURIComponent(polo)}`+
      `&return_origin=${encodeURIComponent(location.origin)}`;

    console.log(
      "[Evolua Gateway] Redirecionando para:",
      destino
    );

    setTimeout(()=>{
      location.href=destino;
    },1200);

  }catch(erro){
    console.error(
      "[Evolua Gateway] Erro:",
      erro
    );

    mostrarErro();
  }
})();
