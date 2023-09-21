import { CommonPaginationInput } from "../../../../esl-backend-workers/src/domain/models/CommonModel";
import { trpcClient } from "../infras/trpcActions";

export async function studentGetAll(params: CommonPaginationInput) {
  try {
    const response = await trpcClient.student.getAll.query(params);
    return response;
  } catch (e) {
    console.log(e);
    return null;
  }
}
