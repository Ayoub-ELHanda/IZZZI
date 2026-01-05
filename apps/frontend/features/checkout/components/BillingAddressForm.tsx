'use client';

import { Input } from '@/components/ui/Input';

interface BillingAddressFormProps {
  formData: {
    address: string;
    addressComplement: string;
    city: string;
    postalCode: string;
    country: string;
    vatNumber: string;
    siret: string;
  };
  onChange: (field: string, value: string) => void;
}

export function BillingAddressForm({ formData, onChange }: BillingAddressFormProps) {
  return (
    <div style={{ marginTop: '32px' }}>
      <h3 style={{
        fontFamily: 'Poppins',
        fontSize: '16px',
        fontWeight: 600,
        color: '#2F2E2C',
        marginBottom: '24px'
      }}>
        Adresse de facturation
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Adresse */}
        <div>
          <label style={{
            display: 'block',
            fontFamily: 'Poppins',
            fontSize: '14px',
            fontWeight: 500,
            color: '#2F2E2C',
            marginBottom: '8px'
          }}>
            Adresse
          </label>
          <Input
            type="text"
            placeholder="123, rue de la Paix"
            value={formData.address}
            onChange={(e) => onChange('address', e.target.value)}
            style={{ width: '100%' }}
          />
        </div>

        {/* Complément d'adresse */}
        <div>
          <label style={{
            display: 'block',
            fontFamily: 'Poppins',
            fontSize: '14px',
            fontWeight: 500,
            color: '#2F2E2C',
            marginBottom: '8px'
          }}>
            Complément d'adresse
          </label>
          <Input
            type="text"
            placeholder="Étage, bâtiment..."
            value={formData.addressComplement}
            onChange={(e) => onChange('addressComplement', e.target.value)}
            style={{ width: '100%' }}
          />
        </div>

        {/* Ville et Code postal */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{
              display: 'block',
              fontFamily: 'Poppins',
              fontSize: '14px',
              fontWeight: 500,
              color: '#2F2E2C',
              marginBottom: '8px'
            }}>
              Ville
            </label>
            <Input
              type="text"
              placeholder="Paris"
              value={formData.city}
              onChange={(e) => onChange('city', e.target.value)}
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              fontFamily: 'Poppins',
              fontSize: '14px',
              fontWeight: 500,
              color: '#2F2E2C',
              marginBottom: '8px'
            }}>
              Code postal
            </label>
            <Input
              type="text"
              placeholder="75001"
              value={formData.postalCode}
              onChange={(e) => onChange('postalCode', e.target.value)}
              style={{ width: '100%' }}
            />
          </div>
        </div>

        {/* Pays */}
        <div>
          <label style={{
            display: 'block',
            fontFamily: 'Poppins',
            fontSize: '14px',
            fontWeight: 500,
            color: '#2F2E2C',
            marginBottom: '8px'
          }}>
            Pays
          </label>
          <select
            value={formData.country}
            onChange={(e) => onChange('country', e.target.value)}
            style={{
              width: '100%',
              height: '48px',
              padding: '0 16px',
              fontFamily: 'Poppins',
              fontSize: '14px',
              border: '1px solid #E0E0E0',
              borderRadius: '8px',
              backgroundColor: '#FFFFFF',
              color: '#2F2E2C',
              cursor: 'pointer'
            }}
          >
            <option value="France">France</option>
            <option value="Belgium">Belgique</option>
            <option value="Switzerland">Suisse</option>
            <option value="Canada">Canada</option>
          </select>
        </div>

        {/* Numéro de TVA */}
        <div>
          <label style={{
            display: 'block',
            fontFamily: 'Poppins',
            fontSize: '14px',
            fontWeight: 500,
            color: '#2F2E2C',
            marginBottom: '8px'
          }}>
            Numéro de TVA
          </label>
          <Input
            type="text"
            placeholder="FR12345678901"
            value={formData.vatNumber}
            onChange={(e) => onChange('vatNumber', e.target.value)}
            style={{ width: '100%' }}
          />
        </div>

        {/* SIRET */}
        <div>
          <label style={{
            display: 'block',
            fontFamily: 'Poppins',
            fontSize: '14px',
            fontWeight: 500,
            color: '#2F2E2C',
            marginBottom: '8px'
          }}>
            SIRET
          </label>
          <Input
            type="text"
            placeholder="123 456 789 00012"
            value={formData.siret}
            onChange={(e) => onChange('siret', e.target.value)}
            style={{ width: '100%' }}
          />
        </div>
      </div>
    </div>
  );
}
