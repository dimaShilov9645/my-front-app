export type TopUpCurrency = 'USD' | 'KZT' | 'RUB'

export interface SteamTopUpPayload {
  login: string
  amount: number
  /** Сумма в минимальных денежных единицах, без погрешностей float. */
  amountMinor: number
  currency: TopUpCurrency
  promoCode: string | null
}

export interface GameService {
  id: string
  title: string
  image: string
}
