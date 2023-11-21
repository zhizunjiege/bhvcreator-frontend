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
          <q-btn
            icon="bi-paperclip"
            color="primary"
            label="选择文件"
            class="i-file"
            @click="getRaw"
          />
        </div>
      </template>
      <template #after>
        <div class="fit flex flex-center">
          <div class="fit column no-wrap overflow-hidden e-cards">
            <q-card flat class="transparent">
              <q-card-section class="text-center text-subtitle1">
                导入参数
              </q-card-section>
              <q-card-section>
                <q-markup-table flat separator="horizontal" class="i-table">
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
                    @click="xml = ''"
                  />
                  <q-separator vertical />
                  <q-btn
                    :disable="!xml"
                    icon="bi-arrow-up-right-circle"
                    color="primary"
                    label="导入"
                    @click="import_"
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
import { fileOpen } from "browser-fs-access";
import { useCore } from "~/core";
import { useConvert } from "..";
import { ImportOptions } from "../plugins";

type Plugin = keyof ImportOptions;

const $q = useQuasar();
const core = useCore();
const plugin = useConvert();

const percent = ref(60);

const xml = ref("");

async function getRaw() {
  try {
    const blob = await fileOpen({
      description: "model.xml",
      extensions: [".xml"],
      mimeTypes: ["application/xml"],
      multiple: false,
    });
    xml.value = await blob.text();
  } catch (e) {
    $q.notify({
      type: "info",
      message: "导入取消",
    });
  }
}

const targetOptions = ["ASRAW", "CQSIM"];
const target = ref(targetOptions[0]);

const options = ref({} as ImportOptions[Plugin]);

function getAsyncComp(target: string) {
  return defineAsyncComponent(() =>
    import(`../plugins/${target.toLowerCase()}/import.vue`).catch(
      () => import(`../plugins/empty.vue`)
    )
  );
}

async function import_() {
  try {
    const result = plugin.import_(
      xml.value,
      target.value as Plugin,
      options.value as ImportOptions[Plugin]
    );
    await core.insert("ruleset", {
      id: 0,
      name: "导入规则集",
      version: "1.0.0",
      description: "",
      xml: result,
    });
    $q.notify({
      type: "positive",
      message: "导入成功",
    });
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
.i-file {
  width: 20%;
}
.i-table {
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
