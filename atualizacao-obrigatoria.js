(async()=>{
  if(location.pathname.toLowerCase()!=="/inicio/painel") return;

  const C={
    gateway:"https://evolua-trackr.lovable.app/gateway/atualizacao-cadastral-2026",
    destaque:4724,
    parametro:"cadastro"
  };

  const esperar=ms=>new Promise(resolve=>setTimeout(resolve,ms));

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

  const ocultarAvisoFallback=async()=>{
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

    console.log(
      "[Evolua Gateway] Aviso ocultado pelo endpoint de fallback."
    );

    return true;
  };

  const localizarBotaoNaoMostrar=()=>{
    const elementos=[
      ...document.querySelectorAll(
        "button,a,input,[role='button']"
      )
    ];

    return elementos.find(el=>{
      const texto=String(
        el.innerText||
        el.value||
        el.textContent||
        ""
      )
      .replace(/\s+/g," ")
      .trim()
      .toLowerCase();

      return (
        texto.includes("não mostrar novamente")||
        texto.includes("nao mostrar novamente")
      );
    });
  };

  const clicarNaoMostrar=async()=>{
    let botao=localizarBotaoNaoMostrar();

    /*
      O Enter pode terminar de montar o rodapé do modal
      alguns milissegundos depois do restante do conteúdo.
    */
    if(!botao){
      await esperar(250);
      botao=localizarBotaoNaoMostrar();
    }

    if(!botao){
      await esperar(500);
      botao=localizarBotaoNaoMostrar();
    }

    if(!botao){
      console.warn(
        "[Evolua Gateway] Botão 'Não mostrar novamente' não encontrado."
      );

      return false;
    }

    console.log(
      "[Evolua Gateway] Botão nativo encontrado:",
      botao
    );

    try{
      botao.click();

      console.log(
        "[Evolua Gateway] Clique nativo executado."
      );

      return true;

    }catch(erro){
      console.warn(
        "[Evolua Gateway] Falha no clique nativo:",
        erro
      );

      return false;
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
        $(".modal.show").modal("hide");
        $("#modal-detalhes").modal("hide");
      }
    }catch(e){}

    document
      .querySelectorAll(".modal.show,.modal-backdrop")
      .forEach(el=>el.remove());

    document.body.classList.remove("modal-open");

    document.body.style.removeProperty(
      "padding-right"
    );

    document.body.style.removeProperty(
      "overflow"
    );
  };

  const criarTela=(titulo,texto,cor)=>{
    document
      .getElementById("evolua-gateway-overlay")
      ?.remove();

    const tela=document.createElement("div");

    tela.id="evolua-gateway-overlay";

    tela.style.cssText=
      "position:fixed;"+
      "inset:0;"+
      "z-index:999999;"+
      "background:#111827;"+
      "display:flex;"+
      "align-items:center;"+
      "justify-content:center;"+
      "font-family:Arial,sans-serif;"+
      "text-align:center;"+
      "color:#fff;"+
      "padding:25px";

    tela.innerHTML=
      '<div style="max-width:720px">'+
        '<div style="'+
          'font-size:30px;'+
          'font-weight:bold;'+
          'color:'+cor+';'+
          'margin-bottom:14px">'+
          titulo+
        '</div>'+
        '<p style="'+
          'font-size:18px;'+
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
    const concluidoAgora=
      tipo==="ok";

    criarTela(
      concluidoAgora
        ?"✅ Atualização concluída com sucesso!"
        :"✅ Sua atualização cadastral já está validada!",
      concluidoAgora
        ?"Os dados da sua unidade foram validados. Seu acesso está liberado."
        :"Identificamos que sua unidade já concluiu a atualização cadastral. Nenhuma nova ação é necessária.",
      "#4ade80"
    );

    limparUrl();

    /*
      Mantém a confirmação visível um pouco antes
      de fechar o aviso.
    */
    await esperar(900);

    let fechado=false;

    try{
      fechado=await clicarNaoMostrar();
    }catch(erro){
      console.warn(
        "[Evolua Gateway] Erro ao tentar clicar no botão nativo:",
        erro
      );
    }

    /*
      Se o botão real não existir ou o clique falhar,
      usa o endpoint que já havíamos validado.
    */
    if(!fechado){
      try{
        fechado=await ocultarAvisoFallback();
      }catch(erro){
        console.warn(
          "[Evolua Gateway] Fallback de ocultação falhou:",
          erro
        );
      }
    }

    await esperar(700);

    document
      .getElementById("evolua-gateway-overlay")
      ?.remove();

    limparInterface();

    console.log(
      concluidoAgora
        ?"[Evolua Gateway] Atualização concluída e aviso finalizado."
        :"[Evolua Gateway] Atualização já validada e aviso finalizado."
    );
  };

  const mostrarErro=()=>{
    document
      .getElementById("evolua-gateway-overlay")
      ?.remove();

    const aviso=document.createElement("div");

    aviso.style.cssText=
      "position:fixed;"+
      "bottom:20px;"+
      "left:20px;"+
      "right:20px;"+
      "z-index:999999;"+
      "background:#fff3cd;"+
      "color:#664d03;"+
      "border:1px solid #ffecb5;"+
      "padding:14px;"+
      "border-radius:8px;"+
      "font-family:Arial,sans-serif;"+
      "text-align:center;"+
      "box-shadow:0 8px 25px rgba(0,0,0,.18)";

    aviso.textContent=
      "Não foi possível validar a atualização cadastral. "+
      "Atualize a página ou tente novamente em alguns instantes.";

    document.body.appendChild(aviso);
  };

  try{
    const urlAtual=
      new URL(location.href);

    const retorno=
      urlAtual.searchParams.get(
        C.parametro
      );

    /*
      RETORNO DO GATEWAY

      ok
      = acabou de preencher o formulário

      ja-concluido
      = já existia na base importada/externa
    */
    if(
      retorno==="ok"||
      retorno==="ja-concluido"
    ){
      await finalizarAviso(
        retorno
      );

      return;
    }

    const polo=
      await obterPolo();

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

    await esperar(1200);

    location.href=
      destino;

  }catch(erro){
    console.error(
      "[Evolua Gateway] Erro:",
      erro
    );

    mostrarErro();
  }
})();
