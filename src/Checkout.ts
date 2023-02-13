import { validateCpf } from "./cpfValidator";

const sqlite3 = require('sqlite3').verbose();

type Product = {
    id: number;
    quantity: number;
};
type Customer = { 
    name: string; 
    age: number, 
    cpf: string
};
type Input = {
    items: Product[],
    customer: Customer,
    from?: number,
    to?: number,
};
type Output = {
    total: number,
    freight: number,
};
export default class Checkout {
    async execute (
        input: Input,
        coupon?: string
    ): Promise<Output> {
        validateCpf(input.customer.cpf);
        const output: Output = {
            total: 0,
            freight: 0
        };     
        let sql_product = `SELECT * FROM products where id_product = ?`;
        const connection = new sqlite3.Database('./project.db');
        let ids = <any>[];
        for (const item of input.items) { 
            if (ids.includes(item.id)) throw new Error("Duplicated items");
            if (item.quantity < 1) throw new Error("Invalid quantity");
            let product: any = await new Promise((resolve, reject) => {
                connection.serialize(() => {
                    connection.get(sql_product, [item.id], (err, row) => {
                        if (err) reject(err);
                        resolve(row);
                    });
                });
            }).then((result) => result);
            if (product.width <= 0 || product.height <= 0 || product.length <= 0 || product.weight <= 0) throw new Error("Invalid dimension");
            output.total += item.quantity * product.price;
            let volume = product.height/100 * product.width/100 * product.length/100;
            let density = parseFloat(product.weight)/volume;
            let freight = 1000 * volume * (density/100);
            output.freight += Math.max(freight, 10.0) * item.quantity;
            ids.push(item.id);
        }
        if (coupon != null) {
            let sql_coupon = `SELECT * FROM coupons where code = ?`;
            let coupon_percentage: number = await new Promise((resolve, reject) => {
                connection.serialize(() => {
                    connection.get(sql_coupon, [coupon], (err, row) => {
                        if (err) reject(err);
                        resolve(row);
                    });
                });
            }).then((result: any) => {
                if (!result) throw new Error("Invalid coupon");
                if (result.status == false) throw new Error("Expired coupon"); 
                return result.percentage;
            });
            output.total = this.calculateAmountWithDiscount(output.total, coupon_percentage);
        }
		if (input.from && input.to) {
			output.total += output.freight;
		}
        await connection.close();
        return output;
    }

    calculateAmountWithDiscount (orderAmount: number, coupon: number): number {
        return orderAmount - (orderAmount * coupon / 100)
    }
}
