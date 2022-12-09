const db = require('../config/db');

const postMiddleWare = {}

postMiddleWare.getRecentPosts = function(req,res,next) {

  let baseSQL = 'SELECT idPost, title, description, thumbnail, createdAt FROM Post ORDER BY createdAt DESC LIMIT 16;'

  db.execute(baseSQL, [])
    .then(([results]) => {
      res.locals.results = results;
      if(results && results.length == 0){
        req.flash('error', 'There are no posts created yet');
        console.log("no post for homepage");
      }
      next();
    })
    .catch((err) => next(err));

}

module.exports = postMiddleWare;