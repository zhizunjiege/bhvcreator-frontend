function loadXML(xmlString: string) {
  if (window.DOMParser && document.implementation) {
    try {
      const domParser = new DOMParser();
      const xmlDoc = domParser.parseFromString(xmlString, "text/xml");
      return xmlDoc;
    } catch (e) {
      throw new Error("解析 XML 文件失败：" + e);
    }
  } else {
    throw new Error("浏览器不支持 XML 解析");
  }
}

function handleForceSides(forceSides: Element) {
  const forceSideElements = forceSides.getElementsByTagName("ForceSide");
  return Array.from(forceSideElements).map((item) => {
    let units: string[];

    const unitsElements = item.getElementsByTagName("Units");
    if (unitsElements.length > 0) {
      const unitElements = unitsElements[0].getElementsByTagName("Unit");
      units = Array.from(unitElements).map(
        (item) => item.getAttribute("id") ?? ""
      );
    } else {
      units = [];
    }

    return {
      id: item.getAttribute("id") ?? "",
      name: item.getAttribute("name") ?? "",
      color: item.getAttribute("color") ?? "",
      units,
    };
  });
}

function handleEntities(entities: Element) {
  const entityElements = entities.getElementsByTagName("Entity");
  return Array.from(entityElements).map((item) => {
    const parametersElement = item.getElementsByTagName("Parameters")[0];
    const parameterElements =
      parametersElement.getElementsByTagName("Parameter");

    const parameters = Array.from(parameterElements).map((item) => {
      return {
        name: item.getAttribute("name") ?? "",
        displayName: item.getAttribute("displayName") ?? "",
        type: item.getAttribute("type") ?? "",
        usage: item.getAttribute("usage") ?? "",
        value: item.getAttribute("value") ?? "",
      };
    });
    return {
      id: item.getAttribute("id") ?? "",
      modelID: item.getAttribute("modelID") ?? "",
      name: item.getAttribute("entityName") ?? "",
      displayName: item.getAttribute("modelDisplayName") ?? "",
      parameters,
    };
  });
}

export function scenarioXml2Obj(base64String: string) {
  try {
    const xmlDoc = loadXML(
      decodeURIComponent(window.escape(window.atob(base64String)))
    );

    const scenarioInfo = xmlDoc.getElementsByTagName("ScenarioInfo")[0];
    const scenarioName = scenarioInfo.getElementsByTagName("Name")[0];
    const scenarioDescription =
      scenarioInfo.getElementsByTagName("Description")[0];

    const forceSides = scenarioInfo.getElementsByTagName("ForceSides")[0];
    const entities = scenarioInfo.getElementsByTagName("Entities")[0];

    const forceSidesResult = handleForceSides(forceSides);
    const entitiesResult = handleEntities(entities);
    return {
      name: scenarioName?.innerHTML ?? "",
      description: scenarioDescription?.innerHTML ?? "",
      forceSides: forceSidesResult,
      entities: entitiesResult,
    };
  } catch (e) {
    throw new Error("解析仿真想定失败：" + e);
  }
}
