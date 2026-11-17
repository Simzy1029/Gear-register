const C='gear-register-v3';
const LOCAL=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','apple-touch-icon.png'];
const CDN=['https://cdn.jsdelivr.net/npm/@zxing/library@0.20.0/umd/index.min.js','https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.js','https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.js','https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(async c=>{await c.addAll(LOCAL);await Promise.all(CDN.map(u=>c.add(u).catch(()=>{})))}).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  const same=new URL(r.url).origin===location.origin;
  const keep=res=>{if(res&&(res.ok||res.type==='opaque')){const cp=res.clone();caches.open(C).then(c=>c.put(r,cp))}return res};
  // own files: fresh copy when online, saved copy when not. Libraries and fonts: saved copy first.
  e.respondWith(same?fetch(r).then(keep).catch(()=>caches.match(r,{ignoreSearch:true}).then(m=>m||caches.match('index.html')))
                    :caches.match(r).then(m=>m||fetch(r).then(keep)));
});
