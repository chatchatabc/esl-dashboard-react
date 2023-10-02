import { CommonPaginationInput } from "../../../../esl-backend-workers/src/domain/models/CommonModel";
import { StudentCreateInput } from "../../../../esl-backend-workers/src/domain/models/StudentModel";
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

export async function studentGetByUser(params: {
  userUsername?: string;
  userId?: number;
}) {
  try {
    const response = await trpcClient.student.getByUser.query(params);
    return response;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function studentCreate(params: StudentCreateInput) {
  try {
    const response = await trpcClient.student.create.mutate(params);
    return response;
  } catch (e) {
    console.log(e);
    return null;
  }
}
