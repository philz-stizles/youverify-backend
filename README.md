# YOUVERIFY E-COMMERCE MICRO-SERVICE APPLICATION

## SERVICES

- Customer Service: Manages customer creation, read requests as well as updates.
- Product Service: Manages product creation, read requests as well as updates. For this demo,
  the product service is responsible for sending the order to the order service.
- Order Service: Manages
- Payment Service:
- Worker: A service worker that listens for published payments from the payment service and the
  stores them in the database.

## How TO TEST

- Clone the repo:
- Ensure that you have Docker running on your system: (Download Docker)[]
- Navigate to the micro-service project root an run:

  ```bash
    docker-compose up
  ```

- Get Customer credentials:

  ```txt
    User 1:
    email: johndoe@testing.com
    password: 'p@ssw0rd

    User 2:
      email: admin@testing.com
      password: p@ssw0rd
  ```

- (optional) Retrieve any additional customer information should you require a customer ID to order a product.
  But you can use the customers email, since it is being stored as a string everywhere and no major logic is
  checking which is which, for demo purposes:

  ```js
    GET http://localhost:3050/api/users/:email
  ```

- Retrieve a list of products to choose from:

  ```js
    GET http://localhost:3050/api/products
  ```
