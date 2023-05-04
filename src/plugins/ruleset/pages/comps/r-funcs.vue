<template>
  <q-splitter
    v-model="percent"
    :limits="[25, 75]"
    unit="%"
    separator-class="q-mx-sm transparent"
    class="r-splitter"
  >
    <template #before>
      <q-splitter
        :model-value="9"
        disable
        horizontal
        unit="%"
        separator-class="q-my-sm"
        class="fit q-pa-md bg-primary"
      >
        <template #before>
          <div class="full-width flex justify-center">
            <r-actions-push
              v-model="rows.funcs"
              :template="{
                type: 'normal',
                symbol: 'func',
                params: [],
                return: {
                  type: '',
                  value: '',
                },
              }"
              @update:model-value="update"
              @action:drop="selected = 0"
            />
            <r-actions-cell
              v-if="rows.funcs.length > 0"
              v-model="rows.funcs"
              :row-index="selected"
              @update:model-value="update"
            />
          </div>
        </template>
        <template #after>
          <q-tabs
            v-if="rows.funcs.length > 0"
            v-model="selected"
            dense
            vertical
            no-caps
            outside-arrows
            active-color="accent"
          >
            <q-tab
              v-for="(r, i) in rows.funcs"
              :key="i"
              :name="i"
              :label="r.symbol"
            />
          </q-tabs>
          <div
            v-else
            class="fit flex flex-center bg-transparent text-ignore text-weight-bold"
          >
            无
          </div>
        </template>
      </q-splitter>
    </template>
    <template #after>
      <template v-if="rows.funcs.length > 0">
        <q-markup-table flat separator="horizontal" class="r-table">
          <tbody>
            <tr>
              <td>函数类型</td>
              <td>
                <q-input
                  v-model="rows.funcs[selected].type"
                  dense
                  filled
                  class="full-width"
                  @update:model-value="update"
                />
              </td>
            </tr>
            <tr>
              <td>函数符号</td>
              <td>
                <q-input
                  v-model="rows.funcs[selected].symbol"
                  dense
                  filled
                  class="full-width"
                  @update:model-value="update"
                />
              </td>
            </tr>
          </tbody>
        </q-markup-table>
        <q-separator color="transparent" class="q-my-sm" />
        <q-table
          :rows="rows.funcs[selected].params"
          :columns="variableColumns"
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
              <r-actions-push
                v-model="rows.funcs[selected].params"
                :template="{
                  name: '',
                  type: '',
                }"
                @update:model-value="update"
              />
              <r-actions-cell
                v-model="rows.funcs[selected].params"
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
        <div class="full-width flex justify-center q-my-md">
          <r-actions-push
            v-model="rows.funcs[selected].params"
            :template="{
              name: '',
              type: '',
            }"
            @update:model-value="update"
          />
        </div>
        <q-markup-table flat separator="horizontal" class="r-table">
          <tbody>
            <tr>
              <td>返回值类型</td>
              <td>
                <q-input
                  v-model="rows.funcs[selected].return.type"
                  dense
                  filled
                  class="full-width"
                  @update:model-value="update"
                />
              </td>
            </tr>
            <tr>
              <td>返回值表达式</td>
              <td>
                <q-input
                  v-model="rows.funcs[selected].return.value"
                  dense
                  filled
                  class="full-width"
                  @update:model-value="update"
                />
              </td>
            </tr>
          </tbody>
        </q-markup-table>
      </template>
      <div
        v-else
        class="fit flex flex-center bg-primary text-ignore text-weight-bold"
      >
        无
      </div>
    </template>
  </q-splitter>
</template>

<script setup lang="ts">
import { QTableColumn } from "quasar";
import { FuncDefine } from "../..";

import rActionsCell from "./r-actions-cell.vue";
import rActionsPush from "./r-actions-push.vue";

const props = defineProps<{
  modelValue: FuncDefine[];
}>();
const emits = defineEmits<{
  (e: "update:modelValue", modelValue: FuncDefine[]): void;
}>();

const percent = ref(25);

const selected = ref(0);

const rows = computed(() => ({
  funcs: props.modelValue,
}));

const variableColumns = [
  { name: "name", label: "参数", field: "name", align: "center" },
  { name: "type", label: "类型", field: "type", align: "center" },
  { name: "acts", label: "操作", field: "", align: "center" },
] as QTableColumn[];

function update() {
  emits("update:modelValue", rows.value.funcs);
}
</script>

<style scoped lang="scss">
.r-splitter {
  height: 40vh;
}
:deep(.r-table) {
  table {
    table-layout: fixed;
    th,
    td {
      font-size: 0.875rem !important;
      padding: 0 1rem !important;
      border-color: var(--ui-secondary) !important;
    }
    input {
      text-align: center;
    }
  }
}
</style>
