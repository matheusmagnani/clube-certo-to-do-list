import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';
import { TasksRepository } from 'src/modules/tasks/repositories/tasks.repository';

interface TaskProps {
  description: string;
}

@Injectable()
export class PrismaTasksRepository implements TasksRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.task.findMany();
  }

  async create(taskProps: TaskProps) {
    return this.prisma.task.create({
      data: {
        description: taskProps.description,
      },
    });
  }

  async delete(id: number) {
    return this.prisma.task.delete({
      where: { id },
    });
  }

  async checkTask(id: number) {
    return this.prisma.task.update({
      where: { id },
      data: {
        completed: true,
      },
    });
  }
}
