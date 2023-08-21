import {
  InvalidProductFieldError,
  ExistentProductCodeError,
  InvalidProductIdError,
  NonExistentProductError,
} from "./error/ProductError.js";
import { ForbiddenUserError } from "./error/UserError.js";
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
  async addProduct(product, user) {
    await this.validateProductFields(product, { isUpdate: false });
    if (user.role.toUpperCase() == "PREMIUM") {
      product.owner = user.email;
    }
    const createdProduct = await this.repository.addProduct(product);
    return createdProduct;
  }
  async getProducts() {
    const products = await this.repository.getProducts();
    return products;
  }
  async getProductById(id) {
    await this.isIdAndProductExistent(id);
    const product = await this.repository.getProductById(id);
    return product;
  }
  async updateProduct(id, product) {
    await this.isIdAndProductExistent(id);
    await this.validateProductFields(product, { isUpdate: true });
    const updatedProduct = await this.repository.updateProduct(id, product);
    return updatedProduct;
  }
  async deleteProduct(id, user) {
    await this.isIdAndProductExistent(id);
    const userRole = user.role.toUpperCase();
    if (userRole != "ADMIN") {
      const product = await this.getProductById(id);
      if (product.owner != user.email) {
        throw new ForbiddenUserError(
          "You do not have permission to delete this product."
        );
      }
    }
    const deletedProduct = await this.repository.deleteProduct(id);
    return deletedProduct;
  }
  async compareProductsIds(id1, id2) {
    const result = await this.repository.compareIds(id1, id2);
    return result;
  }

  async validateProductFields({ title, price, stock, code, id, _id }, options) {
    /* si isUpdate = true entonces no se valida ni el id ni el code */
    if (!options.isUpdate) {
      if (id || _id) {
        throw new InvalidProductFieldError(
          "The product cannot have a custom id"
        );
      }
      /* habria que validar que el codigo que venga sea igual al de la DB o en caso de ser cambiado no genere conflicto con alguno existente, esto en caso de update */
      if (typeof code != "string" || code.length == 0) {
        throw new InvalidProductFieldError(
          "Code is required and it has to be of type String"
        );
      } else {
        const exists = await this.repository.validateCode(code);
        if (exists)
          throw new ExistentProductCodeError(`the code ${code} already exists`);
      }
    }

    if (typeof title != "string" || title.length == 0) {
      throw new InvalidProductFieldError(
        "Title is required and it has to be of type String"
      );
    }
    if (typeof price != "number") {
      throw new InvalidProductFieldError(
        "Price is required and it has to be of type Number"
      );
    }
    if (!Number.isInteger(stock)) {
      throw new InvalidProductFieldError(
        "Stock is required and it has to be of type Integer"
      );
    }
  }
  async isIdAndProductExistent(id) {
    /* se valida que la mongo ID sea valida */
    const isValid = await this.repository.isIdValid(id);
    if (!isValid) {
      throw new InvalidProductIdError(`the product id ${id} is invalid`);
    }
    const exists = await this.repository.productExists(id);
    /*si la ID es valida entonces buscamos el producto, pero de no existir lanzamos un error */
    if (!exists) {
      throw new NonExistentProductError(
        `the product with id ${id} does not exists`
      );
    }
  }
}
