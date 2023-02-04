import { Injectable } from '@nestjs/common';

export type Medic = any;

@Injectable()
export class MedicService {
  private readonly medics = [
    {
      userId: 1,
      username: 'john',
      password: 'changeme',
    },
    {
      userId: 2,
      username: 'maria',
      password: 'guess',
    },
  ];

  async findOne(username: string): Promise<Medic | undefined> {
    return this.medics.find((medic) => medic.username === username);
  }
}
