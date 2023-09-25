import { useAppDispatch } from "../stores/hooks";
import { modalUpdate } from "../stores/app/modalSlice";
import { useQuery } from "@tanstack/react-query";
import { Booking } from "../../../../esl-backend-workers/src/domain/models/BookingModel";
import {
  bookingGetAll,
  bookingOptionDays,
  bookingOptionStatus,
} from "../../domain/services/bookingService";
import BookingTable from "../components/tables/BookingTable";
import React from "react";
import EditIcon from "../assets/EditIcon";
import { Select } from "antd";
import { userGetProfile } from "../../domain/services/userService";

const statusList = bookingOptionStatus();
const daysList = bookingOptionDays();

export function BookingsPage() {
  const dispatch = useAppDispatch();
  const [bookingsFilter, setBookingsFilter] = React.useState({
    page: 1,
    size: 10,
    day: undefined,
    status: [1, 2, 3, 4],
    sort: "start,DESC",
  });
  const [bookingIds, setBookingIds] = React.useState<number[]>([]);
  const userQuery = useQuery({
    queryKey: ["users", "profile"],
    queryFn: async () => {
      const res = await userGetProfile();
      return res;
    },
  });
  const userId = userQuery.data?.id;

  const bookingsQuery = useQuery({
    queryKey: ["bookings", { ...bookingsFilter, userId }],
    queryFn: async () => {
      if (!userId) {
        return {
          content: [] as Booking[],
          totalElements: 0,
          page: 1,
          size: 10,
        };
      }
      const data = await bookingGetAll(bookingsFilter);
      return data;
    },
  });

  return (
    <section className="p-4">
      {/* First section */}
      <section className="rounded-lg shadow border">
        <header className="p-2 flex items-center border-b">
          <h2 className="text-xl font-medium mr-auto">Bookings</h2>

          <div className="flex space-x-2"></div>
          <button
            disabled={bookingIds.length === 0}
            onClick={() => {
              dispatch(
                modalUpdate({
                  show: true,
                  content: "bookingMany",
                  data: { bookingIds },
                  title: "Update multiple bookings",
                })
              );
            }}
            className={`p-2 ${
              bookingIds.length === 0 ? "" : "bg-blue-500 hover:bg-blue-400"
            } text-white rounded-md `}
          >
            <div className="w-6 h-6">
              <EditIcon />
            </div>
          </button>
        </header>

        <section className="border-t flex p-4 gap-2 flex-wrap">
          <Select
            className="min-w-[250px]"
            placeholder="Status"
            mode="multiple"
            onChange={(e) => {
              setBookingsFilter({
                ...bookingsFilter,
                page: 1,
                status: e.length ? e : [1, 2, 3, 4],
              });
              setBookingIds([]);
            }}
            options={statusList}
            allowClear
          />

          <Select
            className="min-w-[250px]"
            placeholder="Day"
            onChange={(e) => {
              console.log(e);
              setBookingsFilter({
                ...bookingsFilter,
                page: 1,
                day: e,
              });
              setBookingIds([]);
            }}
            options={daysList}
            allowClear
          />
        </section>

        {/* Table */}
        <section>
          <BookingTable
            rowSelection={{
              selectedRowKeys: bookingIds,
              onChange: (keys) => {
                setBookingIds(keys as number[]);
              },
            }}
            pagination={{
              onChange: (page, size) => {
                setBookingsFilter({
                  ...bookingsFilter,
                  page,
                  size,
                });
              },
            }}
            loading={bookingsQuery.isLoading}
            data={bookingsQuery.data}
          />
        </section>
      </section>
    </section>
  );
}

export default BookingsPage;
