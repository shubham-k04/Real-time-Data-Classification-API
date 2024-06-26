const ruleParser = require('../../../parser/parser');

test('should return an object when a string is given as input', () => {
    const input = 'max of (count of (a), count of (b)) < 9';
    const expectedOutput = {
        "LHS": {
            "operation": "max",
            "arguments": [
                { "operation": "count", "arguments": "a", "result": null },
                { "operation": "count", "arguments": "b", "result": null }
            ],
            "result": null,
        },
        "RHS": {
            "operation": null,
            "arguments": null,
            "result": 9,
        },
        "operator": "<",
    };

    const result = ruleParser(input);

    expect(result).toEqual(expectedOutput);
});



