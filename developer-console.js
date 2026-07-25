"use strict";
(() => {
  const RELEASE = window.ANIMUS_RELEASE_IDENTITY || {};
  const STORE = "acbf-companion-m3";
  const PIN_KEY = "animus-dev-pin-v1";
  const LOG_KEY = "animus-dev-logs-v1";
  const SESSION_MS = 30 * 60 * 1000;
  const MAX_LOGS = 100;
  const $ = id => document.getElementById(id);
  let taps = 0, tapTimer = 0, unlocked = false, expiresAt = 0, inactivityTimer = 0;

  const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
  const bytes = value => new Blob([value]).size;
  const formatBytes = n => n < 1024 ? `${n} B` : n < 1048576 ? `${(n/1024).toFixed(1)} KB` : `${(n/1048576).toFixed(2)} MB`;
  const download = (name, value) => { const blob = new Blob([typeof value === "string" ? value : JSON.stringify(value,null,2)], {type:"application/json"}); const a=document.createElement("a"); a.href=URL.createObjectURL(blob); a.download=name; a.click(); setTimeout(()=>URL.revokeObjectURL(a.href),1000); };
  const getLogs = () => { try { return JSON.parse(localStorage.getItem(LOG_KEY)||"[]"); } catch { return []; } };
  const setLogs = logs => { try { localStorage.setItem(LOG_KEY, JSON.stringify(logs.slice(-MAX_LOGS))); } catch {} };
  const log = (type,message,detail=null) => { const logs=getLogs(); logs.push({time:new Date().toISOString(),type,message,detail}); setLogs(logs); if(unlocked) renderLogs(); };
  async function digest(text){ const data=new TextEncoder().encode(text); const hash=await crypto.subtle.digest("SHA-256",data); return [...new Uint8Array(hash)].map(b=>b.toString(16).padStart(2,"0")).join(""); }
  function randomSalt(){ const v=new Uint8Array(16); crypto.getRandomValues(v); return [...v].map(b=>b.toString(16).padStart(2,"0")).join(""); }
  async function pinRecord(pin,salt=randomSalt()){ return {salt,hash:await digest(`${salt}:${pin}`),createdAt:new Date().toISOString()}; }
  async function verifyPin(pin){ try { const saved=JSON.parse(localStorage.getItem(PIN_KEY)||"null"); return !!saved && (await digest(`${saved.salt}:${pin}`))===saved.hash; } catch { return false; } }
  async function requestAccess(){
    if(!crypto?.subtle){ alert("Developer Console requires Web Crypto, which is unavailable in this browser context."); return; }
    const existing=localStorage.getItem(PIN_KEY);
    if(!existing){
      const first=prompt("Create a local Developer Console PIN (minimum 6 characters). This PIN protects only this device; it is not remote security."); if(first===null)return;
      if(first.length<6){ alert("PIN must contain at least 6 characters."); return; }
      const second=prompt("Confirm the new Developer Console PIN."); if(second!==first){ alert("PINs did not match."); return; }
      localStorage.setItem(PIN_KEY,JSON.stringify(await pinRecord(first)));
      log("security","Developer PIN created");
    } else {
      const pin=prompt("Enter the local Developer Console PIN."); if(pin===null)return;
      if(!(await verifyPin(pin))){ log("security","Developer unlock rejected"); alert("Incorrect PIN."); return; }
    }
    unlock();
  }
  function unlock(){ unlocked=true; expiresAt=Date.now()+SESSION_MS; $("devPanel").hidden=false; resetInactivity(); renderAll(); $("devPanel").scrollIntoView({behavior:"smooth",block:"start"}); log("security","Developer Console unlocked"); }
  function lock(message="Developer Console locked."){ unlocked=false; expiresAt=0; clearTimeout(inactivityTimer); if($("devPanel"))$("devPanel").hidden=true; disableMaintenance(); if(message) alert(message); }
  function resetInactivity(){ if(!unlocked)return; expiresAt=Date.now()+SESSION_MS; clearTimeout(inactivityTimer); inactivityTimer=setTimeout(()=>lock("Developer Console locked after 30 minutes of inactivity."),SESSION_MS); renderSession(); }
  function renderSession(){ const el=$("devSessionStatus"); if(!el)return; const mins=Math.max(0,Math.ceil((expiresAt-Date.now())/60000)); el.innerHTML=`<strong>Local session active</strong><br>Read-only by default · locks after ${mins} minute${mins===1?"":"s"} of inactivity.`; }
  function appData(){ try { return JSON.parse(localStorage.getItem(STORE)||"null"); } catch { return null; } }
  async function storageEstimate(){ try { return await navigator.storage?.estimate?.() || {}; } catch { return {}; } }
  async function cacheInfo(){ if(!("caches" in window))return []; const names=await caches.keys(); return Promise.all(names.map(async name=>({name,entries:(await caches.open(name).then(c=>c.keys())).length,current:name===RELEASE.serviceWorkerCache}))); }
  async function renderSystem(){ const sw=navigator.serviceWorker?.controller; const cachesInfo=await cacheInfo(); const values={"App version":RELEASE.version||"Unknown","Build ID":RELEASE.buildId||"Unknown","Database version":window.ACBF_DATABASE_VERSION??RELEASE.databaseVersion??"Unknown","Records":(window.ACBF_LOCATIONS||[]).length,"Integrity":window.ANIMUS_INTEGRITY_RESULT?.status||$("releaseStatusText")?.textContent||"Pending","Service worker":sw?"Controlling":"Not controlling","Current cache":RELEASE.serviceWorkerCache||"Unknown","Caches":cachesInfo.length,"Connection":navigator.onLine?"Online":"Offline","Viewport":`${innerWidth} × ${innerHeight} @ ${devicePixelRatio||1}x`}; $("devSystemStats").innerHTML=Object.entries(values).map(([k,v])=>`<div><strong>${escapeHtml(v)}</strong><span>${escapeHtml(k)}</span></div>`).join(""); }
  function validateDatabase(){ const records=window.ACBF_LOCATIONS||[]; const ids=new Map(), issues=[]; const required=["id","name","region"];
    records.forEach((r,i)=>{ required.forEach(k=>{if(r[k]===undefined||r[k]===null||String(r[k]).trim()==="")issues.push({level:"fail",record:r.id||`#${i+1}`,issue:`Missing ${k}`});}); if(!String(r.category||r.type||"").trim())issues.push({level:"fail",record:r.id||`#${i+1}`,issue:"Missing category/type"}); if(r.id)ids.set(r.id,(ids.get(r.id)||0)+1); const x=Number(r.mapPosition?.x ?? r.x),y=Number(r.mapPosition?.y ?? r.y); if(!Number.isFinite(x)||!Number.isFinite(y))issues.push({level:"fail",record:r.id||`#${i+1}`,issue:"Invalid map coordinates"}); if(r.gameCoordinates!==undefined&&!/^\s*-?\d+(?:\.\d+)?\s*,\s*-?\d+(?:\.\d+)?\s*$/.test(String(r.gameCoordinates)))issues.push({level:"warn",record:r.id,issue:"Unrecognized gameCoordinates format"}); });
    ids.forEach((count,id)=>{if(count>1)issues.push({level:"fail",record:id,issue:`Duplicate ID (${count})`});});
    const categories=new Set(records.map(r=>r.category||r.type).filter(Boolean)); const regions=new Set(records.map(r=>r.region).filter(Boolean));
    $("devDatabaseSummary").innerHTML=[["Records",records.length],["Unique IDs",ids.size],["Categories",categories.size],["Regions",regions.size],["Issues",issues.length]].map(([k,v])=>`<div><strong>${v}</strong><span>${k}</span></div>`).join("");
    $("devValidationResults").innerHTML=issues.length?`<table><thead><tr><th>Level</th><th>Record</th><th>Issue</th></tr></thead><tbody>${issues.map(x=>`<tr><td class="developer-result-${x.level}">${x.level.toUpperCase()}</td><td>${escapeHtml(x.record)}</td><td>${escapeHtml(x.issue)}</td></tr>`).join("")}</tbody></table>`:`<p class="developer-result-pass"><strong>Validation passed.</strong> No duplicate IDs, missing required fields, or invalid map coordinates were detected.</p>`;
    log("validation","Database validation completed",{records:records.length,issues:issues.length}); return issues;
  }
  async function renderStorage(){ const entries=Object.keys(localStorage).sort().map(key=>({key,size:bytes(localStorage.getItem(key)||"")})); const total=entries.reduce((a,b)=>a+b.size,0),estimate=await storageEstimate(); $("devStorageSummary").innerHTML=[["Local keys",entries.length],["Local data",formatBytes(total)],["Browser usage",formatBytes(estimate.usage||0)],["Browser quota",formatBytes(estimate.quota||0)]].map(([k,v])=>`<div><strong>${v}</strong><span>${k}</span></div>`).join(""); $("devStorageKeys").innerHTML=`<table><thead><tr><th>Storage key</th><th>Approx. size</th></tr></thead><tbody>${entries.map(x=>`<tr><td>${escapeHtml(x.key)}</td><td>${formatBytes(x.size)}</td></tr>`).join("")}</tbody></table>`; }
  function renderLogs(){ const logs=getLogs().slice().reverse(); $("devRuntimeLogs").innerHTML=logs.length?`<table><thead><tr><th>Time</th><th>Type</th><th>Message</th></tr></thead><tbody>${logs.map(x=>`<tr><td>${escapeHtml(x.time)}</td><td>${escapeHtml(x.type)}</td><td>${escapeHtml(x.message)}</td></tr>`).join("")}</tbody></table>`:"<p>No local diagnostic logs.</p>"; }
  async function diagnostics(){ const estimate=await storageEstimate(); return {generatedAt:new Date().toISOString(),release:RELEASE,url:location.href,userAgent:navigator.userAgent,viewport:{width:innerWidth,height:innerHeight,dpr:devicePixelRatio||1},online:navigator.onLine,integrity:window.ANIMUS_INTEGRITY_RESULT||null,serviceWorker:{supported:"serviceWorker" in navigator,controller:!!navigator.serviceWorker?.controller},caches:await cacheInfo(),storage:{estimate,keys:Object.keys(localStorage).length,appDataPresent:!!localStorage.getItem(STORE)},database:{version:window.ACBF_DATABASE_VERSION,records:(window.ACBF_LOCATIONS||[]).length},logs:getLogs()}; }
  async function renderAll(){ renderSession(); await Promise.all([renderSystem(),renderStorage()]); validateDatabase(); renderLogs(); }
  function setTab(name){ document.querySelectorAll("[data-dev-tab]").forEach(b=>b.classList.toggle("active",b.dataset.devTab===name)); document.querySelectorAll("[data-dev-page]").forEach(p=>p.hidden=p.dataset.devPage!==name); resetInactivity(); }
  function disableMaintenance(){ const toggle=$("devMaintenanceEnabled"); if(toggle)toggle.checked=false; document.querySelectorAll("#devMaintenanceTools button,#devClearAppData").forEach(b=>b.disabled=true); }
  async function enableMaintenance(checked){ if(!checked){disableMaintenance();return;} const pin=prompt("Re-enter the Developer Console PIN to enable maintenance actions."); if(pin===null||!(await verifyPin(pin))){ $("devMaintenanceEnabled").checked=false; alert("Maintenance actions remain disabled."); return;} document.querySelectorAll("#devMaintenanceTools button,#devClearAppData").forEach(b=>b.disabled=false); resetInactivity(); log("security","Maintenance actions enabled"); }
  async function clearObsoleteCaches(){ const current=RELEASE.serviceWorkerCache; const names=await caches.keys(); const obsolete=names.filter(n=>n.startsWith("acbf-")&&n!==current); await Promise.all(obsolete.map(n=>caches.delete(n))); alert(`Removed ${obsolete.length} obsolete Animus cache${obsolete.length===1?"":"s"}.`); log("maintenance","Obsolete caches cleared",{removed:obsolete}); renderAll(); }
  async function updateServiceWorker(){ const reg=await navigator.serviceWorker?.getRegistration?.(); if(!reg){alert("No service-worker registration was found.");return;} await reg.update(); alert(reg.waiting?"An update is waiting. Close and reopen the app to activate it.":"Service-worker update check completed."); log("maintenance","Service-worker update check completed",{waiting:!!reg.waiting}); }
  function exportBackup(){ const raw=localStorage.getItem(STORE); if(!raw){alert("No application save data is stored on this device.");return;} let parsed; try{parsed=JSON.parse(raw);}catch{parsed={raw};} download(`animus-safety-backup-${new Date().toISOString().slice(0,10)}.json`,{format:"animus-developer-safety-backup",createdAt:new Date().toISOString(),release:RELEASE,data:parsed}); log("maintenance","Safety backup exported"); }
  function clearAppData(){ const phrase=prompt('This permanently clears local progress, notes, routes, corrections, and settings on this device. Type RESET LOCAL DATA to continue.'); if(phrase!=="RESET LOCAL DATA"){alert("Reset cancelled.");return;} if(!confirm("Final confirmation: clear all Animus Companion local app data on this device?"))return; localStorage.removeItem(STORE); log("maintenance","Local app data cleared"); alert("Local app data cleared. The application will reload."); location.reload(); }
  function bind(){
    const version=$("versionButton"); if(version)version.addEventListener("click",e=>{e.stopImmediatePropagation(); clearTimeout(tapTimer); taps++; tapTimer=setTimeout(()=>taps=0,4000); if(taps>=7){taps=0;requestAccess();}},true);
    $("devExit")?.addEventListener("click",()=>lock("")); document.querySelectorAll("[data-dev-tab]").forEach(b=>b.addEventListener("click",()=>setTab(b.dataset.devTab)));
    $("devValidateDatabase")?.addEventListener("click",validateDatabase); $("devExportDiagnostics")?.addEventListener("click",async()=>download(`animus-diagnostics-${Date.now()}.json`,await diagnostics())); $("devClearLogs")?.addEventListener("click",()=>{setLogs([]);renderLogs();});
    $("devMaintenanceEnabled")?.addEventListener("change",e=>enableMaintenance(e.target.checked)); $("devExportBackup")?.addEventListener("click",exportBackup); $("devRefreshIntegrity")?.addEventListener("click",()=>location.reload()); $("devUpdateServiceWorker")?.addEventListener("click",updateServiceWorker); $("devClearObsoleteCaches")?.addEventListener("click",clearObsoleteCaches); $("devClearAppData")?.addEventListener("click",clearAppData);
    $("devPanel")?.addEventListener("pointerdown",resetInactivity,{passive:true}); $("devPanel")?.addEventListener("keydown",resetInactivity);
  }
  window.addEventListener("error",e=>log("error",e.message,{source:e.filename,line:e.lineno,column:e.colno})); window.addEventListener("unhandledrejection",e=>log("unhandledrejection",String(e.reason?.message||e.reason||"Unknown rejection")));
  window.addEventListener("animus:integrity-complete",e=>{window.ANIMUS_INTEGRITY_RESULT=e.detail; if(unlocked)renderSystem();});
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",bind,{once:true}); else bind();
})();
