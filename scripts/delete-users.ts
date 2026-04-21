import { prisma } from "@/src/lib/db";

async function deleteUsers() {
  const keepEmail = "test@test.com";

  const usersToDelete = await prisma.user.findMany({
    where: {
      email: {
        not: keepEmail,
      },
    },
  });

  console.log(`Found ${usersToDelete.length} users to delete (keeping ${keepEmail})`);

  for (const user of usersToDelete) {
    console.log(`Deleting user: ${user.email} (${user.id})`);
    await prisma.user.delete({
      where: { id: user.id },
    });
  }

  console.log("Done!");
}

deleteUsers()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
