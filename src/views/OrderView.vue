<template>
  <div class="min-h-screen bg-[#0b111b] text-slate-100">
    <!-- Верхняя панель -->
    <header class="border-b border-white/10 bg-[#101824]">
      <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
        <RouterLink to="/" class="flex items-center gap-3">
          <span
            class="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-400 text-[#0b111b]"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              class="h-6 w-6"
              aria-hidden="true"
            >
              <path
                d="M8 7h8a4 4 0 0 1 4 3l1 6a2.5 2.5 0 0 1-4 2l-3-2h-4l-3 2a2.5 2.5 0 0 1-4-2l1-6a4 4 0 0 1 4-3Z"
              />
              <path d="M7 10v4m-2-2h4" />
              <circle cx="16" cy="11" r=".7" fill="currentColor" />
              <circle cx="18" cy="13" r=".7" fill="currentColor" />
            </svg>
          </span>

          <span class="text-lg font-bold tracking-tight">
            GAME<span class="text-sky-400">STORE</span>
          </span>
        </RouterLink>

        <RouterLink to="/" class="text-sm text-slate-400 transition hover:text-white">
          <span aria-hidden="true">←</span> В каталог
        </RouterLink>
      </div>
    </header>

    <main class="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <p class="text-xs font-semibold uppercase tracking-[0.25em] text-sky-400">
        Steam / Ваш заказ
      </p>

      <h1 class="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
        {{ isDelivered ? 'Ваша следующая игра готова' : 'Ещё один шаг до игры' }}
      </h1>

      <p class="mt-3 max-w-xl text-sm leading-6 text-slate-400">
        Здесь появится ключ активации после подтверждения оплаты. Сохраните ссылку, чтобы вернуться
        к заказу.
      </p>

      <!-- Загрузка -->
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
        v-if="order && statusInfo"
        class="mt-8 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]"
      >
        <div class="min-w-0 space-y-6">
          <!-- Товар -->
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
                {{ order.productName }}
              </h2>

              <p class="relative mt-3 text-sm text-slate-300">Цифровой товар · Ключ активации</p>
            </div>

            <div class="p-6 sm:p-8">
              <div class="flex flex-wrap items-center justify-between gap-3">
                <span class="text-sm text-slate-400">Статус заказа</span>

                <span
                  role="status"
                  class="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium ring-1 ring-inset"
                  :class="statusInfo.color"
                >
                  <span class="h-1.5 w-1.5 rounded-full bg-current" />
                  {{ statusInfo.title }}
                </span>
              </div>

              <p class="mt-4 text-sm leading-6 text-slate-400">
                {{ statusInfo.description }}
              </p>

              <ol class="mt-7 grid gap-4 sm:grid-cols-3">
                <li
                  v-for="(step, index) in steps"
                  :key="step.title"
                  class="flex items-center gap-3"
                >
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

                  <span
                    class="text-xs leading-5"
                    :class="step.done ? 'text-slate-200' : 'text-slate-500'"
                  >
                    {{ step.title }}
                  </span>
                </li>
              </ol>
            </div>
          </section>

          <!-- Ключ -->
          <section
            class="rounded-2xl border p-6 sm:p-8"
            :class="
              isDelivered
                ? 'border-emerald-400/25 bg-emerald-400/5'
                : 'border-white/10 bg-[#121d2b]'
            "
          >
            <div class="flex items-center justify-between gap-3">
              <h2 class="text-lg font-semibold">Ключ активации</h2>

              <span v-if="isDelivered" class="text-xs font-medium text-emerald-300">
                Готов к использованию
              </span>
            </div>

            <template v-if="isDelivered && order.delivery">
              <div
                class="mt-5 flex flex-col gap-4 rounded-xl border border-emerald-300/15 bg-black/20 p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <code
                  class="select-all break-all font-mono text-xl font-bold tracking-wider text-emerald-200"
                >
                  {{ order.delivery.productKey.code }}
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
                Активируйте ключ в клиенте Steam через пункт «Добавить игру» → «Активировать в
                Steam».
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
        </div>

        <!-- Правая колонка -->
        <aside class="space-y-5 lg:sticky lg:top-6">
          <section class="rounded-2xl border border-white/10 bg-[#121d2b] p-6">
            <h2 class="text-lg font-semibold">Детали заказа</h2>

            <dl class="mt-6 space-y-5 text-sm">
              <div>
                <dt class="text-slate-500">Номер заказа</dt>
                <dd class="mt-1.5 break-all font-mono text-xs text-slate-300">
                  {{ order.id }}
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
              v-if="order.status === 'payment_failed'"
              to="/"
              class="mt-6 block rounded-xl bg-sky-400 px-4 py-3 text-center text-sm font-semibold text-slate-950 transition hover:bg-sky-300"
            >
              Вернуться в каталог
            </RouterLink>
          </section>

          <section
            v-if="order.status === 'created'"
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
            Для активации потребуется аккаунт Steam. Учитывайте условия и регион активации
            приобретённого товара.
          </p>
        </aside>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

import type { ApiError, Order, OrderStatus, PaymentWebhook } from '@/api/types/typesApi.ts'
import { useProductsStore } from '@/pinia/products/useProductsStore.ts'

const { getOrder, sendPaymentWebhook } = useProductsStore()

const route = useRoute()

const order = ref<Order | null>(null)
const loading = ref(true)
const error = ref('')

const paymentLoading = ref(false)
const paymentAccepted = ref(false)
const paymentError = ref('')
const paymentEvent = ref<PaymentWebhook | null>(null)
const copyMessage = ref('')

let pageController = new AbortController()

const statuses: Record<OrderStatus, { title: string; description: string; color: string }> = {
  created: {
    title: 'Ожидает оплаты',
    description: 'Заказ создан. Подтвердите оплату, чтобы получить ключ.',
    color: 'bg-amber-400/10 text-amber-300 ring-amber-400/20',
  },
  paid: {
    title: 'Оплата подтверждена',
    description: 'Готовим ключ для вашего заказа.',
    color: 'bg-sky-400/10 text-sky-300 ring-sky-400/20',
  },
  delivering: {
    title: 'Выдаём ключ',
    description: 'Получаем и закрепляем ключ за вашим заказом.',
    color: 'bg-sky-400/10 text-sky-300 ring-sky-400/20',
  },
  delivered: {
    title: 'Заказ выполнен',
    description: 'Ваш ключ готов. Скопируйте его и активируйте в Steam.',
    color: 'bg-emerald-400/10 text-emerald-300 ring-emerald-400/20',
  },
  payment_failed: {
    title: 'Оплата не прошла',
    description: 'Ключ не выдан. Для новой покупки создайте новый заказ.',
    color: 'bg-rose-400/10 text-rose-300 ring-rose-400/20',
  },
  out_of_stock: {
    title: 'Ожидаем поступления ключей',
    description: 'Оплата подтверждена. Сейчас свободных ключей нет.',
    color: 'bg-amber-400/10 text-amber-300 ring-amber-400/20',
  },
  delivery_failed: {
    title: 'Выдача задерживается',
    description: 'Оплата подтверждена, но требуется повторная выдача.',
    color: 'bg-amber-400/10 text-amber-300 ring-amber-400/20',
  },
}

const statusInfo = computed(() => (order.value ? statuses[order.value.status] : null))

const isPaid = computed(
  () =>
    order.value !== null &&
    order.value.status !== 'created' &&
    order.value.status !== 'payment_failed',
)

const isDelivered = computed(() => order.value?.status === 'delivered')

const steps = computed(() => [
  { title: 'Заказ создан', done: true },
  { title: 'Оплата подтверждена', done: isPaid.value },
  { title: 'Ключ получен', done: isDelivered.value },
])

watch(
  () => route.params.id,
  (id, _oldId, onCleanup) => {
    const controller = new AbortController()
    pageController = controller

    let timer: ReturnType<typeof setTimeout> | undefined

    order.value = null
    loading.value = true
    error.value = ''
    paymentLoading.value = false
    paymentAccepted.value = false
    paymentError.value = ''
    paymentEvent.value = null
    copyMessage.value = ''

    onCleanup(() => {
      controller.abort()
      if (timer !== undefined) clearTimeout(timer)
    })

    if (typeof id !== 'string') {
      error.value = 'Некорректный адрес заказа'
      loading.value = false
      return
    }

    const orderId = id

    async function refresh() {
      let continuePolling = true

      try {
        const result = await getOrder(orderId, controller.signal)

        if (controller.signal.aborted) return

        order.value = result
        error.value = ''

        continuePolling = result.status !== 'delivered' && result.status !== 'payment_failed'
      } catch (err: ApiError | any) {
        if (controller.signal.aborted) return

        error.value = err instanceof Error ? err.message : 'Не удалось загрузить заказ'

        if (err && (err.status === 400 || err.status === 404)) {
          continuePolling = false
        }
      } finally {
        if (!controller.signal.aborted) {
          loading.value = false

          if (continuePolling) {
            timer = setTimeout(() => void refresh(), 2000)
          }
        }
      }
    }

    refresh()
  },
  { immediate: true },
)

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

async function simulatePayment(status: 'paid' | 'failed') {
  if (
    !order.value ||
    order.value.status !== 'created' ||
    paymentLoading.value ||
    paymentAccepted.value
  ) {
    return
  }

  const controller = pageController

  paymentLoading.value = true
  paymentError.value = ''

  try {
    if (!paymentEvent.value) {
      paymentEvent.value = {
        event_id: `evt_${crypto.randomUUID()}`,
        order_id: order.value.id,
        status,
        amount: order.value.amount / 100,
        currency: order.value.currency,
        created_at: new Date().toISOString(),
      }
    }

    const response = await sendPaymentWebhook(paymentEvent.value, controller.signal)

    if (controller.signal.aborted) return

    if (!response.accepted) {
      throw new Error('Событие оплаты не принято')
    }

    paymentAccepted.value = true
  } catch (err: unknown) {
    if (controller.signal.aborted) return

    paymentError.value = err instanceof Error ? err.message : 'Не удалось отправить платёж'
  } finally {
    if (!controller.signal.aborted) {
      paymentLoading.value = false
    }
  }
}

async function copyKey() {
  const code = order.value?.delivery?.productKey.code
  if (!code) return

  const controller = pageController

  try {
    await navigator.clipboard.writeText(code)

    if (!controller.signal.aborted) {
      copyMessage.value = 'Ключ скопирован'
    }
  } catch {
    if (!controller.signal.aborted) {
      copyMessage.value = 'Выделите ключ и скопируйте вручную'
    }
  }
}
</script>
