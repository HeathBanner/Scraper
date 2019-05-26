var express = require('express');
var app = express();
var User =  require('../models/User.js');
var CNN = require('../models/CNN.js');
var router = express.Router();
var cheerio = require('cheerio');
var axios = require('axios');
var exphbs = require('express-handlebars');
var mongoose = require("mongoose");
var Strategy = require('passport-local').Strategy;
var passport = require('passport');
var session = require('express-session');
var { ensureAuthenticated} = require('../config/auth.js');
const ObjectId = mongoose.Types.ObjectId;
require('../config/passport')(app);

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/scrapeyboi";
mongoose.connect(MONGODB_URI);

app.use(express.static(__dirname + '/public'));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

function WorldResult(region, regionLink, img, header, link) {
    this.region = region,
    this.regionLink = regionLink,
    this.img = img,
    this.header = header,
    this.link = link
};

function UsResult(region, img, header, link) {
    this.region = region,
    this.img = img,
    this.header = header,
    this.link = link
};

function worldArticleLogic(response, results, Result) {
    var $ = cheerio.load(response.data);

    for (var i = 0; i < 5; i++) {
        var region = $('.zn__column--idx-' + i).find('h2.cn__title').first().text();
        var regionLink = $('.zn__column--idx-' + i).find('h2.cn__title').first().parent().attr('href');
        var img = $('.zn__column--idx-' + i).find('img.media__image').attr('data-src-small');
        var header = $('.zn__column--idx-' + i).find('span.cd__headline-text').first().text();
        var link = $('.zn__column--idx-' + i).find('span.cd__headline-text').parent().attr('href');

        if ((region) && (img) && (header)) {
            CNN.findOneAndUpdate({header: header}, {
                region: region,
                regionLink: regionLink,
                img: img,
                header: header,
                link: link
            }, {upsert: true}, function(err, data) {
                if (err) throw err;
                console.log(data)
                results.push(new WorldResult(region, regionLink, img, header, link));
            })
        }
    }
    console.log(results);
}

function usArticleLogic(response, results, Result) {
    var $ = cheerio.load(response.data);

    var sections = ['East_list-hierarchical-xs_', 'Central_list-hierarchical-xs_', 'West_list-hierarchical-xs_', 'CNN Business_list-hierarchical-xs_article_', 'Sports_list-hierarchical-xs_hyperlink_', 'LendingTree_list-hierarchical-xs_hyperlink_', 'CompareCards_list-hierarchical-xs_hyperlink_', 'The Motley Fool_list-hierarchical-xs_hyperlink_']
    var index = [2, 0, 1, 2, 0, 1, 2];
    var eq = [0, 1, 1, 1, 3, 3, 3];

    for (var i in index) {
        // console.log('.zn__column--idx-' + index[i]);
        var region = $('div.zn__column--idx-' + index[i]).eq(eq[i]).find('h2.cn__title  ').first().text();
        var img = $('div.zn__column--idx-' + index[i]).eq(eq[i]).find('img.media__image').first().attr('data-src-small');
        var header = $('div.zn__column--idx-' + index[i]).eq(eq[i]).find('span.cd__headline-text').first().text();
        var link = $('div.zn__column--idx-' + index[i]).eq(eq[i]).find('span.cd__headline-text').first().parent().attr('href');
        
        if ((region) && (img) && (header)) {

                CNN.findOneAndUpdate({header: header}, {
                        region: region,
                        img: img,
                        header: header,
                        link: link
                    }, {upsert: true}, function(err, data) {
                        if (err) throw err;
                        console.log(data)
                        results.push(new UsResult(region, img, header, link));
                    })
        }

    }
}

function cnnScraper(res, url) {
    axios.get('https://www.cnn.com/' + url).then(function(response) {
        var $ = cheerio.load(response.data);
    
        var results = [];

        if (url === 'world') {
            worldArticleLogic(response, results, WorldResult);
        } else if (url === 'us') {
            usArticleLogic(response, results, UsResult);
        }

        res.redirect('/cnn');
    }); 
}

router.get('/', ensureAuthenticated, function(req, res) {
    res.render('home');
});

router.get('/signup', function(req, res) {
    res.render('signup');
});

router.post('/signup', function(req, res) {
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    }).then(function(result) {
        res.json(result);
    });
});

router.get('/login', function(res, res) {
    res.render('login');
});

router.post('/login', passport.authenticate('local',
{successRedirect: '/', failureRedirect: '/login', failureFlash: true}));

router.get('/cnn', ensureAuthenticated, function(req, res) {
    console.log(req.user);
    CNN.find({}).sort({_id: -1}).then(function(result) {
        const user = req.user[0]
        for (var i in result) {
            for (var f in result[i].comments) {
                var userId = user._id.toString();
                if (result[i].comments[f].id) {
                    var resId = result[i].comments[f].id.toString()
                    if (userId == resId) {
                        console.log('before true')
                        result[i].comments[f].isUser = true;
                        result[i].comments[f].articleId = result[i]._id
                        console.log(result[i].isUser);
                    }
                }
            }
        }
        // console.log(result);
        hbs_obj = {
            results: result
        };
        res.render('cnn', hbs_obj)
    });
});

router.get('/us_cnn', ensureAuthenticated, function(req, res) {
    cnnScraper(res, 'us');
});

router.get('/world_cnn', ensureAuthenticated, function(req, res) {
    cnnScraper(res, 'world');
});

router.post('/fav', ensureAuthenticated, function(req, res) {
    console.log(req.user[0]._id);
    User.updateOne({username: req.user[0].username}, {
        $push :{favs: {
        region: req.body.region,
        regionLink: req.body.regionLink,
        img: req.body.img,
        header: req.body.header,
        link: req.body.link
    }}}, {upsert: true}).then(function(result) {
        res.json(result);
    });
});

router.get('/favorites', ensureAuthenticated, function(req, res) {
    User.find({_id: req.user[0]._id}).then(function(result) {
        console.log(result[0].favs);
        
        data = {
            results: result[0].favs
        };
        res.render('favorites', data);
    });
});

router.post('/removeFavorite', ensureAuthenticated, function(req, res) {
    User.findOneAndUpdate({'favs.header': req.body.header},{$pull: {'favs':{'header': req.body.header}}},{new: true}, function(err, result) {
        console.log(result);
        res.json(result);
    });
});

router.post('/comment', ensureAuthenticated, function(req, res) {
    var userId = req.user[0]._id.toString();
    CNN.findOneAndUpdate({_id: req.body.id}, {$push: {comments: {comment: req.body.comment, id: userId, username: req.user[0].username}}}, {upsert:true}).then(function(result) {
        console.log(result);
        res.json(result);
    });
});

router.post('/deleteComment', ensureAuthenticated, function(req, res) {
    CNN.findOneAndUpdate({'comments.id': req.body.userId},{$pull: {'comments':{'comment': req.body.comment}}},{new: true}, function(err, result) {
        console.log(result);
        res.json(result);
    });
});

module.exports = router;