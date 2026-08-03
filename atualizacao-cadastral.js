document.addEventListener("click",async e=>{
 const b=e.target.closest("#atualizarCadastro");
 if(!b)return;
 e.preventDefault();
 b.innerText="AGUARDE...";
 b.disabled=true;
 const f=new FormData;
 f.append("IdRecursoDownload","110");
 f.append("IdRecursoDownloadArquivos","125");
 try{
  const r=await axios.post("/Marketing/AddRegistroRecursoDownloadMarketing",f);
  if(r.data?.StatusCode!=200)throw 0;
  location.href="https://linktr.ee/perf0rmance";
 }catch{
  b.innerText="TENTAR NOVAMENTE";
  b.disabled=false;
 }
});
