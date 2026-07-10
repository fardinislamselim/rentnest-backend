import swaggerJsdoc from "swagger-jsdoc";

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",

    info: {
      title: "RentNest REST API",
      version: "1.0.0",
      description: `
# RentNest REST API

A RESTful backend API for a rental property marketplace.

## Features

- JWT Authentication
- Role-Based Authorization
- Property Management
- Rental Request Workflow
- Stripe Payment Integration
- Review & Rating System
- Dashboard Analytics
- Search, Filter & Pagination
- Global Error Handling
- Zod Validation
- Prisma ORM
- PostgreSQL Database

## Roles

- Tenant
- Landlord
- Admin
      `,
    },

    servers: [
      {
        url: "http://localhost:5000/api/v1",
        description: "Local Development",
      },
      {
        url: "https://rentnest-backend-83n7.onrender.com/api/v1",
        description: "Production Server",
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description:
            "Enter your JWT access token. Example: eyJhbGciOiJIUzI1NiIs...",
        },
      },

      schemas: {
        SuccessResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            message: {
              type: "string",
              example: "Request completed successfully",
            },
            data: {
              type: "object",
            },
          },
        },

        ErrorResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            message: {
              type: "string",
              example: "Validation Error",
            },
            errorDetails: {
              type: "object",
              nullable: true,
            },
          },
        },
      },
    },

    security: [
      {
        bearerAuth: [],
      },
    ],

    tags: [
      {
        name: "Authentication",
        description: "User registration, login and authentication APIs",
      },
      {
        name: "Users",
        description: "Manage authenticated user profile",
      },
      {
        name: "Categories",
        description: "Property category management",
      },
      {
        name: "Properties",
        description: "Property management and public property browsing",
      },
      {
        name: "Rental Requests",
        description: "Rental request workflow between tenants and landlords",
      },
      {
        name: "Payments",
        description: "Stripe payment processing",
      },
      {
        name: "Reviews",
        description: "Property reviews and ratings",
      },
      {
        name: "Admin",
        description: "Platform administration",
      },
      {
        name: "Dashboard",
        description: "Admin, Landlord and Tenant dashboards",
      },
    ],
  },

  apis: ["./src/modules/**/*.ts"],
});

export default swaggerSpec;
