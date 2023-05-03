<template>
  <div class="full-width ellipsis" @click="dialogShow = true">
    {{ displayText }}
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
          table-header-class="bg-primary"
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
              <r-actions-cell
                v-model="consequence.assignments"
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
          v-model="consequence.assignments"
          :template="{
            target: '',
            value: '',
          }"
          @update:model-value="update"
        />
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
          table-header-class="bg-primary"
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
          <template #body-cell-args="scope">
            <q-td :props="scope" colspan="2">
              <q-input v-model="scope.row[scope.col.field]" dense borderless />
            </q-td>
          </template>
          <template #body-cell-actions="scope">
            <q-td :props="scope">
              <r-actions-cell
                v-model="consequence.operations"
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
          v-model="consequence.operations"
          :template="{
            target: '',
            operation: '',
            args: '',
          }"
          @update:model-value="update"
        />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { QTableColumn } from "quasar";
import { Consequence } from "../..";

import rActionsCell from "./r-actions-cell.vue";
import rActionsPush from "./r-actions-push.vue";

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
  { name: "schema", label: "模式", field: "operation", align: "center" },
  { name: "args", label: "参数", field: "args", align: "center" },
  { name: "actions", label: "操作", field: "", align: "center" },
] as QTableColumn[];

const dialogShow = ref(false);
const displayText = computed(() => {
  if (
    consequence.value.assignments.length + consequence.value.operations.length >
    0
  ) {
    const a = consequence.value.assignments.map(
      (e) => `${e.target} = ${e.value}`
    );
    const o = consequence.value.operations.map(
      (e) => `${e.target}.${e.operation}(${e.args})`
    );
    return a.concat(o).join("; ");
  } else {
    return "无";
  }
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
    }
  }
}
</style>
