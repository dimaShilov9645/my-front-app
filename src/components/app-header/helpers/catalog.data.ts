import type { CatalogCategory, CatalogGroup } from './types.ts'

function group(id: string, title: string, entries: [string, string][]): CatalogGroup {
  return { id, title, items: entries.map(([itemId, label]) => ({ id: itemId, label })) }
}

// Названия и порядок из выбранного фрейма Home V3 (1:864).
// Наполнение остальных категорий отсутствует в макете — передайте его через props.
export const catalogCategories: CatalogCategory[] = [
  {
    id: 'games',
    title: 'Игры и игровые сервисы',
    groups: [
      group('steam', 'Steam', [
        ['games-dlc', 'Игры и DLC'],
        ['balance', 'Пополнение баланса'],
        ['gift-cards', 'Подарочные карты'],
        ['trading-cards', 'Коллекционные\nкарточки'],
        ['region', 'Смена региона'],
      ]),
      group('playstation', 'PlayStation', [
        ['games-dlc', 'Игры и DLC'],
        ['balance', 'Пополнение баланса'],
        ['accounts', 'Новые аккаунты'],
        ['ps-plus', 'PS Plus'],
        ['ea-play', 'EA Play'],
      ]),
      group('xbox', 'Xbox', [
        ['games-dlc', 'Игры и DLC'],
        ['balance', 'Пополнение баланса'],
        ['accounts', 'Новые аккаунты'],
        ['game-pass', 'Xbox Game Pass'],
        ['services', 'Услуги'],
      ]),
      group('nintendo', 'Nintendo', [
        ['games-dlc', 'Игры и DLC'],
        ['gift-cards', 'Подарочные карты'],
        ['accounts', 'Новые аккаунты'],
        ['online', 'NS Online'],
      ]),
      group('battle-net', 'Battle.net', [
        ['wow', 'World of Warcraft'],
        ['gift-cards', 'Подарочные карты'],
        ['balance', 'Прямое пополнение'],
        ['accounts', 'Новые аккаунты'],
        ['region', 'Смена региона'],
      ]),
      group('collections', 'Подборки', [
        ['discounts', 'Скидки 90%'],
        ['publishers', 'Популярные\nиздатели'],
        ['series', 'Лучшие серии игр'],
        ['steam-deck', 'Steam Deck'],
        ['bundles', 'Bundle-наборы'],
      ]),
    ],
  },
  { id: 'valuables', title: 'Игровые ценности', groups: [] },
  { id: 'mobile', title: 'Мобильные игры', groups: [] },
  { id: 'services', title: 'Сервисы и соцсети', groups: [] },
  { id: 'software', title: 'Программы', groups: [] },
]
