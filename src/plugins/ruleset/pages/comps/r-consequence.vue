<template>
  <div class="full-width ellipsis" @click="dialogShow = true">
    {{ displayText }}
    <q-tooltip anchor="top middle" self="bottom middle">
      {{ displayText }}
    </q-tooltip>
  </div>
  <q-dialog v-model="dialogShow">
    <q-card flat class="q-mx-auto bg-secondary r-card">
      <q-card-section class="text-center text-subtitle1">
        规则后件
      </q-card-section>
      <q-card-section>
        <q-table
          :rows="consequence.operations"
          :columns="operationColumns"
          :pagination="{ rowsPerPage: 0 }"
          flat
          hide-pagination
          separator="cell"
          table-class="r-table"
        >
          <template #header-cell-value="scope">
            <q-th :props="scope" colspan="2">
              {{ scope.col.label }}
            </q-th>
          </template>
          <template #body-cell="scope">
            <q-td :props="scope">
              <q-input v-model="scope.row[scope.col.field]" dense borderless />
            </q-td>
          </template>
          <template #body-cell-index="scope">
            <q-td :props="scope">
              {{ scope.rowIndex + 1 }}
            </q-td>
          </template>
          <template #body-cell-method="scope">
            <q-td :props="scope">
              <q-select
                v-model="scope.row[scope.col.field]"
                :options="['assign', 'resize', 'push']"
                dense
                borderless
                options-dense
                hide-dropdown-icon
                popup-content-class="text-center"
                class="full-width"
              />
            </q-td>
          </template>
          <template #body-cell-value="scope">
            <q-td :props="scope" colspan="2">
              <r-expression v-model="scope.row[scope.col.field]" />
            </q-td>
          </template>
          <template #body-cell-actions="scope">
            <q-td :props="scope">
              <r-actions
                v-model="consequence.operations"
                :row-index="scope.rowIndex"
                :template="operationTemplate"
              />
            </q-td>
          </template>
          <template #no-data>
            <div class="full-width flex justify-center">
              <r-actions
                v-model="consequence.operations"
                :template="operationTemplate"
                actions="add"
              />
            </div>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { QTableColumn } from "quasar";
import { Consequence } from "../..";

import rExpression from "./r-expression.vue";
import rActions from "./r-actions.vue";

const props = defineProps<{
  modelValue: Consequence;
}>();

const consequence = computed(() => props.modelValue);

const operationColumns: QTableColumn[] = [
  { name: "index", label: "序号", field: "", align: "center" },
  { name: "target", label: "目标", field: "target", align: "center" },
  { name: "method", label: "方法", field: "method", align: "center" },
  { name: "value", label: "取值", field: "value", align: "center" },
  { name: "actions", label: "操作", field: "", align: "center" },
];

const operationTemplate = () => ({
  target: "",
  method: "assign",
  value: "",
});

const dialogShow = ref(false);
const displayText = computed(() => {
  return (
    consequence.value.operations
      .map((e) => {
        switch (e.method) {
          case "assign":
            return `${e.target} = ${e.value}`;
          case "resize":
          case "push":
            return `${e.target}.${e.method}(${e.value})`;
        }
      })
      .join("; ") || "无"
  );
});
</script>

<style scoped lang="scss">
.r-card {
  max-width: 60%;
}
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
      .q-select .q-field__native {
        justify-content: center;
      }
    }
  }
}
</style>
