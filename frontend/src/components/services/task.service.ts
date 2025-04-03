import axios from 'axios';
import type { AxiosResponse } from 'axios'
import type { ITask } from '../../types';

const API_URL = 'http://localhost:3000';

export default {
  getTasks(userId: string): Promise<AxiosResponse<ITask[]>> {
    return axios.get(`${API_URL}/tasks`, {
      headers: { userId },
    });
  },
  createTask(taskProps: ITask): Promise<AxiosResponse<ITask>> {
    return axios.post(`${API_URL}/tasks`, taskProps);
  },

  async deleteTask(taskId: number): Promise<AxiosResponse<ITask>> {
   const data =  await axios.delete(`${API_URL}/tasks/${taskId}`);
  
    return data;
  },
  checkTask(taskId: number): Promise<AxiosResponse<ITask>> {
    return axios.patch(`${API_URL}/tasks/${taskId}/check`);
  },
};
