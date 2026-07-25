"use strict";
(() => {
  const state = window.ANIMUS_INTEGRITY = {status:"Integrity Not Verified",checkedAt:null,verified:0,modified:[],missing:[],errors:[]};
  const hex = buffer => [...new Uint8Array(buffer)].map(v=>v.toString(16).padStart(2,"0")).join("");
  async function verify() {
    if (!window.crypto?.subtle) { state.errors.push("Web Crypto unavailable"); finish(); return; }
    try {
      const manifestResponse=await fetch("./integrity-manifest.json",{cache:"no-store"});
      if(!manifestResponse.ok) throw new Error(`Manifest unavailable (${manifestResponse.status})`);
      const manifest=await manifestResponse.json();
      for(const entry of manifest.files){
        try{
          const response=await fetch(`./${entry.path}?integrity=${encodeURIComponent(manifest.buildId)}`,{cache:"reload"});
          if(!response.ok){state.missing.push(entry.path);continue;}
          const digest=hex(await crypto.subtle.digest("SHA-256",await response.arrayBuffer()));
          if(digest!==entry.sha256)state.modified.push(entry.path);else state.verified++;
        }catch(error){state.errors.push(`${entry.path}: ${error.message}`);}
      }
      state.checkedAt=new Date().toISOString();
      state.status=state.missing.length||state.modified.length?"Integrity Check Failed":state.errors.length?"Integrity Not Verified":"Official Release";
    } catch(error) { state.errors.push(error.message); state.status="Integrity Not Verified"; }
    finish();
  }
  function finish(){window.dispatchEvent(new CustomEvent("animus:integrity-complete",{detail:state}));}
  window.addEventListener("DOMContentLoaded",()=>setTimeout(verify,900),{once:true});
})();
