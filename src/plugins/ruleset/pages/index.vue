<template>
  <q-splitter
    v-model="percent"
    :limits="[15, 30]"
    unit="%"
    separator-class="q-mx-sm transparent"
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
              filled
              debounce="500"
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
            <q-btn
              :loading="saving"
              flat
              round
              size="sm"
              icon="bi-bug"
              class="bg-secondary ui-clickable"
              @click="validate"
            >
              <q-tooltip self="center middle" anchor="top right">
                校验
              </q-tooltip>
            </q-btn>
            <q-btn
              :loading="saving"
              flat
              round
              size="sm"
              icon="bi-save"
              class="bg-secondary ui-clickable"
              @click="save"
            >
              <q-tooltip self="center middle" anchor="top left">
                保存
              </q-tooltip>
            </q-btn>
          </div>
        </template>
        <template #after>
          <q-card
            v-show="selected == store.ruleset.id"
            flat
            class="q-mx-auto transparent r-card"
          >
            <q-card-section class="text-center text-subtitle1">
              基本信息
            </q-card-section>
            <q-card-section>
              <r-infos v-model="store.ruleset" />
            </q-card-section>
            <q-card-section class="text-center text-subtitle1">
              类型定义
            </q-card-section>
            <q-card-section>
              <r-types v-model="store.ruleset.typeDefines" />
            </q-card-section>
            <q-card-section class="text-center text-subtitle1">
              函数定义
            </q-card-section>
            <q-card-section>
              <r-funcs v-model="store.ruleset.funcDefines" />
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
          </q-card>
          <q-card flat class="q-mx-auto transparent r-card">
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
import { useRuleSetStore } from "../stores";

import rInfos from "./comps/r-infos.vue";
import rTypes from "./comps/r-types.vue";
import rFuncs from "./comps/r-funcs.vue";
import rParams from "./comps/r-params.vue";
import rSubsets from "./comps/r-subsets.vue";
import rRules from "./comps/r-rules.vue";

const $q = useQuasar();
const store = useRuleSetStore();

const percent = ref(15);

const filter = ref("");
const nodes = computed(() => [store.ruleset]);
const selected = ref(store.ruleset.id);
const tree = ref(null as Nullable<QTree>);
const node = computed(() => tree.value?.getNodeByKey(selected.value));

const validating = ref(false);

function validate() {
  validating.value = true;
  const result = store.validate();
  if (result.success) {
    $q.notify({
      type: "positive",
      message: "校验成功",
    });
  } else {
    $q.notify({
      type: "negative",
      message: "校验失败：" + result.message,
    });
  }
  validating.value = false;
  return result.success;
}

const saving = ref(false);

async function save() {
  saving.value = true;
  const success = validate();
  if (success) {
    try {
      await store.save();
      $q.notify({
        type: "positive",
        message: "保存成功",
      });
    } catch (e) {
      $q.notify({
        type: "negative",
        message: "保存失败：" + e,
      });
      console.error(e);
    }
  }
  saving.value = false;
}
</script>

<style scoped lang="scss">
.r-card {
  width: 80%;
}
</style>

<route lang="yaml">
name: ruleset
</route>
