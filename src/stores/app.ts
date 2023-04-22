import { createClient } from "~/api";

export const useAppStore = defineStore("app", {
  state: () => ({
    systemSettings: {
      dbAddr: window.location.origin, // address of database server
    },
    client: createClient(window.location.origin), // database client
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

    setDbAddr(dbAddr: string) {
      this.systemSettings.dbAddr = dbAddr;
      this.client = createClient(dbAddr);
    },
  },
});
