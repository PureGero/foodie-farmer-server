const express = require('express')

const router = express.Router()

// Test function
router.get('/test', (req, res) => {
  res.send('Hello, world!')
})

module.exports = router