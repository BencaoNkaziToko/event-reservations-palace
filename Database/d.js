import pkg from 'pg';
const { Pool } = pkg;

// Criar um pool de conexões diretamente com a string fornecida
const pool = new Pool({
  connectionString: 'postgresql://dbestrelas_owner:npg_QVCpqZ7Nb6Jf@ep-noisy-dust-a5c3i9tt-pooler.us-east-2.aws.neon.tech/dbestrelas?sslmode=require'
});

// Testando a conexão
(async () => {
  try {
    const client = await pool.connect();
    console.log('✅ Conectado ao PostgreSQL!');
    client.release(); // Libera a conexão para o pool
  } catch (error) {
    console.error('❌ Erro ao conectar ao PostgreSQL:', error.message);
  }
})();

export default pool;
