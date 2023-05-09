<template>
  <div ref="container" class="fit" />
</template>
<script setup lang="ts">
import * as monaco from "monaco-editor";

const props = withDefaults(
  defineProps<{
    modelValue: string;
    language: string;
    readonly?: boolean;
  }>(),
  {
    readonly: false,
  }
);
const emits = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const container = ref(null as Nullable<HTMLElement>);

let editor = null as Nullable<monaco.editor.IStandaloneCodeEditor>;

const $q = useQuasar();

onMounted(() => {
  editor = monaco.editor.create(container.value!, {
    value: props.modelValue,
    readOnly: props.readonly,
    language: props.language,
    automaticLayout: true,
  });
  watch(
    () => props.modelValue,
    () => {
      editor!.setValue(props.modelValue);
    }
  );
  watch(
    () => $q.dark.isActive,
    (v) => {
      monaco.editor.setTheme(v ? "vs-dark" : "vs");
    },
    {
      immediate: true,
    }
  );
  editor.onDidBlurEditorText(() => {
    emits("update:modelValue", editor!.getValue());
  });
});
onUnmounted(() => {
  editor!.dispose();
});
</script>
<style scoped lang="scss"></style>
