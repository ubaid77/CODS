var express = require("express"),
    flash = require('connect-flash'),
    User    = require("./models/user"),
    Service = require("./models/service"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    bodyParser= require("body-parser"),
    LocalStrategy = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose")

mongoose.connect(process.env.DATABASEURL, { useNewUrlParser: true, useUnifiedTopology: true });
// mongoose.connect("mongodb+srv://dbAdmin:Ubaid-2017@cluster0-taqcn.mongodb.net/cods_app?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true });

var app = express();
app.use(flash());

app.use(require("express-session")({
    secret: 'blah blah blah',
    resave: false,
    saveUninitialized: false
}))
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res,next){
    res.locals.currentUser = req.user;
    next();
})


app.get("/",function(req, res){
    res.redirect("/cods")
})

app.get("/cods",function(req, res){
    res.render("home",{title:'CODS'})
    
})

app.get("/cods/salon-at-home",function(req, res) {
    res.render("salon-at-home",{title:'Salon At Home'})
})

app.get("/cods/ac-service", function(req, res) {
    res.render("ac-service",{title:'AC Service'})
})

app.get("/cods/massage-for-men", function(req, res) {
    res.render("massage-for-men",{title:'Massage For Men'})
})

app.get("/cods/service-booking",isLoggedIn, function(req, res) {
    res.render("service-booking",{title:'Book Your Appointment'})
})

app.get("/cods/booking-confirmed",isLoggedIn, function(req, res) {
    res.render("booking-confirmed",{title:'Booking Confirmed'})  
})

app.get("/cods/aboutus", function(req, res) {
    res.render("aboutus",{title:'About us'})
})

app.get("/cods/signup", function(req, res) {
    res.render("signup", { messages: req.flash('error'),title:'Create Account' })
})

app.get("/cods/login", function(req, res) {
    res.render("login",{title:'Login'})
})

app.get("/cods/sorry", function(req, res) {
    res.render("sorry",{title:'Service not available'})
})

app.post("/cods/signup",function(req, res){
    var newUser = new User({
        fname: req.body.fname,
        lname: req.body.lname,
        username: req.body.username,
        email: req.body.email});
        
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash('error',err);
            return res.render("signup",{messages: req.flash('error'),title:'Create Account'})
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/cods");
        })
    })
})

app.post("/cods/login", passport.authenticate("local",{successRedirect:"/cods",failureRedirect:"/cods/login"}), function(req, res){
    
    
})

app.post("/cods/service-booking", function(req, res){
    var address = req.body.address;
    var phone = req.body.phone;
    var serviceDate = req.body.serviceDate;
    var serviceTime = req.body.serviceTime;
    
    var newService = {address: address, phone: phone, serviceDate: serviceDate, serviceTime: serviceTime}
    
    Service.create(newService, function(err, newservice){
        if(err){
            console.log(err)
        }else{
            req.user.services.push(newservice);
            req.user.save();
            res.redirect("/cods/booking-confirmed")
            console.log(serviceTime)
        }
    })
})

app.get("/cods/profile",isLoggedIn, function(req, res) {
    User.findOne({ username: req.user.username }).populate("services").exec(function(err, foundUser){
        if(err){
            console.log(err)
        }else{
          res.render("profile",{foundUser: foundUser, title:"Dashboard"})  
        }
    })
    
})

app.get("/cods/logout", function(req, res) {
    req.logout();
    res.redirect("/cods");
})

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash('error', 'Please Login first!')
    res.redirect("/cods/signup")
}



app.listen(process.env.PORT,process.env.IP,function(){
    console.log("Server is listening...")
})