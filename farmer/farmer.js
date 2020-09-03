const express = require('express')
const db = require('../models/database')

const router = express.Router()

// Ensure farmers are signed in
router.use((req, res, next) => {
  if (!req.email) return res.send('You are not logged in')

  next()
})

// Add a product to the farmer's store
router.get('/add_product', (req, res) => {
  let name = req.body.name
  let type = req.body.type
  let quantity = req.body.quantity
  let expirationDate = req.body.expirationDate

  if (!name || !type || !quantity || !expirationDate) return res.send('Missing paramteres')

  quantity = parseInt(quantity)

  if (quantity <= 0 || isNaN(quantity) || Math.floor(quantity) != quantity) return res.send('Quantity must be a possible integer')

  expirationDate = new Date(expirationDate);

  if (isNaN(expirationDate.getTime())) return res.send('Invalid expiration date')

  // TODO Add the product to the database

  res.send('Product successfully added')
})

module.exports = router
