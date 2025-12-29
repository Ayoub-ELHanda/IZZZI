import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';

@Injectable()
export class SubjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateSubjectDto) {
    // Verify that the class belongs to the user's establishment
    const classItem = await this.prisma.class.findFirst({
      where: {
        id: dto.classId,
        createdBy: userId,
      },
    });

    if (!classItem) {
      throw new ForbiddenException('Class not found or access denied');
    }

    return this.prisma.subject.create({
      data: {
        name: dto.name,
        teacherName: dto.teacherName,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        classId: dto.classId,
        createdBy: userId,
      },
      include: {
        questionnaires: true,
      },
    });
  }

  async findAllByClass(userId: string, classId: string) {
    // Verify access to class
    const classItem = await this.prisma.class.findFirst({
      where: {
        id: classId,
        createdBy: userId,
      },
    });

    if (!classItem) {
      throw new ForbiddenException('Class not found or access denied');
    }

    return this.prisma.subject.findMany({
      where: {
        classId,
      },
      include: {
        questionnaires: {
          include: {
            _count: {
              select: {
                responses: true,
              },
            },
          },
        },
      },
      orderBy: {
        startDate: 'asc',
      },
    });
  }

  async findOne(id: string, userId: string) {
    const subject = await this.prisma.subject.findUnique({
      where: { id },
      include: {
        class: true,
        questionnaires: {
          include: {
            _count: {
              select: {
                responses: true,
              },
            },
          },
        },
      },
    });

    if (!subject || subject.createdBy !== userId) {
      throw new NotFoundException('Subject not found');
    }

    return subject;
  }

  async update(id: string, userId: string, dto: UpdateSubjectDto) {
    const subject = await this.findOne(id, userId);

    return this.prisma.subject.update({
      where: { id },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.teacherName && { teacherName: dto.teacherName }),
        ...(dto.startDate && { startDate: new Date(dto.startDate) }),
        ...(dto.endDate && { endDate: new Date(dto.endDate) }),
      },
      include: {
        questionnaires: true,
      },
    });
  }

  async remove(id: string, userId: string) {
    const subject = await this.findOne(id, userId);

    // Check if there are responses before deleting
    const responseCount = await this.prisma.response.count({
      where: {
        questionnaire: {
          subjectId: id,
        },
      },
    });

    if (responseCount > 0) {
      throw new ForbiddenException('Cannot delete subject with existing responses');
    }

    return this.prisma.subject.delete({
      where: { id },
    });
  }
}
