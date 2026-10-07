const { textoObrigatorio } = require('../utils/helpers');

function validarMaterial(body) {

    if (!body) {
        return 'Dados do material não foram enviados.';
    }

    const { nome, quantidade, preco, icone, marcas } = body;

    if (!textoObrigatorio(nome, 100)) {
        return 'Informe o nome do material.';
    }

    if (!Number.isInteger(quantidade) || quantidade < 0) {
        return 'A quantidade deve ser um número inteiro maior ou igual a 0.';
    }

    if (typeof preco !== 'number' || !Number.isFinite(preco) || preco < 0) {
        return 'O preço deve ser um número maior ou igual a 0.';
    }

    if (
        icone !== undefined &&
        icone !== null &&
        (typeof icone !== 'string' || icone.length > 20)
    ) {
        return 'Ícone inválido.';
    }

    if (marcas !== undefined && marcas !== null && !Array.isArray(marcas)) {
        return 'As marcas devem ser uma lista.';
    }

    return null;
}

module.exports = { validarMaterial };
