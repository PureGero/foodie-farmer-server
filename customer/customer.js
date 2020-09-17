const express = require('express')
const db = require('../models/database')

const router = express.Router()

// Ensure customers are signed in
router.use((req, res, next) => {
  if (!req.email) return res.status(400).send('You are not logged in')

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

  if (!customers.length) return res.status(400).send('Could not find profile')

  let customer = customers[0]

  res.send({
    userName: customer.userName,
    name: customer.name,
    picture: customer.picture,
    address: customer.address,
    bankAccount: customer.bankAccount
  })
})

// Get the items the customer could purchase matching a specified query
// `query` Query to search for
router.get('/search_items', async (req, res) => {
  // TODO Generate items from the database
  let query = req.body.query

  if (!query) return res.status(400).send('Missing query')

  // For testing purposes, sends an apple if an apple was searched for,
  // otherwise sends an orange
  if (~query.toLowerCase().indexOf('apple')) {
    res.send([
      {
        id: 652,
        name: "Apple",
        image: "https://i.imgur.com/YRwlA.jpg",
        cost: 5.55,
        farm: "Doug's Apple Farm",
        location: "Thulimbah QLD"
      }
    ])
  } else {
    res.send([
      {
        id: 711,
        name: "Orange",
        image: "https://i0.wp.com/miakouppa.com/wp-content/uploads/2017/02/img_3938.jpg?resize=599%2C799&ssl=1",
        cost: 7.00,
        farm: "Geoff's Orange Farm",
        location: "Mt Isa QLD"
      }
    ])
  }
})

// Get the customer's recommended items
router.get('/list_recommend', async (req, res) => {
  // TODO Generate recommended from the database

  res.send([
    {
      id: 652,
      name: "Apple",
      image: "https://i.imgur.com/YRwlA.jpg",
      cost: 5.55,
      farm: "Doug's Apple Farm",
      location: "Thulimbah QLD"
    }, {
      id: 652,
      name: "Apple",
      image: "https://i.imgur.com/YRwlA.jpg",
      cost: 5.55,
      farm: "Doug's Apple Farm",
      location: "Thulimbah QLD"
    }, {
      id: 711,
      name: "Orange",
      image: "https://i0.wp.com/miakouppa.com/wp-content/uploads/2017/02/img_3938.jpg?resize=599%2C799&ssl=1",
      cost: 7.00,
      farm: "Geoff's Orange Farm",
      location: "Mt Isa QLD"
    }
  ])
})

// Get the group purchases that the customer can join in on
router.get('/list_group_purchases', async (req, res) => {
  // TODO Generate group purchases from the database

  res.send([
    {
      id: 398,
      name: "Apple",
      image: "https://i.imgur.com/YRwlA.jpg",
      cost: 4.02,
      originalCost: 5.55,
      customerCount: 61,
      farm: "Doug's Apple Farm",
      location: "Thulimbah QLD"
    }, {
      id: 398,
      name: "Apple",
      image: "https://i.imgur.com/YRwlA.jpg",
      cost: 4.66,
      originalCost: 5.55,
      customerCount: 45,
      farm: "Doug's Apple Farm",
      location: "Thulimbah QLD"
    }, {
      id: 398,
      name: "Apple",
      image: "https://i.imgur.com/YRwlA.jpg",
      cost: 5.12,
      originalCost: 5.55,
      customerCount: 32,
      farm: "Doug's Apple Farm",
      location: "Thulimbah QLD"
    }, {
      id: 425,
      name: "Orange",
      image: "https://i0.wp.com/miakouppa.com/wp-content/uploads/2017/02/img_3938.jpg?resize=599%2C799&ssl=1",
      cost: 6.58,
      originalCost: 7.00,
      customerCount: 29,
      farm: "Geoff's Orange Farm",
      location: "Mt Isa QLD"
    }
  ])
})

// Edit the customer's address
// `address` New address value
router.post('/edit_address', async (req, res) => {
  let address = req.body.address

  if (!address) return res.status(400).send('Missing address')

  // Edit bank account in database
  await db.Customers.update({ address: address }, {
    where: {
      userName: req.email
    }
  })

  res.send('Address successfully changed')
})

// Edit the customer's bank account
// `bankAccount` New bank account value
router.post('/edit_bankaccount', async (req, res) => {
  let bankAccount = req.body.bankAccount

  if (!bankAccount) return res.status(400).send('Missing bankAccount')

  bankAccount = parseInt(bankAccount)

  if (isNaN(bankAccount)) return res.status(400).send('Bank account must be a number')

  // Edit bank account in database
  await db.Customers.update({ bankAccount: bankAccount }, {
    where: {
      userName: req.email
    }
  })

  res.send('Bank account successfully changed')
})

module.exports = router