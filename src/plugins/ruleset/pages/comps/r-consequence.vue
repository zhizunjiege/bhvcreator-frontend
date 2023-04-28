<template>
  <q-markup-table flat separator="cell" class="text-center table">
    <thead>
      <tr>
        <th>子集名称</th>
        <th>前置条件</th>
        <th>合并方式</th>
        <th>子集描述</th>
        <th>子集操作</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(subSet, index) in subSets" :key="subSet.id">
        <td>
          <q-input v-model="subSet.name" dense borderless />
        </td>
        <td>
          <q-btn
            flat
            round
            size="sm"
            icon="bi-pencil-square"
            class="q-mx-xs ui-btn"
            @click="edit(index)"
          >
            <q-tooltip anchor="top left" self="top right"> 编辑 </q-tooltip>
          </q-btn>
        </td>
        <td>
          <q-input v-model="subSet.condition.join" dense borderless />
          <!-- <q-select
            v-model="subSet.condition.join"
            :options="['and', 'or']"
            dense
            borderless
            emit-value
            map-options
            hide-dropdown-icon
            popup-content-class="shadow-0 bg-primary"
            options-selected-class="text-accent"
          /> -->
        </td>
        <td>
          <q-input v-model="subSet.desc" dense borderless />
        </td>
        <td>
          <q-btn
            flat
            round
            size="sm"
            icon="bi-files"
            class="q-mx-xs ui-btn"
            @click="copy(index)"
          >
            <q-tooltip anchor="top left" self="top right"> 重复 </q-tooltip>
          </q-btn>
          <q-btn
            flat
            round
            size="sm"
            icon="bi-arrow-up-circle"
            class="q-mx-xs ui-btn"
            @click="up(index)"
          >
            <q-tooltip anchor="top left" self="top right"> 上移 </q-tooltip>
          </q-btn>
          <q-btn
            flat
            round
            size="sm"
            icon="bi-arrow-down-circle"
            class="q-mx-xs ui-btn"
            @click="down(index)"
          >
            <q-tooltip anchor="top left" self="top right"> 下移 </q-tooltip>
          </q-btn>
          <q-btn
            flat
            round
            size="sm"
            icon="bi-trash"
            class="q-mx-xs ui-btn"
            @click="drop(index)"
          >
            <q-tooltip anchor="top left" self="top right"> 删除 </q-tooltip>
          </q-btn>
        </td>
      </tr>
    </tbody>
  </q-markup-table>
  <div class="full-width flex justify-end q-mt-md">
    <q-btn
      flat
      round
      size="sm"
      icon="bi-plus-circle"
      class="ui-btn"
      @click="push"
    >
      <q-tooltip anchor="top left" self="top right"> 新增 </q-tooltip>
    </q-btn>
  </div>
</template>

<script setup lang="ts">
import { randomString } from "~/utils";
import { SubSet } from "..";

const props = defineProps<{
  subSets: SubSet[];
}>();
const emits = defineEmits<{
  (e: "update:subSets", subSets: SubSet[]): void;
}>();

const subSets = ref(props.subSets);
watch(
  () => props.subSets,
  (val) => {
    subSets.value = val;
  }
);

function edit(index: number) {}

function copy(index: number) {
  subSets.value.splice(index + 1, 0, { ...subSets.value[index] });
  emits("update:subSets", subSets.value);
}
function up(index: number) {
  if (index > 0) {
    const temp = subSets.value[index];
    subSets.value[index] = subSets.value[index - 1];
    subSets.value[index - 1] = temp;
    emits("update:subSets", subSets.value);
  }
}
function down(index: number) {
  if (index < subSets.value.length - 1) {
    const temp = subSets.value[index];
    subSets.value[index] = subSets.value[index + 1];
    subSets.value[index + 1] = temp;
    emits("update:subSets", subSets.value);
  }
}
function drop(index: number) {
  subSets.value.splice(index, 1);
  emits("update:subSets", subSets.value);
}

function push() {
  subSets.value.push({
    id: randomString(8),
    name: "未命名子集",
    condition: {
      join: "and",
      expressions: ["true"],
    },
    desc: "未命名子集",
    subSets: [],
    rules: [],
  });
  emits("update:subSets", subSets.value);
}
</script>

<style scoped lang="scss">
.table {
  :deep(table) {
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
