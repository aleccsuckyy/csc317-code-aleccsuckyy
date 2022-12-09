var express = require('express');
var router = express.Router();
const db = require('../../config/db');
const {successPrint, errorPrint} = require('../../helpers/debug/debugprinters');
const {create} = require('../../models/Comment');

// api/comments/create
router.post('/create', (req,res,next) => {
  if(!req.session.username){
    errorPrint("must be logged in to comment")
    res.json({
      code: -1,
      status: "danger",
      message: "must be logged in to create a comment"
    })
  } else {
    let {comment, postId} = req.body;
    let username = req.session.username
    let userId = req.session.userId
  
    create(userId, postId, comment)
      .then((wasSuccessful) => {
        if (wasSuccessful !== -1) {
          successPrint(`comment was created for ${username}`);
          res.json({
            code: 1,
            status: "success",
            message: "comment was created successfully",
            comment: comment,
            username: username
          })
        } else {
          errorPrint("comment was not saved")
          res.json({
            code: -1,
            status: "danger",
            message: "comment failed"
          })
        }
      })
      .catch(err => next(err))
  }
})

module.exports = router;