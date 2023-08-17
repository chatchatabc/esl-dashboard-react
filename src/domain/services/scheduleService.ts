import {
  Schedule,
  ScheduleCreateInput,
  ScheduleUpdateInput,
} from "../../../../esl-workers/src/domain/models/ScheduleModel";
import { trpcClient } from "../infras/trpcActions";

export async function scheduleGetAll(params: { userId: number }) {
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
  userId: number;
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
  userId: number;
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
  schedules: Schedule[];
  userId: number;
}) {
  try {
    const response = await trpcClient.schedule.deleteManyAdmin.mutate(params);
    return response;
  } catch (e) {
    console.log(e);
    return null;
  }
}
