import "dotenv/config";
import { PrismaClient } from '../src/generated/prisma';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Testing database connection...");
  
  // Try to query the database
  const userCount = await prisma.user.count();
  console.log(`Database connection successful. Current user count: ${userCount}`);

  // Optionally create a test type just to be sure
  const typesCount = await prisma.itemType.count();
  console.log(`Current item types count: ${typesCount}`);
  
  console.log("Database connected properly.");
}

main()
  .catch((e) => {
    console.error("Database connection failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
