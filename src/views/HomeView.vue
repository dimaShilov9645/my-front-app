<template>
  <main class="p-6 mx-12">
    <SiteHeader
      :categories="catalogCategories"
      id="site-catalog"
      @search="onSearch"
      @select="onSelect"
    />
    <game-slider />
    <SteamTopUpBlock
      id="steam-top-up"
      @submit="onSubmit"
      @service-click="onServiceClick"
      @promo="message = 'Нажата кнопка промокода'"
      @login-help="message = 'Укажите логин аккаунта Steam, а не никнейм профиля.'"
    />
    <PopularProducts @buy="onBuy" @category-change="onCategoryChange" />
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import type { CatalogSelection } from '@/components/app-header/helpers/types'
import type { ServiceItem, SteamTopUpRequest } from '@/components/steam-top-up/helpers/types.js'
import { catalogCategories } from '@/components/app-header/helpers/catalog.data'

import GameSlider from '@/components/GameSlider.vue'
import SiteHeader from '@/components/app-header/SiteHeader.vue'
import SteamTopUpBlock from '@/components/steam-top-up/SteamTopUpBlock.vue'
import PopularProducts from '@/components/popular-products/PopularProducts.vue'
import type { Api_Product_Dto } from '@/api/types/typesApi.ts'

const message = ref('Нажмите «Каталог», чтобы открыть меню.')
function onSearch(query: string) {
  message.value = `Поисковый запрос: ${query}`
}
function onSelect(item: CatalogSelection) {
  message.value = `Выбрано: ${item.label} (${item.groupId}/${item.itemId ?? ''})`
}

function onServiceClick(service: ServiceItem) {
  message.value = `Выбран сервис: ${service.accessibleLabel}`
}
function onSubmit(value: SteamTopUpRequest) {
  message.value = `Демо: логин ${value.login}, сумма ${value.amount}, переключатель ${value.currency}. Платёж не отправлен.`
}

function onBuy(product: Api_Product_Dto) {
  message.value = `Выбран товар ${product.id}. Здесь подключается корзина или переход к товару.`
}
function onCategoryChange(id: string) {
  message.value = `Выбрана категория: ${id}. Здесь подключается загрузка товаров.`
}
</script>
