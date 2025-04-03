<template>
<div>
  <header class="bg-box-black h-52 flex items-center justify-center">
    <img class="w-40 sm:w-[156px]" src="../src/assets/Logo.svg" alt="Logo" />
  </header>

  <main class="min-h-screen flex flex-col items-center px-4">
    <div class="flex flex-col sm:flex-row justify-center gap-2 sm:gap-[8px] w-full max-w-3xl mt-[-2rem]">
      <input
        v-model="newTaskDescription"
        type="text"
        placeholder="Assine uma nova tarefa"
        class="bg-box-gray-500 border border-box-black rounded-lg p-4 w-full sm:w-[638px] h-14 text-text-gray-100 text-base placeholder:text-text-gray-300 focus:outline-none focus:border-color2"
      />
      <button 
        @click="handleNewTask"
        :disabled="isSubmiting"
        class="bg-color2 w-full sm:w-[90px] h-14 rounded-lg text-gray-100 text-sm flex items-center justify-center gap-2 hover:bg-button-green-300 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <span v-if="!isSubmiting" class="flex items-center gap-2">
          Criar <PhPlusCircle :size="16" />
        </span>
        <span v-else class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
      </button>
    </div>

    <div v-if="isLoading" class="mt-8 flex flex-col items-center">
      <div class="spinner mb-4"></div>
      <p class="text-color1">Carregando...</p>
    </div>

    <div v-else class="text-text-gray-100 justify-between mt-16 w-full max-w-3xl">
      <div class="pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <p class="text-color1 font-bold text-sm flex items-center">
          Tarefas criadas
          <span class="ml-2 bg-box-gray-500 text-text-gray-100 rounded-full py-0.5 px-2">
            {{ totalTasks }}
          </span>
        </p>

        <p class="text-color1 font-bold text-sm flex items-center mt-2 sm:mt-0">
          Concluídas
          <span class="ml-2 bg-box-gray-500 text-text-gray-100 rounded-full py-0.5 px-2">
            {{ completedTasks }}
          </span>
        </p>
      </div>

      <HasNoTasks v-if="tasks.length === 0" />

      <div v-else>
        <Task
          v-for="task in tasks"
          :key="task.id"
          :id="Number(task.id)"
          :description="task.description"
          :completed="task.completed"
          @complete="handleComplete(task.id as number)"
          @remove="handleRemove(task.id as number)"
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

const newTaskDescription = ref<string>("");
const tasks = ref<ITask[]>([]);
const isLoading = ref(false);
const isSubmiting = ref(false);
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
    if (cachedUserId) {
      const response = await taskService.getTasks(cachedUserId)
      tasks.value = response.data.sort((a, b) => Number(a.completed) - Number(b.completed));
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
      isSubmiting.value = true;
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
  } finally {
    isSubmiting.value = false;
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
    if (window.confirm('Tem certeza que deseja remover esta tarefa?')) {
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
