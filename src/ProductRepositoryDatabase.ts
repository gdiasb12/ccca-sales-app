import ProductRepository from "./ProductRepository";

const sqlite3 = require('sqlite3').verbose();

export default class ProductRepositoryDatabase implements ProductRepository {
    async getProduct(idProduct: number): Promise<any> {
        const connection = new sqlite3.Database('./project.db');
        const sqlProduct = `SELECT * FROM products where id_product = ?`;
        const product = await new Promise((resolve, reject) => {
            connection.serialize(() => {
                connection.get(sqlProduct, [idProduct], (err, row) => {
                    if (err) reject(err);
                    resolve(row);
                });
            });
        }).then((result) => result);
        await connection.close();
        return product;
    }
}
