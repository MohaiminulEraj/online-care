// require('dotenv').config();
const http = require('http')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const server = http.Server(app)
const User = require('./models/user');
const path = require('path');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
// const passportLocalMongoose = require('passport-local-mongoose');
const profileRoutes = require('./routes/profile');
const articleRoutes = require('./routes/article');

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(methodOverride('_method'));
app.use(session({
  secret: "thisshouldbeabettersecret.",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(flash());
app.use((req, res, next) => {
  res.locals.loggedInUser = req.user;
  res.locals.success =  req.flash('success');
  res.locals.error = req.flash('error');
  next();
})


// DB Connection
const mongoose = require('mongoose');
const { request } = require('express');
mongoose.Promise = global.Promise
const dbURL = 'mongodb://localhost:27017/online_medication' //change this if you are using Atlas
mongoose.connect(dbURL, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false }) 
mongoose.set("useCreateIndex", true);
mongoose.connection.on('error', (error) => {
        console.log(error);
});


// passport.use(Admin.createStrategy());
// passport.serializeUser(Admin.serializeUser());
// passport.deserializeUser(Admin.deserializeUser());

// your server routes go here
app.use('/css', express.static(path.join(__dirname , '../client/public/css')));
app.use('/files', express.static(path.join(__dirname , '../client/public/files')));
app.use('/images', express.static(path.join(__dirname , '../client/public/images')));
app.use('/js', express.static(path.join(__dirname , '../client/public/js')));
// app.set('veiws', path.join(__dirname, 'client/views'))
// app.set('views', 'client/views')
app.set('views', path.join(__dirname, '../client/views'))
app.set('view engine', 'ejs');

app.use('/article', articleRoutes);
app.use('/profile', profileRoutes);
// app.use(app.router);
// routes.initialize(app);

app.get('/', function(request, response){
    // response.sendFile(path.join(__dirname , '../client/index.html'));
    response.render('home.ejs');
})


// Create a user

app.post('/register', async (req, res, next) => {
  try{
    const { firstname, lastname, email, username, password } = req.body;
    const user = new User({ firstname, lastname, email, username });
    const registerUser = await User.register(user, password);
    req.login(registerUser, err => {
      if(err){
        return next(err);
      }
      req.flash('success', 'User created Successfully! To create an article you have to update your profile by going Edit Profile page');
      res.redirect('/');
    })

  } catch(e){
    req.flash('error', e.message);
    res.redirect('/');
  }

})

app.post('/login', passport.authenticate('local' , { failureFlash: true, failureRedirect: '/'}), (req, res) => {
  req.flash('success', 'welcome back!');
  res.redirect('/');
})

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
})



server.listen(process.env.PORT || 3000,
  process.env.IP || 'localhost', function(){
  console.log('Server running');
})
