# RentNest 🏠

**RentNest Backend** is a rental marketplace REST API built with Node.js, Express, TypeScript, PostgreSQL, and Prisma.

---

## 📦 Tech Stack

| Technology          | Purpose            |
| ------------------- | ------------------ |
| Node.js + Express   | REST API framework |
| TypeScript          | Static typing      |
| PostgreSQL + Prisma | Database + ORM     |
| JWT                 | Authentication     |
| Zod                 | Request validation |
| Stripe              | Payment processing |
| bcrypt              | Password hashing   |

---

## 🚀 Installation

### Prerequisites

- Node.js v18 or later
- PostgreSQL database
- Stripe account for testing

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/your-username/rentnest-backend.git
cd rentnest-backend

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# then fill in the values — see "Environment Variables" section below

# 4. Generate Prisma client
npx prisma generate

# 5. Run database migrations
npx prisma migrate dev --name init

# 6. Seed the database (creates the admin user + categories)
npx prisma db seed

# 7. Start the development server
npm run dev
```

The API will be running at `http://localhost:5000`.

### Useful scripts

```bash
npm run dev        # Start in development mode (with hot reload)
npm run build      # Compile TypeScript to JavaScript
npm start          # Run the compiled build (production)
npx prisma studio  # Open Prisma Studio (visual DB browser)
```

---

## 🔐 Environment Variables

Create a `.env` file in the project root with the following variables:

```dotenv
# Server
PORT=5000
NODE_ENV=development
APP_URL=http://localhost:3000

# Database
DATABASE_URL="postgresql://username:password@host:5432/rentnest?schema=public"

# JWT Authentication
JWT_ACCESS_SECRET=your-access-token-secret
JWT_REFRESH_SECRET=your-refresh-token-secret
JWT_ACCESS_EXPIRES_IN=1d
JWT_REFRESH_EXPIRES_IN=7d

# Stripe Payment
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_CURRENCY=usd
```

| Variable                 | Description                                                                   | Where to get it                                                                       |
| ------------------------ | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `PORT`                   | Port the server runs on                                                       | Any free port, e.g. `5000`                                                            |
| `NODE_ENV`               | `development` or `production`                                                 | Set manually                                                                          |
| `APP_URL`                | Base URL of this API (used for Stripe redirect URLs)                          | `http://localhost:3000` locally, deployed URL in production                           |
| `DATABASE_URL`           | PostgreSQL connection string                                                  | Your DB provider (Neon/Supabase/local Postgres) dashboard                             |
| `JWT_ACCESS_SECRET`      | Secret for signing short-lived access tokens                                  | Any long random string you generate                                                   |
| `JWT_REFRESH_SECRET`     | Secret for signing long-lived refresh tokens (must differ from access secret) | Any long random string you generate                                                   |
| `JWT_ACCESS_EXPIRES_IN`  | Access token lifetime                                                         | Default `1d`                                                                         |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token lifetime                                                        | Default `7d`                                                                         |
| `STRIPE_SECRET_KEY`      | Stripe secret key (test mode)                                                 | [Stripe Dashboard → Developers → API Keys](https://dashboard.stripe.com/test/apikeys) |
| `STRIPE_CURRENCY`        | Currency for Stripe charges                                                   | `usd` recommended (BDT not fully supported by Stripe)                                 |

> ⚠️ Never commit your `.env` file. Make sure it's listed in `.gitignore`.

---

## 📚 API List

### Base URL

#### Live API : https://rentnest-backend-three.vercel.app/api/v1

#### Local Development : http://localhost:5000/api/v1


### Authentication (`/auth`)

| Method | Endpoint                | Access        | Description                               |
| ------ | ----------------------- | ------------- | ----------------------------------------- |
| POST   | `/auth/register`        | Public        | Register a new user                       |
| POST   | `/auth/login`           | Public        | Login and receive access + refresh tokens |
| POST   | `/auth/refresh-token`   | Public        | Refresh access token                      |
| POST   | `/auth/logout`          | Authenticated | Logout user                               |
| GET    | `/auth/me`              | Authenticated | Get current user profile                  |
| PATCH  | `/auth/change-password` | Authenticated | Change password                           |

### User (`/user`)

| Method | Endpoint                | Access        | Description            |
| ------ | ----------------------- | ------------- | ---------------------- |
| GET    | `/user/me`              | Authenticated | Get own profile        |
| PATCH  | `/user/profile`         | Authenticated | Update profile         |
| PATCH  | `/user/profile/picture` | Authenticated | Update profile picture |

### Categories (`/categories`)

| Method | Endpoint          | Access | Description          |
| ------ | ----------------- | ------ | -------------------- |
| GET    | `/categories`     | Public | List all categories  |
| GET    | `/categories/:id` | Public | Get category details |
| POST   | `/categories`     | Admin  | Create a category    |
| PATCH  | `/categories/:id` | Admin  | Update a category    |
| DELETE | `/categories/:id` | Admin  | Delete a category    |

### Properties (`/properties`)

| Method | Endpoint                    | Access   | Description            |
| ------ | --------------------------- | -------- | ---------------------- |
| GET    | `/properties`               | Public   | List properties        |
| GET    | `/properties/:id`           | Public   | Get property details   |
| GET    | `/properties/my-properties` | Landlord | Get own properties     |
| POST   | `/properties`               | Landlord | Create a property      |
| PATCH  | `/properties/:id`           | Landlord | Update a property      |
| PATCH  | `/properties/:id/status`    | Landlord | Update property status |
| DELETE | `/properties/:id`           | Landlord | Delete a property      |

### Rentals (`/rentals`)

| Method | Endpoint               | Access                | Description                     |
| ------ | ---------------------- | --------------------- | ------------------------------- |
| POST   | `/rentals`             | Tenant                | Create rental request           |
| GET    | `/rentals/my-rentals`  | Tenant                | Get tenant rental requests      |
| GET    | `/rentals/requests`    | Landlord              | Get landlord rental requests    |
| GET    | `/rentals/history`     | Landlord              | Get rental history              |
| GET    | `/rentals/:id`         | Tenant/Landlord/Admin | Get rental request details      |
| PATCH  | `/rentals/:id/cancel`  | Tenant                | Cancel a pending rental request |
| PATCH  | `/rentals/:id/approve` | Landlord              | Approve a rental request        |
| PATCH  | `/rentals/:id/reject`  | Landlord              | Reject a rental request         |

### Payments (`/payments`)

| Method | Endpoint                  | Access | Description                    |
| ------ | ------------------------- | ------ | ------------------------------ |
| POST   | `/payments/create-intent` | Tenant | Create Stripe checkout session |
| POST   | `/payments/confirm`       | Tenant | Confirm Stripe payment         |
| GET    | `/payments/my-payments`   | Tenant | Tenant payment history         |
| GET    | `/payments/:id`           | Tenant | Payment detail                 |
| GET    | `/payments/success`       | Public | Stripe success redirect        |
| GET    | `/payments/cancel`        | Public | Stripe cancel redirect         |

### Reviews (`/reviews`)

| Method | Endpoint                  | Access | Description          |
| ------ | ------------------------- | ------ | -------------------- |
| POST   | `/reviews`                | Tenant | Create review        |
| GET    | `/reviews/properties/:id` | Public | Get property reviews |
| PATCH  | `/reviews/:id`            | Tenant | Update review        |
| DELETE | `/reviews/:id`            | Tenant | Delete review        |

### Landlord Dashboard (`/landlord`)

| Method | Endpoint              | Access   | Description                  |
| ------ | --------------------- | -------- | ---------------------------- |
| GET    | `/landlord/dashboard` | Landlord | Get landlord dashboard stats |

### Tenant Dashboard (`/tenant`)

| Method | Endpoint            | Access | Description                |
| ------ | ------------------- | ------ | -------------------------- |
| GET    | `/tenant/dashboard` | Tenant | Get tenant dashboard stats |

### Admin (`/admin`)

| Method | Endpoint                  | Access | Description           |
| ------ | ------------------------- | ------ | --------------------- |
| GET    | `/admin/users`            | Admin  | List users            |
| GET    | `/admin/users/:id`        | Admin  | Get user details      |
| PATCH  | `/admin/users/:id/status` | Admin  | Update user status    |
| DELETE | `/admin/users/:id`        | Admin  | Delete user           |
| GET    | `/admin/properties`       | Admin  | List properties       |
| DELETE | `/admin/properties/:id`   | Admin  | Delete property       |
| GET    | `/admin/rentals`          | Admin  | List rental requests  |
| GET    | `/admin/dashboard`        | Admin  | Admin dashboard stats |

---

## 🗄️ Database Schema

This project uses Prisma with PostgreSQL.

### Models

- `User`
  - `id`, `name`, `email`, `password`, `phone`, `avatar`, `bio`, `role`, `status`, `createdAt`, `updatedAt`
  - relations: `properties`, `rentalRequests`, `reviews`

- `Category`
  - `id`, `name`, `description`, `createdAt`, `updatedAt`
  - relations: `properties`

- `Property`
  - `id`, `title`, `description`, `location`, `price`, `bedrooms`, `bathrooms`, `size`, `images`, `status`, `categoryId`, `landlordId`, `createdAt`, `updatedAt`
  - relations: `category`, `landlord`, `rentalRequests`, `reviews`

- `RentalRequest`
  - `id`, `status`, `startDate`, `endDate`, `tenantId`, `propertyId`, `createdAt`, `updatedAt`
  - relations: `tenant`, `property`, `payment`

- `Payment`
  - `id`, `amount`, `provider`, `transactionId`, `status`, `paidAt`, `rentalRequestId`, `createdAt`, `updatedAt`
  - relations: `rentalRequest`

- `Review`
  - `id`, `rating`, `comment`, `tenantId`, `propertyId`, `createdAt`, `updatedAt`
  - relations: `tenant`, `property`

### Relationships

```text
User (LANDLORD) ──< Property
User (TENANT)   ──< RentalRequest >── Property
RentalRequest   ──1:1── Payment
User (TENANT)   ──< Review >── Property
Category        ──< Property
```

### Enums

- `Role`: `TENANT`, `LANDLORD`, `ADMIN`
- `UserStatus`: `ACTIVE`, `BANNED`
- `PropertyStatus`: `AVAILABLE`, `RENTED`, `UNAVAILABLE`
- `RentalStatus`: `PENDING`, `APPROVED`, `REJECTED`, `ACTIVE`, `COMPLETED`
- `PaymentProvider`: `STRIPE`, `SSLCOMMERZ`
- `PaymentStatus`: `PENDING`, `COMPLETED`, `FAILED`

---

## 🌐 Live Link

| Resource                    | URL                                                |
| --------------------------- | -------------------------------------------------- |
| Live API                    | https://rentnest-backend-three.vercel.app/api/v1               |
| API Documentation (Postman) | https://documenter.getpostman.com/view/49700440/2sBY4JxiKP#04aebb7b-fa16-403c-8c58-6f763b05c828 |
| Postman Collection JESON                  | RentNest.postman_collection.json           |

### Admin Credentials (for testing)

```text
Email    : admin@rentnest.com
Password : Admin123!
```

---

## 📁 Project Structure

```text
src/
├── config/           # Environment config
├── lib/              # Prisma client & Stripe client singletons
├── middlewares/      # auth, validation, error handling
├── errors/           # Custom AppError class
├── utils/            # catchAsync, sendResponse, jwt helpers
├── modules/
│   ├── admin/
│   ├── auth/
│   ├── user/
│   ├── catagory/
│   ├── landlord/
│   ├── property/
│   ├── rental/
│   ├── payment/
│   ├── review/
│   └── tenat/
├── app.ts
└── server.ts
prisma/
└── schema/           # Multi-file Prisma schema
RentNest.postman_collection.json
```

---

## 📝 License

This project was built as part of a backend development assignment. All work is original.
