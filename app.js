const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const passport = require('passport');
const bodyParser = require("body-parser");
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const db = require('./config/database');
const app = express();
//routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');
//passport
require('./config/passport')(passport);

//Connect to Mongoose.
mongoose.Promise = global.Promise;
mongoose.connect(db.mongoURI,{
    useMongoClient:true
}).then(() => console.log("MongoDB Connected")).catch(err => console.log(err));




//HandleBars midware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//body parser middleware
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname,'public')))

//method over ride middleware
app.use(methodOverride('_method'));

//Session middleware
app.use(session({
    secret: 'secret',
    resave:true,
    saveUninitialized:true
}))
//passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

//Global variables
app.use((req,res,next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
})

//Index Route
app.get('/',(req,res)=>{
    const title = 'Welcome';
    res.render('index', {
        title:title,
    });
});

app.get('/about',(req,res)=>{
    res.render('about');
});

app.use('/ideas', ideas);
app.use('/users', users );






const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

app