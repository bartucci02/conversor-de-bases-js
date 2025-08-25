// script.js

const PRECISION = 5;

// Funções Decimal -> Outras bases
function decToBin(n) {
    let intPart = Math.floor(n);
    let fracPart = n - intPart;
    let result = '';

    if (intPart === 0) {
        result = '0';
    } else {
        let bin = [];
        while (intPart > 0) {
            bin.push(intPart % 2);
            intPart = Math.floor(intPart / 2);
        }
        result = bin.reverse().join('');
    }

    if (fracPart > 0) {
        result += '.';
        for (let i = 0; i < PRECISION && fracPart > 0; i++) {
            fracPart *= 2;
            let bit = Math.floor(fracPart);
            result += bit;
            fracPart -= bit;
        }
    }
    return result;
}

function decToOctal(n) {
    let intPart = Math.floor(n);
    let fracPart = n - intPart;
    let result = '';

    if (intPart === 0) {
        result = '0';
    } else {
        let oct = [];
        while (intPart > 0) {
            oct.push(intPart % 8);
            intPart = Math.floor(intPart / 8);
        }
        result = oct.reverse().join('');
    }

    if (fracPart > 0) {
        result += '.';
        for (let i = 0; i < PRECISION && fracPart > 0; i++) {
            fracPart *= 8;
            let digit = Math.floor(fracPart);
            result += digit;
            fracPart -= digit;
        }
    }
    return result;
}

function decToHex(n) {
    let intPart = Math.floor(n);
    let fracPart = n - intPart;
    let result = '';
    const hexChars = '0123456789ABCDEF';

    if (intPart === 0) {
        result = '0';
    } else {
        let hex = [];
        while (intPart > 0) {
            hex.push(hexChars[intPart % 16]);
            intPart = Math.floor(intPart / 16);
        }
        result = hex.reverse().join('');
    }

    if (fracPart > 0) {
        result += '.';
        for (let i = 0; i < PRECISION && fracPart > 0; i++) {
            fracPart *= 16;
            let digit = Math.floor(fracPart);
            result += hexChars[digit];
            fracPart -= digit;
        }
    }
    return result;
}

// Funções Outras bases -> Decimal
function binToDec(bin) {
    let result = 0.0;
    const pointIndex = bin.indexOf('.');
    const intLen = pointIndex !== -1 ? pointIndex : bin.length;

    for (let i = 0; i < intLen; i++) {
        result = result * 2 + (bin.charCodeAt(i) - '0'.charCodeAt(0));
    }

    if (pointIndex !== -1) {
        let base = 0.5;
        for (let i = pointIndex + 1; i < bin.length; i++) {
            if (bin[i] === '1') result += base;
            base /= 2;
        }
    }
    return result;
}

function octToDec(oct) {
    let result = 0.0;
    const pointIndex = oct.indexOf('.');
    const intLen = pointIndex !== -1 ? pointIndex : oct.length;

    for (let i = 0; i < intLen; i++) {
        result = result * 8 + (oct.charCodeAt(i) - '0'.charCodeAt(0));
    }

    if (pointIndex !== -1) {
        let base = 1 / 8;
        for (let i = pointIndex + 1; i < oct.length; i++) {
            result += (oct.charCodeAt(i) - '0'.charCodeAt(0)) * base;
            base /= 8;
        }
    }
    return result;
}

function hexToDec(hex) {
    let result = 0.0;
    const pointIndex = hex.indexOf('.');
    const intLen = pointIndex !== -1 ? pointIndex : hex.length;

    for (let i = 0; i < intLen; i++) {
        let c = hex[i].toUpperCase();
        let val = parseInt(c, 16);
        result = result * 16 + val;
    }

    if (pointIndex !== -1) {
        let base = 1 / 16;
        for (let i = pointIndex + 1; i < hex.length; i++) {
            let c = hex[i].toUpperCase();
            let val = parseInt(c, 16);
            result += val * base;
            base /= 16;
        }
    }
    return result;
}

// Função principal de conversão
function convert() {
    const numero = document.getElementById('numero').value.trim();
    const baseOrigem = parseInt(document.getElementById('baseOrigem').value);
    const baseDestino = parseInt(document.getElementById('baseDestino').value);
    const resultadoElem = document.getElementById('resultado');

    if (!numero) {
        resultadoElem.textContent = 'Por favor, insira um número.';
        return;
    }

    // Validação básica de formato
    if (baseOrigem === 2 && !/^[01]+(\.[01]+)?$/.test(numero)) {
        resultadoElem.textContent = 'Erro: Número binário inválido (use apenas 0 e 1).';
        return;
    }
    if (baseOrigem === 3 && !/^[0-7]+(\.[0-7]+)?$/.test(numero)) {
        resultadoElem.textContent = 'Erro: Número octal inválido (use apenas 0-7).';
        return;
    }
    if (baseOrigem === 4 && !/^[0-9A-Fa-f]+(\.[0-9A-Fa-f]+)?$/.test(numero)) {
        resultadoElem.textContent = 'Erro: Número hexadecimal inválido (use apenas 0-9 e A-F).';
        return;
    }
    if (baseOrigem === 1 && isNaN(parseFloat(numero))) {
        resultadoElem.textContent = 'Erro: Número decimal inválido.';
        return;
    }

    let decimal = 0.0;

    try {
        if (baseOrigem === 1) decimal = parseFloat(numero);
        else if (baseOrigem === 2) decimal = binToDec(numero);
        else if (baseOrigem === 3) decimal = octToDec(numero);
        else if (baseOrigem === 4) decimal = hexToDec(numero);
        else throw new Error('Base de origem inválida!');

        let resultado = '';
        if (baseDestino === 1) resultado = decimal.toString();
        else if (baseDestino === 2) resultado = decToBin(decimal);
        else if (baseDestino === 3) resultado = decToOctal(decimal);
        else if (baseDestino === 4) resultado = decToHex(decimal);
        else throw new Error('Base de destino inválida!');

        resultadoElem.textContent = `Resultado: ${resultado}`;
    } catch (error) {
        resultadoElem.textContent = `Erro: ${error.message}`;
    }
}

// Adicione evento ao botão quando o DOM carregar
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('converterBtn').addEventListener('click', convert);
});