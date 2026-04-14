# FINAPP Backend

A robust and scalable financial management API built with Node.js, Express, and TypeScript. This backend serves as the core engine for FINAPP, managing everything from user authentication to complex financial simulations and real-time updates.

## 🚀 Technologies

- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** MongoDB (Mongoose ODM)
- **Caching & Pub/Sub:** Redis (ioredis)
- **Real-time:** Socket.io
- **Security:** JWT, Bcrypt, Helmet, Express Rate Limit
- **Payments:** Stripe (with Webhook support)
- **File Storage:** Cloudinary
- **AI Integration:** OpenAI & Google Generative AI
- **Background Tasks:** Node-cron
- **Validation:** Zod

## ✨ Key Features

- **Multi-Role Authentication:** Secure Auth system with Admin and User roles, featuring JWT-based session management and route protection.
- **Financial Module Management:** Complete CRUD and logic for:
  - Bank Accounts & Transactions
  - Mutual Funds, Stocks, Bonds, and Gold Investments
  - Debt and Insurance tracking
  - Goal Management (tracking progress toward financial targets)
- **AA Simulator:** An internal Account Aggregator simulator that automatically generates mock transactions, debts, and insurance data for testing and trial users.
- **Real-time Engine:** Socket.io integration for instant notifications and chat functionality.
- **Automated Workflows:** 
  - Subscription expiry checks.
  - Periodic price updates for Mutual Funds, Stocks, and Gold.
  - Debt and Insurance status automation.
- **Infrastructure:** Dockerized setup for easy deployment and consistency.

## 📁 Project Structure

```text
src/
├── aa-simulator/     # Account Aggregator simulator logic
├── config/           # Database and environment configurations
├── controller/       # Request handlers (grouped by module)
├── cron/             # Scheduled background tasks
├── dtos/             # Data Transfer Objects
├── middleware/       # Auth, Logging, and Subscription checks
├── model/            # Mongoose schemas
├── repositories/     # Data access layer (Base + specialized repos)
├── routes/           # API route definitions (v1)
├── services/         # Core business logic
├── sockets/          # Socket.io handlers and listeners
└── utils/            # Helper functions and shared utilities
```

## 🛠️ Getting Started

### Prerequisites
- Node.js (v20+)
- MongoDB
- Redis

### Installation
1. Navigate to the backend directory:
   ```bash
   cd FINAPP_BACKEND
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Create a `.env` file based on the required configurations (DB URI, Redis credentials, Stripe/Cloudinary keys, etc.).
4. Start development server:
   ```bash
   npm run dev
   ```

## 🐳 Docker Support
Build and run the backend using Docker:
```bash
docker-compose up --build
```
