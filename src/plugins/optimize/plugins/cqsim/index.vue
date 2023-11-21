<template>
  <form v-if="!isEmpty(options)" ref="form">
    <q-markup-table flat separator="horizontal" class="cq-table">
      <tbody>
        <tr>
          <td>控制服务地址</td>
          <td>
            <q-input
              v-model="options.ctrlAddr"
              dense
              filled
              required
              class="full-width"
            />
          </td>
        </tr>
        <tr>
          <td>数据服务地址</td>
          <td>
            <q-input
              v-model="options.dataAddr"
              dense
              filled
              required
              class="full-width"
            />
          </td>
        </tr>
        <tr>
          <td>资源服务地址</td>
          <td>
            <q-input
              v-model="options.resAddr"
              dense
              filled
              required
              class="full-width"
              @update:model-value="getScenariosAndExpDesigns"
            />
          </td>
        </tr>
        <tr>
          <td>资源服务令牌</td>
          <td>
            <q-input
              v-model="options.xToken"
              dense
              filled
              required
              class="full-width"
              @update:model-value="getScenariosAndExpDesigns"
            />
          </td>
        </tr>
        <tr>
          <td>行为模型标识</td>
          <td>
            <q-input
              v-model="options.modelId"
              dense
              filled
              required
              minlength="36"
              maxlength="36"
              mask="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
              class="full-width"
            />
          </td>
        </tr>
        <tr>
          <td>
            <q-btn-toggle
              v-model="inScenario"
              :options="[
                { label: '仿真想定', value: true },
                { label: '实验设计', value: false },
              ]"
              toggle-color="secondary"
              toggle-text-color="accent"
              @update:model-value="onModeChanged"
            />
          </td>
          <td>
            <q-select
              v-if="inScenario"
              v-model.number="options.scenarioId"
              :options="scenarios"
              :disable="scenarios.length === 0"
              dense
              filled
              required
              emit-value
              map-options
              options-dense
              option-value="id"
              option-label="name"
              :display-value="options.scenarioId"
              popup-content-class="bg-secondary"
              class="full-width"
              @update:model-value="onScenarioOrExpDesignChanged"
            />
            <q-select
              v-else
              v-model.number="options.expDesignId"
              :options="expdesigns"
              :disable="expdesigns.length === 0"
              dense
              filled
              required
              emit-value
              map-options
              options-dense
              option-value="id"
              option-label="name"
              :display-value="options.expDesignId"
              popup-content-class="bg-secondary"
              class="full-width"
              @update:model-value="onScenarioOrExpDesignChanged"
            />
          </td>
        </tr>
        <tr>
          <td>{{ inScenario ? "仿真想定" : "实验设计" }}重复次数</td>
          <td>
            <q-input
              v-model.number="options.repeatTimes"
              dense
              filled
              type="number"
              required
              min="1"
              class="full-width"
            />
          </td>
        </tr>
        <tr>
          <td>仿真持续时长（时:分:秒）</td>
          <td>
            <q-input
              :model-value="getDurationString(options.simDuration * 1000)"
              dense
              filled
              required
              mask="##:##:##"
              class="full-width"
              @blur="
                options.simDuration =
                  getDurationNumber(($event.target as HTMLInputElement).value) /
                  1000
              "
            />
          </td>
        </tr>
        <tr>
          <td>仿真步长（毫秒）</td>
          <td>
            <q-input
              v-model.number="options.timeStep"
              dense
              filled
              type="number"
              required
              min="5"
              class="full-width"
            />
          </td>
        </tr>
        <tr>
          <td>仿真倍速</td>
          <td>
            <q-input
              v-model.number="options.speedRatio"
              dense
              filled
              type="number"
              required
              min="-1"
              step="0.1"
              class="full-width"
            />
          </td>
        </tr>
      </tbody>
    </q-markup-table>
    <template v-if="!isEmpty(entities)">
      <p class="text-center text-subtitle2">仿真数据配置</p>
      <q-btn
        flat
        dense
        icon="bi-plus-circle"
        class="full-width bg-secondary ui-clickable"
        @click="
          options.modelFields.unshift({
            id: '',
            outputs: [],
          })
        "
      />
      <q-markup-table
        v-for="(item, index) in options.modelFields"
        :key="index"
        flat
        separator="horizontal"
        class="q-mt-sm cq-table"
      >
        <tbody>
          <tr>
            <td>实体ID</td>
            <td>
              <q-select
                v-model="item.id"
                :options="Object.keys(entities)"
                dense
                filled
                required
                options-dense
                class="full-width"
              />
            </td>
            <td>实体名称</td>
            <td>
              <q-input
                :model-value="entities[item.id]?.name ?? ''"
                dense
                filled
                readonly
                class="full-width"
              />
            </td>
          </tr>
          <tr v-if="item.id">
            <td>实体输出</td>
            <td colspan="2">
              <q-select
                v-model="item.outputs"
                :options="entities[item.id].outputs"
                dense
                filled
                multiple
                options-dense
                :display-value="`已选择 ${item.outputs.length} 项`"
                class="full-width"
              />
            </td>
            <td>
              <q-btn
                flat
                dense
                icon="bi-x-circle"
                class="bg-secondary full-width ui-clickable"
                @click="options.modelFields.splice(index, 1)"
              >
                <q-tooltip anchor="top middle" self="bottom middle">
                  删除实体
                </q-tooltip>
              </q-btn>
            </td>
          </tr>
        </tbody>
      </q-markup-table>
    </template>
  </form>
</template>

<script setup lang="ts">
import { getDurationNumber, getDurationString, isEmpty } from "~/utils";
import { CQSIMOptimizeOptions } from ".";
import {
  getScenarioList,
  getExpDesignList,
  getScenarioFile,
  scenarioXml2Obj,
  EntityFields,
} from "./api";

const props = defineProps<{
  modelValue: CQSIMOptimizeOptions;
}>();
const emits = defineEmits<{
  (e: "update:modelValue", modelValue: CQSIMOptimizeOptions): void;
}>();

const options = computed(() => props.modelValue);

const $q = useQuasar();

const inScenario = ref(true);

const scenarios = ref([] as Awaited<ReturnType<typeof getScenarioList>>);
const expdesigns = ref([] as Awaited<ReturnType<typeof getExpDesignList>>);

async function getScenariosAndExpDesigns() {
  try {
    scenarios.value = await getScenarioList(
      options.value.resAddr,
      options.value.xToken
    );
    expdesigns.value = await getExpDesignList(
      options.value.resAddr,
      options.value.xToken
    );
  } catch (e) {
    scenarios.value = [];
    expdesigns.value = [];
    $q.notify({
      type: "negative",
      message: "获取仿真想定和实验设计失败，请检查CQSIM引擎是否正常运行",
    });
    console.error(e);
  }
}

const entities = ref({} as Record<string, EntityFields & { name: string }>);

async function parseEntities(id: number) {
  try {
    if (!inScenario.value) {
      const expdesign = expdesigns.value.find((item) => item.id === id);
      id = expdesign?.scenarioId ?? 0;
      options.value.expSampleSize = expdesign?.sampleSize ?? 0;
    }
    if (id === 0) {
      return;
    }

    const scenario = await getScenarioFile(
      options.value.resAddr,
      options.value.xToken,
      id
    );
    const obj = scenarioXml2Obj(scenario);

    for (const item of obj.entities) {
      entities.value[item.id] = {
        id: item.id,
        name: item.name,
        outputs: item.parameters
          .filter((item) => item.usage.includes("output"))
          .map((item) => item.name),
      };
    }
  } catch (e) {
    if (e instanceof Error) {
      $q.notify({
        type: "negative",
        message: e.message,
      });
    }
    console.error(e);
  }
}

function onModeChanged() {
  options.value.scenarioId = 0;
  options.value.expDesignId = 0;
  options.value.expSampleSize = 0;
  options.value.modelFields = [];
  entities.value = {};
}

async function onScenarioOrExpDesignChanged(id: number) {
  options.value.modelFields = [];
  await parseEntities(id);
}

const form = ref<Nullable<HTMLFormElement>>(null);
function submit() {
  if (!form.value!.reportValidity()) {
    return;
  }
}
watch(options, submit, { deep: true });

(async () => {
  if (props.modelValue && !isEmpty(props.modelValue)) {
    await getScenariosAndExpDesigns();
    if (options.value.scenarioId > 0) {
      inScenario.value = true;
      await parseEntities(options.value.scenarioId);
    } else if (options.value.expDesignId > 0) {
      inScenario.value = false;
      await parseEntities(options.value.expDesignId);
    }
  } else {
    emits("update:modelValue", {
      ctrlAddr: "localhost:50041",
      dataAddr: "localhost:8004",
      resAddr: "localhost:8001",
      xToken:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhc2NvcGUiOiIiLCJleHAiOjQ4MTAxOTcxNTQsImlkZW50aXR5IjoxLCJuaWNlIjoiYWRtaW4iLCJvcmlnX2lhdCI6MTY1NjU2MTE1NCwicm9sZWlkIjoxLCJyb2xla2V5IjoiYWRtaW4iLCJyb2xlbmFtZSI6Iuezu-e7n-euoeeQhuWRmCJ9.BvjGw26L1vbWHwl0n8Y1_yTF-fiFNZNmIw20iYe7ToU",
      modelId: "",
      scenarioId: 0,
      expDesignId: 0,
      expSampleSize: 0,
      repeatTimes: 1,
      simDuration: 60,
      timeStep: 50,
      speedRatio: -1,
      modelFields: [],
    });
    nextTick(getScenariosAndExpDesigns);
  }
})();
</script>

<style scoped lang="scss">
.cq-table {
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
.cq-editor {
  width: 100%;
  height: 40vh;
}
</style>
