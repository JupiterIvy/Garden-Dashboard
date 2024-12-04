// const express = require('express');
// const nodemailer = require('nodemailer');
// const bodyParser = require('body-parser');

// const app = express();
// app.use(bodyParser.json());

// // Configurar o transporte do Nodemailer (ajuste com suas credenciais de e-mail)
// const transporter = nodemailer.createTransport({
//     service: 'gmail', // ou outro provedor de e-mail
//     auth: {
//         user: 'automata.checks@gmail.com',
//         pass: 'f4lc$022',
//     }
// });

// // Endpoint para enviar e-mail
// app.post('/send-notification', (req, res) => {
//     console.log("BBB",req.body)
//     const { temperatura } = req.body.valor;

//     const mailOptions = {
//         from: 'automata.checks@gmail.com',
//         to: 'neweeryy@gmail.com', // E-mail do usuário que deve ser notificado
//         subject: 'Alerta de Temperatura Alta',
//         text: `A temperatura está muito alta: ${temperatura}°C. Verifique sua estufa!`,
//     };

//     transporter.sendMail(mailOptions, (error, info) => {
//         if (error) {
//             console.log(error);
//             return res.status(500).send({ success: false, message: 'Erro ao enviar o e-mail' });
//         }
//         console.log('E-mail enviado: ' + info.response);
//         return res.status(200).send({ success: true, message: 'E-mail enviado com sucesso' });
//     });
// });

// app.listen(3000, () => {
//     console.log('Servidor rodando na porta 3000');
// });
