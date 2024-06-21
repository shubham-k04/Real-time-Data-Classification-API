const express = require("express");
const { registerUser, loginUser, applyRule } = require("../controllers/user");

const router = express.Router();

router.get("/signin", (req, res) => {
    return res.render("signin");
});

router.get("/signup", (req, res) => {
    return res.render("signup");
});

router.post("/signup", registerUser);

router.post("/signin",loginUser);

router.get("/apply", applyRule);

module.exports = router;