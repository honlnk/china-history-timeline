<script setup lang="ts">
</script>

<template>
  <header class="relative px-6 pt-10 text-center md:pt-14">
    <p class="pl-[0.5em] text-[12px] tracking-[0.5em] text-gold-500/90 md:text-[13px]">
      四十个世纪的分与合
    </p>

    <h1 class="relative mt-5 inline-block">
      <span class="block pl-[0.16em] text-3xl font-black tracking-[0.16em] text-parchment md:text-5xl md:tracking-[0.2em]">
        中国历史长河
      </span>
      <span class="mt-4 block pl-[0.3em] text-sm tracking-[0.34em] text-gold-400/90 md:text-base">
        从夏朝到现代
      </span>
      <!-- 朱印 -->
      <span class="stamp" aria-hidden="true">史</span>
    </h1>

    <div class="mx-auto mt-7 max-w-xl">
      <div class="flex items-center justify-center gap-4" aria-hidden="true">
        <span class="h-px w-16 bg-gradient-to-r from-transparent to-gold-600/60 md:w-24" />
        <span class="text-[10px] text-gold-500/80">◆</span>
        <span class="h-px w-16 bg-gradient-to-l from-transparent to-gold-600/60 md:w-24" />
      </div>
      <p class="mt-5 text-[15px] leading-8 tracking-[0.12em] text-ivory/85 md:text-base">
        「短命王朝是<span class="text-c-sweeper">清道夫</span>，强盛王朝是<span class="text-c-unified">接盘侠</span>。<br />
        分久必合，合久必分。」
      </p>
    </div>
  </header>
</template>

<style scoped>
.stamp {
  position: absolute;
  top: 6px;
  right: -58px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  font-size: 20px;
  font-weight: 700;
  color: #f4eddc;
  background: linear-gradient(145deg, #a93228, #87231e);
  border: 1px solid rgba(244, 237, 220, 0.35);
  box-shadow:
    inset 0 0 0 2px rgba(0, 0, 0, 0.25),
    0 4px 14px rgba(158, 43, 37, 0.35);
  transform: rotate(6deg);
  opacity: 0.92;
}

@media (max-width: 767px) {
  .stamp {
    right: -12px;
    top: -14px;
    width: 32px;
    height: 32px;
    font-size: 15px;
  }
}
</style>
