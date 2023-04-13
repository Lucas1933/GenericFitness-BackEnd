import * as fs from "fs";

export default class ProductManager {
  path: string;
  private products: Product[];
  constructor(path: string) {
    this.path = path;
    this.products = this.setArrayProducts();
  }
  private setArrayProducts() {
    let products: Product[] = [];
    if (fs.existsSync(this.path)) {
      products = JSON.parse(fs.readFileSync(this.path, "utf-8"));
    } else {
      fs.writeFileSync(this.path, JSON.stringify(products));
    }
    return products;
  }
  private saveProducts() {
    fs.writeFileSync(this.path, JSON.stringify(this.products));
  }
  public addProduct(
    title: string,
    description: string,
    price: number,
    thumbnail: string,
    code: string,
    stock: number
  ): boolean {
    try {
      this.products.forEach((eachProduct) => {
        if (Object.values(eachProduct).includes(code)) {
          throw new Error(`The product with code ${code} already exists`);
        }
      });
      let product = new Product(
        title,
        description,
        price,
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
  public getProducts(): Product[] {
    return this.products;
  }
  public getProductById(id: number): Product | null {
    try {
      let product =
        this.products.find((eachProduct) => eachProduct.id === id) || null;
      return product;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  public updateProduct(fields: Partial<ProductUpdateFields>): boolean {
    try {
      if (!fields.id) return false;

      let productToBeUpdated = this.getProductById(fields.id);

      if (!productToBeUpdated) return false;

      const validKeys = Object.keys(fields).filter(
        (key) => key in productToBeUpdated!
      );
      validKeys.forEach((key) => {
        if (key !== "id") (productToBeUpdated as any)[key] = fields[key];
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
  public deleteProduct(id: number): boolean {
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
interface ProductUpdateFields {
  title?: string;
  description?: string;
  price?: number;
  thumbnail?: string;
  code?: string;
  stock?: number;
  id?: number;
  [key: string]: any;
}
class Product {
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  code: string;
  stock: number;
  id: number;

  constructor(
    title: string,
    description: string,
    price: number,
    thumbnail: string,
    code: string,
    stock: number
  ) {
    this.title = title;
    this.description = description;
    this.price = price;
    this.thumbnail = thumbnail;
    this.code = code;
    this.stock = stock;
    this.id = 0;
  }
}
