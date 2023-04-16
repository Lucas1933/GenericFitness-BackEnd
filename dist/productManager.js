"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
class ProductManager {
    constructor(path) {
        this.path = path;
        this.products = this.setArrayProducts();
    }
    setArrayProducts() {
        let products = [];
        if (fs.existsSync(this.path)) {
            products = JSON.parse(fs.readFileSync(this.path, "utf-8"));
        }
        else {
            fs.writeFileSync(this.path, JSON.stringify(products));
        }
        return products;
    }
    saveProducts() {
        fs.writeFileSync(this.path, JSON.stringify(this.products));
    }
    addProduct(title, description, price, thumbnail, code, stock) {
        try {
            this.products.forEach((eachProduct) => {
                if (Object.values(eachProduct).includes(code)) {
                    throw new Error(`The product with code ${code} already exists`);
                }
            });
            let product = new Product(title, description, price, thumbnail, code, stock);
            if (this.products.length == 0) {
                product.id = 1;
            }
            else {
                product.id = this.products.length + 1;
            }
            this.products.push(product);
            this.saveProducts();
            return true;
        }
        catch (error) {
            console.log(error);
            return false;
        }
    }
    getProducts() {
        return this.products;
    }
    getProductById(id) {
        try {
            let product = this.products.find((eachProduct) => eachProduct.id === id) || null;
            return product;
        }
        catch (error) {
            console.log(error);
            return null;
        }
    }
    updateProduct(fields) {
        try {
            if (!fields.id)
                return false;
            let productToBeUpdated = this.getProductById(fields.id);
            if (!productToBeUpdated)
                return false;
            const validKeys = Object.keys(fields).filter((key) => key in productToBeUpdated);
            validKeys.forEach((key) => {
                if (key !== "id")
                    productToBeUpdated[key] = fields[key];
            });
            let indexOfProductToBeUpdated = this.products.indexOf(productToBeUpdated);
            this.products[indexOfProductToBeUpdated] = productToBeUpdated;
            this.saveProducts();
            return true;
        }
        catch (error) {
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
        }
        catch (error) {
            console.log(error);
            return false;
        }
    }
}
exports.default = ProductManager;
class Product {
    constructor(title, description, price, thumbnail, code, stock) {
        this.title = title;
        this.description = description;
        this.price = price;
        this.thumbnail = thumbnail;
        this.code = code;
        this.stock = stock;
        this.id = 0;
    }
}
