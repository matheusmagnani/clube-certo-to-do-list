export interface TaskProps {
  id: number;
  description: string;
  completed: boolean;
  userId: string;
}

export abstract class TasksRepository {
  abstract findByUserId(userId: string): Promise<TaskProps[]>;
  abstract create(taskProps: TaskProps): Promise<TaskProps>;
  abstract delete(id: number): Promise<void>;
  abstract checkTask(id: number): Promise<void>;
}
