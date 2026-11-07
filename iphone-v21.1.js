/* Universe Studio v21.1 — iPhone navigation; desktop handlers and data untouched. */
(function(){
 'use strict';
 const media=window.matchMedia('(max-width: 860px) and (pointer: coarse)');
 const root=document.documentElement;
 // Correct iOS standalone viewport metrics without affecting desktop.
 const viewport=document.querySelector('meta[name="viewport"]');
 if(viewport){let value=viewport.getAttribute('content')||'width=device-width, initial-scale=1';if(!/viewport-fit\s*=/.test(value))viewport.setAttribute('content',value+', viewport-fit=cover');}
 else {const meta=document.createElement('meta');meta.name='viewport';meta.content='width=device-width, initial-scale=1, viewport-fit=cover';document.head.append(meta);}
 let wired=false;
 function active(){return media.matches;}
 function setOpen(open){
  const shell=document.querySelector('.shell'),btn=document.getElementById('us-iphone-toggle');
  if(!shell||!btn)return;
  shell.classList.toggle('us-iphone-open',!!open);
  btn.setAttribute('aria-expanded',String(!!open));
  btn.setAttribute('aria-label',open?'Close booking menu':'Open booking menu');
  btn.innerHTML=(open?'×':'☰')+' <span class="us-iphone-toggle-label">'+(open?'Close menu':'All sections')+'</span>';
  document.body.classList.toggle('us-iphone-tray-open',!!open);
 }
 function mount(){
  if(!active())return;
  const sidebar=document.querySelector('.sidebar'),nav=document.getElementById('nav');
  if(!sidebar||!nav)return;
  let btn=document.getElementById('us-iphone-toggle');
  if(!btn){
   btn=document.createElement('button');btn.id='us-iphone-toggle';btn.className='ghost';btn.type='button';btn.setAttribute('aria-controls','nav');sidebar.prepend(btn);
  }
  // On iPhone the hamburger floats independently; the closed drawer occupies no width.
  if(btn.parentElement!==document.body)document.body.appendChild(btn);
  if(!wired){
   // Keep the content out of the keyboard/menu focus path while the tray is expanded.
   document.addEventListener('click',e=>{if(active()&&e.target.closest('.main')&&document.querySelector('.shell.us-iphone-open'))setOpen(false)});
   btn.addEventListener('click',()=>setOpen(!document.querySelector('.shell')?.classList.contains('us-iphone-open')));
   document.addEventListener('click',e=>{if(active()&&e.target.closest('.sidebar [data-view],.sidebar [data-us23="home"]'))setOpen(false)});
   document.addEventListener('keydown',e=>{if(e.key==='Escape')setOpen(false)});
   wired=true;
  }
  setOpen(false);
 }
 function update(){
  root.classList.toggle('us-iphone',active());
  if(active())mount();else {document.querySelector('.shell')?.classList.remove('us-iphone-open');document.body.classList.remove('us-iphone-tray-open');const btn=document.getElementById('us-iphone-toggle');const sidebar=document.querySelector('.sidebar');if(btn&&sidebar)sidebar.prepend(btn)}
 }
 update();
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',update,{once:true});
 media.addEventListener?.('change',update);
 const watch=new MutationObserver(()=>{if(active()&&!document.getElementById('us-iphone-toggle'))mount()});
 watch.observe(document.body,{childList:true,subtree:false});
})();

/* v21.3: Replace only the iPhone calendar presentation; keep original event nodes
   and their existing delegated data-action handlers. No Universe data writes. */
(function(){
 'use strict';
 const small=window.matchMedia('(max-width:860px) and (pointer:coarse)');
 const names=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
 let selected=0,scheduled=false;
 function formatDate(iso,options){
  const d=new Date(iso+'T12:00:00Z');
  return d.toLocaleDateString('en-GB',Object.assign({timeZone:'UTC'},options));
 }
 function applyWeek(cal){
  const days=Array.from(cal.children).filter(el=>el.classList.contains('day'));
  if(days.length!==28)return;
  selected=Math.max(0,Math.min(3,selected));
  days.forEach((day,index)=>{
   const show=Math.floor(index/7)===selected;
   day.classList.toggle('us-week-visible',show);
   if(show)day.removeAttribute('aria-hidden');else day.setAttribute('aria-hidden','true');
   if(!day.querySelector('.us-week-dayname')){
    const iso=day.getAttribute('data-day');
    if(iso){
     const heading=document.createElement('span');
     heading.className='us-week-dayname';
     const date=new Date(iso+'T12:00:00Z');
     heading.textContent=names[date.getUTCDay()]+' · '+formatDate(iso,{day:'numeric',month:'short'});
     const num=day.querySelector('.dnum');
     if(num){num.textContent='';num.append(heading);}
    }
   }
  });
  const bar=cal.parentElement?.querySelector('.us-mobile-weeks');
  bar?.querySelectorAll('.us-mobile-week-button').forEach((btn,index)=>{
   btn.setAttribute('aria-selected',String(index===selected));
   btn.tabIndex=index===selected?0:-1;
  });
 }
 function mountCalendar(){
  if(!small.matches)return;
  document.querySelectorAll('.cal-scroll > .calendar:not(.us-mobile-week-calendar)').forEach(cal=>{
   const days=Array.from(cal.children).filter(el=>el.classList.contains('day'));
   if(days.length!==28)return;
   cal.classList.add('us-mobile-week-calendar');
   const bar=document.createElement('div');
   bar.className='us-mobile-weeks';
   bar.setAttribute('role','tablist');
   bar.setAttribute('aria-label','Choose one of the four calendar weeks');
   const first=days[0].getAttribute('data-day');
   const current=new Date().toISOString().slice(0,10);
   if(first&&current>=first&&current<=days[27].getAttribute('data-day')){
    selected=days.findIndex(day=>day.getAttribute('data-day')===current);
    selected=Math.max(0,Math.floor(selected/7));
   }
   for(let i=0;i<4;i++){
    const btn=document.createElement('button');
    btn.type='button';
    btn.className='us-mobile-week-button';
    btn.setAttribute('role','tab');
    btn.innerHTML='<strong>Week '+(i+1)+'</strong><small></small>';
    const start=days[i*7]?.getAttribute('data-day');
    const end=days[i*7+6]?.getAttribute('data-day');
    if(start&&end)btn.querySelector('small').textContent=formatDate(start,{day:'numeric',month:'short'})+'–'+formatDate(end,{day:'numeric',month:'short'});
    btn.addEventListener('click',()=>{
     selected=i;applyWeek(cal);
     cal.scrollIntoView({block:'nearest',behavior:'auto'});
    });
    bar.append(btn);
   }
   cal.parentElement.insertBefore(bar,cal);
   applyWeek(cal);
  });
 }
 function queue(){if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;mountCalendar();});}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',queue,{once:true});else queue();
 const observer=new MutationObserver(mutations=>{
  if(!small.matches)return;
  if(mutations.some(m=>Array.from(m.addedNodes).some(n=>n.nodeType===1&&(n.matches?.('.calendar,.cal-scroll')||n.querySelector?.('.cal-scroll > .calendar')))))queue();
 });
 const boot=()=>{const main=document.querySelector('.main');if(main)observer.observe(main,{subtree:true,childList:true});queue()};
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
 small.addEventListener?.('change',queue);
})();


/* v21.4: Normalize navigation buttons added by older Universe Studio versions.
   v12 introduced Power Rankings and Championship Divisions without the
   .v10-nav-text wrapper; the mobile icon-only rail therefore hid their labels. */
(function(){
 'use strict';
 const media=window.matchMedia('(max-width:860px) and (pointer:coarse)');
 function repairNav(){
  if(!media.matches)return;
  const nav=document.getElementById('nav');
  if(!nav)return;
  nav.querySelectorAll('button.navbtn').forEach(button=>{
   if(button.querySelector('.v10-nav-text'))return;
   const textNodes=Array.from(button.childNodes).filter(node=>node.nodeType===Node.TEXT_NODE && node.textContent.trim());
   if(!textNodes.length)return;
   const label=document.createElement('span');
   label.className='v10-nav-text';
   label.textContent=textNodes.map(node=>node.textContent.trim()).join(' ');
   textNodes[0].parentNode.insertBefore(label,textNodes[0]);
   textNodes.forEach(node=>node.remove());
  });
 }
 function boot(){
  repairNav();
  const nav=document.getElementById('nav');
  if(nav)new MutationObserver(repairNav).observe(nav,{childList:true,subtree:false});
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
 media.addEventListener?.('change',repairNav);
})();


/* v21.7 — Touch-first booking header and an accessible mobile Rivalries drawer.
   Reuses the original v19.4 tray and event handlers; no edits to saved data. */
(function(){
 'use strict';
 const mobile=window.matchMedia('(max-width:860px) and (pointer:coarse)');
 let pending=false;
 function mount(){
  if(!mobile.matches)return;
  const modal=document.getElementById('modalContent');
  if(!modal||!modal.isConnected)return;
  const head=modal.querySelector(':scope > .modalhead');
  if(!head)return;
  const row=head.querySelector('.buttonrow');
  const customise=head.querySelector('[data-v10="open-wizard"]');
  if(customise){
   if(row&&customise.parentElement!==row)row.prepend(customise);
   customise.classList.add('us-mobile-customise');
   customise.hidden=false;
   customise.setAttribute('aria-label','Customise match card');
  }
  const tray=modal.querySelector(':scope > .v192-tray.v194-docked');
  let trigger=head.querySelector('#us-mobile-rivalries');
  if(!tray){
   trigger?.remove();
   return;
  }
  if(!trigger){
   trigger=document.createElement('button');
   trigger.type='button';
   trigger.id='us-mobile-rivalries';
   trigger.className='us-mobile-rivalries-button';
   trigger.textContent='▤ Rivalries';
   trigger.setAttribute('aria-controls','us-mobile-rivalries-panel');
   (row||head).append(trigger);
   trigger.addEventListener('click',()=>{
    const t=document.querySelector('#modalContent > .v192-tray.v194-docked');
    t?.querySelector('[data-v194-tray-toggle]')?.click();
    requestAnimationFrame(update);
   });
  }
  tray.id='us-mobile-rivalries-panel';
  let close=tray.querySelector(':scope > .us-mobile-rivalries-close');
  if(!close){
   close=document.createElement('button');
   close.type='button';
   close.className='us-mobile-rivalries-close';
   close.textContent='✕  Close rivalries';
   close.addEventListener('click',()=>{
    const t=document.querySelector('#modalContent > .v192-tray.v194-docked');
    if(t&&!t.classList.contains('v192-tray-collapsed'))
     t.querySelector('[data-v194-tray-toggle]')?.click();
    requestAnimationFrame(update);
   });
   tray.prepend(close);
  }
  update();
 }
 function update(){
  const modal=document.getElementById('modalContent');
  const tray=modal?.querySelector(':scope > .v192-tray.v194-docked');
  const trigger=modal?.querySelector('#us-mobile-rivalries');
  if(!tray||!trigger)return;
  const open=!tray.classList.contains('v192-tray-collapsed');
  trigger.setAttribute('aria-expanded',String(open));
  trigger.textContent=open?'▤ Rivalries — open':'▤ Rivalries';
  tray.setAttribute('role','region');
  tray.setAttribute('aria-label','Rivalry plans');
 }
 function queue(){
  if(pending)return;pending=true;
  requestAnimationFrame(()=>{pending=false;mount();});
 }
 const obs=new MutationObserver(mutations=>{
  if(!mobile.matches)return;
  if(mutations.some(m=>m.type==='childList'&&
    Array.from(m.addedNodes).some(n=>n.nodeType===1&&
      !n.matches?.('.us-mobile-rivalries-button,.us-mobile-rivalries-close')&&
      !n.closest?.('#us-mobile-rivalries-panel') )))queue();
 });
 const boot=()=>{
  const back=document.getElementById('modalBack');
  if(back)obs.observe(back,{childList:true,subtree:true});
  document.addEventListener('click',e=>{
   if(mobile.matches&&e.target.closest('[data-v194-tray-toggle]'))
    requestAnimationFrame(update);
  });
  queue();
 };
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
 mobile.addEventListener?.('change',queue);
})();
