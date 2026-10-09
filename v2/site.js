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
