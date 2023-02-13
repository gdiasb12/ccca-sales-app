import { validateCpf } from "../src/domain/entity/cpfValidator";

const validCpfData = [
    { cpf: "19022574059" },
    { cpf: "757.588.150-63" },
    { cpf: "190.225.740-59" },
    { cpf: "1902257405-9" }
];

describe.each(validCpfData)(`Deve validar um cpf correto`, (cpfs) => {
    it(`${cpfs.cpf} é um valor válido`, () => {
        expect(validateCpf(cpfs.cpf)).toBeTruthy();
    });
});

const invalidCpfData = [
    { cpf: "19022574057" },
    { cpf: "00000000000" },
    { cpf: "574059" },
    { cpf: ""}
];

describe.each(invalidCpfData)(`Não deve validar um cpf incorreto`, (cpfs) => {
    it(`${cpfs.cpf} não é um valor válido`, () => {
        expect(() => validateCpf(cpfs.cpf)).toThrow(new Error("Invalid cpf number"));
    });
});
