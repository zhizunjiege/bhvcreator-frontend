<template>
  <div class="fit flex flex-center">
    <q-splitter
      v-model="percent"
      :limits="[50, 70]"
      separator-class="q-mx-sm transparent"
      class="fit q-pa-lg"
    >
      <template #before>
        <monaco-editor
          v-if="xml"
          v-model="xml"
          minimap
          readonly
          language="xml"
        />
        <div v-else class="fit flex flex-center bg-secondary">
          <q-input
            v-model.number="id"
            dense
            filled
            placeholder="请输入规则集ID"
            class="e-input"
          >
            <template #append>
              <q-icon
                name="bi-check-circle"
                class="ui-clickable"
                @click="getRaw"
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
        <div class="fit flex flex-center">
          <div class="fit column no-wrap overflow-hidden e-cards">
            <q-card flat class="transparent">
              <q-card-section class="text-center text-subtitle1">
                导出参数
              </q-card-section>
              <q-card-section>
                <q-markup-table flat separator="horizontal" class="e-table">
                  <tbody>
                    <tr>
                      <td>仿真平台</td>
                      <td>
                        <q-select
                          v-model="target"
                          :options="targetOptions"
                          dense
                          filled
                          options-dense
                          hide-dropdown-icon
                          class="full-width"
                        />
                      </td>
                    </tr>
                  </tbody>
                </q-markup-table>
              </q-card-section>
            </q-card>
            <q-card flat class="col-grow transparent">
              <q-card-section class="fit">
                <component :is="getAsyncComp(target)" v-model="options" />
              </q-card-section>
            </q-card>
            <q-card flat class="transparent">
              <q-card-section>
                <q-btn-group spread>
                  <q-btn
                    :disable="!xml"
                    icon="bi-x-circle"
                    color="primary"
                    label="清空"
                    class="full-width"
                    @click="xml = ''"
                  />
                  <q-separator vertical />
                  <q-btn
                    :disable="!xml"
                    icon="bi-arrow-down-left-circle"
                    color="primary"
                    label="导出"
                    @click="export_"
                  />
                </q-btn-group>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </template>
    </q-splitter>
  </div>
</template>

<script setup lang="ts">
import { fileSave } from "browser-fs-access";
import { useCore } from "~/core";
import { useConvert } from "..";
import { ExportOptions } from "../plugins";

type Plugin = keyof ExportOptions;

const $q = useQuasar();
const route = useRoute();
const core = useCore();
const plugin = useConvert();

const percent = ref(60);

const id = ref(0);

const xml = ref("");

async function getRaw() {
  try {
    const res = await core.select("ruleset", [], { id: id.value });
    if (res.length) {
      xml.value = res[0].xml;
    } else {
      $q.notify({
        type: "negative",
        message: "ID不存在",
      });
    }
  } catch (e) {
    $q.notify({
      type: "negative",
      message: "获取资源失败：" + e,
    });
    console.error(e);
  }
}

const targetOptions = ["ASRAW", "CQSIM"];
const target = ref(targetOptions[0]);

const options = ref({} as ExportOptions[Plugin]);

function getAsyncComp(target: string) {
  return defineAsyncComponent(() =>
    import(`../plugins/${target.toLowerCase()}/export.vue`).catch(
      () => import(`../plugins/empty.vue`)
    )
  );
}

async function export_() {
  try {
    const result = plugin.export_(
      xml.value,
      target.value as Plugin,
      options.value as ExportOptions[Plugin]
    );
    const blob = new Blob([result]);
    await fileSave(blob, {
      fileName: "model.xml",
      extensions: [".xml"],
    });
    $q.notify({
      type: "positive",
      message: "导出成功",
    });
  } catch (e) {
    if (e instanceof DOMException) {
      $q.notify({
        type: "info",
        message: "导出取消",
      });
    } else {
      $q.notify({
        type: "negative",
        message: "导出失败：" + e,
      });
      console.error(e);
    }
  }
}

onActivated(() => {
  if (route.query.id) {
    const id_ = parseInt(route.query.id as string);
    if (id_) {
      id.value = id_;
      getRaw();
    }
  }
});
</script>

<style scoped lang="scss">
.e-input {
  width: 20%;
}
.e-table {
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
