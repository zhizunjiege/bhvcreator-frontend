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
    minimap?: boolean;
  }>(),
  {
    readonly: false,
    minimap: false,
  }
);
const emits = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const container = ref<Nullable<HTMLElement>>(null);

let editor: Nullable<monaco.editor.IStandaloneCodeEditor> = null;

defineExpose({
  editor: computed(() => editor!),
});

const $q = useQuasar();

onMounted(() => {
  editor = monaco.editor.create(container.value!, {
    value: props.modelValue,
    readOnly: props.readonly,
    language: props.language,
    automaticLayout: true,
    minimap: {
      enabled: props.minimap,
    },
  });
  watch(
    () => $q.dark.isActive,
    (v) => {
      monaco.editor.setTheme(v ? "dark" : "light");
    },
    {
      immediate: true,
    }
  );
  watch(
    () => props.modelValue,
    () => {
      editor!.setValue(props.modelValue);
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
