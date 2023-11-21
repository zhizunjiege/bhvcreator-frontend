<template>
  <q-splitter
    :model-value="8"
    disable
    horizontal
    separator-class="transparent"
    class="fit q-pa-lg transparent"
  >
    <template #before>
      <q-tab-panels v-model="step" animated class="fit transparent">
        <q-tab-panel name="factor" class="fit q-pa-none">
          <q-card flat class="fit transparent">
            <q-card-section class="fit flex justify-between items-center">
              <q-btn flat square class="invisible o-btn" />
              <span class="text-h6"> 优化因子 </span>
              <q-btn
                flat
                square
                label="下一步"
                class="bg-secondary text-accent o-btn"
                @click="next"
              />
            </q-card-section>
          </q-card>
        </q-tab-panel>
        <q-tab-panel name="simulate" class="fit q-pa-none">
          <q-card flat class="fit transparent">
            <q-card-section class="fit flex justify-between items-center">
              <q-btn
                flat
                square
                label="上一步"
                class="bg-secondary text-accent o-btn"
                @click="back"
              />
              <span class="text-h6"> 优化仿真 </span>
              <q-btn flat square class="invisible o-btn" />
            </q-card-section>
          </q-card>
        </q-tab-panel>
      </q-tab-panels>
    </template>
    <template #after>
      <q-tab-panels v-model="step" animated class="fit transparent">
        <q-tab-panel name="factor" class="fit q-pa-none">
          <o-factor />
        </q-tab-panel>
        <q-tab-panel name="simulate" class="fit q-pa-none">
          <o-simulate />
        </q-tab-panel>
      </q-tab-panels>
    </template>
  </q-splitter>
</template>

<script setup lang="ts">
import { useOptimizeStore } from "../stores";
import oFactor from "./comps/o-factor.vue";
import oSimulate from "./comps/o-simulate.vue";

const $q = useQuasar();
const store = useOptimizeStore();

const step = ref("factor");

function next() {
  $q.dialog({
    title: "提示",
    message: "确认进入下一步？",
    cancel: true,
    persistent: true,
  }).onOk(() => {
    step.value = "simulate";
  });
}

function back() {
  $q.dialog({
    title: "提示",
    message: "确认返回上一步？",
    cancel: true,
    persistent: true,
  }).onOk(() => {
    store.optimizeEpoches = [];
    step.value = "factor";
  });
}
</script>

<style scoped lang="scss">
.o-btn {
  width: 10%;
}
</style>

<route lang="yaml">
name: optimize
</route>
