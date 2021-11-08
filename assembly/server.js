var express = require('express');
var mongoose = require('mongoose');
var path = require('path');
var config = require('./config/database');
var bodyParser = require('body-parser');
var session = require('express-session');
var expressValidator = require('express-validator');
var fileUpload = require('express-fileupload');
var passport = require('passport');
var _ = require('lodash');

global.__basedir = __dirname;

//Connect to db
mongoose.connect(config.database);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('connected to mogoDB!');
});

//Init app
var app = express();

//View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//Set Public folder
app.use(express.static(path.join(__dirname, 'public')));

// Set global errors variable
app.locals.errors = null;


//Get Page Model 
var Page = require('./models/page');
var User = require('./models/user');

//Get all pages to pass to header.ejs
Page.find({}).sort({ sorting: 1 }).exec(function (err, pages) {
    if (err) {
        console.log(err);
    } else {
        app.locals.pages = pages;
    }
});
// Get Category Model
var Category = require('./models/category');

//Get all categories to pass to header.ejs
Category.find(function (err, categories) {
    if (err) {
        console.log(err);
    } else {
        app.locals.categories = categories;
    }
});


// Express fileUpload middleware
app.use(fileUpload());

// Body Parser middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//Express session middleware
app.use(session({
    secret: process.env.APP_SECRET,
    resave: true,
    saveUninitialized: true
}));

// Express Validator middleware
app.use(expressValidator({
    errorFormatter: function (param, msg, value) {
        var namespace = param.split('.')
            , root = namespace.shift()
            , formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    },

    customValidators: {
        isImage: function (value, filename) {
            var extension = (path.extname(filename)).toLowerCase();
            switch (extension) {
                case '.jpg':
                    return '.jpg';
                case '.jpeg':
                    return '.jpeg';
                case '.png':
                    return '.png';
                case '':
                    return '.jpg';
                default:
                    return false;
            }
        }

    }
}));

//Express Messages middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});
app.use(passport.initialize());
app.use(passport.session());
//passport config
require('./config/passport')(passport);

// Passport middleware
var DiscordStrategy = require('passport-discord').Strategy;
var scopes = ['identify', 'email', 'guilds', 'guilds.join'];

passport.use(new DiscordStrategy({
    clientID: process.env.DISCORD_CLIENTID,
    clientSecret: process.env.DISCORD_SECRET,
    callbackURL: process.env.DISCORD_CALLBACKURL,
    scope: scopes
}, async (accessToken, refreshToken, profile, cb) => {
        let u = await User.findOne({ discordId: profile.id });
        if (!u) {
            u = new User({ discordId: profile.id, email: profile.email, name: profile.username, avatar: profile.avatar });
            await u.save();
        }
        return cb(null, u);
    }
));

app.get('/auth/discord', passport.authenticate('discord'));
app.get('/auth/discord/callback', passport.authenticate('discord', {
    failureRedirect: '/'
}), function (req, res) {
    res.redirect('/') // Successful auth
});


app.get('*', function (req, res, next) {
    res.locals._ = _;
    res.locals.cart = req.session.cart;
    res.locals.user = req.user || null;
    next();
});

app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send('Something broke!')
});

//Set routes
var pages = require('./routes/pages.js');
var products = require('./routes/products.js');
var cart = require('./routes/cart.js');
var users = require('./routes/users.js');
var adminPages = require('./routes/admin_pages.js');
var adminCategories = require('./routes/admin_categories.js');
var adminProducts = require('./routes/admin_products.js');
var api = require('./routes/api.js');

app.use('/admin/pages', adminPages);
app.use('/admin/categories', adminCategories);
app.use('/admin/products', adminProducts);
app.use('/products', products);
app.use('/cart', cart);
app.use('/users', users);
app.use('/api', api);
app.use('/', pages);

//Start the server
var port = 3000;
app.listen(port, function () {
    console.log('Server started on port ' + port)
});

