const Rule = require("../models/rule");
const parser = require("../parser/parser");

function evaluateCount(obj, input){
    const pattern = obj.arguments;
    const regex = new RegExp(pattern, 'g');
    const matches = input.match(regex);

    if(!matches) obj.result = 0;
    else obj.result = matches.length;

    return obj;
}

function evaluateAST(AST, input){
    if(AST.operation === "count") AST = evaluateCount(AST, input);

    if(AST.operation === "sum"){
        for(i=0;i<AST.arguments.length;i++){
            AST.arguments[i] = evaluateCount(AST.arguments[i], input);
            AST.result += AST.arguments[i].result;
        }
    }

    if(AST.operation === "product"){
        AST.result = 1;
        for(i=0;i<AST.arguments.length;i++){
            AST.arguments[i] = evaluateCount(AST.arguments[i], input);
            AST.result *= AST.arguments[i].result;
        }
    }

    if(AST.operation === "max"){
        AST.result = -1;
        for(i=0;i<AST.arguments.length;i++){
            AST.arguments[i] = evaluateCount(AST.arguments[i], input);
            AST.result = Math.max(AST.result, AST.arguments[i].result);
        }
    }

    if(AST.operation === "min"){
        AST.result = Number.MAX_VALUE;
        for(i=0;i<AST.arguments.length;i++){
            AST.arguments[i] = evaluateCount(AST.arguments[i], input);
            AST.result = Math.min(AST.result, AST.arguments[i].result);
        }
    }

    return AST;
}

async function classificationEngine(message, email){
    const user = await Rule.findOne({ email });
    if(!user.rule.length){
        return res.json({ status: "No rule created" });
    }
    // assuming only one rule defined
    const rule = user.rule[0];
    const AST = parser(rule);

    const LHS_value = evaluateAST(AST.LHS, message).result;
    const RHS_value = evaluateAST(AST.RHS, message).result;
    
    let result;
    switch (AST.operator) {
        case ">":
            result = LHS_value > RHS_value;
            break;
        case "<":
            result = LHS_value < RHS_value;
            break;
        case ">=":
            result = LHS_value >= RHS_value;
            break;
        case "<=":
            result = LHS_value <= RHS_value;
            break;
        case "=":
            result = LHS_value == RHS_value;
            break;
        case "!=":
            result = LHS_value != RHS_value;
            break;
      }

      return result;
}

module.exports = classificationEngine;


