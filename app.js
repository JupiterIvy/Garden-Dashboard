const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const nodemailer = require("nodemailer"); // Importar o Nodemailer para enviar o e-mail
const app = express();
const host = "http://127.0.0.1:";
const port = 3000;

// load dotenv to read environment variables
require("dotenv").config();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());  // Adicionando middleware para JSON

// template view engine
app.set("view engine", "ejs");

// Serve Static Files
app.use(express.static("public"));

// Session Config
app.use(session({
  secret: "mySecretKey", // Altere para um valor mais seguro
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Defina como `true` em produção se estiver usando HTTPS
    maxAge: 3600000 // 1 hora de duração para a sessão
  }
}));

function isAuthenticated(req, res, next) {
  if (req.session.user) return next();
  res.redirect("/login");
}

// Configurar o transporte do Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail', // ou outro serviço de e-mail que você esteja usando
  auth: {
    user: process.env.EMAIL_USER, // Defina seu e-mail no arquivo .env
    pass: process.env.EMAIL_PASS, // Defina sua senha no arquivo .env
  }
});

// Rota para enviar a notificação
app.post("/send-notification", (req, res) => {
  const { temperatura } = req.body;

  if (!temperatura) {
    return res.status(400).json({ error: 'Temperatura não fornecida' });
  }

  const mailOptions = {
    from: process.env.EMAIL_USER, // E-mail de envio
    to: 'email-do-usuario@dominio.com', // E-mail do usuário
    subject: 'Alerta de Temperatura Alta',
    text: `A temperatura está muito alta: ${temperatura}°C. Verifique sua estufa!`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Erro ao enviar e-mail:', error);
      return res.status(500).json({ success: false, message: 'Erro ao enviar o e-mail' });
    }
    console.log('E-mail enviado:', info.response);
    return res.status(200).json({ success: true, message: 'E-mail enviado com sucesso' });
  });
});

// Outras rotas
const dashboardRouter = require("./routes/dashboard");
const actuatorsRouter = require("./routes/actuators");
const authRouter = require("./routes/auth");

app.get("/mqttConnDetails", (req, res) => {
  res.send(
    JSON.stringify({
      mqttServer: process.env.MQTT_BROKER,
      mqttTopics: process.env.MQTT_TOPICS.split(","), // Divide os tópicos em um array
    })
  );
  console.log(process.env.MQTT_BROKER)
});

app.use(authRouter);
app.get(["/", "/dashboard"], isAuthenticated, dashboardRouter);
app.use("/", isAuthenticated, actuatorsRouter);

app.listen(port, () => {
  console.log(`Example app listening on host ${host}${port}`);
});
