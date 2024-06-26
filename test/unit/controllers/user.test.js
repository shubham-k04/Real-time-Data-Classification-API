const { registerUser, loginUser, logoutUser, applyRule } = require('../../../controllers/user'); 
const User = require('../../../models/user');
const Rule = require('../../../models/rule');

jest.mock('../../../models/user');
jest.mock('../../../models/rule');

test('should return error if email already exists', async () => {
    const req = {
        body: { email: 'shubham04@gmail.com', fullName: 'Shubham Kumar', password: '123456' }
    };
    const res = {
        render: jest.fn()
    };

    User.findOne.mockResolvedValueOnce({ email: 'shubham04@gmail.com' });

    await registerUser(req, res);

    expect(res.render).toHaveBeenCalledWith("signup", {
        error: "Email already exists",
    });

});

test('should register user successfully', async () => {
    const req = {
        body: { email: 'shubham04@gmail.com', fullName: 'Shubham Kumar', password: '123456' }
    };
    const res = {
        redirect: jest.fn(),
        render: jest.fn()
    };

    User.findOne
        .mockResolvedValueOnce(null) 
        .mockResolvedValueOnce({ email: 'shubham04@gmail.com', _id: 'userId' }); 

    User.create.mockResolvedValueOnce({});
    Rule.create.mockResolvedValueOnce({});

    await registerUser(req, res);

    expect(User.findOne).toHaveBeenCalledWith({ email: 'shubham04@gmail.com' });
    expect(User.create).toHaveBeenCalledWith({
        fullName: 'Shubham Kumar',
        email: 'shubham04@gmail.com',
        password: '123456',
    });
    expect(Rule.create).toHaveBeenCalledWith({
        email: 'shubham04@gmail.com',
        createdBy: 'userId',
    });
    expect(res.redirect).toHaveBeenCalledWith("signin");
});

test('should return error if email or password is wrong', async () => {
    const req = {
        body: { email: 'shubham04@gmail.com', password: '123457' }
    };
    const res = {
        render: jest.fn(),
        cookie: jest.fn(),
        redirect: jest.fn()
    };

    User.matchPasswordAndGenerateToken.mockRejectedValueOnce(new Error('Wrong email or password'));

    await loginUser(req, res);

    expect(res.render).toHaveBeenCalledWith("signin", {
        error: "Wrong email or password",
    });
    expect(res.cookie).not.toHaveBeenCalled();
    expect(res.redirect).not.toHaveBeenCalled();
});


test('should login user successfully', async () => {
    const req = {
        body: { email: 'shubham04@gmail.com', password: '123456' }
    };
    const res = {
        render: jest.fn(),
        cookie: jest.fn(),
        redirect: jest.fn()
    };

    const mockToken = 'token';
    const mockUser = { email: 'shubham04@gmail.com', fullName: 'Shubham Kumar' };

    User.matchPasswordAndGenerateToken.mockResolvedValueOnce(mockToken);

    User.findOne.mockResolvedValueOnce(mockUser);

    await loginUser(req, res);

    expect(User.matchPasswordAndGenerateToken).toHaveBeenCalledWith('shubham04@gmail.com', '123456');
    expect(User.findOne).toHaveBeenCalledWith({ email: 'shubham04@gmail.com' });
    expect(res.cookie).toHaveBeenCalledWith("username", mockUser.fullName);
    expect(res.cookie).toHaveBeenCalledWith(process.env.TOKEN_NAME, mockToken);
    expect(res.redirect).toHaveBeenCalledWith("/");
});

test('logoutUser should clear cookies and redirect to "/"', async () => {
    const req = {};
    const res = {
        clearCookie: jest.fn(),
        redirect: jest.fn()
    };

    await logoutUser(req, res);

    expect(res.clearCookie).toHaveBeenNthCalledWith(1, "username");
    expect(res.clearCookie).toHaveBeenNthCalledWith(2, process.env.TOKEN_NAME);
    expect(res.redirect).toHaveBeenCalledWith("/");
});

test('applyRule should render "user" template with username and user data from cookies', async () => {
    const req = {
        cookies: {
            [process.env.TOKEN_NAME]: 'token',
            username: 'Shubham Kumar'
        }
    };
    const res = {
        render: jest.fn()
    };

    await applyRule(req, res);

    expect(res.render).toHaveBeenCalledWith("user", {
        user: 'token',
        username: 'Shubham Kumar'
    });
});