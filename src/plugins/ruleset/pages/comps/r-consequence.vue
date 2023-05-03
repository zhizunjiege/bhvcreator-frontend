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
          :rows="assignments"
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
          <template #body-cell-acts="scope">
            <q-td :props="scope">
              <q-btn
                :disable="scope.rowIndex === 0"
                flat
                round
                size="sm"
                icon="bi-arrow-up-circle"
                class="q-mx-xs ui-clickable"
                @click="up('assignments', scope.rowIndex)"
              >
                <q-tooltip anchor="top middle" self="bottom middle">
                  上移
                </q-tooltip>
              </q-btn>
              <q-btn
                :disable="scope.rowIndex === assignments.length - 1"
                flat
                round
                size="sm"
                icon="bi-arrow-down-circle"
                class="q-mx-xs ui-clickable"
                @click="down('assignments', scope.rowIndex)"
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
                @click="copy('assignments', scope.rowIndex)"
              >
                <q-tooltip anchor="top middle" self="bottom middle">
                  重复
                </q-tooltip>
              </q-btn>
              <q-btn
                flat
                round
                size="sm"
                icon="bi-trash"
                class="q-mx-xs ui-clickable"
                @click="drop('assignments', scope.rowIndex)"
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
            @click="push('assignments')"
          >
            <q-tooltip anchor="top middle" self="bottom middle">
              添加
            </q-tooltip>
          </q-btn>
        </div>
      </q-card-section>
      <q-card-section>
        <p class="text-subtitle2">数组操作</p>
        <q-table
          :rows="operations"
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
          <template #body-cell-acts="scope">
            <q-td :props="scope">
              <q-btn
                :disable="scope.rowIndex === 0"
                flat
                round
                size="sm"
                icon="bi-arrow-up-circle"
                class="q-mx-xs ui-clickable"
                @click="up('operations', scope.rowIndex)"
              >
                <q-tooltip anchor="top middle" self="bottom middle">
                  上移
                </q-tooltip>
              </q-btn>
              <q-btn
                :disable="scope.rowIndex === operations.length - 1"
                flat
                round
                size="sm"
                icon="bi-arrow-down-circle"
                class="q-mx-xs ui-clickable"
                @click="down('operations', scope.rowIndex)"
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
                @click="copy('operations', scope.rowIndex)"
              >
                <q-tooltip anchor="top middle" self="bottom middle">
                  重复
                </q-tooltip>
              </q-btn>
              <q-btn
                flat
                round
                size="sm"
                icon="bi-trash"
                class="q-mx-xs ui-clickable"
                @click="drop('operations', scope.rowIndex)"
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
            @click="push('operations')"
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
import { Consequence } from "../..";

const props = defineProps<{
  modelValue: Consequence;
  title: string;
}>();
const emits = defineEmits<{
  (e: "update:modelValue", modelValue: Consequence): void;
}>();

const consequence = computed(() => props.modelValue);
const assignments = computed(() => props.modelValue.assignments);
const operations = computed(() => props.modelValue.operations);

const assignmentColumns = [
  { name: "index", label: "序号", field: "", align: "center" },
  { name: "target", label: "目标", field: "target", align: "center" },
  { name: "value", label: "取值", field: "value", align: "center" },
  { name: "acts", label: "操作", field: "", align: "center" },
] as QTableColumn[];
const operationColumns = [
  { name: "index", label: "序号", field: "", align: "center" },
  { name: "target", label: "目标", field: "target", align: "center" },
  { name: "schema", label: "模式", field: "operation", align: "center" },
  { name: "args", label: "参数", field: "args", align: "center" },
  { name: "acts", label: "操作", field: "", align: "center" },
] as QTableColumn[];

const dialogShow = ref(false);
const displayText = computed(() => {
  if (assignments.value.length + operations.value.length > 0) {
    const a = assignments.value.map((e) => `${e.target} = ${e.value}`);
    const o = operations.value.map(
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

type Target = keyof Consequence;

function push(target: Target) {
  switch (target) {
    case "assignments":
      assignments.value.push({
        target: "",
        value: "",
      });
      break;
    case "operations":
      operations.value.push({
        target: "",
        operation: "",
        args: "",
      });
      break;
    default:
      break;
  }
  update();
}

function up(target: Target, index: number) {
  const arr = consequence.value[target];
  if (index > 0) {
    const temp = arr[index];
    arr[index] = arr[index - 1];
    arr[index - 1] = temp;
    update();
  }
}
function down(target: Target, index: number) {
  const arr = consequence.value[target];
  if (index < arr.length - 1) {
    const temp = arr[index];
    arr[index] = arr[index + 1];
    arr[index + 1] = temp;
    update();
  }
}
function copy(target: Target, index: number) {
  const arr = consequence.value[target] as (
    | Consequence["assignments"][0]
    | Consequence["operations"][0]
  )[];
  arr.splice(index + 1, 0, deepCopy(arr[index]));
  update();
}
function drop(target: Target, index: number) {
  const arr = consequence.value[target];
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
