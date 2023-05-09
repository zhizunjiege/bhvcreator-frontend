<template>
  <div class="fit flex flex-center">
    <q-splitter
      v-model="percent"
      :limits="[50, 75]"
      separator-class="q-mx-sm transparent"
      class="fit q-pa-lg"
    >
      <template #before>
        <monaco-editor v-model="xml" readonly language="xml" />
      </template>
      <template #after>
        <div class="fit flex flex-center">
          <div class="fit column no-wrap overflow-hidden e-cards">
            <q-card flat class="transparent">
              <q-card-section class="text-center text-subtitle1">
                配置参数
              </q-card-section>
              <q-card-section>
                <q-markup-table flat separator="horizontal" class="c-table">
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
                <component :is="getAsyncComp()" v-model="options" />
              </q-card-section>
            </q-card>
            <q-card flat class="transparent">
              <q-card-section>
                <q-btn-group spread>
                  <q-btn color="primary" label="导入" @click="import_" />
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
import { fileOpen } from "browser-fs-access";
import { useCore } from "~/core";
import { useConvert } from "..";
import { ImportOptions } from "../plugins";

const $q = useQuasar();
const core = useCore();
const plugin = useConvert();

const percent = ref(60);

const targetOptions = ["CQSIM"];
const target = ref(targetOptions[0]);

function getAsyncComp() {
  return defineAsyncComponent(
    () => import(`./comps/${target.value.toLowerCase()}/import.vue`)
  );
}

const xml = ref("");

const options = ref({} as ImportOptions[keyof ImportOptions]);
async function upload() {
  const blob = await fileOpen({
    description: "model.xml",
    extensions: [".xml"],
    mimeTypes: ["application/xml"],
    multiple: false,
  });
  xml.value = await blob.text();
}
async function import_() {
  try {
    try {
      await upload();
    } catch (e) {
      $q.notify({
        type: "info",
        message: "导入取消",
      });
    }
    if (xml.value) {
      const result = plugin.import_(
        xml.value,
        target.value as keyof ImportOptions,
        options.value
      );
      await core.insert("ruleset", {
        id: 0,
        name: "导入规则集",
        version: "1.0.0",
        description: "",
        mode: options.value.mode,
        xml: result,
      });
      $q.notify({
        type: "positive",
        message: "导入成功",
      });
    }
  } catch (e) {
    $q.notify({
      type: "negative",
      message: "导入失败：" + e,
    });
    console.error(e);
  }
}
</script>

<style scoped lang="scss">
.c-table {
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

<route lang="yaml">
name: import
</route>
