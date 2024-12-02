const express = require("express");
const crypto = require("crypto");
const router = express.Router();
const bcrypt = require('bcrypt');
const users = [];

const { saveUser, validateUserLogin } = require("./../models/users_model");

const mock_users = {
  user: crypto.createHash("sha256").update("password123").digest("hex"),
};

function isAuthenticated(req, res, next) {
    if (req.session.user) return next();
    res.redirect("/login");
  }

// Register
router.get('/register', (req, res) => {
    res.render('pages/register', {
        name: process.env.NAME,
        dashboardTitle: process.env.DASHBOARD_TITLE,
    });
});

// Cadastro
router.post("/register", (req, res) => {
    const { username, email, password, confirmPassword } = req.body;
  
    if (password !== confirmPassword) {
      return res.render("register", { error: "As senhas não coincidem." });
    }
  
    saveUser(username, email, password, (err, userId) => {
      if (err) {
        return res.render("register", { error: "Erro ao salvar usuário." });
      }
      res.redirect("/login");
    });
  });

// exibir o formulário de login
router.get("/login", (req, res) => {
  res.render("pages/login", { 
    error: null,
    name: process.env.NAME,
    dashboardTitle: process.env.DASHBOARD_TITLE,
});

});

// login
router.post("/login", (req, res) => {
    const { username, password } = req.body;
  
    validateUserLogin(username, password, (err, user) => {
      if (err) {
        return res.render("login", { error: "Erro ao fazer login." });
      }
  
      if (!user) {
        return res.render("login", { error: "Usuário ou senha incorretos." });
      }
      req.session.user = user;
     
      res.redirect("/dashboard"); 
    });
  });

// logout
router.get("/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.redirect("/dashboard");
      }
  
      res.clearCookie("connect.sid");
      res.redirect("/login");
    });
  });

// Página de configurações da conta
router.get("/account", isAuthenticated, (req, res) => {
    // Supondo que o usuário esteja armazenado em req.session.user
    res.render("pages/account-settings", {
        name: process.env.NAME,
        dashboardTitle: process.env.DASHBOARD_TITLE,
        user: req.session.user,
        email: req.session.user.email, // Assumindo que o email também esteja na sessão
        error: null,
    });
  });
  
  // Lógica para atualização de nome e senha
  router.post("/update-account", isAuthenticated, (req, res) => {
    const { username, newPassword, confirmNewPassword } = req.body;
  
    if (newPassword !== confirmNewPassword) {
      return res.render("pages/account-settings", {
        error: "Passwords do not match.",
        username: req.session.user.username,
        email: req.session.user.email,
      });
    }
  
    // Lógica para atualizar o nome e a senha no banco de dados
    // Por exemplo, se estiver usando um banco de dados SQL:
    const db = require('./../models/users_model'); // Importar o banco de dados (ajustar conforme necessário)
  
    db.updateUser(req.session.user.id, username, newPassword)
      .then(() => {
        // Atualizando os dados na sessão
        req.session.user.username = username;
        res.redirect("/account");
      })
      .catch((error) => {
        res.render("pages/account-settings", {
          error: "Error updating account details.",
          username: req.session.user.username,
          email: req.session.user.email,
        });
      });
  });

module.exports = router;
