import { Test, TestingModule } from '@nestjs/testing';
import { InviteController } from './invite.controller';

describe('InviteController', () => {
  let controller: InviteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InviteController],
    }).compile();

    controller = module.get<InviteController>(InviteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
