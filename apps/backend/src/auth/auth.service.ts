import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { MailerService } from '../mailer/mailer.service';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { RegisterAdminDto } from './dto/register-admin.dto';
import { RegisterInvitedDto } from './dto/register-guest.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { InviteUserDto } from './dto/invite-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { Invitation, InvitationStore } from './entities/invitation.entity';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailerService: MailerService,
  ) {}

  async registerAdmin(dto: RegisterAdminDto) {

    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('Un utilisateur avec cet email existe déjà');
    }


    const hashedPassword = await bcrypt.hash(dto.password, 10);

 
    const trialEndDate = new Date();
    trialEndDate.setMonth(trialEndDate.getMonth() + 4);

    const result = await this.prisma.$transaction(async (prisma) => {
     
      const establishment = await prisma.establishment.create({
        data: {
          name: dto.establishmentName,
          createdBy: 'temp',
        },
      });

    
      const user = await prisma.user.create({
        data: {
          email: dto.email,
          password: hashedPassword,
          firstName: dto.firstName,
          lastName: dto.lastName,
          role: 'ADMIN',
          establishmentId: establishment.id,
          authProvider: 'LOCAL',
          trialEndDate: trialEndDate,
        },
      });

      
      await prisma.establishment.update({
        where: { id: establishment.id },
        data: { createdBy: user.id },
      });

      return { user, establishment };
    });

    
    const token = await this.generateToken(result.user.id, result.user.email, result.user.role);

   
    try {
      await this.mailerService.sendWelcomeEmail(result.user.email, result.user.firstName);
      console.log(`✅ Welcome email sent successfully to ${result.user.email}`);
    } catch (error) {
      console.error(`❌ Failed to send welcome email to ${result.user.email}:`, error);

    }

    return {
      user: this.sanitizeUser(result.user),
      establishment: result.establishment,
      token,
    };
  }

  async inviteUser(invitedBy: string, dto: InviteUserDto) {

    const inviter = await this.prisma.user.findUnique({
      where: { id: invitedBy },
      include: { establishment: true },
    });

    if (!inviter) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    if (inviter.role !== 'ADMIN') {
      throw new BadRequestException('Seuls les administrateurs peuvent inviter des responsables pédagogiques');
    }

    if (dto.role !== 'RESPONSABLE_PEDAGOGIQUE') {
      throw new BadRequestException('Un administrateur peut uniquement inviter des responsables pédagogiques');
    }

   
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('Un utilisateur avec cet email existe déjà');
    }

    const inviteToken = randomBytes(32).toString('hex');

    
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const invitation: Invitation = {
      token: inviteToken,
      email: dto.email,
      firstName: dto.firstName,
      lastName: dto.lastName,
      role: dto.role,
      invitedBy: inviter.id,
      establishmentId: inviter.establishmentId!,
      expiresAt,
      createdAt: new Date(),
    };

    InvitationStore.create(invitation);


    const inviterName = `${inviter.firstName} ${inviter.lastName}`;
    try {
      await this.mailerService.sendInvitationEmail(
        dto.email,
        inviterName,
        inviteToken,
      );
      
  
      await this.mailerService.sendInvitationConfirmationEmail(
        inviter.email,
        dto.email,
      );
    } catch (error) {
      console.error('Error sending invitation email (non-blocking):', error);
  
    }

    return {
      message: 'Invitation envoyée avec succès',
      inviteToken,
    };
  }

  async getInvitationInfo(token: string) {
    const invitation = InvitationStore.findByToken(token);

    if (!invitation) {
      throw new BadRequestException('Le lien d\'invitation est invalide ou expiré');
    }

  
    return {
      email: invitation.email,
      firstName: invitation.firstName,
      lastName: invitation.lastName,
      role: invitation.role,
    };
  }

  async registerInvited(dto: RegisterInvitedDto) {
  
    const invitation = InvitationStore.findByToken(dto.inviteToken);

    if (!invitation) {
      throw new BadRequestException('Le lien d\'invitation est invalide ou expiré');
    }


    if (invitation.email !== dto.email) {
      throw new BadRequestException('L\'email ne correspond pas à l\'invitation');
    }


    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('Un utilisateur avec cet email existe déjà');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const trialEndDate = new Date();
    trialEndDate.setMonth(trialEndDate.getMonth() + 4);


    const establishmentUsersWithSubscription = await this.prisma.user.findFirst({
      where: {
        establishmentId: invitation.establishmentId,
        role: {
          in: ['ADMIN', 'RESPONSABLE_PEDAGOGIQUE'],
        },
        subscriptionStatus: {
          in: ['ACTIVE', 'TRIALING'],
        },
      },
    });

   
    const subscriptionStatus = establishmentUsersWithSubscription 
      ? establishmentUsersWithSubscription.subscriptionStatus 
      : 'FREE';

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        firstName: dto.firstName,
        lastName: dto.lastName,
        role: invitation.role,
        establishmentId: invitation.establishmentId,
        invitedBy: invitation.invitedBy,
        authProvider: 'LOCAL',
        trialEndDate: trialEndDate,
        subscriptionStatus: subscriptionStatus, // ✅ Hériter du statut de l'établissement
      },
      include: { establishment: true },
    });


    InvitationStore.delete(dto.inviteToken);


    const token = await this.generateToken(user.id, user.email, user.role);


    try {
      await this.mailerService.sendWelcomeEmail(user.email, user.firstName);
      console.log(`✅ Welcome email sent successfully to ${user.email}`);
      
     
      if (subscriptionStatus === 'ACTIVE') {
        console.log(`✅ User inherited ACTIVE subscription from establishment ${invitation.establishmentId}`);
      }
    } catch (error) {
      console.error(`❌ Failed to send welcome email to ${user.email}:`, error);
     
    }

    return {
      user: this.sanitizeUser(user),
      establishment: user.establishment,
      token,
    };
  }

  async login(dto: LoginDto) {

    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: { establishment: true },
    });

    if (!user) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    if (!user.password) {
      throw new UnauthorizedException(
        'Ce compte utilise Google OAuth. Veuillez vous connecter avec Google.',
      );
    }


    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Ce compte a été désactivé');
    }


    const token = await this.generateToken(user.id, user.email, user.role);

    return {
      user: this.sanitizeUser(user),
      establishment: user.establishment,
      token,
    };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });


    if (!user) {
      return { message: 'Si cet email existe, un lien de réinitialisation a été envoyé' };
    }

    if (!user.password) {
      return { message: 'Ce compte utilise Google OAuth et n\'a pas de mot de passe' };
    }


    const resetToken = randomBytes(32).toString('hex');
    const hashedToken = await bcrypt.hash(resetToken, 10);

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: hashedToken,
        resetPasswordExpires: expiresAt,
      },
    });


    this.mailerService.sendPasswordResetEmail(user.email, resetToken).catch(console.error);

    return { message: 'Si cet email existe, un lien de réinitialisation a été envoyé' };
  }

  async resetPassword(dto: ResetPasswordDto) {

    const user = await this.prisma.user.findFirst({
      where: {
        resetPasswordExpires: {
          gte: new Date(),
        },
      },
    });

    if (!user || !user.resetPasswordToken) {
      throw new BadRequestException('Le lien de réinitialisation est invalide ou expiré');
    }


    const isTokenValid = await bcrypt.compare(dto.token, user.resetPasswordToken);

    if (!isTokenValid) {
      throw new BadRequestException('Le lien de réinitialisation est invalide ou expiré');
    }


    const hashedPassword = await bcrypt.hash(dto.password, 10);

    
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
    });

    return { message: 'Mot de passe réinitialisé avec succès' };
  }

  async googleLogin(googleProfile: any) {
   
    let user = await this.prisma.user.findUnique({
      where: { googleId: googleProfile.id },
      include: { establishment: true },
    });

    if (!user) {
     
      const existingUser = await this.prisma.user.findUnique({
        where: { email: googleProfile.email },
      });

      if (existingUser) {
        throw new ConflictException(
          'Un compte avec cet email existe déjà. Veuillez vous connecter avec votre mot de passe.',
        );
      }


      throw new BadRequestException(
        'Veuillez d\'abord créer un compte avant de vous connecter avec Google',
      );
    }

    const token = await this.generateToken(user.id, user.email, user.role);

    return {
      user: this.sanitizeUser(user),
      establishment: user.establishment,
      token,
    };
  }

  private async generateToken(userId: string, email: string, role: string) {
    const payload = { sub: userId, email, role };
    return this.jwtService.sign(payload);
  }

  private sanitizeUser(user: any) {
    const { password, resetPasswordToken, resetPasswordExpires, emailVerificationToken, ...sanitized } = user;
    return sanitized;
  }

  async validateUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { establishment: true },
    });

    if (!user || !user.isActive) {
      return null;
    }

    return this.sanitizeUser(user);
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { establishment: true },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }
    
    if (dto.email !== user.email) {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });
      if (existingUser) {
        throw new ConflictException('Cet email est déjà utilisé');
      }
    }

    // Update user
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        ...(dto.profilePicture && { profilePicture: dto.profilePicture }),
      },
      include: { establishment: true },
    });


    if (dto.establishmentName && user.establishmentId) {
      await this.prisma.establishment.update({
        where: { id: user.establishmentId },
        data: { name: dto.establishmentName },
      });
    }

    const userWithEstablishment = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { establishment: true },
    });

    return this.sanitizeUser(userWithEstablishment);
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    if (!user.password) {
      throw new BadRequestException('Ce compte utilise Google OAuth et n\'a pas de mot de passe');
    }

   
    const isPasswordValid = await bcrypt.compare(dto.oldPassword, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Ancien mot de passe incorrect');
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);

    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { message: 'Mot de passe modifié avec succès' };
  }

  async deleteAccount(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        establishment: {
          include: {
            users: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }


    if (user.establishment && user.establishment.createdBy === userId) {

      const otherUsers = user.establishment.users.filter(u => u.id !== userId);
      
      if (otherUsers.length > 0) {
     
        await this.prisma.user.delete({
          where: { id: userId },
        });
      } else {
   
        await this.prisma.establishment.delete({
          where: { id: user.establishment.id },
        });
      }
    } else {
    
      await this.prisma.user.delete({
        where: { id: userId },
      });
    }

    return { message: 'Compte supprimé avec succès' };
  }
}
