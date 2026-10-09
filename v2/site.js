/* BeatMeter v2, papir-siderne: bevægelse, indgang ved scroll og sektionsnavigation. Siderne virker uden dette script. */
(function(){
  var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasIO='IntersectionObserver' in window;

  // Bevægelse slås kun til, når den ikke er fravalgt, og kører kun mens elementet er i syne.
  document.querySelectorAll('[data-live]').forEach(function(el){
    if(reduce)return;
    el.classList.add('live');
    if(!hasIO){el.classList.add('run');return}
    new IntersectionObserver(function(es){
      es.forEach(function(e){el.classList.toggle('run',e.isIntersecting)});
    },{threshold:.15}).observe(el);
  });


  // Indgang ved scroll: elementer med .reveal glider ind én gang. [data-stagger] forsinker børnene let efter hinanden.
  document.querySelectorAll('[data-stagger]').forEach(function(p){
    Array.prototype.forEach.call(p.children,function(c,i){c.classList.add('reveal');c.style.setProperty('--i',i)});
  });
  var rv=document.querySelectorAll('.reveal');
  if(rv.length){
    if(reduce||!hasIO){rv.forEach(function(el){el.classList.add('in')})}
    else{
      var io=new IntersectionObserver(function(es){
        es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}});
      },{threshold:.12,rootMargin:'0px 0px -6% 0px'});
      rv.forEach(function(el){io.observe(el)});
    }
  }


  // Overskrifter: del i ord, så hvert ord kan glide op bag en maske.
  document.querySelectorAll('[data-split]').forEach(function(h){
    var n=0;
    (function walk(node){
      Array.prototype.slice.call(node.childNodes).forEach(function(c){
        if(c.nodeType===3){
          var frag=document.createDocumentFragment();
          c.textContent.split(/(\s+)/).forEach(function(t){
            if(!t)return;
            if(/^\s+$/.test(t)){frag.appendChild(document.createTextNode(' '));return}
            var w=document.createElement('span');w.className='w';
            var i=document.createElement('span');i.textContent=t;i.style.setProperty('--i',n++);
            w.appendChild(i);frag.appendChild(w);
          });
          node.replaceChild(frag,c);
        }else if(c.nodeType===1)walk(c);
      });
    })(h);
    if(reduce||!hasIO){h.classList.add('in')}
    else{
      var so=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');so.unobserve(e.target)}})},{threshold:.2});
      so.observe(h);
    }
  });

  // Let parallax: telefonen i forsiden synker langsomt ned i sin ramme, når man ruller.
  var ph=document.querySelector('.hero-card .phone');
  if(ph&&!reduce){
    var pq=false;
    function par(){pq=false;ph.style.setProperty('--py',(innerWidth>900?Math.min(window.scrollY,700)*.09:0).toFixed(1)+'px')}
    window.addEventListener('scroll',function(){if(!pq){pq=true;requestAnimationFrame(par)}},{passive:true});
  }


  // Layout 1 / 2 (vejledningssiden og forsiden). Valget huskes og deles mellem siderne. Elementerne glider til deres nye plads (FLIP).
  var lts=document.querySelectorAll('.layout-toggle'),grid=document.querySelector('.cols3[data-layout],main[data-layout]');
  if(lts.length&&grid){
    var KEY='beatmeter-layout',btns=Array.prototype.slice.call(document.querySelectorAll('.layout-toggle button'));
    var MOVE='.list>a,.rows>a,.hero-top,.hero h1,.hero .lead,.hero .ctas,.hero .fine,.hero-shot,.strip .it,.flow li,.steps .step,.trio .mod,.rail .sec-head,.rail .headrow,.how .intro,.numbers';
    function setLayout(n,animate){
      var items=animate&&!reduce?Array.prototype.slice.call(document.querySelectorAll(MOVE)):[];
      var before=items.map(function(e){return e.getBoundingClientRect()});
      grid.setAttribute('data-layout',n);
      btns.forEach(function(b){b.setAttribute('aria-pressed',b.getAttribute('data-layout')===n?'true':'false')});
      items.forEach(function(e,i){
        var a=before[i],b=e.getBoundingClientRect(),dx=a.left-b.left,dy=a.top-b.top;
        if(!dx&&!dy||!e.animate||!b.width)return;
        e.animate([{transform:'translate('+dx+'px,'+dy+'px)',opacity:.4},{transform:'none',opacity:1}],{duration:600,easing:'cubic-bezier(.2,.7,.2,1)',delay:Math.min(i,12)*25,fill:'backwards'});
      });
    }
    var saved=null;try{saved=localStorage.getItem(KEY)}catch(e){}
    if(saved==='2')setLayout('2',false);else setLayout('1',false);
    btns.forEach(function(b){b.addEventListener('click',function(){
      var n=b.getAttribute('data-layout');
      if(grid.getAttribute('data-layout')===n)return;
      setLayout(n,true);try{localStorage.setItem(KEY,n)}catch(e){}
    })});
  }

  // Aktivt punkt i en liste af #-links (sektionsbjælken og "I denne guide").
  function spy(links,onChange){
    links=Array.prototype.slice.call(links);
    var items=links.map(function(a){return{a:a,t:document.getElementById(a.getAttribute('href').slice(1))}}).filter(function(x){return x.t});
    if(!items.length)return null;
    var cur=null;
    function offset(){
      var top=document.querySelector('.top'),sub=document.querySelector('.subnav.on');
      return (top?top.offsetHeight:0)+(sub?sub.offsetHeight:0)+24;
    }
    return function(){
      var o=offset(),hit=null;
      items.forEach(function(x){if(x.t.getBoundingClientRect().top<=o)hit=x});
      if(hit===cur)return;
      cur=hit;
      items.forEach(function(x){if(x===hit)x.a.setAttribute('aria-current','true');else x.a.removeAttribute('aria-current')});
      if(onChange)onChange(hit);
    };
  }

  var subnav=document.querySelector('.subnav');
  var fns=[];
  if(subnav){
    var f=spy(subnav.querySelectorAll('a[href^="#"]'),function(hit){
      if(!hit)return;
      var w=subnav.querySelector('.wrap');
      w.scrollLeft=hit.a.offsetLeft-(w.clientWidth-hit.a.offsetWidth)/2;
    });
    if(f)fns.push(f);
    var hero=document.querySelector('.hero');
    fns.push(function(){
      var past=hero?hero.getBoundingClientRect().bottom<0:window.scrollY>300;
      subnav.classList.toggle('on',past);
    });
  }
  var g=spy(document.querySelectorAll('.aside .box a[href^="#"]'));
  if(g)fns.push(g);

  if(fns.length){
    var queued=false;
    function run(){queued=false;fns.forEach(function(fn){fn()})}
    function queue(){if(!queued){queued=true;requestAnimationFrame(run)}}
    window.addEventListener('scroll',queue,{passive:true});
    window.addEventListener('resize',queue);
    run();
  }
})();
