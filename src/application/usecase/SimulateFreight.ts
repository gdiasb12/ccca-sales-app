import FreightCalculator from "../../domain/entity/FreightCalculator";
import Product from "../../domain/entity/Product";
import ProductRepository from "../../ProductRepository";
import ProductRepositoryDatabase from "../../ProductRepositoryDatabase";

export default class SimulateFreight {

    constructor(
        readonly productRepository: ProductRepository = new ProductRepositoryDatabase()
    ) {
    }

    async execute(input: Input): Promise<Output> {
        const output: Output = {
            freight: 0
        };
        for (const item of input.items) {
            const product: Product = await this.productRepository.getProduct(item.idProduct);
            output.freight += FreightCalculator.calculate(product) * item.quantity;
        }
        return output;
    }
}

type Input = {
    items: { idProduct: number, quantity: number }[]
};

type Output = {
    freight: number;
}
