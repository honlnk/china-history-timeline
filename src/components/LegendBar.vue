<script setup lang="ts">
import { computed } from 'vue'

import {
  CATEGORY_META,
  MODERN_BLUE,
  MODERN_RED,
  dynastyList,
  type Category,
} from '../data/dynasties'

const order: Category[] = ['origin', 'unified', 'chaos', 'sweeper', 'modern']

const items = computed(() =>
  order.map((key) => {
    const meta = CATEGORY_META[key]
    const colors =
      key === 'modern' ? [MODERN_BLUE, MODERN_RED] : [meta.color]
    return {
      key,
      label: meta.label,
      desc: meta.desc,
      colors,
      count: dynastyList.filter((d) => d.category === key).length,
    }
  }),
)
</script>

<template>
  <nav
    class="mt-6 flex flex-wrap items-center justify-center gap-x-7 gap-y-3 px-6 pb-2 md:mt-7 md:gap-x-9"
    aria-label="节点颜色图例"
  >
    <span
      v-for="item in items"
      :key="item.key"
      class="flex items-center gap-2.5"
      :title="item.desc"
    >
      <span class="flex -space-x-1.5">
        <i
          v-for="(c, i) in item.colors"
          :key="i"
          class="h-2.5 w-2.5 rounded-full"
          :style="{
            background: c,
            boxShadow: `0 0 9px ${c}66`,
          }"
        />
      </span>
      <span class="text-[13.5px] tracking-wider text-ivory/90 md:text-[14.5px]">
        {{ item.label }}
        <span class="ml-1.5 align-middle text-[11.5px] text-mist">×{{ item.count }}</span>
      </span>
    </span>
  </nav>
</template>
