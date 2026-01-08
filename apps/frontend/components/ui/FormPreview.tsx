'use client';

import { Star } from 'lucide-react';

interface FormPreviewProps {
  formType?: string;
}

export function FormPreview({ formType }: FormPreviewProps) {
  
  if (formType === 'basic') {
    return <BasicFormPreview />;
  }

  if (formType === 'technical') {
    return <TechnicalFormPreview />;
  }

  if (formType === 'soft-skills') {
    return <SoftSkillsFormPreview />;
  }

  if (formType === 'logiciel') {
    return <LogicielFormPreview />;
  }

  return <BasicFormPreview />;
}

function BasicFormPreview() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', maxHeight: '580px', overflowY: 'auto' }}>
      <PreviewCard title="Note globale">
        <div style={{ fontFamily: 'Mochiy Pop One, sans-serif', fontSize: '18px', color: '#2F2E2C' }}>
          Globalement, vous avez trouvé ce cours...
        </div>
        <StarRating />
      </PreviewCard>

      <PreviewCard title="Le cours">
        <QuestionSection 
          title="Le contenu du cours"
          options={['Très intéressant', 'Intéressant', 'Peu intéressant']}
          type="radio"
        />
        <QuestionSection 
          title="La durée du cours"
          options={['Trop court', 'Idéal', 'Trop long']}
          type="radio"
        />
      </PreviewCard>

      <PreviewCard title="Intervenant">
        <div style={{ fontFamily: 'Mochiy Pop One, sans-serif', fontSize: '18px', color: '#2F2E2C' }}>
          L'intervenant était...
        </div>
        <StarRating />
        <TextArea label="Commentaires" />
      </PreviewCard>
    </div>
  );
}

function TechnicalFormPreview() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', maxHeight: '580px', overflowY: 'auto' }}>
      <PreviewCard title="Note globale">
        <div style={{ fontFamily: 'Mochiy Pop One, sans-serif', fontSize: '18px', color: '#2F2E2C' }}>
          Ce cours technique était...
        </div>
        <StarRating />
      </PreviewCard>

      <PreviewCard title="Aspects techniques">
        <QuestionSection 
          title="Le ratio théorie/pratique"
          options={['Trop de théorie', 'Équilibré', 'Trop de pratique']}
          type="radio"
        />
        <QuestionSection 
          title="La complexité technique"
          options={['Trop simple', 'Adaptée', 'Trop complexe']}
          type="radio"
        />
        <QuestionSection 
          title="Les exemples pratiques"
          options={['Très utiles', 'Utiles', 'Peu utiles', 'Absents']}
          type="checkbox"
        />
        <QuestionSection 
          title="La progression pédagogique"
          options={['Trop rapide', 'Bien rythmée', 'Trop lente']}
          type="radio"
        />
      </PreviewCard>

      <PreviewCard title="Compétences acquises">
        <QuestionSection 
          title="Vous sentez-vous capable d'appliquer ce que vous avez appris ?"
          options={['Tout à fait', 'En partie', 'Pas vraiment', 'Pas du tout']}
          type="radio"
        />
        <TextArea label="Quels points techniques mériteraient plus d'explications ?" />
      </PreviewCard>

      <PreviewCard title="Intervenant technique">
        <StarRating />
        <QuestionSection 
          title="Maîtrise technique de l'intervenant"
          options={['Excellente', 'Bonne', 'Moyenne', 'Insuffisante']}
          type="radio"
        />
        <TextArea label="Suggestions d'amélioration" />
      </PreviewCard>
    </div>
  );
}

function SoftSkillsFormPreview() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', maxHeight: '580px', overflowY: 'auto' }}>
      <PreviewCard title="Note globale">
        <div style={{ fontFamily: 'Mochiy Pop One, sans-serif', fontSize: '18px', color: '#2F2E2C' }}>
          Cette formation soft skills était...
        </div>
        <StarRating />
      </PreviewCard>

      <PreviewCard title="Impact personnel">
        <QuestionSection 
          title="Cette formation a-t-elle répondu à vos attentes ?"
          options={['Totalement', 'En grande partie', 'Partiellement', 'Pas du tout']}
          type="radio"
        />
        <QuestionSection 
          title="Pensez-vous pouvoir appliquer ces compétences ?"
          options={['Immédiatement', 'Avec de la pratique', 'Difficilement', 'Non']}
          type="radio"
        />
        <QuestionSection 
          title="Quel(s) aspect(s) avez-vous le plus apprécié ?"
          options={['Exercices pratiques', 'Échanges de groupe', 'Apports théoriques', 'Mises en situation']}
          type="checkbox"
        />
      </PreviewCard>

      <PreviewCard title="Ambiance et dynamique">
        <QuestionSection 
          title="L'ambiance du cours"
          options={['Très bienveillante', 'Bienveillante', 'Neutre', 'Tendue']}
          type="radio"
        />
        <QuestionSection 
          title="La participation du groupe"
          options={['Excellente', 'Bonne', 'Moyenne', 'Faible']}
          type="radio"
        />
      </PreviewCard>

      <PreviewCard title="Animateur">
        <StarRating />
        <QuestionSection 
          title="Qualité d'animation"
          options={['Excellente', 'Bonne', 'Moyenne', 'Insuffisante']}
          type="radio"
        />
        <TextArea label="Ce que vous avez le plus apprécié" />
        <TextArea label="Points d'amélioration" />
      </PreviewCard>
    </div>
  );
}

function LogicielFormPreview() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', maxHeight: '580px', overflowY: 'auto' }}>
      <PreviewCard title="Note globale">
        <div style={{ fontFamily: 'Mochiy Pop One, sans-serif', fontSize: '18px', color: '#2F2E2C' }}>
          Cette formation logiciel était...
        </div>
        <StarRating />
      </PreviewCard>

      <PreviewCard title="Apprentissage du logiciel">
        <QuestionSection 
          title="Niveau de difficulté"
          options={['Trop facile', 'Adapté', 'Trop difficile']}
          type="radio"
        />
        <QuestionSection 
          title="Fonctionnalités couvertes"
          options={['Trop basiques', 'Essentielles bien expliquées', 'Trop avancées', 'Manque de détails']}
          type="checkbox"
        />
        <QuestionSection 
          title="Exercices pratiques"
          options={['Très utiles', 'Utiles', 'Peu utiles', 'Absents']}
          type="checkbox"
        />
      </PreviewCard>

      <PreviewCard title="Maîtrise après formation">
        <QuestionSection 
          title="Vous sentez-vous autonome sur ce logiciel ?"
          options={['Totalement', 'En partie', 'Pas vraiment', 'Pas du tout']}
          type="radio"
        />
        <QuestionSection 
          title="Rythme de la formation"
          options={['Trop rapide', 'Bien adapté', 'Trop lent']}
          type="radio"
        />
        <TextArea label="Quelles fonctionnalités auriez-vous aimé approfondir ?" />
      </PreviewCard>

      <PreviewCard title="Formateur">
        <StarRating />
        <QuestionSection 
          title="Maîtrise du logiciel par le formateur"
          options={['Excellente', 'Bonne', 'Moyenne', 'Insuffisante']}
          type="radio"
        />
        <TextArea label="Suggestions pour améliorer la formation" />
      </PreviewCard>
    </div>
  );
}

function PreviewCard({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div style={{
      width: '650px',
      borderRadius: '8px',
      backgroundColor: '#FFFFFF',
      padding: '40px',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
    }}>
      {title && (
        <div style={{
          fontFamily: 'Mochiy Pop One, sans-serif',
          fontWeight: 400,
          fontSize: '28px',
          color: '#2F2E2C',
        }}>
          {title}
        </div>
      )}
      {children}
    </div>
  );
}

function StarRating() {
  return (
    <div style={{ display: 'flex', gap: '12px' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={20}
          color="#D1D1D1"
          fill="none"
          strokeWidth={1.5}
          style={{ width: '24px', height: '24px' }}
        />
      ))}
    </div>
  );
}

function QuestionSection({ title, options, type }: { title: string; options: string[]; type: 'radio' | 'checkbox' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{
        fontFamily: 'Mochiy Pop One, sans-serif',
        fontWeight: 400,
        fontSize: '18px',
        color: '#2F2E2C',
      }}>
        {title}
      </div>
      {options.map((option, index) => (
        <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '20px',
            height: '20px',
            borderRadius: type === 'radio' ? '50%' : '5px',
            backgroundColor: '#EAEAE9',
            flexShrink: 0,
          }} />
          <div style={{
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 400,
            fontSize: '16px',
            color: '#2F2E2C',
          }}>
            {option}
          </div>
        </div>
      ))}
    </div>
  );
}

function TextArea({ label }: { label: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{
        fontFamily: 'Mochiy Pop One, sans-serif',
        fontWeight: 400,
        fontSize: '18px',
        color: '#2F2E2C',
      }}>
        {label}
      </div>
      <div style={{
        width: '100%',
        height: '100px',
        borderRadius: '8px',
        backgroundColor: '#EAEAE9',
      }} />
    </div>
  );
}
