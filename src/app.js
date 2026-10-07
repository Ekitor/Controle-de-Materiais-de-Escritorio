const path = require('path');
const express = require('express');
const cors = require('cors');

const funcionariosRoutes = require('./routes/funcionarios.routes');
const materiaisRoutes = require('./routes/materiais.routes');
const pedidosRoutes = require('./routes/pedidos.routes');
const { erroServidor } = require('./utils/helpers');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/funcionarios', funcionariosRoutes);
app.use('/api/materiais', materiaisRoutes);
app.use('/api/pedidos', pedidosRoutes);

app.use('/api', (req, res) => {
    res.status(404).json({ erro: 'Rota da API não encontrada.' });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.use((err, req, res, next) => {
    if (err && err.type === 'entity.parse.failed') {
        return res.status(400).json({ erro: 'JSON inválido.' });
    }

    erroServidor(res, err);
});

module.exports = app;
