import { CommonPaginationInput } from "../../../../esl-workers/src/domain/models/CommonModel";
import {
  MessageTemplateCreateInput,
  MessageTemplateUpdateInput,
} from "../../../../esl-workers/src/domain/models/MessageModel";
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

export async function messageTemplateCreate(
  params: MessageTemplateCreateInput
) {
  try {
    const res = await trpcClient.messageTemplate.create.mutate(params);
    return res;
  } catch (e) {
    console.log(e);
    return false;
  }
}

export async function messageTemplateUpdate(
  params: MessageTemplateUpdateInput
) {
  try {
    const res = await trpcClient.messageTemplate.update.mutate(params);
    return res;
  } catch (e) {
    console.log(e);
    return false;
  }
}
