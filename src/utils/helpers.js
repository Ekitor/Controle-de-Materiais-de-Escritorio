function erroServidor(res, err) {
    console.error('Erro:', err);

    return res.status(500).json({
        erro: 'Erro interno do servidor.'
    });
}

function idValido(valor) {
    return /^\d+$/.test(String(valor)) &&
        Number(valor) > 0;
}

function textoObrigatorio(valor, maximo) {
    return (
        typeof valor === 'string' &&
        valor.trim().length > 0 &&
        valor.trim().length <= maximo
    );
}

module.exports = { erroServidor, idValido, textoObrigatorio };
