const User = require("../models/user");

module.exports.signup = async(req,res)=>{
    try{
        let {username,email,password} = req.body;
        const newUser = new User({email,username});
        const register = await User.register(newUser,password);
        console.log(register);
        req.login(register,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to WonderLust!!");
            res.redirect("/listings");
        });
        
}catch(e){
    req.flash("error",e.message);
    res.redirect("/signup");
}
}

module.exports.login = async (req,res)=>{
    req.flash("success","Welcome back to WonderLust!!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}