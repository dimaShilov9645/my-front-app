import type { Ref } from 'vue'
import type { PaymentWebhook } from '@/api/types/typesApi.ts'

export default interface ProductsStoreInterface {
  productsList: Ref<any[]>
  getProducts(): Promise<any[]>
  createOrder(productId: string): Promise<any>
  getOrder(id: string, signal?: any): Promise<any>
  sendPaymentWebhook(payload: PaymentWebhook, signal: any): Promise<any>
  deleteIdempotencyKey(): void
}
