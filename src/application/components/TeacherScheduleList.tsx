import FullCalendar from "@fullcalendar/react";
import listPlugin from "@fullcalendar/list";

type Props = { events: any[] };

function TeacherScheduleList({ events }: Props) {
  console.log(events);
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
