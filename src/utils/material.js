function formatarMaterial(linha) {
    return {
        id: linha.id_material,
        nome: linha.nome,
        icone: linha.icone,
        status_estoque: linha.status_estoque,
        quantidade: linha.quantidade,
        preco: Number(linha.preco),

        marcas: linha.marcas
            ? linha.marcas
                .split(',')
                .map(marca => marca.trim())
                .filter(Boolean)
            : []
    };
}

function marcasParaTexto(marcas) {

    if (!Array.isArray(marcas)) {
        return null;
    }

    return marcas
        .map(marca => String(marca).trim())
        .filter(Boolean)
        .join(',')
        .slice(0, 255);
}

function calcularStatus(quantidade) {
    return quantidade > 0 ? 'disponivel' : 'indisponivel';
}

module.exports = { formatarMaterial, marcasParaTexto, calcularStatus };
