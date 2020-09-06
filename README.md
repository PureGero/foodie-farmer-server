# Foodie Farmer API Server

The Node.js api server code for the Foodie Farmer app

## Running the api server

Firstly install the required packages with

  npm install

Then run the server with

  node .

## API

The api endpoints provided by this server are documented as follows

### POST /signin

Sign into the server with the specified google account

`idtoken` The google idtoken to be used to authenticate with

### GET /signout

Sign out of any logged in accounts

### GET /customer/get_profile

Get the customer's profile details

### POST /customer/edit_bankaccount

Edit the customer's bank account

`bankAccount` New bank account value

### GET /farmer/add_product

Add a product to the farmer's store

`name` Name of the product
`type` Type of the product
`quantity` The amount of stock available 
`expirationDate` When the product will expire
