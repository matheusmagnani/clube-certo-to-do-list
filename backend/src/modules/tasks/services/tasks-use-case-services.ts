import { Injectable } from '@nestjs/common';
import { TaskProps, TasksRepository } from '../repositories/tasks.repository';

@Injectable()
export class TasksService {
  constructor(private readonly tasksRepository: TasksRepository) {}

  findTaskByUserId(userId: string) {
    return this.tasksRepository.findByUserId(userId);
  }
  createTask(taskProps: TaskProps) {
    return this.tasksRepository.create(taskProps);
  }

  deleteTask(id: number) {
    return this.tasksRepository.delete(id);
  }

  checkTask(id: number) {
    return this.tasksRepository.checkTask(id);
  }
}
