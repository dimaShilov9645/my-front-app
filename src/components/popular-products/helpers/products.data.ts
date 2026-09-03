import coins from '@/assets/popular-products/coins.svg'
import layers from '@/assets/popular-products/layers.svg'
import swords from '@/assets/popular-products/swords.svg'
import users from '@/assets/popular-products/users-round.svg'
import key from '@/assets/popular-products/key-round.svg'
import gem from '@/assets/popular-products/gem.svg'
import orbit from '@/assets/popular-products/orbit.svg'
import type { ProductCategory } from './types.ts'

export const productCategories: ProductCategory[] = [
  { id: 'donate', label: 'Донат', icon: coins },
  { id: 'subscriptions', label: 'Подписки', icon: layers },
  { id: 'items', label: 'Предметы', icon: swords },
  { id: 'accounts', label: 'Аккаунты', icon: users },
  { id: 'keys', label: 'Ключи', icon: key },
  { id: 'currency', label: 'Игровая валюта', icon: gem },
  { id: 'other', label: 'Другое', icon: orbit },
]
