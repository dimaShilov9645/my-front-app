import type ProductsStoreInterface from '@/pinia/products/ProductsStoreInterface.ts'
import { defineStore } from 'pinia'
import { useBaseApi } from '@/api/BaseApi.ts'
import { type Ref, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { PaymentWebhook } from '@/api/types/typesApi.ts'

export const useProductsStore = defineStore('app-products', (): ProductsStoreInterface => {
  const router = useRouter()
  const api = useBaseApi()

  const productsList = ref([])

  const storageKey: Ref<string | null> = ref(null)

  function deleteIdempotencyKey() {
    if (!storageKey.value) return
    sessionStorage.removeItem(storageKey.value)
  }

  async function getProducts() {
    const response = await api.get('/products')
    console.log(response)
    productsList.value = response.data
    return response.data
  }

  async function createOrder(productId: string) {
    storageKey.value = `pending-purchase:${productId}`

    try {
      let idempotencyKey = sessionStorage.getItem(storageKey.value)

      if (!idempotencyKey) {
        idempotencyKey = crypto.randomUUID()
        sessionStorage.setItem(storageKey.value, idempotencyKey)
      }
      const response = await api.post('/orders', { productId, idempotencyKey })
      await router.push({
        name: 'order',
        params: { id: response.data.id },
      })
      console.log(response)
    } catch (error) {
      console.error(error)
    }
  }

  async function getOrder(id: string, signal?: any) {
    const response = await api.get(`/orders/${encodeURIComponent(id)}`, { signal })

    return response.data
  }

  async function sendPaymentWebhook(payload: PaymentWebhook, signal: any) {
    const response = await api.post(`/webhook/payment`, payload, { signal })
    return response.data
  }

  return {
    productsList,
    createOrder,
    getProducts,
    getOrder,
    sendPaymentWebhook,
    deleteIdempotencyKey,
  }
})
