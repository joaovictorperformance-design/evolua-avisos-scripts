(() => {
  if (window.EvoluaTracker) return;

  const registrar = async (recurso, arquivo) => {
    const dados = new FormData();

    dados.append("IdRecursoDownload", String(recurso));
    dados.append("IdRecursoDownloadArquivos", String(arquivo));

    const resposta = await axios.post(
      "/Marketing/AddRegistroRecursoDownloadMarketing",
      dados
    );

    if (resposta.data?.StatusCode !== 200) {
      throw new Error("O registro do evento não foi confirmado.");
    }
  };

  const executar = async botao => {
    if (botao.dataset.processando === "1") return;

    const recurso = botao.dataset.recurso;
    const arquivo = botao.dataset.arquivo;
    const destino = botao.dataset.destino;
    const textoOriginal = botao.innerText;

    if (!recurso || !arquivo || !destino) {
      console.error("EvoluaTracker: configuração incompleta.", {
        recurso,
        arquivo,
        destino
      });

      return;
    }

    botao.dataset.processando = "1";
    botao.innerText = botao.dataset.aguarde || "AGUARDE...";
    botao.style.pointerEvents = "none";

    try {
      await registrar(recurso, arquivo);

      if (botao.dataset.novaAba === "true") {
        window.open(destino, "_blank");
        botao.innerText = botao.dataset.sucesso || "ACESSO LIBERADO";
      } else {
        window.location.href = destino;
      }
    } catch (erro) {
      console.error("EvoluaTracker:", erro);

      botao.innerText =
        botao.dataset.erro || "TENTAR NOVAMENTE";

      botao.style.pointerEvents = "";
      botao.dataset.processando = "0";
    }
  };

  document.addEventListener("click", evento => {
    const botao = evento.target.closest("[data-evolua-tracker]");

    if (!botao) return;

    evento.preventDefault();
    executar(botao);
  });

  window.EvoluaTracker = {
    registrar,
    executar
  };

  console.log("EvoluaTracker carregado.");
})();
