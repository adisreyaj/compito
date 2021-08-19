import { RequestWithUser } from '@compito/api-interfaces';
import { Controller, Get, Req } from '@nestjs/common';
import { RoleService } from './role.service';

@Controller('roles')
export class RoleController {
  constructor(private roleService: RoleService) {}

  @Get()
  getAll(@Req() req: RequestWithUser) {
    return this.roleService.getRoles(req.user);
  }
}
