import { trpcClient } from "../infras/trpcActions";

export async function bookingGetAllByUser(params: {
  page: number;
  size: number;
  userId: number;
}) {
  try {
    const res = await trpcClient.booking.getAllByUser.query(params);

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
