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
        {{ props.title }}
      </q-card-section>
      <q-card-section>
        <p class="text-subtitle2">赋值操作</p>
        <q-table
          :rows="consequence.assignments"
          :columns="assignmentColumns"
          :pagination="{ rowsPerPage: 0 }"
          flat
          hide-pagination
          separator="cell"
          table-class="r-table"
        >
          <template #header-cell-value="scope">
            <q-th :props="scope" colspan="3">
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
          <template #body-cell-value="scope">
            <q-td :props="scope" colspan="3">
              <q-input v-model="scope.row[scope.col.field]" dense borderless />
            </q-td>
          </template>
          <template #body-cell-actions="scope">
            <q-td :props="scope">
              <r-actions
                v-model="consequence.assignments"
                :row-index="scope.rowIndex"
                :template="assignmentTemplate"
                @update:model-value="update"
              />
            </q-td>
          </template>
          <template #no-data>
            <div class="full-width flex justify-center">
              <r-actions
                v-model="consequence.assignments"
                :template="assignmentTemplate"
                actions="add"
                @update:model-value="update"
              />
            </div>
          </template>
        </q-table>
      </q-card-section>
      <q-card-section>
        <p class="text-subtitle2">数组操作</p>
        <q-table
          :rows="consequence.operations"
          :columns="operationColumns"
          :pagination="{ rowsPerPage: 0 }"
          flat
          hide-pagination
          separator="cell"
          table-class="r-table"
        >
          <template #header-cell-args="scope">
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
                :options="['push', 'resize']"
                dense
                borderless
                options-dense
                hide-dropdown-icon
                popup-content-class="text-center"
                class="full-width"
              />
            </q-td>
          </template>
          <template #body-cell-args="scope">
            <q-td :props="scope" colspan="2">
              <q-input v-model="scope.row[scope.col.field]" dense borderless />
            </q-td>
          </template>
          <template #body-cell-actions="scope">
            <q-td :props="scope">
              <r-actions
                v-model="consequence.operations"
                :row-index="scope.rowIndex"
                :template="operationTemplate"
                @update:model-value="update"
              />
            </q-td>
          </template>
          <template #no-data>
            <div class="full-width flex justify-center">
              <r-actions
                v-model="consequence.operations"
                :template="operationTemplate"
                actions="add"
                @update:model-value="update"
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

import rActions from "./r-actions.vue";

const props = defineProps<{
  modelValue: Consequence;
  title: string;
}>();
const emits = defineEmits<{
  (e: "update:modelValue", modelValue: Consequence): void;
}>();

const consequence = computed(() => props.modelValue);

const assignmentColumns = [
  { name: "index", label: "序号", field: "", align: "center" },
  { name: "target", label: "目标", field: "target", align: "center" },
  { name: "value", label: "取值", field: "value", align: "center" },
  { name: "actions", label: "操作", field: "", align: "center" },
] as QTableColumn[];
const operationColumns = [
  { name: "index", label: "序号", field: "", align: "center" },
  { name: "target", label: "目标", field: "target", align: "center" },
  { name: "method", label: "方法", field: "operation", align: "center" },
  { name: "args", label: "参数", field: "args", align: "center" },
  { name: "actions", label: "操作", field: "", align: "center" },
] as QTableColumn[];

const assignmentTemplate = () => ({
  target: "",
  value: "",
});
const operationTemplate = () => ({
  target: "",
  operation: "",
  args: "",
});

const dialogShow = ref(false);
const displayText = computed(() => {
  const a = consequence.value.assignments.map(
    (e) => `${e.target} = ${e.value}`
  );
  const o = consequence.value.operations.map(
    (e) => `${e.target}.${e.operation}(${e.args})`
  );
  return a.concat(o).join("; ") || "无";
});

function update() {
  emits("update:modelValue", consequence.value);
}
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
