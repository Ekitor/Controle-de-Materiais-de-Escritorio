CREATE TABLE IF NOT EXISTS funcionarios (
    id_funcionario INTEGER PRIMARY KEY AUTOINCREMENT,
    nome           TEXT NOT NULL CHECK (length(nome) <= 100),
    cargo          TEXT NOT NULL CHECK (length(cargo) <= 100),
    departamento   TEXT NOT NULL CHECK (length(departamento) <= 100)
);

CREATE TABLE IF NOT EXISTS materiais (
    id_material    INTEGER PRIMARY KEY AUTOINCREMENT,
    nome           TEXT NOT NULL CHECK (length(nome) <= 100),
    icone          TEXT CHECK (icone IS NULL OR length(icone) <= 20),
    status_estoque TEXT NOT NULL DEFAULT 'disponivel'
                   CHECK (status_estoque IN ('disponivel', 'indisponivel')),
    quantidade     INTEGER NOT NULL DEFAULT 0 CHECK (quantidade >= 0),
    preco          REAL NOT NULL DEFAULT 0.00 CHECK (preco >= 0),
    marcas         TEXT CHECK (marcas IS NULL OR length(marcas) <= 255) 