import { EmailTemplate } from '../interfaces/email-template.interface';

export interface PaymentInvoiceData {
  userName: string;
  classCount: number;
  pricePerClass: number;
  totalAmount: number;
  billingPeriod: string;
  invoiceUrl?: string;
  invoiceNumber?: string;
  paymentDate: string;
}

export class PaymentInvoiceTemplate implements EmailTemplate<PaymentInvoiceData> {
  generate(data: PaymentInvoiceData): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { 
            font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; 
            line-height: 1.6; 
            color: #2F2E2C;
            background-color: #FFFFFF;
            margin: 0;
            padding: 0;
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            padding: 40px 30px;
          }
          .logo-container {
            text-align: center;
            margin-bottom: 30px;
          }
          .logo {
            background: #2F2E2C;
            border-radius: 50%;
            width: 60px;
            height: 60px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            color: #FFFFFF;
            font-size: 24px;
            font-weight: bold;
          }
          .logo-text {
            color: #2F2E2C;
            font-family: 'Poppins', sans-serif;
            font-size: 20px;
            font-weight: 600;
            margin-left: 10px;
          }
          .content {
            font-size: 14px;
            color: #2F2E2C;
            line-height: 1.8;
          }
          .content h2 {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 16px;
          }
          .link {
            color: #2F2E2C;
            text-decoration: underline;
          }
          .footer {
            margin-top: 32px;
            font-size: 14px;
            color: #2F2E2C;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo-container">
            <div class="logo">▶</div>
            <span class="logo-text">izzzi</span>
          </div>
          
          <div class="content">
            <h2>Votre abonnement à Super Izzzi est confirmé !</h2>
            <p>Bonjour,</p>
            <p>Votre souscription au plan Super Izzzi a bien été prise en compte.</p>
            <p>Vous bénéficiez désormais de l'ensemble des fonctionnalités illimitées de la plateforme.</p>
            <p>Vous pouvez gérer votre abonnement à tout moment via votre espace Stripe : <a href="${data.invoiceUrl || '#'}" class="link">Gérer mon abonnement</a></p>
            <p>Cette classe sera automatiquement prise en compte dans votre abonnement actuel de <strong>${data.classCount}</strong> classe${data.classCount > 1 ? 's' : ''} ou votre prochain ajustement de + [Montant €] /mois aura lieu sur votre prochaine facture.</p>
            <p>Merci pour votre confiance !</p>
            <p>Et comme toujours, si vous avez une question, une suggestion ou un souci, nous sommes là pour vous répondre.</p>
            <div class="footer">
              <p>À bientôt,<br>L'équipe Izzzi</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}
