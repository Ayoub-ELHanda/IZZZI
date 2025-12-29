import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MailerService } from '../mailer/mailer.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';

@Injectable()
export class ClassesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailer: MailerService,
  ) {}

  async create(userId: string, establishmentId: string, dto: CreateClassDto) {
    const activeClassesCount = await this.prisma.class.count({
      where: {
        createdBy: userId,
        isArchived: false,
      },
    });

    if (activeClassesCount >= 5) {
      throw new ForbiddenException('Vous avez atteint la limite de 5 classes actives');
    }

    return this.prisma.class.create({
      data: {
        name: dto.name,
        description: dto.description,
        studentCount: dto.studentCount,
        studentEmails: dto.studentEmails,
        createdBy: userId,
        establishmentId,
      },
    });
  }

  async findAll(userId: string, establishmentId: string, archived?: boolean) {
    const where: any = {
      establishmentId,
    };

    if (archived !== undefined) {
      where.isArchived = archived;
    }

    return this.prisma.class.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string, userId: string, establishmentId: string) {
    const classItem = await this.prisma.class.findFirst({
      where: {
        id,
        establishmentId,
      },
      include: {
        subjects: true,
      },
    });

    if (!classItem) {
      throw new NotFoundException('Classe non trouvée');
    }

    return classItem;
  }

  async update(id: string, userId: string, establishmentId: string, dto: UpdateClassDto) {
    const classItem = await this.findOne(id, userId, establishmentId);

    if (classItem.isArchived) {
      throw new BadRequestException('Impossible de modifier une classe archivée');
    }

    return this.prisma.class.update({
      where: { id },
      data: {
        name: dto.name,
        description: dto.description,
        studentCount: dto.studentCount,
        studentEmails: dto.studentEmails,
      },
    });
  }

  async archive(id: string, userId: string, establishmentId: string) {
    const classItem = await this.findOne(id, userId, establishmentId);

    if (classItem.isArchived) {
      throw new BadRequestException('Cette classe est déjà archivée');
    }

    const archivedClass = await this.prisma.class.update({
      where: { id },
      data: {
        isArchived: true,
        archivedAt: new Date(),
        archivedBy: userId,
      },
    });

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (user) {
      try {
        await this.mailer.sendClassArchivedEmail(user.email, {
          userName: `${user.firstName} ${user.lastName}`,
          className: archivedClass.name,
          archivedAt: archivedClass.archivedAt?.toLocaleDateString('fr-FR') || new Date().toLocaleDateString('fr-FR'),
        });
      } catch (error) {
        console.error('Failed to send archive email:', error);
      }
    }

    return archivedClass;
  }
}
