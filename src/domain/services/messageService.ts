import {
  MessageCreateInput,
  MessageSendInput,
} from "../../../../esl-workers/src/domain/models/MessageModel";
import { trpcClient } from "../infras/trpcActions";

export async function messageGetAll(params: { page?: number; size?: number }) {
  try {
    const res = await trpcClient.message.getAll.query(params);
    return res;
  } catch (e) {
    console.log(e);
    return undefined;
  }
}

export async function messageSend(params: MessageSendInput) {
  try {
    const res = await trpcClient.message.send.mutate(params);
    return res;
  } catch (e) {
    console.log(e);
    return undefined;
  }
}

export async function messageCreate(params: MessageCreateInput) {
  try {
    const res = await trpcClient.message.create.mutate(params);
    return res;
  } catch (e) {
    console.log(e);
    return undefined;
  }
}
