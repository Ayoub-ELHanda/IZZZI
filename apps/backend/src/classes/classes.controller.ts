import { Controller, Get, Post, Body, Patch, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';
import { ClassesService } from './classes.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { QueryClassesDto } from './dto/query-classes.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('classes')
@ApiBearerAuth('JWT-auth')
@Controller('classes')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.RESPONSABLE_PEDAGOGIQUE)
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new class' })
  @ApiResponse({ status: 201, description: 'Class created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiBody({ type: CreateClassDto })
  create(@Request() req, @Body() createClassDto: CreateClassDto) {
    return this.classesService.create(
      req.user.userId,
      req.user.establishmentId,
      createClassDto,
    );
  }

  @Get()
  findAll(@Request() req, @Query() query: QueryClassesDto) {
    return this.classesService.findAll(
      req.user.userId,
      req.user.establishmentId,
      query.archived,
    );
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.classesService.findOne(id, req.user.userId, req.user.establishmentId);
  }

  @Patch(':id')
  update(@Request() req, @Param('id') id: string, @Body() updateClassDto: UpdateClassDto) {
    return this.classesService.update(
      id,
      req.user.userId,
      req.user.establishmentId,
      updateClassDto,
    );
  }

  @Post(':id/archive')
  archive(@Request() req, @Param('id') id: string) {
    return this.classesService.archive(id, req.user.userId, req.user.establishmentId);
  }
}
