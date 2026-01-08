import { EmailTemplate } from '../interfaces/email-template.interface';
import * as fs from 'fs';
import * as path from 'path';

export interface ProfessionalInvoiceData {
  customerName: string;
  customerEmail: string;
  invoiceNumber: string;
  invoiceDate: string;
  billingPeriod: string;
  planName: string;
  planDescription: string;
  unitPrice: string;
  lineTotal: string;
  subtotal: string;
  taxAmount: string;
  totalAmount: string;
  paymentMethod: string;
  paymentDate: string;
  transactionId: string;
  invoiceUrl?: string;
}

export class ProfessionalInvoiceTemplate implements EmailTemplate<ProfessionalInvoiceData> {
  private template: string;

  constructor() {

    const templatePath = path.join(__dirname, 'invoice.html');
    try {
      this.template = fs.readFileSync(templatePath, 'utf-8');
    } catch (error) {
      console.error('Error loading invoice template:', error);
      this.template = this.getFallbackTemplate();
    }
  }

  generate(data: ProfessionalInvoiceData): string {
    let html = this.template;
    
    html = html.replace(/{{customerName}}/g, data.customerName);
    html = html.replace(/{{customerEmail}}/g, data.customerEmail);
    html = html.replace(/{{invoiceNumber}}/g, data.invoiceNumber);
    html = html.replace(/{{invoiceDate}}/g, data.invoiceDate);
    html = html.replace(/{{billingPeriod}}/g, data.billingPeriod);
    html = html.replace(/{{planName}}/g, data.planName);
    html = html.replace(/{{planDescription}}/g, data.planDescription);
    html = html.replace(/{{unitPrice}}/g, data.unitPrice);
    html = html.replace(/{{lineTotal}}/g, data.lineTotal);
    html = html.replace(/{{subtotal}}/g, data.subtotal);
    html = html.replace(/{{taxAmount}}/g, data.taxAmount);
    html = html.replace(/{{totalAmount}}/g, data.totalAmount);
    html = html.replace(/{{paymentMethod}}/g, data.paymentMethod);
    html = html.replace(/{{paymentDate}}/g, data.paymentDate);
    html = html.replace(/{{transactionId}}/g, data.transactionId);
    html = html.replace(/{{invoiceUrl}}/g, data.invoiceUrl || '#');
    html = html.replace(/{{currentYear}}/g, new Date().getFullYear().toString());
    
    return html;
  }

  private getFallbackTemplate(): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Facture - IZZZI</title>
      </head>
      <body style="font-family: Arial, sans-serif; padding: 20px;">
        <h1>Facture IZZZI</h1>
        <p><strong>N° {{invoiceNumber}}</strong></p>
        <p>Date: {{invoiceDate}}</p>
        <hr>
        <p><strong>Client:</strong> {{customerName}}</p>
        <p>{{customerEmail}}</p>
        <hr>
        <h3>Détails</h3>
        <p>{{planName}} - {{planDescription}}</p>
        <p>Prix: {{unitPrice}}</p>
        <p><strong>Total TTC: {{totalAmount}}</strong></p>
        <hr>
        <p>Paiement effectué le {{paymentDate}}</p>
        <p>Transaction: {{transactionId}}</p>
      </body>
      </html>
    `;
  }
}
