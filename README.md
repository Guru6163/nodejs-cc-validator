# Node.js Credit Card Validator

This is a Node.js project for validating credit card information and managing users. It uses Express for handling HTTP requests, MongoDB for database storage, and includes user registration, login, credit card validation, and retrieving validated credit cards.

## Installation and Setup

1. Clone the repository to your local machine:

   ```bash
   git clone https://github.com/guru6163/nodejs-cc-validator.git
   ```

2. Navigate to the project directory:

   ```bash
   cd nodejs-cc-validator
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

4. Create a `.env` file in the root directory with the following content:

   ```
   DB_HOST=your-mongodb-connection-string
   JWT_SECRET=your-secret-key-for-jwt
   PORT=4000
   ```

   Replace `your-mongodb-connection-string` with your actual MongoDB connection string and choose a strong `your-secret-key-for-jwt` for JWT token encryption.

## Usage

1. Start the server:

   ```bash
   npm run dev
   ```

2. The server will start on the specified port (default: 4000). You can access the API at `http://localhost:4000`.

3. If you prefer to use the deployed backend, you can use the following base URL:

   **Deployed Backend Base URL:** `https://cc-validator-backend.onrender.com`

## API Endpoints

### 1. User Registration (Sign-up)

- **Endpoint:** POST `/signUp`
- **Request Body:** `{ "username": "your-username", "password": "your-password" }`
- **Response:** `{ "message": "User created successfully" }`

### 2. User Login (Sign-in)

- **Endpoint:** POST `/signIn`
- **Request Body:** `{ "username": "your-username", "password": "your-password" }`
- **Response:** `{ "token": "your-jwt-token" }`

### 3. Credit Card Validation and Storage

- **Endpoint:** POST `/validate`
- **Request Body:** `{ "token": "your-jwt-token", "cardholderName": "John Doe", "cardNumber": "1234567812345678", "expirationDate": "12/25", "cvv": "123" }`
- **Response:** `{ "message": "Credit card validated and saved successfully" }`

### 4. Get Validated Credit Cards

- **Endpoint:** GET `/getValidatedCards`
- **Request Header:** `Authorization: Bearer your-jwt-token`
- **Response:** `{ "validatedCreditCards": [{ "cardholderName": "John Doe", "cardNumber": "1234567812345678", "expirationDate": "12/25", "cvv": "123" }] }`

## Note

- Make sure to handle user authentication and authorization for protected routes (e.g., `/validate`, `/getValidatedCards`) by checking the JWT token.
- The project uses bcrypt for password hashing and jwt for token generation.
- The credit card validation is based on Luhn's algorithm, which checks the validity of the card number.
- The project uses MongoDB to store user information and validated credit cards. Ensure that you have a MongoDB database available and provide the connection string in the `.env` file.
- This project is a simple demonstration of credit card validation and user management and should be extended with proper security measures for production use.

If you prefer to use the deployed backend, the base URL is provided above.