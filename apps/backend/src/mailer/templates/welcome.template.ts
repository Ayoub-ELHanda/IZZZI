import { EmailTemplate } from '../interfaces/email-template.interface';

export interface WelcomeData {
  dashboardUrl: string;
}

export class WelcomeTemplate implements EmailTemplate<WelcomeData> {
  generate(data: WelcomeData): string {
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
            min-height: 425px;
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
          <h2 class="title">Bonjour,<br>Bienvenue sur Izzzi !</h2>
          <div class="content">
            <p style="margin-top: 0;">Vous pouvez dès maintenant créer vos classes, recueillir les retours de vos étudiants, et suivre la qualité pédagogique de vos cours en un clin d'œil.</p>
            <p>Pour commencer, il vous suffit de vous connecter ici : <a href="${data.dashboardUrl}">Se connecter à Izzzi</a></p>
            <p>Besoin d'un coup de pouce ?<br>Notre petite FAQ est là pour vous aider.</p>
            <p>Et si vous avez une question, écrivez-nous, on vous répond vite !</p>
            <p>À très bientôt,<br>L'équipe Izzzi</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}
