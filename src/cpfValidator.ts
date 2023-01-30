const DEFAULT_SIZE = 11;
const FIRST_DIGIT_FACTOR = 10;
const SECOND_DIGIT_FACTOR = 11;

function isValidCpf (cpf: string): boolean {
    cpf = sanitizeCpf(cpf);
    if ((!isValidSize(cpf)) || isRepeatedDigits(cpf)) return false;
    let firstDigit = calculateDigit(cpf, FIRST_DIGIT_FACTOR);
    let secondDigit = calculateDigit(cpf + firstDigit, SECOND_DIGIT_FACTOR);
    let originalCpfDigits = cpf.substring(cpf.length - 2, cpf.length);
    return originalCpfDigits == `${firstDigit}${secondDigit}`;
}

function sanitizeCpf (cpf: string): string {
    return cpf.replace(/\D+/g, "");
}

function isValidSize (cpf: string): boolean {
    return cpf.length == DEFAULT_SIZE;
}

function isRepeatedDigits (cpf: string): boolean {
    return cpf.split("").every(digit => digit === cpf[0]);
}

function calculateDigit (cpf: string, factor: number): number {
    let digitValue = 0;
    for (let digit of cpf) 
        if (factor >= 2) digitValue += (factor-- * parseInt(digit));
    let restOfDivision = (digitValue % DEFAULT_SIZE);
    return (restOfDivision < 2) ? 0: DEFAULT_SIZE - restOfDivision;
}

export function validateCpf (cpf: string): boolean {
    if ((!cpf) || !isValidCpf(cpf)) throw new Error("Invalid cpf number");
    return true;
}
