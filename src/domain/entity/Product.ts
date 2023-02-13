export default class Product {
    constructor(
        readonly idProduct: number,
        readonly description: string,
        readonly price: number,
        readonly height: number,
        readonly width: number,
        readonly length: number,
        readonly weight: number,
        readonly currency: string = "BRL",
    ) {
        if (width <= 0 || height <= 0 || length <= 0 || weight <= 0) throw new Error("Invalid dimension");
    }
}
