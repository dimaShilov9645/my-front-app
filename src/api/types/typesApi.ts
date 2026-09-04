export type ApiError = {
  statusCode?: number
  message?: string
  data?: any
}

export type Api_Product_Dto = {
  id: string
  name: string
  image: string
  price: number
  currencySymbol?: string
  currency: string
  isActive: true
  sku: string
  type: string
  createdAt: string
  updatedAt: string
}

export type Api_Order_Status =
  | 'created'
  | 'paid'
  | 'delivering'
  | 'delivered'
  | 'payment_failed'
  | 'out_of_stock'
  | 'delivery_failed'

export type Api_Order_Dto = {
  id: string
  productId: string
  productName: string
  amount: number
  currency: string
  status: Api_Order_Status
  createdAt: string
  updatedAt: string
  delivery: {
    createdAt: string
    productKey: {
      code: string
    }
  } | null
}

export type Api_Payment_Webhook_Dto = {
  event_id: string
  order_id: string
  status: 'paid' | 'failed'
  amount: number
  currency: string
  created_at: string
}
