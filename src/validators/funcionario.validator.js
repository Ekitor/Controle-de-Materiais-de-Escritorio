const { textoObrigatorio } = require('../utils/helpers');

function validarFuncionario(body) {

    if (!body) {
        return 'Dados do funcionário não foram enviados.';
    }

    const { nome, cargo, departamento } = body;

    if (!textoObrigatorio(nome, 100)) {
        return 'Informe o nome do funcionário.';
    }

    if (!textoObrigatorio(cargo, 100)) {
        return 'Informe o cargo.';
    }

    if (!textoObrigatorio(departamento, 100)) {
        return 'Informe o departamento.';
    }

    return null;
}

module.exports = { validarFuncionario };
