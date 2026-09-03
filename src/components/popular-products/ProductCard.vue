<template>
  <article
    class="product-card flex min-w-0 flex-col rounded-[20px] bg-white shadow-[0_8px_24px_rgba(20,40,80,0.06)] ring-1 ring-transparent transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-[3px] hover:shadow-[0_14px_30px_rgba(20,40,80,0.14)] hover:ring-[#d7dde7] focus-within:-translate-y-[3px] focus-within:shadow-[0_14px_30px_rgba(20,40,80,0.14)] focus-within:ring-[#a0a8b5] motion-reduce:!transform-none motion-reduce:transition-none"
  >
    <div class="relative aspect-[228/153] w-full overflow-hidden rounded-t-[20px] bg-[#edf0f4]">
      <img
        src="@/assets/popular-products/card-img.png"
        :alt="product.name"
        :width="228"
        :height="153"
        class="pointer-events-none absolute select-none inset-0 h-full w-full object-cover"
        draggable="false"
        decoding="async"
      />
    </div>
    <div class="flex flex-1 flex-col p-[14px]">
      <h3
        class="h-7 text-[14px] font-bold leading-[14px] text-[#181c20]"
        :title="product.name"
        :aria-label="product.name"
      >
        💥{{ product.name }} 🔑
      </h3>
      <div class="mt-[10px] flex min-h-6 flex-wrap items-baseline gap-x-2">
        <span
          class="text-xl font-bold leading-6 text-[#4a9c2c]"
          :aria-label="`Цена ${formatPrice(product.price)} ${symbol}`"
          >{{ formatPrice(product.price) }} {{ symbol }}</span
        >
        <del class="text-xs font-bold leading-4 text-[#9aa3b3]"
          >{{ formatPrice(product.price + 1000) }} {{ symbol }}</del
        >
      </div>
      <button
        type="button"
        class="cursor-pointer mt-[10px] flex h-11 w-full items-center justify-center rounded-xl bg-black px-3 text-[13px] font-bold leading-5 text-white transition-colors duration-200 hover:bg-[#262626] focus-visible:outline focus-visible:outline-2 focus-visible:outline-black focus-visible:outline-offset-4 active:bg-[#404040] motion-reduce:transition-none"
        @click="emits('buy', product)"
      >
        Купить
      </button>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import type { Api_Product_Dto } from '@/api/types/typesApi.ts'

interface Props {
  product: Api_Product_Dto
}

const emits = defineEmits<{ (event: 'buy', product: Api_Product_Dto): void }>()
const props = defineProps<Props>()

const symbol = computed(() => props.product.currencySymbol ?? '₽')

const formatter = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2 })

function formatPrice(value: number) {
  return formatter.format(value)
}
</script>
