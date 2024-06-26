const { checkForAuthenticationCookie } = require('../../../middlewares/authentication'); 

test('should return error if cookie is not present', () => {
    const req = {
        cookies: {}
    };
    const res = {
        json: jest.fn()
    };
    const next = jest.fn();

    const middleware = checkForAuthenticationCookie('token');
    middleware(req, res, next);

    expect(res.json).toHaveBeenCalledWith({ error: "Please login first" });
    expect(next).not.toHaveBeenCalled();
});


test('should set req.user and call next if token is valid', () => {
    const req = {
        cookies: { token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjdhOGNlODBjOTI5YjE1ZmYxZTU5Y2UiLCJlbWFpbCI6InNodWJoYW0wNEBnbWFpbC5jb20iLCJpYXQiOjE3MTkzMDk2ODZ9.dMo4t21xAfUtWkjg5g9pDNyuBCUSrEWpqSx3qc3k4_I' }
    };
    const res = {
        json: jest.fn()
    };
    const next = jest.fn();

    const middleware = checkForAuthenticationCookie("token");
    middleware(req, res, next);
    const userPayload = {
        _id: '667a8ce80c929b15ff1e59ce',
        email: 'shubham04@gmail.com',
    }
    expect(req.user).toMatchObject(userPayload);
    expect(next).toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
});

test('should return error if token is invalid', () => {
    const req = {
        cookies: { token: 'll_eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjdhOGNlODBjOTI5YjE1ZmYxZTU5Y2UiLCJlbWFpbCI6InNodWJoYW0wNEBnbWFpbC5jb20iLCJpYXQiOjE3MTkzMDk2ODZ9.dMo4t21xAfUtWkjg5g9pDNyuBCUSrEWpqSx3qc3k4_I' }
    };
    const res = {
        json: jest.fn()
    };
    const next = jest.fn();

    const middleware = checkForAuthenticationCookie('token');
    middleware(req, res, next);

    expect(res.json).toHaveBeenCalledWith({ error: "Unknown user" });
    expect(next).not.toHaveBeenCalled();
});