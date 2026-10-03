<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

import { dynastyList, type Dynasty } from './data/dynasties'
import LegendBar from './components/LegendBar.vue'
import SiteHeader from './components/SiteHeader.vue'
import StoryPanel from './components/StoryPanel.vue'
import TimelineDesktop from './components/TimelineDesktop.vue'
import TimelineMobile from './components/TimelineMobile.vue'

const active = ref<Dynasty | null>(null)

const mq = window.matchMedia('(max-width: 767px)')
const isMobile = ref(mq.matches)
const onMqChange = () => {
  isMobile.value = mq.matches
}
onMounted(() => mq.addEventListener('change', onMqChange))
onBeforeUnmount(() => mq.removeEventListener('change', onMqChange))
</script>

<template>
  <div class="app-bg noise relative min-h-screen overflow-x-clip">
    <div class="relative z-10 mx-auto max-w-6xl">
      <SiteHeader />
      <LegendBar />
    </div>

    <TimelineDesktop
      v-if="!isMobile"
      class="relative z-10"
      :list="dynastyList"
      :active-id="active?.id ?? null"
      @select="active = $event"
    />
    <div v-else class="relative z-10 mx-auto max-w-3xl">
      <TimelineMobile :list="dynastyList" @select="active = $event" />
    </div>

    <footer class="relative z-10 space-y-2 px-6 pb-10 pt-8 text-center text-[11px] tracking-wider text-faint md:text-xs">
      <p>十八段纪元 · 四十个世纪的分与合</p>
      <p>
        内容依据通识史料整理，仅供学习参考 ·
        <a
          href="https://history.honlnk.com"
          class="underline decoration-gold-700/60 underline-offset-4 transition-colors hover:text-gold-400"
        >history.honlnk.com</a>
        ·
        <a
          href="https://github.com/honlnk/china-history-timeline"
          target="_blank"
          rel="noopener"
          class="underline decoration-gold-700/60 underline-offset-4 transition-colors hover:text-gold-400"
        >GitHub</a>
      </p>
    </footer>

    <StoryPanel :dynasty="active" @close="active = null" @navigate="active = $event" />
  </div>
</template>
