(async()=>{
 const C={
  form:"https://formockta.lovable.app/f/atualizacaoevolua",
  destaque:4724,
  recurso:111,
  arquivo:126,
  parametro:"cadastro"
 };

 const u=new URL(location.href);
 const concluido=u.searchParams.get(C.parametro)==="ok";

 if(concluido){
  try{
   const f=new FormData;
   f.append("IdRecursoDownload",C.recurso);
   f.append("IdRecursoDownloadArquivos",C.arquivo);

   await axios.post(
    "/Marketing/AddRegistroRecursoDownloadMarketing",
    f
   );

   await axios.post(
    "/Destaque/AddDestaqueVisualizacao",
    C.destaque,
    {headers:{"Content-Type":"application/json"}}
   );

   sessionStorage.removeItem("evoluaCadastroRedirecionado");

   u.searchParams.delete(C.parametro);
   history.replaceState(
    {},
    "",
    u.pathname+u.search+u.hash
   );

   document.querySelectorAll(
    ".modal,.modal-backdrop"
   ).forEach(e=>e.remove());

   document.body.classList.remove("modal-open");

   console.log("Atualização cadastral concluída.");
  }catch(e){
   console.error(
    "Erro ao finalizar atualização cadastral:",
    e
   );
  }

  return;
 }

 if(sessionStorage.getItem("evoluaCadastroRedirecionado")){
  return;
 }

 sessionStorage.setItem(
  "evoluaCadastroRedirecionado",
  "1"
 );

 const aviso=document.createElement("div");

 aviso.style.cssText=
  "position:fixed;inset:0;z-index:999999;background:#111827;"+
  "display:flex;align-items:center;justify-content:center;"+
  "font-family:Arial;text-align:center;color:#fff;padding:25px";

 aviso.innerHTML=
  '<div><div style="font-size:28px;font-weight:bold;color:#ffcc00">'+
  '⚠️ Atualização cadastral obrigatória</div>'+
  '<p style="font-size:18px;max-width:650px;line-height:1.5">'+
  'Você será direcionado para validar os dados da sua unidade.'+
  '</p><p>Aguarde...</p></div>';

 document.body.appendChild(aviso);

 setTimeout(()=>{
  location.href=C.form;
 },1800);
})();
