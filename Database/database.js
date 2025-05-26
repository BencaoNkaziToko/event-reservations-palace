// Database/database.js
import mysql from 'mysql2';

let connection;

function handleDisconnect() {
  connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'dbeventos'
  });

  connection.connect(err => {
    if (err) {
      console.error('Erro ao conectar-se ao MySQL:', err);
      setTimeout(handleDisconnect, 2000); // tenta reconectar após 2s
    } else {
      console.log('**** Conexão com Banco de Dados feita com sucesso ****');
    }
  });

  connection.on('error', err => {
    console.error('Erro de conexão:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.warn('Conexão perdida. Tentando reconectar...');
      handleDisconnect();
    } else {
      throw err;
    }
  });
}

// Inicializa conexão ao carregar o módulo
handleDisconnect();

export default connection;
