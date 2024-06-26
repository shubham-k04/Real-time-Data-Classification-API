const { registerRule, getRule, updateRule, deleteRule, classifyInput } = require("../../../controllers/rule");
const Rule = require('../../../models/rule');
const engine = require("../../../services/engine");

jest.mock('../../../models/Rule');
jest.mock('../../../services/engine');

test('should return error if rule is empty', async () => {
    const req = {
        user: { email: 'shubham04@gmail.com' },
        body: { rule: '' }
    };
    const res = {
        json: jest.fn()
    };

    await registerRule(req, res);

    expect(res.json).toHaveBeenCalledWith({ error: "Rule can't be empty" });
});

test('should create rule successfully', async () => {
    const req = {
        user: { email: 'shubham04@gmail.com' },
        body: { rule: 'this is rule one' }
    };
    const res = {
        json: jest.fn()
    };

    Rule.findOneAndUpdate.mockResolvedValueOnce({});

    await registerRule(req, res);

    expect(Rule.findOneAndUpdate).toHaveBeenCalledWith(
        { email: 'shubham04@gmail.com' },
        { $push: { rule: 'this is rule one' } }
    );

    expect(res.json).toHaveBeenCalledWith({ status: "Rule created successfully" });
});

test('should return error if no rules are defined', async () => {
    const req = {
        user: { email: 'shubham04@gmail.com' }
    };
    const res = {
        json: jest.fn()
    };

    Rule.findOne.mockResolvedValueOnce({ email: 'shubham04@gmail.com', rule: [] });

    await getRule(req, res);

    expect(res.json).toHaveBeenCalledWith({ error: "No rule defined" });
});

test('should return rules successfully if rules are defined', async () => {
    const req = {
        user: { email: 'shubham04@gmail.com' }
    };
    const res = {
        json: jest.fn()
    };

    const mockRules = ['rule1', 'rule2'];

    Rule.findOne.mockResolvedValueOnce({ email: 'shubham04@gmail.com', rule: mockRules });

    await getRule(req, res);

    expect(res.json).toHaveBeenCalledWith({ rules: mockRules });
});

test('should return error if rule number is missing', async () => {
    const req = {
        user: { email: 'shubham04@gmail.com' },
        body: { ruleNo: null, rule: 'max of (count of (a), count of (b))' }
    };
    const res = {
        json: jest.fn()
    };

    await updateRule(req, res);

    expect(res.json).toHaveBeenCalledWith({ error: "Please enter rule Number" });
});

test('should return error if rule number does not exist', async () => {
    const req = {
        user: { email: 'shubham04@gmail.com' },
        body: { ruleNo: 2, rule: 'max of (count of (a), count of (b))' }
    };
    const res = {
        json: jest.fn()
    };

    Rule.findOne.mockResolvedValueOnce({ email: 'shubham04@gmail.com', rule: ['max of (count of (a), count of (b))'] });

    await updateRule(req, res);

    expect(res.json).toHaveBeenCalledWith({ error: "Rule No. 2 doesn't exist" });
});

test('should update rule successfully', async () => {
    const req = {
        user: { email: 'shubham04@gmail.com' },
        body: { ruleNo: 1, rule: 'max of (count of (a), count of (b))' }
    };
    const res = {
        json: jest.fn()
    };

    Rule.findOne.mockResolvedValueOnce({ email: 'shubham04@gmail.com', rule: ['max of (count of (a), count of (b))'] });

    Rule.findOneAndUpdate.mockResolvedValueOnce({});

    await updateRule(req, res);

    expect(Rule.findOneAndUpdate).toHaveBeenCalledWith(
        { email: 'shubham04@gmail.com' },
        { $set: { 'rule.0': 'max of (count of (a), count of (b))' } } 
    );
    expect(res.json).toHaveBeenCalledWith({ status: "Updated successfully" });
});

test('should return error if rule number is missing', async () => {
    const req = {
        user: { email: 'shubham04@gmail.com' },
        body: { ruleNo: null }
    };
    const res = {
        json: jest.fn()
    };

    await deleteRule(req, res);

    expect(res.json).toHaveBeenCalledWith({ error: "Please enter rule Number" });
});

test('should return error if rule number does not exist', async () => {
    const req = {
        user: { email: 'shubham04@gmail.com' },
        body: { ruleNo: 2 }
    };
    const res = {
        json: jest.fn()
    };

    Rule.findOne.mockResolvedValueOnce({ email: 'shubham04@gmail.com', rule: ['rule1'] });

    await deleteRule(req, res);

    expect(res.json).toHaveBeenCalledWith({ error: `Rule No. 2 doesn't exist` });
});

test('should delete rule successfully', async () => {
    const req = {
        user: { email: 'shubham04@gmail.com' },
        body: { ruleNo: 1 }
    };
    const res = {
        json: jest.fn()
    };

    const mockRule = { email: 'shubham04@gmail.com', rule: ['rule1', 'rule2'], save: jest.fn() };

    Rule.findOne.mockResolvedValueOnce(mockRule);

    await deleteRule(req, res);

    expect(mockRule.rule).toEqual(['rule2']);
    expect(mockRule.save).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ status: "Deleted successfully" });
});

test('should return error if input message is missing', async () => {
    const req = {
        user: { email: 'shubham04@gmail.com' },
        body: { input: null }
    };
    const res = {
        json: jest.fn()
    };

    await classifyInput(req, res);

    expect(res.json).toHaveBeenCalledWith({ error: "Please enter a query" });
});


test('should classify input message successfully', async () => {
    const req = {
        user: { email: 'shubham04@gmail.com' },
        body: { input: 'This is a test message' }
    };
    const res = {
        json: jest.fn()
    };

    const mockResult = true;

    engine.mockResolvedValueOnce(mockResult);

    await classifyInput(req, res);

    expect(engine).toHaveBeenCalledWith('This is a test message', 'shubham04@gmail.com');
    expect(res.json).toHaveBeenCalledWith({ result: mockResult });
});