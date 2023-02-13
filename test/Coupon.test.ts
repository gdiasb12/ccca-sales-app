import Coupon from "../src/domain/entity/Coupon";

test("Deve criar um cupom de desconto válido", function () {
	const coupon = new Coupon("VALE20", 20, true);
	expect(coupon.isExpired()).toBeFalsy();
});

test("Deve criar um cupom de desconto inválido", function () {
	const coupon = new Coupon("VALE20", 20, false);
	expect(coupon.isExpired()).toBeTruthy();
});

test("Deve calcular o desconto", function () {
	const coupon = new Coupon("VALE20", 20, true);
	expect(coupon.calculateDiscount(1000)).toBe(200);
});
