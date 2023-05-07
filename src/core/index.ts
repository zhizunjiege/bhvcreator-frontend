import { App } from "vue";

// ruleset table struct
export type RulesetTable = {
  id: number;
  name: string;
  version: string;
  description: string;
  create_time?: string;
  update_time?: string;
  mode: string;
  xml: string;
};

// compose table struct
export type ComposeTable = {
  id: number;
  name: string;
  version: string;
  description: string;
  create_time?: string;
  update_time?: string;
  ruleset: number;
  type: string;
  xml: string;
};

// database tables full structs
export type DBTables = {
  ruleset: RulesetTable;
  compose: ComposeTable;
};

// plugin interface
export interface Plugin {
  name: string;
  version: string;
  description: string;

  menu?: {
    label: string;
    to: string;
    items?: {
      label: string;
      to: string;
    }[];
  };
}

// core class
export class Core {
  private addr = "/api";

  public plugins = {} as {
    [key: string]: Plugin;
  };

  public provide(name: string, plugin: Plugin) {
    this.plugins[name] = plugin;
  }

  public inject(name: string) {
    if (!this.plugins[name]) {
      throw new Error(`Plugin ${name} not installed`);
    }
    return this.plugins[name];
  }

  public async select<T extends keyof DBTables>(
    table: T,
    columns: string[] = [],
    options: { id?: number } = {}
  ): Promise<DBTables[T][]> {
    const colArgs = columns.map((v) => `columns=${v as string}`);
    const optArgs = Object.entries(options).map(([k, v]) => `${k}=${v}`);
    const args = [...colArgs, ...optArgs].join("&");
    const response = await fetch(`${this.addr}/db/${table}?${args}`, {
      method: "GET",
    });
    if (response.ok) {
      const rows = (await response.json()) as DBTables[T][];
      return rows;
    } else {
      throw new Error(response.statusText);
    }
  }

  public async insert<T extends keyof DBTables>(
    table: T,
    data: DBTables[T]
  ): Promise<{ lastrowid: number }> {
    const row = { ...data } as DBTables[T];
    const response = await fetch(`${this.addr}/db/${table}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(row),
    });
    if (response.ok) {
      return response.json();
    } else {
      throw new Error(response.statusText);
    }
  }

  public async update<T extends keyof DBTables>(
    table: T,
    data: Partial<DBTables[T]>
  ): Promise<{ rowcount: number }> {
    const row = { ...data } as DBTables[T];
    const response = await fetch(`${this.addr}/db/${table}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(row),
    });
    if (response.ok) {
      return response.json();
    } else {
      throw new Error(response.statusText);
    }
  }

  public async replace<T extends keyof DBTables>(
    table: T,
    data: Partial<DBTables[T]>
  ): Promise<{ lastrowid: number; rowcount: number }> {
    const id = data.id ?? -1;
    if (id > 0) {
      const rst = await this.update(table, data);
      return {
        lastrowid: id,
        rowcount: rst.rowcount,
      };
    } else {
      const rst = await this.insert(table, data as DBTables[T]);
      return {
        lastrowid: rst.lastrowid,
        rowcount: 1,
      };
    }
  }

  public async delete<T extends keyof DBTables>(
    table: T,
    ids: number[]
  ): Promise<{ rowcount: number }> {
    const response = await fetch(`${this.addr}/db/${table}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ids }),
    });
    if (response.ok) {
      return response.json();
    } else {
      throw new Error(response.statusText);
    }
  }
}

// core
let activeCore: Nullable<Core> = null;

const coreSymbol = Symbol("core");

export function createCore(
  options: {
    plugins?: {
      install(core: Core): void;
    }[];
  } = {}
) {
  const core = new Core();
  if (options.plugins) {
    for (const plugin of options.plugins) {
      plugin.install(core);
    }
  }
  return markRaw({
    install(app: App) {
      activeCore = core;
      app.provide(coreSymbol, core);
      app.config.globalProperties.$core = core;
    },
  });
}

export function useCore() {
  const core: Nullable<Core> =
    (getCurrentInstance() && inject(coreSymbol)) || activeCore;
  if (!core) {
    throw new Error("Core not installed");
  }
  activeCore = core;
  return core;
}
