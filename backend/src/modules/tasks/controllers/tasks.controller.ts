import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Patch,
} from '@nestjs/common';
import { TasksService } from '../services/tasks-use-case-services';

interface TaskProps {
  description: string;
}

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  getAllTasks(): Promise<any> {
    return this.tasksService.getAllTasks();
  }

  @Post()
  createTask(@Body() taskProps: TaskProps) {
    return this.tasksService.createTask(taskProps);
  }

  @Delete(':id')
  deleteTask(@Param('id') id: number) {
    return this.tasksService.deleteTask(id);
  }

  @Patch(':id/check')
  checkTask(@Param('id') id: number) {
    return this.tasksService.checkTask(id);
  }
}
