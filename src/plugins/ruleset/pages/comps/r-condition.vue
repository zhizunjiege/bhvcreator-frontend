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
        <q-markup-table flat separator="horizontal" class="r-table">
          <tbody>
            <tr>
              <td>合并方式</td>
              <td>
                <q-select
                  v-model="condition.join"
                  dense
                  standout="bg-secondary"
                  input-class="text-foreground"
                  class="full-width"
                  options-dense
                  map-options
                  :options-dense-label="false"
                  :options="[
                    { label: '与', value: 'and' },
                    { label: '或', value: 'or' },
                  ]"
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
          table-header-class="bg-primary"
        >
          <template #header-cell-value="scope">
            <q-th :props="scope" colspan="4">
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
            <q-td :props="scope" colspan="4">
              <q-input v-model="scope.row[scope.col.field]" dense borderless />
            </q-td>
          </template>
          <template #body-cell-acts="scope">
            <q-td :props="scope">
              <q-btn
                :disable="scope.rowIndex === 0"
                flat
                round
                size="sm"
                icon="bi-arrow-up-circle"
                class="q-mx-xs ui-clickable"
                @click="up(scope.rowIndex)"
              >
                <q-tooltip anchor="top middle" self="bottom middle">
                  上移
                </q-tooltip>
              </q-btn>
              <q-btn
                :disable="scope.rowIndex === condition.expressions.length - 1"
                flat
                round
                size="sm"
                icon="bi-arrow-down-circle"
                class="q-mx-xs ui-clickable"
                @click="down(scope.rowIndex)"
              >
                <q-tooltip anchor="top middle" self="bottom middle">
                  下移
                </q-tooltip>
              </q-btn>
              <q-btn
                flat
                round
                size="sm"
                icon="bi-files"
                class="q-mx-xs ui-clickable"
                @click="copy(scope.rowIndex)"
              >
                <q-tooltip anchor="top middle" self="bottom middle">
                  重复
                </q-tooltip>
              </q-btn>
              <q-btn
                :disable="constraint"
                flat
                round
                size="sm"
                icon="bi-trash"
                class="q-mx-xs ui-clickable"
                @click="drop(scope.rowIndex)"
              >
                <q-tooltip anchor="top middle" self="bottom middle">
                  删除
                </q-tooltip>
              </q-btn>
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
          <q-btn
            flat
            round
            size="sm"
            icon="bi-plus-circle"
            class="ui-clickable"
            @click="push"
          >
            <q-tooltip anchor="top middle" self="bottom middle">
              添加
            </q-tooltip>
          </q-btn>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { QTableColumn } from "quasar";
import { deepCopy } from "~/utils";
import { Condition } from "../..";

const props = defineProps<{
  modelValue: Condition;
  title: string;
}>();
const emits = defineEmits<{
  (e: "update:modelValue", modelValue: Condition): void;
}>();

const condition = computed(() => props.modelValue);
const constraint = computed(() => condition.value.expressions.length === 1);

const expressionColumns = [
  { name: "index", label: "序号", field: "", align: "center" },
  { name: "value", label: "取值", field: (r) => r, align: "center" },
  { name: "acts", label: "操作", field: "", align: "center" },
] as QTableColumn[];

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

function push() {
  condition.value.expressions.push("true");
  update();
}

function up(index: number) {
  const arr = condition.value.expressions;
  if (index > 0) {
    const temp = arr[index];
    arr[index] = arr[index - 1];
    arr[index - 1] = temp;
    update();
  }
}
function down(index: number) {
  const arr = condition.value.expressions;
  if (index < arr.length - 1) {
    const temp = arr[index];
    arr[index] = arr[index + 1];
    arr[index + 1] = temp;
    update();
  }
}
function copy(index: number) {
  const arr = condition.value.expressions;
  arr.splice(index + 1, 0, deepCopy(arr[index]));
  update();
}
function drop(index: number) {
  const arr = condition.value.expressions;
  arr.splice(index, 1);
  update();
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
