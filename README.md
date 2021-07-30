# YOUVERIFY E-COMMERCE MICRO-SERVICE APPLICATION

## SERVICES

- Customer Service: Manages customer creation, read requests as well as updates.
- Product Service: Manages product creation, read requests as well as updates. For this demo,
  the product service is responsible for sending the order to the order service.
- Order Service: Manages orders and forwards them to the payment service for payment.
- Payment Service: This service processes or orders from the order service and validates payment.
  It then moves processed transactions off to the Worker for processing.
- Worker: A service worker that listens for published payments from the payment service and the
  stores them in the database.

## How TO TEST

- Clone the repo:
- Ensure that you have Docker running on your system: (Download Docker)[]
- Ensure that you have internet connect.
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

- To place an order, you need to retrieve a list of products to choose from:

  ```js
    GET http://localhost:3050/api/products
  ```

- Now that you have all both a user and a product, we can place an order here:

  Option one: In this scenario,

  ```js
    POST http://localhost:3050/api/products/place-order

    Sample payload
    {
      "productId": "610320e2e076b1001e5bd091",
      "customerId": "admin@testing.com"
    }
  ```

  Option two:

  ```js
    POST http://localhost:3050/api/orders

    Sample payload
    {
      "customerId": "admin@testing.com"
      "product": {
        "id": "An existing products id",
        "title": "An existing products title",
        "description": "An existing products description",
        "price": "An existing products price",
      },

    }
  ```
