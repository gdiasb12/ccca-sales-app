import { calculateOrder } from "../src/main";

test("Deve criar um pedido com 3 produtos e calcular o valor total", function() {
    const items = [
        { description: "Tinta Automotiva Azul", price: 190.00, quantity: 3 },   
        { description: "Cifão", price: 15.00, quantity: 2 },   
        { description: "Torneira Inox", price: 200.00, quantity: 2 },   
    ];
    const customer = { name: "Atena Maia", age: 25, cpf: '19022574059' };
    const orderAmount = calculateOrder(items, customer);
    expect(orderAmount).toBe(1000);
});

test("Deve criar um pedido com 3 produtos com cupom de desconto e calcular o total", function() {
    const items = [
        { description: "Tinta Automotiva Azul", price: 190.00, quantity: 3 },   
        { description: "Cifão", price: 15.00, quantity: 2 },   
        { description: "Torneira Inox", price: 200.00, quantity: 2 },   
    ];
    const discountPercentage = 15.00;
    const customer = { name: "Atena Maia", age: 25, cpf: '19022574059' };
    const orderAmount = calculateOrder(items, customer, discountPercentage);
    expect(orderAmount).toBe(850);
});

test("Não deve criar um pedido com cpf inválido", function() {
    const items = [
        { description: "Tinta Automotiva Azul", price: 190.00, quantity: 3 },   
        { description: "Cifão", price: 15.00, quantity: 2 },   
        { description: "Torneira Inox", price: 200.00, quantity: 2 },   
    ];
    const customer = { name: "Atena Maia", age: 25, cpf: '123' };
    expect(() => calculateOrder(items, customer)).toThrow(new Error("Invalid cpf number"));
});
