// require('dotenv').config();
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const http = require('http')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const server = http.Server(app)
const User = require('./models/user');
const path = require('path');
const crypto = require('crypto');
const mongoose = require('./database');
// const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream')
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
// const passportLocalMongoose = require('passport-local-mongoose');
const profileRoutes = require('./routes/profile');
const articleRoutes = require('./routes/article');

app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }))
app.use(methodOverride('_method'));
app.use(session({
  secret: process.env.SECRET,
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
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
})


// DB Connection
// const mongoose = require('mongoose');
// const { request } = require('express');
// mongoose.Promise = global.Promise
// const dbURL = 'mongodb://localhost:27017/online_medication' //change this if you are using Atlas
// mongoose.connect(dbURL, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false }) 
// mongoose.set("useCreateIndex", true);
// const conn = mongoose.connection;
// conn.on('error', (error) => {
//         console.log(error);
// });


// passport.use(Admin.createStrategy());
// passport.serializeUser(Admin.serializeUser());
// passport.deserializeUser(Admin.deserializeUser());

// your server routes go here
app.use('/css', express.static(path.join(__dirname, '../client/public/css')));
app.use('/files', express.static(path.join(__dirname, '../client/public/files')));
app.use('/images', express.static(path.join(__dirname, '../client/public/images')));
app.use('/js', express.static(path.join(__dirname, '../client/public/js')));
// app.set('veiws', path.join(__dirname, 'client/views'))
// app.set('views', 'client/views')
app.set('views', path.join(__dirname, '../client/views'))
app.set('view engine', 'ejs');

app.use('/article', articleRoutes);
app.use('/profile', profileRoutes);
// app.use(app.router);
// routes.initialize(app);



//  Init gfs 
// let gfs;
// conn.once('open', () => {
//   // Init stream 
//   gfs = Grid(conn.db, mongoose.mongo);
//   gfs.collection('uploads');
// })

// Create Storage Engine 
// const storage = new GridFsStorage({
//   url: dbURL,
//   file: (req, file) => {
//     return new Promise((resolve, reject) => {
//       crypto.randomBytes(16, (err, buf) => {
//         if (err) {
//           return reject(err);
//         }
//         const filename = buf.toString('hex') + path.extname(file.originalname);
//         const fileInfo = {
//           filename: filename,
//           bucketName: 'uploads'
//         };
//         resolve(fileInfo);
//       });
//     });
//   }
// });
// const upload = multer({ storage });

app.get('/', function (req, res) {
  // response.sendFile(path.join(__dirname , '../client/index.html'));
  res.render('home.ejs');
})


// app.post('/upload', upload.single('profileImg'), (req, res) => {
//   res.json({file: req.file})
// })

// Create a user

app.post('/register', async (req, res, next) => {
  try {
    const { firstname, lastname, email, username, password } = req.body;
    const checkEmail = await User.findOne({
      email: email
    })
      .catch((e) => {
        req.flash('error', 'Somthing went wrong');
        res.redirect('/');
      })
    if (checkEmail !== null && email == checkEmail.email) {
      req.flash('error', 'Email already in use.');
      res.redirect('/');
    }
    const user = new User({ firstname, lastname, email, username });
    const registerUser = await User.register(user, password);
    req.login(registerUser, err => {
      if (err) {
        return next(err);
      }
      req.flash('success', 'User created Successfully! To create articles you have to update your profile by going Edit Profile page');
      res.redirect('/');
    })

  } catch (e) {
    req.flash('error', e.message);
    res.redirect('/');
  }

})

app.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/' }), (req, res) => {
  req.flash('success', 'welcome back!');
  res.redirect('/');
})

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
})


app.get('*', function (req, res) {
  res.status(404).send('<h1 style="color:red;"> Page Not Found <h1>');
});

const port = process.env.PORT || 3001;
const ip = process.env.IP || 'localhost';
server.listen(port,
  ip, function () {
    console.log(`Server running on ${ip} port ${port}`);
  })

// server.listen(process.env.PORT || 3000,
//   'IPV4_IP', function () {
//     console.log('Server running @ IPV4_IP:3000');
//   })

// server.listen(3000, 'IPV4_IP'); // IP Forwardning.
