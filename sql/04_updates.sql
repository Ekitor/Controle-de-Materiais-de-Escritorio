UPDATE funcionarios
   SET cargo = 'Coordenadora de Patrimônio'
 WHERE id_funcionario = 1;

UPDATE materiais
   SET quantidade = 30, status_estoque = 'disponivel'
 WHERE nome = 'Caneta';

SELECT * FROM funcionarios WHERE id_funcionario = 1;
SELECT * FROM materiais WHERE nome = 'Caneta';
