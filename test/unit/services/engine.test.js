const classificationEngine = require('../../../services/engine'); 
const Rule = require('../../../models/rule');

jest.mock('../../../models/rule');

const parser = require('../../../parser/parser');

test('should return status "No rule created" if no rule exists', async () => {
    const email = 'shubham04@gmail.com';
    const message = 'i am shubham';
    const user = { rule: [] };

    // Mock Rule.findOne to return a user with no rules 
    Rule.findOne.mockResolvedValueOnce(user);

    const result = await classificationEngine(message, email);

    expect(result).toEqual({ error: "No rule created" });
});


test('should evaluate rule and return true or false', async () => {
    const email = 'shubham04@gmail.com';
    const message = 'i am shubham';
    const user = { rule: [ "max of (count of (a), count of (b)) < 9" ] };
    
    // Mock Rule.findOne to return a user with no rules 
    Rule.findOne.mockResolvedValueOnce(user);

    const result = await classificationEngine(message, email);

    expect(result).toBe(true);
});