import { SuperUserPipe } from './super-user.pipe';

describe('SuperUserPipe', () => {
  it('create an instance', () => {
    const pipe = new SuperUserPipe();
    expect(pipe).toBeTruthy();
  });
});
