<template>
  <q-markup-table flat separator="horizontal" class="r-table">
    <tbody>
      <tr>
        <td>名称</td>
        <td>
          <q-input v-model="attr.name" dense filled class="full-width" />
        </td>
      </tr>
      <tr>
        <td>版本</td>
        <td>
          <q-input v-model="attr.version" dense filled class="full-width" />
        </td>
      </tr>
      <tr>
        <td>创建时间</td>
        <td>
          <q-input
            v-model="attr.createTime"
            dense
            filled
            disable
            class="full-width"
          />
        </td>
      </tr>
      <tr>
        <td>修改时间</td>
        <td>
          <q-input
            v-model="attr.updateTime"
            dense
            filled
            disable
            class="full-width"
          />
        </td>
      </tr>
      <tr>
        <td>详细描述</td>
        <td>
          <q-input
            v-model="attr.description"
            dense
            filled
            autogrow
            clearable
            type="textarea"
            class="full-width"
          />
        </td>
      </tr>
    </tbody>
  </q-markup-table>
</template>

<script setup lang="ts">
import { RuleSetAttr } from "../../stores";

const props = defineProps<{
  modelValue: RuleSetAttr;
}>();

const attr = computed(() => props.modelValue);
</script>

<style scoped lang="scss">
.r-table {
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
