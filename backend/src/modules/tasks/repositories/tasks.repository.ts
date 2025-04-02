interface TaskProps {
  description: string;
}

export abstract class TasksRepository {
  abstract findAll(): Promise<any>;
  abstract create(taskProps: TaskProps): Promise<any>;
  abstract delete(id: number): Promise<any>;
  abstract checkTask(id: number): Promise<any>;
}
