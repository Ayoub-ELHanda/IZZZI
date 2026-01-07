const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

// Charger les variables d'environnement depuis .env
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env');
  if (fs.existsSync(envPath)) {
    const envFile = fs.readFileSync(envPath, 'utf8');
    envFile.split('\n').forEach(line => {
      const trimmedLine = line.trim();
      if (trimmedLine && !trimmedLine.startsWith('#')) {
        const [key, ...valueParts] = trimmedLine.split('=');
        if (key && valueParts.length > 0) {
          const value = valueParts.join('=').replace(/^["']|["']$/g, '');
          process.env[key.trim()] = value.trim();
        }
      }
    });
  }
  
  // Si pas de DATABASE_URL, utiliser la valeur par défaut
  // Dans Docker, utiliser 'postgres' comme hostname
  // En local, utiliser 'localhost'
  if (!process.env.DATABASE_URL) {
    // Vérifier si on est dans Docker (variable d'environnement typique)
    const isDocker = process.env.DATABASE_URL || fs.existsSync('/.dockerenv');
    if (isDocker) {
      process.env.DATABASE_URL = 'postgresql://izzzi:izzzi@postgres:5432/izzzi';
    } else {
      process.env.DATABASE_URL = 'postgresql://izzzi:izzzi@localhost:5432/izzzi';
    }
  }
}

loadEnv();

const prisma = new PrismaClient();

async function deleteUser() {
  const email = process.argv[2] || 'elhandaayo@gmail.com';

  try {
    console.log(`🔍 Recherche de l'utilisateur avec l'email: ${email}...\n`);

    // Trouver l'utilisateur avec son établissement
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        establishment: {
          include: {
            users: true,
          },
        },
      },
    });

    if (!user) {
      console.log(`❌ Aucun utilisateur trouvé avec l'email: ${email}`);
      return;
    }

    console.log(`✅ Utilisateur trouvé:`);
    console.log(`   ID: ${user.id}`);
    console.log(`   Nom: ${user.firstName} ${user.lastName}`);
    console.log(`   Rôle: ${user.role}`);
    console.log(`   Établissement: ${user.establishment ? user.establishment.name : 'Aucun'}`);
    console.log(`   Créateur de l'établissement: ${user.establishment && user.establishment.createdBy === user.id ? 'Oui' : 'Non'}\n`);

    // Si l'utilisateur est le créateur de l'établissement
    if (user.establishment && user.establishment.createdBy === user.id) {
      // Vérifier s'il y a d'autres utilisateurs dans l'établissement
      const otherUsers = user.establishment.users.filter(u => u.id !== user.id);
      
      if (otherUsers.length > 0) {
        console.log(`⚠️  Il y a ${otherUsers.length} autre(s) utilisateur(s) dans cet établissement.`);
        console.log(`   Suppression uniquement de l'utilisateur...`);
        // S'il y a d'autres utilisateurs, on ne supprime que l'utilisateur
        await prisma.user.delete({
          where: { id: user.id },
        });
        console.log(`✅ Utilisateur supprimé avec succès!`);
      } else {
        console.log(`⚠️  C'est le seul utilisateur de l'établissement.`);
        console.log(`   Suppression de l'utilisateur et de l'établissement...`);
        // Si c'est le seul utilisateur, on supprime l'établissement aussi
        // (cela supprimera automatiquement l'utilisateur via cascade)
        await prisma.establishment.delete({
          where: { id: user.establishment.id },
        });
        console.log(`✅ Utilisateur et établissement supprimés avec succès!`);
      }
    } else {
      // Sinon, on supprime juste l'utilisateur
      console.log(`Suppression de l'utilisateur...`);
      await prisma.user.delete({
        where: { id: user.id },
      });
      console.log(`✅ Utilisateur supprimé avec succès!`);
    }

    console.log(`\n🎉 L'utilisateur ${email} a été supprimé de la base de données.`);
    console.log(`   Vous pouvez maintenant tester l'inscription manuellement.\n`);

  } catch (error) {
    console.error('❌ Erreur lors de la suppression:', error.message);
    if (error.code) {
      console.error(`   Code d'erreur: ${error.code}`);
    }
  } finally {
    await prisma.$disconnect();
  }
}

deleteUser();

