if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}
const Listing = require("./models/listing");
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate');
const ExpressError = require("./utils/ExpressError");
const listings = require("./Routes/listing");
const reviews = require("./Routes/review");
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const Localstrategy = require('passport-local');
const User = require('./models/user')
const users = require("./Routes/user");
const listingsData = require("./init/model");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "public")));



const sessionOption = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
};

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/WonderLust", { useNewUrlParser: true, useUnifiedTopology: true });
}
// const dburl = process.env.DBURL;

main()
    .then(()=>{
        console.log("succesfull");
    })
    .catch((err)=>console.log(err));

// async function main(){
//     await mongoose.connect(dburl);
// }

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new Localstrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});


  
  // Route to handle search (POST request)
  app.post('/search',async (req, res) => {
    const listings = await Listing.find({});
    const query = req.body.query ? req.body.query.toLowerCase() : '';
    console.log(query);
    req.flash("error","Sorry but no hotel available at your destination");
    res.render("listings/search",{listings,query});  // This should log the query from the form input
    });

// app.get("/", (req, res) => {
//     res.send("HII");
// });

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);
app.use("/",users);

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found"));
});

app.use((err, req, res, next) => {
    const { status = 500, message = "Something went wrong" } = err;
    res.status(status).render("listings/error", { err });
});

app.listen(8080, () => {
    console.log("server is working");
});
