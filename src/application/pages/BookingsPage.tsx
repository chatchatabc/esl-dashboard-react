import { useAppDispatch } from "../redux/hooks";
import { modalUpdate } from "../redux/features/modalSlice";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { authGetProfile } from "../../domain/services/authService";
import { Booking } from "../../../../esl-workers/src/domain/models/BookingModel";
import { bookingGetAll } from "../../domain/services/bookingService";
import BookingTable from "../components/tables/BookingTable";

export default function BookingsPage() {
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const userQuery = useQuery({
    queryKey: ["user", "profile"],
    queryFn: async () => {
      const res = await authGetProfile();
      return res;
    },
  });
  const userId = userQuery.data?.id;

  const page = Number(searchParams.get("page") ?? "1");
  const size = Number(searchParams.get("size") ?? "10");

  const bookingsQuery = useQuery({
    queryKey: ["bookings", { page, size, userId }],
    queryFn: async () => {
      if (!userId) {
        return {
          content: [] as Booking[],
          totalElements: 0,
          page: 1,
          size: 10,
        };
      }

      const data = await bookingGetAll({
        page,
        size,
        sort: "start,DESC",
      });

      return data;
    },
  });

  return (
    <section className="p-4">
      {/* First section */}
      <section className="rounded-lg shadow border">
        {/* Header */}
        <header className="p-2 flex items-center">
          <h2 className="text-xl font-medium mr-auto">Bookings</h2>

          <button
            onClick={() => {
              dispatch(
                modalUpdate({
                  show: true,
                  content: "user",
                  title: "Add Message",
                })
              );
            }}
            className="px-4 py-1 bg-blue-500 text-white rounded-md transition hover:bg-blue-400"
          >
            Add +
          </button>
        </header>

        {/* Table */}
        <section>
          <BookingTable
            loading={bookingsQuery.isLoading}
            data={bookingsQuery.data}
          />
        </section>
      </section>
    </section>
  );
}
