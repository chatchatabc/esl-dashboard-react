import React from "react";
import { Schedule } from "../../../../../esl-backend-workers/src/domain/models/ScheduleModel";
import { Booking } from "../../../../../esl-backend-workers/src/domain/models/BookingModel";
import FullCalendar from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction";
import dayPlugin from "@fullcalendar/daygrid";
import { useAppDispatch } from "../../stores/hooks";
import { modalUpdate } from "../../stores/app/modalSlice";
import { useQuery } from "@tanstack/react-query";
import { userGetProfile } from "../../../domain/services/userService";

type Props = {
  schedules?: Schedule[];
  bookings?: Booking[];
  calendarDate: Date;
  setSelectedWeek: React.Dispatch<React.SetStateAction<Date | null>>;
};

const bookingColor = {
  1: "gray",
  2: "blue",
  3: "green",
};

function TeacherMonthSchedule({
  schedules,
  bookings,
  calendarDate,
  setSelectedWeek,
}: Props) {
  const dispatch = useAppDispatch();
  const calendarRef = React.useRef<FullCalendar | null>(null);
  const calendar = calendarRef.current?.getApi();
  const [events, setEvents] = React.useState<any[]>([]);
  const { data: user } = useQuery({
    queryKey: ["users", "profile"],
    queryFn: async () => {
      const res = await userGetProfile();
      return res;
    },
  });

  React.useEffect(() => {
    if (calendar) {
      calendar.gotoDate(calendarDate);
    }
  }, [calendarDate]);

  React.useEffect(() => {
    const newEvents: any[] = [];
    const dateNow = new Date();
    let timeNow = dateNow.getTime();
    const timeEnd = new Date(
      dateNow.getFullYear(),
      dateNow.getMonth() + 2,
      7
    ).getTime();

    const newBookings = bookings?.filter((booking) => {
      return booking.start < timeNow;
    });
    newBookings?.forEach((booking) => {
      newEvents.push({
        title: booking.student.alias,
        start: new Date(booking.start),
        end: new Date(booking.end),
        booking,
      });
    });

    while (timeNow <= timeEnd) {
      const scheduleDate = new Date(timeNow);

      const weekSchedules = schedules?.filter((schedule) => {
        return schedule.weekDay === scheduleDate.getDay();
      });

      let hours = 0;
      weekSchedules?.forEach((schedule) => {
        hours += (schedule.endTime - schedule.startTime) / (1000 * 60 * 60);
      });

      const newBookings = bookings?.filter((booking) => {
        return (
          booking.start >= scheduleDate.getTime() &&
          booking.end <= scheduleDate.getTime() + 1000 * 60 * 60 * 24
        );
      });

      // Create events for bookings
      newBookings?.forEach((booking) => {
        hours -= (booking.end - booking.start) / (1000 * 60 * 60);
        newEvents.push({
          title: booking.student.alias,
          start: new Date(booking.start),
          end: new Date(booking.end),
          color: bookingColor[booking.status as 1 | 2 | 3],
          booking,
        });
      });

      if (hours) {
        newEvents.push({
          title: `Free Hours: ${hours}`,
          start: scheduleDate,
          allDay: true,
          display: "background",
          backgroundColor: "white",
        });
      }

      timeNow += 1000 * 60 * 60 * 24;
    }

    setEvents(newEvents);
  }, [schedules, bookings, calendarDate]);

  return (
    <FullCalendar
      height={"80vh"}
      ref={calendarRef}
      displayEventTime={true}
      eventTimeFormat={{
        hour: "numeric",
        minute: "2-digit",
        omitZeroMinute: false,
        meridiem: "short",
      }}
      select={(info) => {
        const date = new Date(info.start);
        date.setUTCDate(date.getUTCDate() - date.getUTCDay());
        setSelectedWeek(date);
      }}
      eventClick={(e) => {
        if (user?.roleId !== 1) return;
        const { booking } = e.event.extendedProps;
        const start = new Date(booking.start).toISOString();
        const end = new Date(booking.end).toISOString();
        dispatch(
          modalUpdate({
            show: true,
            title: "Booking Information",
            content: "booking",
            data: { ...booking, start, end },
          })
        );
      }}
      selectable={true}
      events={events}
      headerToolbar={false}
      plugins={[dayPlugin, interactionPlugin]}
      initialView="dayGridMonth"
    />
  );
}

export default TeacherMonthSchedule;
