const gR = require("../parser/grammarRule.json");

function inputValidation() {
    return (req, res, next) => {
        const rule = req.body.rule;
        if (!rule) {
            return res.json({ error: "Rule can't be empty" });
        }

        return next();
    }
}

module.exports = { 
    inputValidation,
};
