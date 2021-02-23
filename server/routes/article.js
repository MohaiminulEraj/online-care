const express = require('express');
const router = express.Router();
const Article = require('../models/articles');
const User = require('../models/user');

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

router.post('/:id/new', async (req, res) => {
  if(req.isAuthenticated()){
    try{
      const user = await User.findById(req.params.id).populate('articles');
      const article = new Article(req.body);
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