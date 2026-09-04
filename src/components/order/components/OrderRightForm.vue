<template>
  <aside class="space-y-5 lg:sticky lg:top-6">
    <section class="rounded-2xl border border-white/10 bg-[#121d2b] p-6">
      <h2 class="text-lg font-semibold">Детали заказа</h2>

      <dl class="mt-6 space-y-5 text-sm">
        <div>
          <dt class="text-slate-500">Номер заказа</dt>
          <dd class="mt-1.5 break-all font-mono text-xs text-slate-300">
            {{ order?.id }}
          </dd>
        </div>

        <div>
          <dt class="text-slate-500">Дата создания</dt>
          <dd class="mt-1.5 text-slate-300">{{ date }}</dd>
        </div>

        <div class="flex justify-between gap-4">
          <dt class="text-slate-500">Количество</dt>
          <dd>1 шт.</dd>
        </div>
      </dl>

      <div class="mt-6 flex items-end justify-between gap-3 border-t border-white/10 pt-6">
        <span class="text-sm text-slate-400">Сумма заказа</span>
        <span class="text-2xl font-bold">{{ price }}</span>
      </div>

      <RouterLink
        v-if="order?.status === 'payment_failed'"
        to="/"
        class="mt-6 block rounded-xl bg-sky-400 px-4 py-3 text-center text-sm font-semibold text-slate-950 transition hover:bg-sky-300"
      >
        Вернуться в каталог
      </RouterLink>
    </section>

    <section
      v-if="order?.status === 'created'"
      class="rounded-2xl border border-sky-400/20 bg-sky-400/5 p-6"
    >
      <p class="text-sm font-semibold text-sky-200">Тестовая оплата</p>

      <p class="mt-2 text-xs leading-5 text-slate-400">
        Демонстрационный режим. Деньги не списываются.
      </p>

      <p
        v-if="paymentAccepted"
        role="status"
        class="mt-5 rounded-xl bg-sky-400/10 p-4 text-sm text-sky-200"
      >
        Событие принято. Ожидаем обновления статуса…
      </p>

      <div v-else class="mt-5 space-y-3">
        <template v-if="!paymentEvent">
          <button
            type="button"
            class="w-full rounded-xl bg-sky-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-300"
            @click="simulatePayment('paid')"
          >
            Оплатить — успех
          </button>

          <button
            type="button"
            class="w-full rounded-xl border border-white/10 px-4 py-3 text-sm text-slate-300 transition hover:bg-white/5"
            @click="simulatePayment('failed')"
          >
            Проверить отказ оплаты
          </button>
        </template>

        <button
          v-else
          type="button"
          :disabled="paymentLoading"
          class="w-full rounded-xl bg-sky-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-300 disabled:cursor-wait disabled:opacity-60"
          @click="simulatePayment(paymentEvent.status)"
        >
          {{ paymentLoading ? 'Отправляем…' : 'Повторить отправку' }}
        </button>
      </div>

      <p v-if="paymentError" role="alert" class="mt-3 text-sm text-rose-300">
        {{ paymentError }}
      </p>
    </section>

    <p class="px-2 text-xs leading-5 text-slate-500">
      Для активации потребуется аккаунт Steam. Учитывайте условия и регион активации приобретённого
      товара.
    </p>
  </aside>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { inject, computed } from 'vue'
import type { OrderModel } from '@/components/order/contrellers/orderModel.ts'

const orderModel = inject('OrderModel') as OrderModel
const { paymentLoading, paymentAccepted, paymentEvent, paymentError, order, simulatePayment } =
  orderModel

const date = computed(() => {
  if (!order.value) return ''

  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(order.value.createdAt))
})

const price = computed(() => {
  if (!order.value) return ''

  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: order.value.currency,
  }).format(order.value.amount)
})
</script>

<style scoped></style>
