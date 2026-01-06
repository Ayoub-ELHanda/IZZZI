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

  const [globalRating, setGlobalRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
 
  const [ratioTheoriePratique, setRatioTheoriePratique] = useState('');
  const [rythmeCheckboxes, setRythmeCheckboxes] = useState<string[]>([]);
  const [pertinenceInfos, setPertinenceInfos] = useState<string[]>([]);
  

  const [intervenantRating, setIntervenantRating] = useState(0);
  const [intervenantHoveredStar, setIntervenantHoveredStar] = useState(0);
  const [pedagogieIntervenant, setPedagogieIntervenant] = useState('');
  const [disponibiliteIntervenant, setDisponibiliteIntervenant] = useState<string[]>([]);
  const [ameliorations, setAmeliorations] = useState('');
  const [commentairesLibres, setCommentairesLibres] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

   
    if (globalRating === 0) {
      toast.error('Veuillez donner une note globale au cours');
      return;
    }

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
        rating: globalRating,
        isAnonymous: true,
        comment: JSON.stringify({
          ratioTheoriePratique,
          rythmeCheckboxes,
          pertinenceInfos,
          intervenantRating,
          pedagogieIntervenant,
          disponibiliteIntervenant,
          ameliorations,
          commentairesLibres,
        }),
      };

      const response = await fetch(`${apiUrl}/questionnaires/public/${token}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(responses),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de la soumission');
      }

      localStorage.setItem(`questionnaire_responded_${token}`, 'true');
      
      toast.success('Merci pour votre retour ! ');
 
      setHasAlreadyResponded(true);
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la soumission');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCheckboxChange = (
    value: string,
    currentValues: string[],
    setter: (values: string[]) => void
  ) => {
    if (currentValues.includes(value)) {
      setter(currentValues.filter((v) => v !== value));
    } else {
      setter([...currentValues, value]);
    }
  };

  if (hasAlreadyResponded) {
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
        <div
          style={{
            fontFamily: 'Mochiy Pop One, sans-serif',
            fontSize: '24px',
            color: '#2F2E2C',
          }}
        >
          Merci pour votre retour !
        </div>
        <div
          style={{
            fontFamily: 'Poppins, sans-serif',
            fontSize: '16px',
            color: '#6B6B6B',
            lineHeight: '1.6',
          }}
        >
          Vous avez déjà répondu à ce questionnaire. Votre avis a bien été pris en compte et sera utilisé pour améliorer les cours.
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          width: '100%',
        }}
      >
    
        <div
          style={{
            width: '100%',
            maxWidth: '650px',
            borderRadius: '8px',
            backgroundColor: '#FFFFFF',
            padding: '40px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          <div
            style={{
              fontFamily: 'Mochiy Pop One, sans-serif',
              fontWeight: 400,
              fontSize: '18px',
              color: '#2F2E2C',
            }}
          >
            Globalement, vous avez trouvé ce cours...
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={20}
                color="#FFD93D"
                fill={
                  star <= (hoveredStar || globalRating) ? '#FFD93D' : 'none'
                }
                strokeWidth={1.5}
                style={{
                  width: '28px',
                  height: '28px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={() => setHoveredStar(star)}
                onMouseLeave={() => setHoveredStar(0)}
                onClick={() => setGlobalRating(star)}
              />
            ))}
          </div>
        </div>

        <div
          style={{
            width: '100%',
            maxWidth: '650px',
            borderRadius: '8px',
            backgroundColor: '#FFFFFF',
            padding: '40px',
            display: 'flex',
            flexDirection: 'column',
            gap: '40px',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div
              style={{
                fontFamily: 'Mochiy Pop One, sans-serif',
                fontWeight: 400,
                fontSize: '32px',
                color: '#2F2E2C',
              }}
            >
              Le cours
            </div>

            <div
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 400,
                fontSize: '16px',
                color: '#2F2E2C',
              }}
            >
              Juste quelques questions sur le cours
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div
              style={{
                fontFamily: 'Mochiy Pop One, sans-serif',
                fontWeight: 400,
                fontSize: '18px',
                color: '#2F2E2C',
              }}
            >
              Le ratio théorie/pratique
            </div>

            {['Trop de théorie', 'Juste comme il faut', 'Trop de pratique'].map((option) => (
              <div
                key={option}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                }}
                onClick={() => setRatioTheoriePratique(option)}
              >
                <div
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    backgroundColor:
                      ratioTheoriePratique === option ? '#FFD93D' : '#EAEAE9',
                    border:
                      ratioTheoriePratique === option
                        ? '2px solid #2F2E2C'
                        : 'none',
                    flexShrink: 0,
                    transition: 'all 0.2s',
                  }}
                />
                <div
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: 400,
                    fontSize: '16px',
                    color: '#2F2E2C',
                    lineHeight: '20px',
                  }}
                >
                  {option}
                </div>
              </div>
            ))}
          </div>

       
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div
              style={{
                fontFamily: 'Mochiy Pop One, sans-serif',
                fontWeight: 400,
                fontSize: '18px',
                color: '#2F2E2C',
              }}
            >
              Le rythme du cours
            </div>

            {['Trop lent', 'Juste bien', 'Trop rapide', 'Inégal'].map((option) => (
              <div
                key={option}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                }}
                onClick={() =>
                  handleCheckboxChange(option, rythmeCheckboxes, setRythmeCheckboxes)
                }
              >
                <div
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '5px',
                    backgroundColor: rythmeCheckboxes.includes(option)
                      ? '#FFD93D'
                      : '#EAEAE9',
                    border: rythmeCheckboxes.includes(option)
                      ? '2px solid #2F2E2C'
                      : 'none',
                    flexShrink: 0,
                    transition: 'all 0.2s',
                  }}
                />
                <div
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: 400,
                    fontSize: '16px',
                    color: '#2F2E2C',
                    lineHeight: '20px',
                  }}
                >
                  {option}
                </div>
              </div>
            ))}
          </div>

          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div
              style={{
                fontFamily: 'Mochiy Pop One, sans-serif',
                fontWeight: 400,
                fontSize: '18px',
                color: '#2F2E2C',
              }}
            >
              La pertinence des infos par rapport à ce que vous imaginiez de ce cours
            </div>

            {[
              'Exactement ce que j\'attendais',
              'Assez proche de mes attentes',
              'Différent mais intéressant',
              'Pas du tout ce que j\'attendais',
            ].map((option) => (
              <div
                key={option}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                }}
                onClick={() =>
                  handleCheckboxChange(option, pertinenceInfos, setPertinenceInfos)
                }
              >
                <div
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '5px',
                    backgroundColor: pertinenceInfos.includes(option)
                      ? '#FFD93D'
                      : '#EAEAE9',
                    border: pertinenceInfos.includes(option)
                      ? '2px solid #2F2E2C'
                      : 'none',
                    flexShrink: 0,
                    transition: 'all 0.2s',
                  }}
                />
                <div
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: 400,
                    fontSize: '16px',
                    color: '#2F2E2C',
                    lineHeight: '20px',
                  }}
                >
                  {option}
                </div>
              </div>
            ))}
          </div>
        </div>


        <div
          style={{
            width: '100%',
            maxWidth: '650px',
            borderRadius: '8px',
            backgroundColor: '#FFFFFF',
            padding: '40px',
            display: 'flex',
            flexDirection: 'column',
            gap: '40px',
          }}
        >
          <div
            style={{
              fontFamily: 'Mochiy Pop One, sans-serif',
              fontWeight: 400,
              fontSize: '32px',
              color: '#2F2E2C',
            }}
          >
            Votre intervenant
          </div>

          <div
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 400,
              fontSize: '16px',
              color: '#2F2E2C',
            }}
          >
            Maintenant, quelques questions sur l'intervenant et après on a fini.
          </div>

    
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div
              style={{
                fontFamily: 'Mochiy Pop One, sans-serif',
                fontWeight: 400,
                fontSize: '18px',
                color: '#2F2E2C',
              }}
            >
              Globalement, l'intervenant était...
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={20}
                  color="#FFD93D"
                  fill={
                    star <= (intervenantHoveredStar || intervenantRating)
                      ? '#FFD93D'
                      : 'none'
                  }
                  strokeWidth={1.5}
                  style={{
                    width: '28px',
                    height: '28px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={() => setIntervenantHoveredStar(star)}
                  onMouseLeave={() => setIntervenantHoveredStar(0)}
                  onClick={() => setIntervenantRating(star)}
                />
              ))}
            </div>
          </div>

        
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div
              style={{
                fontFamily: 'Mochiy Pop One, sans-serif',
                fontWeight: 400,
                fontSize: '18px',
                color: '#2F2E2C',
              }}
            >
              La pédagogie de l'intervenant
            </div>

            {['Très claire', 'Claire', 'Confuse'].map((option) => (
              <div
                key={option}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                }}
                onClick={() => setPedagogieIntervenant(option)}
              >
                <div
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    backgroundColor:
                      pedagogieIntervenant === option ? '#FFD93D' : '#EAEAE9',
                    border:
                      pedagogieIntervenant === option
                        ? '2px solid #2F2E2C'
                        : 'none',
                    flexShrink: 0,
                    transition: 'all 0.2s',
                  }}
                />
                <div
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: 400,
                    fontSize: '16px',
                    color: '#2F2E2C',
                    lineHeight: '20px',
                  }}
                >
                  {option}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div
              style={{
                fontFamily: 'Mochiy Pop One, sans-serif',
                fontWeight: 400,
                fontSize: '18px',
                color: '#2F2E2C',
              }}
            >
              La disponibilité de l'intervenant
            </div>

            {[
              'Toujours disponible',
              'Disponible sur demande',
              'Peu disponible',
            ].map((option) => (
              <div
                key={option}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                }}
                onClick={() =>
                  handleCheckboxChange(
                    option,
                    disponibiliteIntervenant,
                    setDisponibiliteIntervenant
                  )
                }
              >
                <div
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '5px',
                    backgroundColor: disponibiliteIntervenant.includes(option)
                      ? '#FFD93D'
                      : '#EAEAE9',
                    border: disponibiliteIntervenant.includes(option)
                      ? '2px solid #2F2E2C'
                      : 'none',
                    flexShrink: 0,
                    transition: 'all 0.2s',
                  }}
                />
                <div
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: 400,
                    fontSize: '16px',
                    color: '#2F2E2C',
                    lineHeight: '20px',
                  }}
                >
                  {option}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div
              style={{
                fontFamily: 'Mochiy Pop One, sans-serif',
                fontWeight: 400,
                fontSize: '18px',
                color: '#2F2E2C',
              }}
            >
              Points d'amélioration pour ce cours
            </div>

            <textarea
              value={ameliorations}
              onChange={(e) => setAmeliorations(e.target.value)}
              placeholder="Vos suggestions..."
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

 
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div
              style={{
                fontFamily: 'Mochiy Pop One, sans-serif',
                fontWeight: 400,
                fontSize: '18px',
                color: '#2F2E2C',
              }}
            >
              Commentaires libres
            </div>

            <textarea
              value={commentairesLibres}
              onChange={(e) => setCommentairesLibres(e.target.value)}
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
        </div>

        <div
          style={{
            width: '100%',
            maxWidth: '650px',
            display: 'flex',
            justifyContent: 'center',
            paddingTop: '20px',
          }}
        >
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
      </div>
    </form>
  );
}
