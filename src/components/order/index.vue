<template>
  <div>
    <p class="text-xs font-semibold uppercase tracking-[0.25em] text-sky-400">Steam / Ваш заказ</p>

    <h1 class="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
      {{ isDelivered ? 'Ваша следующая игра готова' : 'Ещё один шаг до игры' }}
    </h1>

    <p class="mt-3 max-w-xl text-sm leading-6 text-slate-400">
      Здесь появится ключ активации после подтверждения оплаты. Сохраните ссылку, чтобы вернуться к
      заказу.
    </p>

    <div
      v-if="loading"
      role="status"
      class="mt-8 rounded-2xl border border-white/10 bg-white/5 p-8"
    >
      <div class="h-5 w-48 rounded bg-white/10 motion-safe:animate-pulse" />
      <div class="mt-5 h-24 rounded-xl bg-white/5 motion-safe:animate-pulse" />
      <p class="mt-5 text-sm text-slate-400">Загружаем заказ…</p>
    </div>

    <p
      v-if="error"
      role="alert"
      class="mt-6 rounded-xl border border-rose-400/20 bg-rose-400/10 p-4 text-sm text-rose-200"
    >
      {{ error }}
    </p>

    <div
      v-if="!loading && order && statusInfo"
      class="mt-8 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]"
    >
      <div class="min-w-0 space-y-6">
        <OrderStatusForm />
        <OrderKeyForm :code="order?.delivery?.productKey.code" />
      </div>
      <OrderRightForm />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, provide } from 'vue'
import orderModel from '@/components/order/contrellers/orderModel.js'

import OrderKeyForm from '@/components/order/components/OrderKeyForm.vue'
import OrderStatusForm from '@/components/order/components/OrderStatusForm.vue'
import OrderRightForm from '@/components/order/components/OrderRightForm.vue'

const useOrderModel = orderModel()

const { loading, error, order, isDelivered, statusInfo, initialization } = useOrderModel

provide('OrderModel', useOrderModel)

onMounted(initialization)
</script>

<style scoped></style>
