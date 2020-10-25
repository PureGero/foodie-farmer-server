# Foodie Farmer API Server

The Node.js api server code for the Foodie Farmer app

## Running the api server

Firstly install the required packages with

  `npm install`

Then run the server with

  `npm run start`

### MySQL Server

The api relies on a mysql server to operate,  
install a mysql server then set up a database and a user to match the fields in `models/database.js`

## API

The api endpoints provided by this server are documented as follows

### POST /signin

Sign into the server with the specified google account

`idtoken` The google idtoken to be used to authenticate with

### GET /signout

Sign out of any logged in accounts

### GET /customer/get_profile

Get the customer's profile details

### GET /customer/search_items

Get the items the customer could purchase matching a specified query

`query` Query to search for

### GET /customer/list_recommend

Get the customer's recommended items

### GET /customer/get_group_items

Get the list of group purchase items

`id` The id of the group purchase to get (optional)  
`limit` The limit of results to return (optional)  

### POST /customer/edit_address

Edit the customer's address

`address` New address value

### POST /customer/edit_bankaccount

Edit the customer's bank account

`bankAccount` New bank account value

### GET /farmer/add_product

Add a product to the farmer's store

`name` Name of the product  
`type` Type of the product  
`quantity` The amount of stock available  
`expirationDate` When the product will expire  
