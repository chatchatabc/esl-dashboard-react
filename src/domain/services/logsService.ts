import { trpcClient } from "../infras/trpcActions";

export async function logsCreditGetAll(params: {
  page?: number;
  size?: number;
}) {
  try {
    const res = await trpcClient.logs.getCreditAll.query(params);
    return res;
  } catch (e) {
    console.log(e);
    return null;
  }
}
