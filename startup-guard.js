"use strict";
(()=>{
  const dismiss=(failed=false)=>{
    const boot=document.getElementById("bootScreen");
    if(!boot)return;
    boot.classList.add("hide");
    setTimeout(()=>boot.remove(),500);
    if(failed){
      const notice=document.createElement("div");
      notice.className="startup-recovery-notice";
      notice.setAttribute("role","alert");
      notice.innerHTML="<strong>Animus Companion recovered from a startup error.</strong><span>Open Settings → Diagnostics for details, then refresh once. Your saved data remains on this device.</span><button type=\"button\">Dismiss</button>";
      notice.querySelector("button").addEventListener("click",()=>notice.remove());
      document.body.appendChild(notice);
    }
  };
  let ready=false,errorSeen=false;
  window.addEventListener("animus:app-ready",()=>{ready=true;setTimeout(()=>dismiss(false),250);},{once:true});
  window.addEventListener("error",()=>{errorSeen=true;},{capture:true});
  window.addEventListener("unhandledrejection",()=>{errorSeen=true;});
  window.addEventListener("DOMContentLoaded",()=>{setTimeout(()=>{if(!ready)dismiss(errorSeen);},7000);},{once:true});
})();
