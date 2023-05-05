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
              v-model="rows.types"
              :row-index="selected"
              :template="typeTemplate"
              :actions="rows.types.length > 0 ? 'add/copy/del' : 'add'"
              @update:model-value="update"
              @action:del="selected = 0"
            />
          </div>
        </template>
        <template #after>
          <q-tabs
            v-if="rows.types.length > 0"
            v-model="selected"
            dense
            vertical
            no-caps
            outside-arrows
            active-color="accent"
          >
            <q-tab
              v-for="(r, i) in rows.types"
              :key="i"
              :name="i"
              :label="r.type"
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
      <template v-if="rows.types.length > 0">
        <q-markup-table flat separator="horizontal" class="r-table">
          <tbody>
            <tr>
              <td>类型名称</td>
              <td>
                <q-input
                  v-model="rows.types[selected].type"
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
          :rows="rows.types[selected].variables"
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
              <r-actions
                v-model="rows.types[selected].variables"
                :row-index="scope.rowIndex"
                :template="variableTemplate"
                @update:model-value="update"
              />
            </q-td>
          </template>
          <template #no-data>
            <div class="full-width flex justify-center">
              <r-actions
                v-model="rows.types[selected].variables"
                :template="variableTemplate"
                actions="add"
                @update:model-value="update"
              />
            </div>
          </template>
        </q-table>
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
import { TypeDefine } from "../..";

import rActions from "./r-actions.vue";

const props = defineProps<{
  modelValue: TypeDefine[];
}>();
const emits = defineEmits<{
  (e: "update:modelValue", modelValue: TypeDefine[]): void;
}>();

const percent = ref(20);

const selected = ref(0);

const rows = computed(() => ({
  types: props.modelValue,
}));

const typeTemplate = () => ({
  type: "Type",
  variables: [],
});

const variableColumns = [
  { name: "name", label: "属性", field: "name", align: "center" },
  { name: "type", label: "类型", field: "type", align: "center" },
  { name: "acts", label: "操作", field: "", align: "center" },
] as QTableColumn[];

const variableTemplate = () => ({
  name: "",
  type: "",
});

function update() {
  emits("update:modelValue", rows.value.types);
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
