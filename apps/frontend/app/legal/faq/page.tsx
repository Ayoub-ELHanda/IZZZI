'use client';

import { useState } from 'react';

export default function FAQPage() {
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('Usage');

  const toggleQuestion = (id: string) => {
    setOpenQuestion(openQuestion === id ? null : id);
  };

  const frequentQuestions = [
    {
      id: 'q1',
      question: 'À quoi sert Izzzi ?',
      answer: `Izzzi est une plateforme pensée pour les enseignants et responsables pédagogiques. Elle permet de recueillir facilement des retours anonymes d'étudiants, pendant et après les cours. Son objectif : améliorer en continu la qualité pédagogique grâce à des retours structurés et exploitables.`
    },
    {
      id: 'q2',
      question: 'Quelle est la différence entre une "matière" et une "classe" ?',
      answer: `Une classe correspond à un groupe d'étudiants.
Une matière est un enseignement, associé à un intervenant. Une même classe peut regrouper plusieurs matières.`
    },
    {
      id: 'q3',
      question: 'Que peut-on faire avec les retours ?',
      answer: `Tous les retours sont centralisés dans un dashboard clair et interactif. Vous pouvez :
• les filtrer par matière ou type de réponse,
• les exporter en un clic,
• générer un QR code pour faciliter l'accès au formulaire,
• relancer les étudiants depuis la plateforme,
• recevoir des alertes automatiques en cas de signaux faibles (positifs ou négatifs) dans les retours.`
    },
    {
      id: 'q4',
      question: 'Les retours sont-ils vraiment anonymes ?',
      answer: `Oui. Par défaut, tous les retours sont anonymes. Dans l'offre Super Izzzi, l'étudiant peut toutefois choisir de lever l'anonymat s'il le souhaite pour un message.`
    }
  ];

  const otherQuestions = {
    'Usage': [
      {
        id: 'usage1',
        question: 'À quoi sert Izzzi ?',
        answer: `Izzzi est une plateforme pensée pour les enseignants et responsables pédagogiques. Elle permet de recueillir facilement des retours anonymes d'étudiants, pendant et après les cours. Son objectif : améliorer en continu la qualité pédagogique grâce à des retours structurés et exploitables.`
      }
    ],
    'Fonctionnalités': [
      {
        id: 'fonc1',
        question: 'Peut-on modifier les questionnaires ?',
        answer: `Pas encore. Pour l'instant, les questionnaires sont standards pour garantir une cohérence dans l'analyse. Ils s'adaptent automatiquement selon qu'ils sont envoyés pendant le cours ou à la fin. La personnalisation des questionnaires est prévue prochainement.`
      }
    ],
    'Données & confidentialité': [],
    'Gestion administrative': []
  };

  return (
    <div className="bg-white min-h-screen">
      <section className="bg-[#F4F4F4] pt-32 pb-16">
        <div className="max-w-3xl mx-auto px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
            Comment peut-on vous aider ?
          </h1>
          <div className="relative">
            <input
              type="text"
              placeholder="Tapez votre recherche ici!"
              className="w-full px-6 py-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
            />
            <button className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM18 18l-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </section>
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Questions fréquentes</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {frequentQuestions.map((item) => (
              <div
                key={item.id}
                className="bg-[#F4F4F4] rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => toggleQuestion(item.id)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-100 transition-colors"
                >
                  <span className="font-semibold text-gray-900 pr-4">{item.question}</span>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={`flex-shrink-0 transition-transform ${openQuestion === item.id ? 'rotate-180' : ''}`}
                  >
                    <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                {openQuestion === item.id && item.answer && (
                  <div className="px-6 pb-5 pt-0">
                    <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                      {item.answer}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Autres questions</h2>
          <div className="flex gap-6 mb-8 border-b border-gray-200">
            {Object.keys(otherQuestions).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 px-1 font-semibold transition-colors relative ${
                  activeTab === tab
                    ? 'text-gray-900'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"></div>
                )}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {otherQuestions[activeTab as keyof typeof otherQuestions].map((item) => (
              <div
                key={item.id}
                className="bg-[#F4F4F4] rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => toggleQuestion(item.id)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-100 transition-colors"
                >
                  <span className="font-semibold text-gray-900 pr-4">{item.question}</span>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={`flex-shrink-0 transition-transform ${openQuestion === item.id ? 'rotate-180' : ''}`}
                  >
                    <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                {openQuestion === item.id && item.answer && (
                  <div className="px-6 pb-5 pt-0">
                    <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                      {item.answer}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
