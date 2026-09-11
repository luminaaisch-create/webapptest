/* =========================================================
   SCRIPT.JS
   The customer-facing page's behaviour. It reads product data
   from content.js (BUSINESS, CATEGORIES, PRODUCTS, PAYMENT_METHODS)
   and shares order storage with staff.html through orders.js —
   you shouldn't need to edit this file just to change what the
   shop sells or how staff manage orders.

   Sections:
   1. State (cart)
   2. Rendering (categories, products, cart)
   3. Cart actions (add / change qty / remove)
   4. Checkout flow
   5. Order status tracking
   6. Wiring everything up (event listeners)
   ========================================================= */

/* ---------------------------------------------------------
   1. STATE
   (loadFromStorage / saveToStorage / getAllOrders / saveOrder /
   formatPrice / generateOrderNumber all live in orders.js,
   shared with staff.html)
   --------------------------------------------------------- */

// cart = { [productId]: quantity }
let cart = loadFromStorage("mebaca_cart", {});
let activeCategory = "all";

function saveCart() {
  saveToStorage("mebaca_cart", cart);
}

function findProduct(id) {
  return PRODUCTS.find((p) => p.id === id);
}

/* ---------------------------------------------------------
   2. RENDERING
   --------------------------------------------------------- */

function renderBusinessInfo() {
  document.getElementById("business-name").textContent = BUSINESS.name;
  document.getElementById("business-tagline").textContent = BUSINESS.tagline;
  document.getElementById("hero-heading").textContent = BUSINESS.tagline;
  document.getElementById("hero-about").textContent = BUSINESS.about;
  document.getElementById("footer-name").textContent = BUSINESS.name;
  document.getElementById("footer-address").textContent = BUSINESS.contact.address;
  document.getElementById("footer-phone").textContent = BUSINESS.contact.phone;
  document.getElementById("footer-email").textContent = BUSINESS.contact.email;
  document.getElementById("footer-hours").textContent = BUSINESS.hours;
  document.title = BUSINESS.name + " — Order Online";
}

function renderPaymentOptions() {
  const select = document.getElementById("cust-payment");
  select.innerHTML = PAYMENT_METHODS.map((method) => `<option value="${method}">${method}</option>`).join("");
}

function renderCategoryNav() {
  const container = document.getElementById("category-nav-inner");
  const allChip = ['<button class="category-chip" data-category="all">All</button>'];
  const chips = CATEGORIES.map(
    (cat) => `<button class="category-chip" data-category="${cat.id}">${cat.name}</button>`
  );
  container.innerHTML = allChip.concat(chips).join("");
  updateActiveCategoryChip();

  container.querySelectorAll(".category-chip").forEach((btn) => {
    btn.addEventListener("click", () => {
      activeCategory = btn.dataset.category;
      updateActiveCategoryChip();
      renderProductGrid();
    });
  });
}

function updateActiveCategoryChip() {
  document.querySelectorAll(".category-chip").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.category === activeCategory);
  });
}

function renderProductGrid() {
  const grid = document.getElementById("product-grid");
  const products =
    activeCategory === "all"
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === activeCategory);

  grid.innerHTML = products.map(productCardHTML).join("");

  // Wire up each card's buttons after inserting into the DOM
  products.forEach((product) => {
    const card = grid.querySelector(`[data-product-id="${product.id}"]`);
    wireProductCard(card, product);
  });
}

function productCardHTML(product) {
  const qty = cart[product.id] || 0;
  return `
    <article class="product-card" data-product-id="${product.id}">
      <img src="${product.image}" alt="${product.name}" loading="lazy" />
      <div class="product-card-body">
        <h3 class="product-name">${product.name}</h3>
        <p class="product-desc">${product.description}</p>
        <p class="product-price">${formatPrice(product.price)}</p>
        <div class="card-action">
          ${qty === 0
            ? `<button class="add-btn" data-action="add">Add to basket</button>`
            : `<div class="qty-stepper">
                 <button data-action="decrease" aria-label="Decrease quantity">&minus;</button>
                 <span data-role="qty">${qty}</span>
                 <button data-action="increase" aria-label="Increase quantity">+</button>
               </div>`
          }
        </div>
      </div>
    </article>
  `;
}

function wireProductCard(card, product) {
  const actionEl = card.querySelector(".card-action");
  actionEl.addEventListener("click", (e) => {
    const action = e.target.dataset.action;
    if (!action) return;
    // changeQuantity() updates the cart AND redraws this card
    // (see refreshVisibleProductCard), so nothing else is needed here.
    if (action === "add" || action === "increase") {
      changeQuantity(product.id, 1);
    } else if (action === "decrease") {
      changeQuantity(product.id, -1);
    }
  });
}

function renderCart() {
  const container = document.getElementById("cart-items");
  const entries = Object.entries(cart).filter(([, qty]) => qty > 0);

  if (entries.length === 0) {
    container.innerHTML = `<p class="empty-note">Your basket is empty. Browse the shop and add a few books.</p>`;
  } else {
    container.innerHTML = entries
      .map(([id, qty]) => {
        const product = findProduct(id);
        return `
          <div class="cart-line" data-product-id="${id}">
            <img src="${product.image}" alt="${product.name}" />
            <div class="cart-line-info">
              <p class="cart-line-name">${product.name}</p>
              <p class="cart-line-price">${formatPrice(product.price)} each</p>
              <div class="cart-line-controls">
                <button data-action="decrease" aria-label="Decrease quantity">&minus;</button>
                <span data-role="qty">${qty}</span>
                <button data-action="increase" aria-label="Increase quantity">+</button>
                <button class="remove-link" data-action="remove">Remove</button>
              </div>
            </div>
          </div>
        `;
      })
      .join("");

    container.querySelectorAll(".cart-line").forEach((line) => {
      const id = line.dataset.productId;
      line.addEventListener("click", (e) => {
        const action = e.target.dataset.action;
        if (!action) return;
        if (action === "increase") changeQuantity(id, 1);
        if (action === "decrease") changeQuantity(id, -1);
        if (action === "remove") removeFromCart(id);
      });
    });
  }

  updateCartSummary();
}

function updateCartSummary() {
  const entries = Object.entries(cart).filter(([, qty]) => qty > 0);
  const totalItems = entries.reduce((sum, [, qty]) => sum + qty, 0);
  const subtotal = entries.reduce((sum, [id, qty]) => sum + findProduct(id).price * qty, 0);

  document.getElementById("cart-count").textContent = totalItems;
  document.getElementById("cart-subtotal").textContent = formatPrice(subtotal);
  document.getElementById("checkout-open-btn").disabled = totalItems === 0;
}

/* ---------------------------------------------------------
   3. CART ACTIONS
   --------------------------------------------------------- */

function changeQuantity(productId, delta) {
  const newQty = (cart[productId] || 0) + delta;
  if (newQty <= 0) {
    delete cart[productId];
  } else {
    cart[productId] = newQty;
  }
  saveCart();
  renderCart();
  refreshVisibleProductCard(productId);
}

function removeFromCart(productId) {
  delete cart[productId];
  saveCart();
  renderCart();
  refreshVisibleProductCard(productId);
}

// If the product whose quantity changed is currently visible in the
// grid, redraw just that card so its stepper stays in sync.
function refreshVisibleProductCard(productId) {
  const card = document.querySelector(`.product-card[data-product-id="${productId}"]`);
  if (!card) return;
  const product = findProduct(productId);
  card.outerHTML = productCardHTML(product);
  wireProductCard(document.querySelector(`.product-card[data-product-id="${productId}"]`), product);
}

/* ---------------------------------------------------------
   4. CHECKOUT FLOW
   --------------------------------------------------------- */

function generateOrderNumber() {
  const random = Math.floor(100000 + Math.random() * 900000);
  return "MB-" + random;
}

function renderCheckoutSummary() {
  const entries = Object.entries(cart).filter(([, qty]) => qty > 0);
  const subtotal = entries.reduce((sum, [id, qty]) => sum + findProduct(id).price * qty, 0);

  const lines = entries
    .map(([id, qty]) => {
      const product = findProduct(id);
      return `<div><span>${qty} × ${product.name}</span></div>`;
    })
    .join("");

  document.getElementById("checkout-summary").innerHTML = `
    ${lines}
    <div class="summary-total"><span>Total</span><span>${formatPrice(subtotal)}</span></div>
  `;
}

function handleCheckoutSubmit(e) {
  e.preventDefault();

  const entries = Object.entries(cart).filter(([, qty]) => qty > 0);
  if (entries.length === 0) return;

  const fulfilment = document.querySelector('input[name="fulfilment"]:checked').value;
  const items = entries.map(([id, qty]) => {
    const product = findProduct(id);
    return { id, name: product.name, qty, price: product.price };
  });
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  const order = {
    orderNumber: generateOrderNumber(),
    placedAt: Date.now(),
    status: "new",
    customer: {
      name: document.getElementById("cust-name").value.trim(),
      phone: document.getElementById("cust-phone").value.trim(),
      email: document.getElementById("cust-email").value.trim(),
    },
    fulfilment,
    address: fulfilment === "delivery" ? document.getElementById("cust-address").value.trim() : "",
    paymentMethod: document.getElementById("cust-payment").value,
    notes: document.getElementById("cust-notes").value.trim(),
    items,
    subtotal,
  };

  saveOrder(order);

  // Clear cart
  cart = {};
  saveCart();
  renderCart();
  renderProductGrid();

  // Reset and close checkout, show confirmation
  document.getElementById("checkout-form").reset();
  closeModal("checkout-modal");
  document.getElementById("confirmation-order-number").textContent = order.orderNumber;
  openModal("confirmation-modal");
}

/* ---------------------------------------------------------
   5. ORDER STATUS TRACKING
   Status here is the REAL status staff set on staff.html
   (via orders.js / shared localStorage) — not a simulation.
   --------------------------------------------------------- */

// Remembers which order number is currently shown in the status
// modal, so a live update (see the "storage" listener below) knows
// whether it needs to redraw.
let trackedOrderNumber = null;

function renderOrderStatus(order) {
  const resultEl = document.getElementById("status-result");
  resultEl.classList.remove("hidden");

  if (!order) {
    resultEl.innerHTML = `<p class="status-not-found">We couldn't find an order with that number. Double-check it and try again.</p>`;
    return;
  }

  const currentIndex = ORDER_STATUSES.findIndex((s) => s.key === order.status);

  const stepsHTML = ORDER_STATUSES.map((step, i) => {
    const done = i <= currentIndex;
    return `<li class="${done ? "done" : ""}"><span class="dot"></span>${step.label}</li>`;
  }).join("");

  resultEl.innerHTML = `
    <p><strong>${order.orderNumber}</strong> — ${order.items.reduce((n, it) => n + it.qty, 0)} item(s), ${formatPrice(order.subtotal)}</p>
    <ul class="status-steps">${stepsHTML}</ul>
  `;
}

function handleStatusSubmit(e) {
  e.preventDefault();
  const input = document.getElementById("status-order-number").value.trim().toUpperCase();
  trackedOrderNumber = input;
  renderOrderStatus(getOrder(input));
}

// If staff update this same order's status on staff.html (open in
// another tab), reflect it here automatically without the customer
// needing to re-check.
window.addEventListener("storage", (e) => {
  if (e.key !== ORDERS_STORAGE_KEY || !trackedOrderNumber) return;
  renderOrderStatus(getOrder(trackedOrderNumber));
});

/* ---------------------------------------------------------
   6. WIRING UP THE PAGE
   --------------------------------------------------------- */

function openDrawer() {
  document.getElementById("cart-drawer").classList.add("open");
  document.getElementById("overlay").classList.add("visible");
}
function closeDrawer() {
  document.getElementById("cart-drawer").classList.remove("open");
  document.getElementById("overlay").classList.remove("visible");
}

function openModal(id) {
  document.getElementById(id).classList.add("open");
  document.getElementById("overlay").classList.add("visible");
}
function closeModal(id) {
  document.getElementById(id).classList.remove("open");
  document.getElementById("overlay").classList.remove("visible");
}

function init() {
  renderBusinessInfo();
  renderPaymentOptions();
  renderCategoryNav();
  renderProductGrid();
  renderCart();

  // Cart drawer open/close
  document.getElementById("cart-open-btn").addEventListener("click", openDrawer);
  document.getElementById("cart-close-btn").addEventListener("click", closeDrawer);
  document.getElementById("overlay").addEventListener("click", () => {
    closeDrawer();
    closeModal("checkout-modal");
    closeModal("confirmation-modal");
    closeModal("status-modal");
  });

  // Checkout modal
  document.getElementById("checkout-open-btn").addEventListener("click", () => {
    renderCheckoutSummary();
    closeDrawer();
    openModal("checkout-modal");
  });
  document.getElementById("checkout-close-btn").addEventListener("click", () => closeModal("checkout-modal"));
  document.getElementById("checkout-form").addEventListener("submit", handleCheckoutSubmit);

  // Toggle delivery address field
  document.querySelectorAll('input[name="fulfilment"]').forEach((radio) => {
    radio.addEventListener("change", () => {
      document.getElementById("address-field").classList.toggle(
        "hidden",
        document.querySelector('input[name="fulfilment"]:checked').value !== "delivery"
      );
    });
  });

  // Confirmation modal
  document.getElementById("confirmation-close-btn").addEventListener("click", () => closeModal("confirmation-modal"));

  // Order status modal
  document.getElementById("order-status-open-btn").addEventListener("click", () => openModal("status-modal"));
  document.getElementById("status-close-btn").addEventListener("click", () => closeModal("status-modal"));
  document.getElementById("status-form").addEventListener("submit", handleStatusSubmit);
}

document.addEventListener("DOMContentLoaded", init);
