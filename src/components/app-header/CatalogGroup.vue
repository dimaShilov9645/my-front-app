<template>
  <section class="min-w-0">
    <h3 class="mb-4 text-base font-bold leading-6 text-[#16181d]">
      <button
        type="button"
        class="flex max-w-full items-center gap-1 rounded-sm text-left hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-black focus-visible:outline-offset-4"
        @click="$emit('select', null)"
      >
        <span>{{ group.title }}</span>
        <HeaderIcon name="chevron" class="h-[18px] w-[18px]" />
      </button>
    </h3>
    <ul class="space-y-1 md:space-y-3">
      <li v-for="item in group.items" :key="item.id">
        <button
          type="button"
          class="min-h-[44px] cursor-pointer w-full whitespace-pre-line rounded-sm py-[2px] text-left text-[13.5px] font-medium leading-6 text-[#363636] underline-offset-4 hover:text-black hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-black focus-visible:outline-offset-2 md:min-h-[24px] md:py-0"
          @click="$emit('select', item)"
        >
          {{ item.label }}
        </button>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import HeaderIcon from './icons/HeaderIcon.vue'
import type { CatalogGroup, CatalogItem } from './helpers/types'

defineProps<{ group: CatalogGroup }>()
defineEmits<{ (event: 'select', item: CatalogItem | null): void }>()
</script>
