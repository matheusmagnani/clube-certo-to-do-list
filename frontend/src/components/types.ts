export interface TaskProps {
  id: number;
  description: string;
  completed: boolean;
  onComplete: () => void;
  onRemove: () => void;
}