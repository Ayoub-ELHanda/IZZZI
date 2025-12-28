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
import { RegisterGuestDto } from './dto/register-guest.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

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

  async registerGuest(dto: RegisterGuestDto) {
    // TODO: Validate invite token and get establishment ID
    // For now, throw error as invitation system needs to be implemented
    throw new BadRequestException('Le système d\'invitation n\'est pas encore implémenté');

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('Un utilisateur avec cet email existe déjà');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Create guest user (will be implemented with invitation system)
    // const user = await this.prisma.user.create({ ... });
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

