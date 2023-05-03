<template>
  <q-table
    :rows="rows.params"
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
    <template #body-cell-acts="scope">
      <q-td :props="scope">
        <r-actions-cell
          v-model="rows.params"
          :row-index="scope.rowIndex"
          @update:model-value="update"
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
  <r-actions-push
    v-model="rows.params"
    :template="{
      name: 'param',
      type: 'float64',
      value: '0',
      desc: '参数',
    }"
    @update:model-value="update"
  />
</template>

<script setup lang="ts">
import { QTableColumn } from "quasar";
import { MetaParam } from "../..";

import rActionsCell from "./r-actions-cell.vue";
import rActionsPush from "./r-actions-push.vue";

const props = defineProps<{
  modelValue: MetaParam[];
}>();
const emits = defineEmits<{
  (e: "update:modelValue", modelValue: MetaParam[]): void;
}>();

const columns = [
  { name: "name", label: "名称", field: "name", align: "center" },
  { name: "type", label: "类型", field: "type", align: "center" },
  { name: "value", label: "初值", field: "value", align: "center" },
  { name: "desc", label: "描述", field: "desc", align: "center" },
  { name: "acts", label: "操作", field: "", align: "center" },
] as QTableColumn[];

const rows = computed(() => ({
  params: props.modelValue,
}));

function update() {
  emits("update:modelValue", rows.value.params);
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
