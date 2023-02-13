export default class Coupon {
    constructor(
        readonly code: string,
        readonly percentage: number,
        readonly status: boolean,
    ) {
    }

    isExpired(): boolean {
        return !this.status;
    }

    calculateDiscount(amount: number): number
    {
        return (amount * this.percentage) / 100;
    }
}
