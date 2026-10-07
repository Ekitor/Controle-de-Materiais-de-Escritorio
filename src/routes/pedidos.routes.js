const express = require('express');
const { db } = require('../database/db');
const { erroServidor } = require('../utils/helpers');
const { calcularStatus } = require('../utils/material');

const router = express.Router();

router.post('/', (req, res) => {
    try {
        const itens = req.body && req.body.itens;

        if (!Array.isArray(itens) || itens.length === 0) {
            return res.status(400).json({ erro: 'O pedido não possui itens.' });
        }

        const totais = new Map();

        for (const item of itens) {
            const id = item && item.id;
            const quantidade = item && item.quantidade;

            if (!Number.isInteger(id) || id <= 0) {
                return res.status(400).json({ erro: 'Item do pedido com ID inválido.' });
            }

            if (!Number.isInteger(quantidade) || quantidade <= 0) {
                return res.status(400).json({ erro: 'A quantidade de cada item deve ser um número inteiro maior que 0.' });
            }

            totais.set(id, (totais.get(id) || 0) + quantidade);
        }

        const buscar = db.prepare('SELECT * FROM materiais WHERE id_material = ?');
        const baixar = db.prepare(`
            UPDATE materiais
            SET quantidade = quantidade - ?, status_estoque = ?
            WHERE id_material = ?
        `);

        db.exec('BEGIN');

        try {
            for (const [id, quantidade] of totais) {
                const material = buscar.get(id);

                if (!material) {
                    db.exec('ROLLBACK');
                    return res.status(404).json({ erro: `Material ${id} não encontrado.` });
                }

                if (material.quantidade < quantidade) {
                    db.exec('ROLLBACK');
                    return res.status(409).json({
                        erro: `Estoque insuficiente de "${material.nome}": restam ${material.quantidade} un e o pedido pede ${quantidade} un.`
                    });
                }

                const novaQuantidade = material.quantidade - quantidade;
                baixar.run(quantidade, calcularStatus(novaQuantidade), id);
            }

            db.exec('COMMIT');
        } catch (err) {
            try { db.exec('ROLLBACK'); } catch (e) { /* já finalizada */ }
            throw err;
        }

        res.status(201).json({ mensagem: 'Pedido confirmado e estoque atualizado!' });
    } catch (err) {
        erroServidor(res, err);
    }
});

module.exports = router;
