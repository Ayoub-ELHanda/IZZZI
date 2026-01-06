import { EmailTemplate } from '../interfaces/email-template.interface';

export interface ClassArchivedData {
  userName: string;
  className: string;
  archivedAt: string;
  archivedClassesUrl: string;
}

export class ClassArchivedTemplate implements EmailTemplate<ClassArchivedData> {
  generate(data: ClassArchivedData): string {
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
          <h2 class="title">La classe ${data.className} a été archivée.</h2>
          <div class="content">
            <p style="margin-top: 0;">Bonjour,</p>
            <p>La classe <strong>${data.className}</strong> a bien été archivée.</p>
            <p>Cela signifie qu'elle est maintenant clôturée : vous ne recevrez plus de nouveaux retours d'alertes, et elle ne peut plus être modifiée ni réactivée.</p>
            <p>Vous pouvez toujours consulter les retours passés et les statistiques dans la page "classes archivées", en lecture seule : <a href="${data.archivedClassesUrl}">Accéder aux classes archivées</a></p>
            <p>Merci d'avoir utilisé Izzzi pour cette classe !</p>
            <p>À très bientôt,<br>L'équipe Izzzi</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}
