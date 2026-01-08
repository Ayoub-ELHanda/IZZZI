import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole, SubscriptionStatus } from '@prisma/client';

@Injectable()
export class SuperAdminService {
  constructor(private prisma: PrismaService) {}

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

  async getTeachersByAdmin(adminId: string) {
    
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

    await this.prisma.user.update({
      where: { id: subscription.userId },
      data: {
        subscriptionStatus: SubscriptionStatus.CANCELED,
      },
    });

    return updated;
  }

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

    await this.prisma.user.update({
      where: { id: subscription.userId },
      data: {
        subscriptionStatus: SubscriptionStatus.ACTIVE,
      },
    });

    return updated;
  }

  async getAllActiveSubscriptions() {
    const subscriptions = await this.prisma.subscription.findMany({
      where: {
        status: {
          in: [SubscriptionStatus.ACTIVE, SubscriptionStatus.TRIALING],
        },
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            establishment: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        payments: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1, 
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return subscriptions;
  }

  async getAllSubscriptions() {
    const subscriptions = await this.prisma.subscription.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            establishment: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        payments: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return subscriptions;
  }

  async isSuperAdmin(userId: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    return user?.role === UserRole.SUPER_ADMIN;
  }

  async ensureNotSuperAdmin(userId: string, action: string = 'modifier') {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (user?.role === UserRole.SUPER_ADMIN) {
      throw new ForbiddenException(`Vous ne pouvez pas ${action} un Super Admin`);
    }
  }

  async reassignTeacherToAdmin(teacherId: string, newAdminId: string) {
    
    const teacher = await this.prisma.user.findUnique({
      where: { id: teacherId },
      select: { role: true, establishmentId: true },
    });

    if (!teacher) {
      throw new NotFoundException('Responsable pédagogique non trouvé');
    }

    if (teacher.role !== UserRole.RESPONSABLE_PEDAGOGIQUE) {
      throw new BadRequestException('L\'utilisateur spécifié n\'est pas un Responsable pédagogique');
    }

    const newAdmin = await this.prisma.user.findUnique({
      where: { id: newAdminId },
      select: { role: true, id: true },
    });

    if (!newAdmin) {
      throw new NotFoundException('Admin non trouvé');
    }

    if (newAdmin.role !== UserRole.ADMIN) {
      throw new BadRequestException('L\'utilisateur spécifié n\'est pas un Admin');
    }

    const updatedTeacher = await this.prisma.user.update({
      where: { id: teacherId },
      data: {
        invitedBy: newAdminId,
      },
      include: {
        establishment: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return updatedTeacher;
  }

  async getAllAdmins() {
    const admins = await this.prisma.user.findMany({
      where: {
        role: UserRole.ADMIN,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
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

    return admins;
  }
}
