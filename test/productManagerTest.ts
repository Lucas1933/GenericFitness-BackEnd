import { expect } from "chai";
import { describe, it } from "mocha";
import ProductManager from "../src/managers/productManager";
describe("Product Manager tests", () => {
  describe("getProducts()", () => {
    it("should return empty array if there is nothing in the file", () => {
      let pm = new ProductManager("./test/productTestFile.json");
      let product = pm.getProducts();
      expect(product).to.be.empty;
    });
    it("should return 2 products after adding them", () => {
      let pm = new ProductManager("./test/productTestFile.json");
      pm.addProduct("title", "description", 222, "thumbnail", "code", 55);
      pm.addProduct(
        "title",
        "description",
        222,
        "thumbnail",
        "dfiferent code",
        55
      );
      let product = pm.getProducts();
      expect(product.length).to.equal(2);
    });
  });
  describe("addProduct()", () => {
    it("should return true if the product was added correctly", () => {
      let pm = new ProductManager("./test/productTestFile.json");
      let resultBoolean = pm.addProduct(
        "title",
        "description",
        222,
        "thumbnail",
        "different code again",
        55
      );
      expect(resultBoolean).to.be.true;
    });
    it("should return false if the product to be added already exists", () => {
      let pm = new ProductManager("./test/productTestFile.json");
      let resultBoolean = pm.addProduct(
        "title",
        "description",
        222,
        "thumbnail",
        "different code again",
        55
      );
      expect(resultBoolean).to.be.false;
    });
  });
  describe("getProductById()", () => {
    it("should return the product with the requested id", () => {
      let pm = new ProductManager("./test/productTestFile.json");
      let product = pm.getProductById(3);
      expect(product!.id).to.be.equal(3);
    });
    it("should return null if the product with the requested id does not exists", () => {
      let pm = new ProductManager("./test/productTestFile.json");
      let product = pm.getProductById(80);
      expect(product).to.be.null;
    });
  });
  describe("updateProduct()", () => {
    it("should return true if the update was succesfull", () => {
      let pm = new ProductManager("./test/productTestFile.json");
      let booleanResult = pm.updateProduct({
        id: 1,
        title: "new title",
        price: 500,
      });
      expect(booleanResult).to.be.true;
    });
    it("should return false if the update failed", () => {
      let pm = new ProductManager("./test/productTestFile.json");
      let booleanResult = pm.updateProduct({
        id: 80,
        title: "new title",
        price: 500,
      });
      expect(booleanResult).to.be.false;
    });
    it("should pass the test if the title and price were updated", () => {
      let pm = new ProductManager("./test/productTestFile.json");
      pm.updateProduct({
        id: 3,
        title: "new title",
        price: 500,
      });
      let product = pm.getProductById(3);
      let title = product?.title;
      let price = product?.price;
      expect(title).to.be.deep.equal("new title");
      expect(price).to.be.equal(500);
    });
  });
  describe("deleteProduct()", () => {
    it("should return true if the product was deleted", () => {
      let pm = new ProductManager("./test/productTestFile.json");
      let booleanResult = pm.deleteProduct(3);
      expect(booleanResult).to.be.true;
    });
    it("should pass if the lenght of the products had been reduced -1", () => {
      let pm = new ProductManager("./test/productTestFile.json");
      let lenghtBeforeDelete = pm.getProducts().length;
      pm.deleteProduct(1);
      let lenghtAfterDelete = pm.getProducts().length;
      expect(lenghtAfterDelete).to.be.equal(lenghtBeforeDelete - 1);
    });
  });
});
