import { RequestParams, RequestWithUser, TaskRequest } from '@compito/api-interfaces';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Prisma } from '@prisma/client';
import { PERMISSIONS } from '../core/config/permissions.config';
import { Permissions } from '../core/decorators/permissions.decorator';
import { Role } from '../core/decorators/roles.decorator';
import { PermissionsGuard } from '../core/guards/permissions.guard';
import { RolesGuard } from '../core/guards/roles.guard';
import { getUserDetails } from '../core/utils/payload.util';
import { TaskService } from './task.service';
@Controller('tasks')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @UseGuards(RolesGuard, PermissionsGuard)
  @Role('user')
  @Permissions(PERMISSIONS.task.create)
  @Post()
  create(@Body() task: TaskRequest, @Req() req: RequestWithUser) {
    return this.taskService.create(task, req.user);
  }

  @UseGuards(RolesGuard, PermissionsGuard)
  @Role('user')
  @Permissions(PERMISSIONS.task.read)
  @Get()
  findAll(@Query() query: RequestParams, @Req() req: RequestWithUser) {
    return this.taskService.findAll(query, req.user, {});
  }

  @Get('priorities')
  findAllPriorities() {
    return this.taskService.findAllPriorities();
  }

  @UseGuards(RolesGuard, PermissionsGuard)
  @Role('user')
  @Permissions(PERMISSIONS.task.read)
  @Get('my')
  findMyTasks(@Query() query: RequestParams & { [key: string]: string }, @Req() req: RequestWithUser) {
    const { userId } = getUserDetails(req.user);
    const where: Prisma.TaskWhereInput = {
      assignees: {
        some: {
          id: userId,
        },
      },
    };
    return this.taskService.findAll(query, req.user, where);
  }

  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.task.read)
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: RequestWithUser) {
    return this.taskService.findOne(id, req.user);
  }

  @UseGuards(RolesGuard, PermissionsGuard)
  @Role('user')
  @Permissions(PERMISSIONS.task.update)
  @Patch(':id')
  update(@Param('id') id: string, @Body() task: TaskRequest, @Req() req: RequestWithUser) {
    return this.taskService.update(id, task, req.user);
  }

  @UseGuards(RolesGuard, PermissionsGuard)
  @Role('user')
  @Permissions(PERMISSIONS.task.update)
  @Post(':id/comments')
  addComment(@Param('id') id: string, @Body() data: { content: string }, @Req() req: RequestWithUser) {
    return this.taskService.addComment(id, data.content, req.user);
  }

  @UseGuards(RolesGuard, PermissionsGuard)
  @Role('user')
  @Permissions(PERMISSIONS.task.delete)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: RequestWithUser) {
    return this.taskService.remove(id, req.user);
  }

  @Post(':id/attachments')
  @UseInterceptors(
    FilesInterceptor('files', 3, {
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
      fileFilter: (_, file, cb) => {
        const allowedFileExtensions = ['jpg', 'jpeg', 'png', 'pdf', 'csv', 'txt'];
        const fileExt = file.originalname.split('.').pop();
        if (allowedFileExtensions.includes(fileExt)) {
          return cb(null, true);
        }
        console.error(fileExt + 'is not allowed');
        return cb(new BadRequestException('File format not allowed'), false);
      },
    }),
  )
  addAttachments(@Param('id') id: string, @UploadedFiles() files: any[], @Req() req: RequestWithUser) {
    return this.taskService.addAttachments(id, files, req.user);
  }
  @Delete(':id/attachments/:attachmentId')
  removeAttachment(@Param('id') id: string, @Param('attachmentId') attachmentId: string, @Req() req: RequestWithUser) {
    return this.taskService.removeAttachment(id, attachmentId, req.user);
  }
}
