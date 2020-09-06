const express = require('express')
const db = require('../models/database')

const router = express.Router()

// Ensure customers are signed in
router.use((req, res, next) => {
  if (!req.email) return res.send('You are not logged in')

  next()
})

// Get the customer's profile details
router.get('/get_profile', async (req, res) => {
  // Get the Customer from the database
  let customers = await db.Customers.findAll({
    where: {
      userName: req.email
    }
  })

  if (!customers.length) return res.send('Could not find profile')

  let customer = customers[0]

  res.send({
    userName: customer.userName,
    name: customer.name,
    picture: customer.picture,
    address: customer.address,
    bankAccount: customer.bankAccount
  })
})

// Edit the customer's bank account
router.post('/edit_bankaccount', async (req, res) => {
  let bankAccount = req.body.bankAccount

  if (!bankAccount) return res.send('Missing paramteres')

  bankAccount = parseInt(bankAccount)

  if (isNaN(bankAccount)) return res.send('Bank account must be a number')

  // Edit bank account in database
  await db.Customers.update({ bankAccount: bankAccount }, {
    where: {
      userName: req.email
    }
  })

  res.send('Bank account successfully changed')
})

module.exports = router