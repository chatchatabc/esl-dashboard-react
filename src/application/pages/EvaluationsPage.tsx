import { useQuery } from "@tanstack/react-query";
import React from "react";
import { bookingGetAll } from "../../domain/services/bookingService";
import EvaluationsTable from "../components/tables/EvaluationsTable";
import { userGetProfile } from "../../domain/services/userService";

function CompletedBookingsPage() {
  const [bookingsFilter, setBookingsFilter] = React.useState({
    page: 1,
    size: 10,
    dateTo: Date.now(),
    status: [2, 3, 5],
    sort: "start,DESC",
  });

  const { data: user } = useQuery({
    queryKey: ["users", "profile"],
    queryFn: async () => {
      const res = await userGetProfile();
      return res;
    },
  });
  const { data: bookingsData, isLoading: bookingsDataLoading } = useQuery({
    queryKey: ["bookings", bookingsFilter],
    queryFn: async () => {
      const data = await bookingGetAll(bookingsFilter);
      return data;
    },
  });

  return (
    <section className="p-4">
      {/* First section */}
      <section className="rounded-lg shadow border border-primary shadow-accent bg-white overflow-hidden">
        <header className="p-2 py-3 flex items-center border-b">
          <h2 className="text-xl font-medium mr-auto">Evaluations</h2>
        </header>

        {/* Table */}
        <section>
          <EvaluationsTable
            roleId={user?.roleId ?? 0}
            pagination={{
              onChange: (page, size) => {
                setBookingsFilter({
                  ...bookingsFilter,
                  page,
                  size,
                });
              },
            }}
            loading={bookingsDataLoading}
            data={bookingsData}
          />
        </section>
      </section>
    </section>
  );
}

export default CompletedBookingsPage;
