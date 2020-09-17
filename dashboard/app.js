module.exports.load = async() => {
    const express = require("express");
    const path = require("path");
    const bodyParser = require("body-parser");
    const https = require("https");
    const mainRouter = require("./routes/all");
    const session = require("express-session");
    const cookieParser = require('cookie-parser');
    const passport = require('passport');
    app = express();
    
    passport.serializeUser(function(user, done) {
        done(null, user);
    })
    passport.deserializeUser(function(obj, done) {
        done(null, obj);
    });
    app.use(passport.initialize());
    app.use(passport.session());
    app
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: true }))
    .engine("html", require("ejs").renderFile)
    .set("view engine", "ejs")
    .use(cookieParser())
    .use(express.static(path.join(__dirname, "/public")))
    .set('views', path.join(__dirname, "/views"))
    .use(session({
        secret: 'dlghnjsfhdjshfdshfkdsae76873bdfga3',
        proxy: true,
        resave: true,
        saveUninitialized: true
        })
    )
    .use("/", mainRouter)
    .use(function(req, res){
        res.status(404).send("404");
    }).listen(80);
    https.createServer({
        key: require("./crt").key,
        cert: require("./crt").crt,
        passphrase: ''
    }, app)
    .listen(443);
};