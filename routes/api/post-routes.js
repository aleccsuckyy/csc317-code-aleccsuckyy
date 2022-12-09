var express = require('express');
var router = express.Router();
const db = require('../../config/db');
const {registerValidation, loginValidation} =require('../../middleware/regValidation');
var sharp = require('sharp');
var multer= require('multer');
var crypto = require('crypto');
var postError = require('../../helpers/error/PostError');
const PostError = require('../../helpers/error/PostError');
const { response } = require('../../app');
const { nextTick } = require('process');
const { errorPrint } = require('../../helpers/debug/debugprinters');

// storage of image inputed by user
var storage = multer.diskStorage({
  // where to send image
  destination: function(req,file,cb) {
    cb(null, 'public/images/upload');
  },
  // how we should receive image
  filename: function(req,file,cb){
    let fileExtension = file.mimetype.split('/')[1];
    let randomName = crypto.randomBytes(22).toString("hex");
    cb(null, `${randomName}.${fileExtension}`);
  }
});
// uploads image
var uploader = multer({storage: storage});




// users post to the db
// /api/posts
router.post('/createPost', uploader.single("uploadImage"),(req,res) => {
  
  let fileAsThumbNail = `thumbnail-${req.file.filename}`
  // where the thumbnail will go
  let destinationOfThumbNail = req.file.destination + "/" + fileAsThumbNail;
  // variables from user
  let fileUploaded = req.file.path;
  let {title, description} = req.body;
  let fk_userId = req.session.userId;

  // shrink our image
  sharp(fileUploaded)
    .resize(200)
    .toFile(destinationOfThumbNail)
    .then(() => {
      let baseSQL = 'INSERT INTO Post (title, description, photopath, thumbnail, createdAt, fk_userId) VALUES (?,?,?,?,now(),?);'
      return db.execute(baseSQL, [title, description, fileUploaded, destinationOfThumbNail, fk_userId])
    })
    .then(([results, fields]) => {
      if(results && results.affectedRows) {
        req.flash('success', 'your post was created successfully!')
        res.redirect('/');
      } else {
        throw new PostError('Post could not be created!', 'postImage', 200)
      }
    })
    .catch((err) => {
      if(err instanceof PostError){
        errorPrint(err.getMessage())
        res.status(err.getStatus())
        res.redirect(err.getRedirectURL())
      }else {
        nextTick(err)
      }
    })
})


// /posts/search?search=value
// for searching a post
router.get('/search', (req,res,next) => {
  let searchTerm = req.query.search;

  // if empty search bar
  if (!searchTerm) {
    res.send({
      resultStatus: "info",
      message: "no search ",
      results: []
    }) 
  } else {
    // SQL to get data that matches from search bar
    let baseSQL = 
      `
      SELECT idPost, title, description, thumbnail, concat_ws(' ', title, description) AS haystack
      FROM Post
      HAVING haystack like ?;
      `
      // goes into the ? in the baseSQL 
      let sqlReadySearchTerm = "%" + searchTerm + "%";
      // do the DB search with baseSQL and fill in the ?
      db.execute(baseSQL, [sqlReadySearchTerm])
        .then(([results, fields]) => {
          // if our results match send to user
          if (results && results.length) {
            res.send({
              resultStatus: "info",
              message: `${results.length} results found`,
              results: results
            })
          } else {
            // no results just show last 8 post to user
            db.query('SELECT idPost, title, description, thumbnail, createdAt from Post ORDER BY createdAt DESC LIMIT 8;',[])
            .then(([results]) => {
              res.send({
                resultStatus: "info",
                message: `no results from search were found but here are 8 recent post`,
                results: results
              })
            })
          }
        })
        .catch((err) => next(err)) 
  }

})

module.exports = router;