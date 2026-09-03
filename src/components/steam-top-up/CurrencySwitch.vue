<template>
  <fieldset class="m-0 flex shrink-0 items-center gap-[6px] border-0 p-0">
    <legend class="sr-only">Валюта пополнения</legend>
    <label v-for="option in currencies" :key="option.value" class="relative block cursor-pointer">
      <input
        type="radio"
        :name="name"
        :value="option.value"
        :checked="modelValue === option.value"
        :aria-label="option.label"
        class="peer sr-only"
        @change="$emit('update:modelValue', option.value)"
      />
      <span
        class="flex h-9 w-9 items-center justify-center rounded-lg bg-[#e8eaed] text-base font-bold leading-6 text-[#8a94a6] transition-colors duration-200 hover:bg-[#dce0e6] peer-checked:bg-black peer-checked:text-white peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-black peer-focus-visible:outline-offset-2 motion-reduce:transition-none"
        >{{ option.symbol }}</span
      >
    </label>
  </fieldset>
</template>

<script setup lang="ts">
import type { Currency } from './helpers/types'

defineProps<{ modelValue: Currency; name: string }>()
defineEmits<{ (event: 'update:modelValue', value: Currency): void }>()

const currencies: { value: Currency; symbol: string; label: string }[] = [
  { value: 'USD', symbol: '$', label: 'Доллары США ($)' },
  { value: 'KZT', symbol: '₸', label: 'Казахстанские тенге (₸)' },
  { value: 'RUB', symbol: '₽', label: 'Российские рубли (₽)' },
]
</script>
