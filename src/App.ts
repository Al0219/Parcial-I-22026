import { GuitarService } from './Service/guitar.service';
import type { Guitar } from './Entity/guitar.entity';

// ── Instancia del servicio (estado global) ──────────────────────────────────
const service = new GuitarService();

// ── Referencias DOM ─────────────────────────────────────────────────────────
const catalogGrid     = document.getElementById('catalog-grid')    as HTMLElement;
const cartPanel       = document.getElementById('cart-panel')      as HTMLElement;
const cartOverlay     = document.getElementById('cart-overlay')    as HTMLElement;
const cartItems       = document.getElementById('cart-items')      as HTMLElement;
const cartBadge       = document.getElementById('cart-badge')      as HTMLElement;
const cartTotal       = document.getElementById('cart-total')      as HTMLElement;
const cartCountSummary = document.getElementById('cart-count-summary') as HTMLElement;
const cartToggleBtn   = document.getElementById('cart-toggle-btn') as HTMLButtonElement;
const cartCloseBtn    = document.getElementById('cart-close-btn')  as HTMLButtonElement;

// ══════════════════════════════════════════════════════════════════════════════
// RENDER — Catálogo
// ══════════════════════════════════════════════════════════════════════════════

/**
 * Genera dinámicamente las tarjetas de guitarra usando document.createElement.
 * Cada tarjeta incluye imagen, nombre, descripción, precio y botón "AGREGAR AL CARRITO".
 */
function renderCatalog(): void {
  catalogGrid.innerHTML = '';
  const guitars = service.getCatalog();

  guitars.forEach((guitar: Guitar) => {
    // Contenedor tarjeta
    const article = document.createElement('article');
    article.classList.add('guitar-card');
    article.setAttribute('role', 'listitem');
    article.dataset.id = String(guitar.id);

    // Image wrapper
    const imageWrapper = document.createElement('div');
    imageWrapper.classList.add('guitar-card__image-wrapper');

    const img = document.createElement('img');
    img.src = `/${guitar.image}.jpg`;
    img.alt = `Guitarra ${guitar.name}`;
    img.classList.add('guitar-card__image');
    img.loading = 'lazy';

    const badge = document.createElement('span');
    badge.classList.add('guitar-card__badge');
    badge.textContent = 'Disponible';

    imageWrapper.appendChild(img);
    imageWrapper.appendChild(badge);

    // Body
    const body = document.createElement('div');
    body.classList.add('guitar-card__body');

    const name = document.createElement('h3');
    name.classList.add('guitar-card__name');
    name.textContent = guitar.name;

    const desc = document.createElement('p');
    desc.classList.add('guitar-card__description');
    desc.textContent = guitar.description;

    // Footer: precio + botón
    const footer = document.createElement('div');
    footer.classList.add('guitar-card__footer');

    const priceEl = document.createElement('p');
    priceEl.classList.add('guitar-card__price');
    const priceLabel = document.createElement('span');
    priceLabel.textContent = 'USD ';
    priceEl.appendChild(priceLabel);
    priceEl.append(`$${guitar.price}`);

    const addBtn = document.createElement('button');
    addBtn.classList.add('btn-add-cart');
    addBtn.textContent = 'AGREGAR AL CARRITO';
    addBtn.dataset.id = String(guitar.id);
    addBtn.setAttribute('aria-label', `Agregar ${guitar.name} al carrito`);
    addBtn.addEventListener('click', handleAddToCart);

    footer.appendChild(priceEl);
    footer.appendChild(addBtn);

    body.appendChild(name);
    body.appendChild(desc);
    body.appendChild(footer);

    article.appendChild(imageWrapper);
    article.appendChild(body);
    catalogGrid.appendChild(article);
  });
}

// ══════════════════════════════════════════════════════════════════════════════
// RENDER — Carrito
// ══════════════════════════════════════════════════════════════════════════════

/**
 * Re-renderiza el panel del carrito en tiempo real.
 * Muestra estado vacío si no hay ítems, o las tarjetas con controles +/-.
 */
function renderCart(): void {
  cartItems.innerHTML = '';
  const items = service.getCart();

  if (items.length === 0) {
    // Estado vacío
    const empty = document.createElement('div');
    empty.classList.add('cart-empty');

    const icon = document.createElement('span');
    icon.classList.add('cart-empty__icon');
    icon.textContent = '🎸';

    const text = document.createElement('p');
    text.classList.add('cart-empty__text');
    text.textContent = 'Tu carrito está vacío';

    const sub = document.createElement('p');
    sub.classList.add('cart-empty__sub');
    sub.textContent = 'Agrega guitarras desde el catálogo';

    empty.appendChild(icon);
    empty.appendChild(text);
    empty.appendChild(sub);
    cartItems.appendChild(empty);
  } else {
    items.forEach((item: Guitar) => {
      const div = document.createElement('div');
      div.classList.add('cart-item');
      div.setAttribute('role', 'listitem');
      div.dataset.id = String(item.id);

      // Imagen miniatura
      const img = document.createElement('img');
      img.src = `/${item.image}.jpg`;
      img.alt = item.name;
      img.classList.add('cart-item__image');

      // Info
      const info = document.createElement('div');
      info.classList.add('cart-item__info');

      const itemName = document.createElement('p');
      itemName.classList.add('cart-item__name');
      itemName.textContent = item.name;

      const itemPrice = document.createElement('p');
      itemPrice.classList.add('cart-item__price');
      itemPrice.textContent = `$${item.price} c/u`;

      // Controles de cantidad
      const controls = document.createElement('div');
      controls.classList.add('cart-item__controls');

      const minusBtn = document.createElement('button');
      minusBtn.classList.add('qty-btn', 'qty-minus');
      minusBtn.textContent = '−';
      minusBtn.dataset.id = String(item.id);
      minusBtn.setAttribute('aria-label', `Disminuir cantidad de ${item.name}`);
      minusBtn.addEventListener('click', handleDecrement);

      const qtyVal = document.createElement('span');
      qtyVal.classList.add('qty-value');
      qtyVal.textContent = String(item.quantity);

      const plusBtn = document.createElement('button');
      plusBtn.classList.add('qty-btn', 'qty-plus');
      plusBtn.textContent = '+';
      plusBtn.dataset.id = String(item.id);
      plusBtn.setAttribute('aria-label', `Aumentar cantidad de ${item.name}`);
      plusBtn.addEventListener('click', handleIncrement);

      controls.appendChild(minusBtn);
      controls.appendChild(qtyVal);
      controls.appendChild(plusBtn);

      info.appendChild(itemName);
      info.appendChild(itemPrice);
      info.appendChild(controls);

      // Botón eliminar
      const removeBtn = document.createElement('button');
      removeBtn.classList.add('cart-item__remove');
      removeBtn.textContent = '🗑';
      removeBtn.dataset.id = String(item.id);
      removeBtn.setAttribute('aria-label', `Eliminar ${item.name} del carrito`);
      removeBtn.addEventListener('click', handleRemove);

      div.appendChild(img);
      div.appendChild(info);
      div.appendChild(removeBtn);
      cartItems.appendChild(div);
    });
  }

  updateTotals();
}

// ══════════════════════════════════════════════════════════════════════════════
// UPDATE — Badge y totales
// ══════════════════════════════════════════════════════════════════════════════

/** Actualiza el badge del header con el total de artículos. */
function updateBadge(): void {
  const count = service.getCartCount();
  cartBadge.textContent = String(count);

  if (count > 0) {
    cartBadge.classList.add('visible');
  } else {
    cartBadge.classList.remove('visible');
  }
}

/** Actualiza el total y el resumen de ítems en el footer del carrito. */
function updateTotals(): void {
  const total = service.getCartTotal();
  const count = service.getCartCount();
  const itemCount = service.getCart().length;

  cartTotal.textContent = `$${total.toLocaleString('es-MX')}`;
  cartCountSummary.textContent = `${itemCount} ítem${itemCount !== 1 ? 's' : ''} (${count} uds.)`;
  updateBadge();
}

// ══════════════════════════════════════════════════════════════════════════════
// EVENT HANDLERS
// ══════════════════════════════════════════════════════════════════════════════

/** Agrega o incrementa un producto en el carrito. */
function handleAddToCart(e: Event): void {
  const btn = e.currentTarget as HTMLButtonElement;
  const id = Number(btn.dataset.id);
  service.addToCart(id);
  renderCart();

  // Feedback visual: anima el botón
  btn.textContent = '✓ AGREGADO';
  btn.style.background = 'linear-gradient(135deg, #3d9e4a, #4fc85d)';
  setTimeout(() => {
    btn.textContent = 'AGREGAR AL CARRITO';
    btn.style.background = '';
  }, 1200);
}

/** Incrementa la cantidad de un ítem del carrito. */
function handleIncrement(e: Event): void {
  const btn = e.currentTarget as HTMLButtonElement;
  const id = Number(btn.dataset.id);
  service.incrementItem(id);
  renderCart();
}

/**
 * Decrementa la cantidad de un ítem.
 * Si llega a 0, el servicio lo elimina automáticamente.
 */
function handleDecrement(e: Event): void {
  const btn = e.currentTarget as HTMLButtonElement;
  const id = Number(btn.dataset.id);
  service.decrementItem(id);
  renderCart();
}

/** Elimina un ítem del carrito directamente. */
function handleRemove(e: Event): void {
  const btn = e.currentTarget as HTMLButtonElement;
  const id = Number(btn.dataset.id);
  service.removeItem(id);
  renderCart();
}

// ══════════════════════════════════════════════════════════════════════════════
// PANEL — Abrir / Cerrar carrito
// ══════════════════════════════════════════════════════════════════════════════

function openCart(): void {
  cartPanel.classList.add('open');
  cartOverlay.classList.add('active');
  cartOverlay.setAttribute('aria-hidden', 'false');
  cartToggleBtn.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}

function closeCart(): void {
  cartPanel.classList.remove('open');
  cartOverlay.classList.remove('active');
  cartOverlay.setAttribute('aria-hidden', 'true');
  cartToggleBtn.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

// ── Listeners de apertura/cierre ─────────────────────────────────────────────
cartToggleBtn.addEventListener('click', openCart);
cartCloseBtn.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

// Cierre con tecla Escape
document.addEventListener('keydown', (e: KeyboardEvent) => {
  if (e.key === 'Escape' && cartPanel.classList.contains('open')) {
    closeCart();
  }
});

// ══════════════════════════════════════════════════════════════════════════════
// INIT — Punto de entrada
// ══════════════════════════════════════════════════════════════════════════════
renderCatalog();
renderCart();
