import { Injectable } from '@nestjs/common';
import { TasksRepository } from '../repositories/tasks.repository';

interface TaskProps {
  description: string;
}

@Injectable()
export class TasksService {
  constructor(private readonly tasksRepository: TasksRepository) {}

  getAllTasks() {
    return this.tasksRepository.findAll();
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
