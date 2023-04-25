export const useAppStore = defineStore("app", {
  state: () => ({
    systemSettings: {},
  }),
  actions: {
    loadSystemSettings() {
      const jsonStr = localStorage.getItem("systemSettings");
      if (jsonStr) {
        this.systemSettings = JSON.parse(jsonStr);
      }
    },
    saveSystemSettings() {
      localStorage.setItem(
        "systemSettings",
        JSON.stringify(this.systemSettings)
      );
    },
  },
});
