<template>
  <q-table
    :rows="rows"
    :columns="columns"
    :pagination="{ rowsPerPage: 0 }"
    flat
    hide-pagination
    separator="cell"
    table-class="r-table"
    table-header-class="bg-primary"
  >
    <template #header-cell-cond="scope">
      <q-th :props="scope" colspan="2">
        {{ scope.col.label }}
      </q-th>
    </template>
    <template #body-cell="scope">
      <q-td :props="scope">
        <q-input v-model="scope.row[scope.col.field]" dense borderless />
      </q-td>
    </template>
    <template #body-cell-cond="scope">
      <q-td :props="scope" colspan="2">
        <r-condition v-model="scope.row[scope.col.field]" title="子集条件" />
      </q-td>
    </template>
    <template #body-cell-acts="scope">
      <q-td :props="scope">
        <q-btn
          :disable="scope.rowIndex === 0"
          flat
          round
          size="sm"
          icon="bi-arrow-up-circle"
          class="q-mx-xs ui-clickable"
          @click="up(scope.rowIndex)"
        >
          <q-tooltip anchor="top middle" self="bottom middle"> 上移 </q-tooltip>
        </q-btn>
        <q-btn
          :disable="scope.rowIndex === rows.length - 1"
          flat
          round
          size="sm"
          icon="bi-arrow-down-circle"
          class="q-mx-xs ui-clickable"
          @click="down(scope.rowIndex)"
        >
          <q-tooltip anchor="top middle" self="bottom middle"> 下移 </q-tooltip>
        </q-btn>
        <q-btn
          flat
          round
          size="sm"
          icon="bi-files"
          class="q-mx-xs ui-clickable"
          @click="copy(scope.rowIndex)"
        >
          <q-tooltip anchor="top middle" self="bottom middle"> 重复 </q-tooltip>
        </q-btn>
        <q-btn
          flat
          round
          size="sm"
          icon="bi-trash"
          class="q-mx-xs ui-clickable"
          @click="drop(scope.rowIndex)"
        >
          <q-tooltip anchor="top middle" self="bottom middle"> 删除 </q-tooltip>
        </q-btn>
      </q-td>
    </template>
    <template #no-data="scope">
      <div class="flex flex-center full-width text-subtitle2">
        <q-icon :name="scope.icon" size="xs" class="q-mr-md" />
        列表为空
      </div>
    </template>
  </q-table>
  <div class="full-width flex justify-end q-mt-md">
    <q-btn
      flat
      round
      size="sm"
      icon="bi-plus-circle"
      class="ui-clickable"
      @click="push"
    >
      <q-tooltip anchor="top middle" self="bottom middle"> 添加 </q-tooltip>
    </q-btn>
  </div>
</template>

<script setup lang="ts">
import { QTableColumn } from "quasar";
import { deepCopy, randomString } from "~/utils";
import { SubSet } from "../..";

import rCondition from "./r-condition.vue";

const props = defineProps<{
  modelValue: SubSet[];
}>();
const emits = defineEmits<{
  (e: "update:modelValue", modelValue: SubSet[]): void;
}>();

const columns = [
  { name: "name", label: "子集名称", field: "name", align: "center" },
  { name: "cond", label: "子集条件", field: "condition", align: "center" },
  { name: "desc", label: "子集描述", field: "desc", align: "center" },
  { name: "acts", label: "子集操作", field: "", align: "center" },
] as QTableColumn[];

const rows = computed(() => props.modelValue);

function update() {
  emits("update:modelValue", rows.value);
}

function push() {
  rows.value.push({
    id: randomString(8),
    name: "未命名子集",
    desc: "未命名子集",
    condition: {
      join: "and",
      expressions: ["true"],
    },
    subSets: [],
    rules: [],
  });
  update();
}

function up(index: number) {
  if (index > 0) {
    const temp = rows.value[index];
    rows.value[index] = rows.value[index - 1];
    rows.value[index - 1] = temp;
    update();
  }
}
function down(index: number) {
  if (index < rows.value.length - 1) {
    const temp = rows.value[index];
    rows.value[index] = rows.value[index + 1];
    rows.value[index + 1] = temp;
    update();
  }
}
function copy(index: number) {
  rows.value.splice(index + 1, 0, deepCopy(rows.value[index]));
  update();
}
function drop(index: number) {
  rows.value.splice(index, 1);
  update();
}
</script>

<style scoped lang="scss">
:deep(.r-table) {
  table {
    table-layout: fixed;
    th,
    td {
      font-size: 0.875rem !important;
      padding: 0 1rem !important;
      border-color: var(--ui-secondary) !important;
      input {
        text-align: center;
      }
    }
  }
}
</style>
