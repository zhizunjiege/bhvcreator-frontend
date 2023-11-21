export async function addSimData(
  addr: string,
  token: string,
  scenarioId: number
) {
  const res = await fetch(`http://${addr}/api/simData`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": token,
    },
    body: JSON.stringify({
      type: 1,
      scenarioId,
      dataTableName: "auto",
      realSimDuration: "0s",
      simDuration: "0s",
      simStartTime: "1970-01-01 08:00:00",
    }),
  });
  const data = await res.json();
  return data.data as number;
}

export async function getSimData(addr: string, token: string, dataId: number) {
  const res = await fetch(`http://${addr}/api/simData/${dataId}`, {
    method: "GET",
    headers: { "x-token": token },
  });
  const data = await res.json();
  return data.data.dataTableName as string;
}

export interface EntityFields {
  id: string;
  outputs: string[];
}

export async function downloadSimData(
  addr: string,
  tableName: string,
  endTime: number,
  pageSize: number,
  modelFields: EntityFields[]
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: Record<string, Record<string, any>[]> = {};
  for (const entity of modelFields) {
    const res = await fetch(`http://${addr}/api/sampleExport/download`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tableName,
        type: "json",
        startTime: 0,
        endTime,
        pageNum: 1,
        pageSize,
        modelFileds: {
          [entity.id]: entity.outputs,
        },
      }),
    });
    data[entity.id] = await res.json();
  }
  return data;
}
