import axios from 'axios';
import type { AxiosResponse } from 'axios'

export interface TaskProps {
  id?: number;
  title: string;
  userId?: string;
}

const API_URL = 'http://localhost:3000';

export default {
  getTasks(userId: string): Promise<AxiosResponse<TaskProps[]>> {
    return axios.get(`${API_URL}/tasks`, {
      headers: { userId },
    });
  },
  createTask(taskProps: TaskProps): Promise<AxiosResponse<TaskProps>> {
    return axios.post(`${API_URL}/tasks`, taskProps);
  },

  async deleteTask(taskId: number): Promise<AxiosResponse<TaskProps>> {
   const data =  await axios.delete(`${API_URL}/tasks/${taskId}`);
  
    return data;
  },
  checkTask(taskId: number): Promise<AxiosResponse<TaskProps>> {
    return axios.patch(`${API_URL}/tasks/${taskId}/check`);
  },
};
