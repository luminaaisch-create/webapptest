/* =========================================================
   ORDERS.JS
   Shared between index.html (customer) and staff.html (staff).
   This is the single source of truth for order data — both
   pages read and write through the functions here, using the
   same localStorage key, so an order placed by a customer and
   a status change made by staff are always looking at the
   same record.

   There's no real backend in this prototype: "shared" means
   "same browser's localStorage". Customer and staff pages
   should be open as two tabs in the same browser for the
   live-update behaviour to work.
   ========================================================= */

const ORDERS_STORAGE_KEY = "mebaca_orders";

// The four stages every order moves through, in order.
const ORDER_STATUSES = [
  { key: "new", label: "New" },
  { key: "preparing", label: "Preparing" },
  { key: "ready", label: "Ready" },
  { key: "completed", label: "Completed" },
];

function loadFromStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (err) {
    return fallback;
  }
}

function saveToStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// orders are stored as an object keyed by order number:
// { "MB-482913": { orderNumber, status, ... }, ... }
function getAllOrders() {
  return loadFromStorage(ORDERS_STORAGE_KEY, {});
}

function getOrder(orderNumber) {
  return getAllOrders()[orderNumber] || null;
}

function saveOrder(order) {
  const orders = getAllOrders();
  orders[order.orderNumber] = order;
  saveToStorage(ORDERS_STORAGE_KEY, orders);
}

// Updates just the status of an existing order. Returns the
// updated order, or null if no order with that number exists.
function updateOrderStatus(orderNumber, newStatus) {
  const orders = getAllOrders();
  const order = orders[orderNumber];
  if (!order) return null;
  order.status = newStatus;
  order.statusUpdatedAt = Date.now();
  saveToStorage(ORDERS_STORAGE_KEY, orders);
  return order;
}

function statusLabel(statusKey) {
  const match = ORDER_STATUSES.find((s) => s.key === statusKey);
  return match ? match.label : statusKey;
}

// The status that comes after the given one, or null if it's
// already the last stage.
function nextStatus(statusKey) {
  const index = ORDER_STATUSES.findIndex((s) => s.key === statusKey);
  if (index === -1 || index === ORDER_STATUSES.length - 1) return null;
  return ORDER_STATUSES[index + 1].key;
}

function generateOrderNumber() {
  const random = Math.floor(100000 + Math.random() * 900000);
  return "MB-" + random;
}

function formatPrice(amount) {
  return "RM " + amount.toFixed(2);
}

function formatOrderTime(timestamp) {
  return new Date(timestamp).toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}
