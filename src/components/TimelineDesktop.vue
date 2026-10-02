<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

import { bandYears, dynastyColor, type Dynasty } from '../data/dynasties'
import DynastySeal from './DynastySeal.vue'

const props = defineProps<{ list: Dynasty[] }>()
const emit = defineEmits<{ select: [dynasty: Dynasty] }>()

/** 印章中心距色带左缘的水平位置 */
const SEAL_X = 76
const STRIP_H = 400

type Tier = { size: 'md' | 'lg' | 'xl'; half: number }

function tierOf(d: Dynasty): Tier {
  const years = d.endYear - d.startYear
  if (d.ongoing) return { size: 'lg', half: 37 }
  if (years >= 350) return { size: 'xl', half: 45 }
  if (years >= 90) return { size: 'lg', half: 37 }
  return { size: 'md', half: 29 }
}

/** 色带宽度：对国祚开平方缩放——长世系宽阔、短命朝窄瘦，但短带仍有最低可读宽度 */
function bandWidth(d: Dynasty): number {
  const base = Math.round(108 + 13.5 * Math.sqrt(bandYears(d)))
  return base + (d.ongoing ? 150 : 0)
}

const scrollEl = ref<HTMLElement | null>(null)

/* 滚轮纵转横（非被动监听，需 preventDefault） */
function onWheel(e: WheelEvent) {
  const el = scrollEl.value
  if (!el) return
  if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return
  const goingRight = e.deltaY > 0
  const atStart = el.scrollLeft <= 0
  const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1
  if ((goingRight && atEnd) || (!goingRight && atStart)) return
  e.preventDefault()
  el.scrollLeft += e.deltaY
}

/* 鼠标拖拽横移 */
const drag = { active: false, moved: 0, startX: 0, startScroll: 0 }

function onPointerDown(e: PointerEvent) {
  if (e.pointerType !== 'mouse' || !scrollEl.value) return
  drag.active = true
  drag.moved = 0
  drag.startX = e.clientX
  drag.startScroll = scrollEl.value.scrollLeft
}
function onPointerMove(e: PointerEvent) {
  if (!drag.active || !scrollEl.value) return
  const dx = e.clientX - drag.startX
  drag.moved = Math.max(drag.moved, Math.abs(dx))
  scrollEl.value.scrollLeft = drag.startScroll - dx
}
function onPointerUp() {
  drag.active = false
}
/* 拖拽超过阈值后吞掉落点上的 click，避免误开面板 */
function onClickCapture(e: MouseEvent) {
  if (drag.moved > 6) {
    e.stopPropagation()
    e.preventDefault()
  }
}

onMounted(() => {
  scrollEl.value?.addEventListener('wheel', onWheel, { passive: false })
})
onBeforeUnmount(() => {
  scrollEl.value?.removeEventListener('wheel', onWheel)
})
</script>

<template>
  <section class="relative hidden md:block" aria-label="朝代时间轴（横向长河）">
    <div class="relative">
      <!-- 长河滚动区 -->
      <div
        ref="scrollEl"
        class="river-scroll relative select-none overflow-x-auto overflow-y-hidden cursor-grab active:cursor-grabbing"
        :style="{ height: STRIP_H + 'px' }"
        @pointerdown="onPointerDown"
        @pointermove="onPointerMove"
        @pointerup="onPointerUp"
        @pointercancel="onPointerUp"
        @click.capture="onClickCapture"
      >
        <div class="relative flex h-full items-stretch gap-[3px] pl-14 pr-16">
          <!-- 轴线（长河主脉） -->
          <div class="axis" aria-hidden="true" />

          <div
            v-for="(d, i) in props.list"
            :key="d.id"
            class="era"
            :style="{ width: bandWidth(d) + 'px', '--nc': dynastyColor(d) }"
          >
            <!-- 时代色带 -->
            <div class="band" :class="{ 'band-open': d.ongoing }" aria-hidden="true">
              <span v-if="d.ongoing" class="open-mark">至今</span>
            </div>

            <!-- 印章 -->
            <div
              class="absolute top-1/2 -translate-y-1/2"
              :style="{ left: SEAL_X + 'px' }"
            >
              <DynastySeal
                :dynasty="d"
                :size="tierOf(d).size"
                :tip-side="i % 2 === 0 ? 'bottom' : 'top'"
                @select="emit('select', $event)"
              />
            </div>

            <!-- 名称标签（上下交错） -->
            <div
              class="label"
              :class="i % 2 === 0 ? 'label-up' : 'label-down'"
              :style="{ left: SEAL_X + 'px', '--off': tierOf(d).half + 14 + 'px' }"
            >
              <p class="label-name">{{ d.name }}</p>
              <p class="label-years">{{ d.shortYears }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 左右渐隐 -->
      <div class="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-ink-950 to-transparent" aria-hidden="true" />
      <div class="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-ink-950 to-transparent" aria-hidden="true" />

      <!-- 操作提示 -->
      <div
        class="pointer-events-none absolute bottom-4 left-1/2 z-10 -translate-x-1/2 rounded-full border border-ink-600/80 bg-ink-850/80 px-5 py-1.5 text-[11px] tracking-[0.25em] text-mist backdrop-blur-sm"
      >
        滚轮 / 拖拽 沿长河横移 · 点击印章展开故事
      </div>
    </div>
  </section>
</template>

<style scoped>
.axis {
  position: absolute;
  /* 与首个色带起点对齐：夏之前不画轴线，避免"长河源头之前"的穿帮 */
  left: 56px;
  right: 0;
  top: 50%;
  height: 3px;
  transform: translateY(-50%);
  border-radius: 9999px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(217, 184, 119, 0.35) 4%,
    rgba(217, 184, 119, 0.3) 82%,
    rgba(224, 82, 99, 0.5) 99%,
    transparent
  );
}

.era {
  position: relative;
  flex: none;
  height: 100%;
}

.band {
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  height: 58px;
  transform: translateY(-50%);
  border-radius: 9999px;
  background: color-mix(in srgb, var(--nc) 13%, transparent);
  border: 1px solid color-mix(in srgb, var(--nc) 32%, transparent);
  box-shadow: inset 0 0 22px color-mix(in srgb, var(--nc) 12%, transparent);
  pointer-events: none;
  transition: background 0.3s, border-color 0.3s, box-shadow 0.3s;
}
.era:hover .band {
  background: color-mix(in srgb, var(--nc) 22%, transparent);
  border-color: color-mix(in srgb, var(--nc) 55%, transparent);
  box-shadow: inset 0 0 30px color-mix(in srgb, var(--nc) 22%, transparent);
}
.band-open {
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--nc) 16%, transparent),
    color-mix(in srgb, var(--nc) 4%, transparent)
  );
}
.open-mark {
  position: absolute;
  right: 26px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 13px;
  letter-spacing: 0.3em;
  color: color-mix(in srgb, var(--nc) 75%, #f4eddc);
  opacity: 0.85;
}

.label {
  position: absolute;
  transform: translateX(-50%);
  text-align: center;
  white-space: nowrap;
  pointer-events: none;
}
.label-up {
  bottom: calc(50% + var(--off));
}
.label-down {
  top: calc(50% + var(--off));
}
.label-name {
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.1em;
  color: #ded7c3;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.8);
}
.label-years {
  margin-top: 3px;
  font-size: 11.5px;
  letter-spacing: 0.08em;
  color: #a39d89;
  font-variant-numeric: tabular-nums;
}
</style>
