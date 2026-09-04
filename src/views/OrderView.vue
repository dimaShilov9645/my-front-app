<template>
  <div class="min-h-screen bg-[#0b111b] text-slate-100">
    <OrderHeader />

    <main class="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <OrderMain />
    </main>
  </div>
</template>

<script setup lang="ts">
import OrderHeader from '@/components/order/components/OrderHeader.vue'
import OrderMain from '@/components/order/index.vue'
</script>
