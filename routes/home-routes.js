var express = require('express');
var router = express.Router();
const db = require('../config/db');
const loggedIn= require('../middleware/routeprotector').userIsLoggedIn;
const getRecentPosts = require('../middleware/frontPagePostMW').getRecentPosts;
const {getCommentsByPostId, getPostById} = require('../middleware/postmiddleware')
// const {getPostByIdModel} = require('../models/Post');
// ALL GET ROUTES FOR WHOLE WEBSITE


router.get("/", getRecentPosts, (req, res) => {
  res.render("home");
});


// get login
router.get("/login", (req, res) => {
  res.render("login");
});


// this will render our signup.handlebars
router.get("/registration", (req, res) => {
  // send our register.handlebars page
  res.render("registration");
});


// render create post handlebars
router.get("/createPost", loggedIn, (req, res) => {
  // send our dashboard.handlebars page
  res.render("postimage");
});


// for single post
router.get('/post/:id(\\d+)', getPostById, getCommentsByPostId, (req,res) => {
  res.render('viewpost')
})


module.exports = router;
