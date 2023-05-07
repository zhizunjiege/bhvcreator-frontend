<template>
  <div class="fit flex flex-center">
    <div class="column no-wrap overflow-hidden m-cards">
      <q-card flat>
        <q-card-section horizontal class="flex justify-between items-center">
          <q-card-section class="q-py-sm m-select">
            <q-select
              v-model="selectedTable"
              :options="[
                {
                  label: '规则集',
                  value: 'ruleset',
                },
                {
                  label: '规则组合',
                  value: 'compose',
                },
              ]"
              dense
              filled
              emit-value
              map-options
              options-dense
              hide-dropdown-icon
              class="full-width"
            />
          </q-card-section>
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
              :disable="selectedItems.length === 0"
              flat
              round
              size="sm"
              icon="bi-trash"
              class="float-right"
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
            v-model:selected="selectedItems"
            v-model:pagination="pagination"
            :rows="rows[selectedTable]"
            :columns="columns[selectedTable]"
            :filter="filter"
            flat
            hide-pagination
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
                <q-tooltip anchor="top middle" self="bottom middle">
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
                  icon="bi-folder"
                  class="q-mx-sm"
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
                  icon="bi-files"
                  class="q-mx-sm"
                  @click="copyItem(scope.row.id)"
                >
                  <q-tooltip anchor="top middle" self="bottom middle">
                    重复
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
            <span class="text-accent">{{ selectedItems.length }}</span>
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
              :max="
                Math.ceil(rows[selectedTable].length / pagination.rowsPerPage)
              "
              :max-pages="5"
              color="foreground"
              active-color="accent"
            />
          </q-card-section>
          <q-card-section class="q-py-sm">
            总计
            <span class="text-accent">{{ rows[selectedTable].length }}</span>
            项
          </q-card-section>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { QTableProps } from "quasar";
import { DBTables, useCore } from "~/core";
import { getTimestampString } from "~/utils";

const $q = useQuasar();
const router = useRouter();
const core = useCore();

type Table = keyof DBTables;

const rows = ref({
  ruleset: [],
  compose: [],
} as {
  [key in Table]: DBTables[key][];
});

const columns = {
  ruleset: [
    {
      name: "id",
      label: "ID",
      field: "id",
      align: "center",
      sortable: true,
    },
    { name: "name", label: "名称", field: "name", align: "center" },
    { name: "version", label: "版本", field: "version", align: "center" },
    { name: "mode", label: "推理模式", field: "mode", align: "center" },
    {
      name: "createTime",
      label: "创建时间",
      field: "create_time",
      align: "center",
      sortable: true,
    },
    {
      name: "updateTime",
      label: "更新时间",
      field: "update_time",
      align: "center",
      sortable: true,
    },
    {
      name: "description",
      label: "描述",
      field: "description",
      align: "center",
    },
    { name: "actions", label: "操作", field: "", align: "center" },
  ],
  compose: [
    {
      name: "id",
      label: "ID",
      field: "id",
      align: "center",
      sortable: true,
    },
    { name: "name", label: "名称", field: "name", align: "center" },
    {
      name: "version",
      label: "版本",
      field: "version",
      align: "center",
    },
    { name: "type", label: "组合类型", field: "type", align: "center" },
    {
      name: "ruleset",
      label: "关联规则集ID",
      field: "ruleset",
      align: "center",
      sortable: true,
    },
    {
      name: "createTime",
      label: "创建时间",
      field: "create_time",
      align: "center",
      sortable: true,
    },
    {
      name: "updateTime",
      label: "更新时间",
      field: "update_time",
      align: "center",
      sortable: true,
    },
    {
      name: "description",
      label: "描述",
      field: "description",
      align: "center",
    },
    { name: "actions", label: "操作", field: "", align: "center" },
  ],
} as {
  [key in Table]: QTableProps["columns"];
};

const filter = ref("");

const pagination = ref({
  sortBy: "updateTime",
  descending: true,
  page: 1,
  rowsPerPage: 12,
});

const selectedTable = ref("ruleset" as keyof typeof rows.value);

const selectedItems = ref([] as DBTables[Table][]);

function openItem(id: number) {
  router.push({
    name: selectedTable.value,
    query: { id },
  });
}

async function copyItem(id: number) {
  try {
    const [item] = await core.select(selectedTable.value, [], { id });
    item.id = 0;
    item.name = `${item.name}-副本`;
    const { lastrowid } = await core.insert(selectedTable.value, item);
    item.id = lastrowid;
    item.create_time = getTimestampString();
    item.update_time = getTimestampString();
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    rows.value[selectedTable.value].unshift(item as any);
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

async function dropItems() {
  $q.dialog({
    title: "提示",
    message: "确认删除选择的资源？",
    cancel: true,
    persistent: true,
    class: "bg-primary",
  }).onOk(async () => {
    try {
      const ids = selectedItems.value.map((item) => item.id);
      await core.delete(selectedTable.value, ids);
      /* eslint-disable @typescript-eslint/no-explicit-any */
      rows.value[selectedTable.value] = (
        rows.value[selectedTable.value] as any[]
      ).filter((item) => !ids.find((id) => id === item.id));
      /* eslint-enable @typescript-eslint/no-explicit-any */
      selectedItems.value.splice(0);
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

(async () => {
  rows.value.ruleset = await core.select(
    "ruleset",
    [
      "id",
      "name",
      "version",
      "description",
      "create_time",
      "update_time",
      "mode",
    ],
    {}
  );
  rows.value.compose = await core.select(
    "compose",
    [
      "id",
      "name",
      "version",
      "description",
      "create_time",
      "update_time",
      "ruleset",
      "type",
    ],
    {}
  );
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
.m-select,
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
