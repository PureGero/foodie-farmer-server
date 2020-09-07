const express = require('express')
const {OAuth2Client} = require('google-auth-library')
const db = require('../models/database')

const CLIENT_ID = '1077433649025-slog3d5l02cd9bd6av58agmgc2aspr79.apps.googleusercontent.com'

const client = new OAuth2Client(CLIENT_ID)
const router = express.Router()

// Hashmap of sessions to username
const sessions = {}

// Parse sessions cookies and identify the request's username
router.use((req, res, next) => {
  req.email = sessions[req.cookies.session]
  next()
})

// Sign into the server with the specified google account
router.post('/signin', (req, res) => {
  let idtoken = req.body.idtoken
  
  if (!idtoken) return res.status(400).send('Please specify an idtoken')
  
  async function verify() {
    const ticket = await client.verifyIdToken({
        idToken: idtoken,
        audience: CLIENT_ID,
    })
    const payload = ticket.getPayload()
    
    let name = payload.name
    let email = payload.email
    let picture = payload.picture

    if (!payload.email_verified) return res.status(400).send('Please verify your email')

    // Populating database
    let existingCustomers = await db.Customers.findAll({
      where: {
        userName: email
      }
    })

    if (!existingCustomers.length) {
      // Customer doesn't already exist
      const user = await db.Customers.create({ userName: email, name: name, picture: picture })
    }
    
    let session = uuidv4()
    sessions[session] = email
    res.cookie('session', session, {maxAge: 1000 * 60 * 60 * 24 * 365, httpOnly: true, sameSite: 'Strict'})
    res.send(email)
  }
  verify().catch((err) => {
    console.error(err)
    res.status(500).send(err.toString())
  })
})

// Sign out of any logged in accounts
router.get('/signout', (req, res) => {
  if (!req.cookies.session) return res.status(400).send('Not signed in')
  
  delete sessions[req.cookies.session]
  res.clearCookie('session')
  res.send('Signed out')
})

// Generate a random uuid to be used as the session id
function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

module.exports = router
