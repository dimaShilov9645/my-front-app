<template>
  <section class="overflow-hidden rounded-2xl border border-white/10 bg-[#121d2b]">
    <div
      class="relative overflow-hidden border-b border-white/10 bg-gradient-to-br from-[#244564] via-[#162c43] to-[#111b29] p-6 sm:p-8"
    >
      <div
        aria-hidden="true"
        class="pointer-events-none absolute -right-12 -top-20 h-64 w-64 rounded-full border-[35px] border-sky-300/5"
      />

      <span
        class="relative inline-flex rounded-md border border-white/15 bg-black/15 px-3 py-1 text-xs font-semibold tracking-widest text-sky-100"
      >
        STEAM
      </span>

      <h2 class="relative mt-6 text-2xl font-bold sm:text-3xl">
        {{ order?.productName }}
      </h2>

      <p class="relative mt-3 text-sm text-slate-300">Цифровой товар · Ключ активации</p>
    </div>

    <div class="p-6 sm:p-8">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <span class="text-sm text-slate-400">Статус заказа</span>

        <span
          role="status"
          class="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium ring-1 ring-inset"
          :class="statusInfo?.color"
        >
          <span class="h-1.5 w-1.5 rounded-full bg-current" />
          {{ statusInfo?.title }}
        </span>
      </div>

      <p class="mt-4 text-sm leading-6 text-slate-400">
        {{ statusInfo?.description }}
      </p>

      <ol class="mt-7 grid gap-4 sm:grid-cols-3">
        <li v-for="(step, index) in steps" :key="step.title" class="flex items-center gap-3">
          <span
            class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold"
            :class="
              step.done
                ? 'bg-sky-400 text-[#0b111b]'
                : 'bg-white/5 text-slate-500 ring-1 ring-white/10'
            "
          >
            {{ step.done ? '✓' : index + 1 }}
          </span>

          <span class="text-xs leading-5" :class="step.done ? 'text-slate-200' : 'text-slate-500'">
            {{ step.title }}
          </span>
        </li>
      </ol>
    </div>
  </section>
</template>

<script setup lang="ts">
import { inject } from 'vue'
import type { OrderModel } from '@/components/order/contrellers/orderModel.ts'

const orderModel = inject('OrderModel') as OrderModel
const { steps, statusInfo, order } = orderModel
</script>

<style scoped></style>
