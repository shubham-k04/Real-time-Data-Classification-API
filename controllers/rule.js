const Rule = require("../models/rule");
const engine = require("../services/engine");

async function registerRule(req, res) {
    const email = req.user.email;
    const rule = req.body.rule;
    if(!rule) {
        return res.json({ error: "Rule can't be empty" });
    }
    await Rule.findOneAndUpdate({ email }, { $push: { rule }});

    return res.json({ status: "Rule created successfully" });
}

async function getRule(req, res) {
    const email = req.user.email;
    const rule = await Rule.findOne({ email });
    if(!rule.rule.length){
        return res.json({ error: "No rule defined" });
    }

    return res.json({ rules: rule.rule });
}

async function updateRule(req, res) {
    const email = req.user.email;
    const ruleNo = req.body.ruleNo;
    const newRule = req.body.rule;
    const rule = await Rule.findOne({ email });
    if(!ruleNo){
        return res.json({ error: "Please enter rule Number" });
    }
    if(rule.rule.length < ruleNo){
        return res.json({ error:  `Rule No. ${ruleNo} doesn't exist` });
    }

    await Rule.findOneAndUpdate(
        { email, },
        { $set: { [`rule.${ruleNo-1}`]: newRule } }
    );
    
    return res.json({ status: "Updated successfully" });
}

async function deleteRule(req, res) {
    const email = req.user.email;
    const ruleNo = req.body.ruleNo;
    const rule = await Rule.findOne({ email });
    if(!ruleNo){
        return res.json({ error: "Please enter rule Number" });
    }
    if(rule.rule.length < ruleNo){
        return res.json({ status: `Rule No. ${ruleNo} doesn't exist` });
    }

    rule.rule.splice(ruleNo-1,1);
    rule.save();
    
    return res.json({ status: "Deleted successfully" });
}

async function classifyInput(req, res) {
    const email = req.user.email;
    const message = req.body.input;
    if(!message){
        return res.json({ error: "Please enter a query" });
    }
    const result = await engine(message, email);

    return res.json({ result: result });
}

module.exports = {
    registerRule,
    getRule,
    updateRule,
    deleteRule,
    classifyInput,
}