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
import { Invitation, InvitationStore } from './entities/invitation.entity';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailerService: MailerService,
  ) {}

  async registerAdmin(dto: RegisterAdminDto) {
    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('Un utilisateur avec cet email existe déjà');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Create establishment and admin user in a transaction
    const result = await this.prisma.$transaction(async (prisma) => {
      // Create establishment
      const establishment = await prisma.establishment.create({
        data: {
          name: dto.establishmentName,
          createdBy: 'temp', // Will be updated after user creation
        },
      });

      // Create admin user
      const user = await prisma.user.create({
        data: {
          email: dto.email,
          password: hashedPassword,
          firstName: dto.firstName,
          lastName: dto.lastName,
          role: 'ADMIN',
          establishmentId: establishment.id,
          authProvider: 'LOCAL',
        },
      });

      // Update establishment with actual user ID
      await prisma.establishment.update({
        where: { id: establishment.id },
        data: { createdBy: user.id },
      });

      return { user, establishment };
    });

    // Generate JWT token
    const token = await this.generateToken(result.user.id, result.user.email, result.user.role);

    // Send welcome email (non-blocking)
    this.mailerService.sendWelcomeEmail(result.user.email, result.user.firstName).catch(console.error);

    return {
      user: this.sanitizeUser(result.user),
      establishment: result.establishment,
      token,
    };
  }

  async inviteUser(invitedBy: string, dto: InviteUserDto) {
    // Verify the inviter exists and has permission
    const inviter = await this.prisma.user.findUnique({
      where: { id: invitedBy },
      include: { establishment: true },
    });

    if (!inviter) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    // Verify permissions: Only ADMIN can invite RESPONSABLE_PEDAGOGIQUE
    if (inviter.role !== 'ADMIN') {
      throw new BadRequestException('Seuls les administrateurs peuvent inviter des responsables pédagogiques');
    }

    if (dto.role !== 'RESPONSABLE_PEDAGOGIQUE') {
      throw new BadRequestException('Un administrateur peut uniquement inviter des responsables pédagogiques');
    }

    // Check if email already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('Un utilisateur avec cet email existe déjà');
    }

    // Generate invitation token
    const inviteToken = randomBytes(32).toString('hex');

    // Store invitation (expires in 7 days)
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

    // Send invitation email
    const inviterName = `${inviter.firstName} ${inviter.lastName}`;
    await this.mailerService.sendInvitationEmail(
      dto.email,
      inviterName,
      inviteToken,
    );

    return {
      message: 'Invitation envoyée avec succès',
      inviteToken, // For testing purposes
    };
  }

  async registerInvited(dto: RegisterInvitedDto) {
    // Validate invite token
    const invitation = InvitationStore.findByToken(dto.inviteToken);

    if (!invitation) {
      throw new BadRequestException('Le lien d\'invitation est invalide ou expiré');
    }

    // Verify email matches
    if (invitation.email !== dto.email) {
      throw new BadRequestException('L\'email ne correspond pas à l\'invitation');
    }

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('Un utilisateur avec cet email existe déjà');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Create user with invited role
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
      },
      include: { establishment: true },
    });

    // Delete invitation after successful registration
    InvitationStore.delete(dto.inviteToken);

    // Generate JWT token
    const token = await this.generateToken(user.id, user.email, user.role);

    // Send welcome email
    this.mailerService.sendWelcomeEmail(user.email, user.firstName).catch(console.error);

    return {
      user: this.sanitizeUser(user),
      establishment: user.establishment,
      token,
    };
  }

  async login(dto: LoginDto) {
    // Find user
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: { establishment: true },
    });

    if (!user) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    // Check if user used OAuth (no password)
    if (!user.password) {
      throw new UnauthorizedException(
        'Ce compte utilise Google OAuth. Veuillez vous connecter avec Google.',
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new UnauthorizedException('Ce compte a été désactivé');
    }

    // Generate JWT token
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

    // Don't reveal if user exists or not for security
    if (!user) {
      return { message: 'Si cet email existe, un lien de réinitialisation a été envoyé' };
    }

    // Check if user used OAuth
    if (!user.password) {
      return { message: 'Ce compte utilise Google OAuth et n\'a pas de mot de passe' };
    }

    // Generate reset token
    const resetToken = randomBytes(32).toString('hex');
    const hashedToken = await bcrypt.hash(resetToken, 10);

    // Set token expiration to 1 hour
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    // Save token to database
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: hashedToken,
        resetPasswordExpires: expiresAt,
      },
    });

    // Send password reset email (non-blocking)
    this.mailerService.sendPasswordResetEmail(user.email, resetToken).catch(console.error);

    return { message: 'Si cet email existe, un lien de réinitialisation a été envoyé' };
  }

  async resetPassword(dto: ResetPasswordDto) {
    // Find user with valid reset token
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

    // Verify token
    const isTokenValid = await bcrypt.compare(dto.token, user.resetPasswordToken);

    if (!isTokenValid) {
      throw new BadRequestException('Le lien de réinitialisation est invalide ou expiré');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Update password and clear reset token
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
    // Find or create user with Google ID
    let user = await this.prisma.user.findUnique({
      where: { googleId: googleProfile.id },
      include: { establishment: true },
    });

    if (!user) {
      // Check if email already exists
      const existingUser = await this.prisma.user.findUnique({
        where: { email: googleProfile.email },
      });

      if (existingUser) {
        throw new ConflictException(
          'Un compte avec cet email existe déjà. Veuillez vous connecter avec votre mot de passe.',
        );
      }

      // Create new user with Google OAuth
      // For Google signup, we need to determine if they're admin or guest
      // This should be handled differently in production
      throw new BadRequestException(
        'Veuillez d\'abord créer un compte avant de vous connecter avec Google',
      );
    }

    // Generate JWT token
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
}

