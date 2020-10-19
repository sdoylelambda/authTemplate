const db = require('../...///database location')

module.exports = {
  newUser,
  findUser,
  getUsers,
}

function newUser(data) {
  return db.('tableName').insert(data, 'id').then(ids => {
    const [id] = ids
    console.log('this is the id', id)
    return findUserId(id).select('id', 'username', 'firstName', 'lastName')
  })
}

function findUserById(id) {
  return db('tableName').where({ id }).first()
  // return db('users').where(username) or this
}

function findUser(username){
  return db('tableName').where({ username }).first()
}

function getUsers() {
  return db('tableName')
}
