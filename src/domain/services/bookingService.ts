import {
  BookingCompleteInputAdmin,
  BookingCreateByAdminInput,
  BookingStatisticsTeacher,
  BookingUpdateInput,
  BookingUpdateStatusManyInput,
} from "../../../../esl-backend-workers/src/domain/models/BookingModel";
import { CommonPaginationInput } from "../../../../esl-backend-workers/src/domain/models/CommonModel";
import { trpcClient } from "../infras/trpcActions";

export async function bookingGetAll(params: CommonPaginationInput) {
  try {
    const res = await trpcClient.booking.getAll.query(params);
    return res;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function bookingGetAllAdmin(params: CommonPaginationInput) {
  try {
    const res = await trpcClient.booking.getAllAdmin.query(params);

    return res;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function bookingCreate(params: BookingCreateByAdminInput) {
  try {
    const res = await trpcClient.booking.createByAdmin.mutate(params);
    return res;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function bookingComplete(params: BookingCompleteInputAdmin) {
  try {
    const res = await trpcClient.booking.completeAdmin.mutate(params);
    return res;
  } catch (e) {
    console.log(e);
    return false;
  }
}

export async function bookingUpdate(params: BookingUpdateInput) {
  try {
    const res = await trpcClient.booking.update.mutate(params);
    return res;
  } catch (e) {
    console.log(e);
    return false;
  }
}

export function bookingOptionStatus() {
  return [
    {
      value: 1,
      label: "Cancellable",
    },
    {
      value: 2,
      label: "Confirmed",
    },
    {
      value: 3,
      label: "Completed",
    },
    {
      value: 4,
      label: "Cancelled",
    },
    {
      value: 5,
      label: "Absent",
    },
  ];
}

export async function bookingUpdateStatusMany(
  params: BookingUpdateStatusManyInput
) {
  try {
    const res = await trpcClient.booking.updateStatusMany.mutate(params);
    return res;
  } catch (e) {
    console.log(e);
    return false;
  }
}

export function bookingOptionDays() {
  return [
    {
      label: "Sunday",
      value: 0,
    },
    {
      label: "Monday",
      value: 1,
    },
    {
      label: "Tuesday",
      value: 2,
    },
    {
      label: "Wednesday",
      value: 3,
    },
    {
      label: "Thursday",
      value: 4,
    },
    {
      label: "Friday",
      value: 5,
    },
    {
      label: "Saturday",
      value: 6,
    },
  ];
}

export async function bookingStatisticsTeacher(
  params: BookingStatisticsTeacher
) {
  try {
    const res = await trpcClient.booking.statisticsTeacher.query(params);
    return res;
  } catch (e) {
    console.log(e);
    return null;
  }
}
