const limitBtns = Array.from(
  document.getElementById("limitContainer").children
);
const sortingBtns = Array.from(
  document.getElementById("sortingContainer").children
);
const addToCartBtns = Array.from(
  document.getElementsByClassName("addToCartBtn")
);

const checkCartBtn = document.getElementById("checkCart");
const cartQuantity = document.getElementById("itemQuantity");
const logoutBtn = document.getElementById("logoutBtn");

const clearStorageBtn = document.getElementById("clearStorageBtn");
let itemCounter = 0;
let cart;

if (!localStorage.getItem("cart")) {
  cart = { products: [] };
  localStorage.setItem("cart", JSON.stringify(cart));
} else {
  cart = JSON.parse(localStorage.getItem("cart"));
  cart.products.forEach((eachProduct) => {
    itemCounter += eachProduct.quantity;
  });

  cartQuantity.innerHTML = itemCounter;
}

limitBtns.forEach((eachBtn) => {
  eachBtn.addEventListener("click", (event) => {
    if (window.location.search.length == 0) {
      const defaultLink =
        window.location.pathname +
        "?" +
        eachBtn.getAttribute("value") +
        "&page=1&sort=undefined";
      eachBtn.setAttribute("href", defaultLink);
    } else {
      const updatedURL = window.location.search.split(/[&]/);
      updatedURL[0] = "?" + eachBtn.getAttribute("value");
      const newLimitLink = window.location.pathname + updatedURL.join("&");
      eachBtn.setAttribute("href", newLimitLink);
    }
  });
});

sortingBtns.forEach((eachBtn) => {
  eachBtn.addEventListener("click", (event) => {
    /* event.preventDefault(); */
    if (window.location.search.length == 0) {
      const defaultLink =
        window.location.pathname +
        "?limit=10&page=1&" +
        eachBtn.getAttribute("value");
      eachBtn.setAttribute("href", defaultLink);
    } else {
      const updatedURL = window.location.search.split(/[&]/);
      updatedURL[updatedURL.length - 1] = eachBtn.getAttribute("value");
      const newSortingLink = window.location.pathname + updatedURL.join("&");
      eachBtn.setAttribute("href", newSortingLink);
    }
  });
});

addToCartBtns.forEach((eachBtn) => {
  eachBtn.addEventListener("click", (event) => {
    const productId = eachBtn.getAttribute("value");
    const productExists = cart.products.find(
      (eachProduct) => eachProduct.product === productId
    );
    if (!productExists) {
      cart.products.push({ product: productId, quantity: 1 });
      cartQuantity.innerHTML = ++itemCounter;
    } else {
      const productIndex = cart.products.findIndex(
        (eachProduct) => eachProduct === productExists
      );
      cart.products[productIndex].quantity++;
      cartQuantity.innerHTML = ++itemCounter;
    }
    localStorage.setItem("cart", JSON.stringify(cart));
  });
});

checkCartBtn.addEventListener("click", async (event) => {
  event.preventDefault();
  let result = await fetch("/api/carts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const parsedResult = await result.json();
  const cartId = parsedResult.payload._id;
  result = await fetch(`/api/carts/${cartId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(cart.products),
  });
  checkCartBtn.setAttribute("href", `/carts/${cartId}`);
  localStorage.setItem("cartId", cartId);
  window.open(`/carts/${cartId}`, "_blank");
});

clearStorageBtn.addEventListener("click", (event) => {
  localStorage.clear();
});

logoutBtn.addEventListener("click", async (event) => {
  try {
    let response = await fetch("/api/sessions/logout", {
      method: "DELETE",
    });
    const parsedResponse = await response.json();
    if (response.status == 200) {
      window.location.replace("/");
    }
  } catch (error) {
    console.log(error);
  }
});
