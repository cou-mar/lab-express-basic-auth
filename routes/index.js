const router = require("express").Router();

const User = require('../models/User.model');

const bcryptjs = require('bcryptjs');

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get('/signup', (req, res, next) => {
  res.render('signup.hbs');
})

router.post('/signup', (req, res, next) => {
  console.log(req.body);
  if(!req.body.username || ! req.body.password){
    res.send('Sorry! You forgot to add an email or password.');
    return;
  }
  User.findOne({username:req.body.username})
    .then(foundUser => {
      if(foundUser){
        res.send('Sorry! User already exists.');
        return;
      }
      return User.create({
        username: req.body.username,
        password: bcryptjs.hashSync(req.body.password)
      })
    })
    .then(createdUser => {
      console.log("here's the new user", createdUser);
      res.send(createdUser);
    })
    .catch(err => {
      console.log(err);
      res.send(err);
    })
})

module.exports = router;
