import Coupon from "../../domain/entity/Coupon";
import CouponRepository from "../../CouponRepository";
import CouponRepositoryDatabase from "../../CouponRepositoryDatabase";
import CurrencyGateway from "../../CurrencyGateway";
import CurrencyGatewayInMemory from "../../CurrencyGatewayInMemory";
import FreightCalculator from "../../domain/entity/FreightCalculator";
import ProductRepository from "../../ProductRepository";
import ProductRepositoryDatabase from "../../ProductRepositoryDatabase";
import { validateCpf } from "../../domain/entity/cpfValidator";

type Product = {
    idProduct: number;
    quantity: number;
};
type Input = {
    items: Product[],
    cpf: string,
    coupon?: string,
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
		readonly couponRepository: CouponRepository = new CouponRepositoryDatabase(),
		readonly currencyGateway: CurrencyGateway = new CurrencyGatewayInMemory(),
	) {
	}

    async execute (input: Input): Promise<Output> {
        validateCpf(input.cpf);
        const output: Output = {
            total: 0,
            freight: 0
        };     
        let ids = <any>[];
        for (const item of input.items) { 
            if (ids.includes(item.idProduct)) throw new Error("Duplicated items");
            if (item.quantity < 1) throw new Error("Invalid quantity");
            const product: any = await this.productRepository.getProduct(item.idProduct);
            const currency = await this.currencyGateway.getCurrencyValue(product.currency);
            output.total += item.quantity * product.price * currency; 
            output.freight += FreightCalculator.calculate(product) * item.quantity * currency;
            ids.push(item.idProduct);
        }
        if (input.coupon != null) {
            const coupon: Coupon = await this.couponRepository.getCoupon(input.coupon);
            output.total -= coupon.calculateDiscount(output.total);
        }
		if (input.from && input.to) {
			output.total += output.freight;
		}
        return output;
    }
}
