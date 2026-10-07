const express = require('express');
const { db } = require('../database/db');
const { erroServidor, idValido } = require('../utils/helpers');
const { validarMaterial } = require('../validators/material.validator');
const {
    formatarMaterial,
    marcasParaTexto,
    calcularStatus
} = require('../utils/material');

const router = express.Router();

router.get('/', (req, res) => {
    try {
        const materiais = db.prepare(`
            SELECT *
            FROM materiais
            ORDER BY nome COLLATE NOCASE
        `).all();

        res.json(materiais.map(formatarMaterial));
    } catch (err) {
        erroServidor(res, err);
    }
});

router.get('/:id', (req, res) => {
    try {
        if (!idValido(req.params.id)) {
            return res.status(400).json({ erro: 'ID inválido.' });
        }

        const id = Number(req.params.id);

        const material = db.prepare(`
            SELECT *
            FROM materiais
            WHERE id_material = ?
        `).get(id);

        if (!material) {
            return res.status(404).json({ erro: 'Material não encontrado.' });
        }

        res.json(formatarMaterial(material));
    } catch (err) {
        erroServidor(res, err);
    }
});

router.post('/', (req, res) => {
    try {
        const erro = validarMaterial(req.body);

        if (erro) {
            return res.status(400).json({ erro });
        }

        const { nome, icone, quantidade, preco, marcas } = req.body;

        const resultado = db.prepare(`
            INSERT INTO materiais
                (nome, icone, status_estoque, quantidade, preco, marcas)
            VALUES (?, ?, ?, ?, ?, ?)
        `).run(
            nome.trim(),
            icone || null,
            calcularStatus(quantidade),
            quantidade,
            preco,
            marcasParaTexto(marcas)
        );

        res.status(201).json({
            mensagem: 'Material cadastrado com sucesso!',
            id: Number(resultado.lastInsertRowid)
        });
    } catch (err) {
        erroServidor(res, err);
    }
});

router.put('/:id', (req, res) => {
    try {
        if (!idValido(req.params.id)) {
            return res.status(400).json({ erro: 'ID inválido.' });
        }

        const id = Number(req.params.id);
        const erro = validarMaterial(req.body);

        if (erro) {
            return res.status(400).json({ erro });
        }

        const { nome, icone, quantidade, preco, marcas } = req.body;

        const resultado = db.prepare(`
            UPDATE materiais
            SET
                nome = ?,
                icone = ?,
                status_estoque = ?,
                quantidade = ?,
                preco = ?,
                marcas = ?
            WHERE id_material = ?
        `).run(
            nome.trim(),
            icone || null,
            calcularStatus(quantidade),
            quantidade,
            preco,
            marcasParaTexto(marcas),
            id
        );

        if (resultado.changes === 0) {
            return res.status(404).json({ erro: 'Material não encontrado.' });
        }

        res.json({ mensagem: 'Material atualizado com sucesso!' });
    } catch (err) {
        erroServidor(res, err);
    }
});

router.delete('/:id', (req, res) => {
    try {
        if (!idValido(req.params.id)) {
            return res.status(400).json({ erro: 'ID inválido.' });
        }

        const id = Number(req.params.id);

        const resultado = db.prepare(`
            DELETE FROM materiais
            WHERE id_material = ?
        `).run(id);

        if (resultado.changes === 0) {
            return res.status(404).json({ erro: 'Material não encontrado.' });
        }

        res.json({ mensagem: 'Material excluído com sucesso!' });
    } catch (err) {
        erroServidor(res, err);
    }
});

module.exports = router;
