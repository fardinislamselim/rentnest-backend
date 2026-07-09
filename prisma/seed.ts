import bcrypt from "bcrypt";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import config from "../src/config";

const connectionString = `${config.database_url}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const categories = [
  { name: "Apartment" },
  { name: "House" },
  { name: "Studio" },
];

async function main() {
  await prisma.category.createMany({
    data: categories,
    skipDuplicates: true,
  });

  const admin = await prisma.user.upsert({
    where: { email: "admin@rentnest.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@rentnest.com",
      password: bcrypt.hashSync("Admin123!", 10),
      role: "ADMIN",
      status: "ACTIVE",
    },
  });

  const landlord = await prisma.user.upsert({
    where: { email: "landlord@rentnest.com" },
    update: {},
    create: {
      name: "Landlord User",
      email: "landlord@rentnest.com",
      password: bcrypt.hashSync("Landlord123!", 10),
      role: "LANDLORD",
      status: "ACTIVE",
    },
  });

  const tenant = await prisma.user.upsert({
    where: { email: "tenant@rentnest.com" },
    update: {},
    create: {
      name: "Tenant User",
      email: "tenant@rentnest.com",
      password: bcrypt.hashSync("Tenant123!", 10),
      role: "TENANT",
      status: "ACTIVE",
    },
  });

  const apartmentCategory = await prisma.category.findUnique({
    where: { name: "Apartment" },
  });

  const houseCategory = await prisma.category.findUnique({
    where: { name: "House" },
  });

  if (!apartmentCategory || !houseCategory) {
    throw new Error("Required seed categories not found");
  }

  await prisma.property.createMany({
    data: [
      {
        title: "Modern 2-Bedroom Apartment",
        description:
          "A bright apartment near the city center with easy transit access.",
        location: "Downtown",
        price: 1200,
        bedrooms: 2,
        bathrooms: 1,
        size: 850,
        images: [
          "https://example.com/images/apartment-1.jpg",
          "https://example.com/images/apartment-2.jpg",
        ],
        categoryId: apartmentCategory.id,
        landlordId: landlord.id,
      },
      {
        title: "Cozy Family House",
        description: "A spacious house with a garden and quiet neighborhood.",
        location: "Suburbia",
        price: 1800,
        bedrooms: 3,
        bathrooms: 2,
        size: 1600,
        images: [
          "https://example.com/images/house-1.jpg",
          "https://example.com/images/house-2.jpg",
        ],
        categoryId: houseCategory.id,
        landlordId: landlord.id,
      },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Seed data created successfully:");
  console.log(`  admin: ${admin.email}`);
  console.log(`  landlord: ${landlord.email}`);
  console.log(`  tenant: ${tenant.email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
