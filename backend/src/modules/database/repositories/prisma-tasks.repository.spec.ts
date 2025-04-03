import { PrismaTasksRepository } from './prisma-tasks.repository';
import { TaskProps } from 'src/modules/tasks/repositories/tasks.repository';
import { PrismaService } from '../services/prisma.service';

describe('PrismaTasksRepository', () => {
  let repository: PrismaTasksRepository;
  let prisma: PrismaService;

  beforeEach(() => {
    const prismaMock = {
      task: {
        findMany: jest.fn(),
        create: jest.fn(),
        delete: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      // mocks mínimos obrigatórios do PrismaClient
      $connect: jest.fn(),
      $disconnect: jest.fn(),
      $on: jest.fn(),
      $use: jest.fn(),
      $transaction: jest.fn(),
      $extends: jest.fn(),
      onModuleInit: jest.fn(),
      onModuleDestroy: jest.fn(),
    };

    prisma = prismaMock as unknown as PrismaService;
    repository = new PrismaTasksRepository(prisma);
  });

  it('should find tasks by userId', async () => {
    const tasks: TaskProps[] = [
      { id: 1, description: 'tarefa', completed: false, userId: 'user-1' },
    ];
    (prisma.task.findMany as jest.Mock).mockResolvedValue(tasks);

    const result = await repository.findByUserId('user-1');

    expect(prisma.task.findMany).toHaveBeenCalledWith({
      where: { userId: 'user-1' },
    });
    expect(result).toEqual(tasks);
  });

  it('should create a task', async () => {
    const taskInput: TaskProps = {
      id: 1,
      description: 'nova tarefa',
      completed: false,
      userId: 'user-1',
    };
    const createdTask = { ...taskInput };
    (prisma.task.create as jest.Mock).mockResolvedValue(createdTask);

    const result = await repository.create(taskInput);

    expect(prisma.task.create).toHaveBeenCalledWith({
      data: {
        userId: taskInput.userId,
        description: taskInput.description,
      },
    });
    expect(result).toEqual(createdTask);
  });

  it('should delete a task by id', async () => {
    (prisma.task.delete as jest.Mock).mockResolvedValue(undefined);

    await repository.delete(1);

    expect(prisma.task.delete).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });

  it('should check a task and toggle completed', async () => {
    const existingTask = {
      id: 1,
      description: 'tarefa',
      completed: false,
      userId: 'user-1',
    };
    (prisma.task.findUnique as jest.Mock).mockResolvedValue(existingTask);
    (prisma.task.update as jest.Mock).mockResolvedValue({
      ...existingTask,
      completed: true,
    });

    await repository.checkTask(1);

    expect(prisma.task.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
    });
    expect(prisma.task.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { completed: true },
    });
  });

  it('should throw error if task not found on checkTask', async () => {
    (prisma.task.findUnique as jest.Mock).mockResolvedValue(null);

    await expect(repository.checkTask(999)).rejects.toThrow(
      'Tarefa não encontrada',
    );
    expect(prisma.task.findUnique).toHaveBeenCalledWith({
      where: { id: 999 },
    });
  });
});
