/* BeatMeter: kontakt til lyst, mørkt eller systemets tema. Valget gemmes i browseren. Siderne virker uden dette script. */
(function(){
  var KEY='beatmeter-theme',root=document.documentElement;
  var metas=[].slice.call(document.querySelectorAll('meta[name="theme-color"]'));
  metas.forEach(function(m){m.setAttribute('data-orig',m.getAttribute('content'))});
  var COL={light:'#F3F2EE',dark:'#151513'};
  function read(){try{var t=localStorage.getItem(KEY);return t==='light'||t==='dark'?t:'system'}catch(e){return 'system'}}
  function apply(t,fade){
    if(fade&&!(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)){
      root.classList.add('theme-switching');
      setTimeout(function(){root.classList.remove('theme-switching')},350);
    }
    if(t==='system')root.removeAttribute('data-theme');else root.setAttribute('data-theme',t);
    metas.forEach(function(m){m.setAttribute('content',t==='system'?m.getAttribute('data-orig'):COL[t])});
    [].forEach.call(document.querySelectorAll('.theme-toggle button'),function(b){
      b.setAttribute('aria-pressed',b.getAttribute('data-theme-set')===t?'true':'false');
    });
  }
  apply(read(),false);
  document.addEventListener('click',function(e){
    var b=e.target.closest&&e.target.closest('[data-theme-set]');
    if(!b)return;
    var t=b.getAttribute('data-theme-set');
    apply(t,true);
    try{if(t==='system')localStorage.removeItem(KEY);else localStorage.setItem(KEY,t)}catch(x){}
  });
  window.addEventListener('storage',function(e){if(e.key===KEY)apply(read(),false)});
})();
