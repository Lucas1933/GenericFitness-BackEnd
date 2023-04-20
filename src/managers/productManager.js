import * as fs from "fs";
export default class ProductManager {
  constructor(path) {
    this.path = path;
    this.products = this.setArrayProducts();
  }
  setArrayProducts() {
    let products = [];
    if (fs.existsSync(this.path)) {
      products = JSON.parse(fs.readFileSync(this.path, "utf-8"));
    } else {
      fs.writeFileSync(this.path, JSON.stringify(products));
    }
    return products;
  }
  saveProducts() {
    fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2));
  }
  addProduct(title, description, price, status, thumbnail, code, stock) {
    try {
      if (typeof title != "string") {
        throw new TypeError("title must be a string");
      }
      if (typeof description != "string") {
        throw new TypeError("description must be a string");
      }
      if (typeof price != "number") {
        throw new TypeError("price must be a number");
      }
      if (typeof status != "boolean") {
        throw new TypeError("status must be a boolean");
      }
      if (!Array.isArray(thumbnail)) {
        throw new TypeError("thumbnail must be an array");
      }
      if (typeof code != "string") {
        throw new TypeError("code must be a string");
      }
      if (typeof stock != "number") {
        throw new TypeError("stock must be a number");
      }
      this.products.forEach((eachProduct) => {
        if (Object.values(eachProduct).includes(code)) {
          throw new Error(`The product with code ${code} already exists`);
        }
      });
      let product = new Product(
        title,
        description,
        price,
        status,
        thumbnail,
        code,
        stock
      );
      if (this.products.length == 0) {
        product.id = 1;
      } else {
        product.id = this.products.length + 1;
      }
      this.products.push(product);
      this.saveProducts();
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  getProducts() {
    return this.products;
  }
  getProductById(id) {
    try {
      const parsedId = parseInt(id);
      let product =
        this.products.find((eachProduct) => eachProduct.id === parsedId) ||
        null;
      return product;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  updateProduct(id, fields) {
    try {
      if (fields.id) {
        throw new Error("id's can't be updated");
      }
      if (typeof fields.title != "string") {
        throw new TypeError("title must be a string");
      }
      if (typeof fields.description != "string") {
        throw new TypeError("description must be a string");
      }
      if (typeof fields.price != "number") {
        throw new TypeError("price must be a number");
      }
      if (typeof fields.status != "boolean") {
        throw new TypeError("status must be a boolean");
      }
      if (!Array.isArray(fields.thumbnail)) {
        throw new TypeError("thumbnail must be an array");
      }
      if (typeof fields.code != "string") {
        throw new TypeError("code must be a string");
      }
      if (typeof fields.stock != "number") {
        throw new TypeError("stock must be a number");
      }
      let productToBeUpdated = this.getProductById(id);
      if (!productToBeUpdated) return false;
      const validKeys = Object.keys(fields).filter(
        (key) => key in productToBeUpdated
      );
      validKeys.forEach((key) => {
        if (fields[key] !== undefined) {
          productToBeUpdated[key] = fields[key];
        }
      });
      let indexOfProductToBeUpdated = this.products.indexOf(productToBeUpdated);
      this.products[indexOfProductToBeUpdated] = productToBeUpdated;
      this.saveProducts();
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  deleteProduct(id) {
    try {
      let productToBeDeleted = this.getProductById(id);
      if (!productToBeDeleted) {
        return false;
      }
      let indexOfProductToBeDeleted = this.products.indexOf(productToBeDeleted);
      this.products.splice(indexOfProductToBeDeleted, 1);
      this.saveProducts();
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
class Product {
  constructor(title, description, price, status, thumbnail, code, stock) {
    this.title = title;
    this.description = description;
    this.price = price;
    this.status = status;
    this.thumbnail = thumbnail;
    this.code = code;
    this.stock = stock;
    this.id = 0;
  }
}
