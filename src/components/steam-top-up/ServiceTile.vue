<template>
  <button
    type="button"
    :aria-label="service.accessibleLabel"
    :title="service.accessibleLabel"
    class="service-tile group flex w-[76px] shrink-0 flex-col items-center gap-2 rounded-2xl focus-visible:outline-none"
    @click="$emit('select', service)"
  >
    <span
      class="icon-frame flex h-[76px] w-[76px] items-center justify-center rounded-2xl bg-transparent p-[2px] transition-[background-color,box-shadow] duration-200 ease-out group-hover:bg-black group-hover:shadow-[0_4px_12px_rgba(20,40,80,0.12)] group-focus-visible:bg-black group-focus-visible:ring-2 group-focus-visible:ring-slate-400 group-focus-visible:ring-offset-2 motion-reduce:transition-none"
    >
      <ServiceIcon :service="service" />
    </span>
    <span
      class="whitespace-nowrap text-center text-base font-bold leading-6 tracking-[-0.16px] transition-colors duration-200 group-hover:text-black group-focus-visible:text-black motion-reduce:transition-none"
      :class="service.muted ? 'text-[#8a94a6]' : 'text-[#363636]'"
      >{{ service.label }}</span
    >
  </button>
</template>

<script setup lang="ts">
import ServiceIcon from './icons/ServiceIcon.vue'
import type { ServiceItem } from './helpers/types'
defineProps<{ service: ServiceItem }>()
defineEmits<{ (event: 'select', service: ServiceItem): void }>()
</script>
