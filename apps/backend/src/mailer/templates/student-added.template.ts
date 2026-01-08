import { EmailTemplate } from '../interfaces/email-template.interface';

export interface StudentAddedData {
  className: string;
  teacherName: string;
  studentCount: number;
}

export class StudentAddedTemplate implements EmailTemplate<StudentAddedData> {
  generate(data: StudentAddedData): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="color-scheme" content="light only">
        <meta name="supported-color-schemes" content="light only">
        <style>
          * {
            color-scheme: light only !important;
          }
          body { 
            font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; 
            line-height: 1.6; 
            color: #2F2E2C !important;
            background-color: #F5F5F5 !important;
            margin: 0;
            padding: 20px;
            -webkit-text-size-adjust: 100%;
          }
          .container { 
            width: 451px;
            max-width: 100%;
            min-height: 453px;
            margin: 0 auto;
            padding: 30px;
            background-color: #FFFFFF !important;
            background: #FFFFFF !important;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          }
          .content h2 {
            font-family: 'Poppins', sans-serif;
            font-size: 18px;
            font-weight: 400;
            color: #2F2E2C !important;
            margin: 0 0 20px 0;
          }
          .content p {
            font-family: 'Poppins', sans-serif;
            font-size: 12px;
            font-weight: 400;
            color: #2F2E2C !important;
            line-height: 1.6;
            margin: 0 0 12px 0;
          }
          .content strong {
            font-weight: 600;
            color: #2F2E2C !important;
          }
          .footer {
            margin-top: 24px;
            font-family: 'Poppins', sans-serif;
            font-size: 12px;
            font-weight: 400;
            color: #2F2E2C !important;
          }
          .footer p {
            margin: 0;
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
          <div class="content">
            <h2>Bienvenue ! 👋</h2>
            <p>Bonjour,</p>
            <p>Vous avez été ajouté à une classe par <strong>${data.teacherName}</strong>.</p>
            <p><strong>📚 Nom de la classe :</strong> ${data.className}<br>
            <strong>👥 Nombre d'étudiants :</strong> ${data.studentCount}</p>
            <p><strong>À quoi sert IZZZI ?</strong></p>
            <p>IZZZI est une plateforme qui permet de recueillir vos retours sur les cours de manière simple et anonyme.</p>
            <p>Vous recevrez régulièrement des questionnaires pour donner votre avis sur les matières de cette classe. Vos retours sont importants pour améliorer la qualité de l'enseignement.</p>
            <p><strong>🔒 Votre anonymat est garanti.</strong> Vos réponses resteront confidentielles et ne seront jamais associées à votre identité.</p>
            <div class="footer">
              <p>À bientôt,<br><strong>L'équipe Izzzi</strong></p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}
