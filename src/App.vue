<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

import { dynastyList, type Dynasty } from './data/dynasties'
import EurasiaCompare from './components/EurasiaCompare.vue'
import LegendBar from './components/LegendBar.vue'
import SiteHeader from './components/SiteHeader.vue'
import StoryPanel from './components/StoryPanel.vue'
import TimelineDesktop from './components/TimelineDesktop.vue'
import TimelineMobile from './components/TimelineMobile.vue'

const active = ref<Dynasty | null>(null)

type View = 'river' | 'eurasia'
const view = ref<View>('river')
watch(view, () => window.scrollTo({ top: 0, behavior: 'smooth' }))

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

      <!-- 视图切换 -->
      <nav class="mt-8 flex justify-center md:mt-9" aria-label="视图切换">
        <div class="flex rounded-full border border-ink-600/90 bg-ink-850/70 p-1 backdrop-blur-sm">
          <button
            v-for="v in (['river', 'eurasia'] as const)"
            :key="v"
            type="button"
            class="view-btn"
            :class="{ active: view === v }"
            :aria-pressed="view === v"
            @click="view = v"
          >
            {{ v === 'river' ? '长河纵览' : '欧亚对照' }}
          </button>
        </div>
      </nav>

      <LegendBar v-if="view === 'river'" />
    </div>

    <template v-if="view === 'river'">
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
    </template>
    <EurasiaCompare v-else class="relative z-10" />

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

<style scoped>
.view-btn {
  padding: 7px 22px;
  border-radius: 9999px;
  font-size: 13px;
  letter-spacing: 0.28em;
  text-indent: 0.28em;
  color: #a9a493;
  transition: all 0.3s;
  cursor: pointer;
}
.view-btn:hover {
  color: #ece5d3;
}
.view-btn.active {
  color: #10131b;
  background: linear-gradient(135deg, #e6cf97, #c9a45c);
  box-shadow: 0 2px 12px rgba(217, 184, 119, 0.35);
  font-weight: 600;
}
</style>
