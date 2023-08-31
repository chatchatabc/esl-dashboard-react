import { CommonPaginationInput } from "../../../../esl-workers/src/domain/models/CommonModel";
import {
  UserCreateInput,
  UserUpdateInput,
} from "../../../../esl-workers/src/domain/models/UserModel";
import { trpcClient } from "../infras/trpcActions";
import { roleGet } from "./roleService";

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
    return false;
  }
}

export async function userGetAllRole(params: CommonPaginationInput) {
  try {
    const res = await trpcClient.user.getAllRole.query(params);
    return res;
  } catch (e) {
    console.log(e);
    return undefined;
  }
}

export function userOptionStatus() {
  return [
    { label: "Active", value: 1 },
    { label: "Inactive", value: 0 },
    { label: "Deleted", value: -1 },
  ];
}

export async function userGetByUsername(params: { username: string }) {
  try {
    const res = await trpcClient.user.getByUsername.query(params);

    if (res) {
      const role = await roleGet({ roleId: res.roleId });
      if (role) {
        res.role = role;
      }
    }

    return res;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function userVerifyPhone(params: { userId: number }) {
  try {
    const res = await trpcClient.user.verifyPhone.mutate(params);
    return res;
  } catch (e) {
    console.log(e);
    return false;
  }
}

export async function userRevokePhoneVerification(params: { userId: number }) {
  try {
    const res = await trpcClient.user.revokePhoneVerification.mutate(params);
    return res;
  } catch (e) {
    console.log(e);
    return false;
  }
}
