import FreightCalculator from "../src/domain/entity/FreightCalculator";

test("Deve calcular o frete do produto", function () {
	const product = { idProduct: 6, description: "A", price: 1000, width: 100, height: 30, length: 10, weight: 3};
	const freight = FreightCalculator.calculate(product);
	expect(freight).toBe(30);
});

test("Deve calcular o frete do produto com o valor mínimo de 10 reais", function () {
	const product = { idProduct: 6, description: "A", price: 1000, width: 1, height: 3, length: 10, weight: 0.5};
	const freight = FreightCalculator.calculate(product);
	expect(freight).toBe(10);
});

