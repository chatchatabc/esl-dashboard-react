import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import React from "react";
import {
  Schedule,
  ScheduleUpdateInput,
} from "../../../../../esl-backend-workers/src/domain/models/ScheduleModel";
import {
  scheduleCreateMany,
  scheduleDeleteMany,
  scheduleUpdateMany,
} from "../../../domain/services/scheduleService";
import { useAppDispatch } from "../../stores/hooks";
import { modalUpdate } from "../../stores/app/modalSlice";
import { CalendarApi, EventSourceInput } from "@fullcalendar/core/index.js";
import { Booking } from "../../../../../esl-backend-workers/src/domain/models/BookingModel";
import { useQueryClient } from "@tanstack/react-query";

type Props = {
  teacherId: number;
  calendarDate: Date | null;
  setCalendarDate: React.Dispatch<React.SetStateAction<Date | null>>;
  bookings: Booking[];
  schedules: Schedule[];
  loading: boolean;
};

const bookingColor = {
  1: "gray",
  2: "blue",
  3: "green",
};

function TeacherSchedule({
  teacherId,
  calendarDate,
  setCalendarDate,
  bookings,
  schedules,
  loading,
}: Props) {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const calendarRef = React.useRef<FullCalendar | null>(null);
  const [calendar, setCalendar] = React.useState<CalendarApi | undefined>(
    undefined
  );

  const [editing, setEditing] = React.useState(false);
  const [events, setEvents] = React.useState<any[]>([]);

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
        teacherId,
        id,
      };
    });

    let response: any = false;
    if (schedules.length > eventSchedules.length) {
      const deleteSchedules = [...schedules].splice(
        eventSchedules.length,
        schedules.length - eventSchedules.length
      );
      response = await scheduleDeleteMany({
        scheduleIds: deleteSchedules.map((schedule) => {
          return schedule.id;
        }),
        teacherId,
      });
    } else if (schedules.length < eventSchedules.length) {
      const newSchedules = eventSchedules.filter((schedule) => !schedule.id);
      response = await scheduleCreateMany({
        schedules: newSchedules,
        teacherId,
      });
    } else {
      response = true;
    }

    const updateSchedules: ScheduleUpdateInput[] = eventSchedules.filter(
      (schedule) => schedule.id
    );

    const responseUpdate = updateSchedules.length
      ? await scheduleUpdateMany({
          schedules: updateSchedules,
          teacherId,
        })
      : true;

    if (responseUpdate && response) {
      setEditing(false);
      queryClient.invalidateQueries({
        queryKey: ["schedules"],
      });
    } else {
      alert("Error");
    }
  }

  // Set calendar ref
  React.useEffect(() => {
    if (calendarRef) {
      const calendar = calendarRef.current?.getApi();
      setCalendar(calendar);
    }
  }, [calendarRef]);

  React.useEffect(() => {
    const newEvents: EventSourceInput = schedules
      .map((schedule) => {
        const date = calendar?.getDate() ?? new Date();
        date.setUTCDate(date.getUTCDate() - date.getUTCDay());

        const start = new Date(schedule.startTime);
        start.setUTCFullYear(
          date.getUTCFullYear(),
          date.getUTCMonth(),
          date.getUTCDate() - date.getUTCDay() + schedule.weekDay
        );

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
        const color = bookingColor[booking.status as keyof typeof bookingColor];

        newEvents.push({
          start,
          end,
          title: `${booking.student.user.alias}`,
          display: "auto",
          color,
          booking,
        });
      });
      if (bookings.length) {
        calendar?.scrollToTime(bookings[0].start);
      }
    }

    setEvents(newEvents);
  }, [schedules, editing, bookings]);

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
                setCalendarDate((prev) => {
                  prev?.setUTCDate(prev.getUTCDate() - 7);
                  return prev ? new Date(prev) : null;
                });
                calendar?.prev();
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-400"
            >
              &lt;
            </button>

            <button
              onClick={() => {
                setCalendarDate((prev) => {
                  prev?.setUTCDate(prev.getUTCDate() + 7);
                  return prev ? new Date(prev) : null;
                });
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

      <section className={`override ${editing ? "" : "overlap"} relative`}>
        {loading && (
          <div className="absolute w-full h-full flex items-center justify-center z-10 bg-white bg-opacity-50">
            <div className="ease-linear animate-spin rounded-full border-y-2 border-black h-20 w-20"></div>
          </div>
        )}
        <FullCalendar
          firstDay={1}
          scrollTimeReset={false}
          nowIndicator={true}
          height={"80vh"}
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
                    teacherId,
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
            } else {
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
            }
          }}
        />
      </section>
    </section>
  );
}

export default TeacherSchedule;
