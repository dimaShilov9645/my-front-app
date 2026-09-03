<template>
  <span
    class="relative block h-[72px] w-[72px] shrink-0 overflow-hidden rounded-2xl"
    :class="service.muted ? '' : 'shadow-[0_4px_8px_0_#d1d9e4]'"
    aria-hidden="true"
  >
    <img
      :src="service.image"
      alt=""
      :width="service.imageWidth"
      :height="service.imageHeight"
      draggable="false"
      class="pointer-events-none absolute max-w-none select-none"
      :style="{
        left: `${-service.offsetX}px`,
        top: `${-service.offsetY}px`,
        width: `${service.imageWidth}px`,
        height: `${service.imageHeight}px`,
      }"
    />
  </span>
</template>

<script setup lang="ts">
import type { ServiceItem } from '../helpers/types'
defineProps<{ service: ServiceItem }>()
</script>
