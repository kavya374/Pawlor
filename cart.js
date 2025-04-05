const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const cartCount = document.querySelector(".cart-count");

let cartItems = JSON.parse(localStorage.getItem("pawlorCartItems")) || [];

function updateCartCount() {
  if (cartCount) {
    const totalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    cartCount.textContent = totalCount;
  }
}

function renderCart() {
  cartItemsContainer.innerHTML = '';
  if (cartItems.length === 0) {
  cartItemsContainer.innerHTML = `
    <div class="empty-cart">
      <h3>Oops! Your cart is empty 🛒</h3>
      <p>Looks like you haven't added anything yet.</p>
      <a href="shop.html" class="btn-continue">Continue Shopping</a>
    </div>
  `;
  cartTotal.textContent = "0.00";
  return;
}
  let total = 0;

  cartItems.forEach((item, index) => {
    total += item.price * item.quantity;

    const cartItemEl = document.createElement("div");
    cartItemEl.className = "cart-item";
    cartItemEl.innerHTML = `
      <img src="${item.image}" alt="${item.name}" width="80">
      <div class="item-col">
        <div>
          <h4>${item.name}</h4>
          <p>$${item.price.toFixed(2)}</p>
          <p>Quantity: ${item.quantity}</p>
        </div>
        <div>
          <button class="remove-btn" data-index="${index}">Remove</button>
        </div>
      </div>
    `;
    cartItemsContainer.appendChild(cartItemEl);
  });

  cartTotal.textContent = total.toFixed(2);

  document.querySelectorAll(".remove-btn").forEach(btn => {
    btn.addEventListener("click", function () {
      const index = this.getAttribute("data-index");
      cartItems.splice(index, 1);
      localStorage.setItem("pawlorCartItems", JSON.stringify(cartItems));
      renderCart();
      updateCartCount();
    });
  });
}

renderCart();
updateCartCount();