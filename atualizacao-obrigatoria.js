(async()=>{
  if(location.pathname.toLowerCase()!=="/inicio/painel")return;

  const C={
    api:"https://evolua-trackr.lovable.app/api/public",
    token:"evolua_ad97759fcd476b54c2527e45d8f27a928087f58036e445c5280d39e9b83dc101",
    evento:"atualizacao-cadastral-2026",
    formulario:"https://formockta.lovable.app/f/atualizacaoevolua",
    parametro:"cadastro",
    destaque:4724,
    recurso:111,
    arquivo:126
  };

  const requisicao=async(url,opcoes={})=>{
    const resposta=await fetch(url,{
      ...opcoes,
      headers:{
        ...(opcoes.body?{"Content-Type":"application/json"}:{}),
        "x-evolua-integration-token":C.token,
        ...(opcoes.headers||{})
      }
    });

    const dados=await resposta.json().catch(()=>({}));

    if(!resposta.ok||dados.success===false){
      throw new Error(
        dados.error||
        dados.message||
        `Erro HTTP ${resposta.status}`
      );
    }

    return dados;
  };

  const consultarInteracao=async polo=>{
    const url=new URL(`${C.api}/check-event-interaction`);

    url.searchParams.set("event_slug",C.evento);
    url.searchParams.set("polo_code",polo);

    return requisicao(url.toString());
  };

  const concluirInteracao=async polo=>{
    return requisicao(
      `${C.api}/complete-event-interaction`,
      {
        method:"POST",
        body:JSON.stringify({
          event_slug:C.evento,
          polo_code:polo
        })
      }
    );
  };

  const obterCodigoPolo=async()=>{
    const resposta=await axios.get("/Configuracoes/TokenPolo");
    const html=String(resposta.data||"");

    const doc=new DOMParser().parseFromString(
      html,
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
      const elemento=doc.querySelector(seletor);

      const valor=
        elemento?.value||
        elemento?.getAttribute("value")||
        elemento?.textContent||
        "";

      const digitos=String(valor).replace(/\D/g,"");

      if(digitos&&digitos.length<=6){
        return digitos.padStart(6,"0");
      }
    }

    const texto=doc.body?.innerText||"";
    const encontrados=texto.match(/\b\d{1,6}\b/g)||[];

    for(const valor of encontrados){
      const digitos=valor.replace(/\D/g,"");

      if(digitos&&digitos.length<=6){
        return digitos.padStart(6,"0");
      }
    }

    throw new Error("Código do polo não identificado.");
  };

  const registrarNoEnter=async()=>{
    const formulario=new FormData();

    formulario.append(
      "IdRecursoDownload",
      String(C.recurso)
    );

    formulario.append(
      "IdRecursoDownloadArquivos",
      String(C.arquivo)
    );

    const resposta=await axios.post(
      "/Marketing/AddRegistroRecursoDownloadMarketing",
      formulario
    );

    const status=
      resposta.data?.StatusCode||
      resposta.status;

    if(Number(status)!==200){
      throw new Error(
        "Não foi possível registrar a conclusão no Enter."
      );
    }
  };

  const ocultarAviso=async()=>{
    const resposta=await axios.post(
      "/Destaque/AddDestaqueVisualizacao",
      C.destaque,
      {
        headers:{
          "Content-Type":"application/json"
        }
      }
    );

    const status=
      resposta.data?.StatusCode||
      resposta.status;

    if(Number(status)!==200){
      throw new Error(
        "Não foi possível ocultar o aviso."
      );
    }
  };

  const limparInterface=()=>{
    document
      .querySelectorAll(".modal,.modal-backdrop")
      .forEach(elemento=>elemento.remove());

    document.body.classList.remove("modal-open");
    document.body.style.removeProperty("padding-right");
    document.body.style.removeProperty("overflow");
  };

  const removerParametro=()=>{
    const url=new URL(location.href);

    url.searchParams.delete(C.parametro);

    history.replaceState(
      {},
      "",
      url.pathname+url.search+url.hash
    );
  };

  const mostrarTransicao=()=>{
    if(document.getElementById("evolua-atualizacao-overlay")){
      return;
    }

    const tela=document.createElement("div");

    tela.id="evolua-atualizacao-overlay";

    tela.style.cssText=[
      "position:fixed",
      "inset:0",
      "z-index:999999",
      "background:#111827",
      "display:flex",
      "align-items:center",
      "justify-content:center",
      "font-family:Arial,sans-serif",
      "text-align:center",
      "color:#fff",
      "padding:25px"
    ].join(";");

    tela.innerHTML=`
      <div>
        <div style="
          font-size:28px;
          font-weight:bold;
          color:#ffcc00;
          margin-bottom:12px
        ">
          ⚠️ Atualização cadastral obrigatória
        </div>

        <p style="
          font-size:18px;
          max-width:650px;
          line-height:1.5;
          margin:0 auto 14px
        ">
          Você será direcionado para validar os dados da sua unidade.
        </p>

        <p style="font-size:16px">
          Aguarde...
        </p>
      </div>
    `;

    document.body.appendChild(tela);
  };

  const mostrarErro=mensagem=>{
    document
      .getElementById("evolua-atualizacao-overlay")
      ?.remove();

    const aviso=document.createElement("div");

    aviso.style.cssText=[
      "position:fixed",
      "left:20px",
      "right:20px",
      "bottom:20px",
      "z-index:999999",
      "background:#fff3cd",
      "color:#664d03",
      "border:1px solid #ffecb5",
      "padding:14px",
      "border-radius:9px",
      "font-family:Arial,sans-serif",
      "text-align:center",
      "box-shadow:0 8px 25px rgba(0,0,0,.2)"
    ].join(";");

    aviso.textContent=mensagem;

    document.body.appendChild(aviso);
  };

  try{
    const polo=await obterCodigoPolo();
    const urlAtual=new URL(location.href);

    const retornouDoFormulario=
      urlAtual.searchParams.get(C.parametro)==="ok";

    if(retornouDoFormulario){
      mostrarTransicao();

      await concluirInteracao(polo);
      await registrarNoEnter();
      await ocultarAviso();

      removerParametro();
      limparInterface();

      document
        .getElementById("evolua-atualizacao-overlay")
        ?.remove();

      console.log(
        "Atualização cadastral concluída:",
        polo
      );

      return;
    }

    const interacao=await consultarInteracao(polo);

    const jaConcluiu=
      interacao.exists===true&&
      interacao.status==="completed";

    if(jaConcluiu){
      await ocultarAviso().catch(erro=>{
        console.warn(
          "Polo concluído, mas o aviso não pôde ser ocultado:",
          erro
        );
      });

      limparInterface();

      console.log(
        "Atualização já concluída para o polo:",
        polo
      );

      return;
    }

    mostrarTransicao();

    setTimeout(()=>{
      location.href=C.formulario;
    },1800);

  }catch(erro){
    console.error("Evolua Tracker:",erro);

    mostrarErro(
      "Não foi possível validar a atualização cadastral. "+
      "Atualize a página ou tente novamente em alguns instantes."
    );
  }
})();
