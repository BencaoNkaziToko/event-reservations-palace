// Importando os módulos necessários
import express from "express";
import bodyParser from "body-parser";
import util from "util";
import path from "path";
import session from "express-session";
import cors from "cors";
import { fileURLToPath } from "url";

import publicRoutes from "./routes/public_routes.js";
import itemRoutes from "./routes/item.js";
import pacote_routes from "./routes/pacote_router.js";
import funcaoRoutes from "./routes/funcao_router.js";
import utilizadorRoutes from "./routes/utilizador_route.js";
import eventoRoutes from "./routes/evento_router.js";
import pdfRoutes from "./routes/facture_router.js";
import admRoutes from "./routes/admin_routes.js";

// Importando a conexão com o banco de dados
import connection from "./Database/database.js";

const app = express();
const port = process.env.PORT || 5000;

// Definindo __dirname para ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Conexão com o banco de dados
connection.connect(function (error) {
    if (error) {
        console.log("Aviso: " + error);
    } else {
        console.log("****  Conexão com Banco de Dados feita com sucesso  ****");
    }
});

const query = util.promisify(connection.query).bind(connection);

// Configurando diretórios de arquivos estáticos
app.use(express.static("public"));
app.use("/public", express.static(path.join(__dirname, "public")));
app.use("/pdfs", express.static(path.join(__dirname, "pdfs")));

// Configurando o motor de visualização EJS
app.set("views", "views");
app.set("view engine", "ejs");

// Configurando body-parser para processar dados de formulários
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Configurando sessão
app.use(
    session({
        secret: "seuSegredoAqui",
        resave: false,
        saveUninitialized: true,
    })
);

// Configurando o middleware CORS para permitir requisições de qualquer origem
app.use(cors());

// Usando as rotas do sistema
app.use("/", publicRoutes);
app.use("/", itemRoutes);
app.use("/", pacote_routes);
app.use("/", funcaoRoutes);
app.use("/", utilizadorRoutes);
app.use("/", eventoRoutes);
app.use("/", pdfRoutes);
app.use("/", admRoutes);

// Iniciando o servidor
app.listen(port, () => {
    console.log("API rodando na porta " + port);
});
