import { EmailTemplate } from '../interfaces/email-template.interface';

export interface InvitationConfirmationData {
  invitedEmail: string;
}

export class InvitationConfirmationTemplate implements EmailTemplate<InvitationConfirmationData> {
  generate(data: InvitationConfirmationData): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="color-scheme" content="light only">
        <meta name="supported-color-schemes" content="light only">
        <style>
          @font-face {
            font-family: 'Poppins';
            font-style: normal;
            font-weight: 400;
            src: url('https://fonts.gstatic.com/s/poppins/v20/pxiEyp8kv8JHgFVrJJfecg.woff2') format('woff2');
            font-display: swap;
          }
          @font-face {
            font-family: 'Poppins';
            font-style: normal;
            font-weight: 600;
            src: url('https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLEj6Z1xlFQ.woff2') format('woff2');
            font-display: swap;
          }
          
          * {
            color-scheme: light only !important;
          }
          body { 
            font-family: 'Poppins', Arial, sans-serif; 
            color: #2F2E2C !important;
            background-color: #F5F5F5 !important;
            margin: 0;
            padding: 20px;
            -webkit-text-size-adjust: 100%;
          }
          .container { 
            width: 451px;
            max-width: 100%;
            min-height: 345px;
            margin: 0 auto;
            padding: 48px;
            background-color: #FFFFFF !important;
            background: #FFFFFF !important;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            box-sizing: border-box;
          }
          .title {
            font-family: 'Poppins', Arial, sans-serif;
            font-size: 18px;
            font-weight: 600;
            color: #2F2E2C !important;
            margin: 0 0 30px 0;
            line-height: 1.3;
          }
          .content {
            font-family: 'Poppins', Arial, sans-serif;
            font-size: 12px;
            font-weight: 400;
            color: #2F2E2C !important;
            line-height: 1.6;
          }
          .content p {
            margin: 0 0 16px 0;
            color: #2F2E2C !important;
          }
          .content p:first-child {
            margin-top: 0;
          }
          .content strong {
            font-weight: 600;
            color: #2F2E2C !important;
          }
          
          /* Force light mode */
          @media (prefers-color-scheme: dark) {
            body {
              background-color: #F5F5F5 !important;
            }
            .container {
              background-color: #FFFFFF !important;
              background: #FFFFFF !important;
            }
            * {
              color: #2F2E2C !important;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h2 class="title">Invitation envoyée avec succès</h2>
          <div class="content">
            <p style="margin-top: 0;">Bonjour,</p>
            <p>Votre invitation a bien été envoyée à <strong>${data.invitedEmail}</strong></p>
            <p>Dès qu'il ou elle aura rejoint la plateforme, vous pourrez partager des classes et suivre ensemble les retours étudiants.</p>
            <p>Merci d'utiliser Izzzi pour faire avancer la pédagogie !</p>
            <p>À bientôt,<br>L'équipe Izzzi</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}
