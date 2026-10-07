SELECT id_funcionario, nome, cargo, departamento FROM funcionarios ORDER BY nome COLLATE NOCASE;

SELECT * FROM funcionarios WHERE id_funcionario = 1;

SELECT * FROM materiais ORDER BY nome COLLATE NOCASE;

SELECT nome, quantidade, preco FROM materiais WHERE status_estoque = 'disponivel';

SELECT SUM(quantidade * preco) AS valor_total_estoque FROM materiais;
