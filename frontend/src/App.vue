<template>
  <div>
    <header class="bg-box-black h-52 flex items-center justify-center">
      <img class="w-[156px]" src="../src/assets/Logo.svg" alt="Logo" />
    </header>
    
    <main class="h-screen flex flex-col items-center">
      <div class="flex justify-center gap-[8px]">
        <input
          v-model="newTaskDescription"
          type="text"
          placeholder="Assine uma nova tarefa"
          class="bg-box-gray-500 border border-box-black rounded-lg p-[16px] w-[638px] h-[54px] mt-[-27px] text-text-gray-100 text-[16px] placeholder:text-text-gray-300 placeholder:text-[16px] focus:outline-0 focus:border-color2"
        />
        <button 
          @click="handleNewTask"
          class="bg-color2 w-[90px] h-[52px] rounded-lg text-gray-100 text-[14px] flex items-center justify-center gap-2 mt-[-26px] hover:bg-button-green-300 cursor-pointer"
        >
          Criar <PhPlusCircle :size="16" />
        </button>
      </div>
      
      <div v-if="isLoading" class="mt-8 flex flex-col items-center">
        <div class="spinner mb-4"></div>
        <p class="text-color1">Carregando...</p>
      </div>
      
      <div v-else class="text-text-gray-100 justify-between mt-[64px] w-[736px]">
        <div class="pb-[24px] flex flex-row justify-between">
          <p class="text-color1 font-bold text-[14px]">
            Tarefas criadas
            <span class="ml-[8px] bg-box-gray-500 text-text-gray-100 rounded-full py-0.5 px-2">{{ totalTasks }}</span>
          </p>

          <p class="text-color1 font-bold text-[14px]">
            Concluídas
            <span class="ml-[8px] bg-box-gray-500 text-text-gray-100 rounded-full py-0.5 px-2">{{ completedTasks }}</span>
          </p>
        </div>

        <HasNoTasks v-if="tasks.length === 0" />

        <div v-else>
          <Task
            v-for="task in tasks"
            :key="task.id"
            :id="task.id"
            :description="task.description"
            :completed="task.completed"
            @complete="handleComplete(task.id)"
            @remove="handleRemove(task.id)"
          />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import HasNoTasks from './components/HasNoTasks.vue'
import Task from './components/Task.vue'
import { PhPlusCircle } from '@phosphor-icons/vue'
import { ref, computed, onMounted } from "vue";
import type { ITask } from "./types";
import taskService from "./components/services/task.service"
import Swal from 'sweetalert2'

const newTaskDescription = ref<string>("");
const tasks = ref<ITask[]>([]);
const isLoading = ref(false);
const completedTasks = computed(() => tasks.value.filter((task) => task.completed).length);
const totalTasks = computed(() => tasks.value.length);
const userId = ref('');

function generateUserId() {
    return 'user_' + Math.random().toString(36).substr(2, 9)
}

onMounted(async () => {
  try {
    isLoading.value = true;
    const cachedUserId = localStorage.getItem('@todoList/userId');
    const response = await taskService.getTasks(cachedUserId)
    tasks.value = response.data.sort((a, b) => Number(a.completed) - Number(b.completed));
    if (cachedUserId) {
      userId.value = cachedUserId;
    } else {
      const newId = generateUserId();
      userId.value = newId;
      localStorage.setItem('@todoList/userId', newId);
    }
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
})

const handleNewTask = async () => {
  try {
    if (newTaskDescription.value.trim() === '') return;
      const response = await taskService.createTask({
        description: newTaskDescription.value,
        completed: false,
        userId: userId.value
      })

      const newTask: ITask = response.data;

      tasks.value.push(newTask);
      newTaskDescription.value = '';
  } catch (error) {
    console.log(error)
  }
};

const handleComplete = async (id: number) => {
  tasks.value = tasks.value
    .map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    )
    .sort((a, b) => Number(a.completed) - Number(b.completed)); 
  await taskService.checkTask(id);
};

const handleRemove = async (id: number) => {
  try {
    if (
      Swal.fire({
        title: "Tem certeza que deseja excluir esta tarefa?",
        text: "Você não poderá reverter isso!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sim, tenho certeza!"
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: "Tarefa excluida!",
            text: "Sua tarefa foi excluída com sucesso.",
            icon: "success"
          });
        }
      }   
      )
    ) {
      tasks.value = tasks.value.filter((task) => task.id !== id);
      await taskService.deleteTask(id);
    }
  } catch (error) {
   console.log(error) 
  }
};
</script>

<style scoped>
.spinner {
  border: 4px solid rgba(0, 208, 92, 0.3);
  border-top: 4px solid #117243;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
