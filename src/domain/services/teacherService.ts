import { CommonPaginationInput } from "../../../../esl-backend-workers/src/domain/models/CommonModel";
import {
  TeacherCreateInput,
  TeacherUpdateInput,
} from "../../../../esl-backend-workers/src/domain/models/TeacherModel";
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

export async function teacherGet(params: {
  teacherId?: number;
  userId?: number;
  userUsername?: string;
}) {
  try {
    const res = await trpcClient.teacher.get.query(params);

    return res;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export function teacherOptionStatus() {
  return [
    {
      value: 1,
      label: "Active",
    },
    {
      value: 0,
      label: "Inactive",
    },
  ];
}

export async function teacherCreate(params: TeacherCreateInput) {
  try {
    const res = await trpcClient.teacher.create.query(params);
    return res;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function teacherUpdate(params: TeacherUpdateInput) {
  try {
    const res = await trpcClient.teacher.update.mutate(params);
    return res;
  } catch (e) {
    console.log(e);
    return null;
  }
}
