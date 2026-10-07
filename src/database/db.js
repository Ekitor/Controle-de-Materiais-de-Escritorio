const path = require('path');
const fs = require('fs');
const { DatabaseSync } = require('node:sqlite');

const RAIZ = path.join(__dirname, '..', '..');
const ARQUIVO_DB = path.join(RAIZ, 'data', 'almoxarifado.db');
const ARQUIVO_INSERTS = path.join(RAIZ, 'sql', '02_inserts.sql');

fs.mkdirSync(path.dirname(ARQUIVO_DB), { recursive: true });

let db;

try {
    db = new DatabaseSync(ARQUIVO_DB);
    console.log('SQLite conectado com sucesso!');
} catch (err) {
    console.error('ERRO ao abrir/criar o banco SQLite:', err);
    process.exit(1);
}

db.exec(`
    CREATE TABLE IF NOT EXISTS funcionarios (
        id_funcionario INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        cargo TEXT NOT NULL,
        departamento TEXT NOT NULL
    );
`);

db.exec(`
    CREATE TABLE IF NOT EXISTS materiais (
        id_material INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        icone TEXT,
        status_estoque TEXT NOT NULL DEFAULT 'indisponivel',
        quantidade INTEGER NOT NULL DEFAULT 0,
        preco REAL NOT NULL DEFAULT 0,
        marcas TEXT
    );
`);

console.log('Tabelas verificadas/criadas com sucesso!');

try {
    const { user_version: versao } = db.prepare('PRAGMA user_version').get();

    if (versao === 0 && fs.existsSync(ARQUIVO_INSERTS)) {
        const total =
            db.prepare('SELECT COUNT(*) AS n FROM funcionarios').get().n +
            db.prepare('SELECT COUNT(*) AS n FROM materiais').get().n;

        if (total === 0) {
            db.exec(fs.readFileSync(ARQUIVO_INSERTS, 'utf8'));
            console.log('Dados de exemplo inseridos (sql/02_inserts.sql).');
        }
    }

    db.exec('PRAGMA user_version = 1');
} catch (err) {
    console.error('ERRO ao carregar os dados de exemplo:', err);
}

module.exports = { db, ARQUIVO_DB };
