<template>
  <section
    class="steam-top-up mx-auto flex w-full max-w-full flex-col gap-4 rounded-2xl bg-white p-5 shadow-[0_10px_34px_rgba(20,40,80,0.08)]"
    aria-label="Игровые сервисы и пополнение Steam"
  >
    <ServicesStrip @select="$emit('service-click', $event)" />
    <div class="h-px w-full shrink-0 bg-[#e8eaed]" aria-hidden="true" />
    <SteamTopUpForm
      :id="id"
      @submit="$emit('submit', $event)"
      @currency-change="$emit('currency-change', $event)"
      @promo="$emit('promo')"
      @login-help="$emit('login-help')"
    />
  </section>
</template>

<script setup lang="ts">
import ServicesStrip from './ServicesStrip.vue'
import SteamTopUpForm from './SteamTopUpForm.vue'
import type { Currency, ServiceItem, SteamTopUpRequest } from './helpers/types'

withDefaults(defineProps<{ id: string }>(), { id: 'steam-top-up' })
defineEmits<{
  (event: 'submit', value: SteamTopUpRequest): void
  (event: 'service-click', service: ServiceItem): void
  (event: 'currency-change', value: Currency): void
  (event: 'promo'): void
  (event: 'login-help'): void
}>()
</script>

<style scoped>
.steam-top-up {
  font-family: 'Montserrat', Arial, sans-serif;
  container-type: inline-size;
  container-name: steam-topup;
}
</style>
