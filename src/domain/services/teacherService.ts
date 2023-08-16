import { CommonPaginationInput } from "../../../../esl-workers/src/domain/models/CommonModel";
import { trpcClient } from "../infras/trpcActions";

export async function teacherGetAll(params: CommonPaginationInput) {
  try {
    const res = await trpcClient.teacher.getAll.query(params);
    return res;
  } catch (e) {
    console.log(e);
    return null;
  }
}
