<template>
  <q-btn
    v-if="!actions || actions.includes('add')"
    :size="size"
    :class="margin ? 'q-mx-xs' : ''"
    flat
    round
    icon="bi-plus-circle"
    class="ui-clickable"
    @click="add"
  >
    <q-tooltip anchor="top middle" self="bottom middle"> 添加 </q-tooltip>
  </q-btn>
  <q-btn
    v-if="!actions || actions.includes('up')"
    :disable="rowIndex === 0"
    :size="size"
    :class="margin ? 'q-mx-xs' : ''"
    flat
    round
    icon="bi-arrow-up-circle"
    class="ui-clickable"
    @click="up"
  >
    <q-tooltip anchor="top middle" self="bottom middle"> 上移 </q-tooltip>
  </q-btn>
  <q-btn
    v-if="!actions || actions.includes('down')"
    :disable="rowIndex === rows.length - 1"
    :size="size"
    :class="margin ? 'q-mx-xs' : ''"
    flat
    round
    icon="bi-arrow-down-circle"
    class="ui-clickable"
    @click="down"
  >
    <q-tooltip anchor="top middle" self="bottom middle"> 下移 </q-tooltip>
  </q-btn>
  <q-btn
    v-if="!actions || actions.includes('copy')"
    :size="size"
    :class="margin ? 'q-mx-xs' : ''"
    flat
    round
    icon="bi-files"
    class="ui-clickable"
    @click="copy"
  >
    <q-tooltip anchor="top middle" self="bottom middle"> 重复 </q-tooltip>
  </q-btn>
  <q-btn
    v-if="!actions || actions.includes('del')"
    :size="size"
    :class="margin ? 'q-mx-xs' : ''"
    flat
    round
    icon="bi-trash"
    class="ui-clickable"
    @click="del"
  >
    <q-tooltip anchor="top middle" self="bottom middle"> 删除 </q-tooltip>
  </q-btn>
</template>

<script setup lang="ts">
import { deepCopy } from "~/utils";

/* eslint-disable @typescript-eslint/no-explicit-any */
const props = withDefaults(
  defineProps<{
    modelValue: any[];
    rowIndex?: number;
    template?: () => any;
    actions?: string;
    size?: string;
    margin?: boolean;
  }>(),
  {
    rowIndex: -1,
    template: () => null,
    actions: "",
    size: "sm",
    margin: false,
  }
);
const emits = defineEmits<{
  (e: "action:add", index: number): void;
  (e: "action:up", index: number): void;
  (e: "action:down", index: number): void;
  (e: "action:copy", index: number): void;
  (e: "action:del", index: number): void;
}>();
/* eslint-enable @typescript-eslint/no-explicit-any */

const rows = computed(() => props.modelValue);

function add() {
  const i = props.rowIndex;
  rows.value.splice(i + 1, 0, props.template());
  emits("action:add", i);
}
function up() {
  const i = props.rowIndex;
  if (i > 0) {
    [rows.value[i], rows.value[i - 1]] = [rows.value[i - 1], rows.value[i]];
    emits("action:up", i);
  }
}
function down() {
  const i = props.rowIndex;
  if (i < rows.value.length - 1) {
    [rows.value[i], rows.value[i + 1]] = [rows.value[i + 1], rows.value[i]];
    emits("action:down", i);
  }
}
function copy() {
  const i = props.rowIndex;
  rows.value.splice(i + 1, 0, deepCopy(rows.value[i]));
  emits("action:copy", i);
}
function del() {
  const i = props.rowIndex;
  rows.value.splice(i, 1);
  emits("action:del", i);
}
</script>

<style propsd lang="scss"></style>
