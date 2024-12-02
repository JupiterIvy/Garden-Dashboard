const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const app = express();
const host = "http://127.0.0.1:";
const port = 3000;

// load dotenv to read environment variables
require("dotenv").config();

app.use(bodyParser.urlencoded({ extended: true }));

// template view engine
app.set("view engine", "ejs");

// Serve Static Files
app.use(express.static("public"));

// Session Config
app.use(session({
  secret: "mySecretKey", // Altere para um valor mais seguro
  resave: false,
  saveUninitialized: false, // Evita salvar sessões vazias
  cookie: {
    secure: false, // Defina como `true` em produção se estiver usando HTTPS
    maxAge: 3600000 // 1 hora de duração para a sessão
  }
}));

function isAuthenticated(req, res, next) {
  if (req.session.user) return next();
  res.redirect("/login");
}

//routes
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
app.get(["/", "/dashboard"], isAuthenticated,dashboardRouter);
app.use("/", isAuthenticated,actuatorsRouter);

app.listen(port, () => {
  console.log(`Example app listening on host ${host}${port}`);
});
