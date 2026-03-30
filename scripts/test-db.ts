import "dotenv/config";
import { PrismaClient } from '../src/generated/prisma';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Fetching demo data from the database...\n");

  const user = await prisma.user.findUnique({
    where: { email: 'demo@devstash.io' },
    include: {
      collections: {
        include: {
          items: true
        }
      },
      items: true
    }
  });

  if (!user) {
    console.error("❌ Demo user not found! Please run the seed script first.");
    return;
  }

  console.log("✅ User Found:");
  console.log(`   Name: ${user.name}`);
  console.log(`   Email: ${user.email}`);
  console.log(`   isPro: ${user.isPro}`);

  const itemTypes = await prisma.itemType.findMany({
    where: { isSystem: true }
  });

  console.log(`\n✅ System Item Types (${itemTypes.length}):`);
  itemTypes.forEach(t => {
    console.log(`   - ${t.name} (Icon: ${t.icon}, Color: ${t.color})`);
  });

  console.log(`\n✅ Collections (${user.collections.length}):`);
  user.collections.forEach(c => {
    console.log(`   📁 ${c.name} (${c.items.length} items)`);
    c.items.forEach(i => {
      console.log(`      ↳ ${i.title}`);
    });
  });

  const totalItems = await prisma.item.count({ where: { userId: user.id } });
  console.log(`\n📊 Total items for demo user: ${totalItems}`);
  console.log("\nDatabase test completed successfully 🎉");
}

main()
  .catch((e) => {
    console.error("Database connection failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
