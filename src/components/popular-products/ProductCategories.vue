<template>
  <div
    role="group"
    aria-label="Категории товаров"
    class="categories-scroll min-w-0 max-w-full overflow-x-auto overscroll-x-contain"
  >
    <div class="flex w-max items-center gap-2">
      <button
        v-for="category in categories"
        :key="category.id"
        type="button"
        :aria-pressed="modelValue === category.id"
        class="cursor-pointer flex h-[34px] shrink-0 items-center justify-center gap-[6px] whitespace-nowrap rounded-xl px-[14px] text-[13px] font-bold leading-5 transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#64748b] motion-reduce:transition-none"
        :class="
          modelValue === category.id
            ? 'bg-black text-white'
            : 'bg-[#f4f5f7] text-[#8a94a6] hover:bg-[#e8ecf1] hover:text-[#475569]'
        "
        @click="$emit('update:modelValue', category.id)"
      >
        <img
          :src="category.icon"
          :alt="category.label"
          class="block h-[14px] w-[14px] shrink-0"
          :class="{ 'brightness-0 invert': modelValue === category.id }"
        />
        <span>{{ category.label }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ProductCategory } from './helpers/types'
defineProps<{ modelValue: string; categories?: ProductCategory[] }>()
defineEmits<{ (event: 'update:modelValue', id: string): void }>()
</script>

<style scoped>
.categories-scroll {
  scrollbar-width: none;
}
.categories-scroll::-webkit-scrollbar {
  display: none;
}
</style>
