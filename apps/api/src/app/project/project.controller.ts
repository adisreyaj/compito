import { ProjectRequest, RequestParamsDto } from '@compito/api-interfaces';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ProjectService } from './project.service';

@Controller('projects')
export class ProjectController {
  constructor(private organizationService: ProjectService) {}
  @Post()
  create(@Body() organization: ProjectRequest) {
    return this.organizationService.create(organization);
  }

  @Get()
  findAll(@Query() query: RequestParamsDto) {
    return this.organizationService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.organizationService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() organization: ProjectRequest) {
    return this.organizationService.update(id, organization);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.organizationService.remove(id);
  }
}
