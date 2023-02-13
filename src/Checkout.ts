import CouponRepository from "./CouponRepository";
import CouponRepositoryDatabase from "./CouponRepositoryDatabase";
import FreightCalculator from "./FreightCalculator";
import ProductRepository from "./ProductRepository";
import ProductRepositoryDatabase from "./ProductRepositoryDatabase";
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

	constructor (
		readonly productRepository: ProductRepository = new ProductRepositoryDatabase(),
		readonly couponRepository: CouponRepository = new CouponRepositoryDatabase()
	) {
	}

    async execute (
        input: Input,
        coupon?: string
    ): Promise<Output> {
        validateCpf(input.customer.cpf);
        const output: Output = {
            total: 0,
            freight: 0
        };     
        const connection = new sqlite3.Database('./project.db');
        let ids = <any>[];
        for (const item of input.items) { 
            if (ids.includes(item.id)) throw new Error("Duplicated items");
            if (item.quantity < 1) throw new Error("Invalid quantity");
            const product: any = await this.productRepository.getProduct(item.id);
            if (product.width <= 0 || product.height <= 0 || product.length <= 0 || product.weight <= 0) throw new Error("Invalid dimension");
            output.total += item.quantity * product.price;
            const freight = FreightCalculator.calculate(product);
            output.freight += freight * item.quantity;
            ids.push(item.id);
        }
        if (coupon != null) {
            const couponPercentage: number = await this.couponRepository.getCoupon(coupon);
            output.total = this.calculateAmountWithDiscount(output.total, couponPercentage);
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
