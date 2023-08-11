import { CommonPaginationInput } from "../../../../esl-workers/src/domain/models/CommonModel";
import { trpcClient } from "../infras/trpcActions";

export async function messageTemplateGetAll(params: CommonPaginationInput) {
  try {
    const res = await trpcClient.messageTemplate.getAll.query(params);
    return res;
  } catch (e) {
    console.log(e);
    return undefined;
  }
}
