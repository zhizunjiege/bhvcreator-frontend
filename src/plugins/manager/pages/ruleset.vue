<template>
  <div class="fit flex flex-center">
    <div class="column no-wrap overflow-hidden m-cards">
      <q-card flat>
        <q-card-section horizontal class="flex justify-between items-center">
          <q-card-section class="q-py-sm m-search">
            <q-input
              v-model="filter"
              dense
              filled
              round
              debounce="500"
              placeholder="搜索"
            >
              <template #prepend>
                <q-icon name="bi-search" size="xs" />
              </template>
            </q-input>
          </q-card-section>
          <q-card-section class="q-py-sm m-button">
            <q-btn
              :disable="selected.length === 0"
              flat
              round
              size="sm"
              icon="bi-trash"
              class="float-right ui-clickable"
              @click="dropItems"
            >
              <q-tooltip anchor="top middle" self="bottom middle">
                删除
              </q-tooltip>
            </q-btn>
          </q-card-section>
        </q-card-section>
      </q-card>
      <q-separator />
      <q-card flat class="col-grow">
        <q-card-section class="q-py-sm">
          <q-table
            v-model:selected="selected"
            v-model:pagination="pagination"
            :rows="dbRows"
            :columns="dbCols"
            :filter="filter"
            flat
            hide-pagination
            hide-selected-banner
            row-key="id"
            separator="none"
            selection="multiple"
            table-class="m-table"
            class="full-height"
          >
            <template #header-selection="scope">
              <q-checkbox v-model="scope.selected" size="md" />
            </template>
            <template #body-selection="scope">
              <q-checkbox v-model="scope.selected" size="md" />
            </template>
            <template #body-cell="scope">
              <q-td :props="scope" class="ellipsis">
                {{ scope.value }}
                <q-tooltip
                  v-if="scope.value"
                  anchor="top middle"
                  self="bottom middle"
                >
                  {{ scope.value }}
                </q-tooltip>
              </q-td>
            </template>
            <template #body-cell-actions="scope">
              <q-td :props="scope">
                <q-btn
                  flat
                  round
                  size="sm"
                  icon="bi-files"
                  class="q-mx-xs ui-clickable"
                  @click="copyItem(scope.row.id)"
                >
                  <q-tooltip anchor="top middle" self="bottom middle">
                    重复
                  </q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  round
                  size="sm"
                  icon="bi-folder"
                  class="q-mx-xs ui-clickable"
                  @click="openItem(scope.row.id)"
                >
                  <q-tooltip anchor="top middle" self="bottom middle">
                    打开
                  </q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  round
                  size="sm"
                  icon="bi-cloud-download"
                  class="q-mx-xs ui-clickable"
                  @click="convItem(scope.row.id)"
                >
                  <q-tooltip anchor="top middle" self="bottom middle">
                    导出
                  </q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  round
                  size="sm"
                  icon="bi-graph-up-arrow"
                  class="q-mx-xs ui-clickable"
                  @click="optiItem(scope.row.id)"
                >
                  <q-tooltip anchor="top middle" self="bottom middle">
                    优化
                  </q-tooltip>
                </q-btn>
              </q-td>
            </template>
            <template #no-data="scope">
              <div class="flex flex-center full-width text-subtitle1">
                <q-icon :name="scope.icon" size="sm" class="q-mr-md" />
                {{ scope.message }}
              </div>
            </template>
          </q-table>
        </q-card-section>
      </q-card>
      <q-separator />
      <q-card flat>
        <q-card-section horizontal class="flex justify-between items-center">
          <q-card-section class="q-py-sm">
            已选
            <span class="text-accent">{{ selected.length }}</span>
            项
          </q-card-section>
          <q-card-section class="q-py-sm">
            <q-pagination
              v-model="pagination.page"
              input
              flat
              round
              ellipses
              boundary-links
              direction-links
              :max="Math.ceil(dbRows.length / pagination.rowsPerPage)"
              :max-pages="5"
              color="foreground"
              active-color="accent"
            />
          </q-card-section>
          <q-card-section class="q-py-sm">
            总计
            <span class="text-accent">{{ dbRows.length }}</span>
            项
          </q-card-section>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { QTableColumn } from "quasar";
import { RulesetTable, useCore } from "~/core";
import { getTimestampString } from "~/utils";

const $q = useQuasar();
const router = useRouter();
const core = useCore();

const dbTable = "ruleset";

const dbRows = ref<RulesetTable[]>([]);

const dbCols: QTableColumn[] = [
  { name: "id", label: "ID", field: "id", align: "center", sortable: true },
  { name: "name", label: "名称", field: "name", align: "center" },
  { name: "version", label: "版本", field: "version", align: "center" },
  {
    name: "create",
    label: "创建时间",
    field: "create_time",
    align: "center",
    sortable: true,
  },
  {
    name: "update",
    label: "更新时间",
    field: "update_time",
    align: "center",
    sortable: true,
  },
  { name: "desc", label: "描述", field: "description", align: "center" },
  { name: "actions", label: "操作", field: "", align: "center" },
];

const filter = ref("");

const selected = ref<RulesetTable[]>([]);

const pagination = ref({
  sortBy: "update",
  descending: true,
  page: 1,
  rowsPerPage: 12,
});

async function dropItems() {
  $q.dialog({
    title: "提示",
    message: "确认删除选择的资源？",
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    try {
      const ids = selected.value.map((item) => item.id);
      await core.delete(dbTable, ids);
      dbRows.value = dbRows.value.filter(
        (item) => !ids.find((id) => id === item.id)
      );
      selected.value.splice(0);
      $q.notify({
        type: "positive",
        message: "删除成功",
      });
    } catch (e) {
      $q.notify({
        type: "negative",
        message: "删除失败：" + e,
      });
      console.error(e);
    }
  });
}

async function copyItem(id: number) {
  try {
    const [item] = await core.select(dbTable, [], { id });
    item.id = 0;
    item.name = `${item.name}-副本`;
    const { lastrowid } = await core.insert(dbTable, item);
    item.id = lastrowid;
    item.create_time = getTimestampString();
    item.update_time = getTimestampString();
    dbRows.value.unshift(item);
    $q.notify({
      type: "positive",
      message: "重复成功",
    });
  } catch (e) {
    $q.notify({
      type: "negative",
      message: "重复失败：" + e,
    });
    console.error(e);
  }
}

function openItem(id: number) {
  router.push({
    name: "ruleset",
    query: { id },
  });
}

function convItem(id: number) {
  router.push({
    name: "convert",
    query: { id },
  });
}

function optiItem(id: number) {
  router.push({
    name: "optimize",
    query: { id },
  });
}

(async () => {
  dbRows.value = await core.select(dbTable, [
    "id",
    "name",
    "version",
    "description",
    "create_time",
    "update_time",
  ]);
})();
</script>

<style scoped lang="scss">
.m-cards {
  width: 95%;
  height: 90%;
}
.m-search {
  width: 24%;
}
.m-button {
  width: 8%;
  min-width: 10rem;
}
:deep(.m-table) {
  th {
    font-size: 1rem !important;
  }
  td {
    max-width: 20rem;
    font-size: 0.875rem !important;
  }
}
</style>
