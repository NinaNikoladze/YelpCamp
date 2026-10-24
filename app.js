if(process.env.NODE_ENV !=='production') {
    require('dotenv').config({quiet:true});
}
const dns = require('dns');
dns.setServers(['1.1.1.1', '8.8.8.8']);

const express = require('express');
const app = express();
const path = require('path');
const Campground = require('./model/campground')
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const {campgroundSchema, reviewSchema} = require('./schemas');
const Review = require('./model/review')
const mongoSanitize = require('@exortek/express-mongo-sanitize')
const helmet = require('helmet')
const CloudinaryStorage = require('multer-storage-cloudinary-v2');
const methodOverride = require('method-override');
const ExpressError = require('./utilities/ExpressError');
const campground = require('./model/campground');
const flash = require('connect-flash')
const cookieParser = require('cookie-parser');
const passport = require('passport');
const localStrategy = require('passport-local');
const User = require('./model/user');
const session = require('express-session');
const { MongoStore } = require('connect-mongo');


const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
    "https://cdn.maptiler.com/",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net",
    "https://cdn.maptiler.com/", 
];
const connectSrcUrls = [
    "https://api.maptiler.com/",
];

const fontSrcUrls = [
    "https://fonts.googleapis.com",
    "https://fonts.gstatic.com"
];

app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: [],
                connectSrc: ["'self'", ...connectSrcUrls],
                scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
                styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
                workerSrc: ["'self'", "blob:"],
                objectSrc: [],
                imgSrc: [
                    "'self'",
                    "blob:",
                    "data:",
                    "https://res.cloudinary.com/sbw5mdve/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT!
                    "https://images.unsplash.com/",
                    "https://api.maptiler.com/"
                ],
                fontSrc: ["'self'", ...fontSrcUrls],
                mediaSrc: ["https://res.cloudinary.com/sbw5mdve/"],
                childSrc: ["blob:"]
            }
        },
        crossOriginEmbedderPolicy: false
    })
);
const secret = process.env.SECRET;



const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';
mongoose.connect(dbUrl);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected')
});
const store = MongoStore.create({
    mongoUrl:dbUrl,
    touchAfter:24*60*60,
    crypto: {
    secret: secret,
    }
});

const sessionConfig = {
    store,
    name:'yelpcampsession',
    secret:secret,
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        expires:Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}



app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', ejsMate);

app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'));
app.use(mongoSanitize())
app.use(express.static(path.join(__dirname,'public')));
app.use(cookieParser('secret'));
app.use(session(sessionConfig))
app.use(flash())


passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use(passport.initialize())
app.use(passport.session());

app.use((req,res,next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user;
    next();
})

const userRoutes = require('./routes/users')
const campgroundRoutes = require('./routes/campgrounds');
const reviewsRouter = require('./routes/reviews');



app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes );
app.use('/campgrounds/:id/reviews', reviewsRouter);



app.get('/', (req,res) => {
    res.render('home')
})



app.use((err,req,res,next) => {
    const {statusCode=500} = err;
    if(!err.message) err.message = 'Something Went Wrong'
    res.status(statusCode).render('error', {err});
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`)
});


