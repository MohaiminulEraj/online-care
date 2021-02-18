// require('dotenv').config();
const http = require('http')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const server = http.Server(app)
// const Student = require('./student.model')
// const Teacher = require('./teacher.model')
// const Admin = require('./admin.model')
const User = require('./models/user');
const path = require('path');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
// const passportLocalMongoose = require('passport-local-mongoose');
const profileRoutes = require('./routes/profile');

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


// app.get('/profile', (req, res) => {
//   if(req.isAuthenticated()){
//     return res.render('usersProfile/viewProfile.ejs');
//   } 
//   res.redirect('/');
// })

// app.get('/profile/edit', (req, res) => {
//   if(req.isAuthenticated()){
//     return res.render('usersProfile/editProfile.ejs');
//   } 
//   res.redirect('/');
// })

// app.patch('/profile/edit/:id', async (req, res) => {
  
//   if(req.isAuthenticated()){
//     await User.findByIdAndUpdate(req.user , req.body, { runValidators: true , new:true } );
//     req.flash('success', 'Thank you for updating your profile. Now you can create articles.');
//     return res.redirect('/');
//   } 
//   res.redirect('/');
// })
// Articles

app.get('/editorPanel', (req, res) => {
  if(req.isAuthenticated()){
    return res.render('articles/editorpanel.ejs');
  }
  res.redirect('/');
})

// // Login as admin

// app.post('/', function(request, response){
//   const user = new Admin({
//     username: request.body.username,
//     password: request.body.passport
//   })
//   request.login(user, function(err){
//     if(err){
//       console.log(err);
//     } else {
//       passport.authenticate("local")(request, response, function(){
//         response.redirect("/addStudent");
//       })
//     }
//   })
// })


// Create a new admin user
// app.post('/register', function(request, response){
//   Admin.register({username: request.body.username}, request.body.password, function(err, user){
//     if(err){
//       console.log(err);
//       response.redirect('/');
//     } else {
//       passport.authenticate("local")(request, response, function(){
//         // message: 'admin user created successfully'
//         response.redirect("/addStudent");
//       })
//     }
//   })
// })

// // Login as admin

// app.post('/', function(request, response){
//   const user = new Admin({
//     username: request.body.username,
//     password: request.body.passport
//   })
//   request.login(user, function(err){
//     if(err){
//       console.log(err);
//     } else {
//       passport.authenticate("local")(request, response, function(){
//         response.redirect("/addStudent");
//       })
//     }
//   })
// })

// app.get('/logout', function(request, response){
//   request.logout();
//   response.redirect('/');
// })

// app.get('/dashboard', function(request, response){
//     response.sendFile(path.join(__dirname , '../client/public/files/dashboard.html'));
// })

// app.get('/student.csv', function(request, response){
//   return response.sendFile(path.join(__dirname , '../client/public/uploads/student.csv'));
// })


// app.get('/teacher.csv',function(request, response){
//   return response.sendFile(path.join(__dirname , '../client/public/uploads/teacher.csv'));
// })


// app.get('/addStudent', function(request, response){
//   if(request.isAuthenticated()){
//     response.sendFile(path.join(__dirname , '../client/public/files/addStudent.html'));
//   } else{
//     response.redirect("/");
//   }
// })

// app.get('/addTeacher', function(request, response){
//   if(request.isAuthenticated()){
//     response.sendFile(path.join(__dirname , '../client/public/files/addTeacher.html'));
//   } else {
//     response.redirect("/");
//   }
// })

// app.get('/students/all', function(request, response){
//     Student.find({}, function (err, data) {
//       if(err){
//         return response.status(400).json({
//           error: 'data is missing'
//         })
//       }
//         // console.log(data);
//       return response.status(200).json(JSON.stringify(data));
//       })
// })

// app.get('/teachers/all', function(request, response){
//   Teacher.find({}, function (err, data) {
//     if(err){
//       return response.status(400).json({
//         error: 'data is missing'
//       })
//     }
//       // console.log(data);
//     return response.status(200).json(JSON.stringify(data));
//     })
// })


// app.post('/student/new', function(request, response){
//     const newUser = new Student(request.body)

//     newUser.save(function (err, data) {
//         if (err){
//           console.log(err);
//           return response.status(400).json({
//             error: 'data is missing'
//           })
//         }
//           response.redirect("/addStudent")
//       })     
// })

// app.post('/teacher/new', function(request, response){
//   var newUser = new Teacher(request.body)
//   newUser.save(function (err, data) {
//       if (err){
//         return response.status(400).json({
//           error: 'data is missing'
//         })
//       }
//       return response.status(200);
//       // response.redirect("/addTeacher")
//     })     
// })



server.listen(process.env.PORT || 3000,
  process.env.IP || 'localhost', function(){
  console.log('Server running');
})
