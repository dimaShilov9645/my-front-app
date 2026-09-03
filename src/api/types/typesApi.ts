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

export type OrderStatus =
  | 'created'
  | 'paid'
  | 'delivering'
  | 'delivered'
  | 'payment_failed'
  | 'out_of_stock'
  | 'delivery_failed'

export type Order = {
  id: string
  productId: string
  productName: string
  amount: number
  currency: string
  status: OrderStatus
  createdAt: string
  updatedAt: string
  delivery: {
    createdAt: string
    productKey: {
      code: string
    }
  } | null
}

export type PaymentWebhook = {
  event_id: string
  order_id: string
  status: 'paid' | 'failed'
  amount: number
  currency: string
  created_at: string
}
