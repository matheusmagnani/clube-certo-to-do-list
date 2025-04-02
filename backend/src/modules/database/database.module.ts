import { Module } from '@nestjs/common';
import { PrismaService } from './services/prisma.service';
import { PrismaTasksRepository } from './repositories/prisma-tasks.repository';
import { TasksRepository } from '../tasks/repositories/tasks.repository';

@Module({
  providers: [
    PrismaService,
    {
      provide: TasksRepository,
      useClass: PrismaTasksRepository,
    },
  ],
  exports: [TasksRepository],
})
export class DatabaseModule {}
