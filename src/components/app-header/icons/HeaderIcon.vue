<template>
  <svg
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
    class="shrink-0"
  >
    <g v-if="name === 'catalog'" fill="currentColor">
      <rect x="2" y="2" width="6.5" height="6.5" rx="1.5" />
      <rect x="11.5" y="2" width="6.5" height="6.5" rx="1.5" />
      <rect x="2" y="11.5" width="6.5" height="6.5" rx="1.5" />
      <rect x="11.5" y="11.5" width="6.5" height="6.5" rx="1.5" />
    </g>
    <path
      v-else-if="name === 'close'"
      d="m5 5 10 10M15 5 5 15"
      stroke="currentColor"
      stroke-width="1.8"
      stroke-linecap="round"
    />
    <g
      v-else-if="name === 'search'"
      stroke="currentColor"
      stroke-width="1.7"
      stroke-linecap="round"
    >
      <circle cx="8.6" cy="8.6" r="5.6" />
      <path d="m13 13 4 4" />
    </g>
    <path
      v-else-if="name === 'heart'"
      d="M10 17s-7-4.2-7-9.2C3 3.3 8.1 2.4 10 6c1.9-3.6 7-2.7 7 1.8C17 12.8 10 17 10 17Z"
      fill="currentColor"
    />
    <g v-else-if="name === 'profile'" fill="currentColor">
      <circle cx="10" cy="5.84" r="3.96" />
      <path
        d="M3.55 17.72v-2.7c0-2.45 2.02-4.4 4.48-4.4h3.94c2.46 0 4.48 1.95 4.48 4.4v2.7H3.55Z"
      />
    </g>
    <path
      v-else
      d="m8 5 5 5-5 5"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>

<script setup lang="ts">
import type { HeaderIconName } from '../helpers/types'
defineProps<{ name: HeaderIconName }>()
</script>
