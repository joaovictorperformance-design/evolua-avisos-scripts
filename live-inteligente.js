(()=>{
  if(location.pathname.toLowerCase()!=="/inicio/painel") return;

  const SCRIPT=
    [...document.querySelectorAll("script")]
      .reverse()
      .find(s=>
        (s.src||"").includes("live-inteligente.js") &&
        s.dataset.evento
      )
    ||document.currentScript;

  const C={
    slug:
      SCRIPT?.dataset.evento||
      "super-cafe-tech",

    titulo:
      SCRIPT?.dataset.titulo||
      "Super Café Tech",

    inicio:
      SCRIPT?.dataset.inicio||
      "2026-08-18T15:00:00-03:00",

    fim:
      SCRIPT?.dataset.fim||
      "2026-08-18T16:00:00-03:00",

    consultor:
      SCRIPT?.dataset.consultor||
      "https://linkhubtree.lovable.app/performance",

    gateway:
      "https://evolua-trackr.lovable.app/gateway"
  };

  let timer=null;
  let redirecionando=false;

  const esperar=ms=>
    new Promise(resolve=>setTimeout(resolve,ms));

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

      const digitos=
        String(valor).replace(/\D/g,"");

      if(digitos&&digitos.length<=6){
        return digitos.padStart(6,"0");
      }
    }

    throw new Error(
      "Código do polo não identificado."
    );
  };

  const limparParametrosLive=()=>{
    const url=new URL(location.href);

    url.searchParams.delete("live");
    url.searchParams.delete("evento");

    history.replaceState(
      {},
      "",
      url.pathname+url.search+url.hash
    );
  };

  const getContainer=()=>{
    return (
      document.querySelector(
        `[data-live-aviso="${C.slug}"]`
      )||
      document.querySelector(
        "[data-live-aviso]"
      )
    );
  };

  const setConteudo=html=>{
    const container=getContainer();

    if(!container){
      console.warn(
        "[Smart Live] Container do aviso não encontrado."
      );
      return;
    }

    container.innerHTML=html;
  };

  const botao=(texto,onclick)=>{
    return `
      <button
        type="button"
        onclick="${onclick}"
        style="
          display:inline-block;
          border:0;
          background:#0A4199;
          color:#fff;
          padding:14px 28px;
          border-radius:10px;
          font:bold 17px Arial;
          cursor:pointer;
          margin-top:12px;
          box-shadow:0 5px 14px rgba(0,0,0,.15)
        "
      >
        ${texto}
      </button>
    `;
  };

  const formatarTempo=ms=>{
    if(ms<0) ms=0;

    const total=
      Math.floor(ms/1000);

    const dias=
      Math.floor(total/86400);

    const horas=
      Math.floor((total%86400)/3600);

    const minutos=
      Math.floor((total%3600)/60);

    const segundos=
      total%60;

    const pad=n=>
      String(n).padStart(2,"0");

    if(dias>0){
      return `${dias}d ${pad(horas)}:${pad(minutos)}:${pad(segundos)}`;
    }

    return `${pad(horas)}:${pad(minutos)}:${pad(segundos)}`;
  };

  const urlGateway=async force=>{
    const polo=await obterPolo();

    const url=new URL(
      `${C.gateway}/${C.slug}`
    );

    url.searchParams.set(
      "polo",
      polo
    );

    url.searchParams.set(
      "return_origin",
      location.origin
    );

    if(force){
      url.searchParams.set(
        "force_join",
        "1"
      );
    }

    return url.toString();
  };

  const irGateway=async force=>{
    if(redirecionando) return;

    redirecionando=true;

    try{
      setConteudo(`
        <div style="
          text-align:center;
          font-family:Arial;
          padding:24px
        ">
          <div style="
            font-size:24px;
            font-weight:bold;
            color:#0A4199
          ">
            🔴 Preparando seu acesso...
          </div>

          <p style="
            margin-top:12px;
            font-size:16px;
            color:#444
          ">
            Aguarde enquanto identificamos sua unidade.
          </p>
        </div>
      `);

      const destino=
        await urlGateway(force);

      location.href=
        destino;

    }catch(erro){
      redirecionando=false;

      console.error(
        "[Smart Live] Erro ao acessar gateway:",
        erro
      );

      setConteudo(`
        <div style="
          font-family:Arial;
          text-align:center;
          padding:22px
        ">
          <b style="
            color:#b45309;
            font-size:19px
          ">
            ⚠️ Não conseguimos liberar o acesso.
          </b>

          <p>
            Atualize a página e tente novamente.
          </p>
        </div>
      `);
    }
  };

  window.evoluaLiveReentrar=()=>{
    irGateway(true);
  };

  window.evoluaLiveConsultor=()=>{
    window.open(
      C.consultor,
      "_blank",
      "noopener"
    );
  };

  const mostrarAntes=()=>{
    const inicio=
      new Date(C.inicio);

    const atualizar=()=>{
      const restante=
        inicio.getTime()-Date.now();

      if(restante<=0){
        clearInterval(timer);
        irGateway(false);
        return;
      }

      setConteudo(`
        <div style="
          text-align:center;
          font-family:Arial;
          padding:18px 12px 22px
        ">

          <div style="
            font-size:26px;
            font-weight:bold;
            color:#0A4199;
            margin-bottom:8px
          ">
            ☕ ${C.titulo}
          </div>

          <div style="
            font-size:15px;
            color:#555
          ">
            Nosso encontro começa em
          </div>

          <div style="
            font-size:34px;
            font-weight:bold;
            margin:12px 0;
            color:#EA1C52;
            letter-spacing:1px
          ">
            ${formatarTempo(restante)}
          </div>

          <div style="
            font-size:15px;
            color:#555
          ">
            Lançamentos, soluções e novidades
            estão chegando. Quando a live começar,
            seu acesso será liberado automaticamente.
          </div>

        </div>
      `);
    };

    atualizar();

    timer=
      setInterval(
        atualizar,
        1000
      );
  };

  const mostrarAcontecendo=()=>{
    limparParametrosLive();

    setConteudo(`
      <div style="
        text-align:center;
        font-family:Arial;
        padding:20px 12px 24px
      ">

        <div style="
          font-size:13px;
          font-weight:bold;
          color:#EA1C52;
          letter-spacing:1px;
          margin-bottom:5px
        ">
          ● AO VIVO
        </div>

        <div style="
          font-size:27px;
          font-weight:bold;
          color:#111827
        ">
          ${C.titulo}
        </div>

        <p style="
          font-size:16px;
          line-height:1.5;
          color:#555;
          margin:12px auto 4px;
          max-width:600px
        ">
          Sua entrada já foi registrada.
          O Super Café Tech está acontecendo agora.
        </p>

        ${botao(
          "▶ VOLTAR PARA A LIVE",
          "window.evoluaLiveReentrar()"
        )}

      </div>
    `);
  };

  const mostrarEncerrada=()=>{
    limparParametrosLive();

    setConteudo(`
      <div style="
        text-align:center;
        font-family:Arial;
        padding:20px 12px 24px
      ">

        <div style="
          font-size:26px;
          font-weight:bold;
          color:#111827
        ">
          ✅ ${C.titulo}
        </div>

        <div style="
          margin-top:7px;
          font-size:18px;
          font-weight:bold;
          color:#555
        ">
          Live encerrada
        </div>

        <p style="
          font-size:16px;
          line-height:1.5;
          color:#555;
          max-width:600px;
          margin:14px auto 2px
        ">
          O encontro ao vivo já terminou.
          Para saber mais sobre os lançamentos,
          soluções e novidades apresentadas,
          fale com nosso time.
        </p>

        ${botao(
          "💬 FALAR COM O CONSULTOR",
          "window.evoluaLiveConsultor()"
        )}

      </div>
    `);
  };

  const iniciar=async()=>{
    try{
      console.log(
        "[Smart Live] Configuração carregada:",
        {
          slug:C.slug,
          titulo:C.titulo,
          inicio:C.inicio,
          fim:C.fim,
          consultor:C.consultor
        }
      );

      if(!C.inicio||!C.fim){
        throw new Error(
          "Datas da live não configuradas."
        );
      }

      const inicio=
        new Date(C.inicio);

      const fim=
        new Date(C.fim);

      if(
        Number.isNaN(inicio.getTime())||
        Number.isNaN(fim.getTime())
      ){
        throw new Error(
          "Data/hora inválida."
        );
      }

      const url=
        new URL(location.href);

      const retornoLive=
        url.searchParams.get("live");

      const eventoRetorno=
        url.searchParams.get("evento");

      if(
        retornoLive==="ja-entrou"&&
        eventoRetorno===C.slug
      ){
        mostrarAcontecendo();
        return;
      }

      if(
        retornoLive==="encerrada"&&
        eventoRetorno===C.slug
      ){
        mostrarEncerrada();
        return;
      }

      const agora=
        Date.now();

      if(agora<inicio.getTime()){
        mostrarAntes();
        return;
      }

      if(agora>fim.getTime()){
        mostrarEncerrada();
        return;
      }

      await esperar(350);

      irGateway(false);

    }catch(erro){
      console.error(
        "[Smart Live] Erro:",
        erro
      );

      setConteudo(`
        <div style="
          text-align:center;
          padding:20px;
          font-family:Arial;
          color:#664d03
        ">
          ⚠️ Não foi possível carregar
          as informações da live.
        </div>
      `);
    }
  };

  iniciar();

})();
