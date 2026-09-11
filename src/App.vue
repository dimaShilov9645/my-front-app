<template>
  <RouterView />
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'
import { useProductsStore } from '@/pinia/products/useProductsStore.ts'

const { connectEvents, disconnectEvents } = useProductsStore()

onMounted(() => {
  connectEvents()
})
onBeforeUnmount(() => {
  disconnectEvents()
})
</script>
