const User = require('../model/user')


module.exports.registerForm = (req,res) => {
    res.render('users/register')
}

module.exports.registerUser = async (req,res) => {
    try{
const {username, email, password} = req.body;
const user = User({email,username});
const newUser = await User.register(user, password);
req.login(newUser, err => {
    if(err) return next(err);
req.flash('success', 'Welcome to YelpCamp');
res.redirect('/campgrounds')
})
    }
catch (e) {
    req.flash('error', e.message)
    res.redirect('/register')
}}

module.exports.loginRoute = (req,res) => {
    res.render('users/login')
}

module.exports.loginUser = (req,res) => {
req.flash('success', 'Welcome Back');
const redirectTo = res.locals.returnTo || '/campgrounds';
delete req.session.returnTo
res.redirect(redirectTo)
}

module.exports.logoutUser = (req,res,next) => {
req.logout(function (err){
    if(err){
        return next(err)
    } else {
req.flash('success', 'Goodbye!')
res.redirect('/campgrounds');
}})
}