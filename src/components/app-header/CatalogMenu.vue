<template>
  <nav
    aria-label="Каталог товаров"
    class="catalog-font max-h-[calc(100dvh-80px)] overflow-y-auto border-t border-[#f1f2f5] bg-white text-[#363636] shadow-[0_14px_28px_-22px_rgba(0,0,0,0.25)]"
  >
    <div class="flex min-h-[500px] w-full max-w-[1200px] flex-col md:min-h-[660px] md:flex-row">
      <aside
        aria-label="Категории каталога"
        class="shrink-0 border-b border-[#f1f2f5] bg-white py-4 md:w-[240px] md:border-b-0 md:border-r xl:w-[320px]"
      >
        <ul class="space-y-1">
          <li v-for="category in categories" :key="category.id">
            <button
              type="button"
              :aria-pressed="selectedId === category.id"
              class="flex min-h-11 w-full items-center justify-between gap-2 px-6 py-3 text-left text-sm font-medium leading-5 transition-colors hover:bg-[#f4f5f7] focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-black"
              :class="selectedId === category.id ? 'bg-[#f4f5f7] text-[#16181d]' : 'text-[#363636]'"
              @click="selectCategory(category.id)"
            >
              <span>{{ category.title }}</span>
              <HeaderIcon
                name="chevron"
                class="h-[18px] w-[18px]"
                :class="selectedId === category.id ? 'text-[#9ca3af]' : 'text-[#c0c5ce]'"
              />
            </button>
          </li>
        </ul>
      </aside>

      <div class="min-w-0 flex-1 px-6 pb-10 pt-8 md:px-8">
        <div
          v-if="activeCategory && activeCategory.groups.length"
          class="grid grid-cols-2 gap-x-6 gap-y-10 pt-2 md:grid-cols-3 xl:auto-rows-[282px] xl:grid-cols-5 xl:gap-x-8"
        >
          <CatalogGroup
            v-for="group in activeCategory.groups"
            :key="group.id"
            :group="group"
            @select="selectItem(group, $event)"
          />
        </div>
        <p v-else role="status" class="pt-2 text-sm text-[#76829b]">
          Этот раздел пока не заполнен.
        </p>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import CatalogGroup from './CatalogGroup.vue'
import HeaderIcon from './icons/HeaderIcon.vue'
import type {
  CatalogCategory,
  CatalogGroup as Group,
  CatalogItem,
  CatalogSelection,
} from './helpers/types'

const props = defineProps<{ categories: CatalogCategory[] }>()
const emit = defineEmits<{
  (event: 'select', selection: CatalogSelection): void
  (event: 'category-change', categoryId: string): void
}>()

const selectedId = ref(props.categories[0]?.id ?? '')
const activeCategory = computed(() => props.categories.find((item) => item.id === selectedId.value))

watch(
  () => props.categories.map((item) => item.id),
  (ids) => {
    if (!ids.includes(selectedId.value)) selectedId.value = ids[0] ?? ''
  },
)

function selectCategory(id: string) {
  selectedId.value = id
  emit('category-change', id)
}

function selectItem(group: Group, item: CatalogItem | null) {
  emit('select', {
    categoryId: selectedId.value,
    groupId: group.id,
    itemId: item?.id ?? null,
    label: (item?.label ?? group.title).replace(/\n/g, ' '),
  })
}
</script>

<style scoped>
.catalog-font {
  font-family: 'Gilroy', Arial, sans-serif;
}
</style>
