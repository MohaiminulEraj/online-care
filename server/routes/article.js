const express = require('express');
// const fileUpload = require('express-fileupload');
// const mongodb = require('mongodb');
// const fs = require('fs');
const router = express.Router();
// const binary = mongodb.Binary
const path = require('path');
const multer = require('multer');
const Article = require('../models/articles');
const User = require('../models/user');

let storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, 'server/uploads')
  },
  filename: function(req, file, cb){
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
})
let upload = multer({
  storage: storage
})

router.get('/', (req, res) => {
    if(req.isAuthenticated()){
      return res.render('articles/articlepage.ejs');
    }
    res.redirect('/');
})

router.get('/editorpanel', (req, res) => {
    if(req.isAuthenticated()){
      return res.render('articles/editorpanel.ejs');
    }
    res.redirect('/');
})

router.get('/edit/editorpanel', (req, res) => {
  if(req.isAuthenticated()){
    return res.render('articles/editeditorpanel.ejs');
  }
  res.redirect('/');
})

router.post('/:id/new', upload.single('thumbnail'), async (req, res, next) => {
  if(req.isAuthenticated()){
    try{
      const user = await User.findById(req.params.id).populate('articles').populate('author');
      // const thumbnailImg = req.file;
      const article = new Article(req.body);
      article.author = req.user._id;
      user.articles.push(article);
      await article.save();
      await user.save();
      req.flash('success', 'Article created Successfully!');
      res.redirect('/article/editorpanel');

    } catch(e){
      req.flash('error', 'Sorry! Failed to create your article.');
      res.redirect('/article/editorpanel');
    }
} else {
  res.redirect('/');
}

})



module.exports = router;