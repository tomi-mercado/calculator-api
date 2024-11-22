# Calculator API

This is a simple calculator API that can perform basic arithmetic operations.
The functional requirements that I have implemented are:

- The only operations available will be + - \* /.
- The only term separator will be the ()

The API is implemented in Typescript using Node.js and Express.js.

## How to run the API

1. Clone the repository
2. Run `pnpm install` to install the dependencies
3. Run `pnpm dev` to start the server
4. (Optional) You can change the port adding a file called `.env` in the root of the project with the following content:
   ```
   PORT=3001
   ```
   By default, the server will run on port 3000.
5. You can now make requests to the API using the following endpoint:
   ```
   http://localhost:3000/calculate
   ```
   The API expects a POST request with a JSON body containing the expression to evaluate. The expression should be a string with the following format:
   ```
   {
       "operation": "1 + (2 * 3)"
   }
   ```

## How to run the tests

You can run the tests using the command `pnpm test`. These tests doesn't run directly over the endpoint, but over the function that evaluates the expression.

## How to build the project

You can build the project using the command `pnpm build`. This will generate a `build` folder with the compiled code.
