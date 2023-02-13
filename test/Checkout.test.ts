import Checkout from "../src/application/usecase/Checkout";
import CouponRepositoryDatabase from "../src/CouponRepositoryDatabase";
import CurrencyGateway from "../src/CurrencyGateway";
import CurrencyGatewayInMemory from "../src/CurrencyGatewayInMemory";
import Product from "../src/domain/entity/Product";
import ProductRepository from "../src/ProductRepository";
import ProductRepositoryDatabase from "../src/ProductRepositoryDatabase";
import sinon from "sinon";

let checkout: Checkout;

beforeAll(function() {
    checkout = new Checkout();
});

test("Deve criar um pedido com 3 produtos e calcular o valor total", async function() {
    const input = {
        items: [
            { idProduct: 1, quantity: 1 },
            { idProduct: 2, quantity: 1 },
            { idProduct: 3, quantity: 3 },
        ],
        cpf: "190.225.740-59"
    };
    const order = await checkout.execute(input);
    expect(order.total).toBe(6090);
});

test("Deve criar um pedido com 3 produtos com cupom de desconto e calcular o total", async function() {
    const input = {
        items: [
            { idProduct: 1, quantity: 1 },
            { idProduct: 2, quantity: 2 },
            { idProduct: 3, quantity: 2 },
        ],
        cpf: "190.225.740-59",
        coupon: "VALE20"
    };
    const order = await checkout.execute(input);
    expect(order.total).toBe(8848);
});

test("Deve criar um pedido com 1 produtos e calcular o frete", async function() {
    const input = {
        items: [
            { idProduct: 1, quantity: 3 },
        ],
        cpf: "190.225.740-59",
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
            { idProduct: 1, quantity: 1 },
        ],
        cpf: '000000000'
    };
    expect(() => checkout.execute(input)).rejects.toThrow(new Error("Invalid cpf number"));
});

test("Não deve criar um pedido com itens repetidos", async function() {
    const input = {
        items: [
            { idProduct: 1, quantity: 1 },
            { idProduct: 1, quantity: 1 },
        ],
        cpf: "190.225.740-59"
    };
    expect(() => checkout.execute(input)).rejects.toThrow(new Error("Duplicated items"));
});

test("Não deve criar um pedido com a quantidade negativa", async function() {
    const input = {
        items: [
            { idProduct: 1, quantity: -1 },
        ],
        cpf: "190.225.740-59"
    };
    expect(() => checkout.execute(input)).rejects.toThrow(new Error("Invalid quantity"));
});

test("Não deve aplicar um cupom inválido", async function() {
    const input = {
        items: [
            { idProduct: 1, quantity: 1 },
        ],
        cpf: "190.225.740-59",
        coupon: "VALE100"
    };
    expect(() => checkout.execute(input)).rejects.toThrow(new Error("Invalid coupon"));
});

test("Não deve aplicar cupom de desconto expirado", async function() {
    const input = {
        items: [
            { idProduct: 1, quantity: 1 },
        ],
        cpf: "190.225.740-59",
        coupon: "VALE30"
    };
    expect(() => checkout.execute(input)).rejects.toThrow(new Error("Expired coupon"));
});

test("Não deve criar um pedido com dimensões negativas", async function() {
    const input = {
        items: [
            { idProduct: 4, quantity: 1 },
        ],
        cpf: "190.225.740-59"
    };
    expect(() => checkout.execute(input)).rejects.toThrow(new Error("Invalid dimension"));
});

test("Deve criar um pedido com 1 produto em dólar usando um stub", async function () {
	const stubCurrencyGateway = sinon.stub(CurrencyGatewayInMemory.prototype, "getCurrencyValue").resolves(3);
	const stubProductRepository = sinon.stub(ProductRepositoryDatabase.prototype, "getProduct").resolves(
		new Product(5, "A", 1000, 10, 10, 10, 10, "USD")
	)
	const input = {
		cpf: "190.225.740-59",
		items: [
			{ idProduct: 5, quantity: 1 }
		]
	};
	const output = await checkout.execute(input);
	expect(output.total).toBe(3000);
	stubCurrencyGateway.restore();
	stubProductRepository.restore();
});

test("Deve criar um pedido com 3 produtos com cupom de desconto com spy", async function () {
	const spyProductRepository = sinon.spy(ProductRepositoryDatabase.prototype, "getProduct");
	const spyCouponRepository = sinon.spy(CouponRepositoryDatabase.prototype, "getCoupon");
	const input = {
		cpf: "407.302.170-27",
		items: [
			{ idProduct: 1, quantity: 1 },
			{ idProduct: 2, quantity: 1 },
			{ idProduct: 3, quantity: 3 }
		],
		coupon: "VALE20"
	};
	const output = await checkout.execute(input);
	expect(output.total).toBe(4872);
	// expect(spyCouponRepository.calledOnce).toBeTruthy();
	expect(spyCouponRepository.calledWith("VALE20")).toBeTruthy();
	expect(spyProductRepository.calledThrice).toBeTruthy();
	spyCouponRepository.restore();
	spyProductRepository.restore();
});

test("Deve criar um pedido com 1 produto em dólar usando um mock", async function () {
	const mockCurrencyGateway = sinon.mock(CurrencyGatewayInMemory.prototype);
	mockCurrencyGateway.expects("getCurrencyValue").once().resolves(3);
	const input = {
		cpf: "407.302.170-27",
		items: [
			{ idProduct: 5, quantity: 1 }
		]
	};
	const output = await checkout.execute(input);
	expect(output.total).toBe(3000);
	mockCurrencyGateway.verify();
	mockCurrencyGateway.restore();
});

test("Deve criar um pedido com 1 produto em dólar usando um fake", async function () {
	const currencyGateway: CurrencyGateway = {
		async getCurrencyValue(): Promise<any> {
			return 3;
		}
	}
	const productRepository: ProductRepository = {
		async getProduct (idProduct: number): Promise<any> {
			return new Product(6, "A", 1000, 10, 10, 10, 10, "USD");
		}
	}
	checkout = new Checkout(productRepository, new CouponRepositoryDatabase(), currencyGateway);
	const input = {
		cpf: "407.302.170-27",
		items: [
			{ idProduct: 6, quantity: 1 }
		]
	};
	const output = await checkout.execute(input);
	expect(output.total).toBe(3000);
});

// test("Deve criar um pedido e verificar o código de série", async function () {
// 	const stub = sinon.stub(OrderRepositoryDatabase.prototype, "count").resolves(1);
// 	const uuid = crypto.randomUUID();
// 	const input = {
// 		uuid,
// 		cpf: "407.302.170-27",
// 		items: [
// 			{ idProduct: 1, quantity: 1 },
// 			{ idProduct: 2, quantity: 1 },
// 			{ idProduct: 3, quantity: 3 }
// 		]
// 	};
// 	await checkout.execute(input);
// 	const output = await getOrder.execute(uuid);
// 	expect(output.code).toBe("202300000001");
// 	stub.restore();
// });
