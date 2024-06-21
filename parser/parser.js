function splitAtComparisonOperator(rule) {
    const pattern = /( <= | >= | != | = | < | > )/;
    return rule.split(pattern);
}

function remove_OF(rule) {
    return rule.replace(/ of /g, " ");
}

function separateFunctionAndArgs(expression) {
    const pattern = /^(\w+)\s*\((.*)\)$/;
    const parts = expression.split(pattern);
    return parts.slice(1, -1);
}

function checkForNumber(arg) {
    const pattern = /^\d+$/;
    return pattern.test(arg);
}

function separarteArguments(arguments) {
    const delimiter = ", ";
    let parts = [];
    let currentPart = '';
    let depth = 0;
    const delimiterLength = delimiter.length;

    for (let i = 0; i < arguments.length; i++) {
        if (arguments[i] === '(') {
            depth++;
        } else if (arguments[i] === ')') {
            depth--;
        }

        if (arguments.substr(i, delimiterLength) === delimiter && depth === 0) {
            parts.push(currentPart);
            currentPart = '';
            i += delimiterLength - 1; 
        } else {
            currentPart += arguments[i];
        }
    }
    
    parts.push(currentPart); 
    return parts;
}

function createObject(operation, arguments, result) {
    return {
        "operation": operation,
        "arguments": arguments,
        "result": result,
    }
}

function createAST(expression) {
    if(checkForNumber(expression)) {
        return createObject(null, null, +expression);
    }

    const _expression = separateFunctionAndArgs(expression);
    const operation = _expression[0];

    if(operation == "count"){
        return createObject(operation, _expression[1], null);
    } 
   
    const __expression = separarteArguments(_expression[1]);
    arguments = [];
    for(_exp in __expression) {
        arguments.push(createAST(__expression[_exp]));
    }

    return createObject(operation, arguments, null);
}

function ruleParser(rule) {
    const rule_OF = remove_OF(rule);
    const token = splitAtComparisonOperator(rule_OF);
    return {
        "LHS": createAST(token[0]),
        "RHS": createAST(token[2]),
        "operator": token[1].slice(1, -1),
    }
}

module.exports = ruleParser;
