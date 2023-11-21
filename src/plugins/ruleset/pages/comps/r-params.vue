<template>
  <q-table
    :rows="params"
    :columns="columns"
    :pagination="{ rowsPerPage: 0 }"
    flat
    hide-pagination
    separator="cell"
    table-class="r-table"
  >
    <template #body-cell="scope">
      <q-td :props="scope">
        <q-input v-model="scope.row[scope.col.field]" dense borderless />
      </q-td>
    </template>
    <template #body-cell-value="scope">
      <q-td :props="scope">
        <r-expression v-model="scope.row[scope.col.field]" />
      </q-td>
    </template>
    <template #body-cell-acts="scope">
      <q-td :props="scope">
        <r-actions
          v-model="params"
          :row-index="scope.rowIndex"
          :template="template"
        />
      </q-td>
    </template>
    <template #no-data>
      <div class="full-width flex justify-center">
        <r-actions v-model="params" :template="template" actions="add" />
      </div>
    </template>
  </q-table>
</template>

<script setup lang="ts">
import { QTableColumn } from "quasar";
import { MetaParam } from "../..";

import rExpression from "./r-expression.vue";
import rActions from "./r-actions.vue";

const props = defineProps<{
  modelValue: MetaParam[];
}>();

const columns: QTableColumn[] = [
  { name: "name", label: "名称", field: "name", align: "center" },
  { name: "type", label: "类型", field: "type", align: "center" },
  { name: "value", label: "初值", field: "value", align: "center" },
  { name: "desc", label: "描述", field: "desc", align: "center" },
  { name: "acts", label: "操作", field: "", align: "center" },
];

const template = () => ({
  name: "param",
  type: "float64",
  value: "",
  desc: "参数",
});

const params = computed(() => props.modelValue);
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
