import { EmailTemplate } from '../interfaces/email-template.interface';

export interface QuestionnaireReminderData {
  subjectName: string;
  teacherName: string;
  questionnaireUrl: string;
}

export class QuestionnaireReminderTemplate implements EmailTemplate<QuestionnaireReminderData> {
  generate(data: QuestionnaireReminderData): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="color-scheme" content="light only">
        <meta name="supported-color-schemes" content="light only">
        <style>
          /* Mochiy Pop One embedded as base64 - only way to work in emails */
          @font-face {
            font-family: 'Mochiy Pop One';
            font-style: normal;
            font-weight: 400;
            src: url('https://fonts.gstatic.com/s/mochiypopone/v10/QdVPSTA8rLgq6Hw4zYZ-qA0WVhzsTA.woff2') format('woff2');
            font-display: swap;
          }
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
            font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; 
            color: #2F2E2C !important;
            background-color: #F5F5F5 !important;
            margin: 0;
            padding: 20px;
            -webkit-text-size-adjust: 100%;
          }
          .container { 
            width: 451px;
            max-width: 100%;
            min-height: 443px;
            margin: 0 auto;
            padding: 48px;
            background-color: #FFFFFF !important;
            background: #FFFFFF !important;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            box-sizing: border-box;
          }
          .title {
            width: 355px;
            max-width: 100%;
            font-family: 'Mochiy Pop One', 'Arial Black', sans-serif;
            font-size: 18px;
            font-weight: 400;
            font-style: normal;
            color: #2F2E2C !important;
            margin: 0 0 30px 0;
            line-height: 1.3;
          }
          .content {
            width: 355px;
            max-width: 100%;
            font-family: 'Poppins', Arial, sans-serif;
            font-size: 12px;
            font-weight: 400;
            font-style: normal;
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
          <h1 class="title">Un petit retour sur votre cours ${data.subjectName} ?</h1>
          <div class="content">
            <p style="margin-top: 0;">Bonjour,</p>
            <p>Vous avez suivi le cours <strong>${data.subjectName}</strong> avec <strong>${data.teacherName}</strong>.</p>
            <p>Un petit retour de votre part serait super utile pour faire évoluer les choses dans le bon sens.</p>
            <p>Laisser un retour prend moins d'une minute :<br>
            <a href="${data.questionnaireUrl}">Donner mon avis</a></p>
            <p>Votre avis compte, qu'il soit positif ou plus critique.</p>
            <p>Merci pour votre participation à l'amélioration des cours !</p>
            <p>À bientôt,<br>L'équipe Izzzi</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}
