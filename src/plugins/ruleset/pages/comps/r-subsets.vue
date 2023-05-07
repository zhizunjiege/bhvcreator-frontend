<template>
  <q-table
    :rows="rows.subsets"
    :columns="columns"
    :pagination="{ rowsPerPage: 0 }"
    flat
    hide-pagination
    separator="cell"
    table-class="r-table"
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
        <r-actions
          v-model="rows.subsets"
          :row-index="scope.rowIndex"
          :template="subsetTemplate"
          @update:model-value="update"
          @action:copy="copy"
        />
      </q-td>
    </template>
    <template #no-data>
      <div class="full-width flex justify-center">
        <r-actions
          v-model="rows.subsets"
          :template="subsetTemplate"
          actions="add"
          @update:model-value="update"
        />
      </div>
    </template>
  </q-table>
</template>

<script setup lang="ts">
import { QTableColumn } from "quasar";
import { randomString } from "~/utils";
import { SubSet } from "../..";

import rActions from "./r-actions.vue";
import rCondition from "./r-condition.vue";

const props = defineProps<{
  modelValue: SubSet[];
}>();
const emits = defineEmits<{
  (e: "update:modelValue", modelValue: SubSet[]): void;
}>();

const rows = computed(() => ({
  subsets: props.modelValue,
}));

const columns = [
  { name: "name", label: "子集名称", field: "name", align: "center" },
  { name: "cond", label: "子集条件", field: "condition", align: "center" },
  { name: "desc", label: "子集描述", field: "desc", align: "center" },
  { name: "acts", label: "子集操作", field: "", align: "center" },
] as QTableColumn[];

const subsetTemplate = () => ({
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

function update() {
  emits("update:modelValue", rows.value.subsets);
}

function copy(index: number) {
  rows.value.subsets[index + 1].id = randomString(8);
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
