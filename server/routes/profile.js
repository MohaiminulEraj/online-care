const express = require('express');
const router = express.Router();
const Article = require('../models/articles');
const User = require('../models/user');
const multer = require("multer");
const { storage } = require('../cloudinary');
const upload = multer({ storage })
// dest: "server/uploads/profileimages/"
const path = require("path");
const fs = require("fs");

router.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    return res.render('usersProfile/viewProfile.ejs');
  }
  res.redirect('/');
})


// router.post('/upload', upload.single('profileImg'), (req, res) => {
//   res.json({file: req.file})
// })

router.get('/publications', async (req, res) => {
  if (req.isAuthenticated()) {
    const user = await User.findById(req.user._id).populate('articles').populate('author');
    return res.render('usersProfile/publications.ejs', {
      user
    });
  }
  res.redirect('/');
})

router.get('/checkup', async (req, res) => {
  if (req.isAuthenticated()) {
    return res.render('usersProfile/checkUp.ejs');
  }
  res.redirect('/');
})

router.get('/consultant', async (req, res) => {
  if (req.isAuthenticated()) {
    return res.render('usersProfile/consultant.ejs');
  }
  res.redirect('/');
})
router.get('/prescriptions', async (req, res) => {
  if (req.isAuthenticated()) {
    return res.render('usersProfile/prescriptions.ejs');
  }
  res.redirect('/');
})
router.get('/diagnosticReports', async (req, res) => {
  if (req.isAuthenticated()) {
    return res.render('usersProfile/diagnosticReports.ejs');
  }
  res.redirect('/');
})

router.get('/diagnosticReportUpload', async (req, res) => {
  return res.render('usersProfile/diagnosticReportUpload.ejs');
})

router.get('/meetPatient', async (req, res) => {
  if (req.isAuthenticated()) {
    return res.render('usersProfile/meetPatient.ejs');
  }
  res.redirect('/');
})

router.get('/meetConsulant', async (req, res) => {
  if (req.isAuthenticated()) {
    return res.render('usersProfile/meetConsulant.ejs');
  }
  res.redirect('/');
})
router.get('/edit', (req, res) => {
  if (req.isAuthenticated()) {
    return res.render('usersProfile/editProfile.ejs');
  }
  res.redirect('/');
})
// upload.single("croppedImage")
router.post('/edit/profilePicture/', upload.single("profileImg"), async (req, res, next) => {

  if (req.isAuthenticated()) {
    console.log("file", req.file);
    // return res.send(req.body, req.file);
    // console.log(req.body);
    if (!req.file) {
      console.log("No file uploaded with ajax request.");
      return res.sendStatus(400);
    }
    // let filePath = `uploads/profileimages/${req.file.filename}.png`;
    let filePath = `uploads/profileimages/${JSON.stringify(req.body)}.png`;
    // console.log(decodedImage);
    // let tempPath = req.file.path;
    let tempPath = "/media/mohaiminuleraj/ERAJ/Web Project/online-medication/server/uploads/profileimages/";
    let targetPath = path.join(__dirname, `../${filePath}`)

    fs.rename(tempPath, targetPath, error => {
      if (error != null) {
        console.log(error);
        // return res.sendStatus(200);
        return res.send("IT WORKED!");
        // return res.send('usersProfile/editProfile.ejs');
      }
      res.sendStatus(400);
    })
  }
})


router.patch('/edit/:id', async (req, res) => {

  if (req.isAuthenticated()) {
    await User.findByIdAndUpdate(req.user, req.body, {
      runValidators: true,
      new: true
    });
    req.flash('success', 'Thank you for updating your profile.');
    return res.redirect('/');
  }
  res.redirect('/');
})

module.exports = router;