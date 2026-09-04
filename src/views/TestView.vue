<template>
  <main class="mx-auto max-w-3xl px-4 py-10">
    <h1 class="text-3xl font-bold">Проверка параллельных запросов</h1>

    <p class="mt-2 text-sm text-gray-500">
      Используйте товар, у которого есть хотя бы один свободный ключ.
    </p>

    <label class="mt-6 block">
      <span class="text-sm font-medium"> UUID товара </span>

      <input
        v-model.trim="productId"
        type="text"
        placeholder="29ba8c47-bdc5-4a37-901a-d64ce2df5abe"
        :disabled="running"
        class="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-violet-500"
      />
    </label>

    <button
      type="button"
      :disabled="running || !productId"
      class="mt-4 rounded-xl bg-violet-600 px-5 py-3 font-medium text-white hover:bg-violet-700 disabled:opacity-50"
      @click="runTest"
    >
      {{ running ? 'Тест выполняется…' : 'Запустить тест' }}
    </button>

    <section v-if="logs.length" class="mt-6 rounded-xl bg-gray-950 p-5 text-sm text-gray-200">
      <p
        v-for="(message, index) in logs"
        :key="index"
        class="font-mono"
        :class="{
          'text-green-400': message.startsWith('OK'),
          'text-red-400': message.startsWith('ОШИБКА'),
        }"
      >
        {{ message }}
      </p>
    </section>

    <section v-if="result?.delivery" class="mt-6 rounded-xl bg-green-50 p-5">
      <p class="font-medium text-green-900">Выданный ключ</p>

      <code class="mt-2 block text-lg text-green-800">
        {{ result.delivery.productKey.code }}
      </code>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import { useProductsStore } from '@/pinia/products/useProductsStore.ts'

import type { Api_Order_Dto, Api_Payment_Webhook_Dto } from '@/api/types/typesApi.ts'

const { createOrder, getOrder, sendPaymentWebhook } = useProductsStore()

const productId = ref('')
const running = ref(false)
const logs = ref<string[]>([])
const result = ref<Api_Order_Dto | null>(null)

function log(message: string) {
  logs.value.push(message)
}

function sleep(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms)
  })
}

async function parallel<T>(requests: Promise<T>[]) {
  const results = await Promise.allSettled(requests)

  const errors: unknown[] = []
  const values: Awaited<T>[] = []

  for (const result of results) {
    if (result.status === 'rejected') {
      errors.push(result.reason)
    } else {
      values.push(result.value)
    }
  }

  if (errors.length > 0) {
    throw new AggregateError(errors, `Не выполнено запросов: ${errors.length}`)
  }

  return values
}

async function waitForFinalStatus(orderId: string): Promise<Api_Order_Dto> {
  const deadline = Date.now() + 60_000

  while (Date.now() < deadline) {
    const order = await getOrder(orderId)

    log(`Текущий статус: ${order.status}`)

    if (
      order.status === 'delivered' ||
      order.status === 'payment_failed' ||
      order.status === 'out_of_stock' ||
      order.status === 'delivery_failed'
    ) {
      return order
    }

    await sleep(500)
  }

  throw new Error('Заказ не перешёл в финальное состояние за 60 секунд')
}

async function runTest() {
  if (!productId.value) {
    log('Укажи UUID товара')
    return
  }

  running.value = true
  logs.value = []
  result.value = null

  try {
    /*
     * Проверка №1:
     * 50 одновременных нажатий "Купить".
     */
    log('Отправляем 50 запросов создания заказа…')

    const orders = await parallel(
      Array.from({ length: 50 }, () => createOrder(productId.value, true)),
    )

    debugger

    const orderIds = new Set(orders.map((order) => order.id))

    if (orderIds.size !== 1) {
      throw new Error(`Создано разных заказов: ${orderIds.size}`)
    }

    const orderId = orders[0]!.id

    log(`OK: все запросы вернули один заказ ${orderId}`)

    /*
     * Получаем сумму только от сервера.
     * Не передаём цену товара с формы.
     */
    const createdOrder = await getOrder(orderId)

    /*
     * Проверка №2:
     * 50 разных событий paid для одного заказа.
     */
    log('Отправляем 50 разных webhook одновременно…')

    const createdAt = new Date().toISOString()

    const webhooks: Api_Payment_Webhook_Dto[] = Array.from({ length: 50 }, () => ({
      event_id: `evt_${crypto.randomUUID()}`,
      order_id: createdOrder.id,
      status: 'paid',
      amount: createdOrder.amount / 100,
      currency: createdOrder.currency,
      created_at: createdAt,
    }))

    const webhookResponses = await parallel(
      webhooks.map((payload) => sendPaymentWebhook(payload, AbortSignal.timeout(10_000))),
    )

    if (!webhookResponses.every((response) => response.accepted)) {
      throw new Error('Не все события оплаты были приняты')
    }

    log('OK: все 50 событий приняты')

    /*
     * Ждём фоновый PaymentProcessorService.
     */
    const completedOrder = await waitForFinalStatus(orderId)

    result.value = completedOrder

    if (completedOrder.status !== 'delivered' || !completedOrder.delivery) {
      throw new Error(`Ключ не выдан. Статус: ${completedOrder.status}`)
    }

    const issuedCode = completedOrder.delivery.productKey.code

    log(`OK: ключ выдан — ${issuedCode}`)

    /*
     * Проверка №3:
     * 50 повторов одного и того же event_id.
     */
    log('Повторяем один webhook 50 раз…')

    const repeatedWebhook = webhooks[0]!

    const repeatedResponses = await parallel(
      Array.from({ length: 50 }, () =>
        sendPaymentWebhook(repeatedWebhook, AbortSignal.timeout(10_000)),
      ),
    )

    const duplicates = repeatedResponses.filter((response) => response.duplicate).length

    if (duplicates !== 50) {
      throw new Error(`Ожидалось 50 дубликатов, получено ${duplicates}`)
    }

    const orderAfterRepeat = await getOrder(orderId)

    if (orderAfterRepeat.delivery?.productKey.code !== issuedCode) {
      throw new Error('После повторных webhook изменился выданный ключ')
    }

    result.value = orderAfterRepeat

    log('OK: все повторы распознаны как дубликаты')
    log('OK: выданный ключ не изменился')
    log('Тест успешно завершён')
  } catch (error: unknown) {
    console.error(error)

    log(error instanceof Error ? `ОШИБКА: ${error.message}` : 'ОШИБКА: неизвестная ошибка')
  } finally {
    running.value = false
  }
}
</script>
