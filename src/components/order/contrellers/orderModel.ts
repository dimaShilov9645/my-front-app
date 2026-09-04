import { computed, type ComputedRef, type Ref, ref, watch } from 'vue'
import type { Api_Order_Dto, Api_Payment_Webhook_Dto, ApiError } from '@/api/types/typesApi.ts'
import { statuses } from '@/components/order/helpers/statusesList.ts'
import { useProductsStore } from '@/pinia/products/useProductsStore.ts'
import { useRoute } from 'vue-router'

export interface OrderModel {
  pageController: AbortController
  loading: Ref<boolean>
  paymentLoading: Ref<boolean>
  paymentAccepted: Ref<boolean>
  paymentEvent: Ref<Api_Payment_Webhook_Dto | null>
  paymentError: Ref<string>
  error: Ref<string>
  order: Ref<Api_Order_Dto | null>
  steps: ComputedRef<{ title: string; done: boolean }[]>
  isDelivered: ComputedRef<boolean>
  statusInfo: ComputedRef<StatusInfo | null>
  simulatePayment(status: 'paid' | 'failed'): Promise<void>
  initialization(): Promise<void>
}

export type StatusInfo = {
  title: string
  description: string
  color: string
}

export default function (): OrderModel {
  const route = useRoute()

  const { getOrder, sendPaymentWebhook, deleteIdempotencyKey } = useProductsStore()

  let pageController = new AbortController()
  let timer: ReturnType<typeof setTimeout> | undefined

  const loading = ref(true)
  const paymentLoading = ref(false)
  const paymentAccepted = ref(false)

  const paymentEvent = ref<Api_Payment_Webhook_Dto | null>(null)
  const paymentError = ref('')
  const error = ref('')
  const order = ref<Api_Order_Dto | null>(null)
  const currentOrderId: Ref<string | null> = ref(null)

  const statusInfo = computed(() => (order.value ? statuses[order.value.status] : null))
  const isDelivered = computed(() => order.value?.status === 'delivered')

  const isPaid = computed(
    () =>
      order.value !== null &&
      order.value.status !== 'created' &&
      order.value.status !== 'payment_failed',
  )

  const steps = computed(() => [
    { title: 'Заказ создан', done: true },
    { title: 'Оплата подтверждена', done: isPaid.value },
    { title: 'Ключ получен', done: isDelivered.value },
  ])

  async function simulatePayment(status: 'paid' | 'failed') {
    if (
      !order.value ||
      order.value.status !== 'created' ||
      paymentLoading.value ||
      paymentAccepted.value
    )
      return

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

      const response = await sendPaymentWebhook(paymentEvent.value, pageController.signal)

      if (pageController.signal.aborted) return

      if (!response.accepted) {
        throw new Error('Событие оплаты не принято')
      }

      paymentAccepted.value = true
    } catch (err: unknown) {
      if (pageController.signal.aborted) return

      paymentError.value = err instanceof Error ? err.message : 'Не удалось отправить платёж'
    } finally {
      if (!pageController.signal.aborted) {
        setTimeout(() => (paymentLoading.value = false), 1000)
      }
    }
  }

  function clear() {
    order.value = null
    loading.value = true
    error.value = ''
    paymentLoading.value = false
    paymentAccepted.value = false
    paymentError.value = ''
    paymentEvent.value = null
  }

  async function refreshOrder() {
    let continuePolling = true

    try {
      if (!currentOrderId.value) return
      const result = await getOrder(currentOrderId.value, pageController.signal)

      if (pageController.signal.aborted) return

      order.value = result
      error.value = ''

      continuePolling = result.status !== 'delivered' && result.status !== 'payment_failed'
      if (continuePolling) deleteIdempotencyKey()
    } catch (err: ApiError | any) {
      if (pageController.signal.aborted) return

      error.value = err instanceof Error ? err.message : 'Не удалось загрузить заказ'

      if (err && (err.status === 400 || err.status === 404)) {
        continuePolling = false
      }
    } finally {
      if (!pageController.signal.aborted) {
        setTimeout(() => (loading.value = false), 1000)
      }
      if (!pageController.signal.aborted && continuePolling) {
        timer = setTimeout(() => void refreshOrder(), 2000)
      }
    }
  }

  watch(
    () => route.params.id,
    (_, _oldId, onCleanup) => {
      onCleanup(() => {
        if (timer !== undefined) clearTimeout(timer)
      })
    },
    { immediate: true },
  )

  async function initialization() {
    pageController.abort()
    pageController = new AbortController()
    clear()
    if (!route.params.id) {
      error.value = 'Некорректный адрес заказа'
      loading.value = false
      return
    }

    currentOrderId.value = route.params.id as string

    await refreshOrder()
  }

  return {
    pageController,
    loading,
    paymentLoading,
    paymentAccepted,
    paymentEvent,
    paymentError,
    error,
    order,
    steps,
    isDelivered,
    statusInfo,
    simulatePayment,
    initialization,
  }
}
