/* ---------- mobile nav toggle ---------- */
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
      const expanded = links.classList.contains('open');
      toggle.setAttribute('aria-expanded', expanded);
    });
  }
  renderGreeting();
});

/* ---------- product catalogue ---------- */
/* roast: 0 (green/light) .. 100 (dark) — drives the roast-bar marker position */
const PRODUCTS = [
  {
    id: 'p1', name: 'Finca Alta', origin: 'Huila, Colombia', roast: 25,
    tag: 'Single Origin', price: 18, notes: 'Red apple, brown sugar, jasmine. A washed lot from a 1,750m farm we have bought from since 2021.'
  },
  {
    id: 'p2', name: 'Kilenzo Peak', origin: 'Kirinyaga, Kenya', roast: 35,
    tag: 'Single Origin', price: 21, notes: 'Blackcurrant, tomato, bright citrus acidity. Fully washed, sun-dried on raised beds.'
  },
  {
    id: 'p3', name: 'Casa Roja', origin: 'Blend', roast: 60,
    tag: 'House Blend', price: 16, notes: 'Cocoa, toasted hazelnut, soft caramel. Our everyday espresso blend, balanced for milk drinks.'
  },
  {
    id: 'p4', name: 'Terra Firma', origin: 'Blend', roast: 78,
    tag: 'Dark Roast', price: 16, notes: 'Molasses, dark chocolate, low acidity. Built for a French press or moka pot.'
  },
  {
    id: 'p5', name: 'Sidamo Bloom', origin: 'Sidama, Ethiopia', roast: 20,
    tag: 'Single Origin', price: 20, notes: 'Bergamot, peach, floral honey. Natural process, dried on-farm for 21 days.'
  },
  {
    id: 'p6', name: 'Sumbawa Dark', origin: 'Sumbawa, Indonesia', roast: 85,
    tag: 'Dark Roast', price: 17, notes: 'Cedar, dark cherry, heavy body. A slow, low-and-long roast profile.'
  },
  {
    id: 'p7', name: 'Decaf Alta', origin: 'Huila, Colombia', roast: 45,
    tag: 'Decaf', price: 19, notes: 'Sugarcane-process decaf, same lot as Finca Alta. Milk chocolate, plum.'
  },
  {
    id: 'p8', name: 'Roaster\u2019s Choice', origin: 'Rotating', roast: 50,
    tag: 'Subscription', price: 22, notes: 'A different single origin each month, picked by our head roaster. Ships every four weeks.'
  }
];

function roastWord(v){
  if (v < 30) return 'Light';
  if (v < 55) return 'Medium';
  if (v < 75) return 'Medium-Dark';
  return 'Dark';
}

function productCard(p){
  return `
    <article class="card">
      <div class="card-top">
        <div>
          <h3 style="margin-bottom:2px">${p.name}</h3>
          <div style="font-size:0.82rem;color:var(--text-muted)">${p.origin}</div>
        </div>
        <span class="tag">${p.tag}</span>
      </div>
      <p class="card-desc">${p.notes}</p>
      <div class="roast-bar" style="--pct:${p.roast}%"></div>
      <div class="roast-label"><span>Green</span><span>${roastWord(p.roast)} roast</span><span>Dark</span></div>
      <div class="card-foot">
        <span class="price">$${p.price}<span style="font-size:0.7rem;color:var(--text-muted)"> /12oz</span></span>
        <button class="btn btn-primary" style="padding:8px 18px;font-size:0.85rem">Add</button>
      </div>
    </article>`;
}

function renderGrid(containerId, list){
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = list.map(productCard).join('');
}

/* ---------- listings page filtering ---------- */
function initListingsPage(){
  const grid = document.getElementById('product-grid');
  if (!grid) return;
  renderGrid('product-grid', PRODUCTS);

  const chips = document.querySelectorAll('.filter-chip');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const filter = chip.dataset.filter;
      const filtered = filter === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.tag === filter);
      renderGrid('product-grid', filtered);
    });
  });
}

/* ---------- personalization greeting (reads in-memory session set by auth.js) ---------- */
function renderGreeting(){
  const slot = document.getElementById('nav-account-slot');
  if (!slot) return;
  const user = window.EmberAuth ? window.EmberAuth.getCurrentUser() : null;
  if (user) {
    slot.innerHTML = `<a href="login.html">Hi, ${user.name.split(' ')[0]}</a>`;
  } else {
    slot.innerHTML = `<a href="login.html" class="nav-cta">Sign in</a>`;
  }
}
