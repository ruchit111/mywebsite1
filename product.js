const params = new URLSearchParams(window.location.search);
const productId = parseInt(params.get("id"));

const productContainer = document.getElementById("productDetails");
const cartSidebar = document.getElementById("cartSidebar");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartIcon = document.getElementById("cartIcon");

let cart = JSON.parse(localStorage.getItem("cart")) || [];


// SIDEBAR TOGGLE 
function toggleCart() {
  cartSidebar.classList.toggle("active");
}

cartIcon.addEventListener("click", toggleCart);


// FETCH PRODUCT 
if (productId) {
  fetch(`https://fakestoreapi.com/products/${productId}`)
    .then(res => res.json())
    .then(product => {

     
      productContainer.innerHTML = `
        <div class="product-wrapper">
          <img src="${product.image}" class="product-img">
          <div>
            <h2>${product.title}</h2>
            <div class="price">$${product.price}</div>
            <p>${product.description}</p>
            <button onclick="addToCart(${product.id})">Add To Cart</button>
          </div>
        </div>
      `;
      
      window.currentProduct = product;
    
    });
    
}


// ADD TO CART 
function addToCart(id) {

  const product = window.currentProduct;

  const existing = cart.find(i => i.id === id);

  if (existing) {
    existing.qty++;
  } else {
    cart.push({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      qty: 1
    });
  }

  saveCart();
  renderCart();
  toggleCart();
}


//  INCREASE
function increaseQty(id) {
  const item = cart.find(i => i.id === id);
  if (item) item.qty++;
  saveCart();
  renderCart();
}


// DECREASE 
function decreaseQty(id) {
  const item = cart.find(i => i.id === id);

  if(!item) return;

  if(item.qty>1){
    item.qty--;
  }else{

  if (cart.length > 1) {
    cart = cart.filter(i => i.id !== id);
  }else{
    return;
  }
  } 
  saveCart();
  renderCart();
}


// REMOVE 
function removeItem(id) {
  if (cart.length >= 1) {
    cart = cart.filter(i => i.id !== id);
    saveCart();
    updateCartCount();
    renderCart();
  }
}

// SAVE 
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  renderCart();
}


// UPDATE COUNT 
function updateCartCount() {
  let total = 0;
  cart.forEach(i => total += i.qty);
  cartCount.innerText = total;
}


// RENDER 
function renderCart() {

  cartItems.innerHTML = "";

  if (cart.length === 0) {
    cartItems.innerHTML = "<p>Cart is empty</p>";
    return;
  }

  cart.forEach(item => {
    cartItems.innerHTML += `
      <div style="display:flex;align-items:center;margin-bottom:15px">

        <img src="${item.image}" width="50">

        <div style="flex:1;margin-left:10px">
          <div>${item.title}</div>
          <div>$${item.price}</div>
        </div>

        <div>
          <button onclick="decreaseQty(${item.id})">-</button>
          <span>${item.qty}</span>
          <button onclick="increaseQty(${item.id})">+</button>
          <button onclick="removeItem(${item.id})">❌</button>
        </div>

      </div>
    `;
  });
}


// INITIAL LOAD 
updateCartCount();
renderCart();


// USER LOGIN

    document.addEventListener("DOMContentLoaded", () => {
      const user = JSON.parse(localStorage.getItem("user"));
      const registerBtn = document.getElementById("registerBtn");
      // const cardContainer = document.getElementById("cardContainer");

      if (user && user.isLoggedIn) {
        registerBtn.innerText = user.name;
        // cardContainer.style.display = "grid";
      } else {
        registerBtn.innerText = "Register";
        // cardContainer.style.display = "none";

        registerBtn.onclick = () => {
          window.location.href = "registration.html";
        };
      }
    });



































