<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'

import {
  asiaEvents,
  eraMarks,
  europeBands,
  europeEvents,
  type TimelineEvent,
} from '../data/eurasiaEvents'
import { dynastyAt, dynastyColor, dynastyList } from '../data/dynasties'

/*
 * 真比例双轨时间图：上轨中国（朝代色带铺底 + 大事），下轨欧洲（大事 + 整合期色带）。
 * 刻度等距如实——欧亚两端的事件密度、发展速度差、"大分流"，全部由真实比例呈现。
 */

const YEAR_MIN = -2100
const YEAR_MAX = 2060
const PXY = 0.85 // px / 年
const PAD_L = 78
const PAD_R = 52

const RULER_H = 34 // 与样式内 .gridline 的 top 对应
const RIBBON_H = 24
const ROW_H = 30
const GAP_H = 34

const CONTENT_W = Math.round(PAD_L + (YEAR_MAX - YEAR_MIN) * PXY + PAD_R)

function xOf(year: number): number {
  return PAD_L + (year - YEAR_MIN) * PXY
}

const RULERS = [-2000, -1500, -1000, -500, 0, 500, 1000, 1500, 2000]
function rulerLabel(y: number): string {
  if (y === 0) return '公元元年'
  return y < 0 ? `前${-y}` : `${y}`
}

/* ---------- 事件排布：按 x 贪心分行防重叠 ---------- */

interface PlacedEvent {
  ev: TimelineEvent
  cx: number // 锚点（点或条的中心）
  barW: number // 0 = 圆点
  row: number
  color: string
  dynastyName?: string
  dynastyColor?: string
}

function shortName(n: string): string {
  return n.replace(/（.*）/, '')
}

function placeEvents(side: 'asia' | 'europe'): PlacedEvent[] {
  const src = (side === 'asia' ? asiaEvents : europeEvents)
    .slice()
    .sort((a, b) => a.startYear - b.startYear)
  const rowsEnd: number[] = []
  return src.map((ev) => {
    const x1 = xOf(ev.startYear)
    const x2 = xOf(ev.endYear ?? ev.startYear)
    const barW = (ev.endYear ?? 0) - ev.startYear >= 8 ? Math.max(x2 - x1, 12) : 0
    const cx = Math.round((x1 + x2) / 2)
    const w = 26 + ev.name.length * 13
    let row = rowsEnd.findIndex((end) => cx - w / 2 > end + 8)
    if (row === -1) {
      row = rowsEnd.length
      rowsEnd.push(cx + w / 2)
    } else {
      rowsEnd[row] = cx + w / 2
    }
    const d = dynastyAt(Math.round((ev.startYear + (ev.endYear ?? ev.startYear)) / 2))
    return {
      ev,
      cx,
      barW: Math.round(barW),
      row,
      color: side === 'asia' ? (d ? dynastyColor(d) : '#d9b877') : '#7f9bd1',
      dynastyName: d ? shortName(d.name) : undefined,
      dynastyColor: d ? dynastyColor(d) : undefined,
    }
  })
}

const asiaPlaced = computed(() => placeEvents('asia'))
const europePlaced = computed(() => placeEvents('europe'))
const asiaRows = computed(() => Math.max(...asiaPlaced.value.map((p) => p.row)) + 1)
const europeRows = computed(() => Math.max(...europePlaced.value.map((p) => p.row)) + 1)

const ASIA_TOP = RULER_H + 8
const ASIA_H = computed(() => RIBBON_H + 12 + asiaRows.value * ROW_H)
const EUROPE_TOP = computed(() => ASIA_TOP + ASIA_H.value + GAP_H)
const EUROPE_H = computed(() => RIBBON_H + 12 + europeRows.value * ROW_H)
const CONTENT_H = computed(() => EUROPE_TOP.value + EUROPE_H.value + 44)

/** 亚洲轨行 y（行 0 贴色带，行号越大越靠上）；返回圆点中心 */
function asiaRowY(row: number): number {
  return ASIA_H.value - RIBBON_H - 12 - row * ROW_H - ROW_H / 2
}
/** 欧洲轨行 y（行 0 贴色带，行号越大越靠下） */
function europeRowY(row: number): number {
  return RIBBON_H + 12 + row * ROW_H + ROW_H / 2
}
/** 亚洲事件杆：从圆点向下到色带顶 */
function asiaStem(row: number): number {
  return 12 + row * ROW_H + ROW_H / 2 - 6
}
/** 欧洲事件杆：从圆点向上到色带底 */
function europeStem(row: number): number {
  return europeRowY(row) - RIBBON_H - 6
}

/* ---------- 朝代色带 / 欧洲整合期色带 ---------- */

const asiaBands = computed(() =>
  dynastyList.map((d) => {
    const s = d.bandStart ?? d.startYear
    const e = Math.min(d.bandEnd ?? d.endYear, YEAR_MAX)
    const w = Math.max((e - s) * PXY, 3)
    const label = shortName(d.seal === '五代' ? '五代十国' : d.name)
    return { id: d.id, x: xOf(s), w, color: dynastyColor(d), label, show: w >= label.length * 13 + 10, title: d.name }
  }),
)

const euBands = computed(() =>
  europeBands.map((b) => {
    const w = Math.max((b.endYear - b.startYear) * PXY, 14)
    return { id: b.id, x: xOf(b.startYear), w, color: b.color, label: b.name, show: w >= b.name.length * 13 + 10, title: `${b.name}：${b.desc}` }
  }),
)

/* ---------- 提示卡（悬停即显，点按/聚焦钉住） ---------- */

interface TipState {
  p: PlacedEvent | null
  left: number
  top: number // 中国轨：自轨底向下展开（轨顶上方仅 42px 刻度区，向上必被 overflow 裁切）
  bottom: number // 欧洲轨：自轨顶向上展开（上方有整条中国轨纵深可用）
  pinned: boolean
}

const tip = reactive<TipState>({ p: null, left: 0, top: 0, bottom: 0, pinned: false })

const scrollerEl = ref<HTMLElement | null>(null)

function applyTip(p: PlacedEvent, pin = false) {
  const narrow = window.innerWidth < 768
  const half = narrow ? 98 : 112
  tip.p = p
  let left = Math.max(p.cx, PAD_L + half)
  const el = scrollerEl.value
  if (el) {
    // 与当前可视窗口取交集：悬停瞬间卡片完整可见，不被滚动容器右缘裁切
    const lo = Math.max(PAD_L + half, el.scrollLeft + half + 8)
    const hi = Math.min(CONTENT_W - half, el.scrollLeft + el.clientWidth - half - 8)
    left = Math.min(Math.max(left, lo), Math.max(lo, hi))
  } else {
    left = Math.min(left, CONTENT_W - half)
  }
  tip.left = left
  if (p.ev.side === 'asia') {
    tip.top = ASIA_TOP + ASIA_H.value + 8
    tip.bottom = 0
  } else {
    tip.bottom = CONTENT_H.value - EUROPE_TOP.value + 10
    tip.top = 0
  }
  tip.pinned = pin
}

function unpin() {
  if (!tip.pinned) tip.p = null
}

function dismiss() {
  tip.p = null
  tip.pinned = false
}

const tipStyle = computed(() => {
  if (!tip.p) return {}
  const base: Record<string, string> = { left: tip.left + 'px', '--nc': tip.p.color }
  // 动态限高：卡片极端超高时在卡内滚动，保证任何方向都不被滚动容器裁切
  if (tip.p.ev.side === 'asia') {
    base.top = tip.top + 'px'
    base.maxHeight = CONTENT_H.value - tip.top - 2 + 'px'
  } else {
    base.bottom = tip.bottom + 'px'
    base.maxHeight = tip.bottom - 2 + 'px'
  }
  return base
})

function onGlobalDown(e: PointerEvent) {
  if (!tip.pinned) return
  const t = e.target as HTMLElement
  if (t.closest('.ev-tip') || t.closest('.ev-marker')) return
  dismiss()
}
function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') dismiss()
}

onMounted(() => {
  document.addEventListener('pointerdown', onGlobalDown)
  window.addEventListener('keydown', onKeydown)
})
onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onGlobalDown)
  window.removeEventListener('keydown', onKeydown)
})

function timeText(ev: TimelineEvent): string {
  const fmt = (y: number) => (y < 0 ? `公元前 ${-y} 年` : y === 0 ? '公元元年' : `公元 ${y} 年`)
  return ev.endYear ? `${fmt(ev.startYear)} — ${fmt(ev.endYear)}` : fmt(ev.startYear)
}

const legendItems = [
  { label: '中国大事', cls: 'dot-gold' },
  { label: '欧洲大事', cls: 'dot-blue' },
  { label: '跨代进程', cls: 'bar' },
  { label: '欧洲整合期', cls: 'band' },
  { label: '同世代对照', cls: 'era' },
]
</script>

<template>
  <section class="relative px-2 md:px-6" aria-label="欧亚对照时间图">
    <!-- 视图说明 + 图例 -->
    <div class="mx-auto max-w-4xl px-4 text-center">
      <h2 class="text-xl font-black tracking-[0.2em] text-parchment md:text-2xl">欧亚对照 · 四千年并读</h2>
      <p class="mx-auto mt-3 max-w-2xl text-[13px] leading-6 text-mist md:text-sm">
        上轨中国，下轨欧洲，刻度等距如实。欧洲除罗马外几乎没有长期统一政权——于是不比朝代，比大事：
        看事件落在中国哪个朝代的位置上，看"分久必合"与"合久必分"如何在两端各自上演。
      </p>
      <div class="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11.5px] text-ivory/80 md:text-xs">
        <span v-for="item in legendItems" :key="item.label" class="flex items-center gap-2">
          <i :class="['lg-mark', item.cls]" aria-hidden="true" />
          {{ item.label }}
        </span>
      </div>
    </div>

    <div class="relative mt-6">
      <div
        ref="scrollerEl"
        class="river-scroll relative select-none overflow-x-auto overflow-y-hidden"
        :style="{ height: CONTENT_H + 'px' }"
      >
        <div class="relative" :style="{ width: CONTENT_W + 'px', height: CONTENT_H + 'px' }">
          <!-- 世纪网格与刻度 -->
          <template v-for="y in RULERS" :key="y">
            <div class="gridline" :style="{ left: xOf(y) + 'px' }" aria-hidden="true" />
            <span class="ruler-label" :style="{ left: xOf(y) + 'px' }">{{ rulerLabel(y) }}</span>
          </template>

          <!-- 同世代对照列 -->
          <div
            v-for="era in eraMarks"
            :key="era.id"
            class="era-col"
            :style="{
              left: xOf(era.year - (era.halfWidth ?? 80)) + 'px',
              width: (era.halfWidth ?? 80) * 2 * PXY + 'px',
            }"
            :title="`${era.label}：${era.desc}`"
          >
            <span class="era-line" aria-hidden="true" />
            <span class="era-tag">{{ era.label }}</span>
          </div>

          <!-- 中国轨 -->
          <div class="absolute" :style="{ top: ASIA_TOP + 'px', left: 0, width: CONTENT_W + 'px', height: ASIA_H + 'px' }">
            <span class="lane-chip" :style="{ marginTop: ASIA_H / 2 - 14 + 'px' }">中国 · 亚洲</span>

            <div v-for="b in asiaBands" :key="b.id" class="dyna-band" :style="{ left: b.x + 'px', width: b.w + 'px', '--nc': b.color }" :title="b.title">
              <span v-if="b.show" class="dyna-band-name">{{ b.label }}</span>
            </div>

            <div v-for="p in asiaPlaced" :key="p.ev.id" class="ev-wrap" :style="{ left: p.cx + 'px', top: asiaRowY(p.row) + 'px' }">
              <span class="ev-stem" :style="{ height: asiaStem(p.row) + 'px' }" aria-hidden="true" />
              <div
                class="ev-marker"
                :class="p.barW ? 'ev-bar' : 'ev-dot'"
                :style="{ '--nc': p.color, width: p.barW ? p.barW + 'px' : undefined }"
                tabindex="0"
                @mouseenter="applyTip(p)"
                @mouseleave="unpin"
                @focus="applyTip(p)"
                @click="applyTip(p, true)"
              />
              <span class="ev-label">{{ p.ev.name }}</span>
            </div>
          </div>

          <!-- 欧洲轨 -->
          <div class="absolute" :style="{ top: EUROPE_TOP + 'px', left: 0, width: CONTENT_W + 'px', height: EUROPE_H + 'px' }">
            <span class="lane-chip" :style="{ marginTop: EUROPE_H / 2 - 14 + 'px' }">欧洲</span>

            <div v-for="b in euBands" :key="b.id" class="dyna-band" :style="{ left: b.x + 'px', width: b.w + 'px', '--nc': b.color }" :title="b.title">
              <span v-if="b.show" class="dyna-band-name">{{ b.label }}</span>
            </div>

            <div v-for="p in europePlaced" :key="p.ev.id" class="ev-wrap" :style="{ left: p.cx + 'px', top: europeRowY(p.row) + 'px' }">
              <span class="ev-stem up" :style="{ height: europeStem(p.row) + 'px' }" aria-hidden="true" />
              <div
                class="ev-marker"
                :class="p.barW ? 'ev-bar' : 'ev-dot'"
                :style="{ '--nc': p.color, width: p.barW ? p.barW + 'px' : undefined }"
                tabindex="0"
                @mouseenter="applyTip(p)"
                @mouseleave="unpin"
                @focus="applyTip(p)"
                @click="applyTip(p, true)"
              />
              <span class="ev-label">{{ p.ev.name }}</span>
            </div>
          </div>

          <!-- 提示卡：中国轨向下展开 / 欧洲轨向上展开 -->
          <div
            v-if="tip.p"
            class="ev-tip"
            :class="{ pinned: tip.pinned }"
            :style="tipStyle"
            role="status"
          >
            <p class="tip-title">{{ tip.p.ev.name }}</p>
            <p class="tip-time">{{ timeText(tip.p.ev) }}</p>
            <p class="tip-desc">{{ tip.p.ev.desc }}</p>
            <p v-if="tip.p.dynastyName" class="tip-dyn">
              <i class="dot" :style="{ background: tip.p.dynastyColor }" />时值中国 · {{ tip.p.dynastyName }}
            </p>
            <p v-if="tip.p.ev.note" class="tip-note">◆ {{ tip.p.ev.note }}</p>
          </div>
        </div>
      </div>

      <!-- 左右渐隐 + 操作提示 -->
      <div class="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-ink-950 to-transparent" aria-hidden="true" />
      <div class="pointer-events-none absolute inset-y-0 right-0 z-10 w-14 bg-gradient-to-l from-ink-950 to-transparent" aria-hidden="true" />
      <div
        class="pointer-events-none absolute bottom-1 left-1/2 z-10 -translate-x-1/2 rounded-full border border-ink-600/80 bg-ink-850/80 px-4 py-1 text-[10.5px] tracking-[0.22em] text-mist backdrop-blur-sm md:text-[11px]"
      >
        横向滑动 · 悬停或点按事件查看详情
      </div>
    </div>
  </section>
</template>

<style scoped>
.gridline {
  position: absolute;
  top: 34px;
  bottom: 24px;
  width: 1px;
  background: linear-gradient(180deg, rgba(230, 207, 151, 0.22), rgba(230, 207, 151, 0.05));
  transform: translateX(-0.5px);
}
.ruler-label {
  position: absolute;
  top: 8px;
  transform: translateX(-50%);
  font-size: 11px;
  letter-spacing: 0.12em;
  color: #6e6a5c;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

/* 同世代对照列 */
.era-col {
  position: absolute;
  top: 38px;
  bottom: 24px;
  background: rgba(217, 184, 119, 0.045);
  border-left: 1px dashed rgba(217, 184, 119, 0.4);
  border-right: 1px dashed rgba(217, 184, 119, 0.4);
}
.era-line {
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 0;
  border-left: 1px dashed rgba(217, 184, 119, 0.5);
}
.era-tag {
  position: absolute;
  top: 4px;
  left: 50%;
  transform: translateX(-50%);
  padding: 3px 11px;
  border-radius: 9999px;
  font-size: 10.5px;
  letter-spacing: 0.28em;
  white-space: nowrap;
  color: #e6cf97;
  background: rgba(24, 21, 14, 0.9);
  border: 1px solid rgba(217, 184, 119, 0.45);
  z-index: 2;
}

/* 轨名贴纸：随横向滚动吸附在左侧 */
.lane-chip {
  position: sticky;
  left: 6px;
  display: inline-block;
  padding: 5px 12px;
  border-radius: 8px;
  font-size: 11.5px;
  letter-spacing: 0.3em;
  color: #ded7c3;
  background: rgba(19, 23, 34, 0.92);
  border: 1px solid rgba(230, 207, 151, 0.25);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.45);
  z-index: 25;
}

/* 色带（中国朝代 / 欧洲整合期） */
.dyna-band {
  position: absolute;
  top: 50%;
  height: 24px;
  transform: translateY(-50%);
  border-radius: 9999px;
  background: color-mix(in srgb, var(--nc) 16%, transparent);
  border: 1px solid color-mix(in srgb, var(--nc) 38%, transparent);
  box-shadow: inset 0 0 14px color-mix(in srgb, var(--nc) 14%, transparent);
  overflow: hidden;
  white-space: nowrap;
}
.dyna-band-name {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10.5px;
  letter-spacing: 0.2em;
  color: color-mix(in srgb, var(--nc) 75%, #ece5d3);
  opacity: 0.9;
}

/* 事件标记 */
.ev-wrap {
  position: absolute;
  z-index: 6;
}
.ev-marker {
  position: relative;
  z-index: 7;
  cursor: pointer;
  transform: translateX(-50%);
  transition: box-shadow 0.25s, filter 0.25s;
  padding: 0;
  border: none;
  background: none;
}
.ev-dot {
  width: 9px;
  height: 9px;
  margin-top: -4.5px;
  border-radius: 9999px;
  background: var(--nc);
  box-shadow:
    0 0 0 2.5px rgba(11, 13, 18, 0.9),
    0 0 12px color-mix(in srgb, var(--nc) 55%, transparent);
}
.ev-bar {
  height: 7px;
  margin-top: -3.5px;
  border-radius: 9999px;
  background: linear-gradient(90deg, var(--nc), color-mix(in srgb, var(--nc) 55%, #10131b));
  box-shadow:
    0 0 0 2.5px rgba(11, 13, 18, 0.9),
    0 0 12px color-mix(in srgb, var(--nc) 45%, transparent);
}
.ev-wrap:hover .ev-marker,
.ev-marker:focus-visible {
  filter: brightness(1.3);
  box-shadow:
    0 0 0 2.5px rgba(11, 13, 18, 0.9),
    0 0 20px color-mix(in srgb, var(--nc) 85%, transparent);
}
.ev-label {
  position: absolute;
  left: 0;
  top: 9px;
  transform: translateX(-50%);
  font-size: 11.5px;
  letter-spacing: 0.08em;
  white-space: nowrap;
  color: #cfc9b6;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.85);
  pointer-events: none;
}
.ev-wrap:hover .ev-label {
  color: #f4eddc;
}
.ev-stem {
  position: absolute;
  left: 0;
  top: 7px;
  width: 1px;
  transform: translateX(-0.5px);
  background: linear-gradient(180deg, rgba(230, 207, 151, 0.35), rgba(230, 207, 151, 0.04));
}
.ev-stem.up {
  top: auto;
  bottom: 7px;
  background: linear-gradient(0deg, rgba(230, 207, 151, 0.35), rgba(230, 207, 151, 0.04));
}

/* 提示卡 */
.ev-tip {
  position: absolute;
  z-index: 60;
  width: 224px;
  padding: 11px 13px 10px;
  border-radius: 10px;
  background: rgba(19, 23, 34, 0.97);
  border: 1px solid color-mix(in srgb, var(--nc) 45%, transparent);
  box-shadow: 0 16px 42px rgba(0, 0, 0, 0.6);
  transform: translateX(-50%);
  animation: tip-in 0.22s ease;
  overflow-y: auto;
}
@keyframes tip-in {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}
.tip-title {
  font-size: 14.5px;
  font-weight: 600;
  color: #f4eddc;
  letter-spacing: 0.06em;
}
.tip-time {
  margin-top: 2px;
  font-size: 11px;
  color: #b7b19d;
  font-variant-numeric: tabular-nums;
}
.tip-desc {
  margin-top: 7px;
  font-size: 12px;
  line-height: 1.75;
  color: #cfc9b6;
}
.tip-dyn {
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  letter-spacing: 0.12em;
  color: #ded7c3;
}
.tip-dyn .dot {
  width: 8px;
  height: 8px;
  border-radius: 9999px;
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.15);
}
.tip-note {
  margin-top: 8px;
  padding-top: 7px;
  border-top: 1px dashed rgba(230, 207, 151, 0.22);
  font-size: 11.5px;
  line-height: 1.7;
  color: #e6cf97;
}
.ev-tip.pinned {
  border-color: color-mix(in srgb, var(--nc) 80%, transparent);
}

/* 图例小标记 */
.lg-mark {
  display: inline-block;
  width: 12px;
  height: 12px;
  position: relative;
}
.lg-mark.dot-gold::before,
.lg-mark.dot-blue::before {
  content: '';
  position: absolute;
  inset: 2px;
  border-radius: 9999px;
}
.lg-mark.dot-gold::before {
  background: #d9b877;
  box-shadow: 0 0 8px #d9b87799;
}
.lg-mark.dot-blue::before {
  background: #7f9bd1;
  box-shadow: 0 0 8px #7f9bd199;
}
.lg-mark.bar::before {
  content: '';
  position: absolute;
  top: 4.5px;
  left: 0;
  right: 0;
  height: 4px;
  border-radius: 9999px;
  background: linear-gradient(90deg, #d9b877, #7f9bd1);
}
.lg-mark.band::before {
  content: '';
  position: absolute;
  inset: 3px 0;
  border-radius: 9999px;
  background: rgba(157, 123, 176, 0.35);
  border: 1px solid rgba(157, 123, 176, 0.7);
}
.lg-mark.era::before {
  content: '';
  position: absolute;
  top: -1px;
  bottom: -1px;
  left: 5px;
  border-left: 1.5px dashed #d9b877cc;
}

@media (max-width: 767px) {
  .ev-label {
    font-size: 10px;
    letter-spacing: 0.04em;
  }
  .ruler-label {
    font-size: 9.5px;
  }
  .era-tag {
    font-size: 9px;
    letter-spacing: 0.2em;
    padding: 2px 8px;
  }
  .lane-chip {
    font-size: 10px;
    letter-spacing: 0.2em;
    padding: 4px 9px;
  }
  .ev-tip {
    width: 190px;
  }
}
</style>
