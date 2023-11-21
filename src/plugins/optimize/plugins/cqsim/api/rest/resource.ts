export async function getScenarioList(addr: string, token: string) {
  const res = await fetch(`http://${addr}/api/scenario/search`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": token,
    },
    body: JSON.stringify({
      types: [0],
      pageNum: 0,
      pageSize: 0,
    }),
  });
  const data = await res.json();
  return data.data.list as {
    id: number;
    name: string;
  }[];
}

export async function getExpDesignList(addr: string, token: string) {
  const res = await fetch(`http://${addr}/api/design/search`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": token,
    },
    body: JSON.stringify({
      pageNum: 0,
      pageSize: 0,
    }),
  });
  const data = await res.json();
  return data.data.list as {
    id: number;
    scenarioId: number;
    name: string;
    sampleSize: number;
  }[];
}

export async function getScenarioFile(addr: string, token: string, id: number) {
  const res = await fetch(`http://${addr}/api/scenario/unpack`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": token,
    },
    body: JSON.stringify({
      id,
      types: [1],
    }),
  });
  const data = await res.json();
  return data.data.scenarioFile as string;
}

export async function getModelDependency(
  addr: string,
  token: string,
  modelid: string
) {
  const res = await fetch(`http://${addr}/api/model/unpack`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": token,
    },
    body: JSON.stringify({
      ids: [modelid],
      types: [3],
    }),
  });
  const data = await res.json();
  const binary = atob(data.data[0].dependencyFile);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new Blob([bytes], { type: "application/zip" });
}

export async function setModelDependency(
  addr: string,
  token: string,
  modelid: string,
  dependencies: { name: string; type: string; file: string }[] = []
) {
  const formData = new FormData();
  for (const dep of dependencies) {
    const blob = new Blob([dep.file], { type: dep.type });
    formData.append("dependencyFile", blob, dep.name);
  }
  await fetch(`http://${addr}/api/model/${modelid}`, {
    method: "PUT",
    headers: {
      "x-token": token,
    },
    body: formData,
  });
}
