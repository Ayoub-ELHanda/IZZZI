import { EmailTemplate } from '../interfaces/email-template.interface';

export interface PasswordResetData {
  resetUrl: string;
}

export class PasswordResetTemplate implements EmailTemplate<PasswordResetData> {
  generate(data: PasswordResetData): string {
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
            min-height: 353px;
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
          .content a {
            color: #2F2E2C !important;
            text-decoration: underline;
            word-break: break-all;
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
          <h2 class="title">Réinitialisation de votre mot de passe</h2>
          <div class="content">
            <p style="margin-top: 0;">Vous avez demandé à réinitialiser votre mot de passe.</p>
            <p>Pour créer un nouveau mot de passe, cliquez sur le lien ci-dessous : <a href="${data.resetUrl}">[Lien de réinitialisation]</a></p>
            <p>Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email. Si vous rencontrez des difficultés, n'hésitez pas à nous contacter à hello@izzzi.io</p>
            <p>À bientôt,<br>L'équipe Izzzi</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}
