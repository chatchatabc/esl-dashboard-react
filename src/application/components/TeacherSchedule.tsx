import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import React from "react";
import {
  Schedule,
  ScheduleUpdateInput,
} from "../../../../esl-workers/src/domain/models/ScheduleModel";
import {
  scheduleCreateMany,
  scheduleDeleteMany,
  scheduleGetAll,
  scheduleUpdateMany,
} from "../../domain/services/scheduleService";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { modalUpdate } from "../redux/features/modalSlice";
import { Booking } from "../../../../esl-workers/src/domain/models/BookingModel";
import { bookingGetAll } from "../../domain/services/bookingService";
import { CalendarApi } from "@fullcalendar/core/index.js";

type Props = {
  userId: number;
};

function TeacherSchedule({ userId }: Props) {
  const calendarRef = React.useRef<FullCalendar | null>(null);
  const [calendar, setCalendar] = React.useState<CalendarApi | undefined>(
    undefined
  );
  const [calendarTitle, setCalendarTitle] = React.useState("");
  const [editing, setEditing] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [schedules, setSchedules] = React.useState<Schedule[]>([]);
  const [bookings, setBookings] = React.useState<Booking[]>([]);
  const [events, setEvents] = React.useState<any[]>([]);
  const dispatch = useAppDispatch();
  const global = useAppSelector((state) => state.global);

  async function handleSave() {
    const calendarEvents = calendar?.getEvents() ?? [];

    const eventSchedules = calendarEvents.map((event, index) => {
      const start = new Date(event.start ?? 0);
      const end = new Date(event.end ?? 0);
      const startTime = start.getTime();
      const endTime = end.getTime();
      const id = schedules[index]?.id;

      return {
        startTime,
        endTime,
        userId,
        id,
      };
    });

    let response: any = true;
    if (schedules.length > eventSchedules.length) {
      const deleteSchedules = schedules.filter(
        (schedule) => !eventSchedules.find((event) => event.id === schedule.id)
      );
      response = await scheduleDeleteMany({
        scheduleIds: deleteSchedules.map((schedule) => {
          return schedule.id;
        }),
        userId,
      });
    }

    const updateSchedules: ScheduleUpdateInput[] = eventSchedules.filter(
      (schedule) => schedule.id
    );
    const responseUpdate = updateSchedules.length
      ? await scheduleUpdateMany({
          schedules: updateSchedules,
          userId,
        })
      : true;

    const newSchedules = eventSchedules.filter((schedule) => !schedule.id);
    if (newSchedules.length) {
      response = await scheduleCreateMany({ schedules: newSchedules, userId });
    }

    if (responseUpdate && response) {
      setEditing(false);
    } else {
      alert("Error");
    }

    setLoading(true);
  }

  React.useEffect(() => {
    if (calendarRef) {
      const calendar = calendarRef.current?.getApi();

      setCalendar(calendar);
    }
  }, [calendarRef]);

  React.useEffect(() => {
    setLoading(true);
  }, [global.reset]);

  React.useEffect(() => {
    if (loading) {
      (async () => {
        const resSchedule = await scheduleGetAll({
          userId,
          page: 1,
          size: 1000,
        });
        const resBookings = await bookingGetAll({
          userId,
          page: 1,
          size: 1000,
        });

        setBookings(resBookings?.content ?? []);
        setSchedules(resSchedule?.content ?? []);

        setLoading(false);
      })();
    }
  }, [loading]);

  React.useEffect(() => {
    const newEvents: Record<string, any>[] = schedules
      .map((schedule) => {
        const date = calendar?.getDate() ?? new Date();
        date.setDate(date.getDate() - date.getDay());

        const start = new Date(schedule.startTime);
        start.setFullYear(date.getFullYear());
        start.setMonth(date.getMonth());
        start.setUTCDate(date.getDate() + schedule.day);
        const diff = schedule.endTime - schedule.startTime;
        const end = new Date(start.getTime() + diff);

        return {
          start,
          end,
          title: editing ? "" : "Open schedule",
          display: editing ? "auto" : "background",
        };
      })
      .flat();

    if (!editing) {
      bookings.forEach((booking) => {
        const start = new Date(booking.start);
        const end = new Date(booking.end);

        newEvents.push({
          start,
          end,
          title: `${booking.student?.firstName} ${booking.student?.lastName}`,
          display: "auto",
          color: "red",
        });
      });
    }

    setEvents(newEvents);
  }, [schedules, editing, calendarTitle]);

  return (
    <section>
      <header className="flex items-center p-2 gap-x-2">
        <h2 className="text-xl font-medium mr-auto">Teacher's Schedule</h2>

        {editing && (
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-400"
          >
            Save
          </button>
        )}

        {!editing && (
          <>
            <button
              onClick={() => {
                setCalendarTitle(calendar?.getDate().toISOString() ?? "next");
                calendar?.prev();
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-400"
            >
              &lt;
            </button>

            <button
              onClick={() => {
                setCalendarTitle(calendar?.getDate().toISOString() ?? "prev");
                calendar?.next();
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-400"
            >
              &gt;
            </button>
          </>
        )}

        <button
          onClick={() => {
            setEditing(!editing);
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-400"
        >
          {editing ? "Cancel" : "Edit"}
        </button>
      </header>

      <section>
        <FullCalendar
          ref={calendarRef}
          plugins={[timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          headerToolbar={false}
          allDaySlot={false}
          events={events}
          editable={editing}
          selectable={true}
          views={{
            timeGridWeek: editing
              ? {
                  dayHeaderContent: (header) => {
                    const date = header.date;
                    const dayName = date.toDateString().split(" ")[0];
                    return dayName;
                  },
                }
              : {},
          }}
          select={(e) => {
            if (editing) {
              calendar?.addEvent({
                start: e.start,
                end: e.end,
              });
            } else {
              dispatch(
                modalUpdate({
                  show: true,
                  title: "Book a lesson",
                  content: "booking",
                  data: {
                    teacherId: userId,
                    start: e.start.toISOString(),
                    end: e.end.toISOString(),
                  },
                })
              );
            }
          }}
          eventClick={(e) => {
            if (editing) {
              e.event.remove();
            }
          }}
        />
      </section>
    </section>
  );
}

export default TeacherSchedule;
