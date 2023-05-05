<template>
  <q-splitter
    v-model="percent"
    :limits="[20, 40]"
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
            <r-actions
              v-model="rows.funcs"
              :row-index="selected"
              :template="funcTemplate"
              :actions="rows.funcs.length > 0 ? 'add/copy/del' : 'add'"
              @update:model-value="update"
              @action:del="selected = 0"
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
            class="fit flex flex-center bg-transparent text-ignore text-weight-bold text-h4"
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
                <q-select
                  v-model="rows.funcs[selected].type"
                  :options="['normal', 'operator']"
                  dense
                  filled
                  options-dense
                  hide-dropdown-icon
                  popup-content-class="text-center"
                  class="full-width"
                  @update:model-value="update"
                />
              </td>
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
          :columns="paramColumns"
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
              <r-actions
                v-model="rows.funcs[selected].params"
                :row-index="scope.rowIndex"
                :template="paramTemplate"
                @update:model-value="update"
              />
            </q-td>
          </template>
          <template #no-data>
            <div class="full-width flex justify-center">
              <r-actions
                v-model="rows.funcs[selected].params"
                :template="paramTemplate"
                actions="add"
                @update:model-value="update"
              />
            </div>
          </template>
        </q-table>
        <q-separator color="transparent" class="q-my-sm" />
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
        class="fit flex flex-center bg-primary text-ignore text-weight-bold text-h4"
      >
        无
      </div>
    </template>
  </q-splitter>
</template>

<script setup lang="ts">
import { QTableColumn } from "quasar";
import { FuncDefine } from "../..";

import rActions from "./r-actions.vue";

const props = defineProps<{
  modelValue: FuncDefine[];
}>();
const emits = defineEmits<{
  (e: "update:modelValue", modelValue: FuncDefine[]): void;
}>();

const percent = ref(20);

const selected = ref(0);

const rows = computed(() => ({
  funcs: props.modelValue,
}));

const funcTemplate = () => ({
  type: "normal",
  symbol: "Func",
  params: [],
  return: {
    type: "",
    value: "",
  },
});
const paramColumns = [
  { name: "name", label: "参数", field: "name", align: "center" },
  { name: "type", label: "类型", field: "type", align: "center" },
  { name: "acts", label: "操作", field: "", align: "center" },
] as QTableColumn[];

const paramTemplate = () => ({
  name: "",
  type: "",
});

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
    .q-select .q-field__native {
      justify-content: center;
    }
  }
}
</style>
