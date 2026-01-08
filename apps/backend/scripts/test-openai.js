const { PrismaClient } = require('@prisma/client');
const OpenAI = require('openai');
const fs = require('fs');
const path = require('path');

// Les variables d'environnement sont déjà chargées par Docker depuis env/.env
// Vérifier directement depuis process.env
console.log('Checking environment variables...');
const relevantVars = Object.keys(process.env).filter(k => k.includes('OPENAI') || k.includes('SYNTHESIS') || k.includes('API'));
console.log('Available env vars:', relevantVars.join(', ') || 'None found');
if (process.env.SYNTHESIS_API_KEY) {
  console.log('✅ Found SYNTHESIS_API_KEY');
}
if (process.env.OPENAI_API_KEY) {
  console.log('✅ Found OPENAI_API_KEY');
}

const prisma = new PrismaClient();

async function testOpenAI() {
  // Accepter OPENAI_API_KEY ou SYNTHESIS_API_KEY
  const apiKey = process.env.OPENAI_API_KEY || process.env.SYNTHESIS_API_KEY;
  
  console.log('DEBUG: OPENAI_API_KEY =', process.env.OPENAI_API_KEY ? 'Found' : 'Not found');
  console.log('DEBUG: SYNTHESIS_API_KEY =', process.env.SYNTHESIS_API_KEY ? 'Found' : 'Not found');
  console.log('DEBUG: apiKey =', apiKey ? 'Found' : 'Not found');
  
  if (!apiKey) {
    console.error('❌ OPENAI_API_KEY or SYNTHESIS_API_KEY not found in environment variables');
    console.log('\nPlease add one of these to env/.env file:');
    console.log('OPENAI_API_KEY=sk-your-api-key-here');
    console.log('or');
    console.log('SYNTHESIS_API_KEY=sk-your-api-key-here');
    process.exit(1);
  }

  console.log('✅ API Key found');
  console.log(`   Key: ${apiKey.substring(0, 7)}...${apiKey.substring(apiKey.length - 4)}`);

  // Test de connexion à OpenAI
  try {
    const openai = new OpenAI({
      apiKey: apiKey,
    });

    console.log('\n🧪 Testing OpenAI API connection...');
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: 'Say "Hello, IZZZI!" in French',
        },
      ],
      max_tokens: 20,
    });

    const response = completion.choices[0]?.message?.content;
    console.log(`✅ OpenAI API connection successful!`);
    console.log(`   Response: ${response}`);

    // Test avec un questionnaire réel
    console.log('\n🧪 Testing with real questionnaire data...');
    const questionnaire = await prisma.questionnaire.findFirst({
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
          take: 10,
        },
      },
    });

    if (!questionnaire) {
      console.log('⚠️  No questionnaire found in database. Run seed first.');
      await prisma.$disconnect();
      return;
    }

    if (questionnaire.responses.length === 0) {
      console.log('⚠️  No responses found for this questionnaire.');
      await prisma.$disconnect();
      return;
    }

    const totalResponses = await prisma.response.count({
      where: { questionnaireId: questionnaire.id },
    });
    const averageRating = questionnaire.responses.reduce((sum, r) => sum + r.rating, 0) / questionnaire.responses.length;

    const comments = questionnaire.responses
      .filter((r) => r.comment)
      .map((r) => ({
        rating: r.rating,
        comment: r.comment,
      }));

    const prompt = `Analyse les retours étudiants suivants et génère une synthèse courte (2-3 phrases) au format JSON.

**Informations sur le cours :**
- Matière : ${questionnaire.subject.name}
- Enseignant : ${questionnaire.subject.teacherName}
- Classe : ${questionnaire.subject.class.name}

**Statistiques :**
- Nombre total de retours : ${totalResponses}
- Score moyen : ${averageRating.toFixed(2)}/5

**Commentaires :**
${comments.length > 0 
  ? comments.slice(0, 5).map((c, i) => `${i + 1}. [${c.rating}/5] ${c.comment}`).join('\n')
  : 'Aucun commentaire disponible'
}

Génère une synthèse au format JSON avec les champs :
- "summary" : Synthèse courte (2-3 phrases)
- "sentiment" : "positive", "neutral" ou "negative"

Réponds uniquement avec le JSON, sans texte supplémentaire.`;

    const testCompletion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Tu es un assistant pédagogique expert. Réponds toujours en français, de manière claire et professionnelle.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    });

    const testResponse = testCompletion.choices[0]?.message?.content;
    const parsedResponse = JSON.parse(testResponse);

    console.log('✅ AI Summary generation test successful!');
    console.log(`   Summary: ${parsedResponse.summary.substring(0, 100)}...`);
    console.log(`   Sentiment: ${parsedResponse.sentiment}`);

    console.log('\n✅ All tests passed! OpenAI integration is working correctly.');
  } catch (error) {
    console.error('❌ Error testing OpenAI API:', error.message);
    if (error.status === 401) {
      console.error('   This usually means the API key is invalid.');
    } else if (error.status === 429) {
      console.error('   Rate limit exceeded. Please try again later.');
    } else {
      console.error('   Full error:', error);
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testOpenAI();

