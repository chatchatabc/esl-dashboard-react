import { trpcClient } from "../infras/trpcActions";
import { CreditAddInput } from "../../../../esl-workers/src/domain/models/CreditModel";

export async function creditAdd(params: CreditAddInput) {
  try {
    const res = await trpcClient.credit.add.mutate(params);
    return res;
  } catch (e) {
    console.log(e);
    return false;
  }
}
