<template>
  <section
    class="popular-products my-4 px-5 mx-auto w-full max-w-full"
    :aria-labelledby="`${id}-title`"
  >
    <div class="products-heading mb-4 flex min-w-0 flex-col gap-3">
      <h2 :id="`${id}-title`" class="shrink-0 text-xl font-bold leading-[30px] text-[#242e3f]">
        {{ title }}
      </h2>
      <ProductCategories
        :model-value="activeCategory"
        :categories="productCategories"
        @update:model-value="selectCategory"
      />
    </div>
    <div v-if="productsList?.length" class="products-grid grid gap-4">
      <ProductCard
        v-for="product in productsList"
        :key="product.id"
        :product="product"
        @buy="buyProduct($event)"
      />
    </div>
    <p
      v-else
      role="status"
      class="rounded-[20px] bg-white px-6 py-10 text-center text-sm text-[#8a94a6]"
    >
      Товары не найдены
    </p>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { productCategories } from './helpers/products.data'
import { useProductsStore } from '@/pinia/products/useProductsStore.ts'
import type { Api_Product_Dto } from '@/api/types/typesApi.ts'

import ProductCard from './ProductCard.vue'
import ProductCategories from './ProductCategories.vue'

const { getProducts, createOrder } = useProductsStore()
const { productsList } = storeToRefs(useProductsStore())

interface Props {
  id?: string
  title?: string
  initialCategory?: string
}

const emits = defineEmits<{
  (event: 'buy', product: Api_Product_Dto): void
  (event: 'category-change', id: string): void
}>()

const props = withDefaults(defineProps<Props>(), {
  id: 'popular-products',
  title: 'Популярные товары',
  initialCategory: 'donate',
})

const activeCategory = ref(
  productCategories.some((category) => category.id === props.initialCategory)
    ? props.initialCategory
    : (productCategories[0]?.id ?? ''),
)

watch(
  () => productCategories.map((category) => category.id),
  (ids) => {
    if (!ids.includes(activeCategory.value)) activeCategory.value = ids[0] ?? ''
  },
)

function selectCategory(categoryId: string) {
  activeCategory.value = categoryId
  emits('category-change', categoryId)
}

function buyProduct(product: Api_Product_Dto) {
  alert(product.id)
  createOrder(product.id)
}

onMounted(() => {
  getProducts()
})
</script>

<style scoped>
.popular-products {
  font-family: 'Montserrat', Arial, sans-serif;
  container-type: inline-size;
  container-name: popular-products;
}
.products-grid {
  grid-template-columns: minmax(0, 1fr);
}
@container popular-products (min-width: 340px) {
  .products-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@container popular-products (min-width: 620px) {
  .products-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
@container popular-products (min-width: 900px) {
  .products-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
@container popular-products (min-width: 1120px) {
  .products-grid {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }
  .products-heading {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }
}
</style>
