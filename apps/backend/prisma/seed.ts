import { PrismaClient, UserRole, QuestionnaireType, FormType, NotificationType, AlertStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Nettoyer les données existantes (optionnel - commenté pour sécurité)
  // console.log('🧹 Cleaning existing data...');
  // await prisma.response.deleteMany();
  // await prisma.questionnaire.deleteMany();
  // await prisma.subject.deleteMany();
  // await prisma.class.deleteMany();
  // await prisma.user.deleteMany();
  // await prisma.establishment.deleteMany();

  // 1. Créer un établissement
  console.log('📚 Creating establishment...');
  const establishment = await prisma.establishment.upsert({
    where: { id: 'seed-establishment-1' },
    update: {},
    create: {
      id: 'seed-establishment-1',
      name: 'École Supérieure de Test',
      createdBy: 'seed-admin-id', // Sera mis à jour après création de l'admin
    },
  });

  // 2. Créer un Super Admin
  console.log('Creating super admin user...');
  const hashedPassword = await bcrypt.hash('password123', 10);
  const superAdmin = await prisma.user.upsert({
    where: { email: 'superadmin@test.com' },
    update: {},
    create: {
      id: 'seed-superadmin-id',
      email: 'superadmin@test.com',
      password: hashedPassword,
      firstName: 'Super',
      lastName: 'Admin',
      role: UserRole.SUPER_ADMIN,
      isEmailVerified: true,
      isActive: true,
    },
  });

  // 3. Créer un admin
  console.log('Creating admin user...');
  const admin = await prisma.user.upsert({
    where: { email: 'admin@test.com' },
    update: {},
    create: {
      id: 'seed-admin-id',
      email: 'admin@test.com',
      password: hashedPassword,
      firstName: 'Jean',
      lastName: 'Dupont',
      role: UserRole.ADMIN,
      establishmentId: establishment.id,
      isEmailVerified: true,
      isActive: true,
    },
  });

  // Mettre à jour l'établissement avec le bon createdBy
  await prisma.establishment.update({
    where: { id: establishment.id },
    data: { createdBy: admin.id },
  });

  // 4. Créer un responsable pédagogique
  console.log('Creating pedagogical manager...');
  const responsable = await prisma.user.upsert({
    where: { email: 'responsable@test.com' },
    update: {},
    create: {
      id: 'seed-responsable-id',
      email: 'responsable@test.com',
      password: hashedPassword,
      firstName: 'Marie',
      lastName: 'Martin',
      role: UserRole.RESPONSABLE_PEDAGOGIQUE,
      establishmentId: establishment.id,
      isEmailVerified: true,
      isActive: true,
      invitedBy: admin.id,
    },
  });

  // 5. Créer des classes (certaines par l'admin, certaines par le responsable)
  console.log('Creating classes...');
  const classes: any[] = [];
  const classNames = ['L3 Informatique', 'M1 Développement Web', 'M2 Data Science'];
  
  for (let i = 0; i < classNames.length; i++) {
    const className = classNames[i];
    const studentEmails = Array.from({ length: 20 }, (_, j) => `etudiant${i * 20 + j + 1}@test.com`);
    // Alterner entre admin et responsable pour tester les deux cas
    const creatorId = i === 0 ? admin.id : responsable.id;
    
    const classItem = await prisma.class.upsert({
      where: { id: `seed-class-${i + 1}` },
      update: {},
      create: {
        id: `seed-class-${i + 1}`,
        name: className,
        description: `Classe de test : ${className}`,
        studentCount: 20,
        studentEmails: studentEmails,
        createdBy: creatorId,
        establishmentId: establishment.id,
        isArchived: false,
      },
    });
    classes.push(classItem);
  }

  // 5. Créer des matières
  console.log('Creating subjects...');
  const subjects: any[] = [];
  const subjectData = [
    { name: 'UI Design', teacherName: 'Zoé Doe', teacherEmail: 'zoe.doe@test.com' },
    { name: 'Développement React', teacherName: 'Pierre Durand', teacherEmail: 'pierre.durand@test.com' },
    { name: 'Base de données', teacherName: 'Sophie Bernard', teacherEmail: 'sophie.bernard@test.com' },
    { name: 'Algorithmes', teacherName: 'Thomas Petit', teacherEmail: 'thomas.petit@test.com' },
    { name: 'Architecture Logicielle', teacherName: 'Julie Moreau', teacherEmail: 'julie.moreau@test.com' },
  ];

  for (let i = 0; i < subjectData.length; i++) {
    const subjectInfo = subjectData[i];
    const classIndex = i % classes.length;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30 - i * 7); // Début il y a 30+ jours
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 60); // Durée de 60 jours

    const subject = await prisma.subject.upsert({
      where: { id: `seed-subject-${i + 1}` },
      update: {},
      create: {
        id: `seed-subject-${i + 1}`,
        name: subjectInfo.name,
        teacherName: subjectInfo.teacherName,
        teacherEmail: subjectInfo.teacherEmail,
        startDate: startDate,
        endDate: endDate,
        classId: classes[classIndex].id,
        createdBy: responsable.id,
      },
    });
    subjects.push(subject);
  }

  // 6. Créer des questionnaires pour chaque matière
  console.log('Creating questionnaires...');
  const questionnaires: any[] = [];
  const { randomUUID } = await import('crypto');

  for (const subject of subjects) {
    // Questionnaire pendant le cours
    const duringCourseQuestionnaire = await prisma.questionnaire.upsert({
      where: { id: `seed-questionnaire-during-${subject.id}` },
      update: {},
      create: {
        id: `seed-questionnaire-during-${subject.id}`,
        type: QuestionnaireType.DURING_COURSE,
        formType: FormType.BASIC,
        subjectId: subject.id,
        token: randomUUID(),
        isActive: true,
      },
    });

    // Questionnaire fin de cours
    const afterCourseQuestionnaire = await prisma.questionnaire.upsert({
      where: { id: `seed-questionnaire-after-${subject.id}` },
      update: {},
      create: {
        id: `seed-questionnaire-after-${subject.id}`,
        type: QuestionnaireType.AFTER_COURSE,
        formType: FormType.BASIC,
        subjectId: subject.id,
        token: randomUUID(),
        isActive: true,
      },
    });

    questionnaires.push(duringCourseQuestionnaire, afterCourseQuestionnaire);
  }

  // 7. Créer des réponses/retours pour les questionnaires
  console.log('Creating responses...');
  const comments = [
    'Très bon cours, très clair et bien structuré.',
    'Le professeur explique bien mais parfois un peu trop vite.',
    'Excellent ! J\'ai beaucoup appris.',
    'Le cours est intéressant mais manque d\'exemples pratiques.',
    'Parfait, je recommande vivement.',
    'Un peu trop théorique à mon goût.',
    'Super cours, très pédagogique.',
    'Le rythme est bon, les explications sont claires.',
    'Très satisfait du contenu et de la méthode.',
    'Bien mais pourrait être amélioré avec plus d\'exercices.',
    'Excellent intervenant, cours de qualité.',
    'Le cours est bien mais parfois difficile à suivre.',
    'Très bon équilibre théorie/pratique.',
    'Le professeur est passionné et ça se ressent.',
    'Cours intéressant mais un peu long.',
    'Parfait pour débuter dans ce domaine.',
    'Très bon contenu, je recommande.',
    'Le cours est bien structuré et progressif.',
    'Excellent, j\'ai beaucoup appris.',
    'Bien mais manque de cas pratiques.',
  ];

  const testEmails = [
    'etudiant1@test.com',
    'etudiant2@test.com',
    'etudiant3@test.com',
    'etudiant4@test.com',
    'etudiant5@test.com',
  ];

  // Créer des questionnaires avec des scores variés pour générer des alertes
  const questionnaireScores = [
    { index: 0, responseCount: 3, averageRating: 2.5 }, // Peu de retours + score faible
    { index: 1, responseCount: 4, averageRating: 3.2 }, // Peu de retours
    { index: 2, responseCount: 15, averageRating: 2.8 }, // Score faible
    { index: 3, responseCount: 20, averageRating: 4.5 }, // Bon score (alerte positive)
    { index: 4, responseCount: 2, averageRating: 3.0 }, // Très peu de retours
  ];

  for (let qIndex = 0; qIndex < questionnaires.length; qIndex++) {
    const questionnaire = questionnaires[qIndex];
    const scoreConfig = questionnaireScores[qIndex % questionnaireScores.length];
    
    // Générer des réponses avec le score moyen cible
    const responseCount = scoreConfig.responseCount;
    const targetAverage = scoreConfig.averageRating;
    const now = new Date();

    const responses: any[] = [];
    for (let i = 0; i < responseCount; i++) {
      // Générer des notes autour de la moyenne cible
      let rating: number;
      if (targetAverage < 2.5) {
        // Score très faible : majorité de 1 et 2
        rating = Math.random() < 0.6 ? 1 : Math.random() < 0.8 ? 2 : 3;
      } else if (targetAverage < 3.5) {
        // Score faible : mélange de 2, 3, 4
        const rand = Math.random();
        rating = rand < 0.3 ? 2 : rand < 0.7 ? 3 : 4;
      } else if (targetAverage >= 4.5) {
        // Bon score : majorité de 4 et 5
        rating = Math.random() < 0.3 ? 4 : 5;
      } else {
        // Score moyen : distribution normale
        const random = Math.random();
        if (random < 0.1) {
          rating = 1;
        } else if (random < 0.2) {
          rating = 2;
        } else if (random < 0.35) {
          rating = 3;
        } else if (random < 0.7) {
          rating = 4;
        } else {
          rating = 5;
        }
      }

      // 70% des réponses ont un commentaire
      const hasComment = Math.random() < 0.7;
      const comment = hasComment ? comments[Math.floor(Math.random() * comments.length)] : null;

      // Date aléatoire dans les 30 derniers jours
      const daysAgo = Math.floor(Math.random() * 30);
      const createdAt = new Date(now);
      createdAt.setDate(createdAt.getDate() - daysAgo);

      responses.push({
        questionnaireId: questionnaire.id,
        rating,
        comment,
        isAnonymous: Math.random() < 0.8, // 80% anonymes
        studentEmail: Math.random() < 0.3 ? testEmails[Math.floor(Math.random() * testEmails.length)] : null,
        createdAt,
      });
    }

    await prisma.response.createMany({
      data: responses,
      skipDuplicates: true,
    });
  }

  // 8. Créer des alertes pour certains questionnaires avec des scores faibles ou peu de retours
  console.log('Creating alerts...');
  let alertCount = 0;

  for (const questionnaire of questionnaires) {
    // Récupérer les réponses pour calculer le score moyen
    const responses = await prisma.response.findMany({
      where: { questionnaireId: questionnaire.id },
    });

    if (responses.length === 0) continue;

    const totalResponses = responses.length;
    const averageRating = responses.reduce((sum, r) => sum + r.rating, 0) / totalResponses;
    const hasLowRating = averageRating < 3.5;
    const hasLowResponses = totalResponses < 5;
    const hasHighRating = averageRating >= 4.5 && totalResponses >= 5;

    const subject = await prisma.subject.findUnique({
      where: { id: questionnaire.subjectId },
    });

    if (!subject) continue;

    // Créer une alerte négative si les critères sont remplis
    if (hasLowRating || hasLowResponses) {
      const alertType = questionnaire.type === QuestionnaireType.DURING_COURSE
        ? NotificationType.ALERT_POSITIVE
        : NotificationType.ALERT_NEGATIVE;

      let message = '';
      if (hasLowRating && hasLowResponses) {
        message = `Score moyen faible (${averageRating.toFixed(1)}/5) et nombre de retours insuffisant (${totalResponses} retours).`;
      } else if (hasLowRating) {
        message = `Score moyen faible détecté sur le cours ${subject.name} de ${subject.teacherName} (${averageRating.toFixed(1)}/5).`;
      } else if (hasLowResponses) {
        message = `Nombre de retours insuffisant sur le cours ${subject.name} de ${subject.teacherName} (${totalResponses} retours).`;
      }

      // Créer l'alerte pour le créateur de la matière ET pour l'admin (pour que l'admin voie toutes les alertes)
      const userIdsToNotify = [subject.createdBy];
      // Si l'admin n'est pas le créateur, l'ajouter aussi
      if (admin.id !== subject.createdBy) {
        userIdsToNotify.push(admin.id);
      }

      for (const userId of userIdsToNotify) {
        await prisma.alert.upsert({
          where: {
            id: `seed-alert-${questionnaire.id}-${userId}`,
          },
          update: {},
          create: {
            id: `seed-alert-${questionnaire.id}-${userId}`,
            userId: userId,
            questionnaireId: questionnaire.id,
            type: alertType,
            message: message,
            status: AlertStatus.UNTREATED,
          },
        });

        // Créer aussi une notification
        await prisma.notification.upsert({
          where: {
            id: `seed-notification-${questionnaire.id}-${userId}`,
          },
          update: {},
          create: {
            id: `seed-notification-${questionnaire.id}-${userId}`,
            userId: userId,
            type: alertType,
            title: alertType === NotificationType.ALERT_POSITIVE
              ? 'Alerte positive détectée'
              : 'Alerte négative détectée',
            message: message,
            questionnaireId: questionnaire.id,
            isRead: false,
          },
        });
      }

      alertCount += userIdsToNotify.length;
    }

    // Créer une alerte positive pour les bons scores
    if (hasHighRating) {
      const alertType = NotificationType.ALERT_POSITIVE;
      const message = `Excellent score détecté sur le cours ${subject.name} de ${subject.teacherName} (${averageRating.toFixed(1)}/5 avec ${totalResponses} retours).`;

      // Créer l'alerte pour le créateur de la matière ET pour l'admin
      const userIdsToNotify = [subject.createdBy];
      if (admin.id !== subject.createdBy) {
        userIdsToNotify.push(admin.id);
      }

      for (const userId of userIdsToNotify) {
        await prisma.alert.upsert({
          where: {
            id: `seed-alert-positive-${questionnaire.id}-${userId}`,
          },
          update: {},
          create: {
            id: `seed-alert-positive-${questionnaire.id}-${userId}`,
            userId: userId,
            questionnaireId: questionnaire.id,
            type: alertType,
            message: message,
            status: AlertStatus.UNTREATED,
          },
        });

        // Créer aussi une notification
        await prisma.notification.upsert({
          where: {
            id: `seed-notification-positive-${questionnaire.id}-${userId}`,
          },
          update: {},
          create: {
            id: `seed-notification-positive-${questionnaire.id}-${userId}`,
            userId: userId,
            type: alertType,
            title: 'Alerte positive détectée',
            message: message,
            questionnaireId: questionnaire.id,
            isRead: false,
          },
        });
      }

      alertCount += userIdsToNotify.length;
    }
  }

  console.log('Seed completed successfully!');
  console.log('\nSummary:');
  console.log(`- 1 Super Admin: superadmin@test.com / password123`);
  console.log(`- 1 Admin: admin@test.com / password123`);
  console.log(`- 1 Responsable: responsable@test.com / password123`);
  console.log(`- ${classes.length} Classes`);
  console.log(`- ${subjects.length} Matières`);
  console.log(`- ${questionnaires.length} Questionnaires`);
  console.log(`- ~${questionnaires.length * 15} Réponses`);
  console.log(`- ${alertCount} Alertes créées`);
}

main()
  .catch((e) => {
    console.error('Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

