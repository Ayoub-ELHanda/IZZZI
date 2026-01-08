import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('subjects')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.RESPONSABLE_PEDAGOGIQUE)
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Post()
  create(@Request() req, @Body() createSubjectDto: CreateSubjectDto) {
    return this.subjectsService.create(req.user.userId, createSubjectDto);
  }

  @Get('class/:classId')
  findAllByClass(@Request() req, @Param('classId') classId: string) {
    return this.subjectsService.findAllByClass(req.user.userId, classId);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.subjectsService.findOne(id, req.user.userId);
  }

  @Patch(':id')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateSubjectDto: UpdateSubjectDto,
  ) {
    return this.subjectsService.update(id, req.user.userId, updateSubjectDto);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.subjectsService.remove(id, req.user.userId);
  }
}
