
import fs from "fs";
import path from "path";
import PDFDocument from "pdfkit";
import { fileURLToPath } from "url";

import mysql from 'mysql2';
// Definindo __dirname em ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "dbeventos",
});

export const printFacture = async (req, res) => {
  const id = req.params.id;

  const sql = `
    SELECT evento.*, pacote.nome AS nome_pacote, pacote.preco 
    FROM evento 
    LEFT JOIN pacote ON evento.idPacote = pacote.id 
    WHERE evento.ID = ?
  `;

  try {
    // Utilize a interface de Promises:
    const [results] = await connection.promise().query(sql, [id]);
    
    if (results.length === 0) {
      return res.status(404).json({ error: "Evento não encontrado" });
    }

    const evento = results[0];

    // Definir caminho do arquivo PDF
    const filePath = path.join(__dirname, `factura_${id}.pdf`);
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);

    // =============== CABEÇALHO ===============
    doc.image("./public/img/logo.png", 50, 40, { width: 100, height: 50 });

    doc
      .fontSize(14)
      .font("Helvetica-Bold")
      .text("Salão de Festas Palácio das Estrelas", 320, 45, { align: "right" })
      .moveDown(1)
      .fontSize(12)
      .font("Helvetica")
      .text("Fatura do Evento", { align: "right" })
      .moveDown(1);

    doc
      .moveTo(50, 90)
      .lineTo(550, 90)
      .stroke();

    // Funções de formatação
    const formatData = (data) => {
      return data
        ? new Date(data).toLocaleDateString("pt-PT", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
        : "N/A";
    };

    let dataVencimentoStr = "N/A";
    if (evento.dataSolicitacao) {
      const dataSolicitacao = new Date(evento.dataSolicitacao);
      dataSolicitacao.setDate(dataSolicitacao.getDate() + 2);
      dataVencimentoStr = dataSolicitacao.toLocaleDateString("pt-PT", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    }

    // ==================== BLOCO PRINCIPAL =====================
    let yPos = 100;

    doc
      .font("Helvetica-Bold")
      .fontSize(10)
      .text("COMPROVATIVO Nº:", 50, yPos)
      .text("Solicitante:", 50, yPos + 15)
      .text("Descrição:", 50, yPos + 30)
      .text("Data de Realização:", 50, yPos + 45)
      .text("Data de Solicitação:", 50, yPos + 60)
      .text("Horário:", 50, yPos + 75)
      .text("Telefone:", 50, yPos + 90)
      .text("Email:", 50, yPos + 105)
      .text("Status:", 50, yPos + 120)
      .text("Pacote:", 50, yPos + 135)
      .text("Preço:", 50, yPos + 150)
      .text("Data de Vencimento:", 50, yPos + 165);

    doc
      .font("Helvetica")
      .fontSize(10)
      .text(`${evento.ID}`, 150, yPos)
      .text(`${evento.solicitante || "N/A"}`, 150, yPos + 15)
      .text(`${evento.descricao || "N/A"}`, 150, yPos + 30)
      .text(`${formatData(evento.dataRealizacao)}`, 150, yPos + 45)
      .text(`${formatData(evento.dataSolicitacao)}`, 150, yPos + 60)
      .text(`${evento.horario || "N/A"}`, 150, yPos + 75)
      .text(`${evento.telefone || "N/A"}`, 150, yPos + 90)
      .text(`${evento.email || "N/A"}`, 150, yPos + 105)
      .text(`${evento.status || "N/A"}`, 150, yPos + 120)
      .text(`${evento.nome_pacote || "Sem pacote"}`, 150, yPos + 135)
      .text(`Kz ${evento.preco !== null ? evento.preco.toLocaleString() : "A definir"}`, 150, yPos + 150)
      .text(`${dataVencimentoStr}`, 150, yPos + 165);

    // ===================== RODAPÉ =====================
    doc
      .moveTo(50, yPos + 195)
      .lineTo(550, yPos + 195)
      .stroke();

    doc
      .fontSize(10)
      .font("Helvetica")
      .text("Obrigado por escolher nossos serviços!", 50, yPos + 205, { align: "center" });

    const rodapeY = yPos + 230;
    doc
      .fontSize(9)
      .font("Helvetica")
      .text(
        "A data de vencimento para confirmar o evento é de 2 dias após a solicitação. " +
          "Por favor, dirija-se ao nosso estabelecimento até a data de vencimento para concluir a confirmação do evento. " +
          "Após esse período, a reserva poderá ser cancelada.",
        50,
        rodapeY,
        { align: "left", width: 500 }
      );

    doc
      .text("Endereço: Rua do Café de fronte ao ISCED - Bairro Papelão - Uíge", 50, rodapeY + 50, { align: "left" })
      .text("Telefone: +244 922 376 640", 50, rodapeY + 65, { align: "left" })
      .text("WhatsApp: +244 939 213 148", 50, rodapeY + 80, { align: "left" })
      .text("E-mail: palaciodasestrelas02@gmail.com", 50, rodapeY + 95, { align: "left" })
      .text("Horário de Atendimento: Segunda a Sexta - 8h às 17h", 50, rodapeY + 110, { align: "left" });

    doc.end();

    writeStream.on("finish", () => {
      res.download(filePath, `comprovativo_${id}.pdf`, (err) => {
        if (err) {
          console.error("Erro ao enviar o comprovativo:", err);
        } else {
          fs.unlink(filePath, (err) => {
            if (err) console.error("Erro ao excluir o arquivo:", err);
          });
        }
      });
    });
  } catch (error) {
    console.error("Erro ao executar query:", error);
    res.status(500).json({ error: "Erro ao executar query", details: error });
  }
};
