
// LOAD CART 
let cart = JSON.parse(localStorage.getItem("cart")) || [];

const checkoutItems = document.getElementById("checkoutItems");
const totalAmountEl = document.getElementById("totalAmount");
const cartCountEl = document.getElementById("cartCount"); // ✅ NEW


//  UPDATE CART BADGE 
function updateCartBadge() {
  if (!cartCountEl) return;

  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  cartCountEl.textContent = totalQty;
}


// RENDER CHECKOUT
function renderCheckout() {
  if (!checkoutItems) return;

  checkoutItems.innerHTML = "";

  if (cart.length === 0) {
    checkoutItems.innerHTML = "<p>Cart is empty</p>";
    totalAmountEl.textContent = "0";
    updateCartBadge(); // ✅ IMPORTANT
    return;
  }

  let total = 0;
  let html = "";

  cart.forEach(item => {
    const subtotal = item.price * item.qty;
    total += subtotal;

    html += `
      <div class="card p-3 mb-3">
        <div class="d-flex gap-3 align-items-center">

          <img
            src="${item.image || 'https://via.placeholder.com/40'}"
            width="40"
            height="40"
            style="object-fit:contain;"
            onerror="this.src='https://via.placeholder.com/40'"
          >

          <div>
            <h5 class="mb-1">${item.title}</h5>
            <div>Price: ₹${item.price}</div>
            <div>Quantity: ${item.qty}</div>
            <div><strong>Subtotal: ₹${subtotal.toFixed(2)}</strong></div>
          </div>

        </div>
      </div>
    `;
  });

  checkoutItems.innerHTML = html;
  totalAmountEl.textContent = total.toFixed(2);

  updateCartBadge(); // ✅ VERY IMPORTANT
}


//  INITIAL LOAD 
renderCheckout();
updateCartBadge();


// PLACE ORDER 
document.getElementById("checkoutForm").addEventListener("submit", function(e) {
  e.preventDefault();

  alert("Order Placed Successfully!");

  localStorage.removeItem("cart");
  window.location.href = "index.html";
});


//  USER LOGIN 
document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const registerBtn = document.getElementById("registerBtn");

  if (user && user.isLoggedIn) {
    registerBtn.innerText = user.name;
  } else {
    registerBtn.innerText = "Register";

    registerBtn.onclick = () => {
      window.location.href = "registration.html";
    };
  }
});

