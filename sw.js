const CACHE='vanoli-db-v3';
const SHELL=['./','./index.html','./manifest.webmanifest'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL).catch(()=>{})).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);if(u.origin!==location.origin)return;
 const isDoc=r.mode==='navigate'||(r.headers.get('accept')||'').includes('text/html');
 if(isDoc){ // network-first: prende sempre l'ultima versione quando online, cache come fallback offline
  e.respondWith(fetch(r).then(resp=>{const copy=resp.clone();caches.open(CACHE).then(c=>c.put(r,copy)).catch(()=>{});return resp;}).catch(()=>caches.match(r).then(h=>h||caches.match('./index.html'))));
  return;}
 // altri file: cache-first
 e.respondWith(caches.match(r).then(hit=>hit||fetch(r).then(resp=>{const copy=resp.clone();caches.open(CACHE).then(c=>c.put(r,copy)).catch(()=>{});return resp;}).catch(()=>hit)));});
