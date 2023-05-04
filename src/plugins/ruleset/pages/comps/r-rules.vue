<template>
  <q-table
    :rows="rows.rules"
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
        <r-actions-cell
          v-model="rows.rules"
          :row-index="scope.rowIndex"
          @update:model-value="update"
          @action:copy="copy"
        />
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
    <r-actions-push
      v-model="rows.rules"
      :template="{
        id: '',
        name: '未命名规则',
        desc: '未命名规则',
        condition: {
          join: 'and',
          expressions: ['true'],
        },
        consequence: {
          assignments: [],
          operations: [],
        },
      }"
      @update:model-value="update"
      @action:push="push"
    />
  </div>
</template>

<script setup lang="ts">
import { QTableColumn } from "quasar";
import { randomString } from "~/utils";
import { Rule } from "../..";

import rActionsCell from "./r-actions-cell.vue";
import rActionsPush from "./r-actions-push.vue";
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

const rows = computed(() => ({
  rules: props.modelValue,
}));

function update() {
  emits("update:modelValue", rows.value.rules);
}

function copy(index: number) {
  rows.value.rules[index + 1].id = randomString(8);
}
function push(index: number) {
  rows.value.rules[index].id = randomString(8);
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
