/* Universe Studio v21.1 — iPhone navigation; desktop handlers and data untouched. */
(function(){
 'use strict';
 const media=window.matchMedia('(max-width: 860px) and (pointer: coarse)');
 const root=document.documentElement;
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
  if(!wired){
   btn.addEventListener('click',()=>setOpen(!document.querySelector('.shell')?.classList.contains('us-iphone-open')));
   document.addEventListener('click',e=>{if(active()&&e.target.closest('.sidebar [data-view],.sidebar [data-us23="home"]'))setOpen(false)});
   document.addEventListener('keydown',e=>{if(e.key==='Escape')setOpen(false)});
   wired=true;
  }
  setOpen(false);
 }
 function update(){
  root.classList.toggle('us-iphone',active());
  if(active())mount();else document.querySelector('.shell')?.classList.remove('us-iphone-open');
 }
 update();
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',update,{once:true});
 media.addEventListener?.('change',update);
 const watch=new MutationObserver(()=>{if(active()&&!document.getElementById('us-iphone-toggle'))mount()});
 watch.observe(document.body,{childList:true,subtree:false});
})();