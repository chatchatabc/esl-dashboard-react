import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { teacherGet } from "../../domain/services/teacherService";
import { bookingStatisticsTeacher } from "../../domain/services/bookingService";
import Chart from "react-apexcharts";

function TeacherActivityPage() {
  const { username } = useParams();

  const { data: teacher } = useQuery({
    queryKey: ["teachers", { username }],
    queryFn: async () => {
      const data = await teacherGet({ userUsername: username });
      return data;
    },
  });

  const { data: bookingStatistics } = useQuery({
    queryKey: ["bookings", "statistics", { teacherId: teacher?.id }],
    queryFn: async () => {
      const data = await bookingStatisticsTeacher({
        teacherId: teacher?.id!,
        dateFrom: Date.now() - 1000 * 60 * 60 * 24 * 30,
        dateTo: Date.now() + 1000 * 60 * 60 * 24 * 30,
      });
      return data;
    },
    enabled: !!teacher?.id,
  });

  if (!teacher) return <div>Teacher not found</div>;

  console.log(bookingStatistics);

  return (
    <div>
      <Chart
        options={{
          labels: ["Cancellable", "Confirmed", "Completed", "Cancelled"],
        }}
        series={[
          bookingStatistics?.cancellable ?? 0,
          bookingStatistics?.confirmed ?? 0,
          bookingStatistics?.completed ?? 0,
          bookingStatistics?.canceled ?? 0,
        ]}
        type="donut"
        width="380"
      />
    </div>
  );
}

export default TeacherActivityPage;
