const User = require("../models/user");
const Rule = require("../models/rule");

async function registerUser(req, res) {
    try {
        const userEmail = req.body.email;
        const user = await User.findOne({ email: userEmail });
        if(user) throw new Error();
    } catch (err) {
        return res.render("signup", {
            error: "Email already exists",
        });
    }
    
    const { fullName, email, password } = req.body;
    await User.create({
        fullName,
        email,
        password,
    });
    const user = await User.findOne({ email });
    await Rule.create({
        email,
        createdBy: user._id,
    });

    return res.redirect("signin");
}

async function loginUser(req, res) {
    try {
        const { email, password } = req.body;
        const token = await User.matchPasswordAndGenerateToken(email, password);

        const user = await User.findOne({ email });
        res.cookie("username", user.fullName);
        res.cookie(process.env.TOKEN_NAME, token);
        return res.redirect("/");
    } catch (error) {
        return res.render("signin", {
            error: "Wrong email or password",
        });
    }
}

async function logoutUser(req, res) {
    res.clearCookie("username");
    return res.clearCookie(process.env.TOKEN_NAME).redirect("/");
}

async function applyRule(req, res) {
    return res.render("user", {
        user: req.cookies[process.env.TOKEN_NAME],
        username: req.cookies["username"],
    });
}

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    applyRule
}