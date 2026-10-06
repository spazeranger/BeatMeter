/* BeatMeter: indholdsoversigt som rullemenu øverst og flydende knap under scroll (smalle skærme). */
(function(){
  var d=document.getElementById("jump"),links;
  if(!d){
    var prose=document.querySelector("article.prose");if(!prose)return;
    var src=[].slice.call(document.querySelectorAll('.aside .box a[href^="#"]'));
    var title=(document.querySelector(".aside .box .ah")||{}).textContent||"På denne side";
    if(!src.length){src=[].slice.call(prose.querySelectorAll("h2[id]")).map(function(h){var a=document.createElement("a");a.href="#"+h.id;a.textContent=h.textContent;return a;});}
    if(src.length<3)return;
    d=document.createElement("details");d.className="jump";d.id="jump";
    d.innerHTML='<summary><span><b></b><span class="jc"></span></span></summary><ul></ul>';
    d.querySelector("b").textContent=title;
    d.querySelector(".jc").textContent=src.length+" afsnit";
    var ul0=d.querySelector("ul");
    src.forEach(function(a){var li=document.createElement("li"),b=document.createElement("a");b.href=a.getAttribute("href");b.textContent=a.textContent;li.appendChild(b);ul0.appendChild(li);});
    var lead=prose.querySelector(".lead")||prose.querySelector("h1");
    lead.parentNode.insertBefore(d,lead.nextSibling);
  }
  links=[].slice.call(d.querySelectorAll("a"));
  var fab=document.createElement("div");fab.className="jump-fab";
  fab.innerHTML='<button type="button" aria-expanded="false" aria-controls="jumpPanel"><span class="lbl">Indhold</span></button><ul id="jumpPanel" hidden></ul>';
  var btn=fab.querySelector("button"),lbl=fab.querySelector(".lbl"),ul=fab.querySelector("ul");
  links.forEach(function(a){var li=document.createElement("li"),b=a.cloneNode(true);li.appendChild(b);ul.appendChild(li);});
  document.body.appendChild(fab);
  function setOpen(o){btn.setAttribute("aria-expanded",o?"true":"false");ul.hidden=!o;fab.classList.toggle("open",o);}
  btn.addEventListener("click",function(){setOpen(ul.hidden);});
  ul.addEventListener("click",function(e){if(e.target.closest("a"))setOpen(false);});
  d.addEventListener("click",function(e){if(e.target.closest("a"))d.open=false;});
  document.addEventListener("click",function(e){if(!fab.contains(e.target))setOpen(false);});
  document.addEventListener("keydown",function(e){if(e.key==="Escape"&&!ul.hidden){setOpen(false);btn.focus();}});
  var items=links.map(function(a){return{a:a,t:document.getElementById(a.getAttribute("href").slice(1)),n:a.firstChild.textContent}});
  var tick=false;
  function update(){
    tick=false;
    var show=d.querySelector("summary").getBoundingClientRect().bottom<0;
    fab.classList.toggle("on",show);
    if(!show){setOpen(false);return;}
    var cur=null,y=window.innerHeight*0.35;
    items.forEach(function(x){if(x.t&&x.t.getBoundingClientRect().top<=y)cur=x;});
    lbl.textContent=cur?cur.n:"Indhold";
    ul.querySelectorAll("a").forEach(function(a,i){if(items[i]===cur)a.setAttribute("aria-current","true");else a.removeAttribute("aria-current");});
  }
  function req(){if(!tick){tick=true;requestAnimationFrame(update);}}
  window.addEventListener("scroll",req,{passive:true});window.addEventListener("resize",req);update();
})();
