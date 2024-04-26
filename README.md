# Fullstack E-commerce REST APIs
  Hi, this is a backend part of Fullstack project in 2024 at Intergify.
  
  This backend provides a bunch of APIs to accomodate nice features in E-commerce transactioins and authentication all the data is saved in MongoDB.

  Basically try to mimic the E-commerce site and make the site fully functional both frontend and backend side in my own way. 
  Simulate the way of Payment, Mailing, Hosting Images, Authenticate, Google account login etc.
  
  I enjoyed the project with full of joy and also with lots of obstacles, but really had fun!  
  
  Check out the result here
  Frontend:  (http://some-site)[]
  Backend: (https://fs17-fullstack.onrender.com/api/v1/products)[https://fs17-fullstack.onrender.com/api/v1/products]

## Introduction
![ERD Diagram](./src/assets/images/ERD.png)

Entities
   - Users
   - Products
   - Categories
   - Orders
   - OrderItems
Enums
   - Size
   - OrderStatus
   - UserRole

## Getting started
   ### Prerequisites
   - node `^19.2.0`
   - npm `^9.2.0`

   Make sure you have [npm](https://www.npmjs.com/get-npm) installed globally.

   #### 1.Clone the project:
   ```bash
   $ git clone https://github.com/Woongsik/fullstack-e-commerce-api.git
   $ cd e-commerce-api
   ```

   #### 2.Install and run:
   ```bash
   $ npm install    # Install project dependencies
   $ npm run start  # Compile and launch on local environment
   ```

   #### 3. Navigate to [http://localhost:8080](http://localhost:8080)

## Authentication
   For security, this API implemented user authentication using JSON Web Tokens (JWT). 
   Each user should have a unique email. 
   Admin endpoints have the special privileges for access.

## Features
   1. Products
      - Get list of all products with/without pagination(limit, offset)
      - Get list of products, filtering (search) by: title, categories, sizes, price range 
      - Get list of sorted products by createdAt, price, title (ASC, DESC)
      - Get a product by product id

   2. Categories
      - Get list of all categories
      - Get a category by category id

   3. Users
      - Sign up a new user (username, password, first name, last name, email, address)
      - Sign in user with email/password
      - Update user profile (username, first name, last name, address)
      - Update password (old password, new password)
      - Forget password request

   4. Order
      - Get list of all user's orders
      - Get a user's order by order ID

   5. Admin 
      - Create a new product and update, remove
      - Create a new category and update, remove
      - Update a User role to Admin/Customer, 
      - Update a User active to Active/Inactive
      - Remove a user

   6. Files
      - Upload image to Cloudinary
      - Delete image from Cloudinary

  ### Additional Features
      1. Welcoming email 
         - When new user is registered, welcoming email will be sent 
         - Wwhen user forget the password, reset password will be sent
         - [Mailersend](https://www.mailersend.com/)

      2. Image hosting
         - Upload image to cloudinary
         - [Cloudinary](https://cloudinary.com/)

      3. Payment
         - Simulate payment transaction 
         - [Stripe](https://stripe.com/en-fi)

      4. Google account login
         - User is able to login/registeration by google account
         - Welcoming email generate an initial password for plain email/passowrd login
      
      5. Admin 
         - The Admin role will be given only accpeted/registered email 
         - ie. 
            ```bash
               admin@mail.com (just for testing purpose in the project)
            ``` 
      
## Testing
   For the testing, Jest, Supertest, MongoDB memory server are used.
   ![Test result](./src/assets/images/test.png)

   Total 41 tests, 7 suits succeeded

   Tests
      - Controllers
         - categoriesController.test.ts
         - productsController.test.ts
         - usersController.test.ts
      - Middlewares
         - adminCheck.spec.ts
      - Services
         - categoreisService.test.ts
         - productsService.test.ts
         - usersService.test.ts

   - [Jest](https://jestjs.io/), 
   - [Supertest](https://www.npmjs.com/package/supertest), 
   - [MongoDB memory server](https://www.npmjs.com/package/mongodb-memory-server)

   Check test code in src/tests
   ```bash
   $ npm run test
   ```

## Deployment
   The API is live now hosted by RENDER
   Check the live link here [https://fs17-fullstack.onrender.com](https://fs17-fullstack.onrender.com)

   - Some examples
      - [All products](https://fs17-fullstack.onrender.com/api/v1/products/api/v1/products)
      - [All categories](https://fs17-fullstack.onrender.com/api/v1/categories)

   Other features requires authenticate via login/register 