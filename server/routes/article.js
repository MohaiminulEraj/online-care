const express = require('express');
const router = express.Router();


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


module.exports = router;