const db = require('../config/db');
const CommentModel = {}

// post to DB
CommentModel.create = (userId, postId, comment) => {
  let baseSQL = `INSERT INTO Comments (comment,  fk_postid, fk_authorid) VALUES (?,?,?);`
  return db
    .query(baseSQL, [comment, postId, userId])
    .then(([results]) => {
      if(results && results.affectedRows){
        return Promise.resolve(results.insertId);
      } else {
        return Promise.resolve(-1);
      }
    })
    .catch((err) => Promise.reject(err))
}



// getting comments for post from DB
CommentModel.getCommentsForPost = (postId) => {
  let baseSQL = `SELECT u.username, c.comment, c.created, c.id 
  FROM Comments c
  JOIN Users u
  on u.id=fk_authorid 
  WHERE c.fk_postid=? 
  ORDER BY c.created DESC;
  `

  return db.query(baseSQL, [postId])
  .then(([results]) => {
    return Promise.resolve(results);
  })
  .catch(err => Promise.reject(err))
}



module.exports = CommentModel;