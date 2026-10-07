const app = require('./src/app');
const { db, ARQUIVO_DB } = require('./src/database/db');

const PORTA = Number(process.env.PORT) || 3000;

const servidor = app.listen(PORTA, () => {

    console.log('');
    console.log('======================================');
    console.log('      OPUSHUB INICIADO');
    console.log('======================================');
    console.log(`Servidor rodando em http://localhost:${PORTA}`);
    console.log(`Banco: ${ARQUIVO_DB}`);
    console.log('======================================');
    console.log('');

});

function encerrar() {

    console.log('\nEncerrando servidor...');

    servidor.close(() => {

        try {
            db.close();
        } catch (err) {
            console.error('Erro ao fechar banco:', err);
        }

        console.log('Servidor encerrado.');
        process.exit(0);

    });

}

process.on('SIGINT', encerrar);
process.on('SIGTERM', encerrar);
