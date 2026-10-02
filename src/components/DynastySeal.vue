<script setup lang="ts">
import { computed } from 'vue'

import { CATEGORY_META, dynastyColor, type Dynasty } from '../data/dynasties'

const props = withDefaults(
  defineProps<{
    dynasty: Dynasty
    size?: 'md' | 'lg' | 'xl'
    /** 提示浮层出现的一侧 */
    tipSide?: 'top' | 'bottom'
    tooltip?: boolean
    /** 装饰态：渲染为非交互元素（用于整行已可点击的场景，避免按钮嵌套） */
    decorative?: boolean
  }>(),
  { size: 'md', tipSide: 'top', tooltip: true, decorative: false },
)

const emit = defineEmits<{ select: [dynasty: Dynasty] }>()

const color = computed(() => dynastyColor(props.dynasty))
const catLabel = computed(() => CATEGORY_META[props.dynasty.category].label)
const sealLabel = computed(
  () => `${props.dynasty.name}（${props.dynasty.shortYears}）印章`,
)
</script>

<template>
  <div class="seal-wrap" :style="{ '--nc': color }">
    <component
      :is="decorative ? 'span' : 'button'"
      :type="decorative ? undefined : 'button'"
      class="seal"
      :class="[`seal-${size}`, dynasty.seal.length > 1 ? `seal-${size}-w2` : '']"
      :aria-label="decorative ? sealLabel : `${dynasty.name}（${dynasty.shortYears}），点击展开故事面板`"
      :aria-hidden="decorative ? 'true' : undefined"
      @click="decorative ? undefined : emit('select', dynasty)"
    >
      <span>{{ dynasty.seal }}</span>
    </component>

    <div
      v-if="tooltip"
      class="tip"
      :class="tipSide === 'top' ? 'tip-up' : 'tip-down'"
      aria-hidden="true"
    >
      <p class="tip-name">{{ dynasty.name }}</p>
      <p class="tip-years">{{ dynasty.shortYears }}</p>
      <p class="tip-cat"><i class="dot" />{{ catLabel }} · {{ dynasty.reignNote }}</p>
      <p class="tip-hint">点击开启故事</p>
    </div>
  </div>
</template>

<style scoped>
.seal-wrap {
  position: relative;
  display: inline-flex;
}

.seal {
  --s: 58px;
  position: relative;
  z-index: 5;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--s);
  height: var(--s);
  padding: 0;
  border-radius: 9999px;
  font-family: var(--font-serif-sc);
  font-weight: 900;
  letter-spacing: 0.04em;
  color: #f7f1e0;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
  cursor: pointer;
  background: radial-gradient(
    circle at 32% 26%,
    color-mix(in srgb, var(--nc) 78%, #fff 22%),
    var(--nc) 55%,
    color-mix(in srgb, var(--nc) 52%, #000 48%)
  );
  border: 1px solid color-mix(in srgb, var(--nc) 55%, #f4eddc 45%);
  box-shadow:
    inset 0 0 0 3px rgba(11, 13, 18, 0.55),
    inset 0 0 0 4px color-mix(in srgb, var(--nc) 75%, transparent),
    0 10px 24px rgba(0, 0, 0, 0.55),
    0 0 22px color-mix(in srgb, var(--nc) 28%, transparent);
  transition:
    transform 0.35s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.35s ease;
}

.seal-md { --s: 58px; font-size: 22px; }
.seal-lg { --s: 74px; font-size: 28px; }
.seal-xl { --s: 90px; font-size: 34px; }
.seal-md-w2 { font-size: 15px; }
.seal-lg-w2 { font-size: 19px; }
.seal-xl-w2 { font-size: 23px; }

.seal-wrap:hover .seal,
.seal:focus-visible {
  transform: scale(1.08);
  box-shadow:
    inset 0 0 0 3px rgba(11, 13, 18, 0.55),
    inset 0 0 0 4px color-mix(in srgb, var(--nc) 90%, transparent),
    0 14px 32px rgba(0, 0, 0, 0.6),
    0 0 44px color-mix(in srgb, var(--nc) 55%, transparent);
}

/* 悬停提示 */
.tip {
  position: absolute;
  left: 50%;
  z-index: 40;
  min-width: 158px;
  padding: 10px 14px 9px;
  border-radius: 10px;
  background: rgba(19, 23, 34, 0.97);
  border: 1px solid rgba(230, 207, 151, 0.25);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.6);
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition:
    opacity 0.22s ease,
    transform 0.28s cubic-bezier(0.22, 1, 0.36, 1),
    visibility 0.22s;
  text-align: left;
}
.tip-up { bottom: calc(100% + 14px); transform: translate(-50%, 8px); }
.tip-down { top: calc(100% + 14px); transform: translate(-50%, -8px); }

.seal-wrap:hover .tip,
.seal:focus-visible + .tip {
  opacity: 1;
  visibility: visible;
  transform: translate(-50%, 0);
}

.tip-name {
  font-size: 15px;
  font-weight: 600;
  color: #f4eddc;
  letter-spacing: 0.06em;
}
.tip-years {
  margin-top: 2px;
  font-size: 12px;
  color: #b7b19d;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.04em;
}
.tip-cat {
  margin-top: 6px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: #8f8a78;
}
.tip-cat .dot {
  width: 7px;
  height: 7px;
  border-radius: 9999px;
  background: var(--nc);
  box-shadow: 0 0 8px color-mix(in srgb, var(--nc) 70%, transparent);
}
.tip-hint {
  margin-top: 7px;
  padding-top: 6px;
  border-top: 1px dashed rgba(230, 207, 151, 0.18);
  font-size: 10px;
  letter-spacing: 0.3em;
  color: #6e6a5c;
}
</style>
