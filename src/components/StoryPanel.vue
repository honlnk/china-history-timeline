<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

import { CATEGORY_META, dynastyColor, dynastyList, type Dynasty } from '../data/dynasties'

const props = defineProps<{ dynasty: Dynasty | null }>()
const emit = defineEmits<{
  close: []
  navigate: [dynasty: Dynasty]
}>()

const bodyRef = ref<HTMLElement | null>(null)

const idx = computed(() =>
  props.dynasty ? dynastyList.findIndex((d) => d.id === props.dynasty!.id) : -1,
)
const prev = computed(() => (idx.value > 0 ? dynastyList[idx.value - 1] : null))
const next =computed(() =>
  idx.value >= 0 && idx.value < dynastyList.length - 1 ? dynastyList[idx.value + 1] : null,
)
const color = computed(() => (props.dynasty ? dynastyColor(props.dynasty) : '#d9b877'))
const meta = computed(() =>
  props.dynasty ? CATEGORY_META[props.dynasty.category] : null,
)

/* 切换朝代时内容回到顶部 */
watch(
  () => props.dynasty?.id,
  () => nextTick(() => bodyRef.value?.scrollTo({ top: 0 })),
)

/* 面板打开期间锁定背景滚动 + ESC 关闭 */
watch(
  () => props.dynasty,
  (d) => {
    document.body.style.overflow = d ? 'hidden' : ''
  },
)

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.dynasty) emit('close')
}
onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <Transition name="veil">
      <div
        v-if="dynasty"
        class="fixed inset-0 z-40 bg-black/65 backdrop-blur-[3px]"
        @click="emit('close')"
      />
    </Transition>

    <Transition name="story">
      <aside
        v-if="dynasty"
        class="story-panel fixed z-50 flex flex-col overflow-hidden border-ink-700 bg-ink-900 shadow-[0_0_80px_rgba(0,0,0,0.7)]"
        :style="{ '--nc': color }"
        role="dialog"
        aria-modal="true"
        :aria-label="`${dynasty.name}的故事面板`"
      >
        <!-- 顶部装饰条 -->
        <div class="panel-topline" aria-hidden="true" />

        <div ref="bodyRef" class="flex-1 overflow-y-auto overscroll-contain px-6 pb-8 pt-6 md:px-9 md:pt-8">
          <div class="flex items-start justify-between gap-4">
            <span class="cat-chip">
              <i class="dot" aria-hidden="true" />
              {{ meta?.label }}
            </span>
            <button
              type="button"
              class="close-btn"
              aria-label="关闭面板（Esc）"
              @click="emit('close')"
            >
              ✕
            </button>
          </div>

          <h2 class="mt-5 text-3xl font-black leading-tight tracking-wide text-parchment md:text-4xl">
            {{ dynasty.name }}
          </h2>
          <p class="mt-3 text-sm tracking-[0.08em] text-gold-300/90 tabular-nums md:text-[15px]">
            {{ dynasty.period }}
          </p>
          <p class="mt-3 inline-flex rounded-full border border-ink-600 px-3.5 py-1 text-xs tracking-widest text-mist">
            {{ dynasty.reignNote }}
          </p>

          <div class="mt-5 flex flex-wrap gap-2">
            <span v-for="t in dynasty.tags" :key="t" class="tag">{{ t }}</span>
          </div>

          <div class="my-7 flex items-center gap-3" aria-hidden="true">
            <span class="h-px flex-1 bg-gradient-to-r from-transparent via-gold-600/50 to-gold-600/50" />
            <span class="text-[9px] text-gold-500/80">◆</span>
            <span class="h-px flex-1 bg-gradient-to-l from-transparent via-gold-600/50 to-gold-600/50" />
          </div>

          <h3 class="sec-title">史 略</h3>
          <p class="mt-4 text-justify text-[15px] leading-8 text-ivory/90 md:text-[15.5px]">
            <span class="dropcap" aria-hidden="true">{{ dynasty.summary[0] }}</span>{{ dynasty.summary.slice(1) }}
          </p>

          <template v-if="dynasty.moments?.length">
            <h3 class="sec-title mt-9">大 事 刻 度</h3>
            <ul class="mt-4 moment-list">
              <li v-for="m in dynasty.moments" :key="m.year + m.text" class="moment">
                <span class="m-year">{{ m.year }}</span>
                <span class="m-node" aria-hidden="true" />
                <span class="m-text">{{ m.text }}</span>
              </li>
            </ul>
          </template>

          <template v-if="dynasty.figures?.length">
            <h3 class="sec-title mt-9">其 人</h3>
            <div class="mt-4 flex flex-wrap gap-2">
              <span v-for="f in dynasty.figures" :key="f" class="figure-chip">{{ f }}</span>
            </div>
          </template>

          <div v-if="dynasty.quote" class="mt-9 quote-block">
            <p class="q-text">「{{ dynasty.quote.text }}」</p>
            <p class="q-src">—— {{ dynasty.quote.source }}</p>
          </div>

          <h3 class="sec-title mt-9">长河点评 · 分与合</h3>
          <blockquote class="mt-4 rounded-r-lg py-4 pl-5 pr-4">
            <p class="text-[15px] leading-8 text-gold-200/95">
              「{{ dynasty.commentary }}」
            </p>
          </blockquote>
        </div>

        <!-- 上一章 / 下一章 -->
        <nav
          v-if="prev || next"
          class="grid shrink-0 grid-cols-2 divide-x divide-ink-700 border-t border-ink-700 bg-ink-850/60"
          aria-label="翻页"
        >
          <button
            type="button"
            class="nav-btn"
            :disabled="!prev"
            @click="prev && emit('navigate', prev)"
          >
            <span class="nav-arrow" aria-hidden="true">←</span>
            <span class="min-w-0">
              <span class="nav-hint">{{ prev ? '上一章' : '长河之源' }}</span>
              <span class="nav-name">{{ prev?.name ?? '—' }}</span>
            </span>
          </button>
          <button
            type="button"
            class="nav-btn flex-row-reverse text-right"
            :disabled="!next"
            @click="next && emit('navigate', next)"
          >
            <span class="nav-arrow" aria-hidden="true">→</span>
            <span class="min-w-0">
              <span class="nav-hint">{{ next ? '下一章' : '未完待续' }}</span>
              <span class="nav-name">{{ next?.name ?? '—' }}</span>
            </span>
          </button>
        </nav>
      </aside>
    </Transition>
  </Teleport>
</template>

<style>
/* 面板本体：桌面右侧滑入 / 移动端底部抽屉（需全局作用域供 Transition 使用） */
.story-panel {
  bottom: 0;
  left: 0;
  right: 0;
  max-height: 86vh;
  border-top-left-radius: 18px;
  border-top-right-radius: 18px;
  border-top-width: 1px;
  /* 适配 iPhone 底部手势条 */
  padding-bottom: env(safe-area-inset-bottom, 0px);
}
@media (min-width: 768px) {
  .story-panel {
    top: 0;
    bottom: 0;
    left: auto;
    width: min(480px, 92vw);
    max-height: none;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    border-top-width: 0;
    border-left-width: 1px;
  }
}

.story-enter-active,
.story-leave-active {
  transition:
    transform 0.48s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.32s ease;
}
.story-enter-from,
.story-leave-to {
  opacity: 0.5;
  transform: translateX(100%);
}
@media (max-width: 767px) {
  .story-enter-from,
  .story-leave-to {
    transform: translateY(100%);
  }
}

.veil-enter-active,
.veil-leave-active {
  transition: opacity 0.35s ease;
}
.veil-enter-from,
.veil-leave-to {
  opacity: 0;
}
</style>

<style scoped>
.panel-topline {
  height: 3px;
  flex: none;
  background: linear-gradient(
    90deg,
    transparent,
    color-mix(in srgb, var(--nc) 85%, transparent) 30%,
    color-mix(in srgb, var(--nc) 85%, transparent) 70%,
    transparent
  );
}

.cat-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  letter-spacing: 0.22em;
  color: #b7b19d;
  padding-top: 4px;
}
.cat-chip .dot {
  width: 9px;
  height: 9px;
  border-radius: 9999px;
  background: var(--nc);
  box-shadow: 0 0 10px color-mix(in srgb, var(--nc) 75%, transparent);
}

.close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 9999px;
  font-size: 15px;
  color: #a9a493;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.04);
  transition: all 0.25s;
  cursor: pointer;
}
.close-btn:hover {
  color: #f4eddc;
  border-color: rgba(230, 207, 151, 0.45);
  background: rgba(230, 207, 151, 0.1);
  transform: rotate(90deg);
}

.tag {
  display: inline-flex;
  align-items: center;
  border-radius: 9999px;
  border: 1px solid color-mix(in srgb, var(--nc) 45%, transparent);
  background: color-mix(in srgb, var(--nc) 10%, transparent);
  color: color-mix(in srgb, var(--nc) 60%, #ece5d3);
  padding: 4px 13px;
  font-size: 12.5px;
  letter-spacing: 0.12em;
}

.sec-title {
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.5em;
  color: #a37f42;
}

.dropcap {
  float: left;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 46px;
  margin: 5px 12px 2px 0;
  border-radius: 9px;
  font-size: 24px;
  font-weight: 900;
  color: color-mix(in srgb, var(--nc) 70%, #f4eddc);
  border: 1px solid color-mix(in srgb, var(--nc) 45%, transparent);
  background: color-mix(in srgb, var(--nc) 12%, transparent);
}

blockquote {
  border-left: 3px solid color-mix(in srgb, var(--nc) 75%, transparent);
  background: color-mix(in srgb, var(--nc) 7%, transparent);
}

/* 大事刻度：竖排时间线 */
.moment-list {
  border-left: 1px solid color-mix(in srgb, var(--nc) 30%, transparent);
  margin-left: 52px;
  padding-left: 0;
  list-style: none;
}
.moment {
  position: relative;
  display: flex;
  align-items: baseline;
  gap: 10px;
  padding: 7px 0;
}
.moment:last-child {
  padding-bottom: 2px;
}
.m-year {
  position: absolute;
  left: -62px;
  width: 52px;
  text-align: right;
  font-size: 11px;
  letter-spacing: 0.04em;
  color: #b7b19d;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
.m-node {
  position: absolute;
  left: -3.5px;
  top: 13px;
  width: 6px;
  height: 6px;
  border-radius: 9999px;
  background: color-mix(in srgb, var(--nc) 85%, #ece5d3);
  box-shadow: 0 0 8px color-mix(in srgb, var(--nc) 55%, transparent);
}
.m-text {
  font-size: 13.5px;
  line-height: 1.8;
  color: #cfc9b6;
}

/* 其人：人物章 */
.figure-chip {
  border: 1px solid color-mix(in srgb, var(--nc) 40%, transparent);
  background: color-mix(in srgb, var(--nc) 8%, transparent);
  color: color-mix(in srgb, var(--nc) 45%, #ece5d3);
  border-radius: 8px;
  padding: 5px 14px;
  font-size: 13px;
  letter-spacing: 0.14em;
}

/* 史籍一言 */
.quote-block {
  text-align: center;
  padding: 18px 8px 14px;
  border-top: 1px dashed rgba(163, 127, 66, 0.35);
  border-bottom: 1px dashed rgba(163, 127, 66, 0.35);
}
.q-text {
  font-size: 15px;
  line-height: 2;
  color: #e6cf97;
  letter-spacing: 0.04em;
}
.q-src {
  margin-top: 8px;
  font-size: 11.5px;
  letter-spacing: 0.2em;
  color: #8d8776;
}

.nav-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  cursor: pointer;
  transition: background 0.25s;
}
.nav-btn:not(:disabled):hover {
  background: rgba(230, 207, 151, 0.06);
}
.nav-btn:disabled {
  cursor: default;
  opacity: 0.45;
}
.nav-arrow {
  font-size: 15px;
  color: #a37f42;
}
.nav-hint {
  display: block;
  font-size: 10.5px;
  letter-spacing: 0.3em;
  color: #6e6a5c;
}
.nav-name {
  display: block;
  margin-top: 3px;
  font-size: 14.5px;
  letter-spacing: 0.08em;
  color: #ded7c3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
