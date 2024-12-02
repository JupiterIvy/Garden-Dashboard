const express = require("express");
const router = express.Router();

// Rota para actuadores
router.get("/actuators", function (req, res) {
  res.render("pages/actuators", {
    name: process.env.NAME,
    dashboardTitle: process.env.DASHBOARD_TITLE,
    user: req.session.user
  });
});

module.exports = router;
