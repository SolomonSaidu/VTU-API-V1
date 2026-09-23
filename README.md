# VTU API

A backend REST API for airtime and data purchases, transaction management, and scheduled recurring transactions.

Built with **Node.js, Express, PostgreSQL, Prisma, Redis, and BullMQ**, the API demonstrates asynchronous transaction processing and scheduled purchase execution through background workers.

---

## Overview

VTU API provides backend infrastructure for purchasing airtime and data through a VTU provider.

Authenticated users can:

- Purchase airtime
- Purchase data
- View transaction history
- Schedule future purchases
- Create recurring purchase schedules
- Manage scheduled transactions
- Process transactions asynchronously through background workers

The project was built as a backend engineering project to explore real-world concepts such as database design, authentication, background job processing, Redis queues, scheduled tasks, transaction state management, and external API integration.

---

## Tech Stack

| Technology   | Purpose                    |
| ------------ | -------------------------- |
| Node.js      | Runtime                    |
| Express.js   | REST API framework         |
| PostgreSQL   | Relational database        |
| Prisma       | ORM and database access    |
| Redis        | Queue backend              |
| BullMQ       | Background job processing  |
| JWT          | Authentication             |
| Zod          | Request validation         |
| Luxon        | Date and time calculations |
| cron-job.org | External scheduler trigger |
| Render       | API deployment             |
| Supabase     | PostgreSQL hosting         |

---

## Architecture

The API uses a combination of synchronous HTTP requests, database operations, and asynchronous background jobs.

```text
                         ┌─────────────────┐
                         │     Client      │
                         └────────┬────────┘
                                  │
                                  ▼
                         ┌─────────────────┐
                         │   Express API   │
                         └────────┬────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    ▼                           ▼
             PostgreSQL                    BullMQ Queue
                    │                           │
                    │                         Redis
                    │                           │
                    │                           ▼
                    │                    Background Worker
                    │                           │
                    │                           ▼
                    │                     VTU Provider
                    │
                    ▼
               Transaction
```

---

# Scheduled Transactions

One of the main features of the API is scheduled airtime and data purchases.

Users can create schedules that execute:

- Once
- Daily
- Monthly
- Minutely (used primarily for testing)

### Scheduling architecture

The project uses **cron-job.org** to periodically send an HTTP request to the API's scheduler endpoint.

The `pingController` then checks the database for schedules whose `nextRunAt` has been reached.

```text
cron-job.org
      │
      │ HTTP request
      ▼
/schedule/ping
      │
      ▼
pingController
      │
      │ Find due schedules
      ▼
Claim schedule
      │
      ▼
Create transaction
      │
      ▼
BullMQ Queue
      │
      ▼
Redis
      │
      ▼
Background Worker
      │
      ▼
VTU Provider
      │
      ▼
SUCCESS / FAILED
```

The scheduler currently runs through periodic HTTP requests rather than an internal continuously running cron process.

This approach introduces a small scheduling delay depending on the ping interval, but provides sufficiently accurate execution for the current requirements while keeping the system simple and lightweight.

The current configuration uses a **one-minute interval**, meaning a scheduled transaction can normally be detected within approximately one minute of its target time, assuming the API and database are available.

---

## Background Job Processing

Transaction processing is handled asynchronously using **BullMQ and Redis**.

Instead of keeping an HTTP request open while an external VTU provider processes a transaction, the API creates a transaction and places a job on a queue.

The worker then processes the job independently.

### Example flow

```text
API Request
    │
    ▼
Create Transaction
    │
    ▼
Status: PENDING
    │
    ▼
Add Job to BullMQ
    │
    ▼
Redis
    │
    ▼
Worker picks up Job
    │
    ▼
Check wallet / transaction requirements
    │
    ▼
Call VTU Provider
    │
    ├── Success → SUCCESS
    │
    └── Failure → FAILED
```

This separates the HTTP API from the potentially slower transaction-processing operations.

---

# Transaction Lifecycle

Transactions move through different states during processing.

```text
PENDING
   │
   ▼
PROCESSING
   │
   ├──────────────► SUCCESS
   │
   └──────────────► FAILED
```

For scheduled transactions, the schedule itself also maintains information such as:

- `active`
- `frequency`
- `nextRunAt`
- `lastRunAt`
- `lastStatus`

The scheduler uses these fields to determine which schedules are due and when they should run next.

---

# Duplicate Execution Protection

The scheduler uses an atomic database update when claiming a schedule.

Before processing a schedule, the API attempts to change its status to `PROCESSING`.

Only a schedule that is still active and not already being processed can be claimed.

This helps prevent two scheduler requests from processing the same schedule simultaneously.

Conceptually:

```text
Scheduler A ──► Claim schedule ──► SUCCESS
Scheduler B ──► Attempt claim ──► Skipped
```

This is particularly important because the scheduler is triggered through periodic HTTP requests.

---

### Controllers

Handle HTTP requests, responses, and communication between routes and application logic.

### Routes

Define the API endpoints and connect them to their respective controllers.

### Middleware

Handles cross-cutting concerns such as authentication, validation, and error handling.

### Queues

Define background jobs that need to be processed asynchronously.

### Workers

Consume queued jobs and execute transaction-processing logic.

### Prisma

Handles database access and communication with PostgreSQL.

---

# API Features

## Authentication

Users can create accounts and authenticate using JWT-based authentication.

Protected endpoints require a valid access token.

---

## Airtime Purchases

Authenticated users can purchase airtime through the API.

The request is validated before a transaction is created and processed.

Supported information includes:

- Network
- Phone number
- Amount
- Airtime type
- Ported number information

---

## Data Purchases

The API also supports data transactions through the configured VTU provider.

---

## Transaction History

Users can retrieve their previous transactions and inspect their transaction status.

Transactions provide a record of purchases processed through the system.

---

## Scheduled Purchases

Users can create scheduled transactions for future purchases.

Supported schedule frequencies include:

```text
ONCE
DAILY
MONTHLY
```

A test-oriented `MINUTELY` frequency is also available during development.

---

# Database

The application uses **PostgreSQL** with **Prisma ORM**.

Prisma manages:

- Database schema
- Migrations
- Relationships
- Queries
- Transaction data

Database migrations are stored in:

```text
prisma/migrations/
```

For a fresh database, existing migrations can be applied with:

```bash
npx prisma migrate deploy
```

Generate the Prisma client with:

```bash
npx prisma generate
```

---

# Environment Variables

Create a `.env` file in the project root.

Example:

```env
DATABASE_URL="your-database-url"
JWT_SECRET="your-jwt-secret"

REDIS_URL="your-redis-url"

VTU_API_URL="your-provider-url"
VTU_API_KEY="your-provider-api-key"

PORT=5000
```

Never commit your `.env` file or expose API keys and secrets publicly.

For deployment, configure these values through the hosting provider's environment-variable settings.

---

# Getting Started

## Requirements

Before running the project locally, make sure you have:

- Node.js
- PostgreSQL
- Redis
- Git

---

## Installation

Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
```

Enter the project directory:

```bash
cd YOUR_REPOSITORY
```

Install dependencies:

```bash
npm install
```

Create your environment file:

```bash
.env
```

Add the required environment variables.

---

## Database Setup

Apply the existing Prisma migrations:

```bash
npx prisma migrate deploy
```

Generate the Prisma client:

```bash
npx prisma generate
```

---

## Running the API

Start the development server:

```bash
npm run dev
```

---

## Running the Worker

The BullMQ worker needs to run alongside the API so that queued transactions can be processed.

```bash
npm run worker
```

The exact command depends on the scripts defined in `package.json`.

---

# Error Handling

The API uses centralized error handling to provide consistent responses for application and operational errors.

Validation errors, authentication failures, database errors, and transaction-processing failures are handled through the application's error-handling middleware.

---

# Deployment

The API is deployed using **Render**.

The PostgreSQL database is hosted using **Supabase**, while Redis is used for BullMQ background job processing.

The scheduler endpoint is triggered periodically by **cron-job.org**.

```text
Render
  │
  ├── Express API
  │
  └── Worker
       │
       └── Redis

Supabase
  │
  └── PostgreSQL

cron-job.org
  │
  └── /schedule/ping
```

---

# Limitations

The current version intentionally keeps the system relatively simple.

Some limitations include:

- Scheduling depends on periodic HTTP requests from cron-job.org.
- Scheduled execution can have a small delay based on the configured ping interval.
- Payment funding is not included in the current version.
- Email notifications are not currently implemented.
- The system currently focuses on the core VTU transaction workflow.

---

# Future Improvements

Planned improvements for future versions include:

- Paystack wallet funding
- Email notifications
- Schedule-processing notifications
- Transaction-result notifications
- Improved transaction idempotency
- More robust payment processing
- Additional VTU providers
- Admin dashboard
- Better monitoring and logging

---

# What I Learned

This project was built to strengthen practical backend engineering skills.

Key areas explored during development include:

- REST API design
- Authentication and authorization
- PostgreSQL database design
- Prisma ORM
- Input validation
- Redis
- BullMQ
- Background workers
- Scheduled jobs
- Asynchronous processing
- Transaction state management
- Race-condition prevention
- External API integration
- Cloud database deployment
- Backend deployment

---

# Status

**V1 — Completed**

The current version focuses on the core VTU transaction and scheduling infrastructure.

Future versions will expand the system with payment processing, email notifications, and additional production-oriented features.

---

# Author

**Solomon Saidu**

Backend / Full-Stack Developer

Built as part of my backend engineering learning and portfolio projects.
