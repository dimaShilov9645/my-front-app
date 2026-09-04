<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <header class="border-b border-white/10 bg-[#101824]">
    <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
      <RouterLink to="/" class="flex items-center gap-3">
        <span
          class="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-400 text-[#0b111b]"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            class="h-6 w-6"
            aria-hidden="true"
          >
            <path
              d="M8 7h8a4 4 0 0 1 4 3l1 6a2.5 2.5 0 0 1-4 2l-3-2h-4l-3 2a2.5 2.5 0 0 1-4-2l1-6a4 4 0 0 1 4-3Z"
            />
            <path d="M7 10v4m-2-2h4" />
            <circle cx="16" cy="11" r=".7" fill="currentColor" />
            <circle cx="18" cy="13" r=".7" fill="currentColor" />
          </svg>
        </span>

        <span class="text-lg font-bold tracking-tight">
          GAME<span class="text-sky-400">STORE</span>
        </span>
      </RouterLink>

      <RouterLink to="/" class="text-sm text-slate-400 transition hover:text-white">
        <span aria-hidden="true">←</span> В каталог
      </RouterLink>
    </div>
  </header>
</template>

<style scoped></style>