import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { MailerService } from '../src/mailer/mailer.service';

async function testEmails() {
  console.log('🚀 Démarrage du test des emails IZZZI...\n');

  const app = await NestFactory.createApplicationContext(AppModule);
  const mailerService = app.get(MailerService);


  const testEmail = 'jackmbappekoum@gmail.com';
  
  try {
    
    console.log('📧 Test 1/5: Email de bienvenue...');
    await mailerService.sendWelcomeEmail(testEmail, 'Jean');
    console.log('✅ Email de bienvenue envoyé avec succès!\n');

    await new Promise(resolve => setTimeout(resolve, 2000));

    
    console.log('📧 Test 2/5: Email d\'invitation...');
    await mailerService.sendInvitationEmail(
      testEmail,
      'Admin Test',
      'test-token-123'
    );
    console.log('✅ Email d\'invitation envoyé avec succès!\n');

    await new Promise(resolve => setTimeout(resolve, 2000));

    
    console.log('📧 Test 3/5: Email d\'archivage de classe...');
    await mailerService.sendClassArchivedEmail(testEmail, {
      userName: 'Jean Dupont',
      className: 'Classe de Mathématiques 2024',
      archivedAt: new Date().toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }),
    });
    console.log('✅ Email d\'archivage envoyé avec succès!\n');

    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log('📧 Test 4/5: Email de relance questionnaire...');
    await mailerService.sendQuestionnaireReminderEmail(testEmail, {
      subjectName: 'Analyse Mathématique',
      teacherName: 'Prof. Martin',
      questionnaireUrl: 'http://localhost:3000/retours/test-questionnaire-id',
    });
    console.log('✅ Email de relance questionnaire envoyé avec succès!\n');

    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log('📧 Test 5/5: Email de facturation...');
    await mailerService.sendPaymentInvoiceEmail(testEmail, {
      userName: 'Jean Dupont',
      classCount: 7,
      pricePerClass: 1200, // 12€ en centimes
      totalAmount: 8400, // 84€ en centimes
      billingPeriod: 'ANNUAL',
      invoiceNumber: 'INV-2024-001',
      paymentDate: new Date().toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }),
      invoiceUrl: 'https://stripe.com/invoice/test',
    });
    console.log('✅ Email de facturation envoyé avec succès!\n');

    console.log('🎉 Tous les emails ont été envoyés avec succès!');
    console.log(`📬 Vérifiez votre boîte mail: ${testEmail}\n`);

  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi des emails:', error);
  } finally {
    await app.close();
  }
}

testEmails();
