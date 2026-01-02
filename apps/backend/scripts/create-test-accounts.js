const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function createTestAccounts() {
  const testAccounts = [
    {
      email: 'admin@test.com',
      password: 'Admin123!',
      firstName: 'Admin',
      lastName: 'Test',
      role: 'ADMIN',
      establishmentName: 'Test Establishment',
    },
    {
      email: 'pedagogique@test.com',
      password: 'Pedagogique123!',
      firstName: 'Pedagogique',
      lastName: 'Test',
      role: 'RESPONSABLE_PEDAGOGIQUE',
    },
    {
      email: 'visiteur@test.com',
      password: 'Visiteur123!',
      firstName: 'Visiteur',
      lastName: 'Test',
      role: 'VISITEUR',
    },
  ];

  try {
    // Find or create an establishment
    let establishment = await prisma.establishment.findFirst();
    
    if (!establishment) {
      // Find admin or create a temporary one
      let adminUser = await prisma.user.findFirst({
        where: { role: 'ADMIN' },
      });

      if (!adminUser) {
        // Create a temporary admin for establishment
        const hashedPassword = await bcrypt.hash('Temp123!', 10);
        adminUser = await prisma.user.create({
          data: {
            email: 'temp-admin@test.com',
            password: hashedPassword,
            firstName: 'Temp',
            lastName: 'Admin',
            role: 'ADMIN',
            authProvider: 'LOCAL',
            isEmailVerified: true,
            isActive: false, // Mark as inactive
          },
        });
      }

      establishment = await prisma.establishment.create({
        data: {
          name: 'Test Establishment',
          createdBy: adminUser.id,
        },
      });
    }

    console.log('\n📝 Creating test accounts...\n');

    for (const account of testAccounts) {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: account.email },
      });

      if (existingUser) {
        console.log(`⚠️  Account already exists: ${account.email}`);
        console.log(`   Email: ${account.email}`);
        console.log(`   Password: ${account.password}\n`);
        continue;
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(account.password, 10);

      if (account.role === 'ADMIN') {
        // Create establishment and admin in transaction
        const result = await prisma.$transaction(async (tx) => {
          // Create establishment for admin
          const newEstablishment = await tx.establishment.create({
            data: {
              name: account.establishmentName,
              createdBy: 'temp',
            },
          });

          // Create admin user
          const user = await tx.user.create({
            data: {
              email: account.email,
              password: hashedPassword,
              firstName: account.firstName,
              lastName: account.lastName,
              role: account.role,
              establishmentId: newEstablishment.id,
              authProvider: 'LOCAL',
              isEmailVerified: true,
              isActive: true,
            },
          });

          // Update establishment with user ID
          await tx.establishment.update({
            where: { id: newEstablishment.id },
            data: { createdBy: user.id },
          });

          return { user, establishment: newEstablishment };
        });

        console.log(`✅ ${account.role} account created:`);
        console.log(`   Email: ${account.email}`);
        console.log(`   Password: ${account.password}`);
        console.log(`   Establishment: ${result.establishment.name}\n`);
      } else {
        // Create regular user
        const user = await prisma.user.create({
          data: {
            email: account.email,
            password: hashedPassword,
            firstName: account.firstName,
            lastName: account.lastName,
            role: account.role,
            establishmentId: establishment.id,
            authProvider: 'LOCAL',
            isEmailVerified: true,
            isActive: true,
          },
        });

        console.log(`✅ ${account.role} account created:`);
        console.log(`   Email: ${account.email}`);
        console.log(`   Password: ${account.password}`);
        console.log(`   Establishment: ${establishment.name}\n`);
      }
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n📋 Test Accounts Summary:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n🔴 ADMIN:');
    console.log('   Email: admin@test.com');
    console.log('   Password: Admin123!');
    console.log('\n🟡 RESPONSABLE_PEDAGOGIQUE:');
    console.log('   Email: pedagogique@test.com');
    console.log('   Password: Pedagogique123!');
    console.log('\n🟢 VISITEUR:');
    console.log('   Email: visiteur@test.com');
    console.log('   Password: Visiteur123!');
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\nYou can now log in at: http://localhost:3000/auth/login');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ Error creating test accounts:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

createTestAccounts()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

