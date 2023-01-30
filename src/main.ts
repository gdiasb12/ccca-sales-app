import { validateCpf } from "./cpfValidator";

type Product = {
    description: string;
    price: number;
    quantity: number;
};
type Customer = { 
    name: string; 
    age: number, 
    cpf: string
};
function calculateAmountWithDiscount (orderAmount: number, discountPercentage: number): number {
    return orderAmount - (orderAmount * discountPercentage / 100)
}
export function calculateOrder (
    items: Product[],
    customer: Customer,
    discountPercentage?: number
): number {
    validateCpf(customer.cpf);
    let orderAmount = 0;
    for (const item of items) orderAmount += item.quantity * item.price;
    if (discountPercentage != null) orderAmount = calculateAmountWithDiscount(orderAmount, discountPercentage);
    return orderAmount;
}
