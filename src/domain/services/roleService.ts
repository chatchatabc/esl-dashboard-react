import { trpcClient } from "../infras/trpcActions";

export async function roleGet(params: { roleId: number }) {
  try {
    const res = await trpcClient.role.get.query(params);
    return res;
  } catch (e) {
    console.log(e);
    return null;
  }
}
