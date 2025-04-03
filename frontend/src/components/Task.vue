<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { PhTrash } from '@phosphor-icons/vue';
import { defineProps } from 'vue';
import type { TaskProps } from './types';

const { onComplete, onRemove, completed, description } = defineProps<TaskProps>();

function onClick() {
  onComplete();
}

function handleRemove() {
  onRemove();
}
</script>

<template>
  <form class="flex flex-row justify-between bg-box-gray-500 px-[16px] border border-color2 has-checked:border-box-gray-500 rounded-lg p-[16px] mb-[12px]">
    <label class="inline-flex relative" htmlFor="input">
      <input
        id="input"
        type="checkbox"
        class="before:content[''] peer cursor-pointer appearance-none transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-color2 before:opacity-0 before:transition-opacity checked:border-color2 checked:bg-color2 checked:before:bg-color2 w-[17.45px] h-[17.45px] mt-[2px] border-2 border-color1 rounded-full peer/check"
        :checked="completed"
        @change="onClick"
      />
      <div class="pointer-events-none absolute top-[10px] left-[9px] -translate-y-2/4 -translate-x-2/4 text-text-gray-100 opacity-0 transition-opacity peer-checked:opacity-100">
        <svg class="mt-[2px]" width="10" height="7" viewBox="0 0 10 7" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8.43059 0.342154L4.09865 4.67409L1.61618 2.19162L0.780273 3.02753L4.09865 6.3459L9.26649 1.17806L8.43059 0.342154Z" fill="#F2F2F2"/>
        </svg>
      </div>
      <span class="px-[12px] text-text-gray-100 text-[14px] peer-checked/check:text-text-gray-300 peer-checked/check:line-through">{{ description }}</span>
    </label>
    <button 
      class="w-[24px] h-[24px] text-text-gray-300 flex items-center justify-center rounded hover:text-danger cursor-pointer"
      @click="handleRemove"
    >
      <PhTrash size="18"/>
    </button>
  </form>
</template>
