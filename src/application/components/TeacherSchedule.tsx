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

type Props = {
  userId: number;
};

function TeacherSchedule({ userId }: Props) {
  const calendarRef = React.useRef<FullCalendar | null>(null);
  const [editing, setEditing] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [schedules, setSchedules] = React.useState<Schedule[]>([]);
  const [events, setEvents] = React.useState<any[]>([]);

  async function handleSave() {
    const calendar = calendarRef.current?.getApi();
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
        schedules: deleteSchedules,
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
    if (loading) {
      (async () => {
        const resSchedule = await scheduleGetAll({ userId });
        setSchedules(resSchedule?.content ?? []);

        setLoading(false);
      })();
    }
  }, [loading]);

  React.useEffect(() => {
    const newEvents = schedules
      .map((schedule) => {
        const date = new Date();
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
    setEvents(newEvents);
  }, [schedules, editing]);

  return (
    <section>
      <header className="flex items-center p-2">
        <h2 className="text-xl font-medium mr-auto">Teacher's Schedule</h2>

        {editing && (
          <button
            onClick={handleSave}
            className="px-4 py-2 mr-2 bg-blue-500 text-white rounded-md hover:bg-blue-400"
          >
            Save
          </button>
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
          selectable={editing}
          select={(e) => {
            const calendar = calendarRef.current?.getApi();
            calendar?.addEvent({
              start: e.start,
              end: e.end,
            });
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
