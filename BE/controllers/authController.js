const express = require('express')
const router = express.Router()

const adminModel = require('../models/adminModel')

const bcrypt = require('bcrpyt')
const jwt = require('jsonwebtoken')

// create user
router.post('/createUser', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    let data = {
      ...req.body,
      password: hashedPassword,
    }
    adminModel
      .newUser(data)
      .then((user) => res.status(200).json(user))
      .catch((err) => res.status(500).json({ err: err }))
  } catch (err) {
    console.log('err', err)
  }
})

// generate token
function generateToken(user) {
  const payload = {
    username: user.username,
  }
  const options = {
    expiresIn: '1h',
  }
  return jwt.sign(payload, 'secret', options) // .env
}

// login
router.login('/login', async (req, res) => {
  try {
    let { username, password } = req.body
    let user = await adminModel.findUser({ username })
    if (user.length === 0) {
      return res.status(404).json({ msg: 'User not found' })
    }
    user = user[0]
    let passwordVerified = await bcrypt.compare(password, user.password)
    if (user && passwordVerified) {
      const token = generateToken({ user })
      res.status(200).json({
        message: `Welcome ${user.username}`,
        id: user.id,
        token,
      })
    }
  } catch (err) {
    console.log(err)
  }
})
