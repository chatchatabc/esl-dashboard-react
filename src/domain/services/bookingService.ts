import {
  BookingCancelInputAdmin,
  BookingCompleteInputAdmin,
  BookingCreateInputAdmin,
  BookingUpdateInput,
  BookingUpdateStatusManyInputByAdmin,
} from "../../../../esl-workers/src/domain/models/BookingModel";
import { CommonPaginationInput } from "../../../../esl-workers/src/domain/models/CommonModel";
import { trpcClient } from "../infras/trpcActions";
import { teacherGet } from "./teacherService";

export async function bookingGetAll(params: CommonPaginationInput) {
  try {
    const res = await trpcClient.booking.getAllAdmin.query(params);

    if (res) {
      const contentPromise = res.content.map(async (booking) => {
        const user = await trpcClient.user.get.query({
          userId: booking.userId ?? 0,
        });
        if (user) {
          booking.user = user;
        }

        const teacher = await teacherGet({ teacherId: booking.teacherId });
        if (teacher) {
          booking.teacher = teacher;
        }

        return booking;
      });

      res.content = await Promise.all(contentPromise);
    }

    return res;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function bookingCreate(params: BookingCreateInputAdmin) {
  try {
    const res = await trpcClient.booking.createAdmin.mutate(params);
    return res;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function bookingCancel(params: BookingCancelInputAdmin) {
  try {
    const res = await trpcClient.booking.cancelAdmin.mutate(params);
    return res;
  } catch (e) {
    console.log(e);
    return false;
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
  params: BookingUpdateStatusManyInputByAdmin
) {
  try {
    const res = await trpcClient.booking.updateStatusManyByAdmin.mutate(params);
    return res;
  } catch (e) {
    console.log(e);
    return false;
  }
}
