import {
  MessageCreateInput,
  MessageSendInput,
  MessageUpdateInput,
} from "../../../../esl-backend-workers/src/domain/models/MessageModel";
import { trpcClient } from "../infras/trpcActions";

export async function messageGetAll(params: { page?: number; size?: number }) {
  try {
    const res = await trpcClient.message.getAll.query(params);

    if (res) {
      const contentPromise = res.content.map(async (message) => {
        if (message.userId) {
          message.user = await trpcClient.user.get.query({
            userId: message.userId,
          });
        }

        message.messageTemplate = await trpcClient.messageTemplate.get.query({
          messageTemplateId: message.messageTemplateId,
        });

        return message;
      });
      res.content = await Promise.all(contentPromise);
    }

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

export async function messageUpdate(params: MessageUpdateInput) {
  try {
    const res = await trpcClient.message.update.mutate(params);
    return res;
  } catch (e) {
    console.log(e);
    return undefined;
  }
}
