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

router.get('/login', (req, res, next) => {
  res.render('login.hbs');
});

router.post('/login', (req, res, next) => {
  console.log(req.body);

    const { username, password } = req.body;

    if(!username || !password){
        // res.send('Sorry! You forgot an email or password.');
        res.render('login.hbs', {errorMessage: 'Sorry! You forgot a username or password.'});
        return;
    }

    User.findOne({username})
    .then(foundUser => {

        if(!foundUser){
            res.send('Sorry! User does not exist.');
            // res.render('login.hbs', {errorMessage: 'Sorry! User does not exist.'})
            return;
        }

        const isValidPassword = bcryptjs.compareSync(password, foundUser.password);

        if(!isValidPassword){
            res.send('Sorry! Incorrect password');
            // res.render('login.hbs', {errorMessage: 'Sorry! Incorrect password.'})
            return;
        }

        req.session.user = foundUser;

        console.log(req.session, "SESSION")
        res.send('successfully logged in');
        // res.render('profile.hbs', foundUser)
    })
    .catch(err => {
        console.log(err);
        res.send(err);
    });
});

router.get('/profile', (req, res, next) => {
  console.log(req.session);
  res.render('profile.hbs', req.session.user);
})

module.exports = router;