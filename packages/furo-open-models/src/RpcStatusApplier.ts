import { FieldNode, ValueStateSummary } from './FieldNode';
import { ValueState } from './ValueState';
import { IAny } from './index';

export interface IStatus {
  error: string;
  message: string;
  code: number;
  details: IAny[];
}

export class RpcStatusApplier {
  public static apply(target: FieldNode, status: IStatus) {
    if (status === undefined || status.details === undefined) {
      return;
    }
    target.__clearAllValueStates();

    const localizedMessage = status.details.filter(lm =>
      lm['@type'].includes('/google.rpc.LocalizedMessage'),
    )[0];
    if (localizedMessage) {
      target.__setValueState(ValueState.Error, [
        localizedMessage.message as string,
      ]);
    }
    const badRequest = status.details.filter(lm =>
      lm['@type'].includes('/google.rpc.BadRequest'),
    )[0];
    if (badRequest) {
      const v = (badRequest.fieldViolations as unknown[]).map(violation => ({
        field: (violation as Record<string, string>).field,
        state: ValueState.Error,
        message: (violation as Record<string, string>).description,
      })) as ValueStateSummary[];

      target.__applyValueStates(...v);
    }
  }
}
