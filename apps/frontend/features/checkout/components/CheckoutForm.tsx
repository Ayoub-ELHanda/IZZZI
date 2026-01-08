'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { BillingAddressForm } from './BillingAddressForm';
import { useAuth } from '@/hooks/useAuth';

interface CheckoutFormProps {
  classCount: number;
  isAnnual: boolean;
  totalAmount: number;
  onSubmit: (formData: any) => void;
}

export function CheckoutForm({ classCount, isAnnual, totalAmount, onSubmit }: CheckoutFormProps) {
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

  // Fonction pour formater le numéro de carte (ajoute des espaces tous les 4 chiffres)
  const formatCardNumber = (value: string): string => {
    // Retirer tous les espaces et caractères non numériques
    const numbers = value.replace(/\D/g, '');
    // Limiter à 16 chiffres
    const limitedNumbers = numbers.slice(0, 16);
    
    // Formater avec des espaces tous les 4 chiffres
    // Utiliser une approche qui évite l'espace final
    const formatted = limitedNumbers
      .match(/.{1,4}/g) // Diviser en groupes de 4
      ?.join(' ') || limitedNumbers; // Joindre avec des espaces
    
    return formatted;
  };

  // Fonction pour formater la date d'expiration (MM/AA)
  const formatExpiryDate = (value: string): string => {
    // Retirer tous les caractères non numériques
    const numbers = value.replace(/\D/g, '');
    // Limiter à 4 chiffres
    let limitedNumbers = numbers.slice(0, 4);
    
    // Valider le mois (ne peut pas dépasser 12)
    if (limitedNumbers.length >= 2) {
      const month = parseInt(limitedNumbers.slice(0, 2));
      if (month > 12) {
        // Si le mois dépasse 12, le limiter à 12
        limitedNumbers = '12' + limitedNumbers.slice(2);
      } else if (month === 0) {
  
        limitedNumbers = '01' + limitedNumbers.slice(2);
      }
    }
    

    if (limitedNumbers.length >= 2) {
      return `${limitedNumbers.slice(0, 2)}/${limitedNumbers.slice(2)}`;
    }
    
    return limitedNumbers;
  };

  const handleChange = (field: string, value: string) => {
    let formattedValue = value;
    

    if (field === 'cardNumber') {
      formattedValue = formatCardNumber(value);
    } else if (field === 'expiryDate') {
      formattedValue = formatExpiryDate(value);
    } else if (field === 'cvc') {

      formattedValue = value.replace(/\D/g, '').slice(0, 4);
    }
    
    setFormData(prev => ({ ...prev, [field]: formattedValue }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const checkoutData = {
      ...formData,
      classCount,
      isAnnual,
      totalAmount,
      total: totalAmount
    };
    
    onSubmit(checkoutData);
  };

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
              inputMode="numeric"
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
                inputMode="numeric"
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
                inputMode="numeric"
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