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

    const newClass = await this.prisma.class.create({
      data: {
        name: dto.name,
        description: dto.description,
        studentCount: dto.studentCount,
        studentEmails: dto.studentEmails,
        createdBy: userId,
        establishmentId,
      },
    });

    // Envoyer un email à chaque étudiant ajouté
    if (dto.studentEmails && dto.studentEmails.length > 0) {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (user) {
        const teacherName = `${user.firstName} ${user.lastName}`;
        
        // Envoi des emails en parallèle (non-bloquant)
        dto.studentEmails.forEach(async (email) => {
          try {
            await this.mailer.sendStudentAddedToClassEmail(email, {
              className: dto.name,
              teacherName,
              studentCount: dto.studentCount,
            });
          } catch (error) {
            console.error(`Failed to send email to ${email}:`, error);
            // Ne pas faire échouer la création de classe si l'email ne peut pas être envoyé
          }
        });
      }
    }

    return newClass;
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

    const updatedClass = await this.prisma.class.update({
      where: { id },
      data: {
        name: dto.name,
        description: dto.description,
        studentCount: dto.studentCount,
        studentEmails: dto.studentEmails,
      },
    });

 
    if (dto.studentEmails && dto.studentEmails.length > 0) {
      const oldEmails = classItem.studentEmails || [];
      const newEmails = dto.studentEmails.filter(email => !oldEmails.includes(email));

      if (newEmails.length > 0) {
        const user = await this.prisma.user.findUnique({
          where: { id: userId },
        });

        if (user) {
          const teacherName = `${user.firstName} ${user.lastName}`;
          
        
          newEmails.forEach(async (email) => {
            try {
              await this.mailer.sendStudentAddedToClassEmail(email, {
                className: dto.name || classItem.name,
                teacherName,
                studentCount: dto.studentCount || classItem.studentCount,
              });
            } catch (error) {
              console.error(`Failed to send email to ${email}:`, error);
              // Ne pas faire échouer la mise à jour si l'email ne peut pas être envoyé
            }
          });
        }
      }
    }

    return updatedClass;
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
