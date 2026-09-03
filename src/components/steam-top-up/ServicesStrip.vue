<template>
  <div
    role="group"
    aria-label="Сервисы"
    class="services-scroll w-full overflow-x-auto overscroll-x-contain"
  >
    <div class="flex min-w-[1160px] items-start justify-between">
      <ServiceTile
        v-for="service in services"
        :key="service.id"
        :service="service"
        @select="$emit('select', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import ServiceTile from './ServiceTile.vue'
import { services } from './helpers/services.data'
import type { ServiceItem } from './helpers/types'
defineEmits<{ (event: 'select', service: ServiceItem): void }>()
</script>

<style scoped>
.services-scroll {
  scrollbar-width: none;
}
.services-scroll::-webkit-scrollbar {
  display: none;
}
</style>
