import type { Ref } from 'vue'
import type { Api_Payment_Webhook_Dto } from '@/api/types/typesApi.ts'

export default interface ProductsStoreInterface {
  productsList: Ref<any[]>
  getProducts(): Promise<any[]>
  createOrder(productId: string, test?: boolean): Promise<any>
  getOrder(id: string, signal?: any): Promise<any>
  sendPaymentWebhook(payload: Api_Payment_Webhook_Dto, signal: any): Promise<any>
  deleteIdempotencyKey(): void
}
