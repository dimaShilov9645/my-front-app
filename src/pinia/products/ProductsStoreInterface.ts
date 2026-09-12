import type { Ref } from 'vue'
import type { Api_Payment_Webhook_Dto, Api_Product_Dto } from '@/api/types/typesApi.ts'

export default interface ProductsStoreInterface {
  productsList: Ref<any[]>
  getProducts(): Promise<Api_Product_Dto[]>
  getProduct(id: string): Promise<Api_Product_Dto>
  createOrder(product: Api_Product_Dto, test?: boolean): Promise<any>
  getOrder(id: string, signal?: any): Promise<any>
  sendPaymentWebhook(payload: Api_Payment_Webhook_Dto, signal: any): Promise<any>
  deleteIdempotencyKey(): void
  connectEvents(): void
  disconnectEvents(): void
}
