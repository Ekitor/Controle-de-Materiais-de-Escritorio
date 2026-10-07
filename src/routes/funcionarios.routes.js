const express = require('express');
const { db } = require('../database/db');
const { erroServidor, idValido } = require('../utils/helpers');
const { validarFuncionario } = require('../validators/funcionario.validator');

const router = express.Router();

router.get('/', (req, res) => {
    try {
        const funcionarios = db.prepare(`
            SELECT
                id_funcionario AS id,
                nome,
                cargo,
                departamento
            FROM funcionarios
            ORDER BY nome COLLATE NOCASE
        `).all();

        res.json(funcionarios);
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

        const funcionario = db.prepare(`
            SELECT
                id_funcionario AS id,
                nome,
                cargo,
                departamento
            FROM funcionarios
            WHERE id_funcionario = ?
        `).get(id);

        if (!funcionario) {
            return res.status(404).json({ erro: 'Funcionário não encontrado.' });
        }

        res.json(funcionario);
    } catch (err) {
        erroServidor(res, err);
    }
});

router.post('/', (req, res) => {
    try {
        const erro = validarFuncionario(req.body);

        if (erro) {
            return res.status(400).json({ erro });
        }

        const { nome, cargo, departamento } = req.body;

        const resultado = db.prepare(`
            INSERT INTO funcionarios (nome, cargo, departamento)
            VALUES (?, ?, ?)
        `).run(nome.trim(), cargo.trim(), departamento.trim());

        res.status(201).json({
            mensagem: 'Funcionário cadastrado com sucesso!',
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
        const erro = validarFuncionario(req.body);

        if (erro) {
            return res.status(400).json({ erro });
        }

        const { nome, cargo, departamento } = req.body;

        const resultado = db.prepare(`
            UPDATE funcionarios
            SET nome = ?, cargo = ?, departamento = ?
            WHERE id_funcionario = ?
        `).run(nome.trim(), cargo.trim(), departamento.trim(), id);

        if (resultado.changes === 0) {
            return res.status(404).json({ erro: 'Funcionário não encontrado.' });
        }

        res.json({ mensagem: 'Funcionário atualizado com sucesso!' });
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
            DELETE FROM funcionarios
            WHERE id_funcionario = ?
        `).run(id);

        if (resultado.changes === 0) {
            return res.status(404).json({ erro: 'Funcionário não encontrado.' });
        }

        res.json({ mensagem: 'Funcionário excluído com sucesso!' });
    } catch (err) {
        erroServidor(res, err);
    }
});

module.exports = router;
