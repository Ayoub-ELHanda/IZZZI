const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkSuperAdmin() {
  try {
    const user = await prisma.user.findUnique({
      where: { email: 'superadmin@test.com' },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        isEmailVerified: true,
        password: true,
      },
    });

    if (user) {
      console.log('Super Admin found:');
      console.log(`- Email: ${user.email}`);
      console.log(`- Name: ${user.firstName} ${user.lastName}`);
      console.log(`- Role: ${user.role}`);
      console.log(`- Active: ${user.isActive}`);
      console.log(`- Email Verified: ${user.isEmailVerified}`);
      console.log(`- Has Password: ${user.password ? 'Yes' : 'No'}`);
    } else {
      console.log('Super Admin NOT found in database');
      console.log('Please run: npm run seed');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkSuperAdmin();

