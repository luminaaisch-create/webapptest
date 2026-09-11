/* =========================================================
   STAFF.JS
   Staff-side behaviour: PIN gate + Kanban order board.

   Orders themselves are read and written through orders.js —
   the exact same storage that script.js (the customer page)
   uses. This file never creates its own order data; it only
   displays and updates the orders customers have placed.
   ========================================================= */

const STAFF_PIN = "1234";
const STAFF_SESSION_KEY = "mebaca_staff_authed";

/* ---------------------------------------------------------
   LOGIN / LOGOUT
   --------------------------------------------------------- */

function isStaffLoggedIn() {
  return sessionStorage.getItem(STAFF_SESSION_KEY) === "true";
}

function showLoginScreen() {
  document.getElementById("staff-login-screen").classList.remove("hidden");
  document.getElementById("staff-board-screen").classList.add("hidden");
}

function showBoardScreen() {
  document.getElementById("staff-login-screen").classList.add("hidden");
  document.getElementById("staff-board-screen").classList.remove("hidden");
  renderBoard();
}

function handleLoginSubmit(e) {
  e.preventDefault();
  const input = document.getElementById("staff-pin-input");
  const errorEl = document.getElementById("staff-login-error");

  if (input.value.trim() === STAFF_PIN) {
    sessionStorage.setItem(STAFF_SESSION_KEY, "true");
    errorEl.classList.add("hidden");
    input.value = "";
    showBoardScreen();
  } else {
    errorEl.classList.remove("hidden");
    input.value = "";
    input.focus();
  }
}

function handleLogout() {
  sessionStorage.removeItem(STAFF_SESSION_KEY);
  showLoginScreen();
}

/* ---------------------------------------------------------
   KANBAN BOARD
   --------------------------------------------------------- */

function renderBoard() {
  const board = document.getElementById("kanban-board");
  const orders = Object.values(getAllOrders());

  document.getElementById("staff-empty-note").classList.toggle("hidden", orders.length > 0);

  board.innerHTML = ORDER_STATUSES.map((status) => columnHTML(status, orders)).join("");

  // Wire up each "move to next stage" button after inserting into the DOM
  board.querySelectorAll("[data-advance-order]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const orderNumber = btn.dataset.advanceOrder;
      const target = btn.dataset.advanceTo;
      updateOrderStatus(orderNumber, target);
      renderBoard();
    });
  });
}

function columnHTML(status, allOrders) {
  const ordersInColumn = allOrders
    .filter((o) => o.status === status.key)
    .sort((a, b) => a.placedAt - b.placedAt);

  return `
    <div class="kanban-column">
      <div class="kanban-column-header">
        <h2>${status.label}</h2>
        <span class="kanban-count">${ordersInColumn.length}</span>
      </div>
      <div class="kanban-column-body">
        ${ordersInColumn.length === 0
          ? `<p class="kanban-empty">No orders</p>`
          : ordersInColumn.map(orderCardHTML).join("")
        }
      </div>
    </div>
  `;
}

function orderCardHTML(order) {
  const itemsHTML = order.items
    .map((item) => `<li>${item.qty} × ${item.name}</li>`)
    .join("");

  const next = nextStatus(order.status);
  const actionHTML = next
    ? `<button class="primary-btn full-width order-card-action" data-advance-order="${order.orderNumber}" data-advance-to="${next}">
         Move to ${statusLabel(next)}
       </button>`
    : `<p class="order-card-done">Order complete</p>`;

  return `
    <article class="order-card">
      <div class="order-card-top">
        <span class="order-card-number">${order.orderNumber}</span>
        <span class="order-card-time">${formatOrderTime(order.placedAt)}</span>
      </div>

      <p class="order-card-customer">${order.customer.name}</p>
      <p class="order-card-contact">${order.customer.phone}</p>

      <ul class="order-card-items">${itemsHTML}</ul>

      <div class="order-card-meta">
        <span>${formatPrice(order.subtotal)}</span>
        <span>${order.paymentMethod || "—"}</span>
      </div>
      <p class="order-card-fulfilment">${order.fulfilment === "delivery" ? "Delivery" : "Pickup"}</p>

      ${actionHTML}
    </article>
  `;
}

/* ---------------------------------------------------------
   WIRING UP THE PAGE
   --------------------------------------------------------- */

function init() {
  document.getElementById("staff-business-name").textContent = BUSINESS.name;
  document.getElementById("staff-login-brand").textContent = BUSINESS.name;

  document.getElementById("staff-login-form").addEventListener("submit", handleLoginSubmit);
  document.getElementById("staff-logout-btn").addEventListener("click", handleLogout);
  document.getElementById("staff-refresh-btn").addEventListener("click", renderBoard);

  // Live-update the board when a customer places a new order, or when
  // this same order is changed from another tab — no manual refresh needed.
  window.addEventListener("storage", (e) => {
    if (e.key === ORDERS_STORAGE_KEY && isStaffLoggedIn()) {
      renderBoard();
    }
  });

  if (isStaffLoggedIn()) {
    showBoardScreen();
  } else {
    showLoginScreen();
  }
}

document.addEventListener("DOMContentLoaded", init);
