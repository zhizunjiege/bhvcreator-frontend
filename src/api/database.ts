// ruleset table struct
export type RulesetTable = {
  id: number;
  name: string;
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

// Client class used to communicate with the database
class Client {
  private addr: string;

  constructor(addr: string) {
    this.addr = `${addr}/api/db`;
  }

  public async select<T extends keyof DBTables>(
    table: T,
    columns: string[] = [],
    options: { id?: number } = {}
  ): Promise<DBTables[T][]> {
    const colArgs = columns.map((v) => `columns=${v as string}`);
    const optArgs = Object.entries(options).map(([k, v]) => `${k}=${v}`);
    const args = [...colArgs, ...optArgs].join("&");
    const response = await fetch(`${this.addr}/${table}?${args}`, {
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
    const response = await fetch(`${this.addr}/${table}`, {
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
    const response = await fetch(`${this.addr}/${table}`, {
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
    if (id < 0) {
      const rst = await this.insert(table, data as DBTables[T]);
      return {
        lastrowid: rst.lastrowid,
        rowcount: 1,
      };
    } else {
      const rst = await this.update(table, data);
      return {
        lastrowid: id,
        rowcount: rst.rowcount,
      };
    }
  }

  public async delete<T extends keyof DBTables>(
    table: T,
    ids: number[]
  ): Promise<{ rowcount: number }> {
    const response = await fetch(`${this.addr}/${table}`, {
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

// export client creator
export function createClient(addr: string) {
  const client = new Client(addr);
  return client;
}
