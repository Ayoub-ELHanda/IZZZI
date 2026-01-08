import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole, SubscriptionStatus } from '@prisma/client';

@Injectable()
export class SuperAdminService {
  constructor(private prisma: PrismaService) {}

  /**
   * Récupérer tous les utilisateurs avec filtrage par rôle
   */
  async getAllUsers(role?: UserRole) {
    const where: any = {};
    if (role) {
      where.role = role;
    }

    const users = await this.prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        isEmailVerified: true,
        createdAt: true,
        updatedAt: true,
        establishment: {
          select: {
            id: true,
            name: true,
          },
        },
        subscriptionStatus: true,
        trialEndDate: true,
        _count: {
          select: {
            classes: true,
            subjects: true,
            subscriptions: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return users;
  }

  /**
   * Récupérer un utilisateur par ID avec ses détails
   */
  async getUserById(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        establishment: true,
        subscriptions: {
          include: {
            payments: {
              orderBy: {
                createdAt: 'desc',
              },
              take: 10,
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        classes: {
          take: 10,
          orderBy: {
            createdAt: 'desc',
          },
        },
        subjects: {
          take: 10,
          orderBy: {
            createdAt: 'desc',
          },
        },
        _count: {
          select: {
            classes: true,
            subjects: true,
            subscriptions: true,
            payments: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    return user;
  }

  /**
   * Récupérer tous les professeurs pédagogiques associés à un Admin
   */
  async getTeachersByAdmin(adminId: string) {
    // Vérifier que l'utilisateur est un Admin
    const admin = await this.prisma.user.findUnique({
      where: { id: adminId },
      select: { role: true },
    });

    if (!admin) {
      throw new NotFoundException('Admin non trouvé');
    }

    if (admin.role !== UserRole.ADMIN) {
      throw new BadRequestException('L\'utilisateur spécifié n\'est pas un Admin');
    }

    // Récupérer tous les professeurs pédagogiques qui appartiennent au même établissement
    // ou qui ont été invités par cet Admin
    const teachers = await this.prisma.user.findMany({
      where: {
        OR: [
          { invitedBy: adminId },
          {
            establishment: {
              createdBy: adminId,
            },
          },
        ],
        role: UserRole.RESPONSABLE_PEDAGOGIQUE,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        isActive: true,
        isEmailVerified: true,
        createdAt: true,
        establishment: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            classes: true,
            subjects: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return teachers;
  }

  /**
   * Récupérer tous les abonnements d'un Admin
   */
  async getAdminSubscriptions(adminId: string) {
    const admin = await this.prisma.user.findUnique({
      where: { id: adminId },
      select: { role: true },
    });

    if (!admin) {
      throw new NotFoundException('Admin non trouvé');
    }

    if (admin.role !== UserRole.ADMIN) {
      throw new BadRequestException('L\'utilisateur spécifié n\'est pas un Admin');
    }

    const subscriptions = await this.prisma.subscription.findMany({
      where: { userId: adminId },
      include: {
        payments: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return subscriptions;
  }

  /**
   * Annuler un abonnement
   */
  async cancelSubscription(subscriptionId: string) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { id: subscriptionId },
    });

    if (!subscription) {
      throw new NotFoundException('Abonnement non trouvé');
    }

    const updated = await this.prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        status: SubscriptionStatus.CANCELED,
        canceledAt: new Date(),
        cancelAtPeriodEnd: true,
      },
    });

    // Mettre à jour le statut de l'utilisateur
    await this.prisma.user.update({
      where: { id: subscription.userId },
      data: {
        subscriptionStatus: SubscriptionStatus.CANCELED,
      },
    });

    return updated;
  }

  /**
   * Renouveler un abonnement
   */
  async renewSubscription(subscriptionId: string) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { id: subscriptionId },
    });

    if (!subscription) {
      throw new NotFoundException('Abonnement non trouvé');
    }

    const updated = await this.prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        status: SubscriptionStatus.ACTIVE,
        cancelAtPeriodEnd: false,
        canceledAt: null,
      },
    });

    // Mettre à jour le statut de l'utilisateur
    await this.prisma.user.update({
      where: { id: subscription.userId },
      data: {
        subscriptionStatus: SubscriptionStatus.ACTIVE,
      },
    });

    return updated;
  }

  /**
   * Vérifier si un utilisateur est Super Admin
   */
  async isSuperAdmin(userId: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    return user?.role === UserRole.SUPER_ADMIN;
  }

  /**
   * Vérifier qu'un utilisateur ne peut pas modifier un Super Admin
   */
  async ensureNotSuperAdmin(userId: string, action: string = 'modifier') {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (user?.role === UserRole.SUPER_ADMIN) {
      throw new ForbiddenException(`Vous ne pouvez pas ${action} un Super Admin`);
    }
  }
}

