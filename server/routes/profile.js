const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.get('/', (req, res) => {
    if(req.isAuthenticated()){
      return res.render('usersProfile/viewProfile.ejs');
    } 
    res.redirect('/');
})

router.get('/publications', async (req, res) => {
  if(req.isAuthenticated()){
    const user = await User.findById(req.user._id).populate('articles').populate('author');
    return res.render('usersProfile/publications.ejs', { user });
  } 
  res.redirect('/');
})

router.get('/edit', (req, res) => {
    if(req.isAuthenticated()){
      return res.render('usersProfile/editProfile.ejs');
    } 
    res.redirect('/');
})

router.patch('/edit/:id', async (req, res) => {
  
    if(req.isAuthenticated()){
      await User.findByIdAndUpdate(req.user , req.body, { runValidators: true , new:true } );
      req.flash('success', 'Thank you for updating your profile. Now you can create articles.');
      return res.redirect('/');
    } 
    res.redirect('/');
})

module.exports = router;