import Product from "./domain/entity/Product";
import ProductRepository from "./ProductRepository";

const sqlite3 = require('sqlite3').verbose();

export default class ProductRepositoryDatabase implements ProductRepository {
    async getProduct(idProduct: number): Promise<Product> {
        const connection = new sqlite3.Database('./project.db');
        const sqlProduct = `SELECT * FROM products where id_product = ?`;
        const productData: any = await new Promise((resolve, reject) => {
            connection.serialize(() => {
                connection.get(sqlProduct, [idProduct], (err: any, row: any) => {
                    if (err) reject(err);
                    resolve(row);
                });
            });
        }).then((result) => result);
        await connection.close();
        return new Product(
            productData.id_product, 
            productData.description, 
            parseFloat(productData.price), 
            productData.width, 
            productData.height, 
            productData.length, 
            parseFloat(productData.weight), 
            productData.currency
        );
    }
}
