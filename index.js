const container = document.getElementById("cardContainer");
const cartCount = document.getElementById("cartCount");
const cartBox = document.getElementById("cartItems");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");

let productsData = [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// fetch product

fetch("https://fakestoreapi.com/products?limit=40")
  .then(res => res.json())
  .then(data => {

    productsData = data;   // IMPORTANT
    renderProducts(productsData);
    updateCartCount();
    renderCartlist();
  });

//  RENDER PRODUCTS
function renderProducts(list) {
  container.innerHTML = "";
  list.forEach(product => createCard(product));
}


//  CREATE CARD
function createCard(product) {
  const card = document.createElement("div");
  card.className = "card";

  card.innerHTML = `
    <img src="${product.image}" width="150"
         style="cursor:pointer"
         onclick="goToDetails(${product.id})">

    <h5 style="cursor:pointer"
        onclick="goToDetails(${product.id})">
        ${product.title.slice(0, 40)}...
    </h5>

    <p>₹${product.price.toLocaleString("en-IN")}</p>

    <button onclick="event.stopPropagation(); addToCart(${product.id})">
      Add To Cart
    </button>
  `;

  card.addEventListener("click", function () {
    window.location.href = `product.html?id=${product.id}`;
  });

  container.appendChild(card);
}


// redirect 
function goToDetails(id) {
  window.location.href = `product.html?id=${id}`;
}


function goTOCheckout() {
  window.location.href = "checkout.html"
}

// ADD TO CART 

function addToCart(id) {
  const product = productsData.find(p => p.id === id);
  const item = cart.find(i => i.id === id);

  if (item) {
    item.qty++;
  } else {
    cart.push({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      qty: 1
    });
  }

  saveAndRender();
}



// INCREASE
function increaseQty(id) {
  const item = cart.find(i => i.id === id);
  if (item) item.qty++;

  updateCartCount();
  renderCartlist();
  saveAndRender();
}

// DECREASE


function decreaseQty(id) {
  const item = cart.find(i => i.id === id);

  if (!item) return;

  if (item.qty > 1) {
    item.qty--;
  } else {
    // ❗ Important Condition
    if (cart.length > 1) {
      cart = cart.filter(i => i.id !== id);
    } else {
      // alert("At least one product must remain in cart!");
      return;
    }
  }


  updateCartCount();
  renderCartlist();
  saveAndRender();

}
// REMOVE

function removeItem(id) {
  if (cart.length >= 1)
    cart = cart.filter(i => i.id !== id);
  saveAndRender();
}



// SAVE + RENDER
function saveAndRender() {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  renderCartlist();
}


//  UPDATE COUNT
function updateCartCount() {
  let total = 0;
  cart.forEach(i => total += i.qty);
  cartCount.innerText = total;
}

// RENDER CART 

function renderCartlist() {
  cartBox.innerHTML = "";

  if (cart.length === 0) {
    cartBox.innerHTML = "<p>Cart Empty</p>";
    return;
  }

  cart.forEach(item => {
    cartBox.innerHTML += `
      <div style="display:flex;align-items:center;margin-bottom:10px">
        <img src="${item.image}" width="50">
        <div style="flex:1;margin-left:10px">
          <div>${item.title}</div>
          <div>₹${item.price}</div>
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



//  SEARCH 
searchInput.addEventListener("input", () => {
  const value = searchInput.value.toLowerCase().trim();

  const filtered = productsData.filter(p =>
    p.title.toLowerCase().includes(value)
  );

  if (filtered.length === 0) {
    container.innerHTML = `
      <p style="padding:20px;font-size:18px;">
        No product found
      </p>`;
    return;
  }

  renderProducts(filtered);
});



//  SORT 

sortSelect.addEventListener("change", () => {

  const sortValue = sortSelect.value;
  let sortedProducts = [...productsData];

  if (sortValue === "low") {
    sortedProducts.sort((a, b) => a.price - b.price);
  }

  if (sortValue === "high") {
    sortedProducts.sort((a, b) => b.price - a.price);
  }

  if (sortValue === "az") {
    sortedProducts.sort((a, b) =>
      a.title.localeCompare(b.title)
    );
  }

  renderProducts(sortedProducts);
});


document.addEventListener("DOMContentLoaded", function () {
  const cartItemsContainer = document.getElementById("cartItems");
  const cartCount = document.getElementById("cartCount");
  const checkoutBtn = document.getElementById("checkoutBtn");

  // SAVE CART

  function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    renderCart();
  }


  // UPDATE COUNT

  function updateCartCount() {
    let totalQty = cart.reduce((acc, item) => acc + item.qty, 0);
    if (cartCount) {
      cartCount.innerText = totalQty;
    }
  }

  // RENDER CART


  function renderCart() {

    if (!cartItemsContainer) return;

    cartItemsContainer.innerHTML = "";

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = "<p>Cart is empty</p>";
      return;
    }

    cart.forEach(item => {
      cartItemsContainer.innerHTML += `
        <div class="card p-2 mb-2">
          <h6>${item.title}</h6>
          <p>₹${item.price}</p>
           <img src="${item.image}" width="30">
          <div class="d-flex align-items-center gap-2">
            <button class="btn btn-sm btn-secondary minus" data-id="${item.id}">-</button>
            <span>${item.qty}</span>
            <button class="btn btn-sm btn-secondary plus" data-id="${item.id}">+</button>
            <button class="btn btn-sm btn-danger remove" data-id="${item.id}">X</button>
          </div>
        </div>
      `;
    });
  }


  // BUTTON EVENTS

  document.addEventListener("click", function (e) {

    if (e.target.classList.contains("plus")) {
      let id = Number(e.target.dataset.id);
      let item = cart.find(p => p.id === id);
      if (item) {
        item.qty += 1;
        saveCart();
      }
    }

    if (e.target.classList.contains("minus")) {
      let id = Number(e.target.dataset.id);
      let item = cart.find(p => p.id === id);
      if (item && item.qty > 1) {
        item.qty -= 1;
        saveCart();
      }
    }

    if (e.target.classList.contains("remove")) {
      let id = Number(e.target.dataset.id);
      cart = cart.filter(item => item.id !== id);
      saveCart();
    }
  });

  // CHECKOUT BUTTON FIX

  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", function () {

      if (cart.length === 0) {
        alert("Cart is empty");
        return;
      }

      window.location.href = "checkout.html";
    });
  }

  // INIT
  updateCartCount();
  renderCart();

});
