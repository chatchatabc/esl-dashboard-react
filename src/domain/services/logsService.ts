import { trpcClient } from "../infras/trpcActions";

export async function logsCreditGetAllByUser(params: {
  page: number;
  size: number;
  userId: number;
}) {
  try {
    const res = await trpcClient.logs.getCreditAllByUser.query(params);
    return res;
  } catch (e) {
    console.log(e);
    return null;
  }
}
