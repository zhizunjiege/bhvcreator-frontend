<template>
  <q-markup-table flat separator="horizontal" class="r-table">
    <tbody>
      <tr>
        <td>名称</td>
        <td>
          <q-input
            v-model="attr.name"
            dense
            filled
            class="full-width"
            @update:model-value="update"
          />
        </td>
      </tr>
      <tr>
        <td>版本</td>
        <td>
          <q-input
            v-model="attr.version"
            dense
            filled
            class="full-width"
            @update:model-value="update"
          />
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
            v-model="attr.desc"
            dense
            filled
            autogrow
            clearable
            type="textarea"
            class="full-width"
            @update:model-value="update"
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
const emits = defineEmits<{
  (e: "update:modelValue", modelValue: RuleSetAttr): void;
}>();

const attr = computed(() => props.modelValue);

function update() {
  emits("update:modelValue", attr.value);
}
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
