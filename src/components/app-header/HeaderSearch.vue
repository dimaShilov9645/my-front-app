<template>
  <form
    role="search"
    aria-label="Поиск по каталогу"
    class="flex h-11 min-w-0 items-center overflow-hidden rounded-[10px] border-2 border-black bg-black focus-within:ring-2 focus-within:ring-slate-400 focus-within:ring-offset-2"
    @submit.prevent="submit"
  >
    <div class="flex h-full min-w-0 flex-1 items-center rounded-[8px] bg-white">
      <input
        :value="modelValue"
        type="search"
        name="query"
        aria-label="Игра, приложение или услуга"
        placeholder="Игра, приложение или услуга..."
        autocomplete="off"
        class="h-full w-full min-w-0 rounded-[8px] bg-transparent pl-3 pr-2 text-[12px] font-semibold tracking-[-0.36px] text-[#16181d] outline-none placeholder:text-[#76829b]"
        @input="updateQuery"
      />
      <button
        type="button"
        aria-label="Избранное"
        class="mr-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#eff1f5] text-[#76829b] transition-colors hover:bg-slate-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-black"
        @click="$emit('favorites')"
      >
        <HeaderIcon name="heart" class="h-[18px] w-[18px]" />
      </button>
    </div>
    <button
      type="submit"
      aria-label="Найти"
      class="flex h-10 w-10 shrink-0 items-center justify-center rounded-r-lg text-white transition-colors hover:bg-neutral-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:-outline-offset-4"
    >
      <HeaderIcon name="search" class="h-5 w-5" />
    </button>
  </form>
</template>

<script setup lang="ts">
import HeaderIcon from './icons/HeaderIcon.vue'

const props = defineProps<{ modelValue: string }>()
const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
  (event: 'search', query: string): void
  (event: 'favorites'): void
}>()

function updateQuery(event: Event) {
  emit('update:modelValue', (event.target as HTMLInputElement).value)
}

function submit() {
  const query = props.modelValue.trim()
  if (query) emit('search', query)
}
</script>
