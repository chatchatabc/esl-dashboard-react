import { trpcClient } from "../infras/trpcActions";

export async function userGetAll(params: { page?: number; size?: number }) {
  try {
    const res = await trpcClient.user.getAll.query(params);
    return res;
  } catch (e) {
    console.log(e);
    return undefined;
  }
}
