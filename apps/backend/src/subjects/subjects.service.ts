import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';

@Injectable()
export class SubjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateSubjectDto) {

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true, establishmentId: true },
    });

    if (!user) {
      throw new ForbiddenException('User not found');
    }

    const whereClause: any = { id: dto.classId };
    if (user.establishmentId) {
      whereClause.establishmentId = user.establishmentId;
    }

    const classItem = await this.prisma.class.findFirst({
      where: whereClause,
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

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true, establishmentId: true },
    });

    if (!user) {
      throw new ForbiddenException('User not found');
    }

    const whereClause: any = { id: classId };
    if (user.establishmentId) {
      whereClause.establishmentId = user.establishmentId;
    }

    const classItem = await this.prisma.class.findFirst({
      where: whereClause,
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

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true, establishmentId: true },
    });

    if (!user) {
      throw new ForbiddenException('User not found');
    }

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

    if (!subject) {
      throw new NotFoundException('Subject not found');
    }

    if (user.establishmentId && subject.class.establishmentId !== user.establishmentId) {
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
