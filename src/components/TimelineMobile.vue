<script setup lang="ts">
import type { Dynasty } from '../data/dynasties'
import DynastySeal from './DynastySeal.vue'

const props = defineProps<{ list: Dynasty[] }>()
const emit = defineEmits<{ select: [dynasty: Dynasty] }>()
</script>

<template>
  <section class="relative md:hidden" aria-label="朝代时间轴（纵向长河）">
    <div class="relative mx-5 pb-4 pt-2">
      <!-- 纵向主脉 -->
      <div
        class="absolute bottom-3 left-[29px] top-3 w-px"
        style="
          background: linear-gradient(
            180deg,
            rgba(176, 128, 80, 0.55),
            rgba(217, 184, 119, 0.4) 30%,
            rgba(169, 72, 72, 0.4) 62%,
            rgba(224, 82, 99, 0.6)
          );
        "
        aria-hidden="true"
      />

      <ol class="space-y-4">
        <li v-for="d in props.list" :key="d.id">
          <button
            type="button"
            class="group flex w-full items-center gap-4 text-left"
            :aria-label="`${d.name}（${d.shortYears}），点击展开故事面板`"
            @click="emit('select', d)"
          >
            <span class="relative z-10 shrink-0 rounded-full bg-ink-950/80 p-1">
              <DynastySeal :dynasty="d" size="md" :tooltip="false" decorative />
            </span>

            <span
              class="card flex flex-1 items-center gap-3 rounded-xl border border-ink-700/90 bg-ink-850/70 px-4 py-3 transition-colors group-active:border-gold-500/50"
            >
              <span class="min-w-0 flex-1">
                <span class="block truncate text-[17px] font-semibold tracking-wide text-parchment">
                  {{ d.name }}
                </span>
                <span class="mt-0.5 block text-[11px] tracking-wider text-mist tabular-nums">
                  {{ d.shortYears }}
                </span>
              </span>
              <span class="text-xs text-faint transition-transform group-active:translate-x-0.5">›</span>
            </span>
          </button>
        </li>
      </ol>
    </div>
  </section>
</template>
