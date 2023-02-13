export default interface CurrencyGateway {
	getCurrencyValue (currency: string): Promise<number>;
}
