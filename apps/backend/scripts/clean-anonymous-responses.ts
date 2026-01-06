import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanAnonymousResponses() {
  try {
    const result = await prisma.response.deleteMany({
      where: {
        OR: [
          { studentEmail: 'anonymous@questionnaire.com' },
          { studentEmail: { endsWith: '@questionnaire.com' } }
        ]
      }
    });

    console.log(`✅ ${result.count} réponses anonymes supprimées`);
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanAnonymousResponses();
