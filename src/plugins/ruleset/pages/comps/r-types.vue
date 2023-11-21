<template>
  <q-splitter
    v-model="percent"
    :limits="[20, 40]"
    separator-class="q-mx-sm transparent"
    class="r-splitter"
  >
    <template #before>
      <div class="fit column no-wrap overflow-hidden">
        <q-card flat>
          <q-card-section class="q-py-sm">
            <div class="full-width flex justify-center">
              <r-actions
                v-model="types"
                :row-index="selected"
                :template="typeTemplate"
                :actions="types.length > 0 ? 'add/copy/del' : 'add'"
                @action:del="selected = 0"
              />
            </div>
          </q-card-section>
        </q-card>
        <q-separator />
        <q-card flat class="col-grow">
          <q-card-section class="fit q-py-sm q-px-none">
            <q-scroll-area v-if="types.length > 0" class="fit">
              <q-tabs
                v-model="selected"
                dense
                vertical
                no-caps
                active-color="accent"
              >
                <q-tab
                  v-for="(r, i) in types"
                  :key="i"
                  :name="i"
                  :label="r.type"
                />
              </q-tabs>
            </q-scroll-area>
          </q-card-section>
        </q-card>
      </div>
    </template>
    <template #after>
      <template v-if="types.length > 0">
        <q-markup-table flat separator="horizontal" class="r-table">
          <tbody>
            <tr>
              <td>类型名称</td>
              <td>
                <q-input
                  v-model="types[selected].type"
                  dense
                  filled
                  class="full-width"
                />
              </td>
            </tr>
          </tbody>
        </q-markup-table>
        <q-separator color="transparent" class="q-my-xs" />
        <q-table
          :rows="types[selected].variables"
          :columns="variableColumns"
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
          <template #body-cell-acts="scope">
            <q-td :props="scope">
              <r-actions
                v-model="types[selected].variables"
                :row-index="scope.rowIndex"
                :template="variableTemplate"
              />
            </q-td>
          </template>
          <template #no-data>
            <div class="full-width flex justify-center">
              <r-actions
                v-model="types[selected].variables"
                :template="variableTemplate"
                actions="add"
              />
            </div>
          </template>
        </q-table>
      </template>
      <q-card
        v-else
        flat
        class="fit flex flex-center text-ignore text-h4 text-weight-bold"
      >
        无
      </q-card>
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

const percent = ref(20);

const selected = ref(0);

const types = computed(() => props.modelValue);

const typeTemplate = () => ({
  type: "Type",
  variables: [],
});

const variableColumns: QTableColumn[] = [
  { name: "name", label: "属性", field: "name", align: "center" },
  { name: "type", label: "类型", field: "type", align: "center" },
  { name: "acts", label: "操作", field: "", align: "center" },
];

const variableTemplate = () => ({
  name: "",
  type: "",
});
</script>

<style scoped lang="scss">
.r-splitter {
  height: 75vh;
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
