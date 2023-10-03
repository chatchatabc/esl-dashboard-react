import { useQuery } from "@tanstack/react-query";
import React from "react";
import { bookingGetAll } from "../../../domain/services/bookingService";
import { scheduleGetAll } from "../../../domain/services/scheduleService";
import { Booking } from "../../../../../esl-backend-workers/src/domain/models/BookingModel";
import { Schedule } from "../../../../../esl-backend-workers/src/domain/models/ScheduleModel";
import TeacherWeekSchedule from "./TeacherWeekSchedule";
import TeacherMonthSchedule from "./TeacherMonthSchedule";

type Props = {
  teacherId?: number;
};

function TeacherCalendar({ teacherId }: Props) {
  const [calendarDate, setCalendarDate] = React.useState(new Date(0));
  const [selectedWeek, setSelectedWeek] = React.useState<Date | null>(null);

  const { data: bookings, isLoading: bookingsLoading } = useQuery({
    queryKey: [
      "bookings",
      "calendar",
      {
        teacherId,
        start: calendarDate.getTime() - 6 * 1000 * 60 * 60 * 24,
        end: calendarDate.getTime() + 37 * 1000 * 60 * 60 * 24,
      },
    ],
    queryFn: async () => {
      const data = await bookingGetAll({
        teacherId,
        page: 1,
        size: 10000,
        status: [1, 2, 3, 5],
        start: calendarDate.getTime() - 6 * 1000 * 60 * 60 * 24,
        end: calendarDate.getTime() + 37 * 1000 * 60 * 60 * 24,
      });
      return data?.content ?? ([] as Booking[]);
    },
    enabled: !!teacherId,
  });
  const { data: schedules, isLoading: schedulesLoading } = useQuery({
    queryKey: ["schedules", "content", { teacherId }],
    queryFn: async () => {
      const data = await scheduleGetAll({
        teacherId,
        page: 1,
        size: 10000,
      });
      return data?.content ?? ([] as Schedule[]);
    },
    enabled: !!teacherId,
  });

  // Update calendar date on first load
  React.useEffect(() => {
    const now = new Date();
    now.setUTCFullYear(now.getUTCFullYear(), now.getUTCMonth(), 1);
    setCalendarDate(now);
  }, []);

  return (
    <div>
      {/* Teacher Calendar */}
      {!selectedWeek && (
        <section className="border overflow-hidden shadow rounded-lg">
          <header className="p-2 flex items-center">
            <h2 className="text-xl my-1.5 font-medium flex-1">
              Teacher's Calendar
            </h2>

            <h3 className="text-xl font-bold">
              {new Intl.DateTimeFormat("en-US", {
                month: "long",
              }).format(calendarDate)}
            </h3>

            <div className="flex-1 flex gap-1 justify-end">
              <button
                onClick={() => {
                  setCalendarDate((prev) => {
                    prev.setUTCMonth(prev.getUTCMonth() - 1);
                    return new Date(prev);
                  });
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-400"
              >
                &lt;
              </button>

              <button
                onClick={() => {
                  setCalendarDate((prev) => {
                    prev.setUTCMonth(prev.getUTCMonth() + 1);
                    return new Date(prev);
                  });
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-400"
              >
                &gt;
              </button>
            </div>
          </header>

          <section>
            <TeacherMonthSchedule
              schedules={schedules ?? []}
              bookings={bookings ?? []}
              calendarDate={calendarDate}
              setSelectedWeek={setSelectedWeek}
            />
          </section>
        </section>
      )}

      {/* Teacher Schedule */}
      {selectedWeek && (
        <section className="border shadow rounded-lg">
          <TeacherWeekSchedule
            bookings={bookings ?? []}
            schedules={schedules ?? []}
            loading={bookingsLoading || schedulesLoading}
            calendarDate={selectedWeek}
            setSelectedWeek={setSelectedWeek}
            setCalendarDate={setCalendarDate}
            teacherId={teacherId ?? 0}
          />
        </section>
      )}
    </div>
  );
}

export default TeacherCalendar;
