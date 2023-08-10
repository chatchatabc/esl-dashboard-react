import { UserLogin } from "../../../../esl-workers/src/domain/models/UserModel";
import { trpcClient } from "../infras/trpcActions";
import { utilDeleteCookie, utilGetCookie, utilSaveCookie } from "./utilService";

export async function authLogin(params: UserLogin) {
  try {
    const res = await trpcClient.auth.login.mutate(params);

    // if logged in successful
    if (res) {
      // save userId to cookie for local reference
      utilSaveCookie("userId", String(res.id));
    }

    return res;
  } catch (e) {
    console.log(e);
    return undefined;
  }
}

export function authGetUserId() {
  return utilGetCookie("userId");
}

export async function authLogout() {
  try {
    const res = await trpcClient.auth.logout.mutate();
    if (res) {
      utilDeleteCookie("userId");
    }
    return res;
  } catch (e) {
    console.log(e);
    return undefined;
  }
}
