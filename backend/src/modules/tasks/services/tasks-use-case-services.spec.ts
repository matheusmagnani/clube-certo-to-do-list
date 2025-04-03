import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks-use-case-services';
import { TasksRepository } from '../repositories/tasks.repository';
import { TaskProps } from '../repositories/tasks.repository';
describe('TasksService', () => {
  let service: TasksService;
  let repository: jest.Mocked<TasksRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: TasksRepository,
          useValue: {
            findByUserId: jest.fn(),
            create: jest.fn(),
            delete: jest.fn(),
            checkTask: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    repository = module.get(TasksRepository);
  });

  it('should find tasks by user ID', async () => {
    const userId = 'user-1';
    const tasks = [
      { id: 1, description: 'Test task', completed: false, userId },
    ];
    repository.findByUserId.mockResolvedValue(tasks);

    const result = await service.findTaskByUserId(userId);
    expect(repository.findByUserId).toHaveBeenCalledWith(userId);
    expect(result).toEqual(tasks);
  });

  it('should create a task', async () => {
    const taskProps: TaskProps = {
      id: 1,
      description: 'Nova tarefa',
      userId: 'user-1',
      completed: false,
    };
    const createdTask = { ...taskProps };
    repository.create.mockResolvedValue(createdTask);

    const result = await service.createTask(taskProps);
    expect(repository.create).toHaveBeenCalledWith(taskProps);
    expect(result).toEqual(createdTask);
  });

  it('should delete a task', async () => {
    const taskId = 1;
    repository.delete.mockResolvedValue(undefined);

    await expect(service.deleteTask(taskId)).resolves.toBeUndefined();

    expect(repository.delete).toHaveBeenCalledWith(taskId);
  });

  it('should check a task', async () => {
    const taskId = 1;

    await service.checkTask(taskId);

    expect(repository.checkTask).toHaveBeenCalledWith(taskId);
  });
});
