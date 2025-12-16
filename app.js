document.addEventListener("DOMContentLoaded", () => {
  /* =======================
     DOM ELEMENTS
  ======================== */
  const body = document.body;
  const iconCart = document.querySelector(".icon-cart");
  const closeCart = document.querySelector(".close");
  const listProductHTML = document.querySelector(".listProduct");
  const listCartHTML = document.querySelector(".listCart");
  const iconCartSpan = document.querySelector(".icon-cart span");
  const themeSwitch = document.getElementById("theme-switch");

  let listProducts = [];
  let carts = [];

  /* =======================
     CART TOGGLE
  ======================== */
  if (iconCart) {
    iconCart.addEventListener("click", () => {
      body.classList.toggle("showCart");
    });
  }

  if (closeCart) {
    closeCart.addEventListener("click", () => {
      body.classList.toggle("showCart");
    });
  }

  /* =======================
     RENDER PRODUCTS
  ======================== */
  const addDataToHtml = () => {
    if (!listProductHTML) return;

    listProductHTML.innerHTML = "";

    listProducts.forEach((product) => {
      const item = document.createElement("div");
      item.className = "item";
      item.dataset.id = product.id;

      item.innerHTML = `
        <img src="${product.image}" alt="arrivals">
        <h2>${product.name}</h2>
        <div class="product-price">$${product.price}</div>
        <button class="addCart">Add To Cart</button>
      `;

      listProductHTML.appendChild(item);
    });
  };

  /* =======================
     ADD TO CART
  ======================== */
  if (listProductHTML) {
    listProductHTML.addEventListener("click", (e) => {
      if (e.target.classList.contains("addCart")) {
        const productId = e.target.closest(".item").dataset.id;
        addToCart(productId);
      }
    });
  }

  const addToCart = (productId) => {
    const index = carts.findIndex((c) => c.product_id == productId);

    if (index < 0) {
      carts.push({ product_id: productId, quantity: 1 });
    } else {
      carts[index].quantity++;
    }

    updateCartHtml();
  };

  /* =======================
     RENDER CART
  ======================== */
  const updateCartHtml = () => {
    if (!listCartHTML || !iconCartSpan) return;

    listCartHTML.innerHTML = "";
    let totalQty = 0;

    carts.forEach((cart) => {
      totalQty += cart.quantity;

      const product = listProducts.find(
        (p) => p.id == cart.product_id
      );

      const price = Number(product.price) || 
        parseFloat(String(product.price).replace(/[^0-9.]/g, ""));

      const item = document.createElement("div");
      item.className = "item";
      item.dataset.id = cart.product_id;

      item.innerHTML = `
        <div class="image">
          <img src="${product.image}" alt="">
        </div>
        <div class="name">${product.name}</div>
        <div class="totalPrice">$${(price * cart.quantity).toFixed(2)}</div>
        <div class="quantity">
          <span class="minus">-</span>
          <span>${cart.quantity}</span>
          <span class="plus">+</span>
        </div>
      `;

      listCartHTML.appendChild(item);
    });

    iconCartSpan.textContent = totalQty;
  };

  /* =======================
     QUANTITY CONTROL
  ======================== */
  if (listCartHTML) {
    listCartHTML.addEventListener("click", (e) => {
      if (!e.target.classList.contains("plus") &&
          !e.target.classList.contains("minus")) return;

      const item = e.target.closest(".item");
      if (!item) return;

      const productId = item.dataset.id;
      const type = e.target.classList.contains("plus") ? "plus" : "minus";

      changeQuantity(productId, type);
    });
  }

  const changeQuantity = (productId, type) => {
    const index = carts.findIndex((c) => c.product_id == productId);
    if (index < 0) return;

    if (type === "plus") {
      carts[index].quantity++;
    } else {
      carts[index].quantity--;
      if (carts[index].quantity <= 0) {
        carts.splice(index, 1);
      }
    }

    updateCartHtml();
  };

  /* =======================
     INIT APP
  ======================== */
  const initApp = () => {
    carts = [];

    fetch("products.json")
      .then((res) => res.json())
      .then((data) => {
        listProducts = data;
        addDataToHtml();
        updateCartHtml();
      })
      .catch((err) => console.error("Product load error:", err));
  };

  initApp();

  /* =======================
     THEME SWITCHER
  ======================== */
  if (themeSwitch) {
    if (localStorage.getItem("darkmode") === "active") {
      body.classList.add("darkmode");
    }

    themeSwitch.addEventListener("click", () => {
      body.classList.toggle("darkmode");

      body.classList.contains("darkmode")
        ? localStorage.setItem("darkmode", "active")
        : localStorage.removeItem("darkmode");
    });
  }
});



// // Select DOM elements
// const iconCart = document.querySelector(".icon-cart");
// const closeCart = document.querySelector(".close");
// const body = document.querySelector("body");
// const listProductHTML = document.querySelector(".listProduct");
// const listCartHTML = document.querySelector(".listCart");
// const iconCartSpan = document.querySelector(".icon-cart span");

// let listProducts = [];
// let carts = [];

// // Toggle cart visibility
// // iconCart.addEventListener("click", () => {
// //   body.classList.toggle("showCart");
// // });
// // closeCart.addEventListener("click", () => {
// //   body.classList.toggle("showCart");
// // });

// if (iconCart) {
//   iconCart.addEventListener("click", () => {
//     document.body.classList.toggle("showCart");
//   });
// }

// if (closeCart) {
//   closeCart.addEventListener("click", () => {
//     document.body.classList.toggle("showCart");
//   });
// }

// // Render products
// const addDataToHtml = () => {
//   listProductHTML.innerHTML = "";
//   if (listProducts.length > 0) {
//     listProducts.forEach((product) => {
//       const newProduct = document.createElement("div");
//       newProduct.classList.add("item");
//       newProduct.dataset.id = product.id;
//       newProduct.innerHTML = `
//         <img src="${product.image}" alt="arrivals">
//         <h2>${product.name}</h2>
//         <div class="product-price">$${product.price}</div>
//         <button class="addCart">Add To Cart</button>
//       `;
//       listProductHTML.appendChild(newProduct);
//     });
//   }
// };

// // Add to cart
// listProductHTML.addEventListener("click", (event) => {
//   const target = event.target;
//   if (target.classList.contains("addCart")) {
//     const product_id = target.parentElement.dataset.id;
//     addToCart(product_id);
//   }
// });

// const addToCart = (product_id) => {
//   const positionThisProductInCart = carts.findIndex(
//     (value) => value.product_id == product_id
//   );

//   if (carts.length <= 0) {
//     carts = [{ product_id: product_id, quantity: 1 }];
//   } else if (positionThisProductInCart < 0) {
//     carts.push({ product_id: product_id, quantity: 1 });
//   } else {
//     carts[positionThisProductInCart].quantity += 1;
//   }

//   addCartToHtml();
// };

// // Render cart
// const addCartToHtml = () => {
//   listCartHTML.innerHTML = "";
//   let totalQuantity = 0;

//   if (carts.length > 0) {
//     carts.forEach((cart) => {
//       totalQuantity += cart.quantity;

//       const newCart = document.createElement("div");
//       newCart.classList.add("item");
//       newCart.dataset.id = cart.product_id;

//       const positionProduct = listProducts.findIndex(
//         (value) => value.id == cart.product_id
//       );
//       const info = listProducts[positionProduct];

//       const priceNum =
//         typeof info.price === "number"
//           ? info.price
//           : parseFloat(String(info.price).replace(/[^0-9.]/g, ""));

//       newCart.innerHTML = `
//         <div class="image">
//           <img src="${info.image}" alt="arrivals">
//         </div>
//         <div class="name">${info.name}</div>
//         <div class="totalPrice">$${(priceNum * cart.quantity).toFixed(2)}</div>
//         <div class="quantity">
//           <span class="minus">-</span>
//           <span>${cart.quantity}</span>
//           <span class="plus">+</span>
//         </div>
//       `;
//       listCartHTML.appendChild(newCart);
//     });
//   }

//   iconCartSpan.innerHTML = totalQuantity;
// };

// // Handle plus/minus clicks
// listCartHTML.addEventListener("click", (event) => {
//   const target = event.target;
//   if (target.classList.contains("minus") || target.classList.contains("plus")) {
//     const itemEl = target.closest(".item"); // ✅ correct element
//     if (!itemEl) return;

//     const product_id = itemEl.dataset.id;
//     const type = target.classList.contains("plus") ? "plus" : "minus";

//     changeQuantity(product_id, type);
//   }
// });

// // Change quantity
// const changeQuantity = (product_id, type) => {
//   const positionItemInCart = carts.findIndex(
//     (value) => value.product_id == product_id
//   );

//   if (positionItemInCart >= 0) {
//     if (type === "plus") {
//       carts[positionItemInCart].quantity += 1;
//     } else {
//       const valueChange = carts[positionItemInCart].quantity - 1;
//       if (valueChange > 0) {
//         carts[positionItemInCart].quantity = valueChange;
//       } else {
//         carts.splice(positionItemInCart, 1);
//       }
//     }
//   }

//   addCartToHtml();
// };

// // Initialize app
// const initApp = () => {
//   // ✅ Clear cart on refresh
//   carts = [];

//   fetch("products.json")
//     .then((response) => response.json())
//     .then((data) => {
//       listProducts = data;
//       addDataToHtml();
//       addCartToHtml();
//     });
// };

// initApp();

// // Theme switcher
// document.addEventListener("DOMContentLoaded", () => {
//   const themeSwitch = document.getElementById("theme-switch");

//   let darkmode = localStorage.getItem("darkmode");

//   const enableDark = () => {
//     document.body.classList.add("darkmode");
//     localStorage.setItem("darkmode", "active");
//   };

//   const disableDark = () => {
//     document.body.classList.remove("darkmode");
//     localStorage.removeItem("darkmode");
//   };

//   if (darkmode === "active") {
//     enableDark();
//   }

//   themeSwitch.addEventListener("click", () => {
//     darkmode = localStorage.getItem("darkmode");
//     darkmode === "active" ? disableDark() : enableDark();
//   });
// });
