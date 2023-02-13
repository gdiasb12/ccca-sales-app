export default class FreightCalculator {
    static calculate (product: any): number {
        const volume = product.height/100 * product.width/100 * product.length/100;
        const density = parseFloat(product.weight)/volume;
        const freight = 1000 * volume * (density/100);
        return Math.max(freight, 10.0);
    }
}
