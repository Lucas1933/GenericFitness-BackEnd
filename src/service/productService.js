import {
  InvalidProductFieldError,
  ExistentProductCodeError,
  InvalidProductIdError,
  NonExistentProductError,
} from "./error/ProductError.js";
export default class ProductService {
  constructor(repository) {
    this.repository = repository;
  }
  async getPaginatedProducts(queryLimit, queryPage, querySort) {
    const products = await this.repository.getPaginatedProducts(
      queryLimit,
      queryPage,
      querySort
    );
    return products;
  }
  async addProduct(product) {
    await this.validateProductFields(product);
    const createdProduct = await this.repository.addProduct(product);
    return createdProduct;
  }
  async getProducts() {
    const products = await this.repository.getProducts();
    return products;
  }
  async getProductById(id) {
    await this.isIdAndProductValid(id);
    const product = await this.repository.getProductById(id);
    return product;
  }
  async updateProduct(id, product) {
    await this.isIdAndProductValid(id);
    /* en esta implementacion es necesario recibir todos los campos inclusive los que no
    vayan a ser updateados */
    await this.validateProductFields(product);
    const updatedProduct = await this.repository.updateProduct(id, product);
    return updatedProduct;
  }
  async deleteProduct(id) {
    await this.isIdAndProductValid(id);
    const deletedProduct = await this.repository.deleteProduct(id);
    return deletedProduct;
  }
  async compareProductsIds(id1, id2) {
    const result = await this.repository.compareIds(id1, id2);
    return result;
  }

  async validateProductFields({ title, price, stock, code, id, _id }) {
    if (id || _id) {
      throw new InvalidProductFieldError("The product cannot have a custom id");
    }
    if (!code || code.length == 0) {
      throw new InvalidProductFieldError(
        "Code is required and it has to be of type String"
      );
    } else {
      const exists = await this.repository.validateCode(code);
      if (exists)
        throw new ExistentProductCodeError(`the code ${code} already exists`);
    }

    if (!title || title.length == 0) {
      throw new InvalidProductFieldError(
        "Title is required and it has to be of type String"
      );
    }
    if (!price) {
      throw new InvalidProductFieldError(
        "Price is required and it has to be of type Number"
      );
    }
    if (!stock) {
      throw new InvalidProductFieldError(
        "Stock is required and it has to be of type Integer"
      );
    }
  }
  async isIdAndProductValid(id) {
    /* se valida que la mongo ID sea valida */
    const isValid = await this.repository.isIdValid(id);
    if (!isValid) {
      throw new InvalidProductIdError(`the product id ${id} is invalid`);
    }
    const product = await this.repository.getProductById(id);
    /*si la ID es valida entonces buscamos el producto, pero de no existir lanzamos un error */
    if (!product) {
      throw new NonExistentProductError(
        `the product with id ${id} does not exists`
      );
    }
  }
}
