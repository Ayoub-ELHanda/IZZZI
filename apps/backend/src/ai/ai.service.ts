import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { PrismaService } from '../prisma/prisma.service';

export interface FeedbackSummary {
  summary: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  strengths: string[];
  improvements: string[];
  pedagogicalAlerts: string[];
}

export interface AIStatistics {
  theoryPracticeRatio: {
    theory: number;
    practice: number;
  };
  teachingSpeed: {
    tooSlow: number;
    justRight: number;
    tooFast: number;
  };
  insights: string[];
  recommendations: string[];
  trendAnalysis: string;
}

@Injectable()
export class AIService {
  private readonly logger = new Logger(AIService.name);
  private openai: OpenAI | null = null;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    // Accepter OPENAI_API_KEY ou SYNTHESIS_API_KEY
    const apiKey = this.configService.get<string>('OPENAI_API_KEY') || 
                   this.configService.get<string>('SYNTHESIS_API_KEY');
    if (apiKey) {
      this.openai = new OpenAI({
        apiKey: apiKey,
      });
      this.logger.log('OpenAI service initialized');
    } else {
      this.logger.warn('OPENAI_API_KEY or SYNTHESIS_API_KEY not configured. AI features will be disabled.');
    }
  }

  /**
   * Générer une synthèse AI des retours pour un questionnaire
   * Retourne la synthèse existante si elle existe, sinon en génère une nouvelle
   */
  async generateFeedbackSummary(questionnaireId: string, forceRegenerate: boolean = false): Promise<FeedbackSummary> {
    // Vérifier si une synthèse existe déjà
    if (!forceRegenerate) {
      const existingSummary = await this.prisma.feedbackSummary.findUnique({
        where: { questionnaireId },
      });

      if (existingSummary) {
        this.logger.log(`Returning existing summary for questionnaire ${questionnaireId}`);
        return {
          summary: existingSummary.summary,
          sentiment: existingSummary.sentiment as 'positive' | 'neutral' | 'negative',
          strengths: existingSummary.strengths,
          improvements: existingSummary.improvements,
          pedagogicalAlerts: existingSummary.pedagogicalAlerts,
        };
      }
    }

    if (!this.openai) {
      throw new Error('OpenAI API key not configured');
    }

    // Récupérer le questionnaire avec toutes les réponses
    const questionnaire = await this.prisma.questionnaire.findUnique({
      where: { id: questionnaireId },
      include: {
        subject: {
          include: {
            class: {
              select: {
                name: true,
                studentCount: true,
              },
            },
          },
        },
        responses: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!questionnaire) {
      throw new Error('Questionnaire not found');
    }

    if (questionnaire.responses.length === 0) {
      return {
        summary: 'Aucun retour disponible pour générer une synthèse.',
        sentiment: 'neutral',
        strengths: [],
        improvements: [],
        pedagogicalAlerts: [],
      };
    }

    // Calculer les statistiques
    const totalResponses = questionnaire.responses.length;
    const averageRating = questionnaire.responses.reduce((sum, r) => sum + r.rating, 0) / totalResponses;
    const ratingDistribution = [1, 2, 3, 4, 5].map((rating) => ({
      rating,
      count: questionnaire.responses.filter((r) => r.rating === rating).length,
    }));

    // Préparer les données pour l'IA
    const comments = questionnaire.responses
      .filter((r) => r.comment)
      .map((r) => ({
        rating: r.rating,
        comment: r.comment,
      }));

    const courseInfo = {
      subjectName: questionnaire.subject.name,
      teacherName: questionnaire.subject.teacherName,
      className: questionnaire.subject.class.name,
      studentCount: questionnaire.subject.class.studentCount,
      questionnaireType: questionnaire.type,
    };

    // Construire le prompt pour OpenAI
    const prompt = this.buildPrompt(courseInfo, totalResponses, averageRating, ratingDistribution, comments);

    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `Tu es un assistant pédagogique expert dans l'analyse de retours étudiants. 
            Tu analyses les retours pour identifier les tendances, points forts, axes d'amélioration et alertes pédagogiques.
            Réponds toujours en français, de manière claire et professionnelle.`,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        response_format: { type: 'json_object' },
      });

      const responseContent = completion.choices[0]?.message?.content;
      if (!responseContent) {
        throw new Error('No response from OpenAI');
      }

      const parsedResponse = JSON.parse(responseContent);
      
      const feedbackSummary: FeedbackSummary = {
        summary: parsedResponse.summary || 'Synthèse non disponible',
        sentiment: parsedResponse.sentiment || 'neutral',
        strengths: parsedResponse.strengths || [],
        improvements: parsedResponse.improvements || [],
        pedagogicalAlerts: parsedResponse.pedagogicalAlerts || [],
      };

      // Stocker la synthèse en base de données
      await this.prisma.feedbackSummary.upsert({
        where: { questionnaireId },
        update: {
          summary: feedbackSummary.summary,
          sentiment: feedbackSummary.sentiment,
          strengths: feedbackSummary.strengths,
          improvements: feedbackSummary.improvements,
          pedagogicalAlerts: feedbackSummary.pedagogicalAlerts,
          updatedAt: new Date(),
        },
        create: {
          questionnaireId,
          summary: feedbackSummary.summary,
          sentiment: feedbackSummary.sentiment,
          strengths: feedbackSummary.strengths,
          improvements: feedbackSummary.improvements,
          pedagogicalAlerts: feedbackSummary.pedagogicalAlerts,
        },
      });

      this.logger.log(`Feedback summary saved for questionnaire ${questionnaireId}`);
      
      return feedbackSummary;
    } catch (error) {
      this.logger.error('Error generating AI summary:', error);
      throw new Error('Failed to generate AI summary');
    }
  }

  /**
   * Générer des statistiques IA pour la page des retours
   */
  async generateStatistics(questionnaireId: string): Promise<AIStatistics> {
    if (!this.openai) {
      throw new Error('OpenAI API key not configured');
    }

    // Récupérer le questionnaire avec toutes les réponses
    const questionnaire = await this.prisma.questionnaire.findUnique({
      where: { id: questionnaireId },
      include: {
        subject: {
          include: {
            class: {
              select: {
                name: true,
                studentCount: true,
              },
            },
          },
        },
        responses: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!questionnaire) {
      throw new Error('Questionnaire not found');
    }

    if (questionnaire.responses.length === 0) {
      return {
        theoryPracticeRatio: { theory: 50, practice: 50 },
        teachingSpeed: { tooSlow: 0, justRight: 0, tooFast: 0 },
        insights: [],
        recommendations: [],
        trendAnalysis: 'Aucun retour disponible pour générer des statistiques.',
      };
    }

    // Calculer les statistiques de base
    const totalResponses = questionnaire.responses.length;
    const averageRating = questionnaire.responses.reduce((sum, r) => sum + r.rating, 0) / totalResponses;

    // Extraire les commentaires et analyser le contenu JSON si présent
    const comments = questionnaire.responses
      .filter((r) => r.comment)
      .map((r) => {
        try {
          const parsed = JSON.parse(r.comment || '{}');
          return {
            rating: r.rating,
            comment: r.comment,
            parsed,
          };
        } catch {
          return {
            rating: r.rating,
            comment: r.comment,
            parsed: null,
          };
        }
      });

    const prompt = this.buildStatisticsPrompt(
      questionnaire.subject.name,
      questionnaire.subject.teacherName,
      totalResponses,
      averageRating,
      comments,
    );

    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `Tu es un expert en analyse pédagogique. Tu analyses les retours étudiants pour extraire des statistiques précises sur le ratio théorie/pratique, la vitesse d'enseignement, et générer des insights et recommandations. Réponds toujours en français, de manière claire et professionnelle.`,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        response_format: { type: 'json_object' },
      });

      const responseContent = completion.choices[0]?.message?.content;
      if (!responseContent) {
        throw new Error('No response from OpenAI');
      }

      const parsedResponse = JSON.parse(responseContent);

      return {
        theoryPracticeRatio: parsedResponse.theoryPracticeRatio || { theory: 50, practice: 50 },
        teachingSpeed: parsedResponse.teachingSpeed || { tooSlow: 0, justRight: 100, tooFast: 0 },
        insights: parsedResponse.insights || [],
        recommendations: parsedResponse.recommendations || [],
        trendAnalysis: parsedResponse.trendAnalysis || 'Analyse non disponible',
      };
    } catch (error) {
      this.logger.error('Error generating AI statistics:', error);
      throw new Error('Failed to generate AI statistics');
    }
  }

  private buildStatisticsPrompt(
    subjectName: string,
    teacherName: string,
    totalResponses: number,
    averageRating: number,
    comments: any[],
  ): string {
    // Extraire les données structurées des commentaires JSON
    const theoryPracticeData = comments
      .filter((c) => c.parsed && c.parsed.ratioTheoriePratique)
      .map((c) => c.parsed.ratioTheoriePratique);

    const speedData = comments
      .filter((c) => c.parsed && c.parsed.rythmeCheckboxes)
      .map((c) => c.parsed.rythmeCheckboxes);

    return `Analyse les retours étudiants suivants et génère des statistiques précises au format JSON.

**Informations sur le cours :**
- Matière : ${subjectName}
- Enseignant : ${teacherName}
- Nombre total de retours : ${totalResponses}
- Score moyen : ${averageRating.toFixed(2)}/5

**Données structurées disponibles :**
${theoryPracticeData.length > 0 
  ? `- Ratio Théorie/Pratique : ${JSON.stringify(theoryPracticeData)}`
  : '- Ratio Théorie/Pratique : Données non disponibles'
}
${speedData.length > 0 
  ? `- Rythme/Vitesse : ${JSON.stringify(speedData)}`
  : '- Rythme/Vitesse : Données non disponibles'
}

**Commentaires textuels :**
${comments.slice(0, 20).map((c, i) => `${i + 1}. [${c.rating}/5] ${c.comment}`).join('\n') || 'Aucun commentaire disponible'}

**Tâche :**
Génère des statistiques au format JSON avec les champs suivants :
- "theoryPracticeRatio" : Un objet avec "theory" (pourcentage 0-100) et "practice" (pourcentage 0-100) basé sur l'analyse des commentaires et données structurées
- "teachingSpeed" : Un objet avec "tooSlow" (%), "justRight" (%), "tooFast" (%) basé sur l'analyse des retours
- "insights" : Un tableau de 3-5 insights clés tirés de l'analyse
- "recommendations" : Un tableau de 3-5 recommandations concrètes pour améliorer le cours
- "trendAnalysis" : Une analyse courte (2-3 phrases) des tendances observées dans les retours

Réponds uniquement avec le JSON, sans texte supplémentaire.`;
  }

  private buildPrompt(
    courseInfo: any,
    totalResponses: number,
    averageRating: number,
    ratingDistribution: any[],
    comments: any[],
  ): string {
    return `Analyse les retours étudiants suivants et génère une synthèse complète au format JSON.

**Informations sur le cours :**
- Matière : ${courseInfo.subjectName}
- Enseignant : ${courseInfo.teacherName}
- Classe : ${courseInfo.className}
- Nombre d'étudiants : ${courseInfo.studentCount}
- Type de questionnaire : ${courseInfo.questionnaireType === 'DURING_COURSE' ? 'Pendant le cours' : 'Fin de cours'}

**Statistiques des retours :**
- Nombre total de retours : ${totalResponses}
- Score moyen : ${averageRating.toFixed(2)}/5
- Distribution des notes :
  ${ratingDistribution.map((d) => `  - ${d.rating} étoiles : ${d.count} retours`).join('\n')}

**Commentaires des étudiants :**
${comments.length > 0 
  ? comments.map((c, i) => `${i + 1}. [${c.rating}/5] ${c.comment}`).join('\n')
  : 'Aucun commentaire disponible'
}

**Tâche :**
Génère une analyse complète au format JSON avec les champs suivants :
- "summary" : Une synthèse courte et claire (2-3 paragraphes) qui résume les retours, identifie les tendances principales et interprète le score moyen
- "sentiment" : "positive", "neutral" ou "negative" selon la tonalité globale
- "strengths" : Un tableau de 3-5 points forts identifiés dans les retours
- "improvements" : Un tableau de 3-5 axes d'amélioration suggérés
- "pedagogicalAlerts" : Un tableau d'alertes pédagogiques si des problèmes sont détectés (ex: "Score faible nécessitant une attention", "Peu de retours pour une classe complète")

Réponds uniquement avec le JSON, sans texte supplémentaire.`;
  }

  /**
   * Générer toutes les statistiques IA pour un questionnaire
   */
  async generateAllStatistics(questionnaireId: string): Promise<any> {
    if (!this.openai) {
      throw new Error('OpenAI API key not configured');
    }

    // Récupérer le questionnaire avec toutes les réponses
    const questionnaire = await this.prisma.questionnaire.findUnique({
      where: { id: questionnaireId },
      include: {
        subject: {
          include: {
            class: {
              select: {
                name: true,
                studentCount: true,
              },
            },
          },
        },
        responses: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!questionnaire) {
      throw new Error('Questionnaire not found');
    }

    if (questionnaire.responses.length === 0) {
      return this.getEmptyStatistics();
    }

    const prompt = this.buildAllStatisticsPrompt(questionnaire, questionnaire.responses);

    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `Tu es un expert en analyse pédagogique. Tu analyses les retours étudiants pour générer des statistiques précises et complètes sur tous les aspects d'un cours. Réponds toujours en français, de manière claire et professionnelle.`,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        response_format: { type: 'json_object' },
      });

      const responseContent = completion.choices[0]?.message?.content;
      if (!responseContent) {
        throw new Error('No response from OpenAI');
      }

      const parsedResponse = JSON.parse(responseContent);

      // Stocker les statistiques en base de données
      await this.prisma.questionnaireStatistics.upsert({
        where: { questionnaireId },
        update: {
          temporalRatingData: parsedResponse.temporalRatingData || null,
          temporalSatisfactionData: parsedResponse.temporalSatisfactionData || null,
          overallRatingDistribution: parsedResponse.overallRatingDistribution || null,
          theoryPracticeRatio: parsedResponse.theoryPracticeRatio || null,
          courseAtmosphere: parsedResponse.courseAtmosphere || null,
          courseHours: parsedResponse.courseHours || null,
          contentRelevance: parsedResponse.contentRelevance || null,
          clarityDistribution: parsedResponse.clarityDistribution || null,
          teachingSpeed: parsedResponse.teachingSpeed || null,
          strongPoints: parsedResponse.strongPoints || null,
          weakPoints: parsedResponse.weakPoints || null,
          updatedAt: new Date(),
        },
        create: {
          questionnaireId,
          temporalRatingData: parsedResponse.temporalRatingData || null,
          temporalSatisfactionData: parsedResponse.temporalSatisfactionData || null,
          overallRatingDistribution: parsedResponse.overallRatingDistribution || null,
          theoryPracticeRatio: parsedResponse.theoryPracticeRatio || null,
          courseAtmosphere: parsedResponse.courseAtmosphere || null,
          courseHours: parsedResponse.courseHours || null,
          contentRelevance: parsedResponse.contentRelevance || null,
          clarityDistribution: parsedResponse.clarityDistribution || null,
          teachingSpeed: parsedResponse.teachingSpeed || null,
          strongPoints: parsedResponse.strongPoints || null,
          weakPoints: parsedResponse.weakPoints || null,
        },
      });

      this.logger.log(`All statistics generated and saved for questionnaire ${questionnaireId}`);
      
      return parsedResponse;
    } catch (error) {
      this.logger.error('Error generating all statistics:', error);
      throw new Error('Failed to generate all statistics');
    }
  }

  private buildAllStatisticsPrompt(questionnaire: any, responses: any[]): string {
    const totalResponses = responses.length;
    const averageRating = responses.reduce((sum, r) => sum + r.rating, 0) / totalResponses;
    
    const comments = responses
      .filter((r) => r.comment)
      .map((r) => ({
        rating: r.rating,
        comment: r.comment,
        createdAt: r.createdAt,
      }));

    return `Analyse les retours étudiants suivants et génère TOUTES les statistiques au format JSON.

**Informations sur le cours :**
- Matière : ${questionnaire.subject.name}
- Enseignant : ${questionnaire.subject.teacherName}
- Nombre total de retours : ${totalResponses}
- Score moyen : ${averageRating.toFixed(2)}/5

**Commentaires des étudiants :**
${comments.slice(0, 50).map((c, i) => `${i + 1}. [${c.rating}/5] ${c.comment} (${new Date(c.createdAt).toLocaleDateString('fr-FR')})`).join('\n') || 'Aucun commentaire disponible'}

**Tâche :**
Génère un JSON complet avec les champs suivants :

1. "temporalRatingData" : Tableau d'objets {date: string, rating: number} pour le graphique "Globalement vous avez trouvé ce cours" (rating de 0 à 20)
2. "temporalSatisfactionData" : Tableau d'objets {date: string, satisfaction: number} pour le graphique "Évolution de la satisfaction moyenne" (satisfaction de 0 à 100%)
3. "overallRatingDistribution" : Tableau d'objets {rating: number, count: number} pour la distribution des notes 1-5
4. "theoryPracticeRatio" : Objet {theory: number, practice: number} en pourcentages (0-100)
5. "courseAtmosphere" : Objet {sympa: number, detendue: number, froide: number} en pourcentages
6. "courseHours" : Objet {parfait: number, trop: number, pasAssez: number} en pourcentages
7. "contentRelevance" : Objet {commeImaginais: number, rienAVoirTop: number, rienAVoirNul: number} en pourcentages
8. "clarityDistribution" : Tableau d'objets {rating: number, count: number} pour la clarté (notes 1-5)
9. "teachingSpeed" : Objet {juste: number, tropLent: number, tropRapide: number} en pourcentages
10. "strongPoints" : Tableau de strings (points forts extraits des commentaires positifs)
11. "weakPoints" : Tableau de strings (points faibles extraits des commentaires négatifs)

Réponds uniquement avec le JSON, sans texte supplémentaire.`;
  }

  private getEmptyStatistics() {
    return {
      temporalRatingData: [],
      temporalSatisfactionData: [],
      overallRatingDistribution: [{rating: 1, count: 0}, {rating: 2, count: 0}, {rating: 3, count: 0}, {rating: 4, count: 0}, {rating: 5, count: 0}],
      theoryPracticeRatio: { theory: 50, practice: 50 },
      courseAtmosphere: { sympa: 0, detendue: 0, froide: 0 },
      courseHours: { parfait: 0, trop: 0, pasAssez: 0 },
      contentRelevance: { commeImaginais: 0, rienAVoirTop: 0, rienAVoirNul: 0 },
      clarityDistribution: [{rating: 1, count: 0}, {rating: 2, count: 0}, {rating: 3, count: 0}, {rating: 4, count: 0}, {rating: 5, count: 0}],
      teachingSpeed: { juste: 0, tropLent: 0, tropRapide: 0 },
      strongPoints: [],
      weakPoints: [],
    };
  }
}

