import { FieldNode, type ValueStateSummary } from "./FieldNode";
import type { IAny } from "./index";
import { ValueState } from "./ValueState";

export interface IStatus {
  error: string;
  message: string;
  code: number;
  details: IAny[];
}

// eslint-disable-next-line @typescript-eslint/no-extraneous-class -- converting to functions changes public API
export class RpcStatusApplier {
  public static apply(target: FieldNode, status: IStatus) {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- runtime data may not match types (REST API input)
    if (status?.details === undefined) {
      return;
    }
    target.__clearAllValueStates();

    const localizedMessage = status.details.find(lm => lm["@type"].includes("/google.rpc.LocalizedMessage"));
    if (localizedMessage) {
      target.__setValueState(ValueState.Negative, [localizedMessage.message as string]);
    }
    const badRequest = status.details.find(lm => lm["@type"].includes("/google.rpc.BadRequest"));
    if (badRequest) {
      const v = (badRequest.fieldViolations as unknown[]).map(violation => ({
        field: (violation as Record<string, string>).field,
        state: ValueState.Negative,
        message: (violation as Record<string, string>).description,
      })) as ValueStateSummary[];

      target.__applyValueStates(...v);
    }
  }
}
