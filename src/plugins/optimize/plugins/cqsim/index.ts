import { GrpcWebFetchTransport } from "@protobuf-ts/grpcweb-transport";
import { OptimizeChildPlugin } from "../../core";
import {
  ISimControllerClient,
  SimControllerClient,
  EngineNodeState_State,
  ControlCmd_RunCmdType,
  setModelDependency,
  addSimData,
  getSimData,
  downloadSimData,
  EntityFields,
} from "./api";

export interface CQSIMOptimizeOptions {
  ctrlAddr: string;
  dataAddr: string;
  resAddr: string;
  xToken: string;
  modelId: string;
  scenarioId: number;
  expDesignId: number;
  expSampleSize: number;
  repeatTimes: number;
  simDuration: number;
  timeStep: number;
  speedRatio: number;
  modelFields: EntityFields[];
}

export class CQSIMOptimizePlugin implements OptimizeChildPlugin {
  public name = "CQSIM";
  public version = "1.0";

  private client: Nullable<SimControllerClient> = null;
  private sysinfo: Nullable<ReturnType<ISimControllerClient["getSysInfo"]>> =
    null;

  public async result(ruleset: string, options: CQSIMOptimizeOptions) {
    if (!this.client || !this.sysinfo) {
      const transport = new GrpcWebFetchTransport({
        baseUrl: `http://${options.ctrlAddr}`,
      });
      this.client = new SimControllerClient(transport);
      this.sysinfo = this.client.getSysInfo({});
    }

    const dataId = await addSimData(
      options.resAddr,
      options.xToken,
      options.scenarioId
    );

    await setModelDependency(options.resAddr, options.xToken, options.modelId, [
      {
        name: "rule.xml",
        type: "text/xml",
        file: ruleset,
      },
    ]);

    for (let c = 0; c < options.repeatTimes; c++) {
      await this.client.setHttpInfo({ token: options.xToken });

      if (options.expDesignId > 0) {
        await this.client.init({
          initInfo: {
            oneofKind: "multiSampleConfig",
            multiSampleConfig: {
              expDesignId: BigInt(options.expDesignId),
              nodes: [],
            },
          },
        });
      } else {
        await this.client.init({
          initInfo: {
            oneofKind: "oneSampleConfig",
            oneSampleConfig: {
              taskId: BigInt(options.scenarioId),
              nodes: [],
            },
          },
        });
      }
      await this.client.control({
        cmd: {
          oneofKind: "simStartTime",
          simStartTime: {
            seconds: BigInt(Math.floor(Date.now() / 1000)),
            nanos: 0,
          },
        },
      });
      await this.client.control({
        cmd: {
          oneofKind: "simDuration",
          simDuration: {
            seconds: BigInt(Math.floor(options.simDuration)),
            nanos: 0,
          },
        },
      });
      await this.client.control({
        cmd: {
          oneofKind: "timeStep",
          timeStep: options.timeStep,
        },
      });
      await this.client.control({
        cmd: {
          oneofKind: "speedRatio",
          speedRatio: options.speedRatio,
        },
      });
      await this.client.control({
        cmd: {
          oneofKind: "runCmd",
          runCmd: ControlCmd_RunCmdType.START,
        },
      });

      let prevState: Nullable<EngineNodeState_State> = null;
      let nextState: Nullable<EngineNodeState_State> = null;
      for await (const message of this.sysinfo!.responses) {
        nextState = message.nodeState[0].state;
        if (
          nextState === EngineNodeState_State.STOPPED &&
          nextState !== prevState &&
          prevState !== null &&
          (options.expDesignId <= 0 ||
            message.currentSampleId === options.expSampleSize - 1)
        ) {
          break;
        }
        prevState = nextState;
      }
    }

    const data: Awaited<ReturnType<typeof downloadSimData>>[] = [];
    const nums =
      (options.expDesignId > 0 ? options.expSampleSize : 1) *
      options.repeatTimes;
    for (let i = 1; i <= nums; i++) {
      const table = await getSimData(
        options.resAddr,
        options.xToken,
        dataId + i
      );
      data.push(
        await downloadSimData(
          options.dataAddr,
          table,
          Math.floor(options.simDuration * 1000),
          Math.floor((options.simDuration * 1000) / options.timeStep),
          options.modelFields
        )
      );
    }

    console.log(data);

    return data;
  }
}
