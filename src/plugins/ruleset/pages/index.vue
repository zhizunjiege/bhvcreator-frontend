<template>
  <q-splitter
    v-model="percent"
    :limits="[15, 30]"
    separator-class="q-mx-sm transparent"
    class="fit q-pa-md"
  >
    <template #before>
      <q-splitter
        :model-value="5"
        disable
        horizontal
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
                <q-icon name="bi-search" size="xs" />
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
            @update:selected="
              tab = selected === store.ruleset.id ? 'infos' : 'rules'
            "
          />
        </template>
      </q-splitter>
    </template>
    <template #after>
      <q-splitter
        :model-value="5"
        disable
        horizontal
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
              icon="bi-x-circle"
              class="ui-clickable"
              @click="clear"
            >
              <q-tooltip anchor="top middle" self="center middle">
                清空
              </q-tooltip>
            </q-btn>
            <q-btn flat round size="sm" class="invisible q-ml-md" />
            <q-space />
            <q-tabs
              v-model="tab"
              dense
              active-color="accent"
              indicator-color="accent"
            >
              <template v-if="selected === store.ruleset.id">
                <q-tab name="infos" label="基本信息" />
                <q-tab name="types" label="类型定义" />
                <!-- <q-tab name="funcs" label="函数定义" /> -->
                <q-tab name="params" label="参数定义" />
              </template>
              <q-tab name="subsets" label="子集管理" />
              <q-tab name="rules" label="规则管理" />
            </q-tabs>
            <q-space />
            <q-btn
              :loading="saving"
              flat
              round
              size="sm"
              icon="bi-bug"
              class="q-mr-md ui-clickable"
              @click="valid"
            >
              <q-tooltip anchor="top middle" self="center middle">
                校验
              </q-tooltip>
            </q-btn>
            <q-btn
              :loading="saving"
              flat
              round
              size="sm"
              icon="bi-save"
              class="ui-clickable"
              @click="save"
            >
              <q-tooltip anchor="top middle" self="center middle">
                保存
              </q-tooltip>
            </q-btn>
          </div>
        </template>
        <template #after>
          <q-card flat class="q-mx-auto transparent r-card">
            <q-tab-panels v-model="tab" animated class="transparent">
              <q-tab-panel name="infos">
                <r-infos :model-value="store.ruleset" />
              </q-tab-panel>
              <q-tab-panel name="types">
                <r-types :model-value="store.ruleset.typeDefines" />
              </q-tab-panel>
              <!-- <q-tab-panel name="funcs">
                <r-funcs :model-value="store.ruleset.funcDefines" />
              </q-tab-panel> -->
              <q-tab-panel name="params">
                <q-card-section>
                  <p class="text-center text-subtitle2">输入参数</p>
                  <r-params :model-value="store.ruleset.metaInfo.inputs" />
                </q-card-section>
                <q-card-section>
                  <p class="text-center text-subtitle2">输出参数</p>
                  <r-params :model-value="store.ruleset.metaInfo.outputs" />
                </q-card-section>
                <q-card-section>
                  <p class="text-center text-subtitle2">数值常量</p>
                  <r-params :model-value="store.ruleset.metaInfo.consts" />
                </q-card-section>
                <q-card-section>
                  <p class="text-center text-subtitle2">缓存参数</p>
                  <r-params :model-value="store.ruleset.metaInfo.caches" />
                </q-card-section>
                <q-card-section>
                  <p class="text-center text-subtitle2">中间变量</p>
                  <r-params :model-value="store.ruleset.metaInfo.temps" />
                </q-card-section>
              </q-tab-panel>
              <q-tab-panel name="subsets">
                <r-subsets v-if="node" :model-value="node.subSets" />
              </q-tab-panel>
              <q-tab-panel name="rules">
                <r-rules v-if="node" :model-value="node.rules" />
              </q-tab-panel>
            </q-tab-panels>
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
// import rFuncs from "./comps/r-funcs.vue";
import rParams from "./comps/r-params.vue";
import rSubsets from "./comps/r-subsets.vue";
import rRules from "./comps/r-rules.vue";

const $q = useQuasar();
const route = useRoute();
const store = useRuleSetStore();

const percent = ref(15);

const filter = ref("");
const nodes = computed(() => [store.ruleset]);
const selected = ref(store.ruleset.id);
const tree = ref<Nullable<QTree>>(null);
const node = computed(() => tree.value?.getNodeByKey(selected.value));

const tab = ref("infos");

function clear() {
  store.$reset();
  selected.value = store.ruleset.id;
}

const validating = ref(false);

function valid() {
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
  const success = valid();
  if (success) {
    try {
      await store.save();
      selected.value = store.ruleset.id;
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

watch(
  () => route.query.id,
  async (val) => {
    if (val) {
      const id = parseInt(val as string);
      if (id) {
        await store.load(id);
        selected.value = store.ruleset.id;
      }
    }
  },
  { immediate: true }
);
</script>

<style scoped lang="scss">
.r-card {
  width: 80%;
}
</style>

<route lang="yaml">
name: ruleset
</route>
