import { UserLogin } from "../../../../esl-workers/src/domain/models/UserModel";
import { trpcClient } from "../infras/trpcActions";
import { utilDeleteCookie, utilGetCookie, utilSaveCookie } from "./utilService";

export async function authLogin(params: UserLogin) {
  try {
    const res = await trpcClient.auth.login.mutate(params);

    // if logged in successful
    if (res) {
      // save userId to cookie for local reference
      utilSaveCookie("user", JSON.stringify(res));
    }

    return res;
  } catch (e) {
    console.log(e);
    return undefined;
  }
}

export async function authGetProfile() {
  try {
    const res = await trpcClient.auth.getProfile.query();
    return res;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export function authGetUser() {
  const user = utilGetCookie("user");
  if (!user) {
    return null;
  }
  return JSON.parse(user);
}

export async function authLogout() {
  try {
    const res = await trpcClient.auth.logout.mutate();
    if (res) {
      utilDeleteCookie("user");
    }
    return res;
  } catch (e) {
    console.log(e);
    return undefined;
  }
}
