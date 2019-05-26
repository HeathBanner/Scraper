var cheerio = require('cheerio');
var axios = require('axios');
var express = require('express');
var app = express();
var routes = require('./routes/routes');
var exphbs = require('express-handlebars');
var passport = require('passport');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var Strategy = require('passport-local').Strategy;
require('./config/passport')(app);

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/node_modules'));
app.use(cookieParser());
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(session({session: 'ScrapeyBoi'}));
app.use(passport.initialize());
app.use(passport.session());

app.use(routes);
app.use((error, req, res, next) => {
    console.error(error);
    res.render('error', {
        user: req.user,
        error
    });
});

var PORT = process.env.PORT || 8080;

app.listen(PORT, function() {
    console.log('Listening on port: ' + PORT);
});