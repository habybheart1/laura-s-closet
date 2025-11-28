// Select DOM elements
const iconCart = document.querySelector(".icon-cart");
const closeCart = document.querySelector(".close");
const body = document.querySelector("body");
const listProductHTML = document.querySelector(".listProduct");
const listCartHTML = document.querySelector(".listCart");
const iconCartSpan = document.querySelector(".icon-cart span");

let listProducts = [];
let carts = [];

// Toggle cart visibility
iconCart.addEventListener("click", () => {
  body.classList.toggle("showCart");
});
closeCart.addEventListener("click", () => {
  body.classList.toggle("showCart");
});

// Render products
const addDataToHtml = () => {
  listProductHTML.innerHTML = "";
  if (listProducts.length > 0) {
    listProducts.forEach((product) => {
      const newProduct = document.createElement("div");
      newProduct.classList.add("item");
      newProduct.dataset.id = product.id;
      newProduct.innerHTML = `
        <img src="${product.image}" alt="arrivals">
        <h2>${product.name}</h2>
        <div class="product-price">$${product.price}</div>
        <button class="addCart">Add To Cart</button>
      `;
      listProductHTML.appendChild(newProduct);
    });
  }
};

// Add to cart
listProductHTML.addEventListener("click", (event) => {
  const target = event.target;
  if (target.classList.contains("addCart")) {
    const product_id = target.parentElement.dataset.id;
    addToCart(product_id);
  }
});

const addToCart = (product_id) => {
  const positionThisProductInCart = carts.findIndex(
    (value) => value.product_id == product_id
  );

  if (carts.length <= 0) {
    carts = [{ product_id: product_id, quantity: 1 }];
  } else if (positionThisProductInCart < 0) {
    carts.push({ product_id: product_id, quantity: 1 });
  } else {
    carts[positionThisProductInCart].quantity += 1;
  }

  addCartToHtml();
};

// Render cart
const addCartToHtml = () => {
  listCartHTML.innerHTML = "";
  let totalQuantity = 0;

  if (carts.length > 0) {
    carts.forEach((cart) => {
      totalQuantity += cart.quantity;

      const newCart = document.createElement("div");
      newCart.classList.add("item");
      newCart.dataset.id = cart.product_id;

      const positionProduct = listProducts.findIndex(
        (value) => value.id == cart.product_id
      );
      const info = listProducts[positionProduct];

      const priceNum =
        typeof info.price === "number"
          ? info.price
          : parseFloat(String(info.price).replace(/[^0-9.]/g, ""));

      newCart.innerHTML = `
        <div class="image">
          <img src="${info.image}" alt="arrivals">
        </div>
        <div class="name">${info.name}</div>
        <div class="totalPrice">$${(priceNum * cart.quantity).toFixed(2)}</div>
        <div class="quantity">
          <span class="minus">-</span>
          <span>${cart.quantity}</span>
          <span class="plus">+</span>
        </div>
      `;
      listCartHTML.appendChild(newCart);
    });
  }

  iconCartSpan.innerHTML = totalQuantity;
};

// Handle plus/minus clicks
listCartHTML.addEventListener("click", (event) => {
  const target = event.target;
  if (target.classList.contains("minus") || target.classList.contains("plus")) {
    const itemEl = target.closest(".item"); // ✅ correct element
    if (!itemEl) return;

    const product_id = itemEl.dataset.id;
    const type = target.classList.contains("plus") ? "plus" : "minus";

    changeQuantity(product_id, type);
  }
});

// Change quantity
const changeQuantity = (product_id, type) => {
  const positionItemInCart = carts.findIndex(
    (value) => value.product_id == product_id
  );

  if (positionItemInCart >= 0) {
    if (type === "plus") {
      carts[positionItemInCart].quantity += 1;
    } else {
      const valueChange = carts[positionItemInCart].quantity - 1;
      if (valueChange > 0) {
        carts[positionItemInCart].quantity = valueChange;
      } else {
        carts.splice(positionItemInCart, 1);
      }
    }
  }

  addCartToHtml();
};

// Initialize app
const initApp = () => {
  // ✅ Clear cart on refresh
  carts = [];

  fetch("products.json")
    .then((response) => response.json())
    .then((data) => {
      listProducts = data;
      addDataToHtml();
      addCartToHtml();
    });
};

initApp();