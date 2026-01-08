'use client';

import { useState, useEffect } from 'react';
import { Star, ArrowUpRight, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface QuestionnaireFormProps {
  token: string;
  formType?: string;
}

export function QuestionnaireForm({ token, formType }: QuestionnaireFormProps) {
  const [hasAlreadyResponded, setHasAlreadyResponded] = useState(false);

  useEffect(() => {
    const responded = localStorage.getItem(`questionnaire_responded_${token}`);
    if (responded === 'true') {
      setHasAlreadyResponded(true);
    }
  }, [token]);

  if (hasAlreadyResponded) {
    return <SuccessMessage />;
  }

  if (formType === 'BASIC' || formType === 'basic') {
    return <BasicForm token={token} setHasAlreadyResponded={setHasAlreadyResponded} />;
  }

  if (formType === 'TECHNICAL' || formType === 'technical') {
    return <TechnicalForm token={token} setHasAlreadyResponded={setHasAlreadyResponded} />;
  }

  if (formType === 'SOFT_SKILLS' || formType === 'soft-skills') {
    return <SoftSkillsForm token={token} setHasAlreadyResponded={setHasAlreadyResponded} />;
  }

  if (formType === 'LOGICIEL' || formType === 'logiciel') {
    return <LogicielForm token={token} setHasAlreadyResponded={setHasAlreadyResponded} />;
  }

  return <BasicForm token={token} setHasAlreadyResponded={setHasAlreadyResponded} />;
}

function SuccessMessage() {
  return (
    <div
      style={{
        width: '100%',
        maxWidth: '650px',
        borderRadius: '8px',
        backgroundColor: '#FFFFFF',
        padding: '40px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '24px',
        textAlign: 'center',
      }}
    >
      <CheckCircle size={64} color="#4CAF50" strokeWidth={1.5} />
      <div style={{ fontFamily: 'Mochiy Pop One, sans-serif', fontSize: '24px', color: '#2F2E2C' }}>
        Merci pour votre retour !
      </div>
      <div style={{ fontFamily: 'Poppins, sans-serif', fontSize: '16px', color: '#6B6B6B', lineHeight: '1.6' }}>
        Vous avez déjà répondu à ce questionnaire. Votre avis a bien été pris en compte.
      </div>
    </div>
  );
}

function BasicForm({ token, setHasAlreadyResponded }: { token: string; setHasAlreadyResponded: (value: boolean) => void }) {
  const [globalRating, setGlobalRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [contenuCours, setContenuCours] = useState('');
  const [dureeCours, setDureeCours] = useState('');
  const [intervenantRating, setIntervenantRating] = useState(0);
  const [intervenantHoveredStar, setIntervenantHoveredStar] = useState(0);
  const [commentaires, setCommentaires] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (globalRating === 0) {
      toast.error('Veuillez donner une note globale au cours');
      return;
    }
    await submitForm(token, globalRating, { contenuCours, dureeCours, intervenantRating, commentaires }, setIsSubmitting, setHasAlreadyResponded);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
        <FormCard>
          <QuestionTitle>Globalement, vous avez trouvé ce cours...</QuestionTitle>
          <StarInput value={globalRating} hoveredValue={hoveredStar} onChange={setGlobalRating} onHover={setHoveredStar} />
        </FormCard>

        <FormCard>
          <SectionTitle>Le cours</SectionTitle>
          <RadioQuestion
            title="Le contenu du cours"
            options={['Très intéressant', 'Intéressant', 'Peu intéressant']}
            value={contenuCours}
            onChange={setContenuCours}
          />
          <RadioQuestion
            title="La durée du cours"
            options={['Trop court', 'Idéal', 'Trop long']}
            value={dureeCours}
            onChange={setDureeCours}
          />
        </FormCard>

        <FormCard>
          <SectionTitle>Intervenant</SectionTitle>
          <QuestionTitle>L'intervenant était...</QuestionTitle>
          <StarInput value={intervenantRating} hoveredValue={intervenantHoveredStar} onChange={setIntervenantRating} onHover={setIntervenantHoveredStar} />
          <TextAreaQuestion label="Commentaires" value={commentaires} onChange={setCommentaires} />
        </FormCard>

        <SubmitButton isSubmitting={isSubmitting} />
      </div>
    </form>
  );
}

function TechnicalForm({ token, setHasAlreadyResponded }: { token: string; setHasAlreadyResponded: (value: boolean) => void }) {
  const [globalRating, setGlobalRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [ratioTheoriePratique, setRatioTheoriePratique] = useState('');
  const [complexiteTechnique, setComplexiteTechnique] = useState('');
  const [exemplesPratiques, setExemplesPratiques] = useState<string[]>([]);
  const [progressionPedagogique, setProgressionPedagogique] = useState('');
  const [capableAppliquer, setCapableAppliquer] = useState('');
  const [pointsTechniques, setPointsTechniques] = useState('');
  const [intervenantRating, setIntervenantRating] = useState(0);
  const [intervenantHoveredStar, setIntervenantHoveredStar] = useState(0);
  const [maitriseTechnique, setMaitriseTechnique] = useState('');
  const [suggestions, setSuggestions] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (globalRating === 0) {
      toast.error('Veuillez donner une note globale au cours');
      return;
    }
    await submitForm(token, globalRating, {
      ratioTheoriePratique, complexiteTechnique, exemplesPratiques, progressionPedagogique,
      capableAppliquer, pointsTechniques, intervenantRating, maitriseTechnique, suggestions
    }, setIsSubmitting, setHasAlreadyResponded);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
        <FormCard>
          <QuestionTitle>Ce cours technique était...</QuestionTitle>
          <StarInput value={globalRating} hoveredValue={hoveredStar} onChange={setGlobalRating} onHover={setHoveredStar} />
        </FormCard>

        <FormCard>
          <SectionTitle>Aspects techniques</SectionTitle>
          <RadioQuestion
            title="Le ratio théorie/pratique"
            options={['Trop de théorie', 'Équilibré', 'Trop de pratique']}
            value={ratioTheoriePratique}
            onChange={setRatioTheoriePratique}
          />
          <RadioQuestion
            title="La complexité technique"
            options={['Trop simple', 'Adaptée', 'Trop complexe']}
            value={complexiteTechnique}
            onChange={setComplexiteTechnique}
          />
          <CheckboxQuestion
            title="Les exemples pratiques"
            options={['Très utiles', 'Utiles', 'Peu utiles', 'Absents']}
            values={exemplesPratiques}
            onChange={setExemplesPratiques}
          />
          <RadioQuestion
            title="La progression pédagogique"
            options={['Trop rapide', 'Bien rythmée', 'Trop lente']}
            value={progressionPedagogique}
            onChange={setProgressionPedagogique}
          />
        </FormCard>

        <FormCard>
          <SectionTitle>Compétences acquises</SectionTitle>
          <RadioQuestion
            title="Vous sentez-vous capable d'appliquer ce que vous avez appris ?"
            options={['Tout à fait', 'En partie', 'Pas vraiment', 'Pas du tout']}
            value={capableAppliquer}
            onChange={setCapableAppliquer}
          />
          <TextAreaQuestion
            label="Quels points techniques mériteraient plus d'explications ?"
            value={pointsTechniques}
            onChange={setPointsTechniques}
          />
        </FormCard>

        <FormCard>
          <SectionTitle>Intervenant technique</SectionTitle>
          <StarInput value={intervenantRating} hoveredValue={intervenantHoveredStar} onChange={setIntervenantRating} onHover={setIntervenantHoveredStar} />
          <RadioQuestion
            title="Maîtrise technique de l'intervenant"
            options={['Excellente', 'Bonne', 'Moyenne', 'Insuffisante']}
            value={maitriseTechnique}
            onChange={setMaitriseTechnique}
          />
          <TextAreaQuestion label="Suggestions d'amélioration" value={suggestions} onChange={setSuggestions} />
        </FormCard>

        <SubmitButton isSubmitting={isSubmitting} />
      </div>
    </form>
  );
}

function SoftSkillsForm({ token, setHasAlreadyResponded }: { token: string; setHasAlreadyResponded: (value: boolean) => void }) {
  const [globalRating, setGlobalRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [reponduAttentes, setReponduAttentes] = useState('');
  const [appliquerCompetences, setAppliquerCompetences] = useState('');
  const [aspectsApprecies, setAspectsApprecies] = useState<string[]>([]);
  const [ambianceCours, setAmbianceCours] = useState('');
  const [participationGroupe, setParticipationGroupe] = useState('');
  const [intervenantRating, setIntervenantRating] = useState(0);
  const [intervenantHoveredStar, setIntervenantHoveredStar] = useState(0);
  const [qualiteAnimation, setQualiteAnimation] = useState('');
  const [plusAppreciie, setPlusAppreciie] = useState('');
  const [ameliorations, setAmeliorations] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (globalRating === 0) {
      toast.error('Veuillez donner une note globale');
      return;
    }
    await submitForm(token, globalRating, {
      reponduAttentes, appliquerCompetences, aspectsApprecies, ambianceCours,
      participationGroupe, intervenantRating, qualiteAnimation, plusAppreciie, ameliorations
    }, setIsSubmitting, setHasAlreadyResponded);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
        <FormCard>
          <QuestionTitle>Cette formation soft skills était...</QuestionTitle>
          <StarInput value={globalRating} hoveredValue={hoveredStar} onChange={setGlobalRating} onHover={setHoveredStar} />
        </FormCard>

        <FormCard>
          <SectionTitle>Impact personnel</SectionTitle>
          <RadioQuestion
            title="Cette formation a-t-elle répondu à vos attentes ?"
            options={['Totalement', 'En grande partie', 'Partiellement', 'Pas du tout']}
            value={reponduAttentes}
            onChange={setReponduAttentes}
          />
          <RadioQuestion
            title="Pensez-vous pouvoir appliquer ces compétences ?"
            options={['Immédiatement', 'Avec de la pratique', 'Difficilement', 'Non']}
            value={appliquerCompetences}
            onChange={setAppliquerCompetences}
          />
          <CheckboxQuestion
            title="Quel(s) aspect(s) avez-vous le plus apprécié ?"
            options={['Exercices pratiques', 'Échanges de groupe', 'Apports théoriques', 'Mises en situation']}
            values={aspectsApprecies}
            onChange={setAspectsApprecies}
          />
        </FormCard>

        <FormCard>
          <SectionTitle>Ambiance et dynamique</SectionTitle>
          <RadioQuestion
            title="L'ambiance du cours"
            options={['Très bienveillante', 'Bienveillante', 'Neutre', 'Tendue']}
            value={ambianceCours}
            onChange={setAmbianceCours}
          />
          <RadioQuestion
            title="La participation du groupe"
            options={['Excellente', 'Bonne', 'Moyenne', 'Faible']}
            value={participationGroupe}
            onChange={setParticipationGroupe}
          />
        </FormCard>

        <FormCard>
          <SectionTitle>Animateur</SectionTitle>
          <StarInput value={intervenantRating} hoveredValue={intervenantHoveredStar} onChange={setIntervenantRating} onHover={setIntervenantHoveredStar} />
          <RadioQuestion
            title="Qualité d'animation"
            options={['Excellente', 'Bonne', 'Moyenne', 'Insuffisante']}
            value={qualiteAnimation}
            onChange={setQualiteAnimation}
          />
          <TextAreaQuestion label="Ce que vous avez le plus apprécié" value={plusAppreciie} onChange={setPlusAppreciie} />
          <TextAreaQuestion label="Points d'amélioration" value={ameliorations} onChange={setAmeliorations} />
        </FormCard>

        <SubmitButton isSubmitting={isSubmitting} />
      </div>
    </form>
  );
}

function LogicielForm({ token, setHasAlreadyResponded }: { token: string; setHasAlreadyResponded: (value: boolean) => void }) {
  const [globalRating, setGlobalRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [niveauDifficulte, setNiveauDifficulte] = useState('');
  const [fonctionnalitesCouvertes, setFonctionnalitesCouvertes] = useState<string[]>([]);
  const [exercicesPratiques, setExercicesPratiques] = useState<string[]>([]);
  const [autonomieLogiciel, setAutonomieLogiciel] = useState('');
  const [rythmeFormation, setRythmeFormation] = useState('');
  const [fonctionnalitesApprofondir, setFonctionnalitesApprofondir] = useState('');
  const [intervenantRating, setIntervenantRating] = useState(0);
  const [intervenantHoveredStar, setIntervenantHoveredStar] = useState(0);
  const [maitriseLogiciel, setMaitriseLogiciel] = useState('');
  const [suggestions, setSuggestions] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (globalRating === 0) {
      toast.error('Veuillez donner une note globale');
      return;
    }
    await submitForm(token, globalRating, {
      niveauDifficulte, fonctionnalitesCouvertes, exercicesPratiques, autonomieLogiciel,
      rythmeFormation, fonctionnalitesApprofondir, intervenantRating, maitriseLogiciel, suggestions
    }, setIsSubmitting, setHasAlreadyResponded);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
        <FormCard>
          <QuestionTitle>Cette formation logiciel était...</QuestionTitle>
          <StarInput value={globalRating} hoveredValue={hoveredStar} onChange={setGlobalRating} onHover={setHoveredStar} />
        </FormCard>

        <FormCard>
          <SectionTitle>Apprentissage du logiciel</SectionTitle>
          <RadioQuestion
            title="Niveau de difficulté"
            options={['Trop facile', 'Adapté', 'Trop difficile']}
            value={niveauDifficulte}
            onChange={setNiveauDifficulte}
          />
          <CheckboxQuestion
            title="Fonctionnalités couvertes"
            options={['Trop basiques', 'Essentielles bien expliquées', 'Trop avancées', 'Manque de détails']}
            values={fonctionnalitesCouvertes}
            onChange={setFonctionnalitesCouvertes}
          />
          <CheckboxQuestion
            title="Exercices pratiques"
            options={['Très utiles', 'Utiles', 'Peu utiles', 'Absents']}
            values={exercicesPratiques}
            onChange={setExercicesPratiques}
          />
        </FormCard>

        <FormCard>
          <SectionTitle>Maîtrise après formation</SectionTitle>
          <RadioQuestion
            title="Vous sentez-vous autonome sur ce logiciel ?"
            options={['Totalement', 'En partie', 'Pas vraiment', 'Pas du tout']}
            value={autonomieLogiciel}
            onChange={setAutonomieLogiciel}
          />
          <RadioQuestion
            title="Rythme de la formation"
            options={['Trop rapide', 'Bien adapté', 'Trop lent']}
            value={rythmeFormation}
            onChange={setRythmeFormation}
          />
          <TextAreaQuestion
            label="Quelles fonctionnalités auriez-vous aimé approfondir ?"
            value={fonctionnalitesApprofondir}
            onChange={setFonctionnalitesApprofondir}
          />
        </FormCard>

        <FormCard>
          <SectionTitle>Formateur</SectionTitle>
          <StarInput value={intervenantRating} hoveredValue={intervenantHoveredStar} onChange={setIntervenantRating} onHover={setIntervenantHoveredStar} />
          <RadioQuestion
            title="Maîtrise du logiciel par le formateur"
            options={['Excellente', 'Bonne', 'Moyenne', 'Insuffisante']}
            value={maitriseLogiciel}
            onChange={setMaitriseLogiciel}
          />
          <TextAreaQuestion label="Suggestions pour améliorer la formation" value={suggestions} onChange={setSuggestions} />
        </FormCard>

        <SubmitButton isSubmitting={isSubmitting} />
      </div>
    </form>
  );
}

// COMPOSANTS RÉUTILISABLES
function FormCard({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      width: '100%',
      maxWidth: '650px',
      borderRadius: '8px',
      backgroundColor: '#FFFFFF',
      padding: '40px',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
    }}>
      {children}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontFamily: 'Mochiy Pop One, sans-serif',
      fontWeight: 400,
      fontSize: '28px',
      color: '#2F2E2C',
    }}>
      {children}
    </div>
  );
}

function QuestionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontFamily: 'Mochiy Pop One, sans-serif',
      fontWeight: 400,
      fontSize: '18px',
      color: '#2F2E2C',
    }}>
      {children}
    </div>
  );
}

function StarInput({ value, hoveredValue, onChange, onHover }: {
  value: number;
  hoveredValue: number;
  onChange: (value: number) => void;
  onHover: (value: number) => void;
}) {
  return (
    <div style={{ display: 'flex', gap: '12px' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={20}
          color="#FFD93D"
          fill={star <= (hoveredValue || value) ? '#FFD93D' : 'none'}
          strokeWidth={1.5}
          style={{ width: '28px', height: '28px', cursor: 'pointer', transition: 'all 0.2s' }}
          onMouseEnter={() => onHover(star)}
          onMouseLeave={() => onHover(0)}
          onClick={() => onChange(star)}
        />
      ))}
    </div>
  );
}

function RadioQuestion({ title, options, value, onChange }: {
  title: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <QuestionTitle>{title}</QuestionTitle>
      {options.map((option) => (
        <div
          key={option}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
          onClick={() => onChange(option)}
        >
          <div style={{
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            backgroundColor: value === option ? '#FFD93D' : '#EAEAE9',
            border: value === option ? '2px solid #2F2E2C' : 'none',
            flexShrink: 0,
            transition: 'all 0.2s',
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

function CheckboxQuestion({ title, options, values, onChange }: {
  title: string;
  options: string[];
  values: string[];
  onChange: (values: string[]) => void;
}) {
  const toggleValue = (option: string) => {
    if (values.includes(option)) {
      onChange(values.filter((v) => v !== option));
    } else {
      onChange([...values, option]);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <QuestionTitle>{title}</QuestionTitle>
      {options.map((option) => (
        <div
          key={option}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
          onClick={() => toggleValue(option)}
        >
          <div style={{
            width: '20px',
            height: '20px',
            borderRadius: '5px',
            backgroundColor: values.includes(option) ? '#FFD93D' : '#EAEAE9',
            border: values.includes(option) ? '2px solid #2F2E2C' : 'none',
            flexShrink: 0,
            transition: 'all 0.2s',
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

function TextAreaQuestion({ label, value, onChange }: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <QuestionTitle>{label}</QuestionTitle>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Vos commentaires..."
        style={{
          width: '100%',
          minHeight: '110px',
          borderRadius: '8px',
          backgroundColor: '#EAEAE9',
          border: 'none',
          padding: '12px 16px',
          fontFamily: 'Poppins, sans-serif',
          fontSize: '16px',
          resize: 'vertical',
          outline: 'none',
        }}
      />
    </div>
  );
}

function SubmitButton({ isSubmitting }: { isSubmitting: boolean }) {
  return (
    <div style={{
      width: '100%',
      maxWidth: '650px',
      display: 'flex',
      justifyContent: 'center',
      paddingTop: '20px',
    }}>
      <button
        type="submit"
        disabled={isSubmitting}
        style={{
          width: '160.29px',
          height: '56px',
          backgroundColor: isSubmitting ? '#D1D1D1' : '#FFD93D',
          color: '#2F2E2C',
          fontFamily: 'Mochiy Pop One, sans-serif',
          fontSize: '18px',
          paddingLeft: '26px',
          borderRadius: '8px',
          border: 'none',
          cursor: isSubmitting ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '1.99px',
        }}
      >
        {isSubmitting ? 'Envoi...' : (
          <>
            Envoyer
            <ArrowUpRight size={20} strokeWidth={2} />
          </>
        )}
      </button>
    </div>
  );
}

// FONCTION DE SOUMISSION
async function submitForm(
  token: string,
  rating: number,
  data: any,
  setIsSubmitting: (value: boolean) => void,
  setHasAlreadyResponded: (value: boolean) => void
) {
  setIsSubmitting(true);

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api';

    let baseId = localStorage.getItem('anonymous_base_id');
    if (!baseId) {
      baseId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('anonymous_base_id', baseId);
    }

    const questionnaireSpecificId = `anonymous_${baseId}_${token.substring(0, 8)}`;

    const responses = {
      email: `${questionnaireSpecificId}@questionnaire.com`,
      rating,
      isAnonymous: true,
      comment: JSON.stringify(data),
    };

    const response = await fetch(`${apiUrl}/questionnaires/public/${token}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(responses),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur lors de la soumission');
    }

    localStorage.setItem(`questionnaire_responded_${token}`, 'true');
    toast.success('Merci pour votre retour !');
    setHasAlreadyResponded(true);
  } catch (error: any) {
    toast.error(error.message || 'Erreur lors de la soumission');
  } finally {
    setIsSubmitting(false);
  }
}
