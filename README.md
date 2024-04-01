
# Express Authentication and Ethereum Balance Retrieval

This is a Node.js application built using Express.js for authentication and web3.js to retrieve the Ethereum balance of a specified account. The application includes user authentication, protected routes, and integration with the Ethereum blockchain to fetch account balances.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [File Structure](#file-structure)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Ethereum Balance Retrieval](#ethereum-balance-retrieval)
- [Testing](#testing)
- [Contributing](#contributing)


## Installation

1. Clone the repository to your local machine:

   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project directory:

   ```bash
   cd express-authentication-ethereum-balance
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

## Usage

1. Start the server:

   ```bash
   npm start
   ```

2. Open your web browser and go to `http://localhost:5000` to access the application.

## Features

- User authentication using JWT tokens
- Registration of new users
- Login with username and password
- Protected routes accessible only to authenticated users
- Integration with the Ethereum blockchain to retrieve account balances

## Technologies Used

- Node.js
- Express.js
- bcrypt
- jsonwebtoken (JWT)
- web3.js
- MongoDB (optional, not used in this version)

## File Structure

```
express-authentication-ethereum-balance/
├── public/
│   ├── css/
│   │   └── styles.css
│   └── js/
│       └── script.js
├── views/
│   ├── authenticated.ejs
│   ├── categories.ejs
│   ├── login.ejs
│   └── signup.ejs
├── src/
│   ├── config.js
│   ├── index.js
│   ├── swagger.js
│   └── swagger.json
├── package.json
└── README.md
```

## API Endpoints

- `GET /` - Render the login page
- `GET /categories` - Get all categories (protected route)
- `GET /signup` - Render the signup page
- `POST /signup` - Register a new user
- `POST /login` - Authenticate user login
- `POST /applyFilters` - Apply filters to retrieve filtered data (protected route)
- `GET /authenticated` - Render the authenticated page (protected route)
- `GET /ethereum-balance` - Retrieve Ethereum account balance (protected route)

## Authentication

- User authentication is handled using JWT tokens.
- When a user logs in successfully, a JWT token is generated and stored as a cookie.
- Protected routes check for the presence of a valid JWT token in the request cookies to authenticate users.

## Ethereum Balance Retrieval

- The application integrates with the Ethereum blockchain using web3.js.
- Users can retrieve their Ethereum account balances by accessing the `/ethereum-balance` route.
- The Ethereum balance is fetched using the web3.js library by providing the Ethereum account address.

## Testing

- Unit tests and integration tests can be added to the project using testing frameworks like Mocha and Chai.
- Test scripts can be configured in the `package.json` file.

## Contributing

Contributions are welcome! Please feel free to submit a pull request.


Note : index(mongo).js uses local server created by mongodb compass.
