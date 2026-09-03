export type Currency = 'USD' | 'KZT' | 'RUB'

export interface ServiceItem {
  id: string
  label: string
  accessibleLabel: string
  image: string
  imageWidth: number
  imageHeight: number
  offsetX: number
  offsetY: number
  muted?: boolean
}

export interface SteamTopUpRequest {
  login: string
  amount: string
  currency: Currency
}
