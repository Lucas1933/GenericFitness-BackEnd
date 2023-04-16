export default class ProductManager {
    path: string;
    private products;
    constructor(path: string);
    private setArrayProducts;
    private saveProducts;
    addProduct(title: string, description: string, price: number, thumbnail: string, code: string, stock: number): boolean;
    getProducts(): Product[];
    getProductById(id: number): Product | null;
    updateProduct(fields: Partial<ProductUpdateFields>): boolean;
    deleteProduct(id: number): boolean;
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
declare class Product {
    title: string;
    description: string;
    price: number;
    thumbnail: string;
    code: string;
    stock: number;
    id: number;
    constructor(title: string, description: string, price: number, thumbnail: string, code: string, stock: number);
}
export {};
