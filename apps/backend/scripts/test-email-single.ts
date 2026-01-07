import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { MailerService } from '../src/mailer/mailer.service';

async function testSingleEmail() {
  console.log('🚀 Test d\'envoi d\'email à elhandaayo@gmail.com...\n');

  const app = await NestFactory.createApplicationContext(AppModule);
  const mailerService = app.get(MailerService);

  const testEmail = 'elhandaayo@gmail.com';
  const firstName = 'Test';
  
  try {
    console.log('📧 Envoi de l\'email de bienvenue...');
    console.log(`   Destinataire: ${testEmail}`);
    console.log(`   Prénom: ${firstName}\n`);
    
    await mailerService.sendWelcomeEmail(testEmail, firstName);
    
    console.log('\n✅ Email envoyé avec succès!');
    console.log(`📬 Vérifiez votre boîte mail: ${testEmail}`);
    console.log('   (Vérifiez aussi les spams si vous ne le voyez pas)\n');

  } catch (error: any) {
    console.error('\n❌ Erreur lors de l\'envoi de l\'email:');
    console.error(`   ${error.message || error}`);
    
    if (error.code) {
      console.error(`   Code d'erreur: ${error.code}`);
    }
    
    if (error.command) {
      console.error(`   Commande: ${error.command}`);
    }
    
    console.error('\n💡 Vérifications à faire:');
    console.error('   1. Vérifiez que MAIL_HOST=smtp.gmail.com dans votre .env');
    console.error('   2. Vérifiez que MAIL_PORT=587 dans votre .env');
    console.error('   3. Vérifiez que MAIL_USER est votre adresse Gmail');
    console.error('   4. Vérifiez que MAIL_PASS est un App Password Gmail (pas votre mot de passe normal)');
    console.error('   5. Assurez-vous que la vérification en deux étapes est activée sur votre compte Gmail');
    console.error('   6. Créez un App Password: https://myaccount.google.com/apppasswords\n');
    
    process.exit(1);
  } finally {
    await app.close();
  }
}

testSingleEmail();

