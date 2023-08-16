import { CommonPaginationInput } from "../../../../esl-workers/src/domain/models/CommonModel";
import { trpcClient } from "../infras/trpcActions";

export async function teacherGetAll(params: CommonPaginationInput) {
  try {
    const res = await trpcClient.teacher.getAll.query(params);

    if (res) {
      const contentPromise = res.content.map(async (teacher) => {
        const user = await trpcClient.user.get.query({
          userId: teacher.userId,
        });
        if (user) {
          teacher.user = user;
        }
        return teacher;
      });
      res.content = await Promise.all(contentPromise);
    }

    return res;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function teacherGet(params: { userId: number }) {
  try {
    const res = await trpcClient.teacher.get.query(params);

    return res;
  } catch (e) {
    console.log(e);
    return null;
  }
}
