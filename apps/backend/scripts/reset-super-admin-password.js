const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function resetSuperAdminPassword() {
  try {
    const password = 'password123';
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.update({
      where: { email: 'superadmin@test.com' },
      data: {
        password: hashedPassword,
      },
      select: {
        email: true,
        role: true,
      },
    });

    console.log('Super Admin password reset successfully!');
    console.log(`- Email: ${user.email}`);
    console.log(`- Role: ${user.role}`);
    console.log(`- Password: ${password}`);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetSuperAdminPassword();

