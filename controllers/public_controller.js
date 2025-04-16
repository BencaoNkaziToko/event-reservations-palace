// controllers/public_controller.js
import connection from '../Database/database.js';

export const homeController = {
  home: async (req, res) => {
    const sql = "SELECT * FROM pacote";
    connection.query(sql, (err, results) => {
      if (err) {
        // Opcional: tratamento de erro mais robusto
        return res.status(500).send("Erro ao buscar pacotes");
      }
      res.render('index', {
        pacotes: results
      });
    });
  },
  menu: async (req, res) => {
    res.render('menu', {});
  }
};
