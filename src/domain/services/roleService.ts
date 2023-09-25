import { CommonPaginationInput } from "../../../../esl-backend-workers/src/domain/models/CommonModel";
import { trpcClient } from "../infras/trpcActions";

export async function roleGet(params: { roleId: number }) {
  try {
    const res = await trpcClient.role.get.query(params);
    return res;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function roleGetAll(params: CommonPaginationInput) {
  try {
    const res = await trpcClient.role.getAll.query(params);
    return res;
  } catch (e) {
    console.log(e);
    return null;
  }
}
