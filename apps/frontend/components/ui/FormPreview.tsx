'use client';

import { Star } from 'lucide-react';

interface FormPreviewProps {
  formType?: string;
}

export function FormPreview({ formType }: FormPreviewProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        width: '100%',
        maxHeight: '580px',
        overflowY: 'auto',
      }}
    >
     
      <div
        style={{
          width: '650px',
          height: '215.9px',
          borderRadius: '8px',
          backgroundColor: '#FFFFFF',
          paddingTop: '80px',
          paddingRight: '40px',
          paddingBottom: '80px',
          paddingLeft: '40px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
 
        <div
          style={{
            width: '429px',
            height: '13px',
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
              color="#D1D1D1"
              fill="none"
              strokeWidth={1.5}
              style={{ width: '20px', height: '20px' }}
            />
          ))}
        </div>
      </div>

      <div
        style={{
          width: '650px',
          height: '890px',
          borderRadius: '8px',
          backgroundColor: '#FFFFFF',
          padding: '80px',
          display: 'flex',
          flexDirection: 'column',
          gap: '60px',
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
              width: '300px',
              height: '11px',
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
              width: '254px',
              height: '13px',
              fontFamily: 'Mochiy Pop One, sans-serif',
              fontWeight: 400,
              fontSize: '18px',
              color: '#2F2E2C',
            }}
          >
            Le ratio théorie/pratique
          </div>

          {[1, 2, 3].map((item) => (
            <div
              key={`round-${item}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '19px',
                  backgroundColor: '#EAEAE9',
                  flexShrink: 0,
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
                Juste comme il faut
              </div>
            </div>
          ))}
        </div>


        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div
            style={{
              width: '254px',
              height: '13px',
              fontFamily: 'Mochiy Pop One, sans-serif',
              fontWeight: 400,
              fontSize: '18px',
              color: '#2F2E2C',
            }}
          >
            Le ratio théorie/pratique
          </div>


          {[1, 2, 3].map((item) => (
            <div
              key={`square-${item}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '5px',
                  backgroundColor: '#EAEAE9',
                  flexShrink: 0,
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
                Juste comme il faut
              </div>
            </div>
          ))}
        </div>


        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div
            style={{
              width: '490px',
              height: '39px',
              fontFamily: 'Mochiy Pop One, sans-serif',
              fontWeight: 400,
              fontSize: '18px',
              color: '#2F2E2C',
            }}
          >
            La pertinence des infos par rapport à ce que vous imaginiez de ce cours
          </div>


          {[1, 2, 3, 4].map((item) => (
            <div
              key={`pertinence-${item}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '5px',
                  backgroundColor: '#EAEAE9',
                  flexShrink: 0,
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
                Juste comme il faut
              </div>
            </div>
          ))}
        </div>
      </div>


      <div
        style={{
          width: '652px',
          height: '1491px',
          borderRadius: '8px',
          backgroundColor: '#FFFFFF',
          padding: '80px',
          display: 'flex',
          flexDirection: 'column',
          gap: '60px',
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
            Globalement, vous avez trouvé ce cours...
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={20}
                color="#D1D1D1"
                fill="none"
                strokeWidth={1.5}
                style={{ width: '20px', height: '20px' }}
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
            Le ratio théorie/pratique
          </div>

          {[1, 2, 3].map((item) => (
            <div
              key={`round2-${item}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '19px',
                  backgroundColor: '#EAEAE9',
                  flexShrink: 0,
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
                Juste comme il faut
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
            Le ratio théorie/pratique
          </div>

          {[1, 2, 3].map((item) => (
            <div
              key={`square2-${item}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '5px',
                  backgroundColor: '#EAEAE9',
                  flexShrink: 0,
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
                Juste comme il faut
              </div>
            </div>
          ))}
        </div>


        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div
            style={{
              width: '490px',
              height: '39px',
              fontFamily: 'Mochiy Pop One, sans-serif',
              fontWeight: 400,
              fontSize: '18px',
              color: '#2F2E2C',
            }}
          >
            La pertinence des infos par rapport à ce que vous imaginiez de ce cours
          </div>

          {[1, 2, 3, 4].map((item) => (
            <div
              key={`pertinence2-${item}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '5px',
                  backgroundColor: '#EAEAE9',
                  flexShrink: 0,
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
                Juste comme il faut
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div
            style={{
              width: '490px',
              height: '39px',
              fontFamily: 'Mochiy Pop One, sans-serif',
              fontWeight: 400,
              fontSize: '18px',
              color: '#2F2E2C',
            }}
          >
            La pertinence des infos par rapport à ce que vous imaginiez de ce cours
          </div>

          <div
            style={{
              width: '490px',
              height: '110px',
              borderRadius: '8px',
              backgroundColor: '#EAEAE9',
            }}
          />
        </div>


        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div
            style={{
              width: '490px',
              height: '39px',
              fontFamily: 'Mochiy Pop One, sans-serif',
              fontWeight: 400,
              fontSize: '18px',
              color: '#2F2E2C',
            }}
          >
            La pertinence des infos par rapport à ce que vous imaginiez de ce cours
          </div>

          <div
            style={{
              width: '490px',
              height: '110px',
              borderRadius: '8px',
              backgroundColor: '#EAEAE9',
            }}
          />
        </div>
      </div>
    </div>
  );
}
