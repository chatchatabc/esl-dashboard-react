import FullCalendar from "@fullcalendar/react";
import listPlugin from "@fullcalendar/list";
import { Schedule } from "../../../../esl-workers/src/domain/models/ScheduleModel";
import { Booking } from "../../../../esl-workers/src/domain/models/BookingModel";
import React from "react";

type Props = {
  schedules?: Schedule[];
  bookings?: Booking[];
  calendarDate: Date;
};

function TeacherScheduleList({ schedules, bookings, calendarDate }: Props) {
  const [events, setEvents] = React.useState<any[]>([]);

  // Update calendar list events
  React.useEffect(() => {
    if (schedules && bookings) {
      const newEvents: any[] = [];

      schedules.forEach((schedule) => {
        const now = new Date();
        const start = new Date(schedule.startTime);
        const diff = schedule.endTime - schedule.startTime;

        start.setUTCFullYear(calendarDate.getUTCFullYear());
        start.setUTCMonth(calendarDate.getUTCMonth());
        start.setUTCDate(calendarDate.getUTCDate() + schedule.day);

        const nowTime = now.getTime();
        let startTime = start.getTime();
        const endTime = startTime + diff;

        while (startTime < endTime) {
          if (nowTime < startTime) {
            newEvents.push({
              start: startTime,
              end: startTime + 30 * 60 * 1000,
            });
          }

          startTime += 30 * 60 * 1000;
        }
      });

      bookings.forEach((booking) => {
        let start = new Date(booking.start).getTime();
        const end = new Date(booking.end).getTime();

        while (start < end) {
          const index = newEvents.findIndex((schedule) => {
            return schedule.start === start;
          });

          if (index !== -1) {
            newEvents.splice(index, 1);
          }

          start += 30 * 60 * 1000;
        }
      });

      setEvents(newEvents);
    }
  }, [bookings, schedules]);

  return (
    <FullCalendar
      events={events}
      headerToolbar={false}
      plugins={[listPlugin]}
      initialView="listWeek"
    />
  );
}

export default TeacherScheduleList;
