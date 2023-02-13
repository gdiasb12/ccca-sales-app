import CurrencyGateway from "./CurrencyGateway";

export default class CurrencyGatewayInMemory implements CurrencyGateway {
    async getCurrencyValue(currency: string = 'BRL'): Promise<number> {
        const arr = [
            { value: 1, currency: 'BRL' },
            { value: 4.2, currency: 'USD' },
        ];
        const currency_value = arr.find((obj) => {
            return obj.currency === currency;
        });
        return currency_value ? currency_value.value : 1;
    }    
}
