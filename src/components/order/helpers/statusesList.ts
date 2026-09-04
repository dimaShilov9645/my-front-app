import type { Api_Order_Status } from '@/api/types/typesApi.ts'

export const statuses: Record<
  Api_Order_Status,
  { title: string; description: string; color: string }
> = {
  created: {
    title: 'Ожидает оплаты',
    description: 'Заказ создан. Подтвердите оплату, чтобы получить ключ.',
    color: 'bg-amber-400/10 text-amber-300 ring-amber-400/20',
  },
  paid: {
    title: 'Оплата подтверждена',
    description: 'Готовим ключ для вашего заказа.',
    color: 'bg-sky-400/10 text-sky-300 ring-sky-400/20',
  },
  delivering: {
    title: 'Выдаём ключ',
    description: 'Получаем и закрепляем ключ за вашим заказом.',
    color: 'bg-sky-400/10 text-sky-300 ring-sky-400/20',
  },
  delivered: {
    title: 'Заказ выполнен',
    description: 'Ваш ключ готов. Скопируйте его и активируйте в Steam.',
    color: 'bg-emerald-400/10 text-emerald-300 ring-emerald-400/20',
  },
  payment_failed: {
    title: 'Оплата не прошла',
    description: 'Ключ не выдан. Для новой покупки создайте новый заказ.',
    color: 'bg-rose-400/10 text-rose-300 ring-rose-400/20',
  },
  out_of_stock: {
    title: 'Ожидаем поступления ключей',
    description: 'Оплата подтверждена. Сейчас свободных ключей нет.',
    color: 'bg-amber-400/10 text-amber-300 ring-amber-400/20',
  },
  delivery_failed: {
    title: 'Выдача задерживается',
    description: 'Оплата подтверждена, но требуется повторная выдача.',
    color: 'bg-amber-400/10 text-amber-300 ring-amber-400/20',
  },
}
