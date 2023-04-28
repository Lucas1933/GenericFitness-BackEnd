console.log("connected to the router");
const socket = io();
let containerOfDivs = document.getElementById("containerOfProducts");
const deleteButton = document.getElementById("deleteButton");
const checkIfActive = (status) => {
  if (status) {
    return "active";
  } else {
    return "inactive";
  }
};

socket.on("updateProducts", (products) => {
  containerOfDivs.innerHTML = " ";
  products.forEach((eachProduct) => {
    containerOfDivs.innerHTML += `<div style="width: fit-content;">
    <ul style="font-size: 22px; padding-left: 20px;">
      <li>
        <span style="text-decoration: underline;">Name:</span>
        ${eachProduct.title}</li>
      <li><span style="text-decoration: underline;">Description:</span>
      ${eachProduct.description}</li>
      <li>
        <span
          style="text-decoration: underline;"
        >Price:</span> ${eachProduct.price}</li>
      <li><span style="text-decoration: underline;">Status:</span>
      ${checkIfActive(eachProduct.status)}
     </li>
      <li><span style="text-decoration: underline;">Thumbnails:</span>
      ${eachProduct.thumbnail}</li>
      <li>
        <span style="text-decoration: underline;">Code:</span>
        ${eachProduct.code}</li>
      <li>
        <span style="text-decoration: underline;">Stock:</span>
        ${eachProduct.stock}</li>
      <li>
        <span style="text-decoration: underline;">ID:</span>
        ${eachProduct.id}</li>
    </ul>
  </div>`;
  });
});
