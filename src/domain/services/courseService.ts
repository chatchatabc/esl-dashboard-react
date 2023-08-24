import { CoursePagination } from "../../../../esl-workers/src/domain/models/CourseModel";
import { trpcClient } from "../infras/trpcActions";

export async function courseGetAll(params: CoursePagination) {
  try {
    const res = await trpcClient.course.getAll.query(params);

    return res;
  } catch (e) {
    console.log(e);
    return null;
  }
}
