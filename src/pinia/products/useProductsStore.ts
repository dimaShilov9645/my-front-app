import type ProductsStoreInterface from '@/pinia/products/ProductsStoreInterface.ts'
import { defineStore } from 'pinia'
import { useBaseApi } from '@/api/BaseApi.ts'
import { type Ref, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { Api_Payment_Webhook_Dto, Api_Product_Dto } from '@/api/types/typesApi.ts'

type ConnectionStatus = 'connecting' | 'connected' | 'reconnecting' | 'closed'

export const useProductsStore = defineStore('app-products', (): ProductsStoreInterface => {
  const router = useRouter()
  const api = useBaseApi()

  const productsList: Ref<Api_Product_Dto[]> = ref([])

  const connectionStatus = ref<ConnectionStatus>('closed')

  let eventSource: EventSource | null = null
  let connectedOnce = false

  const storageKey: Ref<string | null> = ref(null)

  function deleteIdempotencyKey() {
    if (!storageKey.value) return
    sessionStorage.removeItem(storageKey.value)
  }

  async function getProducts() {
    const response = await api.get<Api_Product_Dto[]>('/products')

    productsList.value = response.data

    return response.data
  }

  async function getProduct(id: string) {
    const response = await api.get<Api_Product_Dto>(`/products/${id}`)
    return response.data
  }

  async function createOrder(product: Api_Product_Dto, test?: boolean) {
    storageKey.value = `pending-purchase:${product.id}`

    try {
      let idempotencyKey = sessionStorage.getItem(storageKey.value)

      if (!idempotencyKey) {
        idempotencyKey = crypto.randomUUID()
        sessionStorage.setItem(storageKey.value, idempotencyKey)
      }
      const response = await api.post('/orders', {
        productId: product.id,
        idempotencyKey,
        expectedPrice: product.price,
      })
      if (!test) {
        await router.push({
          name: 'order',
          params: { id: response.data.id },
        })
      }

      return response.data
    } catch (error) {
      console.error(error)
    }
  }

  async function getOrder(id: string, signal?: any) {
    const response = await api.get(`/orders/${encodeURIComponent(id)}`, { signal })

    return response.data
  }

  async function sendPaymentWebhook(payload: Api_Payment_Webhook_Dto, signal: any) {
    const response = await api.post(`/webhook/payment`, payload, { signal })
    return response.data
  }

  function applyProductUpdate(incomingProduct: Api_Product_Dto): void {
    const index = productsList.value.findIndex((product) => product.id === incomingProduct.id)

    if (index === -1) {
      productsList.value.push(incomingProduct)
      return
    }

    const currentProduct = productsList.value[index]

    // Повторное или устаревшее событие игнорируем.
    if (incomingProduct.version <= currentProduct.version) {
      return
    }

    productsList.value[index] = incomingProduct
  }

  function removeProduct(productId: string): void {
    productsList.value = productsList.value.filter((product) => product.id !== productId)
  }

  function connectEvents(): void {
    if (eventSource) {
      return
    }

    connectionStatus.value = 'connecting'

    eventSource = new EventSource(`${import.meta.env.VITE_API_BASE}/catalog/events`)

    eventSource.addEventListener('connected', () => {
      connectionStatus.value = 'connected'

      if (connectedOnce) {
        void getProducts()
      }

      connectedOnce = true
    })

    eventSource.addEventListener('product.updated', (event) => {
      try {
        const product = JSON.parse((event as MessageEvent<string>).data) as Api_Product_Dto

        applyProductUpdate(product)
      } catch {
        console.error('Получено некорректное событие product.updated')
      }
    })

    eventSource.addEventListener('product.removed', (event) => {
      try {
        const data = JSON.parse((event as MessageEvent<string>).data) as {
          productId: string
        }

        removeProduct(data.productId)
      } catch {
        console.error('Получено некорректное событие product.removed')
      }
    })

    eventSource.onerror = () => {
      connectionStatus.value = 'reconnecting'
    }
  }

  function disconnectEvents(): void {
    eventSource?.close()
    eventSource = null
    connectedOnce = false
    connectionStatus.value = 'closed'
  }

  return {
    productsList,
    createOrder,
    connectEvents,
    getProducts,
    getProduct,
    getOrder,
    sendPaymentWebhook,
    deleteIdempotencyKey,
    disconnectEvents,
  }
})
