"use strict";
(() => {
  const RELEASE = window.ANIMUS_RELEASE_IDENTITY || {};
  const STORE = "acbf-companion-m3";
  const PIN_KEY = "animus-dev-pin-v1";
  const LOG_KEY = "animus-dev-logs-v2";
  const SESSION_MS = 30 * 60 * 1000;
  const MAX_LOGS = 150;
  const $ = id => document.getElementById(id);
  let taps = 0, tapTimer = 0, unlocked = false, expiresAt = 0, inactivityTimer = 0;
  let lastInteraction = null;

  const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
  const bytes = value => new Blob([value]).size;
  const formatBytes = n => n < 1024 ? `${n} B` : n < 1048576 ? `${(n/1024).toFixed(1)} KB` : `${(n/1048576).toFixed(2)} MB`;
  const formatMs = n => Number.isFinite(n) ? `${Math.round(n)} ms` : "Unavailable";
  const download = (name, value) => { const blob = new Blob([typeof value === "string" ? value : JSON.stringify(value,null,2)], {type:"application/json"}); const a=document.createElement("a"); a.href=URL.createObjectURL(blob); a.download=name; a.click(); setTimeout(()=>URL.revokeObjectURL(a.href),1000); };
  const getLogs = () => { try { return JSON.parse(localStorage.getItem(LOG_KEY)||"[]"); } catch { return []; } };
  const setLogs = logs => { try { localStorage.setItem(LOG_KEY, JSON.stringify(logs.slice(-MAX_LOGS))); } catch {} };
  const serializeReason = reason => ({message:String(reason?.message||reason||"Unknown"),name:reason?.name||null,stack:reason?.stack||null});
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
      localStorage.setItem(PIN_KEY,JSON.stringify(await pinRecord(first))); log("security","Developer PIN created");
    } else { const pin=prompt("Enter the local Developer Console PIN."); if(pin===null)return; if(!(await verifyPin(pin))){ log("security","Developer unlock rejected"); alert("Incorrect PIN."); return; } }
    unlock();
  }
  function unlock(){ unlocked=true; expiresAt=Date.now()+SESSION_MS; $("devPanel").hidden=false; resetInactivity(); renderAll(); $("devPanel").scrollIntoView({behavior:"smooth",block:"start"}); log("security","Developer Console unlocked"); }
  function lock(message="Developer Console locked."){ unlocked=false; expiresAt=0; clearTimeout(inactivityTimer); if($("devPanel"))$("devPanel").hidden=true; disableMaintenance(); if(message) alert(message); }
  function resetInactivity(){ if(!unlocked)return; expiresAt=Date.now()+SESSION_MS; clearTimeout(inactivityTimer); inactivityTimer=setTimeout(()=>lock("Developer Console locked after 30 minutes of inactivity."),SESSION_MS); renderSession(); }
  function renderSession(){ const el=$("devSessionStatus"); if(!el)return; const mins=Math.max(0,Math.ceil((expiresAt-Date.now())/60000)); el.innerHTML=`<strong>Local session active</strong><br>Read-only by default · locks after ${mins} minute${mins===1?"":"s"} of inactivity.`; }
  async function storageEstimate(){ try { return await navigator.storage?.estimate?.() || {}; } catch { return {}; } }
  async function cacheInfo(){ if(!("caches" in window))return []; const names=await caches.keys(); return Promise.all(names.map(async name=>({name,entries:(await caches.open(name).then(c=>c.keys())).length,current:name===RELEASE.serviceWorkerCache,animus:/^(?:acbf-|black-flag-resynced)/.test(name)}))); }
  function moduleHealth(){
    const checks=[
      ["Release identity",!!window.ANIMUS_RELEASE_IDENTITY,RELEASE.version||"Missing"],
      ["Database",Array.isArray(window.ACBF_LOCATIONS)&&(window.ACBF_LOCATIONS.length>0),`${(window.ACBF_LOCATIONS||[]).length} records`],
      ["Map engine",!!window.AnimusMapEngine||typeof window.mapEngine!=="undefined","Loaded when map initializes"],
      ["Main application",!!$("appShell")||!!$("mapPanel"),"Application DOM present"],
      ["Integrity verifier",!!window.ANIMUS_INTEGRITY_RESULT,window.ANIMUS_INTEGRITY_RESULT?.status||"Pending"],
      ["Developer Console",!!$("devPanel"),"Loaded"],
      ["Onboarding",!!$("onboarding"),$("onboarding")?"Available":"Missing"],
      ["Service worker",!!navigator.serviceWorker?.controller,navigator.serviceWorker?.controller?"Controlling":"Not controlling"],
      ["Web Crypto",!!crypto?.subtle,crypto?.subtle?"Available":"Unavailable"],
      ["Local storage",(()=>{try{localStorage.getItem(STORE);return true}catch{return false}})(),"Accessible"]
    ];
    return checks.map(([name,pass,detail])=>({name,pass,detail}));
  }
  function performanceSnapshot(){
    const nav=performance.getEntriesByType?.("navigation")?.[0];
    const paints=Object.fromEntries((performance.getEntriesByType?.("paint")||[]).map(e=>[e.name,e.startTime]));
    const resources=performance.getEntriesByType?.("resource")||[];
    const scripts=resources.filter(r=>r.initiatorType==="script");
    const styles=resources.filter(r=>r.initiatorType==="link"&&/\.css(?:\?|$)/.test(r.name));
    const slow=resources.filter(r=>r.duration>250).sort((a,b)=>b.duration-a.duration).slice(0,10).map(r=>({asset:r.name.split("/").pop(),duration:Math.round(r.duration),type:r.initiatorType,transferSize:r.transferSize||0}));
    return {capturedAt:new Date().toISOString(),navigation:{domInteractive:nav?.domInteractive,domContentLoaded:nav?.domContentLoadedEventEnd,loadComplete:nav?.loadEventEnd,responseEnd:nav?.responseEnd},paint:{firstPaint:paints["first-paint"],firstContentfulPaint:paints["first-contentful-paint"]},resources:{total:resources.length,scripts:scripts.length,styles:styles.length,slow},memory:performance.memory?{usedJSHeapSize:performance.memory.usedJSHeapSize,totalJSHeapSize:performance.memory.totalJSHeapSize,jsHeapSizeLimit:performance.memory.jsHeapSizeLimit}:null,startupErrors:window.__ANIMUS_STARTUP_ERRORS||[]};
  }
  async function renderSystem(){
    const cachesInfo=await cacheInfo(); const values={"App version":RELEASE.version||"Unknown","Build ID":RELEASE.buildId||"Unknown","Database version":window.ACBF_DATABASE_VERSION??RELEASE.databaseVersion??"Unknown","Records":(window.ACBF_LOCATIONS||[]).length,"Integrity":window.ANIMUS_INTEGRITY_RESULT?.status||$("releaseStatusText")?.textContent||"Pending","Service worker":navigator.serviceWorker?.controller?"Controlling":"Not controlling","Current cache":RELEASE.serviceWorkerCache||"Unknown","Caches":cachesInfo.length,"Connection":navigator.onLine?"Online":"Offline","Viewport":`${innerWidth} × ${innerHeight} @ ${devicePixelRatio||1}x`};
    $("devSystemStats").innerHTML=Object.entries(values).map(([k,v])=>`<div><strong>${escapeHtml(v)}</strong><span>${escapeHtml(k)}</span></div>`).join("");
    $("devCacheSummary").innerHTML=`<h3>Cache inventory</h3><table><thead><tr><th>Cache</th><th>Entries</th><th>Status</th></tr></thead><tbody>${cachesInfo.map(c=>`<tr><td>${escapeHtml(c.name)}</td><td>${c.entries}</td><td class="${c.current?'developer-result-pass':c.animus?'developer-result-warn':''}">${c.current?'CURRENT':c.animus?'OBSOLETE ANIMUS':'OTHER'}</td></tr>`).join("")}</tbody></table>`;
  }
  function renderHealth(){
    const health=moduleHealth();
    $("devModuleHealth").innerHTML=`<table><thead><tr><th>Module</th><th>Status</th><th>Detail</th></tr></thead><tbody>${health.map(x=>`<tr><td>${escapeHtml(x.name)}</td><td class="${x.pass?'developer-result-pass':'developer-result-fail'}">${x.pass?'PASS':'CHECK'}</td><td>${escapeHtml(x.detail)}</td></tr>`).join("")}</tbody></table>`;
    const perf=performanceSnapshot(); const events=[
      ["Response received",perf.navigation.responseEnd], ["DOM interactive",perf.navigation.domInteractive], ["DOMContentLoaded",perf.navigation.domContentLoaded], ["First paint",perf.paint.firstPaint], ["First contentful paint",perf.paint.firstContentfulPaint], ["Window load",perf.navigation.loadComplete]
    ].filter(x=>Number.isFinite(x[1])).sort((a,b)=>a[1]-b[1]);
    const startupErrors=perf.startupErrors||[];
    $("devStartupTimeline").innerHTML=`<table><thead><tr><th>Milestone</th><th>Time</th></tr></thead><tbody>${events.map(([n,t])=>`<tr><td>${escapeHtml(n)}</td><td>${formatMs(t)}</td></tr>`).join("")}</tbody></table>${startupErrors.length?`<h3>Startup guard events</h3><pre>${escapeHtml(JSON.stringify(startupErrors,null,2))}</pre>`:'<p class="developer-result-pass">No startup-guard errors recorded in this page session.</p>'}`;
  }
  function renderPerformance(){
    const p=performanceSnapshot(); const values={"DOM interactive":formatMs(p.navigation.domInteractive),"DOMContentLoaded":formatMs(p.navigation.domContentLoaded),"Window load":formatMs(p.navigation.loadComplete),"First contentful paint":formatMs(p.paint.firstContentfulPaint),"Resources":p.resources.total,"Slow resources":p.resources.slow.length};
    $("devPerformanceStats").innerHTML=Object.entries(values).map(([k,v])=>`<div><strong>${escapeHtml(v)}</strong><span>${escapeHtml(k)}</span></div>`).join("");
    $("devPerformanceDetails").innerHTML=p.resources.slow.length?`<h3>Resources slower than 250 ms</h3><table><thead><tr><th>Asset</th><th>Type</th><th>Duration</th><th>Transfer</th></tr></thead><tbody>${p.resources.slow.map(r=>`<tr><td>${escapeHtml(r.asset)}</td><td>${escapeHtml(r.type)}</td><td>${r.duration} ms</td><td>${formatBytes(r.transferSize)}</td></tr>`).join("")}</tbody></table>`:'<p class="developer-result-pass">No resource exceeded 250 ms in this page session.</p>';
  }
  function validateDatabase(){ const records=window.ACBF_LOCATIONS||[]; const ids=new Map(),issues=[]; const required=["id","name","region"]; records.forEach((r,i)=>{required.forEach(k=>{if(r[k]===undefined||r[k]===null||String(r[k]).trim()==="")issues.push({level:"fail",record:r.id||`#${i+1}`,issue:`Missing ${k}`});});if(!String(r.category||r.type||"").trim())issues.push({level:"fail",record:r.id||`#${i+1}`,issue:"Missing category/type"});if(r.id)ids.set(r.id,(ids.get(r.id)||0)+1);const x=Number(r.mapPosition?.x??r.x),y=Number(r.mapPosition?.y??r.y);if(!Number.isFinite(x)||!Number.isFinite(y))issues.push({level:"fail",record:r.id||`#${i+1}`,issue:"Invalid map coordinates"});if(r.gameCoordinates!==undefined&&!/^\s*-?\d+(?:\.\d+)?\s*,\s*-?\d+(?:\.\d+)?\s*$/.test(String(r.gameCoordinates)))issues.push({level:"warn",record:r.id,issue:"Unrecognized gameCoordinates format"});});ids.forEach((count,id)=>{if(count>1)issues.push({level:"fail",record:id,issue:`Duplicate ID (${count})`});});const categories=new Set(records.map(r=>r.category||r.type).filter(Boolean)),regions=new Set(records.map(r=>r.region).filter(Boolean));$("devDatabaseSummary").innerHTML=[["Records",records.length],["Unique IDs",ids.size],["Categories",categories.size],["Regions",regions.size],["Issues",issues.length]].map(([k,v])=>`<div><strong>${v}</strong><span>${k}</span></div>`).join("");$("devValidationResults").innerHTML=issues.length?`<table><thead><tr><th>Level</th><th>Record</th><th>Issue</th></tr></thead><tbody>${issues.map(x=>`<tr><td class="developer-result-${x.level}">${x.level.toUpperCase()}</td><td>${escapeHtml(x.record)}</td><td>${escapeHtml(x.issue)}</td></tr>`).join("")}</tbody></table>`:`<p class="developer-result-pass"><strong>Validation passed.</strong> No duplicate IDs, missing required fields, or invalid map coordinates were detected.</p>`;log("validation","Database validation completed",{records:records.length,issues:issues.length});return issues; }
  async function renderStorage(){ const entries=Object.keys(localStorage).sort().map(key=>({key,size:bytes(localStorage.getItem(key)||"")})); const total=entries.reduce((a,b)=>a+b.size,0),estimate=await storageEstimate(); $("devStorageSummary").innerHTML=[["Local keys",entries.length],["Local data",formatBytes(total)],["Browser usage",formatBytes(estimate.usage||0)],["Browser quota",formatBytes(estimate.quota||0)]].map(([k,v])=>`<div><strong>${v}</strong><span>${k}</span></div>`).join(""); $("devStorageKeys").innerHTML=`<table><thead><tr><th>Storage key</th><th>Approx. size</th></tr></thead><tbody>${entries.map(x=>`<tr><td>${escapeHtml(x.key)}</td><td>${formatBytes(x.size)}</td></tr>`).join("")}</tbody></table>`; }
  function renderLogs(){ const logs=getLogs().slice().reverse(); $("devRuntimeLogs").innerHTML=logs.length?`<table><thead><tr><th>Time</th><th>Type</th><th>Message</th><th>Detail</th></tr></thead><tbody>${logs.map(x=>`<tr><td>${escapeHtml(x.time)}</td><td>${escapeHtml(x.type)}</td><td>${escapeHtml(x.message)}</td><td><pre>${escapeHtml(x.detail?JSON.stringify(x.detail,null,2):"")}</pre></td></tr>`).join("")}</tbody></table>`:"<p>No local diagnostic logs.</p>"; }
  async function diagnostics(){ const estimate=await storageEstimate(); return {generatedAt:new Date().toISOString(),format:"animus-diagnostics-v2",release:RELEASE,url:location.href,userAgent:navigator.userAgent,viewport:{width:innerWidth,height:innerHeight,dpr:devicePixelRatio||1},online:navigator.onLine,document:{readyState:document.readyState,visibilityState:document.visibilityState},integrity:window.ANIMUS_INTEGRITY_RESULT||null,modules:moduleHealth(),performance:performanceSnapshot(),serviceWorker:{supported:"serviceWorker" in navigator,controller:!!navigator.serviceWorker?.controller,scriptURL:navigator.serviceWorker?.controller?.scriptURL||null,state:navigator.serviceWorker?.controller?.state||null},caches:await cacheInfo(),storage:{estimate,keys:Object.keys(localStorage).length,appDataPresent:!!localStorage.getItem(STORE)},database:{version:window.ACBF_DATABASE_VERSION,records:(window.ACBF_LOCATIONS||[]).length,issues:validateDatabase().length},logs:getLogs()}; }
  async function renderAll(){ renderSession(); await Promise.all([renderSystem(),renderStorage()]); renderHealth(); renderPerformance(); validateDatabase(); renderLogs(); }
  function setTab(name){ document.querySelectorAll("[data-dev-tab]").forEach(b=>b.classList.toggle("active",b.dataset.devTab===name)); document.querySelectorAll("[data-dev-page]").forEach(p=>p.hidden=p.dataset.devPage!==name); if(name==="health")renderHealth(); if(name==="performance")renderPerformance(); resetInactivity(); }
  function disableMaintenance(){ const toggle=$("devMaintenanceEnabled"); if(toggle)toggle.checked=false; document.querySelectorAll("#devMaintenanceTools button,#devClearAppData").forEach(b=>b.disabled=true); }
  async function enableMaintenance(checked){ if(!checked){disableMaintenance();return;} const pin=prompt("Re-enter the Developer Console PIN to enable maintenance actions."); if(pin===null||!(await verifyPin(pin))){ $("devMaintenanceEnabled").checked=false; alert("Maintenance actions remain disabled."); return;} document.querySelectorAll("#devMaintenanceTools button,#devClearAppData").forEach(b=>b.disabled=false); resetInactivity(); log("security","Maintenance actions enabled"); }
  async function clearObsoleteCaches(){ if(!("caches" in window)){alert("Cache Storage is unavailable.");return;} const current=RELEASE.serviceWorkerCache; const names=await caches.keys(); const obsolete=names.filter(n=>/^(?:acbf-|black-flag-resynced)/.test(n)&&n!==current); if(!obsolete.length){alert("No obsolete Animus caches were found.");return;} if(!confirm(`Remove ${obsolete.length} obsolete Animus cache${obsolete.length===1?"":"s"}? The current ${current} cache will be preserved.`))return; const removed=[]; for(const n of obsolete){if(await caches.delete(n))removed.push(n);} alert(`Removed ${removed.length} obsolete Animus cache${removed.length===1?"":"s"}.`); log("maintenance","Obsolete caches cleared",{preserved:current,removed}); await renderAll(); }
  async function updateServiceWorker(){ const reg=await navigator.serviceWorker?.getRegistration?.(); if(!reg){alert("No service-worker registration was found.");return;} await reg.update(); alert(reg.waiting?"An update is waiting. Close and reopen the app to activate it.":"Service-worker update check completed."); log("maintenance","Service-worker update check completed",{waiting:!!reg.waiting}); }
  function exportBackup(){ const raw=localStorage.getItem(STORE); if(!raw){alert("No application save data is stored on this device.");return;} let parsed; try{parsed=JSON.parse(raw);}catch{parsed={raw};} download(`animus-safety-backup-${new Date().toISOString().slice(0,10)}.json`,{format:"animus-developer-safety-backup",createdAt:new Date().toISOString(),release:RELEASE,data:parsed}); log("maintenance","Safety backup exported"); }
  async function exportHealth(){ download(`animus-health-${Date.now()}.json`,await diagnostics()); log("maintenance","Health snapshot exported"); }
  function clearAppData(){ const phrase=prompt('This permanently clears local progress, notes, routes, corrections, and settings on this device. Type RESET LOCAL DATA to continue.'); if(phrase!=="RESET LOCAL DATA"){alert("Reset cancelled.");return;} if(!confirm("Final confirmation: clear all Animus Companion local app data on this device?"))return; localStorage.removeItem(STORE); log("maintenance","Local app data cleared"); alert("Local app data cleared. The application will reload."); location.reload(); }
  function bind(){
    const version=$("versionButton"); if(version)version.addEventListener("click",e=>{e.stopImmediatePropagation();clearTimeout(tapTimer);taps++;tapTimer=setTimeout(()=>taps=0,4000);if(taps>=7){taps=0;requestAccess();}},true);
    $("devExit")?.addEventListener("click",()=>lock("")); document.querySelectorAll("[data-dev-tab]").forEach(b=>b.addEventListener("click",()=>setTab(b.dataset.devTab)));
    $("devValidateDatabase")?.addEventListener("click",validateDatabase); $("devExportDiagnostics")?.addEventListener("click",async()=>download(`animus-diagnostics-${Date.now()}.json`,await diagnostics())); $("devClearLogs")?.addEventListener("click",()=>{setLogs([]);renderLogs();}); $("devRefreshPerformance")?.addEventListener("click",renderPerformance);
    $("devMaintenanceEnabled")?.addEventListener("change",e=>enableMaintenance(e.target.checked)); $("devExportBackup")?.addEventListener("click",exportBackup); $("devRefreshIntegrity")?.addEventListener("click",()=>location.reload()); $("devUpdateServiceWorker")?.addEventListener("click",updateServiceWorker); $("devClearObsoleteCaches")?.addEventListener("click",clearObsoleteCaches); $("devCopyHealthSnapshot")?.addEventListener("click",exportHealth); $("devClearAppData")?.addEventListener("click",clearAppData);
    $("devPanel")?.addEventListener("pointerdown",resetInactivity,{passive:true}); $("devPanel")?.addEventListener("keydown",resetInactivity);
  }
  window.addEventListener("error",e=>{
    const message=String(e.message||e.error?.message||"Script error.");
    const opaque=message==="Script error."&&!e.filename&&!e.lineno&&!e.colno&&!e.error;
    const benign=/ResizeObserver loop (?:limit exceeded|completed with undelivered notifications)/i.test(message);
    log(opaque?"browser-opaque-error":benign?"browser-observer-warning":"error",message,{source:e.filename||null,line:e.lineno||null,column:e.colno||null,error:serializeReason(e.error),interaction:lastInteraction,actionable:!(opaque||benign)});
  });

  document.addEventListener("pointerup",e=>{
    const target=e.target?.closest?.("button,a,[role=button],input,select,textarea");
    if(!target)return;
    lastInteraction={time:new Date().toISOString(),tag:target.tagName,id:target.id||null,text:String(target.getAttribute("aria-label")||target.textContent||"").trim().slice(0,80)};
  },true);
  window.addEventListener("unhandledrejection",e=>log("unhandledrejection",e.reason?.message||String(e.reason||"Unknown rejection"),serializeReason(e.reason)));
  window.addEventListener("securitypolicyviolation",e=>log("csp","Content Security Policy violation",{blockedURI:e.blockedURI,violatedDirective:e.violatedDirective,sourceFile:e.sourceFile,line:e.lineNumber,column:e.columnNumber}));
  window.addEventListener("animus:integrity-complete",e=>{window.ANIMUS_INTEGRITY_RESULT=e.detail;if(unlocked){renderSystem();renderHealth();}});
  window.addEventListener("online",()=>log("network","Connection restored")); window.addEventListener("offline",()=>log("network","Connection lost"));
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",bind,{once:true}); else bind();
})();
