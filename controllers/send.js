import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();
const remetente = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    tls:{
        rejectUnauthorized: false
    }
})


export default notificacao;

