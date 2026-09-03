import steam from '@/assets/steam-top-up-block/steam.png'
import telegram from '@/assets/steam-top-up-block/telegram.png'
import roblox from '@/assets/steam-top-up-block/roblox.png'
import brawlStars from '@/assets/steam-top-up-block/brawl-stars.png'
import pubg from '@/assets/steam-top-up-block/pubg.png'
import appStore from '@/assets/steam-top-up-block/app-store.png'
import chatgpt from '@/assets/steam-top-up-block/chatgpt.png'
import playstation from '@/assets/steam-top-up-block/playstation.png'
import tiktok from '@/assets/steam-top-up-block/tiktok.png'
import mobileLegends from '@/assets/steam-top-up-block/mobile-legends.png'
import more from '@/assets/steam-top-up-block/more.png'
import type { ServiceItem } from './types.ts'

// Экспорты Figma содержат поля тени. Смещения показывают саму иконку 72×72,
// а тень воссоздаётся CSS, чтобы одинаково реагировать на hover и focus.
function service(id: string, label: string, image: string, accessibleLabel = label): ServiceItem {
  return {
    id,
    label,
    accessibleLabel,
    image,
    imageWidth: 88,
    imageHeight: 86,
    offsetX: 8,
    offsetY: 2,
  }
}

export const steamService: ServiceItem = {
  ...service('steam', 'Steam', steam),
  imageWidth: 82,
  offsetX: 2,
}

export const services: ServiceItem[] = [
  steamService,
  service('telegram', 'Telegram', telegram),
  service('roblox', 'Roblox', roblox),
  service('brawl-stars', 'Brawl Stars', brawlStars),
  {
    ...service('pubg', 'PUBG Mob...', pubg, 'PUBG Mobile'),
    imageWidth: 72,
    imageHeight: 72,
    offsetX: 0,
    offsetY: 0,
  },
  service('app-store', 'App Store', appStore),
  service('chatgpt', 'ChatGPT', chatgpt),
  service('playstation', 'PlayStation', playstation),
  service('tiktok', 'TikTok', tiktok),
  service('mobile-legends', 'Mobile Leg..', mobileLegends, 'Mobile Legends'),
  {
    ...service('more', 'еще 841', more, 'Ещё 841 сервис'),
    imageWidth: 72,
    imageHeight: 72,
    offsetX: 0,
    offsetY: 0,
    muted: true,
  },
]
