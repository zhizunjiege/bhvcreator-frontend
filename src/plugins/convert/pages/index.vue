<template>
  <div class="fit flex flex-center">
    <q-splitter
      v-model="percent"
      :limits="[50, 75]"
      separator-class="q-mx-sm transparent"
      class="fit q-pa-lg"
    >
      <template #before>
        <monaco-editor v-model="xml" minimap readonly language="xml" />
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
                <component
                  :is="getAsyncComp(target, mode)"
                  v-if="mode"
                  v-model="options"
                />
              </q-card-section>
            </q-card>
            <q-card flat class="transparent">
              <q-card-section>
                <q-btn-group spread>
                  <q-btn
                    :disable="mode !== 'import'"
                    icon="bi-arrow-up-right-circle"
                    color="primary"
                    label="导入"
                    @click="import_"
                  />
                  <q-separator vertical />
                  <q-btn
                    :disable="mode !== 'export'"
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
import { fileOpen, fileSave } from "browser-fs-access";
import { useCore } from "~/core";
import { useConvert } from "..";
import { ImportOptions, ExportOptions } from "../plugins";

type Plugin = keyof ImportOptions & keyof ExportOptions;

const $q = useQuasar();
const route = useRoute();
const core = useCore();
const plugin = useConvert();

const mode = computed(() => route.query.mode as "import" | "export");
const table = computed(() => route.query.table as string);
const id = computed(() => parseInt(route.query.id as string));

const percent = ref(60);

const targetOptions = ["ASRAW", "CQSIM"];
const target = ref(targetOptions[0]);

function getAsyncComp(target: string, mode: "import" | "export") {
  return defineAsyncComponent(() =>
    import(`../plugins/${target.toLowerCase()}/${mode}.vue`).catch(
      () => import(`../plugins/empty.vue`)
    )
  );
}

const xml = ref("");

const options = ref({} as ImportOptions[Plugin] | ExportOptions[Plugin]);

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
        target.value as Plugin,
        options.value as ImportOptions[Plugin]
      );
      await core.insert("ruleset", {
        id: 0,
        name: "导入规则集",
        version: "1.0.0",
        description: "",
        mode: "normal",
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

async function download() {
  const blob = new Blob([xml.value]);
  await fileSave(blob, {
    fileName: "model.xml",
    extensions: [".xml"],
  });
}
async function export_() {
  if (table.value && id.value) {
    if (table.value === "ruleset") {
      try {
        const res = await core.select("ruleset", [], { id: id.value });
        if (res.length) {
          const result = plugin.export_(
            res[0].xml,
            target.value as Plugin,
            options.value as ExportOptions[Plugin]
          );
          xml.value = result;
          try {
            await download();
            $q.notify({
              type: "positive",
              message: "导出成功",
            });
          } catch (e) {
            $q.notify({
              type: "info",
              message: "导出取消",
            });
          }
        }
      } catch (e) {
        $q.notify({
          type: "negative",
          message: "导出失败：" + e,
        });
        console.error(e);
      }
    } else {
      $q.notify({
        type: "warning",
        message: "暂不支持导出规则组合模型",
      });
    }
  }
}

watch(mode, () => (xml.value = ""));
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
name: convert
</route>
