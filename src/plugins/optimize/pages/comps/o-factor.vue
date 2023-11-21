<template>
  <q-splitter
    :model-value="60"
    disable
    separator-class="transparent"
    class="fit"
  >
    <template #before>
      <monaco-editor
        v-if="store.ruleset"
        ref="editor"
        v-model="store.ruleset"
        minimap
        readonly
        language="xml"
      />
      <div v-else class="fit flex flex-center bg-secondary">
        <q-input
          v-model.number="store.id"
          dense
          filled
          placeholder="请输入规则集ID"
          class="o-input"
        >
          <template #append>
            <q-icon
              name="bi-check-circle"
              class="ui-clickable"
              @click="loadRuleset"
            >
              <q-tooltip anchor="top middle" self="bottom middle">
                获取资源
              </q-tooltip>
            </q-icon>
          </template>
        </q-input>
      </div>
    </template>
    <template #after>
      <q-splitter
        :model-value="18"
        disable
        horizontal
        separator-class="transparent"
        class="fit"
      >
        <template #before>
          <q-card flat class="transparent">
            <q-card-section>
              <q-btn-toggle
                v-model="store.mode"
                :options="modeOptions"
                spread
                toggle-color="secondary"
                toggle-text-color="accent"
                @update:model-value="modeChanged"
              />
            </q-card-section>
            <q-card-section>
              <q-btn
                icon="bi-plus-circle"
                color="secondary"
                text-color="accent"
                label="添加因子"
                class="full-width"
                @click="addFactor"
              />
            </q-card-section>
          </q-card>
        </template>
        <template #after>
          <q-card flat class="transparent">
            <q-card-section>
              <q-markup-table
                v-if="store.mode === 'struct'"
                flat
                separator="cell"
                class="text-center o-table"
              >
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>开始</th>
                    <th>结束</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(fac, idx) in store.structFactors" :key="idx">
                    <td>{{ fac.id }}</td>
                    <td>{{ fac.start }}</td>
                    <td>{{ fac.end }}</td>
                    <td>
                      <q-btn
                        flat
                        round
                        size="sm"
                        icon="bi-trash"
                        class="ui-clickable"
                        @click="store.structFactors.splice(idx, 1)"
                      >
                        <q-tooltip anchor="top middle" self="bottom middle">
                          删除
                        </q-tooltip>
                      </q-btn>
                    </td>
                  </tr>
                </tbody>
              </q-markup-table>
              <q-markup-table
                v-if="store.mode === 'param'"
                flat
                separator="cell"
                class="text-center o-table"
              >
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>开始</th>
                    <th>结束</th>
                    <th>下界</th>
                    <th>上界</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(fac, idx) in store.paramFactors" :key="idx">
                    <td>{{ fac.id }}</td>
                    <td>{{ fac.start }}</td>
                    <td>{{ fac.end }}</td>
                    <td>
                      <q-input v-model.number="fac.lower" dense borderless />
                    </td>
                    <td>
                      <q-input v-model.number="fac.upper" dense borderless />
                    </td>
                    <td>
                      <q-btn
                        flat
                        round
                        size="sm"
                        icon="bi-trash"
                        class="ui-clickable"
                        @click="store.paramFactors.splice(idx, 1)"
                      >
                        <q-tooltip anchor="top middle" self="bottom middle">
                          删除
                        </q-tooltip>
                      </q-btn>
                    </td>
                  </tr>
                </tbody>
              </q-markup-table>
            </q-card-section>
          </q-card>
        </template>
      </q-splitter>
    </template>
  </q-splitter>
</template>

<script setup lang="ts">
import * as monaco from "monaco-editor";
import { useOptimizeStore } from "../../stores";

const $q = useQuasar();
const route = useRoute();
const store = useOptimizeStore();

async function loadRuleset() {
  if (store.id <= 0) {
    $q.notify({
      type: "negative",
      message: "规则集ID必须大于0",
    });
  } else {
    await store.loadRuleset();
    if (!store.ruleset) {
      $q.notify({
        type: "negative",
        message: "规则集ID不存在",
      });
    }
  }
}

const modeOptions = [
  { label: "结构优化", value: "struct" },
  { label: "参数优化", value: "param" },
];

function modeChanged() {
  store.structFactors = [];
  store.paramFactors = [];
  store.dynStructFactors = [];
  store.dynParamFactors = [];
  store.optimizeEpoches = [];
}

function addFactor() {
  const ed = editor.value?.editor;
  if (ed) {
    const model = ed.getModel();
    const selection = ed.getSelection();
    if (model && selection) {
      const range = new monaco.Range(
        selection.startLineNumber,
        selection.startColumn,
        selection.endLineNumber,
        selection.endColumn
      );
      const start = model.getOffsetAt(range.getStartPosition());
      const end = model.getOffsetAt(range.getEndPosition());
      if (start < end) {
        if (store.mode === "struct") {
          store.structFactors.push({
            id: store.structFactors.length,
            start,
            end,
            contrib: 0,
          });
        } else if (store.mode === "param") {
          store.paramFactors.push({
            id: store.paramFactors.length,
            start,
            end,
            lower: 0,
            upper: 0,
          });
        }
      } else {
        $q.notify({
          type: "negative",
          message: "请先选中一个因子",
        });
      }
    }
  }
}

const editor = ref<
  Nullable<{
    editor?: monaco.editor.IStandaloneCodeEditor;
  }>
>(null);

if (route.query.id) {
  const id_ = parseInt(route.query.id as string);
  if (id_) {
    store.id = id_;
    loadRuleset();
  }
}
</script>

<style scoped lang="scss">
.o-input {
  width: 20%;
}
.o-btn {
  width: 10%;
}
.o-table {
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
