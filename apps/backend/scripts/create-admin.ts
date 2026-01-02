import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function createAdmin() {
  // Admin credentials
  const email = 'admin@izzzi.com';
  const password = 'Admin123!';
  const firstName = 'Admin';
  const lastName = 'User';
  const establishmentName = 'IZZZI Demo Establishment';

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log('❌ Admin user already exists!');
      console.log(`Email: ${email}`);
      console.log('Please use a different email or delete the existing user.');
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create establishment and admin user in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create establishment
      const establishment = await tx.establishment.create({
        data: {
          name: establishmentName,
          createdBy: 'temp', // Will be updated after user creation
        },
      });

      // Create admin user
      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          firstName,
          lastName,
          role: 'ADMIN',
          establishmentId: establishment.id,
          authProvider: 'LOCAL',
          isEmailVerified: true,
          isActive: true,
        },
      });

      // Update establishment with actual user ID
      await tx.establishment.update({
        where: { id: establishment.id },
        data: { createdBy: user.id },
      });

      return { user, establishment };
    });

    console.log('✅ Admin user created successfully!');
    console.log('\n📧 Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Email:    ${email}`);
    console.log(`Password: ${password}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`\nUser ID: ${result.user.id}`);
    console.log(`Establishment: ${result.establishment.name}`);
    console.log(`\nYou can now log in at: http://localhost:3000/auth/login`);
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

