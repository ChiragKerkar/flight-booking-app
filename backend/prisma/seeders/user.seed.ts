import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function seedUsers() {
  // npx ts-node prisma/seeders/user.seed.ts
  const users = [
    {
      name: 'Bob Johnson',
      email: 'bob@example.com',
      password: 'securePass456',
    },
    {
      name: 'Charlie Brown',
      email: 'charlie@example.com',
      password: 'charlieSecret789',
    },
  ];

  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: hashedPassword,
      },
    });
  }

  console.log('✅ Users seeded successfully.');
}

seedUsers()
  .catch((e) => {
    console.error('❌ Error seeding users:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
