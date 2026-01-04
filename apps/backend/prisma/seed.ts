import { PrismaClient, UserRole, QuestionnaireType, FormType } from '@prisma/client';
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

  // 2. Créer un admin
  console.log('👤 Creating admin user...');
  const hashedPassword = await bcrypt.hash('password123', 10);
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

  // 3. Créer un responsable pédagogique
  console.log('👨‍🏫 Creating pedagogical manager...');
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

  // 4. Créer des classes (certaines par l'admin, certaines par le responsable)
  console.log('🏫 Creating classes...');
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
  console.log('📖 Creating subjects...');
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
  console.log('📝 Creating questionnaires...');
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
  console.log('💬 Creating responses...');
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

  for (const questionnaire of questionnaires) {
    // Générer entre 10 et 25 réponses par questionnaire
    const responseCount = Math.floor(Math.random() * 16) + 10;
    const now = new Date();

    const responses: any[] = [];
    for (let i = 0; i < responseCount; i++) {
      // Distribution réaliste des notes
      const random = Math.random();
      let rating: number;
      if (random < 0.1) {
        rating = 1; // 10%
      } else if (random < 0.2) {
        rating = 2; // 10%
      } else if (random < 0.35) {
        rating = 3; // 15%
      } else if (random < 0.7) {
        rating = 4; // 35%
      } else {
        rating = 5; // 30%
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

  console.log('✅ Seed completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`- 1 Admin: admin@test.com / password123`);
  console.log(`- 1 Responsable: responsable@test.com / password123`);
  console.log(`- ${classes.length} Classes`);
  console.log(`- ${subjects.length} Matières`);
  console.log(`- ${questionnaires.length} Questionnaires`);
  console.log(`- ~${questionnaires.length * 15} Réponses`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

