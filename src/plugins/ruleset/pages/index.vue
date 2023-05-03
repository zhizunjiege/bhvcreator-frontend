<template>
  <q-splitter
    v-model="percent"
    :limits="[15, 95]"
    unit="%"
    separator-class="q-mx-xs transparent"
    class="fit q-pa-md"
  >
    <template #before>
      <q-splitter
        :model-value="5"
        disable
        horizontal
        unit="%"
        separator-class="q-my-sm"
        class="fit q-pa-md bg-secondary"
      >
        <template #before>
          <div class="fit flex flex-center">
            <q-input
              v-model="filter"
              dense
              debounce="500"
              standout="bg-ignore"
              input-class="text-foreground"
              placeholder="搜索"
              class="full-width"
            >
              <template #prepend>
                <q-icon name="bi-search" size="xs" class="text-foreground" />
              </template>
            </q-input>
          </div>
        </template>
        <template #after>
          <q-tree
            ref="tree"
            v-model:selected="selected"
            :nodes="nodes"
            :filter="filter"
            no-selection-unset
            node-key="id"
            label-key="name"
            children-key="subSets"
            selected-color="accent"
            no-nodes-label="无规则子集"
            no-results-label="无匹配结果"
            class="fit scroll"
          >
          </q-tree>
        </template>
      </q-splitter>
    </template>
    <template #after>
      <q-splitter
        :model-value="5"
        disable
        horizontal
        unit="%"
        separator-class="q-my-sm"
        class="fit q-pa-md bg-secondary"
      >
        <template #before>
          <div class="fit flex justify-between items-center">
            <span>{{ store.ruleset.name }}</span>
            <q-btn
              flat
              round
              size="sm"
              icon="bi-save"
              class="bg-secondary ui-clickable"
            >
              <q-tooltip self="center middle" anchor="top left">
                保存
              </q-tooltip>
            </q-btn>
          </div>
        </template>
        <template #after>
          <q-card flat class="q-mx-auto transparent r-card">
            <template v-if="selected == store.ruleset.id">
              <q-card-section class="text-center text-subtitle1">
                基本信息
              </q-card-section>
              <q-card-section>
                <q-markup-table flat separator="horizontal" class="r-table">
                  <tbody>
                    <tr>
                      <td>名称</td>
                      <td>
                        <q-input
                          v-model="store.ruleset.name"
                          dense
                          standout="bg-secondary"
                          input-class="text-foreground"
                          class="full-width"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>版本</td>
                      <td>
                        <q-input
                          v-model="store.ruleset.version"
                          dense
                          standout="bg-secondary"
                          input-class="text-foreground"
                          class="full-width"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>创建时间</td>
                      <td>
                        <q-input
                          v-model="store.ruleset.createTime"
                          dense
                          disable
                          standout="bg-secondary"
                          input-class="text-foreground"
                          class="full-width"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>修改时间</td>
                      <td>
                        <q-input
                          v-model="store.ruleset.updateTime"
                          dense
                          disable
                          standout="bg-secondary"
                          input-class="text-foreground"
                          class="full-width"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>详细描述</td>
                      <td>
                        <q-input
                          v-model="store.ruleset.desc"
                          dense
                          autogrow
                          clearable
                          type="textarea"
                          standout="bg-secondary"
                          input-class="text-foreground"
                          class="full-width"
                        />
                      </td>
                    </tr>
                  </tbody>
                </q-markup-table>
              </q-card-section>
              <q-card-section class="text-center text-subtitle1">
                参数定义
              </q-card-section>
              <q-card-section>
                <p class="text-subtitle2">输入参数</p>
                <r-params v-model="store.ruleset.metaInfo.inputs" />
              </q-card-section>
              <q-card-section>
                <p class="text-subtitle2">输出参数</p>
                <r-params v-model="store.ruleset.metaInfo.outputs" />
              </q-card-section>
              <q-card-section>
                <p class="text-subtitle2">缓存参数</p>
                <r-params v-model="store.ruleset.metaInfo.caches" />
              </q-card-section>
              <q-card-section>
                <p class="text-subtitle2">数值常量</p>
                <r-params v-model="store.ruleset.metaInfo.consts" />
              </q-card-section>
              <q-card-section>
                <p class="text-subtitle2">中间变量</p>
                <r-params v-model="store.ruleset.metaInfo.temps" />
              </q-card-section>
            </template>
            <q-card-section class="text-center text-subtitle1">
              子集管理
            </q-card-section>
            <q-card-section>
              <r-subsets v-if="node" v-model="node.subSets" />
            </q-card-section>
            <q-card-section class="text-center text-subtitle1">
              规则管理
            </q-card-section>
            <q-card-section>
              <r-rules v-if="node" v-model="node.rules" />
            </q-card-section>
          </q-card>
        </template>
      </q-splitter>
    </template>
  </q-splitter>
</template>

<script setup lang="ts">
import { QTree } from "quasar";
import { useCore } from "~/core";
import { useRuleSet } from "..";
import { useRuleSetStore } from "../stores";

import rParams from "./comps/r-params.vue";
import rSubsets from "./comps/r-subsets.vue";
import rRules from "./comps/r-rules.vue";

const core = useCore();
const plugin = useRuleSet();
const store = useRuleSetStore();

const percent = ref(15);

const filter = ref("");
const nodes = computed(() => [store.ruleset]);
const selected = ref(store.ruleset.id);
const tree = ref(null as Nullable<QTree>);
const node = computed(() => tree.value?.getNodeByKey(selected.value));
</script>

<style scoped lang="scss">
.r-card {
  width: 75%;
}
.r-table {
  :deep(table) {
    table-layout: fixed;
    th,
    td {
      font-size: 0.875rem !important;
      padding: 0.5rem 1.5rem !important;
      border-color: var(--ui-secondary) !important;
    }
  }
}
</style>
