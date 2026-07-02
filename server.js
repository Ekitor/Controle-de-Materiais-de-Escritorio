const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors()); // Permite requisições do front-end
app.use(express.json()); // Permite receber dados em formato JSON

// Configuração da conexão com o Banco de Dados (MySQL do XAMPP)
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Usuário padrão do XAMPP
    password: '', // Senha padrão é vazia
    database: 'almoxarifado_ifpe' // Nome do banco que você criou
});

db.connect(err => {
    if(err) {
        console.error('Erro ao conectar no banco de dados:', err);
        return;
    }
    console.log('Conectado ao MySQL com sucesso!');
});

// ================= ROTAS DE MATERIAIS (CRUD) =================

// READ (Ler todos os materiais)
app.get('/api/materiais', (req, res) => {
    db.query('SELECT * FROM materiais', (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// CREATE (Cadastrar novo material)
app.post('/api/materiais', (req, res) => {
    const { nome, icone, quantidade, preco } = req.body;
    const status_estoque = quantidade > 0 ? 'disponivel' : 'indisponivel';
    
    const query = 'INSERT INTO materiais (nome, icone, status_estoque, quantidade, preco) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [nome, icone, status_estoque, quantidade, preco], (err, results) => {
        if (err) return res.status(500).json(err);
        res.json({ mensagem: 'Material cadastrado!', id: results.insertId });
    });
});

// DELETE (Excluir material - Exemplo opcional para a vitrine)
app.delete('/api/materiais/:id', (req, res) => {
    const id = req.params.id;
    db.query('DELETE FROM materiais WHERE id_material = ?', [id], (err, results) => {
        if (err) return res.status(500).json(err);
        res.json({ mensagem: 'Material excluído!' });
    });
});

// Inicializa o Servidor
const PORTA = 3000;
app.listen(PORTA, () => {
    console.log(`Servidor rodando em http://localhost:${PORTA}`);
});

