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
        <q-markup-table flat separator="horizontal" class="r-table">
          <tbody>
            <tr>
              <td>合并方式</td>
              <td>
                <q-select
                  v-model="condition.join"
                  :options="['and', 'or']"
                  dense
                  filled
                  options-dense
                  hide-dropdown-icon
                  popup-content-class="text-center"
                  class="full-width"
                />
              </td>
            </tr>
          </tbody>
        </q-markup-table>
      </q-card-section>
      <q-card-section>
        <q-table
          :rows="condition.expressions"
          :columns="expressionColumns"
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
          <template #body-cell-index="scope">
            <q-td :props="scope">
              {{ scope.rowIndex + 1 }}
            </q-td>
          </template>
          <template #body-cell-value="scope">
            <q-td :props="scope" colspan="3">
              <q-input
                v-model="condition.expressions[scope.rowIndex]"
                dense
                borderless
              />
            </q-td>
          </template>
          <template #body-cell-actions="scope">
            <q-td :props="scope">
              <r-actions
                v-model="condition.expressions"
                :row-index="scope.rowIndex"
                :template="expressionTemplate"
                @update:model-value="update"
              />
            </q-td>
          </template>
          <template #no-data>
            <div class="full-width flex justify-center">
              <r-actions
                v-model="condition.expressions"
                :template="expressionTemplate"
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
import { Condition } from "../..";

import rActions from "./r-actions.vue";

const props = defineProps<{
  modelValue: Condition;
  title: string;
}>();
const emits = defineEmits<{
  (e: "update:modelValue", modelValue: Condition): void;
}>();

const condition = computed(() => props.modelValue);

const expressionColumns = [
  { name: "index", label: "序号", field: "", align: "center" },
  { name: "value", label: "取值", field: (r) => r, align: "center" },
  { name: "actions", label: "操作", field: "", align: "center" },
] as QTableColumn[];

const expressionTemplate = () => "true";

const dialogShow = ref(false);
const joinSymbols = { and: "&&", or: "||" };
const displayText = computed(() => {
  const expressions = condition.value.expressions;
  if (expressions.length > 1) {
    return expressions
      .map((e) => `(${e})`)
      .join(` ${joinSymbols[condition.value.join]} `);
  } else {
    return expressions[0];
  }
});

function update() {
  emits("update:modelValue", condition.value);
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
