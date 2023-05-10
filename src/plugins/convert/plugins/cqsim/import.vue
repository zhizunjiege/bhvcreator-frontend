<template>
  <q-scroll-area class="fit">
    <!-- <q-markup-table flat separator="horizontal" class="cq-table">
      <tbody>
        <tr>
          <td>推理模式</td>
          <td>
            <q-select
              v-model="options.mode"
              :options="modeOptions"
              dense
              filled
              emit-value
              map-options
              options-dense
              hide-dropdown-icon
              class="full-width"
              @update:model-value="update"
            />
          </td>
        </tr>
      </tbody>
    </q-markup-table> -->
  </q-scroll-area>
</template>

<script setup lang="ts">
/* const props = defineProps<{
  modelValue: {
    mode: string;
  };
}>();
const emits = defineEmits<{
  (e: "update:modelValue", options: object): void;
}>();

const options = computed(() => props.modelValue);

const modeOptions = ["normal"];
options.value.mode = modeOptions[0];

function update() {
  emits("update:modelValue", options.value);
} */
</script>

<style scoped lang="scss">
/* .cq-table {
  :deep(table) {
    table-layout: fixed;
    th,
    td {
      font-size: 0.875rem !important;
      padding: 0.5rem 1.5rem !important;
      border-color: var(--ui-secondary) !important;
    }
  }
} */
</style>
