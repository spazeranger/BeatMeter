/* BeatMeter: animation af hvad appen måler. Tegnes i canvas, ingen billedfiler. */
(function(){
"use strict";
var cv=document.getElementById("anim");if(!cv)return;
var g=cv.getContext("2d"),W=800,H=500,T=27,dpr=1,M=false,FSK=1,L={};
var btn=document.getElementById("animBtn"),cap=document.getElementById("animCap");
var C={bg:"#0f1a30",navy:"#16284a",plate:"#c9ced6",bridge:"#dde1e7",edge:"#9aa3b3",brass:"#c9a24a",gold:"#d4b061",tock:"#8fb6ea",ink:"#e3e7ee",mute:"#95a1b7",ruby:"#b3261e",dial:"#f3f4f7",good:"#6cc58c"};
var WX=400,WY=240,R=150,BAL={x:66,y:-50,r:40},F=0.5,A=0.9; /* slowmotion: 0,5 svingning pr. sekund */
function size(){var w=cv.clientWidth||800;M=w<600;
  if(M){W=500;H=620;WX=250;WY=215;FSK=1.35;L={gx:30,gy:440,gw:440,sh:-95,px:292,py:110,ps:.95,slow:[W-150,24]};}
  else{W=800;H=500;WX=400;WY=240;FSK=1;L={gx:40,gy:340,gw:440,sh:-150,px:585,py:95,ps:1,slow:[W-140,28]};}
  cv.style.aspectRatio=W+"/"+H;dpr=Math.min(2,window.devicePixelRatio||1);cv.width=Math.round(w*dpr);cv.height=Math.round(w*H/W*dpr);}
function fs(n){return Math.round(n*FSK);}
function ease(x){x=Math.max(0,Math.min(1,x));return x<.5?2*x*x:1-Math.pow(-2*x+2,2)/2;}
function seg(t,a,b){return ease((t-a)/(b-a));}
function circ(x,y,r,fill,stroke,lw){g.beginPath();g.arc(x,y,r,0,Math.PI*2);if(fill){g.fillStyle=fill;g.fill();}if(stroke){g.strokeStyle=stroke;g.lineWidth=lw||1;g.stroke();}}
function gear(x,y,r,n,rot,col){g.save();g.translate(x,y);g.rotate(rot);g.beginPath();
  for(var i=0;i<n*2;i++){var a=i*Math.PI/n,rr=i%2?r:r*1.12;g.lineTo(Math.cos(a)*rr,Math.sin(a)*rr);}
  g.closePath();g.fillStyle=col;g.fill();g.strokeStyle="rgba(0,0,0,.25)";g.lineWidth=.8;g.stroke();
  circ(0,0,r*.55,"rgba(0,0,0,.12)");circ(0,0,Math.max(2,r*.12),C.ruby);g.restore();}
function theta(t){return A*Math.sin(2*Math.PI*F*t);}
function balance(t){var th=theta(t),b=BAL;
  /* spiralfjeder */
  g.save();g.translate(b.x,b.y);g.beginPath();
  for(var i=0;i<=160;i++){var k=i/160,a=k*Math.PI*2*6+th*(1-k)*1.6,rr=3+k*25;g.lineTo(Math.cos(a)*rr,Math.sin(a)*rr);}
  g.strokeStyle="#5d6678";g.lineWidth=.9;g.stroke();g.restore();
  /* uro */
  g.save();g.translate(b.x,b.y);g.rotate(th);
  g.beginPath();g.arc(0,0,b.r,0,Math.PI*2);g.arc(0,0,b.r-6,0,Math.PI*2,true);g.fillStyle=C.brass;g.fill();
  for(var j=0;j<3;j++){g.save();g.rotate(j*Math.PI*2/3);g.fillStyle=C.brass;g.fillRect(-2,0,4,b.r-5);g.restore();}
  for(var s=0;s<8;s++){var sa=s*Math.PI/4;circ(Math.cos(sa)*b.r,Math.sin(sa)*b.r,2.4,"#8a6f2a");}
  circ(0,0,4,C.ruby);g.fillStyle=C.ruby;g.fillRect(-1.5,b.r*.25,3,5);g.restore();}
function anchor(t){var th=theta(t),a=Math.tanh(th*6)*0.18;g.save();g.translate(40,-10);g.rotate(a-0.6);
  g.fillStyle="#aab0ba";g.fillRect(-2,-4,4,26);g.beginPath();g.moveTo(-16,-4);g.lineTo(16,-4);g.lineTo(12,2);g.lineTo(-12,2);g.closePath();g.fill();
  circ(-15,-3,2.2,C.ruby);circ(15,-3,2.2,C.ruby);circ(0,0,2,C.ruby);g.restore();}
function movement(t){circ(0,0,R*.93,C.plate,C.edge,2);
  g.fillStyle=C.bridge;g.strokeStyle=C.edge;g.lineWidth=1.2;
  g.beginPath();g.ellipse(-50,-30,62,52,-.4,0,Math.PI*2);g.fill();g.stroke();
  g.beginPath();g.ellipse(15,55,70,38,.3,0,Math.PI*2);g.fill();g.stroke();
  var r=t*.15;gear(-55,-35,44,40,r*.2,"#b9bfc8");circ(-55,-35,14,"#aab0ba");
  gear(0,0,26,30,-r,C.brass);gear(38,38,19,22,r*1.6,C.brass);gear(0,74,15,18,-r*2.4,C.brass);
  gear(40,12,13,15,Math.floor(t*F*2)*0.21,"#b9bfc8");anchor(t);
  g.fillStyle=C.bridge;g.beginPath();g.moveTo(10,-60);g.lineTo(120,-90);g.lineTo(125,-70);g.lineTo(30,-30);g.closePath();g.fill();g.stroke();
  balance(t);circ(BAL.x,BAL.y,2.5,C.ruby);}
function dial(t,off,al){if(al<=0)return;g.save();g.globalAlpha=al;g.translate(0,off);
  circ(0,0,R*.9,C.dial,"#c6ccd6",1);g.fillStyle="#14203a";
  for(var i=0;i<12;i++){g.save();g.rotate(i*Math.PI/6);g.fillRect(-2,-R*.82,4,i%3?12:18);g.restore();}
  var sec=Math.floor(t*8)/8,hand=function(a,len,w,col){g.save();g.rotate(a);g.fillStyle=col;g.fillRect(-w/2,-len,w,len+10);g.restore();};
  hand(1.1,R*.45,6,"#14203a");hand(4.2,R*.68,4,"#14203a");hand(sec*Math.PI/30,R*.75,1.6,C.ruby);circ(0,0,5,"#14203a");g.restore();}
function caseRing(al){g.save();g.globalAlpha=al;circ(0,0,R+10,null,"#aab0ba",12);
  g.fillStyle="#aab0ba";g.fillRect(R+14,-10,14,20);[[-1,-1],[1,-1],[-1,1],[1,1]].forEach(function(p){g.fillRect(p[0]*R*.55-12,p[1]*(R+6)-(p[1]<0?30:0),24,30);});g.restore();}
function phone(x,y,al,ts,t){g.save();g.globalAlpha=al;g.translate(x,y);
  g.fillStyle="#0b1426";rr(0,0,190,330,26);g.fill();g.fillStyle="#e4e7ec";rr(9,9,172,312,19);g.fill();
  g.fillStyle="#14203a";g.font="600 15px 'Barlow Condensed',sans-serif";g.fillText("BeatMeter",22,36);
  g.font="10px Barlow,sans-serif";g.fillStyle="#5d6678";g.fillText("Afvigelse pr. døgn",22,56);
  var shown=Math.min(1,ts/4);g.font="600 30px 'Barlow Condensed',sans-serif";g.fillStyle="#2d7a4b";g.fillText(ts>1.2?"+3,4":"...",22,86);
  g.font="10px Barlow,sans-serif";g.fillStyle="#5d6678";g.fillText("Beat error",112,56);g.font="600 18px 'Barlow Condensed',sans-serif";g.fillStyle="#14203a";g.fillText(ts>1.2?"0,3 ms":"...",112,82);
  g.fillStyle="#fbfbfc";rr(20,100,150,150,8);g.fill();g.strokeStyle="#c6ccd6";g.lineWidth=1;g.stroke();
  var n=Math.floor(ts*F*2*3);for(var i=0;i<Math.min(n,40);i++){var px=28+i*3.4,odd=i%2,py=175-i*.9+(odd?7:0);circ(px,py,2,odd?"#2d5aa0":"#94721f");}
  g.font="9px Barlow,sans-serif";g.fillStyle="#5d6678";g.fillText("Tik",24,266);g.fillText("Tak",60,266);circ(20,263,3,"#94721f");circ(56,263,3,"#2d5aa0");
  circ(95,318,3,"#0b1426");g.restore();}
function rr(x,y,w,h,r){g.beginPath();g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath();}
function graph(t,al){if(al<=0)return;var x0=L.gx,y0=L.gy,w=L.gw,h=120;g.save();g.globalAlpha=al;
  g.fillStyle="rgba(15,26,48,.9)";rr(x0-20,y0-24,w+40,h+44,14);g.fill();
  g.strokeStyle="#28406b";g.lineWidth=1;g.beginPath();g.moveTo(x0,y0+h/2);g.lineTo(x0+w,y0+h/2);g.stroke();
  g.fillStyle=C.mute;g.font=""+fs(11)+"px Barlow,sans-serif";g.fillText("Uroens udsving over tid",x0,y0-8);
  var span=4,t0=t-span;g.strokeStyle=C.gold;g.lineWidth=2;g.beginPath();
  for(var i=0;i<=200;i++){var tt=t0+span*i/200,y=y0+h/2-theta(tt)/A*(h/2-8);i?g.lineTo(x0+w*i/200,y):g.moveTo(x0,y);}g.stroke();
  var k0=Math.ceil(t0*2*F),last=[];for(var k=k0;k/(2*F)<=t;k++){var tk=k/(2*F),x=x0+w*(tk-t0)/span;last.push(x);
    g.strokeStyle=k%2?C.tock:C.gold;g.lineWidth=1.5;g.beginPath();g.moveTo(x,y0+6);g.lineTo(x,y0+h-6);g.stroke();
    g.fillStyle=k%2?C.tock:C.gold;g.font="600 "+fs(12)+"px Barlow,sans-serif";g.fillText(k%2?"tak":"tik",x+4,y0+h-8);}
  if(last.length>1){var a=last[last.length-2],b=last[last.length-1];g.strokeStyle=C.ink;g.lineWidth=1;g.beginPath();g.moveTo(a,y0+14);g.lineTo(b,y0+14);g.stroke();
    g.fillStyle=C.ink;g.font="600 "+fs(12)+"px Barlow,sans-serif";g.fillText("I virkeligheden 125 ms ved 28.800 slag i timen",Math.max(x0,Math.min(a+4,x0+w-g.measureText("I virkeligheden 125 ms ved 28.800 slag i timen").width-4)),y0+10);}
  var cx=x0+w,cy=y0+h/2-theta(t)/A*(h/2-8);circ(cx,cy,4,C.gold);g.restore();}
function ring(x,y,age,col){if(age<0||age>1.4)return;g.save();g.globalAlpha=Math.max(0,1-age/1.4)*.8;circ(x,y,10+age*90,null,col,2);g.restore();}
function caption(s){if(cap&&cap.textContent!==s)cap.textContent=s;}
var t0=null,paused=false,pauseAt=0,reduce=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;
function frame(now){if(!paused)requestAnimationFrame(frame);
  if(t0===null)t0=now;var t=((now-t0)/1000)%T;if(paused)t=pauseAt;draw(t);}
function draw(t){g.setTransform(dpr*cv.width/(W*dpr),0,0,dpr*cv.width/(W*dpr),0,0);g.fillStyle=C.bg;g.fillRect(0,0,W,H);
  var open=seg(t,3.5,7),zoom=seg(t,7.5,11)*(1-seg(t,17,19)*.45),shift=seg(t,17,19),fade=seg(t,25.5,27);
  var sc=1+zoom*2.6,cx=WX+shift*L.sh,cy=WY;
  g.save();g.translate(cx,cy);g.scale(sc,sc);g.translate(-BAL.x*zoom,-BAL.y*zoom);
  movement(t);dial(t,-open*R*2.4,1-open);caseRing(1-open);
  if(t>11&&t<17.5){var th=theta(t),al=Math.min(1,(t-11)/1)*Math.min(1,(17.5-t)/.5);g.save();g.globalAlpha=al;g.translate(BAL.x,BAL.y);
    g.strokeStyle=C.gold;g.lineWidth=1/sc*2;g.setLineDash([3/sc,3/sc]);g.beginPath();g.arc(0,0,BAL.r+10,-Math.PI/2-A,-Math.PI/2+A);g.stroke();g.setLineDash([]);
    g.beginPath();g.moveTo(0,0);g.lineTo(Math.cos(-Math.PI/2+th)*(BAL.r+14),Math.sin(-Math.PI/2+th)*(BAL.r+14));g.strokeStyle=C.ink;g.lineWidth=1.2/sc;g.stroke();g.restore();}
  g.restore();
  var bx=cx+(BAL.x-BAL.x*zoom)*sc,by=cy+(BAL.y-BAL.y*zoom)*sc;
  if(t>11&&t<25){for(var k=Math.ceil((t-1.4)*2*F);k/(2*F)<=t;k++){ring(bx,by,t-k/(2*F),k%2?C.tock:C.gold);}}
  graph(t,Math.min(1,Math.max(0,(t-11.5)/.8))*(1-seg(t,16.5,17.5)));
  var pa=seg(t,17.5,19);if(pa>0){g.save();g.translate(L.px,L.py);g.scale(L.ps,L.ps);phone(0,0,pa,Math.max(0,t-18.5),t);g.restore();}
  if(t>12&&t<17){g.fillStyle=C.mute;g.font=""+fs(12)+"px Barlow,sans-serif";g.fillText("Vist i slowmotion",L.slow[0],L.slow[1]);}
  if(fade>0){g.fillStyle="rgba(15,26,48,"+fade+")";g.fillRect(0,0,W,H);}
  caption(t<3.5?"Et mekanisk ur tikker mellem 5 og 10 gange i sekundet.":t<7.5?"Under skiven sidder værket.":t<11?"Uroen styrer tiden. Den svinger frem og tilbage.":t<17.5?"Hvert sving giver et tik. Tiden mellem tikkene afgør, om uret vinder eller taber.":"BeatMeter lytter med, tidsstempler hvert tik og regner afvigelsen ud.");}
function setBtn(){if(btn){btn.textContent=paused?"Afspil":"Pause";btn.setAttribute("aria-pressed",paused?"true":"false");}}
if(btn)btn.addEventListener("click",function(){if(paused){paused=false;t0=performance.now()-pauseAt*1000;requestAnimationFrame(frame);}else{paused=true;pauseAt=((performance.now()-t0)/1000)%T;}setBtn();});
size();window.addEventListener("resize",function(){size();if(paused)draw(pauseAt);});
if(reduce){paused=true;pauseAt=20;t0=performance.now();draw(pauseAt);}else requestAnimationFrame(frame);
setBtn();
if("IntersectionObserver" in window){new IntersectionObserver(function(e){if(reduce)return;var vis=e[0].isIntersecting;if(!vis&&!paused){paused=true;pauseAt=((performance.now()-t0)/1000)%T;cv.dataset.auto="1";}else if(vis&&paused&&cv.dataset.auto){cv.dataset.auto="";paused=false;t0=performance.now()-pauseAt*1000;requestAnimationFrame(frame);}setBtn();}).observe(cv);}
})();
