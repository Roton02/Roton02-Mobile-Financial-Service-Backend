# Mobile Financial Service API

A robust REST API for a mobile financial service system built with Node.js, Express, TypeScript, and MongoDB. This system supports user authentication, money transfers, cash-in/cash-out operations, and agent management.

## Features

- User and Agent Registration/Login
- Secure PIN-based Transactions
- Send Money Between Users
- Cash In (Agent to User)
- Cash Out (User to Agent)
- Transaction History
- Agent Cash Request Management
- Admin Dashboard Support
- Role-based Access Control

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- TypeScript
- npm/yarn

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
NODE_ENV=development
PORT=5000
BCRYPT_SALT=12
JWT_SECRET=your_jwt_secret_here
DATABASE_URL=your_mongodb_connection_string
```

## Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Build the project:

```bash
npm run build
```

4. Start the development server:

```bash
npm run dev
```

## API Endpoints

### Authentication Routes

- `POST /api/auth/register` - Register a new user/agent
- `POST /api/auth/login` - Login user/agent
- `PATCH /api/auth/:ID` - Update account (Admin only)
- `PATCH /api/AgentStatus/:ID` - Update agent status (Admin only)
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:Number` - Get single user details (Admin only)

### Transaction Routes

- `POST /api/transaction/sendMoney` - Send money to another user
- `POST /api/transaction/cashOut` - Cash out money (User to Agent)
- `POST /api/transaction/cashIn` - Cash in money (Agent to User)
- `GET /api/transaction` - Get transaction history
- `GET /api/transaction/:number` - Get specific user's transactions
- `POST /api/transaction/cashRequest` - Submit cash request (Agent only)
- `POST /api/transaction/withdrawRequest` - Submit withdraw request (Agent only)
- `PATCH /api/transaction/approveCashRequest/:id` - Approve cash request (Admin only)
- `PATCH /api/transaction/approveWithdrawRequest/:id` - Approve withdraw request (Admin only)
- `GET /api/transaction/getAllCashRequest` - Get all cash requests (Admin only)
- `GET /api/transaction/getAllWithdrawRequest` - Get all withdraw requests (Admin only)
- `GET /api/transaction/totalBallances` - Get total system balance (Admin only)

## Security Features

- JWT-based Authentication
- PIN-based Transaction Verification
- Role-based Access Control
- Request Validation using Zod
- Global Error Handling
- Secure Password Hashing

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build the project
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code using Prettier

## Development Tools

- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Zod for request validation
- MongoDB with Mongoose for database management
- Express.js for API routing
- JWT for authentication
- bcrypt for password hashing
