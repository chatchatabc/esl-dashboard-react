import { CommonPaginationInput } from "../../../../esl-backend-workers/src/domain/models/CommonModel";
import {
  UserCreateInput,
  UserGetInput,
  UserUpdateInput,
} from "../../../../esl-backend-workers/src/domain/models/UserModel";
import { trpcClient } from "../infras/trpcActions";

export async function userGet(params: UserGetInput) {
  try {
    const res = await trpcClient.user.get.query(params);
    return res;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function userGetAll(params: CommonPaginationInput) {
  try {
    const res = await trpcClient.user.getAll.query(params);
    return res;
  } catch (e) {
    console.log(e);
    return undefined;
  }
}

export async function userCreate(params: UserCreateInput) {
  try {
    const res = await trpcClient.user.create.mutate(params);
    return res;
  } catch (e) {
    console.log(e);
    return false;
  }
}

export async function userUpdate(params: UserUpdateInput) {
  try {
    const res = await trpcClient.user.update.mutate(params);
    return res;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export function userOptionStatus() {
  return [
    { label: "Active", value: 1 },
    { label: "Inactive", value: 0 },
    { label: "Deleted", value: -1 },
  ];
}

export async function userVerifyPhone(params: { id: number }) {
  try {
    const res = await trpcClient.user.verifyPhone.mutate(params);
    return res;
  } catch (e) {
    console.log(e);
    return false;
  }
}

export async function userRevokePhoneVerification(params: { id: number }) {
  try {
    const res = await trpcClient.user.revokePhoneVerification.mutate(params);
    return res;
  } catch (e) {
    console.log(e);
    return false;
  }
}

export async function userGetProfile() {
  try {
    const res = await trpcClient.user.getProfile.query();
    return res;
  } catch (e) {
    console.log(e);
    return null;
  }
}
