/* Tradition Threads — static GitHub Pages demo.
   Sample products/prices only. No real payment or server-side order storage. */
"use strict";

const PRODUCTS = [
  {id:1,name:"Embroidered Festive Kurta",culture:"Indian",occasion:"Festival",price:39,tag:"Student favourite",image:"https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=750&q=80"},
  {id:2,name:"Classic Celebration Saree",culture:"Indian",occasion:"Wedding",price:59,tag:"Special occasion",image:"https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=750&q=80"},
  {id:3,name:"Ankara Print Outfit",culture:"African",occasion:"Cultural Day",price:45,tag:"Colourful pick",image:"https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=750&q=80"},
  {id:4,name:"Lightweight Yukata Style",culture:"Japanese",occasion:"Festival",price:48,tag:"Festival ready",image:"https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=750&q=80"},
  {id:5,name:"Everyday Printed Kurta",culture:"South Asian",occasion:"Everyday",price:25,tag:"Budget friendly",image:"https://images.unsplash.com/photo-1597983073493-88cd35cf93e0?auto=format&fit=crop&w=750&q=80"},
  {id:6,name:"Traditional Occasion Set",culture:"Indian",occasion:"Cultural Day",price:52,tag:"Featured",image:"https://images.unsplash.com/photo-1583391733956-6c78276477e8?auto=format&fit=crop&w=750&q=80"},
  {id:7,name:"Patterned Festival Wrap",culture:"African",occasion:"Festival",price:32,tag:"Easy to style",image:"https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=750&q=80"},
  {id:8,name:"Ceremony Accessories Set",culture:"South Asian",occasion:"Wedding",price:18,tag:"Finishing touch",image:"https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=750&q=80"}
];

const $ = (selector) => document.querySelector(selector);
const productGrid = $("#productGrid");
const cartDrawer = $("#cartDrawer");
let cart = loadCart();
let toastTimer;

function formatMoney(amount) {
  return new Intl.NumberFormat("en-CA", {style:"currency", currency:"CAD"}).format(amount);
}
function loadCart() {
  try {
    const parsed = JSON.parse(localStorage.getItem("traditionThreadsCart") || "[]");
    return Array.isArray(parsed) ? parsed.filter(item => PRODUCTS.some(p => p.id === item.id) && Number.isInteger(item.qty) && item.qty > 0) : [];
  } catch { return []; }
}
function saveCart() {
  try { localStorage.setItem("traditionThreadsCart", JSON.stringify(cart)); } catch { /* Storage may be unavailable; cart still works for this visit. */ }
}
function renderProducts() {
  const query = $("#searchInput").value.trim().toLowerCase();
  const culture = $("#cultureFilter").value;
  const occasion = $("#occasionFilter").value;
  const sort = $("#sortFilter").value;
  let list = PRODUCTS.filter(p =>
    `${p.name} ${p.culture} ${p.occasion} ${p.tag}`.toLowerCase().includes(query) &&
    (culture === "All" || p.culture === culture) &&
    (occasion === "All" || p.occasion === occasion)
  );
  if (sort === "low") list.sort((a,b) => a.price - b.price);
  if (sort === "high") list.sort((a,b) => b.price - a.price);
  $("#productCount").textContent = `${list.length} sample product${list.length === 1 ? "" : "s"}`;
  $("#activeFilterText").textContent = list.length === PRODUCTS.length ? "Showing all sample products" : `Showing ${list.length} matching product${list.length === 1 ? "" : "s"}`;
  productGrid.innerHTML = "";
  if (!list.length) {
    productGrid.innerHTML = '<div class="no-results"><strong>No outfits found.</strong><p>Try a different search or clear your filters.</p></div>';
    return;
  }
  list.forEach(product => {
    const card = document.createElement("article");
    card.className = "product-card";
    card.innerHTML = `
      <div class="product-image">
        <img src="${product.image}" alt="${escapeHTML(product.name)}" loading="lazy">
        <span class="product-tag">${escapeHTML(product.tag)}</span>
      </div>
      <div class="product-info">
        <div class="product-meta">${escapeHTML(product.culture)} · ${escapeHTML(product.occasion)}</div>
        <h3>${escapeHTML(product.name)}</h3>
        <div class="product-bottom">
          <span class="product-price">${formatMoney(product.price)} <small>CAD</small></span>
          <button class="add-button" type="button" aria-label="Add ${escapeHTML(product.name)} to bag" data-add="${product.id}">+</button>
        </div>
      </div>`;
    productGrid.appendChild(card);
  });
}
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
}
function addToCart(id) {
  const found = cart.find(item => item.id === id);
  if (found) found.qty += 1;
  else cart.push({id, qty:1});
  saveCart();
  renderCart();
  const product = PRODUCTS.find(p => p.id === id);
  showToast(`${product.name} added to your bag`);
}
function changeQuantity(id, change) {
  const item = cart.find(entry => entry.id === id);
  if (!item) return;
  item.qty += change;
  if (item.qty < 1) cart = cart.filter(entry => entry.id !== id);
  saveCart();
  renderCart();
}
function removeFromCart(id) {
  cart = cart.filter(entry => entry.id !== id);
  saveCart();
  renderCart();
}
function renderCart() {
  const count = cart.reduce((total,item) => total + item.qty, 0);
  const total = cart.reduce((sum,item) => {
    const product = PRODUCTS.find(p => p.id === item.id);
    return sum + (product ? product.price * item.qty : 0);
  }, 0);
  $("#cartCount").textContent = count;
  $("#drawerCount").textContent = `(${count})`;
  $("#cartTotal").textContent = formatMoney(total);
  const container = $("#cartItems");
  if (!cart.length) {
    container.innerHTML = '<p class="empty-cart">Your bag is empty.<br>Explore the collection and add an outfit you like.</p>';
    $("#orderButton").disabled = true;
    $("#orderButton").style.opacity = ".55";
    return;
  }
  $("#orderButton").disabled = false;
  $("#orderButton").style.opacity = "1";
  container.innerHTML = "";
  cart.forEach(item => {
    const product = PRODUCTS.find(p => p.id === item.id);
    if (!product) return;
    const row = document.createElement("div");
    row.className = "cart-line";
    row.innerHTML = `
      <img src="${product.image}" alt="">
      <div>
        <h3>${escapeHTML(product.name)}</h3>
        <small>${formatMoney(product.price)} each</small>
        <div class="quantity-control">
          <button type="button" data-qty="-1" data-id="${product.id}" aria-label="Decrease quantity">−</button>
          <span>${item.qty}</span>
          <button type="button" data-qty="1" data-id="${product.id}" aria-label="Increase quantity">+</button>
        </div>
        <button class="remove-item" type="button" data-remove="${product.id}">Remove</button>
      </div>
      <span class="line-total">${formatMoney(product.price * item.qty)}</span>`;
    container.appendChild(row);
  });
}
function openCart() {
  document.body.classList.add("cart-open");
  cartDrawer.setAttribute("aria-hidden","false");
  $("#closeCart").focus();
}
function closeCart() {
  document.body.classList.remove("cart-open");
  cartDrawer.setAttribute("aria-hidden","true");
  $("#openCart").focus();
}
function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("visible"), 2600);
}
function resetFilters() {
  $("#searchInput").value = "";
  $("#cultureFilter").value = "All";
  $("#occasionFilter").value = "All";
  $("#sortFilter").value = "featured";
  renderProducts();
}
function chooseCulture(culture) {
  $("#cultureFilter").value = culture;
  renderProducts();
  $("#shop").scrollIntoView({behavior:"smooth"});
}
function prepareOrderEnquiry() {
  if (!cart.length) {
    showToast("Your bag is empty.");
    return;
  }
  const lines = cart.map(item => {
    const p = PRODUCTS.find(product => product.id === item.id);
    return `${p.name} — quantity ${item.qty} — ${formatMoney(p.price * item.qty)}`;
  });
  const total = cart.reduce((sum,item) => sum + PRODUCTS.find(p => p.id === item.id).price * item.qty, 0);
  const body = `Hello, I would like to ask about these sample items from Tradition Threads:\n\n${lines.join("\n")}\n\nEstimated sample subtotal: ${formatMoney(total)} CAD\n\nPlease confirm availability, sizes, final prices, and delivery/pickup options.\n\nName:\nPreferred contact:`;
  const subject = "Tradition Threads — Order Enquiry";
  // No email address has been supplied in the project charter; open a prepared draft in the visitor's email app.
  window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  showToast("Order enquiry prepared. Choose an email app to continue.");
}
function prepareFeedback(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);
  const subject = "Tradition Threads — Student Feedback";
  const body = `Name: ${data.get("name")}\nEmail: ${data.get("email")}\nInterested in: ${data.get("interest")}\n\nMessage:\n${data.get("message")}`;
  // Replace the blank mailto recipient with the real project email before publishing.
  window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  showToast("Feedback email draft prepared.");
}

productGrid.addEventListener("click", event => {
  const button = event.target.closest("[data-add]");
  if (button) addToCart(Number(button.dataset.add));
});
$("#cartItems").addEventListener("click", event => {
  const quantityButton = event.target.closest("[data-qty]");
  const removeButton = event.target.closest("[data-remove]");
  if (quantityButton) changeQuantity(Number(quantityButton.dataset.id), Number(quantityButton.dataset.qty));
  if (removeButton) removeFromCart(Number(removeButton.dataset.remove));
});
$("#searchInput").addEventListener("input", renderProducts);
["cultureFilter","occasionFilter","sortFilter"].forEach(id => $(`#${id}`).addEventListener("change", renderProducts));
$("#clearFilters").addEventListener("click", resetFilters);
document.querySelectorAll("[data-culture]").forEach(button => button.addEventListener("click", () => chooseCulture(button.dataset.culture)));
$("#openCart").addEventListener("click", openCart);
$("#closeCart").addEventListener("click", closeCart);
$("#continueShopping").addEventListener("click", closeCart);
$("#cartBackdrop").addEventListener("click", closeCart);
$("#orderButton").addEventListener("click", prepareOrderEnquiry);
$("#feedbackForm").addEventListener("submit", prepareFeedback);
$("#menuToggle").addEventListener("click", () => {
  const nav = $("#navLinks");
  const isOpen = nav.classList.toggle("open");
  $("#menuToggle").setAttribute("aria-expanded", String(isOpen));
  $("#menuToggle").setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
});
$("#navLinks").querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  $("#navLinks").classList.remove("open");
  $("#menuToggle").setAttribute("aria-expanded","false");
}));
document.addEventListener("keydown", event => { if (event.key === "Escape" && document.body.classList.contains("cart-open")) closeCart(); });
$("#year").textContent = new Date().getFullYear();
renderProducts();
renderCart();
