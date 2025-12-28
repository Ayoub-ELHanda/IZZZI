// Invitation model for temporary storage of invitation tokens
// This could be a database table or Redis cache

export interface Invitation {
  token: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'RESPONSABLE_PEDAGOGIQUE';
  invitedBy: string; // User ID who sent the invitation
  establishmentId: string;
  expiresAt: Date;
  createdAt: Date;
}

// In-memory storage for development (should use Redis or database in production)
export class InvitationStore {
  private static invitations: Map<string, Invitation> = new Map();

  static create(invitation: Invitation): void {
    this.invitations.set(invitation.token, invitation);
  }

  static findByToken(token: string): Invitation | undefined {
    const invitation = this.invitations.get(token);
    
    // Check if expired
    if (invitation && invitation.expiresAt < new Date()) {
      this.invitations.delete(token);
      return undefined;
    }
    
    return invitation;
  }

  static delete(token: string): void {
    this.invitations.delete(token);
  }

  static cleanup(): void {
    const now = new Date();
    for (const [token, invitation] of this.invitations.entries()) {
      if (invitation.expiresAt < now) {
        this.invitations.delete(token);
      }
    }
  }
}

// Cleanup expired invitations every hour
setInterval(() => InvitationStore.cleanup(), 3600000);

