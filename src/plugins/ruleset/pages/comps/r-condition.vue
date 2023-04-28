<template>
  <q-input
    :model-value="displayText"
    dense
    borderless
    readonly
    @click="dialogShow = true"
  />
  <q-dialog v-model="dialogShow" class="r-dialog">
    <q-card flat class="q-mx-auto r-card">
      <q-card-section class="text-center text-subtitle1">
        基本信息
      </q-card-section>
      <q-card-section>
        <q-markup-table flat separator="horizontal" class="r-table">
          <tbody>
            <tr>
              <td>合并方式</td>
              <td>
                <q-select
                  v-model="condition.join"
                  dense
                  standout="bg-secondary"
                  input-class="text-foreground"
                  class="r-input"
                  options-dense
                  map-options
                  :options-dense-label="false"
                  :options="[
                    { label: '与', value: 'and' },
                    { label: '或', value: 'or' },
                  ]"
                />
              </td>
            </tr>
            <tr v-for="(e, i) in condition.expressions" :key="i">
              <td>条件文字</td>
              <td>
                <q-input
                  v-model="condition.expressions[i]"
                  dense
                  standout="bg-secondary"
                  input-class="text-foreground"
                  class="r-input"
                />
              </td>
            </tr>
          </tbody>
        </q-markup-table>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { Condition } from "../..";

const props = defineProps<{
  modelValue: Condition;
}>();
const emits = defineEmits<{
  (e: "update:modelValue", modelValue: Condition): void;
}>();

const condition = computed(() => props.modelValue);

const joinSymbols = { and: "&&", or: "||" };
const displayText = computed(() => {
  return condition.value.expressions
    .map((e) => `(${e})`)
    .join(` ${joinSymbols[condition.value.join]} `);
});

const dialogShow = ref(false);

function update() {
  emits("update:modelValue", condition.value);
}
</script>

<style scoped lang="scss">
.r-dialog {
  left: 15%;
}
:deep(.r-card) {
  width: 75%;
  .r-table {
    :deep(table) {
      table-layout: fixed;
      th,
      td {
        font-size: 0.875rem !important;
        padding: 0.5rem 1.5rem !important;
        border-color: var(--ui-secondary) !important;
        .r-input {
          float: right;
          width: 75%;
        }
      }
    }
  }
}
</style>
