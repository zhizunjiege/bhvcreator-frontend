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
    <template #body-cell="scope">
      <q-td :props="scope">
        <q-input v-model="scope.row[scope.col.field]" dense borderless />
      </q-td>
    </template>
    <template #body-cell-cond="scope">
      <q-td :props="scope">
        <r-condition v-model="scope.row[scope.col.field]" title="规则前件" />
      </q-td>
    </template>
    <template #body-cell-cons="scope">
      <q-td :props="scope">
        <r-consequence v-model="scope.row[scope.col.field]" title="规则后件" />
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
import { Rule } from "../..";

import rCondition from "./r-condition.vue";
import rConsequence from "./r-consequence.vue";

const props = defineProps<{
  modelValue: Rule[];
}>();
const emits = defineEmits<{
  (e: "update:modelValue", modelValue: Rule[]): void;
}>();

const columns = [
  { name: "name", label: "规则名称", field: "name", align: "center" },
  { name: "cond", label: "规则前件", field: "condition", align: "center" },
  { name: "cons", label: "规则后件", field: "consequence", align: "center" },
  { name: "desc", label: "规则描述", field: "desc", align: "center" },
  { name: "acts", label: "规则操作", field: "", align: "center" },
] as QTableColumn[];

const rows = computed(() => props.modelValue);

function update() {
  emits("update:modelValue", rows.value);
}

function push() {
  rows.value.push({
    id: randomString(8),
    name: "未命名规则",
    desc: "未命名规则",
    condition: {
      join: "and",
      expressions: ["true"],
    },
    consequence: {
      assignments: [
        {
          target: "",
          value: "",
        },
      ],
      operations: [
        {
          target: "",
          operation: "push",
          args: "",
        },
      ],
    },
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
