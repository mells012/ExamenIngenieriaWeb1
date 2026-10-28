// =============================================================
// Furnito — JavaScript base (PROGRESO 1: HTML, CSS, JS sin frameworks)
//
// Este archivo demuestra JS "vanilla": arrays de objetos como
// fuente de datos, funciones, loops, creación de elementos del
// DOM, delegación de eventos y un pequeño estado en memoria
// (el carrito). No usa React ni llama a ningún backend/API REST
// a propósito: esos temas son de módulos posteriores del curso.
// =============================================================

// ---------- 1. DATOS (arrays de objetos) ----------------------

const categories = [
  { id: 'living-room', name: 'Living Room', image: 'assets/category-living-room.jpg' },
  { id: 'bedroom',      name: 'Bedroom',     image: 'assets/category-bedroom.jpg' },
  { id: 'dining',       name: 'Dining',      image: 'assets/category-dining.jpg' },
  { id: 'lights',       name: 'Lights',      image: 'assets/category-lights.jpg' },

];

const products = [
  {
    id: 'sofa-1699',
    name: '3 - seater Leather Sofa',
    price: 1699,
    image: 'assets/product-sofa-1699.jpg',
    colors: ['#7B0101', '#2B495E', '#D5986C'],
  },
  {
    id: 'sofa-79',
    name: '3 - seater Sofa',
    price: 79,
    image: 'assets/product-sofa-79.jpg',
    colors: ['#AA765B'],
  },
  {
    id: 'lamp-349',
    name: 'Pendent Lamp - 2 Bulbs',
    price: 349,
    image: 'assets/product-lamp-349.jpg',
    colors: [],
  },
  {
    id: 'table-510',
    name: "Kid's Study Table - Royal White",
    price: 510,
    image: 'assets/product-table-510.jpg',
    colors: ['#FFFFFF', '#C6C6C6', '#000000'],
  },
    {
    id: 'sofa-1699',
    name: '3 - seater Leather Sofa',
    price: 1699,
    image: 'assets/product-sofa-1699.jpg',
    colors: ['#7B0101', '#2B495E', '#D5986C'],
  },
  {
    id: 'sofa-79',
    name: '3 - seater Sofa',
    price: 79,
    image: 'assets/product-sofa-79.jpg',
    colors: ['#AA765B'],
  },
  {
    id: 'lamp-349',
    name: 'Pendent Lamp - 2 Bulbs',
    price: 349,
    image: 'assets/product-lamp-349.jpg',
    colors: [],
  },
  {
    id: 'table-510',
    name: "Kid's Study Table - Royal White",
    price: 510,
    image: 'assets/product-table-510.jpg',
    colors: ['#FFFFFF', '#C6C6C6', '#000000'],
  },
];

// Estado del carrito: un array que vive en memoria mientras la
// pestaña esté abierta (no hay backend que lo persista todavía).
let cart = [];

// ---------- 2. FUNCIONES DE RENDERIZADO (loops + DOM) ----------

function formatPrice(amount) {
  return `$${amount.toLocaleString('en-US')}`;
}

function renderCategories() {
  const row = document.getElementById('categoriesRow');
  if (!row) return;
  const nextBtn = row.querySelector('.categories__next');

  // Construimos el HTML de cada categoría recorriendo el array
  const html = categories
    .map(
      (cat) => `
      <a href="#${cat.id}" class="category" data-id="${cat.id}">
        <span class="category-photo">
          <img src="${cat.image}" alt="${cat.name} furniture" />
        </span>
        <span class="category-label">${cat.name}</span>
      </a>`
    )
    .join('');

  // Insertamos todas las categorías ANTES del botón "siguiente"
  nextBtn.insertAdjacentHTML('beforebegin', html);
}

function renderProducts() {
  const grid = document.getElementById('productGrid');
  if (!grid) return;

  grid.innerHTML = products
    .map((product) => {
      const swatches = product.colors
        .map((color) => `<span class="product-card__swatch" style="background:${color}"></span>`)
        .join('');

      return `
        <article class="product-card" data-id="${product.id}">
          <div class="product-card__image-wrap">
            <img class="product-card__image" src="${product.image}" alt="${product.name}" />
            <button class="product-card__add" type="button" data-id="${product.id}" aria-label="Add ${product.name} to cart">
              <img src="assets/icon-cart-badge-union.svg" alt="" />
            </button>
          </div>
          <div class="product-card__info">
            <h3 class="product-card__title">${product.name}</h3>
            <div class="product-card__bottom">
              <span class="product-card__price">${formatPrice(product.price)}</span>
              ${swatches ? `<span class="product-card__swatches">${swatches}</span>` : ''}
            </div>
          </div>
        </article>`;
    })
    .join('');
}

// ---------- 3. CARRITO (estado + eventos delegados) -----------

function updateCartBadge() {
  const badge = document.querySelector('.icon-btn__badge');
  if (badge) badge.textContent = cart.length;
}

function addToCart(productId) {
  const product = products.find((p) => p.id === productId);
  if (!product) return;
  cart.push(product);
  updateCartBadge();
}

// ---------- 4. EVENTOS GENERALES -------------------------------

document.addEventListener('DOMContentLoaded', () => {
  renderCategories();
  renderProducts();
  updateCartBadge();

  // Delegación de eventos: un solo listener en el grid, en vez
  // de uno por cada botón "add to cart" (útil porque las tarjetas
  // se generaron dinámicamente).
  const productGrid = document.getElementById('productGrid');
  if (productGrid) {
    productGrid.addEventListener('click', (e) => {
      const btn = e.target.closest('.product-card__add');
      if (!btn) return;
      addToCart(btn.dataset.id);
      btn.classList.add('product-card__add--added');
      setTimeout(() => btn.classList.remove('product-card__add--added'), 400);
    });
  }

  // Carrusel de productos: botones prev/next sobre el scroll del grid
  const prevBtn = document.getElementById('productPrev');
  const nextProductBtn = document.getElementById('productNext');
  if (productGrid && prevBtn && nextProductBtn) {
    const step = () => {
      const card = productGrid.querySelector('.product-card');
      return card ? card.offsetWidth + 24 : 284;
    };
    const updateNav = () => {
      prevBtn.disabled = productGrid.scrollLeft <= 0;
      nextProductBtn.disabled =
        productGrid.scrollLeft + productGrid.clientWidth >= productGrid.scrollWidth - 1;
    };
    prevBtn.addEventListener('click', () => productGrid.scrollBy({ left: -step() }));
    nextProductBtn.addEventListener('click', () => productGrid.scrollBy({ left: step() }));
    productGrid.addEventListener('scroll', updateNav);
    window.addEventListener('resize', updateNav);
    updateNav();
  }

  // Newsletter form
  const newsletterForm = document.querySelector('.newsletter__form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('input[type="email"]');
      if (input && input.value) {
        alert(`¡Gracias! Te avisaremos a ${input.value} cuando haya ofertas.`);
        newsletterForm.reset();
      }
    });
  }

  // Search box
  const searchForm = document.querySelector('.search');
  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = searchForm.querySelector('input[type="search"]');
      const term = input ? input.value.trim().toLowerCase() : '';
      if (!term) return;

      // Búsqueda simple en el array `products` (sin backend/API):
      const matches = products.filter((p) => p.name.toLowerCase().includes(term));
      console.log(`Buscando "${term}" — ${matches.length} resultado(s):`, matches);
    });
  }

  // Wishlist heart toggle (visual only)
  const wishlistBtn = document.querySelector('.icon-btn--wishlist');
  if (wishlistBtn) {
    wishlistBtn.addEventListener('click', (e) => {
      e.preventDefault();
      wishlistBtn.classList.toggle('icon-btn--active');
    });
  }

  // Categories "next" button — simple horizontal scroll affordance
  const nextBtn = document.querySelector('.categories__next');
  const categoriesRow = document.querySelector('.categories__row');
  if (nextBtn && categoriesRow) {
    nextBtn.addEventListener('click', () => {
      categoriesRow.scrollBy({ left: 220, behavior: 'smooth' });
    });
  }
});
