import Checkout from "../src/Checkout";

let checkout: Checkout;
let customer: any;

beforeAll(function() {
    checkout = new Checkout();
    customer = { name: "Atena Maia", age: 25, cpf: '19022574059' };
});

test("Deve criar um pedido com 3 produtos e calcular o valor total", async function() {
    const input = {
        items: [
            { id: 1, quantity: 1 },
            { id: 2, quantity: 1 },
            { id: 3, quantity: 3 },
        ],
        customer: customer
    };
    const order = await checkout.execute(input);
    expect(order.total).toBe(6090);
});

test("Deve criar um pedido com 3 produtos com cupom de desconto e calcular o total", async function() {
    const input = {
        items: [
            { id: 1, quantity: 1 },
            { id: 2, quantity: 2 },
            { id: 3, quantity: 2 },
        ],
        customer: customer
    };
    const order = await checkout.execute(input, "VALE20");
    expect(order.total).toBe(8848);
});

test("Deve criar um pedido com 1 produtos e calcular o frete", async function() {
    const input = {
        items: [
            { id: 1, quantity: 3 },
        ],
        customer: customer,
        from: 14521000,
        to: 12354000,
    };
    const order = await checkout.execute(input);
    expect(order.total).toBe(3090);
    expect(order.freight).toBe(90);
});

test("Não deve criar um pedido com cpf inválido", async function() {
    const input = {
        items: [
            { id: 1, quantity: 1 },
        ],
        customer: { name: "Atena Maia", age: 25, cpf: '000000000' }
    };
    expect(() => checkout.execute(input)).rejects.toThrow(new Error("Invalid cpf number"));
});

test("Não deve criar um pedido com itens repetidos", async function() {
    const input = {
        items: [
            { id: 1, quantity: 1 },
            { id: 1, quantity: 1 },
        ],
        customer: customer
    };
    expect(() => checkout.execute(input)).rejects.toThrow(new Error("Duplicated items"));
});

test("Não deve criar um pedido com a quantidade negativa", async function() {
    const input = {
        items: [
            { id: 1, quantity: -1 },
        ],
        customer: customer
    };
    expect(() => checkout.execute(input)).rejects.toThrow(new Error("Invalid quantity"));
});

test("Não deve aplicar um cupom inválido", async function() {
    const input = {
        items: [
            { id: 1, quantity: 1 },
        ],
        customer: customer
    };
    expect(() => checkout.execute(input, "VALE100")).rejects.toThrow(new Error("Invalid coupon"));
});

test("Não deve aplicar cupom de desconto expirado", async function() {
    const input = {
        items: [
            { id: 1, quantity: 1 },
        ],
        customer: customer
    };
    expect(() => checkout.execute(input, "VALE30")).rejects.toThrow(new Error("Expired coupon"));
});

test("Não deve criar um pedido com dimensões negativas", async function() {
    const input = {
        items: [
            { id: 4, quantity: 1 },
        ],
        customer: customer
    };
    expect(() => checkout.execute(input)).rejects.toThrow(new Error("Invalid dimension"));
});
