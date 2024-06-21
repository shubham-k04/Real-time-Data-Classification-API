const express = require("express");
const { logoutUser } = require("../controllers/user");
const { registerRule, getRule, updateRule, deleteRule, classifyInput } = require("../controllers/rule");
const { inputValidation } = require("../services/validation");

const router = express.Router();

router.post("/classify", classifyInput);

router.post("/create", inputValidation(), registerRule);

router.get("/read", getRule);

router.post("/update", inputValidation(), updateRule);

router.post("/delete", deleteRule);

router.get("/logout", logoutUser);

module.exports = router;
