const db = require('../config/db');
const { getCommentsForPost } = require('../models/Comment');
var PostModel = require('../models/Post')


const postMiddleWare = {}

// for homepage 
postMiddleWare.getRecentPosts = async function (req, res, next) {
  try {
    let results = await PostModel.getNRecentPosts(8)
    res.locals.results = results;
    if (results.length == 0){
      req.flash('error', 'There are no post created yet')
    }
    next()
  } catch (error) {
    next(error)
  }
}


// for single post
postMiddleWare.getPostById = function(req,res,next) {

  let postId = req.params.id;
  let baseSQL = 
    `SELECT u.username, p.title, p.description, p.photopath, p.createdAt 
    FROM photo_db.Users u
    JOIN photo_db.Post p
    ON id=fk_userid
    WHERE idPost=?;`

  db.execute(baseSQL, [postId])
    .then(([results]) => {
      console.log(results);
      if (results && results.length){
        res.locals.currentPost = results[0];
        next();
      } else {
        req.flash('error', 'this is not the post you are looking for')
        res.redirect('/');
      }
    })

}


// get comments by post ID
postMiddleWare.getCommentsByPostId = async function(req,res,next) {
  console.log('comments by id')

  let postId = req.params.id

  // let baseSQL = `SELECT * FROM Comments`
  // return db.query(baseSQL, [postId])
  // .then(([results]) => {
    
  //   res.locals.currentPost.comments = results;
  //   next();
  // })
  // .catch(err => {console.log(err);next(err)});






  try {
    let results = await getCommentsForPost(postId);
    res.locals.currentPost.comments = results;
    next();
  } catch (error) {
    next(error)
  }
  
}

module.exports = postMiddleWare;