<script setup lang="ts">
import type { GameService } from '../types/steam-top-up'
import steam from '../assets/services/steam.png'
import telegram from '../assets/services/telegram.png'
import roblox from '../assets/services/roblox.png'
import brawlStars from '../assets/services/brawl-stars.png'
import pubgMobile from '../assets/services/pubg-mobile.png'
import appStore from '../assets/services/app-store.png'
import chatgpt from '../assets/services/chatgpt.png'
import playstation from '../assets/services/playstation.png'
import tiktok from '../assets/services/tiktok.png'
import mobileLegends from '../assets/services/mobile-legends.png'
import more from '../assets/services/more.png'

withDefaults(defineProps<{ selectedServiceId?: string; moreCount?: number }>(), {
  selectedServiceId: 'steam',
  moreCount: 841,
})

const emit = defineEmits<{
  (event: 'select-service', service: GameService): void
  (event: 'show-all'): void
}>()

const services: GameService[] = [
  { id: 'steam', title: 'Steam', image: steam },
  { id: 'telegram', title: 'Telegram', image: telegram },
  { id: 'roblox', title: 'Roblox', image: roblox },
  { id: 'brawl-stars', title: 'Brawl Stars', image: brawlStars },
  { id: 'pubg-mobile', title: 'PUBG Mobile', image: pubgMobile },
  { id: 'app-store', title: 'App Store', image: appStore },
  { id: 'chatgpt', title: 'ChatGPT', image: chatgpt },
  { id: 'playstation', title: 'PlayStation', image: playstation },
  { id: 'tiktok', title: 'TikTok', image: tiktok },
  { id: 'mobile-legends', title: 'Mobile Legends', image: mobileLegends },
]
</script>

<template>
  <nav aria-label="Каталог сервисов">
    <div
      class="service-scrollbar -mx-2 flex gap-4 overflow-x-auto overscroll-x-contain px-2 pb-2 pt-1"
    >
      <button
        v-for="service in services"
        :key="service.id"
        type="button"
        class="flex w-12 shrink-0 cursor-pointer flex-col items-center gap-3 rounded-xl text-[#363636] outline-offset-4 transition-colors hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 sm:w-28 2xl:min-w-0 2xl:flex-1 motion-reduce:transition-none"
        :aria-label="service.title"
        :aria-current="selectedServiceId === service.id ? 'page' : undefined"
        :title="service.title"
        @click="emit('select-service', service)"
      >
        <img
          :src="service.image"
          alt=""
          class="aspect-square w-16 rounded-[22%] object-cover shadow-[0_5px_10px_rgba(15,23,42,0.13)] sm:w-20 xl:w-24 2xl:w-full 2xl:max-w-[80px]"
          draggable="false"
        />
        <span
          class="w-full truncate text-center text-sm font-bold leading-snug tracking-tight sm:text-lg 2xl:text-[clamp(18px,1.3vw,16px)]"
        >
          {{ service.title }}
        </span>
      </button>

      <button
        type="button"
        class="flex w-20 shrink-0 cursor-pointer flex-col items-center gap-3 rounded-xl text-[#8c96ab] outline-offset-4 hover:text-slate-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 sm:w-28 2xl:min-w-0 2xl:flex-1"
        :aria-label="`Ещё ${moreCount} сервисов`"
        @click="emit('show-all')"
      >
        <img
          :src="more"
          alt=""
          class="aspect-square w-16 rounded-[22%] object-cover sm:w-20 xl:w-24 2xl:w-full 2xl:max-w-[80px]"
          draggable="false"
        />
        <span
          class="w-full truncate text-center text-sm font-bold leading-snug tracking-tight sm:text-lg 2xl:text-[clamp(18px,1.3vw,16px)]"
        >
          ещё {{ moreCount }}
        </span>
      </button>
    </div>
  </nav>
</template>

<style scoped>
.service-scrollbar {
  scrollbar-width: none;
}

.service-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
