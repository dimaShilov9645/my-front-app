<template>
  <form class="payment-grid" aria-label="Пополнение Steam" @submit.prevent="submit">
    <div class="selected-service flex min-w-0 items-center gap-3">
      <span class="flex h-[76px] w-[76px] shrink-0 items-center justify-center p-[2px]"
        ><ServiceIcon :service="steamService"
      /></span>
      <div class="flex min-w-0 flex-col items-start gap-1">
        <div class="flex flex-wrap items-center gap-x-2">
          <h2 class="text-base font-bold leading-[27px] tracking-[-0.48px] text-[#363636]">
            Пополнение Steam
          </h2>
          <span
            class="flex h-5 items-center rounded-full bg-[#6eb83f] px-2 text-[11px] font-bold leading-[11px] text-white"
            >5%</span
          >
        </div>
        <button
          type="button"
          class="flex items-center gap-[2px] rounded-lg bg-[rgba(38,139,243,0.1)] px-3 py-1 text-xs font-bold leading-[18px] text-black transition-colors hover:bg-blue-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-black focus-visible:outline-offset-2"
          @click="$emit('promo')"
        >
          <span class="whitespace-nowrap">Ввести промокод</span>
          <img :src="chevron" alt="" width="12" height="12" class="h-3 w-3 shrink-0" />
        </button>
      </div>
    </div>

    <div
      class="flex h-16 min-w-0 items-center rounded-xl bg-[#f4f5f7] px-5 focus-within:ring-2 focus-within:ring-slate-400"
    >
      <img :src="profile" alt="" width="20" height="20" class="mr-3 h-5 w-5 shrink-0" />
      <input
        v-model="login"
        type="text"
        :id="`${id}-login`"
        name="steam-login"
        aria-label="Логин Steam"
        autocomplete="username"
        autocapitalize="none"
        :spellcheck="false"
        placeholder="Логин Steam"
        required
        class="h-full w-full min-w-0 bg-transparent text-[15px] font-bold text-[#363636] outline-none placeholder:text-[#8a94a6]"
      />
      <button
        type="button"
        aria-label="Где найти логин Steam?"
        title="Укажите логин аккаунта Steam, а не никнейм"
        class="ml-2 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[#a0a8b5] text-xs font-bold italic leading-3 text-white transition-colors hover:bg-[#76829b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-black focus-visible:outline-offset-2"
        style="font-family: Georgia, serif"
        @click="$emit('login-help')"
      >
        i
      </button>
    </div>

    <div
      class="flex h-16 min-w-0 items-center justify-between gap-3 rounded-xl bg-[#f4f5f7] px-4 focus-within:ring-2 focus-within:ring-slate-400"
    >
      <div class="flex min-w-0 flex-1 items-center">
        <img :src="ruble" alt="" width="20" height="20" class="mr-3 h-5 w-5 shrink-0" />
        <label class="block min-w-0" :for="`${id}-amount`">
          <span class="block text-xs font-bold leading-[18px] text-[#8a94a6]">Сумма</span>
          <span class="mt-[2px] flex items-center text-lg font-bold leading-[18px] text-[#363636]">
            <input
              :id="`${id}-amount`"
              v-model="amount"
              type="text"
              name="amount"
              inputmode="decimal"
              aria-label="Сумма пополнения, рубли"
              pattern="[0-9]+([.,][0-9]{1,2})?"
              required
              maxlength="9"
              :style="{ width: `${Math.max(1, amount.length)}ch` }"
              class="min-w-0 max-w-[90px] bg-transparent p-0 font-bold leading-[18px] outline-none"
            />
            <!-- Символ намеренно не связан с переключателем валют. -->
            <span aria-hidden="true">₽</span>
          </span>
        </label>
      </div>
      <CurrencySwitch
        :model-value="currency"
        :name="`${id}-currency`"
        @update:model-value="changeCurrency"
      />
    </div>

    <!-- Заглушка макета: не пересчитываем и не меняем валюту или текст кнопки. -->
    <button
      type="submit"
      class="flex h-16 items-center justify-center whitespace-nowrap rounded-xl bg-black px-6 text-base font-bold leading-[27px] text-white transition-colors hover:bg-neutral-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-black focus-visible:outline-offset-4"
    >
      Оплатить 500$
    </button>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CurrencySwitch from './CurrencySwitch.vue'
import ServiceIcon from './icons/ServiceIcon.vue'
import { steamService } from './helpers/services.data'
import profile from '@/assets/steam-top-up-block/profile.png'
import ruble from '@/assets/steam-top-up-block/ruble.png'
import chevron from '@/assets/steam-top-up-block/chevron.png'
import type { Currency, SteamTopUpRequest } from './helpers/types'

defineProps<{ id: string }>()
const emit = defineEmits<{
  (event: 'submit', value: SteamTopUpRequest): void
  (event: 'currency-change', value: Currency): void
  (event: 'promo'): void
  (event: 'login-help'): void
}>()

const login = ref('')
const amount = ref('500')
const currency = ref<Currency>('USD')

function changeCurrency(value: Currency) {
  currency.value = value
  emit('currency-change', value)
}

function submit() {
  // Только событие UI. Никаких платёжных запросов и конвертации валют.
  emit('submit', { login: login.value.trim(), amount: amount.value, currency: currency.value })
}
</script>

<style scoped>
.payment-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  align-items: center;
  gap: 16px;
}
@container steam-topup (min-width: 640px) {
  .payment-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@container steam-topup (min-width: 1100px) {
  .payment-grid {
    grid-template-columns: 285.51px minmax(0, 1fr) minmax(0, 1.2fr) 200px;
    height: 72px;
  }
  .selected-service {
    width: 290px;
  }
}
</style>
