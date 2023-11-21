<template>
  <q-table
    :rows="rules"
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
    <template #body-cell-cond="scope">
      <q-td :props="scope">
        <r-condition v-model="scope.row[scope.col.field]" />
      </q-td>
    </template>
    <template #body-cell-cons="scope">
      <q-td :props="scope">
        <r-consequence v-model="scope.row[scope.col.field]" />
      </q-td>
    </template>
    <template #body-cell-acts="scope">
      <q-td :props="scope">
        <r-actions
          v-model="rules"
          :row-index="scope.rowIndex"
          :template="ruleTemplate"
          @action:copy="copy"
        />
      </q-td>
    </template>
    <template #no-data>
      <div class="full-width flex justify-center">
        <r-actions v-model="rules" :template="ruleTemplate" actions="add" />
      </div>
    </template>
  </q-table>
</template>

<script setup lang="ts">
import { QTableColumn } from "quasar";
import { randomString } from "~/utils";
import { Rule } from "../..";

import rActions from "./r-actions.vue";
import rCondition from "./r-condition.vue";
import rConsequence from "./r-consequence.vue";

const props = defineProps<{
  modelValue: Rule[];
}>();

const rules = computed(() => props.modelValue);

const columns: QTableColumn[] = [
  { name: "name", label: "规则名称", field: "name", align: "center" },
  { name: "cond", label: "规则前件", field: "condition", align: "center" },
  { name: "cons", label: "规则后件", field: "consequence", align: "center" },
  { name: "desc", label: "规则描述", field: "desc", align: "center" },
  { name: "acts", label: "规则操作", field: "", align: "center" },
];

const ruleTemplate = () => ({
  id: randomString(8),
  name: "未命名规则",
  desc: "未命名规则",
  condition: {
    expression: "true",
  },
  consequence: {
    assignments: [],
    operations: [],
  },
});

function copy(index: number) {
  rules.value[index + 1].id = randomString(8);
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
