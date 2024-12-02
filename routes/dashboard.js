const express = require("express");
const router = express.Router();

// Home page - Dashboard.
router.get(["/", "/dashboard"], function (req, res) {
  res.render("pages/dashboard", {
    name: process.env.NAME,
    dashboardTitle: process.env.DASHBOARD_TITLE,
    user: req.session.user
  });
});

module.exports = router;
