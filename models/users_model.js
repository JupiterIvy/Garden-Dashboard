const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");

// Conectar ao banco de dados SQLite
const db = new sqlite3.Database("./users.db", (err) => {
  if (err) {
    console.error("Erro ao conectar ao banco de dados:", err.message);
  } else {
    console.log("Conectado ao banco de dados SQLite.");
  }
});

// Criar tabela de usuários, se não existir
db.run(
  `CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  )`,
  (err) => {
    if (err) {
      console.error("Erro ao criar tabela:", err.message);
    }
  }
);

// Função para salvar um usuário
const saveUser = (username, email, password, callback) => {
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.error("Erro ao fazer hash da senha:", err);
      return callback(err);
    }

    const sql = `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`;
    db.run(sql, [username, email, hashedPassword], function (err) {
      if (err) {
        console.error("Erro ao salvar usuário:", err.message);
        return callback(err);
      }
      callback(null, this.lastID); // Retorna o id do novo usuário
    });
  });
};

// Função para verificar as credenciais de login
const validateUserLogin = (username, password, callback) => {
  const sql = `SELECT * FROM users WHERE username = ?`;
  db.get(sql, [username], (err, user) => {
    if (err) {
      console.error("Erro ao buscar usuário:", err.message);
      return callback(err);
    }

    if (!user) {
      return callback(null, false); // Usuário não encontrado
    }

    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        console.error("Erro ao comparar senhas:", err);
        return callback(err);
      }
      callback(null, result ? user : false); // Retorna o usuário se as senhas coincidirem
    });
  });
};

const updateUser = (userId, newUsername, newPassword) => {
  return new Promise((resolve, reject) => {
    if (newPassword) {
      // Hash da nova senha
      bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
        if (err) {
          console.error("Erro ao gerar hash da senha:", err);
          return reject(err);
        }

        const sql = `UPDATE users SET username = ?, password = ? WHERE id = ?`;
        db.run(sql, [newUsername, hashedPassword, userId], function (err) {
          if (err) {
            console.error("Erro ao atualizar usuário:", err.message);
            return reject(err);
          }
          resolve(this.changes); // Retorna o número de linhas afetadas
        });
      });
    } else {
      // Atualiza somente o nome de usuário
      const sql = `UPDATE users SET username = ? WHERE id = ?`;
      db.run(sql, [newUsername, userId], function (err) {
        if (err) {
          console.error("Erro ao atualizar usuário:", err.message);
          return reject(err);
        }
        resolve(this.changes); // Retorna o número de linhas afetadas
      });
    }
  });
};



module.exports = { db, saveUser, validateUserLogin, updateUser};
