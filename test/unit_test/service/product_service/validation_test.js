import chai from "chai";
import Sinon from "sinon";
import ProductService from "../../../../src/service/services/product_service.js";
const expect = chai.expect;

describe("Product Service - validateProductFields - isUpdate:false", () => {
  let repositoryStub;
  let validateCodeStub;
  let productService;
  before(() => {
    /* we stub the repository to test the validateProductFields without having to worry
about the validateCode method inside wich interacts with the DB */
    validateCodeStub = Sinon.stub(); // Create a stub for validateCode
    validateCodeStub.resolves(false); // Make it resolve with false so we can use the "same code"
    repositoryStub = {
      validateCode: validateCodeStub, // Assign the stub to validateCode
    };
    productService = new ProductService(repositoryStub);
  });

  it("should throw an error if the product comes with a custom id when isUpdate is false", async () => {
    try {
      const product = {
        title: "some title",
        code: "some code",
        id: "some id",
        price: 10,
        stock: 5,
      };
      await productService.validateProductFields(product, { isUpdate: false });
    } catch (error) {
      expect(error.message).to.equal("The product cannot have a custom id");
    }
  });

  it("should throw an error for a existent code when isUpdate is false", async () => {
    validateCodeStub.resolves(
      true
    ); /* so we mimic that the code exists in the DB */
    try {
      const product = {
        title: "some title",
        code: "some code",
        /* id: "some id", */
        price: 10,
        stock: 5,
      };
      await productService.validateProductFields(product, { isUpdate: false });
    } catch (error) {
      expect(error.message).to.equal("the code some code already exists");
    } finally {
      validateCodeStub.resolves(false); /* reseted for the other tests */
    }
  });

  it("should throw an error for invalid code", async () => {
    try {
      const product = {
        title: "some title",
        code: 10,
        /* id: "some id", */
        price: 10,
        stock: 5,
      };
      await productService.validateProductFields(product, { isUpdate: false });
    } catch (error) {
      expect(error.message).to.equal(
        "Code is required and it has to be of type String"
      );
    }
  });

  it("should throw an error for invalid stock", async () => {
    try {
      const product = {
        title: "some title",
        code: "some code",
        /* id: "some id", */
        price: 10,
        stock: 10.5,
      };
      await productService.validateProductFields(product, { isUpdate: false });
    } catch (error) {
      expect(error.message).to.equal(
        "Stock is required and it has to be of type Integer"
      );
    }
  });

  it("should NOT throw an error for product with id, code and valid fields when isUpdate:true", async () => {
    const product = {
      title: "some title",
      code: "some code",
      id: "some id",
      price: 10,
      stock: 10,
    };
    await productService.validateProductFields(product, { isUpdate: true });
  });
});
