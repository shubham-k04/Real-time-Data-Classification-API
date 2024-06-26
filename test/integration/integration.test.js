const request = require('supertest');
const assert = require('assert');
const mongoose = require('mongoose');
const User = require('../../models/user'); 
const Rule = require('../../models/rule'); 
const app = require('../../index');

describe('Integration Tests', function () {

  it('should register a new user and create a rule', async function () {
    const res = await request(app)
      .post('/signup')
      .send({
        fullName: 'Shubham Sharma',
        email: 'sharma@gmail.com',
        password: 'sharma$04',
      });

    assert.strictEqual(res.status, 200);

    const user = await User.findOne({ email: 'sharma@gmail.com' });
    assert(user);

    const rule = await Rule.findOne({ email: 'sharma@gmail.com' });
    assert(rule);
    assert.strictEqual(rule.createdBy.toString(), user._id.toString());
  });

  it('should log in an existing user', async function () {
    const res = await request(app)
      .post('/signin')
      .send({
        email: 'sharma@gmail.com',
        password: 'sharma$04',
      });

    assert.strictEqual(res.status, 302);
    assert(res.headers['set-cookie']);

    const cookies = res.headers['set-cookie'];
    assert(cookies.some(cookie => cookie.startsWith('username=Shubham%20Sharma')));
    assert(cookies.some(cookie => cookie.startsWith(`${process.env.TOKEN_NAME}=`)));
  });

  it('should create a new rule for the logged-in user', async function () {
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjdiZWY0MjU2ZjIyODdiZDJhYWU0MTQiLCJlbWFpbCI6InNoYXJtYUBnbWFpbC5jb20iLCJpYXQiOjE3MTkzOTgzMzV9.oF6NiuVP-ZOPBvb0tqWuTtLAYmdKStDi6V3cAlHK0QY";
    const res = await request(app)
      .post('/user/create')
      .set('Cookie', `${process.env.TOKEN_NAME}=${token}`)
      .send({
        rule: 'max of (count of (a), count of (b)) < 9',
      });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.status, 'Rule created successfully');

    const rule = await Rule.findOne({ email: 'sharma@gmail.com' });
    assert(rule);
    assert(rule.rule.includes('max of (count of (a), count of (b)) < 9'));
  });

  it('should classify a user input', async function () {
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjdiZWY0MjU2ZjIyODdiZDJhYWU0MTQiLCJlbWFpbCI6InNoYXJtYUBnbWFpbC5jb20iLCJpYXQiOjE3MTkzOTgzMzV9.oF6NiuVP-ZOPBvb0tqWuTtLAYmdKStDi6V3cAlHK0QY";
    const res = await request(app)
      .post('/user/classify')
      .set('Cookie', `${process.env.TOKEN_NAME}=${token}`)
      .send({
        input: 'i am shubham',
      });

    assert.strictEqual(res.status, 200);
    assert(res.body.result);
  });

});