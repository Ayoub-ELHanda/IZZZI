const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testAlertUpdate() {
  try {
    console.log('🔍 Recherche du questionnaire "Architecture Logicielle"...');
    
    // Trouver le questionnaire "Architecture Logicielle"
    const questionnaire = await prisma.questionnaire.findFirst({
      where: {
        subject: {
          name: 'Architecture Logicielle',
        },
      },
      include: {
        subject: {
          include: {
            class: {
              select: {
                studentEmails: true,
              },
            },
          },
        },
        responses: {
          select: {
            id: true,
            rating: true,
            createdAt: true,
          },
        },
        alerts: {
          select: {
            id: true,
            message: true,
            status: true,
            updatedAt: true,
            createdAt: true,
          },
        },
      },
    });

    if (!questionnaire) {
      console.error('❌ Questionnaire "Architecture Logicielle" non trouvé');
      return;
    }

    console.log(`✅ Questionnaire trouvé: ${questionnaire.id}`);
    console.log(`   Token: ${questionnaire.token}`);
    console.log(`   Nombre de retours actuels: ${questionnaire.responses.length}`);
    console.log(`   Nombre d'alertes: ${questionnaire.alerts.length}`);
    
    if (questionnaire.alerts.length > 0) {
      console.log(`   Dernière alerte: ${questionnaire.alerts[0].message}`);
      console.log(`   Statut: ${questionnaire.alerts[0].status}`);
    }

    // Générer un email unique pour le test
    const testEmail = `test-${Date.now()}@questionnaire.com`;
    const testRating = 2; // Note faible pour déclencher une alerte

    console.log(`\n📝 Soumission d'un nouveau retour...`);
    console.log(`   Email: ${testEmail}`);
    console.log(`   Note: ${testRating}/5`);

    // Soumettre le retour via l'API
    const response = await fetch(
      `http://localhost:4000/api/questionnaires/public/${questionnaire.token}/submit`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: testEmail,
          rating: testRating,
          comment: 'Test de mise à jour des alertes en temps réel',
          isAnonymous: true,
        }),
      }
    );

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(`Erreur API: ${JSON.stringify(responseData)}`);
    }

    console.log(`\n✅ Retour soumis avec succès!`);
    console.log(`   Réponse: ${JSON.stringify(responseData, null, 2)}`);

    // Attendre un peu pour que l'alerte soit mise à jour
    console.log(`\n⏳ Attente de 2 secondes pour la mise à jour de l'alerte...`);
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Vérifier l'alerte mise à jour
    const updatedAlert = await prisma.alert.findFirst({
      where: {
        questionnaireId: questionnaire.id,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    if (updatedAlert) {
      console.log(`\n📊 Alerte mise à jour:`);
      console.log(`   Message: ${updatedAlert.message}`);
      console.log(`   Statut: ${updatedAlert.status}`);
      console.log(`   Dernière mise à jour: ${updatedAlert.updatedAt}`);
    } else {
      console.log(`\n⚠️  Aucune alerte trouvée après la soumission`);
    }

    // Vérifier le nombre total de retours
    const totalResponses = await prisma.response.count({
      where: {
        questionnaireId: questionnaire.id,
      },
    });

    console.log(`\n📈 Nombre total de retours: ${totalResponses}`);

  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
    if (error.response) {
      console.error('   Détails:', error.response.data);
    }
  } finally {
    await prisma.$disconnect();
  }
}

testAlertUpdate();

