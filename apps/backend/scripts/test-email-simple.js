const nodemailer = require('nodemailer');
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
}

loadEnv();

async function testEmail() {
  console.log('🚀 Test d\'envoi d\'email à elhandaayo@gmail.com...\n');

  const host = process.env.MAIL_HOST || process.env.SMTP_HOST || 'localhost';
  const port = parseInt(process.env.MAIL_PORT || process.env.SMTP_PORT || '1025', 10);
  const mailUser = process.env.MAIL_USER;
  const mailPass = process.env.MAIL_PASS;
  const mailFrom = process.env.MAIL_FROM || process.env.SMTP_FROM || 'IZZZI <noreply@izzzi.io>';

  const isGmail = host.includes('gmail.com');
  const isSecurePort = port === 465;

  console.log('📧 Configuration SMTP:');
  console.log(`   Host: ${host}`);
  console.log(`   Port: ${port}`);
  console.log(`   Secure: ${isSecurePort} (${isSecurePort ? 'SSL' : 'STARTTLS'})`);
  console.log(`   From: ${mailFrom}`);
  console.log(`   User: ${mailUser || 'Non configuré'}\n`);

  const transporterConfig = {
    host: host,
    port: port,
    secure: isSecurePort,
    auth: mailUser
      ? {
          user: mailUser,
          pass: mailPass,
        }
      : undefined,
  };

  // Pour Gmail avec le port 587, activer STARTTLS
  if (isGmail && port === 587) {
    transporterConfig.requireTLS = true;
    transporterConfig.tls = {
      rejectUnauthorized: false,
    };
  }

  // Pour les autres serveurs SMTP avec STARTTLS
  if (!isSecurePort && !isGmail) {
    transporterConfig.requireTLS = true;
  }

  const transporter = nodemailer.createTransport(transporterConfig);

  // Vérifier la connexion SMTP
  try {
    console.log('🔍 Vérification de la connexion SMTP...');
    await transporter.verify();
    console.log('✅ Connexion SMTP réussie!\n');
  } catch (error) {
    console.error('❌ Erreur de connexion SMTP:');
    console.error(`   ${error.message}\n`);
    
    if (isGmail) {
      console.error('💡 Pour Gmail, assurez-vous que:');
      console.error('   1. Vous utilisez un App Password (pas votre mot de passe normal)');
      console.error('   2. La vérification en deux étapes est activée');
      console.error('   3. Créez un App Password: https://myaccount.google.com/apppasswords\n');
    }
    
    process.exit(1);
  }

  // Email de test
  const testEmail = 'elhandaayo@gmail.com';
  const firstName = 'Test';

  const mailOptions = {
    from: mailFrom,
    to: testEmail,
    subject: 'Test d\'inscription - IZZZI',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Bienvenue sur IZZZI</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #ffffff; border-radius: 8px; padding: 40px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h1 style="color: #2F2E2C; font-size: 28px; margin-bottom: 20px;">Bienvenue sur IZZZI, ${firstName} ! 🎉</h1>
            
            <p style="font-size: 16px; margin-bottom: 20px;">
              Merci de vous être inscrit sur IZZZI ! Votre compte a été créé avec succès.
            </p>
            
            <p style="font-size: 16px; margin-bottom: 30px;">
              Vous pouvez maintenant commencer à utiliser notre plateforme pour collecter les retours de vos étudiants.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="http://localhost:3000" style="background-color: #FFD93D; color: #2F2E2C; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                Accéder à votre compte
              </a>
            </div>
            
            <p style="font-size: 14px; color: #666; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
              Si vous n'avez pas créé de compte, vous pouvez ignorer cet email.
            </p>
          </div>
        </body>
      </html>
    `,
  };

  try {
    console.log(`📤 Envoi de l'email à ${testEmail}...`);
    const info = await transporter.sendMail(mailOptions);
    
    console.log('\n✅ Email envoyé avec succès!');
    console.log(`   Message ID: ${info.messageId}`);
    console.log(`   Response: ${info.response}`);
    console.log(`\n📬 Vérifiez votre boîte mail: ${testEmail}`);
    console.log('   (Vérifiez aussi les spams si vous ne le voyez pas)\n');
    
  } catch (error) {
    console.error('\n❌ Erreur lors de l\'envoi de l\'email:');
    console.error(`   ${error.message}`);
    
    if (error.code) {
      console.error(`   Code d'erreur: ${error.code}`);
    }
    
    if (error.command) {
      console.error(`   Commande: ${error.command}`);
    }
    
    if (isGmail) {
      console.error('\n💡 Pour Gmail, vérifiez:');
      console.error('   1. MAIL_HOST=smtp.gmail.com');
      console.error('   2. MAIL_PORT=587');
      console.error('   3. MAIL_USER est votre adresse Gmail complète');
      console.error('   4. MAIL_PASS est un App Password (pas votre mot de passe normal)');
      console.error('   5. La vérification en deux étapes est activée');
      console.error('   6. Créez un App Password: https://myaccount.google.com/apppasswords\n');
    }
    
    process.exit(1);
  }
}

testEmail();

