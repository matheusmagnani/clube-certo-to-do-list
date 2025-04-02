import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Patch,
  Headers,
} from '@nestjs/common';
import { TasksService } from '../services/tasks-use-case-services';
import { TaskProps } from '../repositories/tasks.repository';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  getByUserId(@Headers('userId') userId: string) {
    return this.tasksService.findTaskByUserId(userId);
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
