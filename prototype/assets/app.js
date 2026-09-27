/* Pearls by Mangatrai — prototype JS (vanilla, no deps)
   Shared: header, nav drawer, cart drawer, product cards, toasts, reveal
   Page inits: home, collection, product, landing                      */
(function(){
  const P = window.PBM_PRODUCTS || [];
  const byHandle = Object.fromEntries(P.map(p=>[p.handle,p]));
  const inr = n => '₹' + Math.round(n).toLocaleString('en-IN');
  const savePct = p => Math.round((1 - p.price/p.compare)*100);
  const $ = (s,el=document)=>el.querySelector(s);
  const $$ = (s,el=document)=>[...el.querySelectorAll(s)];
  window.PBM = {P, byHandle, inr};

  /* ---------- icons ---------- */
  const I = {
    heart:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>',
    check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
    wa:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-1 1.2-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.5-.5.3-.5c.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.2-.3-.3-.6-.4zM12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2z"/></svg>'
  };
  window.PBM.I = I;
  const PAY=[['upi','UPI','svg'],['visa','Visa','svg'],['mastercard','Mastercard','svg'],['rupay','RuPay','png'],['cod','Cash on delivery','svg'],['simpl','Simpl Pay-in-3','png']];
  function payLogos(cls=''){ return `<div class="paylogos ${cls}">${PAY.map(([f,n,e])=>`<img class="paylogo pl-${f}" src="assets/pay/${f}.${e}" alt="${n}" title="${n}" loading="lazy" height="24">`).join('')}</div>`; }
  window.PBM.payLogos = payLogos;

  /* ---------- Cart (localStorage) ---------- */
  const cart = {
    key:'pbm_cart',
    get(){ try{ return JSON.parse(localStorage.getItem(this.key)||'[]'); }catch(e){ return []; } },
    set(v){ try{ localStorage.setItem(this.key, JSON.stringify(v)); }catch(e){} renderCart(); },
    add(handle, qty=1){ const c=this.get(); const i=c.find(x=>x.handle===handle); if(i) i.qty+=qty; else c.push({handle,qty}); this.set(c); },
    setQty(handle, qty){ let c=this.get(); const i=c.find(x=>x.handle===handle); if(!i) return; i.qty=qty; if(qty<=0) c=c.filter(x=>x.handle!==handle); this.set(c); },
    count(){ return this.get().reduce((a,b)=>a+b.qty,0); },
    total(){ return this.get().reduce((a,b)=>a+(byHandle[b.handle]?.price||0)*b.qty,0); }
  };
  window.PBM.cart = cart;
  const PROMOS={WELCOME5:5,PEARL10:10,PEARL15:15};
  function promo(){ const c=(localStorage.getItem('pbm_promo')||'').toUpperCase(); return PROMOS[c]?{code:c,pct:PROMOS[c]}:null; }
  window.PBM.PROMOS=PROMOS; window.PBM.promo=promo;
  const wish = {
    key:'pbm_wish',
    get(){ try{ return JSON.parse(localStorage.getItem(this.key)||'[]'); }catch(e){ return []; } },
    set(v){ try{ localStorage.setItem(this.key, JSON.stringify(v)); }catch(e){} renderWish(); },
    has(h){ return this.get().includes(h); },
    toggle(h){ const w=this.get(); const i=w.indexOf(h); if(i>-1) w.splice(i,1); else w.unshift(h); this.set(w); return i===-1; }
  };
  window.PBM.wish = wish;
  function renderWish(){ const n=wish.get().length; $$('#wishCount').forEach(e=>{ e.textContent=n; e.style.display=n?'flex':'none'; }); $$('[data-wish]').forEach(b=>b.classList.toggle('on', wish.has(b.dataset.wish))); }
  window.PBM.renderWish = renderWish;

  function toast(msg){ let t=$('.toast'); if(!t){ t=document.createElement('div'); t.className='toast'; document.body.appendChild(t);} t.textContent=msg; t.classList.add('on'); clearTimeout(t._h); t._h=setTimeout(()=>t.classList.remove('on'),2200); }
  window.PBM.toast = toast;

  /* ---------- Shared chrome ---------- */
  function headerHTML(){
    return `
    <div class="announce" id="announce">
      <span class="on"><b>FREE</b> shipping &amp; easy returns, PAN India</span>
      <span><b>120 YEARS</b> of trust · Est. 1905, Hyderabad</span>
      <span><b>COD · UPI · 0% EMI</b> available on every order</span>
      <span><b>FIRST ORDER?</b> Use code <u>WELCOME5</u> for 5% off</span>
    </div>
    <header class="header">
      <div class="container header-row">
        <div class="hdr-left">
          <button class="icon-btn menu" aria-label="Menu" data-open="#navDrawer"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button>
          <button class="icon-btn" aria-label="Search" id="searchToggle"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg></button>
        </div>
        <a class="logo" href="index.html" aria-label="Pearls by Mangatrai — home"><img class="logo-img" src="assets/logo-navy.png" alt="Pearls by Mangatrai" width="900" height="123"></a>
        <nav class="nav" aria-label="Primary">
          <a href="collection.html?cat=combos" class="hot">Combos</a>
          <a href="collection.html?cat=necklaces">Necklaces</a>
          <a href="collection.html?cat=earrings">Earrings</a>
          <a href="collection.html?cat=sets">Sets</a>
          <a href="collection.html?cat=bracelets">Bracelets</a>
          <a href="collection.html?cat=rings">Rings</a>
          <a href="collection.html?max=5000">Under ₹5,000</a>
          <a href="collection.html?tag=gift" class="opt">Gifting</a>
          <a href="about.html" class="opt">Our Story</a>
        </nav>
        <div class="hdr-right">
          <a class="icon-btn" href="wishlist.html" aria-label="Saved items"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg><span class="cart-count" id="wishCount">0</span></a>
          <a class="icon-btn" href="account.html" aria-label="Account"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg></a>
          <button class="icon-btn" aria-label="Cart" data-open="#cartDrawer"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 7h12l1 13H5L6 7z"/><path d="M9 10V6a3 3 0 0 1 6 0v4"/></svg><span class="cart-count" id="cartCount">0</span></button>
        </div>
      </div>
      <div class="search-bar" id="searchBar"><div class="container">
        <form onsubmit="event.preventDefault();location.href='collection.html?q='+encodeURIComponent(this.q.value)"><input name="q" placeholder="Search pearl necklaces, studs, gifts…" autocomplete="off"><button class="btn btn-primary btn-sm" type="submit">Search</button></form>
        <div class="search-chips"><a class="chip" href="collection.html?cat=sets">Necklace sets</a><a class="chip" href="collection.html?cat=earrings">Studs</a><a class="chip" href="collection.html?max=2000">Under ₹2,000</a><a class="chip" href="collection.html?tag=gift">Gifts for her</a><a class="chip" href="collection.html?cat=bracelets">Bracelets</a></div>
      </div></div>
    </header>
    <div class="drawer" id="navDrawer"><div class="scrim" data-close></div><div class="panel">
      <div class="panel-head"><span>Shop pearls</span><button class="icon-btn" data-close aria-label="Close">✕</button></div>
      <div class="mnav">
        <a href="collection.html?cat=combos" style="color:var(--red)">Combos &amp; Gift Boxes <small>Viral · most gifted</small></a>
        <a href="collection.html?max=5000">Under ₹5,000 <small>Most loved</small></a>
        <a href="collection.html?cat=sets">Necklace Sets <small>129</small></a>
        <a href="collection.html?cat=necklaces">Necklaces <small>152</small></a>
        <a href="collection.html?cat=earrings">Earrings &amp; Studs <small>190</small></a>
        <a href="collection.html?cat=bracelets">Bracelets <small>57</small></a>
        <a href="collection.html?cat=rings">Rings <small>25</small></a>
        <a href="collection.html?tag=gift">Gifting <small>Boxes &amp; combos</small></a>
        <div class="sub">By pearl type</div>
        <a href="collection.html?q=freshwater">Freshwater</a><a href="collection.html?q=akoya">Akoya</a><a href="collection.html?q=south sea">South Sea</a><a href="collection.html?q=tahitian">Tahitian</a>
        <div class="sub">About</div>
        <a href="about.html">Our story since 1905</a><a href="education.html">Pearl education</a><a href="contact.html">Showrooms · Hyderabad</a><a href="account.html">My account</a><a href="wishlist.html">Saved items</a><a href="https://www.bluedart.com/tracking" target="_blank" rel="noopener">Track order</a>
      </div>
      <div class="mnav-foot"><a class="btn btn-wa" href="https://wa.me/919100009220" target="_blank" rel="noopener"><img class="wa-logo" src="assets/pay/whatsapp.svg" alt="" aria-hidden="true"> Chat on WhatsApp</a><small style="text-align:center;color:var(--muted)">Mon–Sat, 10am–7pm · Reply in minutes</small></div>
    </div></div>
    <div class="drawer right" id="cartDrawer"><div class="scrim" data-close></div><div class="panel">
      <div class="panel-head"><span>Your bag <span id="cartTitleCount" style="color:var(--muted);font-weight:500"></span></span><button class="icon-btn" data-close aria-label="Close">✕</button></div>
      <div class="ship-bar"><div><span id="shipMsg">Free shipping &amp; free returns on every order</span><div class="ship-track"><i id="shipBar"></i></div></div></div>
      <div class="cart-items" id="cartItems"></div>
      <div class="upsell" id="cartUpsell"></div>
      <div class="cart-foot">
        <div class="tot"><span>Subtotal <small style="color:var(--muted)">(incl. GST)</small></span><b id="cartTotal">₹0</b></div>
        <a class="btn btn-primary btn-lg btn-block" href="checkout.html">Checkout securely →</a>
        <a class="link" href="cart.html" style="text-align:center;align-self:center">View full bag</a>
        <button class="btn btn-wa btn-block" onclick="PBM.toast('Opens WhatsApp with cart summary')"><img class="wa-logo" src="assets/pay/whatsapp.svg" alt="" aria-hidden="true"> Order on WhatsApp</button>
        <p class="note">Ships in 24 hrs from Hyderabad · Certificate of authenticity included</p>
        ${payLogos()}
      </div>
    </div></div>`;
  }
  function footerHTML(){
    return `<footer class="footer"><div class="container">
      <div class="cols">
        <div><img class="logo-img logo-foot" src="assets/logo-white.png" alt="Pearls by Mangatrai" width="900" height="123">
          <p style="margin-top:14px;max-width:38ch">Hyderabad's original pearl house. Five generations, one promise: real pearls, honest prices, lifelong guarantee.</p>
          <p style="font-size:13px">Showrooms: <a href="contact.html">Liberty · Gachibowli · Taj Falaknuma, Hyderabad</a></p><p style="font-size:13px"><a href="https://www.instagram.com/pearlsbymangatrai/" target="_blank" rel="noopener">Instagram</a> · <a href="https://www.facebook.com/pearlsbymangatrai/" target="_blank" rel="noopener">Facebook</a> · <a href="mailto:sales@pearlsbymangatrai.com">sales@pearlsbymangatrai.com</a></p>
          ${payLogos('foot')}</div>
        <div><h4>Shop</h4><ul><li><a href="collection.html?cat=combos">Combos &amp; gift boxes</a></li><li><a href="collection.html?cat=sets">Necklace sets</a></li><li><a href="collection.html?cat=necklaces">Necklaces</a></li><li><a href="collection.html?cat=earrings">Earrings</a></li><li><a href="collection.html?cat=bracelets">Bracelets</a></li><li><a href="collection.html?cat=rings">Rings</a></li><li><a href="collection.html?tag=gift">Gifting</a></li></ul></div>
        <div><h4>Help</h4><ul><li><a href="https://www.bluedart.com/tracking" target="_blank" rel="noopener">Track your order</a></li><li><a href="shipping-returns.html">Shipping &amp; returns</a></li><li><a href="faq.html">FAQ</a></li><li><a href="faq.html#guarantee">Lifelong guarantee</a></li><li><a href="education.html#care">Pearl care guide</a></li><li><a href="education.html#grading">Pearl grading explained</a></li><li><a href="about.html">Our story</a></li><li><a href="contact.html">Showrooms &amp; contact</a></li></ul></div>
        <div><h4>Get 5% off your first order</h4><p style="font-size:13.5px">Plus early access to new arrivals and festive drops.</p>
          <form onsubmit="event.preventDefault();PBM.toast('Code WELCOME5 sent to your inbox')" style="display:flex;gap:8px"><input required type="email" placeholder="Email address" style="flex:1;padding:12px 14px;border-radius:999px;border:1px solid rgba(255,255,255,.25);background:rgba(255,255,255,.08);color:#fff;font:inherit;min-width:0"><button class="btn btn-gold btn-sm" type="submit">Join</button></form>
          <p style="font-size:12px;margin-top:10px;color:rgba(255,255,255,.55)">Or WhatsApp us: +91 91000 09220</p></div>
      </div>
      <div class="legal"><span>© 2026 Mangatrai Gems &amp; Jewels Private Limited · Hyderabad</span><span><a href="policies.html#privacy">Privacy</a> · <a href="policies.html#terms">Terms</a> · <a href="policies.html#refund">Refund policy</a></span></div>
    </div></footer>
    <a class="wa-fab" href="https://wa.me/919100009220" target="_blank" rel="noopener" aria-label="Chat on WhatsApp"><img src="assets/pay/whatsapp.svg" alt=""></a>`;
  }

  /* ---------- Product card ---------- */
  function stars(r){ const f=Math.round(r); return '★'.repeat(f)+'☆'.repeat(5-f); }
  function cardHTML(p, opts={}){
    const badge = p.badge ? `<span class="badge ${p.badge==='New'?'new':p.badge==='Viral combo'?'viral':''}">${p.badge}</span>` : `<span class="badge save">Save ${savePct(p)}%</span>`;
    return `<article class="card" data-handle="${p.handle}">
      <a class="media" href="product.html?handle=${p.handle}" aria-label="${p.title}">
        ${badge}
        <img src="${p.images[0]}" alt="${p.title}" loading="${opts.eager?'eager':'lazy'}" width="600" height="750">
        <img class="alt" src="${p.images[1]||p.images[0]}" alt="" loading="lazy" width="600" height="750">
      </a>
      <button class="wish ${wish.has(p.handle)?'on':''}" aria-label="Save to wishlist" data-wish="${p.handle}">${I.heart}</button>
      <div class="body">
        <div class="rating"><span class="stars">${stars(p.rating)}</span> ${p.rating} <span>(${p.reviews})</span></div>
        <a class="title" href="product.html?handle=${p.handle}">${p.title}</a>
        <div class="price"><b>${inr(p.price)}</b><s>${inr(p.compare)}</s><em>${savePct(p)}% off</em></div>
        ${p.price>=1500?`<div class="emi">or 3 × <b>${inr(p.price/3)}</b> at 0% · Simpl</div>`:`<div class="emi">COD available</div>`}
        <div class="add"><button class="btn btn-outline" data-add="${p.handle}">Add to bag</button></div>
      </div></article>`;
  }
  window.PBM.cardHTML = cardHTML; window.PBM.stars = stars; window.PBM.savePct = savePct;

  /* ---------- Cart render ---------- */
  function renderCart(){
    const c = cart.get(); const n = cart.count();
    $$('#cartCount,#cartCount2').forEach(e=>{ e.textContent=n; e.style.display=n?'flex':'none'; });
    const tc=$('#cartTitleCount'); if(tc) tc.textContent = n?`(${n})`:'';
    const el=$('#cartItems'); if(!el) return;
    if(!c.length){ el.innerHTML=`<div class="empty"><p style="font-size:40px;margin:0">🤍</p><p><b>Your bag is empty</b></p><p>Bestsellers start at ₹665 — with free shipping.</p><a class="btn btn-primary btn-sm" href="collection.html">Shop bestsellers</a></div>`; }
    else el.innerHTML = c.map(i=>{ const p=byHandle[i.handle]; if(!p) return ''; return `<div class="ci">
      <img src="${p.images[0]}" alt=""><div><div class="t">${p.title}</div><div class="p">${inr(p.price)} <s style="color:var(--muted);font-weight:400;font-size:12px">${inr(p.compare)}</s></div>
      <div class="qty"><button data-q="${p.handle}" data-d="-1">−</button><span>${i.qty}</span><button data-q="${p.handle}" data-d="1">+</button></div></div>
      <button class="rm" data-rm="${p.handle}">Remove</button></div>`; }).join('');
    const t=$('#cartTotal'); if(t) t.textContent=inr(cart.total());
    const sm=$('#shipMsg'); if(sm){ const tot=cart.total(); const T=5000; sm.innerHTML = !tot ? 'Free shipping &amp; free returns on every order' : tot>=T ? '🎁 Free pearl care kit &amp; velvet pouch unlocked' : `Add <b>${inr(T-tot)}</b> more for a free pearl care kit &amp; velvet pouch`; const bar=$('#shipBar'); if(bar) bar.style.width=Math.min(100,tot/T*100)+'%'; }
    const up=$('#cartUpsell'); if(up){ const inCart=new Set(c.map(x=>x.handle)); const sugg=P.filter(p=>!inCart.has(p.handle)&&p.price<2500).slice(0,2).concat(P.filter(p=>!inCart.has(p.handle)&&p.combo&&p.price<=5250).slice(0,2));
      up.innerHTML = `<small>Complete the look</small><div class="list">${sugg.slice(0,3).map(p=>`<div class="u"><img src="${p.images[0]}" alt="" loading="lazy"><div class="ut"><b>${p.title}</b><span class="up"><strong>${inr(p.price)}</strong> <s>${inr(p.compare)}</s> <em>${Math.round((1-p.price/p.compare)*100)}% off</em></span></div><button data-add="${p.handle}" aria-label="Add ${p.title}">Add</button></div>`).join('')}</div>`; }
  }

  /* ---------- Global events ---------- */
  document.addEventListener('click', e=>{
    const o=e.target.closest('[data-open]'); if(o){ e.preventDefault(); $(o.dataset.open).classList.add('open'); document.body.style.overflow='hidden'; return; }
    const ph=e.target.closest('a[href="#"]'); if(ph){ e.preventDefault(); toast('Links to the live page in the Shopify build'); return; }
    const cl=e.target.closest('[data-close]'); if(cl){ $$('.drawer.open').forEach(d=>d.classList.remove('open')); document.body.style.overflow=''; return; }
    const a=e.target.closest('[data-add]'); if(a){ cart.add(a.dataset.add, +(a.dataset.qty||1)); const p=byHandle[a.dataset.add]; toast(`Added · ${p?p.title.slice(0,30):''}${p&&p.title.length>30?'…':''}`); const cd=$('#cartDrawer'); if(cd && !a.closest('#cartDrawer')){ cd.classList.add('open'); document.body.style.overflow='hidden'; } return; }
    const q=e.target.closest('[data-q]'); if(q){ const c=cart.get().find(x=>x.handle===q.dataset.q); cart.setQty(q.dataset.q,(c?c.qty:0)+ +q.dataset.d); return; }
    const r=e.target.closest('[data-rm]'); if(r){ cart.setQty(r.dataset.rm,0); return; }
    const w=e.target.closest('[data-wish]'); if(w){ const added=wish.toggle(w.dataset.wish); toast(added?'Saved · view in wishlist':'Removed from wishlist'); return; }
    if(e.target.closest('#searchToggle')){ const sb=$('#searchBar'); sb.classList.toggle('open'); if(sb.classList.contains('open')) sb.querySelector('input').focus(); }
  });
  document.addEventListener('keydown', e=>{ if(e.key==='Escape'){ $$('.drawer.open').forEach(d=>d.classList.remove('open')); document.body.style.overflow=''; } });

  function bnavHTML(){
    const page=location.pathname.split('/').pop()||'index.html';
    const on=k=>page.startsWith(k)?' on':'';
    return `<nav class="bnav" aria-label="Quick navigation">
      <a href="index.html" class="${on('index')}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M3 11 12 4l9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/></svg>Home</a>
      <a href="collection.html?tag=gift" class="${on('collection')}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="8" width="18" height="13" rx="2"/><path d="M12 8v13M3 12h18M12 8c-2-4-6-4-6-1s4 1 6 1zm0 0c2-4 6-4 6-1s-4 1-6 1z"/></svg>Gifts</a>
      <a href="collection.html" class="mid"><span class="pill"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg></span><b>Shop</b></a>
      <a href="https://wa.me/919100009220" target="_blank" rel="noopener"><img class="wa-logo nav" src="assets/pay/whatsapp.svg" alt="">WhatsApp</a>
      <a href="#" data-open="#cartDrawer"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 7h12l1 13H5L6 7z"/><path d="M9 10V6a3 3 0 0 1 6 0v4"/></svg>Bag<span class="n" id="cartCount2">0</span></a>
    </nav>`;
  }
  // Sale countdown: ends Sunday 23:59 IST this week (demo). Returns {d,h,m,s}
  function saleCountdown(els){
    const list=[].concat(els).filter(Boolean); if(!list.length) return;
    const tick=()=>{ const now=new Date(); const ist=new Date(now.toLocaleString('en-US',{timeZone:'Asia/Kolkata'})); const end=new Date(ist); end.setDate(ist.getDate()+((7-ist.getDay())%7)); end.setHours(23,59,59,0); if(end<ist) end.setDate(end.getDate()+7);
      let diff=Math.max(0,end-ist); const d=Math.floor(diff/864e5); diff-=d*864e5; const h=Math.floor(diff/36e5); diff-=h*36e5; const m=Math.floor(diff/6e4); const s=Math.floor(diff%6e4/1000);
      const pad=n=>String(n).padStart(2,'0');
      list.forEach(el=>{ el.innerHTML=`<span>${pad(d)}<small>days</small></span><span>${pad(h)}<small>hrs</small></span><span>${pad(m)}<small>min</small></span><span>${pad(s)}<small>sec</small></span>`; }); };
    tick(); setInterval(tick,1000);
  }
  /* ---------- Try your luck (gamified lead capture, IM8/Alia pattern, pearl-themed) ---------- */
  const LUCK_KEY='pbm_luck';
  const PRIZES=[{code:'PEARL10',w:70,short:'10% OFF',title:'10% off your order',sub:'+ a free pearl care kit'},{code:'PEARL15',w:20,short:'15% OFF',title:'15% off your order',sub:'+ a free pearl care kit'},{code:'PEARL10',w:10,short:'FREE STUDS',title:'10% off + free pearl studs',sub:'studs free on orders over ₹5,000'}];
  const DECOYS=['5% OFF','FREE POUCH','FREE SHIP','GIFT BOX'];
  function luckState(){ try{ return JSON.parse(localStorage.getItem(LUCK_KEY)||'null'); }catch(e){ return null; } }
  function luckSave(v){ try{ localStorage.setItem(LUCK_KEY, JSON.stringify(v)); }catch(e){} }
  function pickPrize(){ const t=PRIZES.reduce((a,p)=>a+p.w,0); let r=Math.random()*t; for(const p of PRIZES){ if((r-=p.w)<=0) return p; } return PRIZES[0]; }
  function luckHTML(){ return `<div class="luck" id="luck" role="dialog" aria-modal="true" aria-label="Try your luck">
    <div class="luck-scrim" data-luck-close></div>
    <div class="luck-card">
      <button class="luck-x" data-luck-close aria-label="Close">✕</button>
      <div class="luck-media"><img src="https://pearlsbymangatrai.com/cdn/shop/files/for_pearl_website_2.png?width=800" alt=""></div>
      <div class="luck-body">
        <div class="luck-step" data-step="1">
          <div class="eyebrow">Try your luck</div>
          <h3>Flip the pearls. Match 3 to win.</h3>
          <p>Every pearl hides a gift. Find three the same and it's yours.</p>
          <div class="pearls">${[0,1,2,3,4,5].map(i=>`<button class="pcard" data-pcard="${i}" aria-label="Flip pearl ${i+1}"><span class="pin"><span class="pf"></span><span class="pb"></span></span></button>`).join('')}</div>
          <div class="match" id="luckMatch"><i></i><i></i><i></i><span>0 of 3 matched</span></div>
          <small>No purchase needed · one gift per customer</small>
        </div>
        <div class="luck-step" data-step="2" hidden>
          <div class="eyebrow">You matched 3!</div>
          <h3 id="luckTitle"></h3>
          <p id="luckSub"></p>
          <form id="luckForm" class="luck-form">
            <input type="tel" inputmode="tel" name="phone" required placeholder="WhatsApp number" autocomplete="tel" pattern="[0-9+ ]{10,15}">
            <button class="btn btn-gold btn-block" type="submit">Claim my gift</button>
          </form>
          <small>We WhatsApp your code and order updates. No spam, unsubscribe any time.</small>
        </div>
        <div class="luck-step" data-step="3" hidden>
          <div class="eyebrow">Your gift is ready</div>
          <h3>Use code</h3>
          <div class="luck-code" id="luckCode"></div>
          <p>Applied to your bag automatically. Valid for <b id="luckTimer">48h</b>.</p>
          <a class="btn btn-light btn-block" href="collection.html?cat=combos">Shop viral combos</a>
          <button class="luck-later" data-luck-close>Continue browsing</button>
        </div>
      </div>
    </div></div>
    <button class="luck-tab" id="luckTab" hidden>🎁 <span>Try your luck</span></button>`; }
  function luckInit(){
    if(document.body.dataset.luck==='off') return;
    document.body.insertAdjacentHTML('beforeend', luckHTML());
    const box=$('#luck'), tab=$('#luckTab'); let st=luckState()||{};
    const showStep=n=>$$('.luck-step',box).forEach(s=>s.hidden=s.dataset.step!=String(n));
    const open=()=>{ box.classList.add('on'); document.body.style.overflow='hidden'; };
    const close=()=>{ box.classList.remove('on'); document.body.style.overflow=''; if(st.state!=='claimed'){ st={state:'closed',at:Date.now()}; luckSave(st); } tab.hidden=false; };
    const fmt=ms=>{ const h=Math.floor(ms/36e5), m=Math.floor(ms%36e5/6e4), s2=Math.floor(ms%6e4/1000); return `${h}h ${String(m).padStart(2,'0')}m ${String(s2).padStart(2,'0')}s`; };
    const tick=()=>{ if(st.state!=='claimed') return; const left=st.expires-Date.now(); if(left<=0){ tab.hidden=true; localStorage.removeItem('pbm_promo'); return; } $('#luckTimer').textContent=fmt(left); tab.innerHTML=`🎁 <span>${st.code} · ${fmt(left).replace(/ \d+s$/,'')}</span>`; };
    box.addEventListener('click',e=>{ if(e.target.closest('[data-luck-close]')) close(); });
    tab.addEventListener('click',()=>{ showStep(st.state==='claimed'?3:1); open(); });
    let game=null;
    const newGame=()=>{ const prize=pickPrize(); const d=DECOYS.slice().sort(()=>Math.random()-.5); game={prize,seq:[prize.short,d[0],prize.short,d[1],prize.short,d[2]],flips:0,hits:0}; };
    newGame();
    $$('.pcard',box).forEach(c=>c.addEventListener('click',()=>{ if(box.dataset.busy||c.classList.contains('flip')||!game) return; const label=game.seq[game.flips++]; c.querySelector('.pb').textContent=label; c.classList.add('flip'); if(label===game.prize.short){ c.classList.add('hit'); game.hits++; const m=$('#luckMatch'); $$('i',m).forEach((d,k)=>d.classList.toggle('on',k<game.hits)); m.querySelector('span').textContent=`${game.hits} of 3 matched`; }
      if(game.hits===3){ box.dataset.busy='1'; const prize=game.prize; st={state:'won',prize,at:Date.now()}; luckSave(st); $$('.pcard',box).forEach(x=>{ if(!x.classList.contains('hit')) x.classList.add('dim'); }); setTimeout(()=>{ $('#luckTitle').textContent=prize.title; $('#luckSub').textContent=prize.sub; showStep(2); delete box.dataset.busy; },1000); } }));
    $('#luckForm').addEventListener('submit',e=>{ e.preventDefault(); const prize=st.prize||PRIZES[0]; st={state:'claimed',code:prize.code,phone:e.target.phone.value,at:Date.now(),expires:Date.now()+48*36e5}; luckSave(st); try{ localStorage.setItem('pbm_promo',prize.code); }catch(x){} $('#luckCode').textContent=prize.code; showStep(3); tick(); toast(`${prize.code} applied to your bag`); renderCart(); });
    // resume state
    if(st.state==='claimed'){ if(st.expires>Date.now()){ $('#luckCode').textContent=st.code; tab.hidden=false; tick(); setInterval(tick,1000); } return; }
    if(st.state==='won'){ $('#luckTitle').textContent=st.prize.title; $('#luckSub').textContent=st.prize.sub; showStep(2); tab.hidden=false; tab.innerHTML='🎁 <span>Claim your gift</span>'; return; }
    if(st.state==='closed' && Date.now()-st.at < 7*864e5){ tab.hidden=false; return; }
    // triggers: 12s on page, or 35% scroll, or exit intent (desktop). Never on first paint.
    let fired=false; const fire=()=>{ if(fired) return; fired=true; showStep(1); open(); };
    setTimeout(fire,12000);
    const deep=()=>scrollY>document.documentElement.scrollHeight*0.35;
    addEventListener('scroll',()=>{ if(deep()) fire(); },{passive:true});
    setTimeout(()=>{ if(deep()) fire(); },1500); // scroll restored after reload/back fires no scroll event
    document.addEventListener('mouseleave',e=>{ if(e.clientY<10) fire(); });
  }
  function initChrome(){
    const h=$('#site-header'); if(h) h.outerHTML=headerHTML();
    if(document.body.dataset.bnav!=='off' && $('#site-footer')){ document.body.classList.add('has-bnav'); document.body.insertAdjacentHTML('beforeend', bnavHTML()); }
    const f=$('#site-footer'); if(f) f.outerHTML=footerHTML();
    renderCart(); renderWish(); luckInit();
    // rotating announcement
    const spans=$$('#announce span'); let k=0; if(spans.length) setInterval(()=>{ spans[k].classList.remove('on'); k=(k+1)%spans.length; spans[k].classList.add('on'); },3800);
    // reveal on scroll
    const io=new IntersectionObserver(es=>es.forEach(x=>{ if(x.isIntersecting){ x.target.classList.add('in'); io.unobserve(x.target);} }),{rootMargin:'0px 0px -8% 0px'});
    $$('.reveal').forEach(el=>io.observe(el));
  }

  /* ---------- Helpers for pages ---------- */
  function grid(sel, items, opts){ const el=$(sel); if(el) el.innerHTML=items.map((p,i)=>cardHTML(p,{eager:i<2&&opts?.eager})).join(''); }
  function dispatchCountdown(el){
    if(!el) return;
    const tick=()=>{ const now=new Date(); const ist=new Date(now.toLocaleString('en-US',{timeZone:'Asia/Kolkata'})); const cutoff=new Date(ist); cutoff.setHours(16,0,0,0);
      let diff=cutoff-ist; if(diff<0){ el.innerHTML='Order now · dispatches <b>tomorrow morning</b>'; return; }
      const h=Math.floor(diff/36e5), m=Math.floor(diff%36e5/6e4); el.innerHTML=`Order within <b>${h}h ${m}m</b> for same-day dispatch`; };
    tick(); setInterval(tick,30000);
  }
  function deliveryDate(days){ const d=new Date(); d.setDate(d.getDate()+days); return d.toLocaleDateString('en-IN',{weekday:'short',day:'numeric',month:'short'}); }
  Object.assign(window.PBM,{grid, initChrome, dispatchCountdown, deliveryDate, renderCart, saleCountdown});

  document.addEventListener('DOMContentLoaded', ()=>{ initChrome(); if(window.PBM_PAGE) window.PBM_PAGE(); });
})();
