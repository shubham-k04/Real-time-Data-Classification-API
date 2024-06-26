function areParenthesesBalanced(inputString) {
    const stack = [];
    for (let char of inputString) {
        if (char === '(') {
            stack.push('(');
        } else if (char === ')') {
            if (stack.length === 0 || stack.pop() !== '(') {
                return false;
            }
        }
    }
    return stack.length === 0;
}

function inputValidation() {
    return (req, res, next) => {
        const rule = req.body.rule;
        if (!rule) {
            return res.json({ error: "Rule can't be empty" });
        }

        const regex = /^[()a-z0-9=<>!,\s]+$/;

        if (!regex.test(rule) || !areParenthesesBalanced(rule)) {
            return res.json({ error: "Rule format is invalid" });
        }
        return next();
    }
}



module.exports = { 
    inputValidation,
};
