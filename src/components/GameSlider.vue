<script setup lang="ts">
import { ref, watch } from 'vue'

export interface GameSlide {
  id: string | number
  title: string
  image: string
  mobileImage?: string
  position?: string
  mobilePosition?: string
}

const props = withDefaults(
  defineProps<{
    slides?: GameSlide[]
    /** Цвет фона страницы: нужен для выреза под стрелки. */
    surfaceColor?: string
  }>(),
  {
    surfaceColor: '#ffffff',
    slides: () => [
      {
        id: 'cyberpunk',
        title: 'Cyberpunk 2077',
        image:
          'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1091500/library_hero.jpg',
        mobilePosition: '58% center',
      },
      {
        id: 'elden-ring',
        title: 'Elden Ring',
        image:
          'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1245620/library_hero.jpg',
      },
      {
        id: 'witcher',
        title: 'The Witcher 3: Wild Hunt',
        image:
          'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/292030/library_hero.jpg',
        mobilePosition: '65% center',
      },
      {
        id: 'rdr2',
        title: 'Red Dead Redemption 2',
        image:
          'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1174180/library_hero.jpg',
        mobilePosition: '65% center',
      },
      {
        id: 'forza',
        title: 'Forza Horizon 5',
        image:
          'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1551360/library_hero.jpg',
        mobilePosition: '60% center',
      },
      {
        id: 'baldurs-gate',
        title: 'Baldur’s Gate 3',
        image:
          'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1086940/library_hero.jpg',
      },
    ],
  },
)

const activeIndex = ref(0)
const failedImages = ref(new Set<string>())

function goToSlide(index: number) {
  const count = props.slides.length
  if (count < 2) return
  activeIndex.value = ((index % count) + count) % count
}

function onKeydown(event: KeyboardEvent) {
  const actions: Record<string, number> = {
    ArrowLeft: activeIndex.value - 1,
    ArrowRight: activeIndex.value + 1,
    Home: 0,
    End: props.slides.length - 1,
  }

  const target = actions[event.key]
  if (target === undefined || event.altKey || event.ctrlKey || event.metaKey) return
  event.preventDefault()
  goToSlide(target)
}

let swipeStart: { x: number; y: number; pointerId: number } | null = null

function onPointerDown(event: PointerEvent) {
  if (!event.isPrimary) {
    swipeStart = null
    return
  }
  if (event.pointerType === 'mouse' || props.slides.length < 2) return

  swipeStart = { x: event.clientX, y: event.clientY, pointerId: event.pointerId }
  const viewport = event.currentTarget as HTMLElement
  viewport.setPointerCapture(event.pointerId)
}

function onPointerUp(event: PointerEvent) {
  if (!swipeStart || swipeStart.pointerId !== event.pointerId) return

  const deltaX = event.clientX - swipeStart.x
  const deltaY = event.clientY - swipeStart.y
  swipeStart = null

  // Вертикальный жест оставляем прокрутке страницы.
  if (Math.abs(deltaX) < 50 || Math.abs(deltaX) < Math.abs(deltaY) * 1.25) return
  goToSlide(activeIndex.value + (deltaX < 0 ? 1 : -1))
}

watch(
  () => props.slides.length,
  (count) => {
    activeIndex.value = Math.min(activeIndex.value, Math.max(0, count - 1))
    swipeStart = null
  },
)
</script>

<template>
  <section
    v-if="slides?.length"
    class="relative isolate w-full mt-4 rounded-[20px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate-500"
    :style="{ '--slider-surface': surfaceColor }"
    role="region"
    aria-roledescription="карусель"
    aria-label="Игры в магазине"
    tabindex="0"
    @keydown="onKeydown"
  >
    <!-- На телефоне выше, на широком экране — пропорции макета. -->
    <div
      class="relative h-[260px] select-none overflow-hidden rounded-[20px] bg-neutral-900 sm:h-[340px] lg:aspect-[41/9] lg:h-auto lg:min-h-[280px]"
      style="touch-action: pan-y pinch-zoom"
      @pointerdown="onPointerDown"
      @pointerup="onPointerUp"
      @pointercancel="swipeStart = null"
      @lostpointercapture="swipeStart = null"
    >
      <div
        v-for="(slide, index) in slides"
        :key="slide.id"
        class="absolute inset-0 transition-opacity duration-500 ease-out motion-reduce:transition-none"
        :class="index === activeIndex ? 'z-10 opacity-100' : 'pointer-events-none z-0 opacity-0'"
        :aria-hidden="index !== activeIndex"
        role="group"
        aria-roledescription="слайд"
        :aria-label="`${index + 1} из ${slides.length}: ${slide.title}`"
      >
        <picture v-if="!failedImages.has(slide.image)">
          <source v-if="slide.mobileImage" media="(max-width: 639px)" :srcset="slide.mobileImage" />
          <img
            :src="slide.image"
            :alt="slide.title"
            :style="{
              '--desktop-position': slide.position || 'center',
              '--mobile-position': slide.mobilePosition || slide.position || 'center',
            }"
            class="slide-image pointer-events-none absolute inset-0 h-full w-full object-cover"
            width="3840"
            height="1240"
            :loading="index === 0 ? 'eager' : 'lazy'"
            :fetchpriority="index === 0 ? 'high' : 'auto'"
            decoding="async"
            draggable="false"
            @error="failedImages.add(slide.image)"
          />
        </picture>

        <!-- Если внешний источник недоступен, сохраняем читаемое состояние. -->
        <div
          v-else
          class="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-800 to-neutral-950 p-8 text-center text-xl font-semibold text-white sm:text-3xl"
        >
          {{ slide.title }}
        </div>
      </div>

      <!-- Небольшое затемнение под нижними индикаторами. -->
      <div
        class="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-24 bg-gradient-to-t from-black/50 to-transparent"
        aria-hidden="true"
      />
    </div>

    <!-- Вырез и его два внешних скругления. -->
    <div
      v-if="slides.length > 1"
      class="slider-notch pointer-events-none absolute right-0 top-0 z-20 h-16 w-28 rounded-bl-[28px] lg:h-20 lg:w-40 lg:rounded-bl-[36px]"
      aria-hidden="true"
    />

    <div
      v-if="slides.length > 1"
      class="absolute right-0 top-0 z-30 flex h-12 w-[100px] items-center rounded-full border border-slate-200 bg-slate-100 lg:h-16 lg:w-[148px]"
      role="group"
      aria-label="Переключение слайдов"
    >
      <button
        type="button"
        class="flex h-full min-w-0 flex-1 cursor-pointer items-center justify-center rounded-full text-neutral-950 transition-colors hover:bg-slate-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600 motion-reduce:transition-none"
        aria-label="Предыдущий слайд"
        @click="goToSlide(activeIndex - 1)"
      >
        <svg class="h-5 w-5 lg:h-6 lg:w-6" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M19 12H5m0 0 5 5m-5-5 5-5"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>

      <button
        type="button"
        class="flex h-full min-w-0 flex-1 cursor-pointer items-center justify-center rounded-full text-neutral-950 transition-colors hover:bg-slate-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600 motion-reduce:transition-none"
        aria-label="Следующий слайд"
        @click="goToSlide(activeIndex + 1)"
      >
        <svg class="h-5 w-5 lg:h-6 lg:w-6" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M5 12h14m0 0-5-5m5 5-5 5"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </div>

    <div
      v-if="slides.length > 1"
      class="absolute bottom-1 right-3 z-20 flex max-w-[calc(100%_-_24px)] items-center overflow-x-auto sm:bottom-2 sm:right-5"
      role="group"
      aria-label="Выбор слайда"
    >
      <button
        v-for="(slide, index) in slides"
        :key="slide.id"
        type="button"
        class="group flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white sm:w-10"
        :aria-label="`Слайд ${index + 1}: ${slide.title}`"
        :aria-current="index === activeIndex ? 'true' : undefined"
        @click="goToSlide(index)"
      >
        <span
          class="h-1.5 w-7 rounded-full transition-colors duration-200 sm:w-8 motion-reduce:transition-none"
          :class="index === activeIndex ? 'bg-white' : 'bg-white/45 group-hover:bg-white/75'"
          aria-hidden="true"
        />
      </button>
    </div>

    <p class="sr-only" aria-live="polite" aria-atomic="true">
      {{ activeIndex + 1 }} из {{ slides.length }}: {{ slides[activeIndex]?.title }}
    </p>
  </section>
</template>

<style scoped>
.slide-image {
  object-position: var(--mobile-position, center);
}

.slider-notch {
  background: var(--slider-surface, #fff);
}

/* Круги оставляют плавные внешние углы у начала и конца выреза. */
.slider-notch::before,
.slider-notch::after {
  position: absolute;
  width: 20px;
  height: 20px;
  content: '';
  background: radial-gradient(
    circle at 0 100%,
    transparent 20px,
    var(--slider-surface, #fff) 20.5px
  );
}

.slider-notch::before {
  top: 0;
  right: 100%;
}

.slider-notch::after {
  top: 100%;
  right: 0;
}

@media (min-width: 640px) {
  .slide-image {
    object-position: var(--desktop-position, center);
  }
}
</style>
