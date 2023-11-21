<template>
  <q-splitter
    :model-value="40"
    disable
    horizontal
    separator-class="transparent"
    class="fit"
  >
    <template #before>
      <div class="fit row">
        <q-card flat class="col-4 transparent">
          <q-card-section>
            <q-markup-table flat separator="horizontal" class="o-table">
              <tbody>
                <tr>
                  <td>优化轮数</td>
                  <td>
                    <q-input
                      v-model.number="store.epochs"
                      dense
                      filled
                      required
                      min="1"
                      step="1"
                      class="full-width"
                    />
                  </td>
                </tr>
                <tr v-if="store.mode === 'struct'">
                  <td>组合次数</td>
                  <td>
                    <q-input
                      :model-value="store.maxCombinations.toString()"
                      dense
                      filled
                      required
                      debounce="500"
                      class="full-width"
                      @update:model-value="
                        store.maxCombinations = ($event as string)
                          .split(',')
                          .map(Number)
                      "
                    />
                  </td>
                </tr>
                <tr v-if="store.mode === 'param'">
                  <td>样本数量</td>
                  <td>
                    <q-input
                      :model-value="store.samplesNumber.toString()"
                      dense
                      filled
                      required
                      debounce="500"
                      class="full-width"
                      @update:model-value="
                        store.samplesNumber = ($event as string)
                          .split(',')
                          .map(Number)
                      "
                    />
                  </td>
                </tr>
                <tr>
                  <td>保留比例</td>
                  <td>
                    <q-input
                      v-model.number="store.reserveRatio"
                      dense
                      filled
                      required
                      min="0"
                      max="1"
                      step="0.01"
                      class="full-width"
                    />
                  </td>
                </tr>
                <tr>
                  <td>指标阈值</td>
                  <td>
                    <q-input
                      v-model.number="store.indexThreshold"
                      dense
                      filled
                      required
                      min="0"
                      class="full-width"
                    />
                  </td>
                </tr>
                <tr>
                  <td>指标计算函数</td>
                  <td>
                    <q-btn
                      flat
                      dense
                      label="编辑"
                      class="full-width q-my-xs bg-secondary ui-clickable"
                      @click="showCalc = true"
                    />
                  </td>
                </tr>
              </tbody>
            </q-markup-table>
          </q-card-section>
        </q-card>
        <q-card flat class="col-4 transparent">
          <q-card-section>
            <q-markup-table flat separator="horizontal" class="o-table">
              <tbody>
                <tr>
                  <td>优化状态</td>
                  <td>
                    <q-btn
                      flat
                      dense
                      class="full-width q-my-xs bg-secondary ui-clickable"
                      :class="running ? 'text-accent' : ''"
                      @click="run"
                    >
                      <q-icon
                        size="xs"
                        :name="running ? 'bi-stop-circle' : 'bi-play-circle'"
                        class="q-mr-md"
                      />
                      {{ running ? "优化中" : "已停止" }}
                      <q-tooltip anchor="top middle" self="bottom middle">
                        {{ running ? "停止优化" : "开始优化" }}
                      </q-tooltip>
                    </q-btn>
                  </td>
                </tr>
                <tr>
                  <td>已优化轮数</td>
                  <td>
                    <q-input
                      :model-value="store.optimizeEpoches.length"
                      dense
                      filled
                      readonly
                      class="bg-secondary full-width"
                    />
                  </td>
                </tr>
                <tr>
                  <td>已优化样本数</td>
                  <td>
                    <q-input
                      :model-value="store.testedSamples()"
                      dense
                      filled
                      readonly
                      class="bg-secondary full-width"
                    />
                  </td>
                </tr>
                <tr>
                  <td>原始规则集指标</td>
                  <td>
                    <q-input
                      :model-value="store.index"
                      dense
                      filled
                      readonly
                      class="bg-secondary full-width"
                    />
                  </td>
                </tr>
                <tr>
                  <td>当前最优规则集指标</td>
                  <td>
                    <q-btn
                      flat
                      dense
                      :disable="
                        store.bestIndex() - store.index < store.indexThreshold
                      "
                      class="full-width q-my-xs bg-secondary ui-clickable"
                      @click="save"
                    >
                      {{ store.bestIndex() }}
                      <q-tooltip anchor="top middle" self="bottom middle">
                        保存最优规则集
                      </q-tooltip>
                    </q-btn>
                  </td>
                </tr>
              </tbody>
            </q-markup-table>
          </q-card-section>
        </q-card>
        <q-card flat class="col-4 transparent">
          <q-card-section>
            <q-markup-table flat separator="horizontal" class="o-table">
              <tbody>
                <tr>
                  <td>仿真平台</td>
                  <td>
                    <q-select
                      v-model="store.target"
                      :options="targetOptions"
                      dense
                      filled
                      options-dense
                      class="full-width"
                      @update:model-value="targetChanged"
                    />
                  </td>
                </tr>
                <tr>
                  <td>规则集导出参数</td>
                  <td>
                    <q-btn
                      flat
                      dense
                      label="编辑"
                      class="full-width q-my-xs bg-secondary ui-clickable"
                      @click="showConv = true"
                    />
                  </td>
                </tr>
                <tr>
                  <td>规则集优化参数</td>
                  <td>
                    <q-btn
                      flat
                      dense
                      label="编辑"
                      class="full-width q-my-xs bg-secondary ui-clickable"
                      @click="showOpti = true"
                    />
                  </td>
                </tr>
                <tr>
                  <td>保存所有参数</td>
                  <td>
                    <q-btn
                      flat
                      dense
                      label="确定"
                      class="full-width q-my-xs bg-secondary ui-clickable"
                      @click="saveToStorage"
                    />
                  </td>
                </tr>
                <tr>
                  <td>加载所有参数</td>
                  <td>
                    <q-btn
                      flat
                      dense
                      label="确定"
                      class="full-width q-my-xs bg-secondary ui-clickable"
                      @click="loadFromStorage"
                    />
                  </td>
                </tr>
              </tbody>
            </q-markup-table>
          </q-card-section>
        </q-card>
      </div>
    </template>
    <template #after>
      <q-splitter
        v-if="store.optimizeEpoches.length > 0"
        :model-value="32"
        disable
        separator-class="transparent q-mx-md"
        class="fit q-pa-md"
      >
        <template #before>
          <q-tabs
            v-model="epoch"
            vertical
            switch-indicator
            active-color="accent"
            active-bg-color="secondary"
          >
            <q-tab
              v-for="(samples, i) in store.optimizeEpoches"
              :key="i"
              :name="i"
              :label="`第 ${i + 1} 轮----样本数 ${
                samples.length
              }----已优化 ${store.testedSamples(
                i
              )}----最优指标 ${store.bestIndex(i)}`"
            />
          </q-tabs>
        </template>
        <template #after>
          <q-tab-panels v-model="epoch" animated class="fit transparent">
            <q-tab-panel
              v-for="(samples, i) in store.optimizeEpoches"
              :key="i"
              :name="i"
              class="fit scroll q-pa-none"
            >
              <q-markup-table flat separator="cell" class="text-center o-table">
                <thead>
                  <tr>
                    <th>样本序号</th>
                    <th>因子数量</th>
                    <th>是否优化</th>
                    <th>性能指标</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(sample, j) in samples" :key="j">
                    <td>{{ j + 1 }}</td>
                    <td>{{ sample.factors.length }}</td>
                    <td>{{ sample.tested ? "是" : "否" }}</td>
                    <td>{{ sample.index }}</td>
                  </tr>
                </tbody>
              </q-markup-table>
            </q-tab-panel>
          </q-tab-panels>
        </template>
      </q-splitter>
      <div v-else class="fit flex flex-center">
        <p class="text-info text-h3 text-weight-bold">暂 无 优 化 数 据</p>
      </div>
    </template>
  </q-splitter>
  <q-card v-if="showCalc" class="fixed-center z-top">
    <q-card-section class="row text-subtitle1">
      指标计算函数
      <q-space />
      <q-btn
        flat
        round
        dense
        icon="bi-x-circle"
        class="ui-clickable"
        @click="showCalc = false"
      />
    </q-card-section>
    <q-card-section class="o-editor">
      <monaco-editor v-model="store.indexCalculator" language="javascript" />
    </q-card-section>
  </q-card>
  <q-dialog v-model="showConv">
    <q-card class="o-card">
      <q-card-section class="text-center text-subtitle1">
        规则集导出参数
      </q-card-section>
      <q-card-section>
        <component
          :is="getConvertAsyncComp(store.target)"
          v-model="store.convertOptions"
        />
      </q-card-section>
    </q-card>
  </q-dialog>
  <q-dialog v-model="showOpti">
    <q-card class="o-card">
      <q-card-section class="text-center text-subtitle1">
        规则集优化参数
      </q-card-section>
      <q-card-section>
        <component
          :is="getOptimizeAsyncComp(store.target)"
          v-model="store.optimizeOptions"
        />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ExportOptions } from "~/plugins/convert/plugins";
import { useOptimize } from "../..";
import { useOptimizeStore, Plugin } from "../../stores";
import { OptimizeOptions } from "../../plugins";

const $q = useQuasar();
const store = useOptimizeStore();
const plugin = useOptimize();

const showCalc = ref(false);

const running = ref(false);

const targetOptions = ["CQSIM"];

function targetChanged() {
  store.convertOptions = {} as ExportOptions[Plugin];
  store.optimizeOptions = {} as OptimizeOptions[Plugin];
}

const showConv = ref(false);
function getConvertAsyncComp(target: string) {
  return defineAsyncComponent(() =>
    import(`../../../convert/plugins/${target.toLowerCase()}/export.vue`).catch(
      () => import(`../../../convert/plugins/empty.vue`)
    )
  );
}

const showOpti = ref(false);
function getOptimizeAsyncComp(target: string) {
  return defineAsyncComponent(() =>
    import(`../../plugins/${target.toLowerCase()}/index.vue`).catch(
      () => import(`../../plugins/empty.vue`)
    )
  );
}

const epoch = ref(0);

async function run() {
  running.value = !running.value;
  if (running.value) {
    try {
      const calculator = new Function("data", store.indexCalculator);

      const data = await plugin.result(
        store.ruleset,
        store.target,
        store.optimizeOptions,
        store.convertOptions
      );
      store.index = calculator(data) as number;

      for (let i = 0; i < store.epochs; i++) {
        if (!running.value) {
          $q.notify({
            type: "negative",
            message: "优化中止！",
          });
          break;
        }
        store.genSamples();
        for (const sample of store.optimizeEpoches[i]) {
          if (!running.value) {
            break;
          }
          const ruleset = store.genRuleset(sample);
          const data = await plugin.result(
            ruleset,
            store.target,
            store.optimizeOptions,
            store.convertOptions
          );
          sample.index = calculator(data) as number;
          sample.tested = true;
        }
      }
      if (running.value) {
        $q.notify({
          type: "positive",
          message: "优化完成！",
        });
        running.value = false;
      }
    } catch (e) {
      $q.notify({
        type: "negative",
        message: "优化出错！",
      });
      console.error(e);
    }
  }
}

async function save() {
  try {
    await store.saveRuleset();
    $q.notify({
      type: "positive",
      message: "保存最优规则集成功！",
    });
  } catch (e) {
    $q.notify({
      type: "negative",
      message: "保存最优规则集失败！",
    });
    console.error(e);
  }
}

function saveToStorage() {
  localStorage.setItem("optimizeState", JSON.stringify(store.$state));
}

function loadFromStorage() {
  const state = localStorage.getItem("optimizeState");
  if (state) {
    store.$patch(JSON.parse(state));
  }
}
</script>

<style scoped lang="scss">
.o-table {
  :deep(table) {
    table-layout: fixed;
    th,
    td {
      font-size: 1rem !important;
      padding: 0.5rem 1.5rem !important;
      border-color: var(--ui-secondary) !important;
    }
  }
}
.o-editor {
  width: 60vw;
  height: 50vh;
}
.o-card {
  width: 60vw;
  max-width: 60vw;
}
</style>
