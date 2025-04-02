<script setup lang="ts">
import HasNoTasks from './components/HasNoTasks.vue'
import Task from './components/Task.vue'
import { PhPlusCircle } from '@phosphor-icons/vue'
import { ref, computed } from "vue";
import type { ITask } from "./types";

const newTaskDescription = ref<string>("");
const tasks = ref<ITask[]>([]);

const completedTasks = computed(() => tasks.value.filter((task) => task.completed).length);
const totalTasks = computed(() => tasks.value.length);

const handleNewTask = () => {
  if (newTaskDescription.value.trim() === '') return;

  const newTask: ITask = {
    id: Math.random(),
    description: newTaskDescription.value,
    completed: false,
  };

  tasks.value.push(newTask);
  newTaskDescription.value = '';
};

const handleComplete = (id: number) => {
  
  tasks.value = tasks.value.map((task) =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
 
  const updatedTaskIndex = tasks.value.findIndex((task) => task.id === id);
  
  if (updatedTaskIndex !== -1) {
    
    const updatedTask = tasks.value.splice(updatedTaskIndex, 1)[0];
   
    tasks.value.push(updatedTask);
  }
};

const handleRemove = (id: number) => {
  tasks.value = tasks.value.filter((task) => task.id !== id);
};
</script>
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

      <div class="text-text-gray-100 justify-between mt-[64px] w-[736px]">
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
