import { CommonPaginationInput } from "../../../../esl-backend-workers/src/domain/models/CommonModel";
import {
  ScheduleCreateInput,
  ScheduleUpdateInput,
} from "../../../../esl-backend-workers/src/domain/models/ScheduleModel";
import { trpcClient } from "../infras/trpcActions";

export async function scheduleGetAll(params: CommonPaginationInput) {
  try {
    const res = await trpcClient.schedule.getAll.query({
      ...params,
      page: 1,
      size: 10000,
    });
    return res;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function scheduleUpdateMany(params: {
  schedules: ScheduleUpdateInput[];
  teacherId: number;
}) {
  try {
    const response = await trpcClient.schedule.updateManyAdmin.mutate(params);
    return response;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function scheduleCreateMany(params: {
  teacherId: number;
  schedules: ScheduleCreateInput[];
}) {
  try {
    const response = await trpcClient.schedule.createManyAdmin.mutate(params);
    return response;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function scheduleDeleteMany(params: {
  scheduleIds: number[];
  teacherId: number;
}) {
  try {
    const response = await trpcClient.schedule.deleteManyAdmin.mutate(params);
    return response;
  } catch (e) {
    console.log(e);
    return null;
  }
}
