import {
  BookingCancelInputAdmin,
  BookingCreateInput,
} from "../../../../esl-workers/src/domain/models/BookingModel";
import { CommonPaginationInput } from "../../../../esl-workers/src/domain/models/CommonModel";
import { trpcClient } from "../infras/trpcActions";

export async function bookingGetAll(params: CommonPaginationInput) {
  try {
    const res = await trpcClient.booking.getAllAdmin.query(params);

    if (res) {
      const contentPromise = res.content.map(async (booking) => {
        const student = await trpcClient.user.get.query({
          userId: booking.studentId ?? 0,
        });
        if (student) {
          booking.student = student;
        }

        const teacher = await trpcClient.user.get.query({
          userId: booking.teacherId ?? 0,
        });
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

export async function bookingCreate(params: BookingCreateInput) {
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
