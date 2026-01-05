'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { BillingAddressForm } from './BillingAddressForm';
import { useAuth } from '@/hooks/useAuth';

interface CheckoutFormProps {
  classCount: number;
  isAnnual: boolean;
  pricePerClass: number;
  onSubmit: (formData: any) => void;
}

export function CheckoutForm({ classCount, isAnnual, pricePerClass, onSubmit }: CheckoutFormProps) {
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    // Informations de facturation pré-remplies avec les données utilisateur
    email: user?.email || '',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    
    // Informations de carte
    cardNumber: '',
    expiryDate: '',
    cvc: '',
    
    // Adresse de facturation
    address: '',
    addressComplement: '',
    city: '',
    postalCode: '',
    country: 'France',
    vatNumber: '',
    siret: '',
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const checkoutData = {
      ...formData,
      classCount,
      isAnnual,
      pricePerClass,
      total: classCount * pricePerClass
    };
    
    onSubmit(checkoutData);
  };

  const total = classCount * pricePerClass;

  return (
    <form id="checkout-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Titre de la section */}
      <div>
        <h2 style={{
          fontFamily: 'Mochiy Pop One',
          fontSize: '24px',
          fontWeight: 400,
          color: '#2F2E2C',
          marginBottom: '8px'
        }}>
          Passez au plan Super Izzzi
        </h2>
        <p style={{
          fontFamily: 'Poppins',
          fontSize: '14px',
          color: '#6B6B6B'
        }}>
          Changez de plan pour débloquer les retours illimités
        </p>
      </div>

      {/* Email de facturation */}
      <div>
        <h3 style={{
          fontFamily: 'Poppins',
          fontSize: '16px',
          fontWeight: 600,
          color: '#2F2E2C',
          marginBottom: '16px'
        }}>
          Email de facturation
        </h3>
        <Input
          type="email"
          placeholder="votre@email.com"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          required
          style={{ width: '100%' }}
        />
      </div>

      {/* Nom et Prénom */}
      <div>
        <h3 style={{
          fontFamily: 'Poppins',
          fontSize: '16px',
          fontWeight: 600,
          color: '#2F2E2C',
          marginBottom: '16px'
        }}>
          Informations personnelles
        </h3>
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
              Nom
            </label>
            <Input
              type="text"
              placeholder="Doe"
              value={formData.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
              required
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
              Prénom
            </label>
            <Input
              type="text"
              placeholder="John"
              value={formData.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
              required
              style={{ width: '100%' }}
            />
          </div>
        </div>
      </div>

      {/* Informations de carte */}
      <div>
        <h3 style={{
          fontFamily: 'Poppins',
          fontSize: '16px',
          fontWeight: 600,
          color: '#2F2E2C',
          marginBottom: '16px'
        }}>
          Informations de carte
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Numéro de carte */}
          <div>
            <label style={{
              display: 'block',
              fontFamily: 'Poppins',
              fontSize: '14px',
              fontWeight: 500,
              color: '#2F2E2C',
              marginBottom: '8px'
            }}>
              Numéro de carte
            </label>
            <Input
              type="text"
              placeholder="1234 5678 9012 3456"
              value={formData.cardNumber}
              onChange={(e) => handleChange('cardNumber', e.target.value)}
              required
              maxLength={19}
              style={{ width: '100%' }}
            />
          </div>

          {/* Date d'expiration et CVC */}
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
                Date d'expiration
              </label>
              <Input
                type="text"
                placeholder="MM/AA"
                value={formData.expiryDate}
                onChange={(e) => handleChange('expiryDate', e.target.value)}
                required
                maxLength={5}
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
                Code CVC
              </label>
              <Input
                type="text"
                placeholder="123"
                value={formData.cvc}
                onChange={(e) => handleChange('cvc', e.target.value)}
                required
                maxLength={4}
                style={{ width: '100%' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Adresse de facturation */}
      <BillingAddressForm 
        formData={formData}
        onChange={handleChange}
      />
    </form>
  );
}
