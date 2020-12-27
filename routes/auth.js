var express = require('express');
var router = express.Router();
const crypto = require('crypto')
const User = require('../models/User')
let looper =false;

// This is an example of middleware
// where we look at a request and process it!
router.use(function(req, res, next) {
  console.log(`${req.method} ${req.url}`);
  next();
});


router.use((req,res,next) => {
  if (req.session.username) {
    res.locals.loggedIn = true
    res.locals.user = req.session.user
  } else {
    res.locals.loggedIn = false
    res.locals.username = null
    res.locals.user = null
  }
  next()
})

router.post("/registertest", (req,res) => {
res.locals.loggedIn=true;
  
});
router.get("/register", (req,res) => {
  res.render("register")
})
//router.post

router.post('/login',
  async (req,res,next) => {
    try {
      const {username,passphrase} = req.body
      const hash = crypto.createHash('sha256');
      hash.update(passphrase);
      const encrypted = hash.digest('hex')
      const user = await User.findOne({username:username,passphrase:encrypted})

      if (user) {
        req.session.username = username //req.body
        req.session.user = user
        res.redirect('/')
      } else {
        req.session.username = null
        req.session.user = user
        res.redirect('/register')
      }
    }catch(e){
      next(e)
    }
  })
router.post('/register_org',
  async (req,res,next) =>{
    try {
      const {volunteer, organization, myname, myage, myemail, myzip, hrsneeded, myusername,passphrase,passphrase2,myLink} = req.body
        let posuser = await User.findOne({ username: myusername });
        if (passphrase != passphrase2||posuser!=null) {
        res.redirect('/register')
      }else {
        console.log("hashin")
        const hash = crypto.createHash('sha256');
        hash.update(passphrase);
        const encrypted = hash.digest('hex')
        const user = new User({volunteer: volunteer,
                               organization: organization,
                               isOrganization: true,
                               name: myname,
                               email: myemail, 
                               zip: myzip,
                               hours:hrsneeded,
                               age: myage,
                               link: myLink,
                               pImage: "https://pecb.com/conferences/wp-content/uploads/2017/10/no-profile-picture.jpg",
                               username:myusername,
                               backround:"lightblue",
                               passphrase:encrypted})
        console.log("saving")
        await user.save()
        req.session.username = user.username
        req.session.user = user
        console.log("redirecting")
        res.redirect('/')
      }
    }catch(e){
      console.log("error")
      next(e)
    }
  })

router.post('/register_vol',
  async (req,res,next) =>{
    try {
      const {volunteer, organization, myname, myage, myemail, myzip, hrsneeded, myusername,passphrase,passphrase2,myLink} = req.body
        let posuser = await User.findOne({ username: myusername });
        if (passphrase != passphrase2||posuser!=null) {
        res.redirect('/register')
      }else {
        console.log("hashin")
        const hash = crypto.createHash('sha256');
        hash.update(passphrase);
        const encrypted = hash.digest('hex')
        const user = new User({volunteer: volunteer,
                               organization: organization,
                               isOrganization: false,
                               name: myname,
                               email: myemail, 
                               zip: myzip,
                               hours:hrsneeded,
                               age: myage,
                               link: myLink,
                               pImage: "https://pecb.com/conferences/wp-content/uploads/2017/10/no-profile-picture.jpg",
                               username:myusername,
                               passphrase:encrypted})
        console.log("saving")
        await user.save()
        req.session.username = user.username
        req.session.user = user
        console.log("redirecting")
        res.redirect('/')
      }
    }catch(e){
      console.log("error")
      next(e)
    }
  })


router.get('/logout', (req,res) => {
  req.session.destroy()
  res.redirect('/');
})

module.exports = router;
