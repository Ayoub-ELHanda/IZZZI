const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function createUser() {
  // Get role from command line argument or default to RESPONSABLE_PEDAGOGIQUE
  const role = process.argv[2]?.toUpperCase() || 'RESPONSABLE_PEDAGOGIQUE';
  
  // Validate role
  const validRoles = ['RESPONSABLE_PEDAGOGIQUE', 'VISITEUR'];
  if (!validRoles.includes(role)) {
    console.log('❌ Invalid role!');
    console.log('Valid roles: RESPONSABLE_PEDAGOGIQUE, VISITEUR');
    console.log('\nUsage: npm run create-user [ROLE]');
    console.log('Example: npm run create-user RESPONSABLE_PEDAGOGIQUE');
    process.exit(1);
  }

  // User credentials - you can modify these
  const email = role === 'RESPONSABLE_PEDAGOGIQUE' 
    ? 'pedagogique@izzzi.com' 
    : 'visiteur@izzzi.com';
  const password = 'User123!';
  const firstName = role === 'RESPONSABLE_PEDAGOGIQUE' ? 'Pedagogique' : 'Visiteur';
  const lastName = 'User';

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log('❌ User already exists!');
      console.log(`Email: ${email}`);
      console.log('Please use a different email or delete the existing user.');
      return;
    }

    // Find an existing establishment (or create one if none exists)
    let establishment = await prisma.establishment.findFirst();
    
    if (!establishment) {
      console.log('⚠️  No establishment found. Creating a default one...');
      // Find an admin user to use as creator
      const adminUser = await prisma.user.findFirst({
        where: { role: 'ADMIN' },
      });
      
      if (!adminUser) {
        console.log('❌ No admin user found. Please create an admin first.');
        return;
      }

      establishment = await prisma.establishment.create({
        data: {
          name: 'Default Establishment',
          createdBy: adminUser.id,
        },
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role: role,
        establishmentId: establishment.id,
        authProvider: 'LOCAL',
        isEmailVerified: true,
        isActive: true,
      },
    });

    console.log('✅ User created successfully!');
    console.log('\n📧 Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Email:    ${email}`);
    console.log(`Password: ${password}`);
    console.log(`Role:     ${role}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`\nUser ID: ${user.id}`);
    console.log(`Establishment: ${establishment.name}`);
    console.log(`\nYou can now log in at: http://localhost:3000/auth/login`);
  } catch (error) {
    console.error('❌ Error creating user:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

createUser()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

