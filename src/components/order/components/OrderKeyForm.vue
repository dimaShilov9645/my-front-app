<template>
  <section
    class="rounded-2xl border p-6 sm:p-8"
    :class="isDelivered ? 'border-emerald-400/25 bg-emerald-400/5' : 'border-white/10 bg-[#121d2b]'"
  >
    <div class="flex items-center justify-between gap-3">
      <h2 class="text-lg font-semibold">Ключ активации</h2>

      <span v-if="isDelivered" class="text-xs font-medium text-emerald-300">
        Готов к использованию
      </span>
    </div>

    <template v-if="isDelivered && props.code">
      <div
        class="mt-5 flex flex-col gap-4 rounded-xl border border-emerald-300/15 bg-black/20 p-5 sm:flex-row sm:items-center sm:justify-between"
      >
        <code
          class="select-all break-all font-mono text-xl font-bold tracking-wider text-emerald-200"
        >
          {{ props.code }}
        </code>

        <button
          type="button"
          class="shrink-0 rounded-lg bg-emerald-300 px-4 py-2.5 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-200"
          @click="copyKey"
        >
          Скопировать
        </button>
      </div>

      <p v-if="copyMessage" role="status" class="mt-3 text-sm text-emerald-200">
        {{ copyMessage }}
      </p>

      <p class="mt-4 text-sm leading-6 text-slate-400">
        Активируйте ключ в клиенте Steam через пункт «Добавить игру» → «Активировать в Steam».
      </p>
    </template>

    <div
      v-else
      class="mt-5 rounded-xl border border-dashed border-white/15 bg-black/10 px-5 py-8 text-center"
    >
      <p class="text-sm text-slate-300">Ключ пока не выдан</p>
      <p class="mt-2 text-xs leading-5 text-slate-500">Данные обновляются автоматически.</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { inject, ref } from 'vue'
import type { OrderModel } from '@/components/order/contrellers/orderModel.ts'

interface Props {
  code: string | undefined
}
const props = defineProps<Props>()

const copyMessage = ref('')

const orderModel = inject('OrderModel') as OrderModel
const { isDelivered, pageController } = orderModel

async function copyKey() {
  if (!props.code) return
  try {
    await navigator.clipboard.writeText(props.code)

    if (pageController.signal.aborted) {
      copyMessage.value = 'Ключ скопирован'
    }
  } catch {
    if (!pageController.signal.aborted) {
      copyMessage.value = 'Выделите ключ и скопируйте вручную'
    }
  }
}
</script>

<style scoped></style>
