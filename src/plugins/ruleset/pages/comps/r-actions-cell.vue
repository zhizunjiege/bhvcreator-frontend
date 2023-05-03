<template>
  <q-btn
    :disable="props.rowIndex === 0"
    flat
    round
    size="sm"
    icon="bi-arrow-up-circle"
    class="q-mx-xs ui-clickable"
    @click="up(props.rowIndex)"
  >
    <q-tooltip anchor="top middle" self="bottom middle"> 上移 </q-tooltip>
  </q-btn>
  <q-btn
    :disable="props.rowIndex === rows.length - 1"
    flat
    round
    size="sm"
    icon="bi-arrow-down-circle"
    class="q-mx-xs ui-clickable"
    @click="down(props.rowIndex)"
  >
    <q-tooltip anchor="top middle" self="bottom middle"> 下移 </q-tooltip>
  </q-btn>
  <q-btn
    flat
    round
    size="sm"
    icon="bi-files"
    class="q-mx-xs ui-clickable"
    @click="copy(props.rowIndex)"
  >
    <q-tooltip anchor="top middle" self="bottom middle"> 重复 </q-tooltip>
  </q-btn>
  <q-btn
    flat
    round
    size="sm"
    icon="bi-trash"
    class="q-mx-xs ui-clickable"
    @click="drop(props.rowIndex)"
  >
    <q-tooltip anchor="top middle" self="bottom middle"> 删除 </q-tooltip>
  </q-btn>
</template>

<script setup lang="ts">
import { deepCopy } from "~/utils";

/* eslint-disable @typescript-eslint/no-explicit-any */
const props = defineProps<{
  modelValue: any[];
  rowIndex: number;
}>();
const emits = defineEmits<{
  (e: "update:modelValue", modelValue: any[]): void;
  (e: "action:up", index: number): void;
  (e: "action:down", index: number): void;
  (e: "action:copy", index: number): void;
  (e: "action:drop", index: number): void;
}>();
/* eslint-enable @typescript-eslint/no-explicit-any */

const rows = computed(() => props.modelValue);

function update() {
  emits("update:modelValue", rows.value);
}

function swap(i: number, j: number) {
  const temp = rows.value[i];
  rows.value[i] = rows.value[j];
  rows.value[j] = temp;
}

function up(index: number) {
  if (index > 0) {
    swap(index, index - 1);
    update();
    emits("action:up", index);
  }
}
function down(index: number) {
  if (index < rows.value.length - 1) {
    swap(index, index + 1);
    update();
    emits("action:down", index);
  }
}
function copy(index: number) {
  rows.value.splice(index + 1, 0, deepCopy(rows.value[index]));
  update();
  emits("action:copy", index);
}
function drop(index: number) {
  rows.value.splice(index, 1);
  update();
  emits("action:drop", index);
}
</script>

<style propsd lang="scss"></style>
