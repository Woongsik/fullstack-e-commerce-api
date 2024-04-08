# E-commerce API
  The project is a part of Integrify's Node.js backend module 2024 and will be used for fullstack project.
  
  We as a group, [Woong](https://github.com/Woongsik), [Roshan](https://github.com/roshanbist) and [Ganesh](https://github.com/ganesh-poudel), 
  simulated E-commerce API and try to provide a good collection of REST APIs between users and server transactions.

  Each entity basically have a CRUD(Create, Read, Update, Delete) operations but also a special access only for ADMIN.
  
  This is built with Typescript, Node, Express and MongoDB.

## Introduction
![ERD Diagram](./src/assets/images/ERD-ECOMMERCE.png)

We have structured base entities 
   
   - Users
   
   - Products
   
   - Categories
   
   - Orders
   
   - OrderItems

## Getting started
   ### Prerequisites
   - node `^19.2.0`
   - npm `^9.2.0`

   Make sure you have [npm](https://www.npmjs.com/get-npm) installed globally.

   #### 1.Clone the project:
   ```bash
   $ git clone https://github.com/Woongsik/e-commerce-api.git
   $ cd e-commerce-api
   ```

   #### 2.Install and run:
   ```bash
   $ npm install    # Install project dependencies
   $ npm run start  # Compile and launch on local environment
   ```

   #### 3. Navigate to [http://localhost:8080](http://localhost:8080)

## Authentication
   For security, this API should implement user authentication using JSON Web Tokens (JWT). 
   Each user should have a unique username and password OR broker authentication. Certain admin endpoints may require special privileges for access.

## Features
   1. Products
      - Get list of all products with/without pagination(limit, offset)
      - Get list of products, filtering (search) by: name, categories, size
      - Get a product by product id

   2. Categories
      - Get list of all categories
      - Get a category by category id

   3. Users
      - Sign up a new user (username, password, first name, last name, email, address)
      - Sign in user with email/password
      - Update user profile (first name, last name, email)
      - Forget password request
      - Change password (username, old password, new password)

   4. Order
      - Get list of all orders
      - Get list of all user's order
      - Get a user's order by order ID

   5. Admin 
      - Change a User's role to Admin or Customer, 
      - Change a User's active to Active or Inactive
      - Create a new category, update, remove
      - Create a new product, update, remove

  ### Additional Features
      1. Welcoming email 
         - When new user is registered, welcoming email is sent 
         - [Mailersend](https://www.mailersend.com/)

      2. Google account login
         - User is able to use their google account to login/registeration
         - Welcoming email generate an initial password for email/passowrd login
         
      3. Email check if already in use
         - Email address will be checked if it is in use already before sending all user info for registration
      
      4. Admin check 
         - The Admin role will be given only accpeted/registered email 
         - ie. 
            ```bash
               admin@mail.com (just for testing purpose in the project)
            ``` 

## Testing
   For the testing, Jest, Supertest, MongoDB memory server are used.

   - [Jest](https://jestjs.io/), 
   
   - [Supertest](https://www.npmjs.com/package/supertest), 
   
   - [MongoDB memory server](https://www.npmjs.com/package/mongodb-memory-server)

   Check test code in src/tests
   ```bash
   $ npm run test
   ```

## Deployment
   The API is live now hosted by RENDER
   Check the live link here [https://fs17-backend-b5i2.onrender.com](https://fs17-backend-b5i2.onrender.com)

   - Some examples
      - [All products](https://fs17-backend-b5i2.onrender.com/api/v1/products)
      - [All categories](https://fs17-backend-b5i2.onrender.com/api/v1/categories)
      - [All orders](https://fs17-backend-b5i2.onrender.com/api/v1/orders)
      - [All users](https://fs17-backend-b5i2.onrender.com/api/v1/users)