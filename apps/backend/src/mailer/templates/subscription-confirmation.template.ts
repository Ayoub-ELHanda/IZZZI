import { EmailTemplate } from '../interfaces/email-template.interface';

export interface SubscriptionConfirmationData {
  userName: string;
  planName: string;
  classCount: number;
  pricePerClass: number;
  totalAmount: number;
  billingPeriod: string;
  nextBillingDate: string;
  dashboardUrl?: string;
}

export class SubscriptionConfirmationTemplate implements EmailTemplate<SubscriptionConfirmationData> {
  generate(data: SubscriptionConfirmationData): string {
    const billingFrequency = data.billingPeriod === 'ANNUAL' ? 'annuelle' : 'mensuelle';
    const nextBilling = data.billingPeriod === 'ANNUAL' ? 'dans un an' : 'le mois prochain';
    
    return `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif;
            line-height: 1.6; 
            color: #2F2E2C;
            background-color: #f5f5f5;
            margin: 0;
            padding: 0;
          }
          .container { 
            max-width: 600px; 
            margin: 40px auto;
            background-color: #FFFFFF;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          }
          .header {
            background: #FFC107;
            padding: 40px 30px;
            text-align: center;
            color: #2F2E2C;
          }
          .logo {
            font-size: 32px;
            font-weight: bold;
            margin-bottom: 10px;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
          }
          .content {
            padding: 40px 30px;
          }
          .success-icon {
            text-align: center;
            font-size: 64px;
            margin-bottom: 20px;
          }
          .content h2 {
            font-size: 22px;
            font-weight: 600;
            margin: 0 0 20px 0;
            color: #1f2937;
            text-align: center;
          }
          .content p {
            margin: 16px 0;
            font-size: 15px;
            color: #4b5563;
          }
          .plan-details {
            background-color: #f9fafb;
            border-radius: 8px;
            padding: 24px;
            margin: 24px 0;
            border-left: 4px solid #FFC107;
          }
          .plan-details h3 {
            margin: 0 0 16px 0;
            font-size: 18px;
            color: #1f2937;
            font-weight: 600;
          }
          .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #e5e7eb;
          }
          .detail-row:last-child {
            border-bottom: none;
            padding-top: 12px;
            margin-top: 8px;
            font-weight: 600;
            font-size: 16px;
          }
          .detail-label {
            color: #6b7280;
          }
          .detail-value {
            color: #1f2937;
            font-weight: 500;
          }
          .features {
            margin: 24px 0;
          }
          .features h3 {
            font-size: 16px;
            font-weight: 600;
            color: #1f2937;
            margin: 0 0 16px 0;
          }
          .feature-list {
            list-style: none;
            padding: 0;
            margin: 0;
          }
          .feature-list li {
            padding: 8px 0 8px 28px;
            position: relative;
            color: #4b5563;
            font-size: 14px;
          }
          .feature-list li:before {
            content: '✓';
            position: absolute;
            left: 0;
            color: #22c55e;
            font-weight: bold;
            font-size: 16px;
          }
          .button {
            display: inline-block;
            padding: 14px 32px;
            background: #FFC107;
            color: #2F2E2C;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            margin: 24px 0;
            text-align: center;
          }
          .button-container {
            text-align: center;
          }
          .info-box {
            background-color: #fffbeb;
            border-left: 4px solid #FFC107;
            padding: 16px;
            border-radius: 4px;
            margin: 24px 0;
          }
          .info-box p {
            margin: 0;
            font-size: 14px;
            color: #92400e;
          }
          .footer {
            background-color: #f9fafb;
            padding: 24px 30px;
            text-align: center;
            font-size: 13px;
            color: #6b7280;
            border-top: 1px solid #e5e7eb;
          }
          .footer p {
            margin: 8px 0;
          }
          .footer a {
            color: #2F2E2C;
            text-decoration: none;
            font-weight: 600;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">IZZZI</div>
            <h1>Bienvenue dans Super Izzzi ! 🎉</h1>
          </div>
          
          <div class="content">
            <div class="success-icon">✅</div>
            <h2>Votre abonnement est actif !</h2>
            
            <p>Bonjour <strong>${data.userName}</strong>,</p>
            
            <p>Merci d'avoir souscrit à <strong>${data.planName}</strong> ! Votre abonnement a été activé avec succès et vous bénéficiez maintenant de toutes les fonctionnalités premium de IZZZI.</p>
            
            <div class="plan-details">
              <h3>📋 Détails de votre abonnement</h3>
              <div class="detail-row">
                <span class="detail-label">Plan</span>
                <span class="detail-value">${data.planName}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Nombre de classes</span>
                <span class="detail-value">${data.classCount} classe${data.classCount > 1 ? 's' : ''}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Prix par classe</span>
                <span class="detail-value">${(data.pricePerClass / 100).toFixed(2)}€/mois</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Facturation</span>
                <span class="detail-value">Facturation ${billingFrequency}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Total</span>
                <span class="detail-value">${(data.totalAmount / 100).toFixed(2)}€</span>
              </div>
            </div>

            <div class="features">
              <h3>🚀 Ce que vous pouvez faire maintenant :</h3>
              <ul class="feature-list">
                <li>Créer et gérer jusqu'à ${data.classCount} classe${data.classCount > 1 ? 's' : ''} simultanément</li>
                <li>Ajouter un nombre illimité d'élèves</li>
                <li>Créer des questionnaires personnalisés</li>
                <li>Analyser les retours de vos élèves en temps réel</li>
                <li>Exporter vos données et statistiques</li>
                <li>Accéder à toutes les fonctionnalités premium</li>
              </ul>
            </div>

            <div class="info-box">
              <p><strong>💡 Important :</strong> Votre prochain prélèvement aura lieu ${nextBilling} le <strong>${data.nextBillingDate}</strong>. Vous recevrez une facture détaillée à chaque paiement.</p>
            </div>

            <div class="button-container">
              <a href="${data.dashboardUrl || 'http://localhost:3000/dashboard'}" class="button">
                Accéder à mon tableau de bord →
              </a>
            </div>

            <p style="margin-top: 32px;">Vous pouvez gérer votre abonnement à tout moment depuis votre espace personnel dans la section "Mon compte".</p>
            
            <p>Si vous avez des questions ou besoin d'aide, n'hésitez pas à nous contacter à <a href="mailto:contact@izzzi.com" style="color: #6366f1;">contact@izzzi.com</a></p>
          </div>

          <div class="footer">
            <p><strong>Merci de votre confiance !</strong></p>
            <p>L'équipe IZZZI</p>
            <p style="margin-top: 16px;">
              <a href="${data.dashboardUrl || 'http://localhost:3000/dashboard'}">Tableau de bord</a> • 
              <a href="http://localhost:3000/account">Mon compte</a> • 
              <a href="mailto:contact@izzzi.com">Support</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}
