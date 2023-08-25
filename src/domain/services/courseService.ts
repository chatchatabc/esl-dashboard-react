import {
  CourseCreateInput,
  CoursePagination,
  CourseUpdateInput,
} from "../../../../esl-workers/src/domain/models/CourseModel";
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

export async function courseCreate(params: CourseCreateInput) {
  try {
    const res = await trpcClient.course.create.mutate(params);
    return res;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function courseUpdate(params: CourseUpdateInput) {
  try {
    const res = await trpcClient.course.update.mutate(params);
    return res;
  } catch (e) {
    console.log(e);
    return null;
  }
}
