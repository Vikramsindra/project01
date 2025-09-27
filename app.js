if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
}

console.log(process.env.SECRET)
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
const ExpressError = require('./util/ExpressError.js');
const listingRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/reviews.js");
const userRouter = require("./routes/user.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const passportLocall = require("passport");
const passportLocal = require("passport-local");
const User = require("./models/user.js");
const user = require('./models/user.js');
const LocalStrategy = require('passport-local').Strategy;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, 'public')));

const dburl = process.env.ATLASDBURL;
async function main() {
    await mongoose.connect(dburl);

};

main()
    .then((res) => console.log('connection to DB'));


const store = MongoStore.create({
    mongoUrl:dburl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
    
})

store.on("error",()=>{
    console.log("ERROR in MONGO SESSION STORE " , err)
})
const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // one week time
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
};



app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser()); // static method to store the user information in the session 
passport.deserializeUser(User.deserializeUser()); // static method 
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.curruser = req.user;
    next();
});



app.use("/listing", listingRouter);
app.use("/listing/:id/reviews", reviewsRouter);
app.use("/", userRouter);



app.all("{*splat}", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
    let { status = 500, message = "SomeThing Went wrong" } = err;
    res.status(status).render('error.ejs', { err });
    // res.render('error.ejs' , {err});
});

app.listen(8080, () => {
    console.log(`server is active on 8080`);
});