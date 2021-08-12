import { BoardRequest, RequestParamsDto, UserPayload } from '@compito/api-interfaces';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { getUserDetails } from '../core/utils/payload.util';
import { PrismaService } from '../prisma.service';
import { GET_SINGLE_BOARD_SELECT } from './boards.config';

@Injectable()
export class BoardsService {
  private logger = new Logger('BOARD');
  constructor(private prisma: PrismaService) {}

  async create(data: BoardRequest, user: UserPayload) {
    const { org, role, userId } = getUserDetails(user);
    if (role !== 'super-admin' && data.orgId !== org) {
      throw new UnauthorizedException('No access to create board');
    }
    try {
      const boardData: Prisma.BoardUncheckedCreateInput = {
        ...data,
        lists: data.lists as any[],
        orgId: org,
        createdById: userId,
      };
      const board = await this.prisma.board.create({
        data: boardData,
      });
      return board;
    } catch (error) {
      this.logger.error('Failed to create board', error);
      return new InternalServerErrorException();
    }
  }

  async findAll(query: RequestParamsDto) {
    const { skip, limit } = query;
    try {
      const count$ = this.prisma.board.count();
      const orgs$ = this.prisma.board.findMany({
        skip,
        take: limit,
      });
      const [payload, count] = await Promise.all([orgs$, count$]);
      return {
        payload,
        meta: {
          count,
        },
      };
    } catch (error) {
      this.logger.error('Failed to fetch orgs', error);
      return new InternalServerErrorException();
    }
  }

  async findOne(id: string) {
    try {
      const board = await this.prisma.board.findUnique({
        where: {
          id,
        },
        select: GET_SINGLE_BOARD_SELECT,
      });
      if (board) {
        return board;
      }
      return new NotFoundException();
    } catch (error) {
      this.logger.error('Failed to fetch board', error);
      return new InternalServerErrorException();
    }
  }

  async update(id: string, req: BoardRequest) {
    try {
      const { lists, name, description } = req;
      const data: Prisma.BoardUncheckedUpdateInput = {
        lists: lists as any[],
        name,
        description,
      };
      const board = await this.prisma.board.update({
        where: {
          id,
        },
        data,
      });
      this.logger.debug(board);
      if (board) {
        return board;
      }
      return new NotFoundException();
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          return new NotFoundException();
        }
      }
      this.logger.error('Failed to update board', error);
      return new InternalServerErrorException();
    }
  }

  async remove(id: string) {
    try {
      const board = await this.prisma.board.delete({
        where: {
          id,
        },
      });
      if (board) {
        return board;
      }
      return new NotFoundException();
    } catch (error) {
      this.logger.error('Failed to delete board', error);
      return new InternalServerErrorException();
    }
  }
}
