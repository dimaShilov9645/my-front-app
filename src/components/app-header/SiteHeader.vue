<template>
  <header
    ref="root"
    class="site-header relative z-40 mx-auto w-full max-w-full bg-white"
    @focusout="onFocusOut"
  >
    <div class="header-row border-b border-[#f2f4f7] px-4 sm:px-6 xl:px-10">
      <!-- В выбранном фрейме эта область пустая. Слот необязательный. -->
      <div class="logo-slot hidden min-w-0 md:block"><slot name="logo" /></div>

      <button
        ref="catalogButton"
        type="button"
        :id="`${id}-toggle`"
        :aria-controls="id"
        :aria-expanded="isOpen"
        aria-label="Каталог"
        class="cursor-pointer catalog-toggle flex h-11 w-11 shrink-0 items-center justify-center gap-2 rounded-[10px] bg-black text-sm font-semibold text-white transition-colors hover:bg-neutral-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-black focus-visible:outline-offset-4 md:w-[120px]"
        @click="isOpen = !isOpen"
      >
        <HeaderIcon name="catalog" class="h-5 w-5" />
        <span class="hidden md:inline">Каталог</span>
      </button>

      <HeaderSearch
        v-model="query"
        class="header-search"
        @search="onSearch"
        @favorites="onFavorites"
      />

      <button
        type="button"
        aria-label="Личный кабинет"
        class="profile-button flex h-11 w-11 items-center justify-center rounded-[10px] bg-[#f2f4f7] text-[#76829b] transition-colors hover:bg-slate-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-black focus-visible:outline-offset-4"
        @click="onProfile"
      >
        <HeaderIcon name="profile" class="h-5 w-5" />
      </button>
    </div>

    <Transition name="catalog">
      <CatalogMenu
        v-show="isOpen"
        :id="id"
        :aria-labelledby="`${id}-toggle`"
        :categories="categories"
        class="absolute left-0 top-full w-full"
        @select="onSelect"
        @category-change="$emit('category-change', $event)"
      />
    </Transition>
  </header>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import CatalogMenu from './CatalogMenu.vue'
import HeaderIcon from './icons/HeaderIcon.vue'
import HeaderSearch from './HeaderSearch.vue'
import { catalogCategories } from './helpers/catalog.data'
import type { CatalogCategory, CatalogSelection } from './helpers/types'

withDefaults(defineProps<{ id: string; categories: CatalogCategory[] }>(), {
  id: 'site-catalog',
  categories: () => catalogCategories,
})

const emit = defineEmits<{
  (event: 'search', query: string): void
  (event: 'favorites'): void
  (event: 'profile'): void
  (event: 'select', selection: CatalogSelection): void
  (event: 'category-change', categoryId: string): void
}>()

const root = ref<HTMLElement | null>(null)
const catalogButton = ref<HTMLButtonElement | null>(null)
const query = ref('')
const isOpen = ref(false)

function close(restoreFocus = false) {
  isOpen.value = false
  if (restoreFocus) void nextTick(() => catalogButton.value?.focus())
}

function onPointerDown(event: PointerEvent) {
  if (event.target instanceof Node && !root.value?.contains(event.target)) close()
}

function onKeyDown(event: KeyboardEvent) {
  if (event.key === 'Escape' && isOpen.value) {
    event.preventDefault()
    close(true)
  }
}

function onFocusOut(event: FocusEvent) {
  if (event.relatedTarget instanceof Node && !root.value?.contains(event.relatedTarget)) close()
}

function onSelect(selection: CatalogSelection) {
  close(true)
  emit('select', selection)
}

function onSearch(value: string) {
  close()
  emit('search', value)
}
function onProfile() {
  close()
  emit('profile')
}
function onFavorites() {
  close()
  emit('favorites')
}

onMounted(() => {
  document.addEventListener('pointerdown', onPointerDown)
  document.addEventListener('keydown', onKeyDown)
})

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onPointerDown)
  document.removeEventListener('keydown', onKeyDown)
})
</script>

<style scoped>
.site-header {
  font-family: 'Montserrat', Arial, sans-serif;
}
.header-row {
  display: grid;
  grid-template-columns: 44px minmax(0, 1fr) 44px;
  align-items: center;
  gap: 12px;
  height: 80px;
}
@media (min-width: 768px) {
  .header-row {
    grid-template-columns: minmax(0, 80px) 120px minmax(0, 1fr) 44px;
    gap: 24px;
  }
}
@media (min-width: 1280px) {
  .header-row {
    grid-template-columns: 192px 120px 76px minmax(0, 1fr) 80px 44px;
    gap: 0;
  }
  .logo-slot {
    grid-column: 1;
  }
  .catalog-toggle {
    grid-column: 2;
  }
  .header-search {
    grid-column: 4;
  }
  .profile-button {
    grid-column: 6;
  }
}
.catalog-enter-active,
.catalog-leave-active {
  transition:
    opacity 140ms ease,
    transform 140ms ease;
}
.catalog-enter-from,
.catalog-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
@media (prefers-reduced-motion: reduce) {
  .catalog-enter-active,
  .catalog-leave-active {
    transition: none;
  }
}
</style>
