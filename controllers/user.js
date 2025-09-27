const User = require("../models/user.js");

module.exports.renderSignupForm=(req, res) => {
    res.render("users/signup.ejs");
};

module.exports.Signup=async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ username: username, email: email });
        const registerduser = await User.register(newUser, password);
        req.login(registerduser,(err)=>{
            if(err){
                return next(err);
            }
        req.flash("success", " welcome wanderlust");
        res.redirect("/listing");
        })
        
    }
    catch(err){
        req.flash("error" , err.message);
        res.redirect("/signup");
    }
    
};

module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs");
};

module.exports.login=async (req,res) => {
    req.flash("success","Welcome back to Wanderlust");
    let redirectUrl = res.locals.redirectUrl || "/listing";
    res.redirect(redirectUrl);
};

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err)
        }else{
            req.flash("success","you have logged out!");
            res.redirect("/listing");
        }
    })
};