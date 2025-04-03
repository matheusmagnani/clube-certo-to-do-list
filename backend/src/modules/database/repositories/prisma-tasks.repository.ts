import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';
import {
  TaskProps,
  TasksRepository,
} from 'src/modules/tasks/repositories/tasks.repository';

@Injectable()
export class PrismaTasksRepository implements TasksRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByUserId(userId: string): Promise<TaskProps[]> {
    const tasks = await this.prisma.task.findMany({
      where: { userId },
    });

    return tasks as TaskProps[];
  }
  async create(taskProps: TaskProps) {
    return this.prisma.task.create({
      data: {
        userId: taskProps.userId,
        description: taskProps.description,
      },
    });
  }

  async delete(id: number) {
    await this.prisma.task.delete({
      where: { id },
    });
  }

  async checkTask(id: number) {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      throw new Error('Tarefa não encontrada');
    }

    await this.prisma.task.update({
      where: { id },
      data: {
        completed: !task.completed,
      },
    });
  }
}
