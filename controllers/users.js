const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
    res.render("users/register")
}

module.exports.register = async (req, res) => {
    try {
        const { email, username, password } = req.body
        const user = new User({ email, username }) //regular way of making a new object from a model
        const newUser = await User.register(user, password) //this is passport, with a register method and you add user and passport and it hashes it for us
        req.login(newUser, error => { //logs you in automatically after signing up
            if (error) return next(error);

            req.flash("success", `Welcome to the MapApp, ${username}!`)
            res.redirect("/campgrounds")
        })
    } catch (e) {
        req.flash("error", e.message)
        res.redirect("register")
    }
}

module.exports.renderLogin = (req, res) => {
    res.render("users/login")
}

module.exports.login = (req, res) => {  //local is .. just typing it in, vs login via twitter or something.
    req.flash("success", `Welcome back, ${req.body.username}!`)
    const redirectUrl = req.session.returnTo || "/campgrounds"  //looks at sessions and see if there was a path we were going to before we were redirected to login
    delete req.session.returnTo
    res.redirect(redirectUrl)
}

module.exports.logout = (req, res) => {
    req.logout()
    req.flash("success", "Later, nerd!")
    res.redirect("/campgrounds")
}