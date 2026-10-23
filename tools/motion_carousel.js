
(function(){
'use strict';
const root=document.querySelector('.reel-hero');
if(!root)return;
const canvas=document.getElementById('mykaMotionCanvas');
const video=document.getElementById('mykaMotionVideo');
const poster=document.getElementById('mykaMotionPoster');
const ctx=canvas.getContext('2d',{alpha:false,desynchronized:true});
if(!ctx)return;
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
let width=0,height=0,dpr=1,scroll=matchMedia('(max-width: 820px)').matches?-153:-196,velocity=0,drag=false,lastX=0,lastMove=0,lastFrame=0,visible=true;
let first=true;
const clock=!reduced.matches&&document.documentElement.animate?
  document.documentElement.animate([{opacity:1},{opacity:1}],{duration:1e9,iterations:Infinity}):null;
const labels=['Vestido floral','Vestido negro elegante','Vestido rosa','Vestido azul','Vestido vino','Pestañas clásicas','Pestañas híbridas','Volumen ruso','Lifting de pestañas','Diseño de pestañas'];
function size(){
 const box=canvas.getBoundingClientRect();dpr=Math.min(devicePixelRatio||1,1.6);
 width=Math.max(1,box.width);height=Math.max(1,box.height);
 canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);
}
const ro=new ResizeObserver(size);ro.observe(canvas);size();
function quad(xL,xR,ytL,ytR,ybL,ybR,r){
 ctx.beginPath();
 ctx.moveTo(xL+r,ytL);
 ctx.lineTo(xR-r,ytR);ctx.quadraticCurveTo(xR,ytR,xR,ytR+r);
 ctx.lineTo(xR,ybR-r);ctx.quadraticCurveTo(xR,ybR,xR-r,ybR);
 ctx.lineTo(xL+r,ybL);ctx.quadraticCurveTo(xL,ybL,xL,ybL-r);
 ctx.lineTo(xL,ytL+r);ctx.quadraticCurveTo(xL,ytL,xL+r,ytL);ctx.closePath();
}
function paint(){
 const mobile=matchMedia('(max-width: 820px)').matches;
 const W=mobile?640:1440,H=mobile?430:450;
 ctx.setTransform(canvas.width/W,0,0,canvas.height/H,0,0);
 ctx.clearRect(0,0,W,H);ctx.fillStyle='#f8f0e8';ctx.fillRect(0,0,W,H);
 const cx=W/2, pitch=mobile?153:196, cycle=pitch*10;
 const source=!reduced.matches&&video.readyState>=2&&video.videoWidth>0?video:poster.complete&&poster.naturalWidth>0?poster:null;
 const count=10;
 for(let i=0;i<count;i++){
   const t=((i*pitch-scroll%cycle+cycle*3)%cycle)-cycle/2;
   const outward=1+.083*Math.pow(t/(mobile?325:706),2);
   const x=cx+t*outward;
   const d=Math.abs(x-cx)/(mobile?310:706);
   const cardW=mobile?171+25*d*d:170+48*d*d;
   const xL=x-cardW/2,xR=x+cardW/2;
   if(xR<0||xL>W)continue;
   const qL=Math.abs(xL-cx)/(mobile?310:706),qR=Math.abs(xR-cx)/(mobile?310:706);
   const hL=mobile?310+38*Math.pow(qL,2.6):280+92*Math.pow(qL,2.6);
   const hR=mobile?310+38*Math.pow(qR,2.6):280+92*Math.pow(qR,2.6);
   const cy=(mobile?223:214)-12*d*d;
   const ytL=cy-hL/2,ytR=cy-hR/2,ybL=cy+hL/2,ybR=cy+hR/2;
   ctx.save();quad(xL,xR,ytL,ytR,ybL,ybR,mobile?18:15);ctx.clip();
   const top=Math.min(ytL,ytR),bottom=Math.max(ybL,ybR);
   if(source){
      try{ctx.drawImage(source,(i%5)*384,Math.floor(i/5)*540,384,540,xL,top,cardW,bottom-top)}
      catch(_){ctx.fillStyle='#dbb5a7';ctx.fillRect(xL,top,cardW,bottom-top)}
   }else{ctx.fillStyle='#dbc6b8';ctx.fillRect(xL,top,cardW,bottom-top)}
   const grad=ctx.createLinearGradient(0,cy,0,bottom);grad.addColorStop(0,'#30201600');grad.addColorStop(1,'#2c1a1655');ctx.fillStyle=grad;ctx.fillRect(xL,cy,cardW,bottom-cy);
   ctx.restore();
   const iconX=xL+24,iconY=ybL-27;
   if(iconY>0&&iconY<H&&iconX>0&&iconX<W){
      ctx.beginPath();ctx.arc(iconX,iconY,mobile?14:16,0,Math.PI*2);ctx.fillStyle='#fffaf9cc';ctx.fill();
      ctx.beginPath();ctx.moveTo(iconX-3,iconY-6);ctx.lineTo(iconX+6,iconY);ctx.lineTo(iconX-3,iconY+6);ctx.closePath();ctx.fillStyle='#8b6a5b';ctx.fill();
   }
 }
}
function tick(now){
 const curr=clock&&clock.currentTime!=null?Number(clock.currentTime):now;
 const dt=lastFrame?Math.min(.065,Math.max(0,(curr-lastFrame)/1000)):0;
 lastFrame=curr;
 if(!reduced.matches&&visible){
    if(!drag){scroll+=50*dt+velocity*dt;velocity*=Math.pow(.05,dt);if(Math.abs(velocity)<1)velocity=0;}
 }
 paint();
 requestAnimationFrame(tick);
}
requestAnimationFrame(tick);
function pos(e){const rect=canvas.getBoundingClientRect();return(e.clientX-rect.left)/(rect.width/(matchMedia('(max-width: 820px)').matches?640:1440))}
canvas.addEventListener('pointerdown',e=>{if(reduced.matches)return;drag=true;velocity=0;lastX=pos(e);lastMove=performance.now();canvas.classList.add('dragging');canvas.setPointerCapture(e.pointerId)});
canvas.addEventListener('pointermove',e=>{if(!drag)return;const x=pos(e),now=performance.now(),delta=x-lastX,dt=Math.max(.008,(now-lastMove)/1000);scroll-=delta;velocity=Math.max(-950,Math.min(950,-delta/dt));lastMove=now;lastX=x});
function release(e){if(!drag)return;drag=false;canvas.classList.remove('dragging');try{canvas.releasePointerCapture(e.pointerId)}catch(_){}}
canvas.addEventListener('pointerup',release);canvas.addEventListener('pointercancel',release);canvas.addEventListener('lostpointercapture',()=>{drag=false;canvas.classList.remove('dragging')});
canvas.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();scroll+=e.key==='ArrowRight'?130:-130;paint()}});
poster.addEventListener('load',paint);
video.addEventListener('loadeddata',paint);
const observe=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible&&!reduced.matches){video.play().catch(()=>{})}else{video.pause()}},{threshold:.02});
observe.observe(root);
function handleMotion(){if(reduced.matches){video.pause();velocity=0;scroll=0;if(clock)clock.pause()}else{if(clock)clock.play();if(visible)video.play().catch(()=>{})}paint()}
reduced.addEventListener?.('change',handleMotion);
if(!reduced.matches&&document.documentElement.animate){
  const entrance=[
    ['.reel-studio-mark',[[{opacity:0,transform:'translate(-50%,-19px)'},{opacity:1,transform:'translate(-50%,0)'}],{duration:550,delay:70}]],
    ['.reel-badge',[[{opacity:0,transform:'translate(-50%,-9px) scale(.9)'},{opacity:1,transform:'translate(-50%,0) scale(1)'}],{duration:540,delay:180}]],
    ['.reel-headline',[[{opacity:0,filter:'blur(10px)',transform:'translateY(24px)'},{opacity:1,filter:'blur(0)',transform:'translateY(0)'}],{duration:790,delay:270}]],
    ['.reel-subline',[[{opacity:0,transform:'translate(-50%,14px)'},{opacity:1,transform:'translate(-50%,0)'}],{duration:570,delay:590}]],
    ['.reel-carousel',[[{opacity:0,transform:'translateY(52px)'},{opacity:1,transform:'translateY(0)'}],{duration:780,delay:750}]],
    ['.reel-actions',[[{opacity:0,transform:'translateX(-50%) scale(.85)'},{opacity:1,transform:'translateX(-50%) scale(1)'}],{duration:550,delay:950}]],
    ['.reel-handnote',[[{opacity:0},{opacity:1}],{duration:560,delay:1220}]]
  ];
  for(const [sel,[keyframes,opts]] of entrance){for(const el of root.querySelectorAll(sel))el.animate(keyframes,{...opts,fill:'both',easing:'cubic-bezier(.22,1,.36,1)'})}
  for(const p of root.querySelectorAll('.reel-stroke path'))p.animate([{strokeDashoffset:460},{strokeDashoffset:0}],{duration:1200,delay:1260,fill:'forwards',easing:'ease-in-out'});
}
})();
