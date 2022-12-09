const db = require('../config/db');
const PostModel = {}


PostModel.create = (title, description, photopath, thumbnail, fk_userId) => {
  let baseSQL =  'INSERT INTO Post (title, description, photopath, thumbnail, createdAt, fk_userId) VALUES (?,?,?,?,now(),?);'
  return db.execute(baseSQL, [title, description, photopath, thumbnail, fk_userId])
  .then(([results]) => {
    return Promise.resolve(results && results.affectedRows)
  })
  .catch((err) => Promise.reject(err))
}




module.exports = PostModel;