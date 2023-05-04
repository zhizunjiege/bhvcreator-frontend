<template>
  <q-btn
    flat
    round
    size="sm"
    icon="bi-plus-circle"
    class="q-mx-xs ui-clickable"
    @click="push"
  >
    <q-tooltip anchor="top middle" self="bottom middle"> 添加 </q-tooltip>
  </q-btn>
</template>

<script setup lang="ts">
import { deepCopy } from "~/utils";

/* eslint-disable @typescript-eslint/no-explicit-any */
const props = defineProps<{
  modelValue: any[];
  template: any;
}>();
const emits = defineEmits<{
  (e: "update:modelValue", modelValue: any[]): void;
  (e: "action:push", index: number): void;
}>();
/* eslint-enable @typescript-eslint/no-explicit-any */

const rows = computed(() => props.modelValue);

function push() {
  rows.value.push(deepCopy(props.template));
  emits("update:modelValue", rows.value);
  emits("action:push", rows.value.length - 1);
}
</script>

<style scoped lang="scss"></style>
