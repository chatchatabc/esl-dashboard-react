import React from "react";
import { useParams } from "react-router-dom";
import NotFoundPage from "./NotFoundPage";
import {
  userGetByUsername,
  userOptionStatus,
} from "../../domain/services/userService";
import { useAppDispatch } from "../redux/hooks";
import { modalUpdate } from "../redux/features/modalSlice";
import LogsCreditTable from "../components/tables/LogsCreditTable";
import BookingTable from "../components/tables/BookingTable";
import EditIcon from "../assets/EditIcon";
import { useQuery } from "@tanstack/react-query";
import {
  bookingGetAllAdmin,
  bookingOptionStatus,
} from "../../domain/services/bookingService";
import { Select } from "antd";
import { logsCreditGetAllByUser } from "../../domain/services/logsService";

const statusList = userOptionStatus();
const bookingStatusList = bookingOptionStatus();
const days = [
  {
    label: "Sunday",
    value: 0,
  },
  {
    label: "Monday",
    value: 1,
  },
  {
    label: "Tuesday",
    value: 2,
  },
  {
    label: "Wednesday",
    value: 3,
  },
  {
    label: "Thursday",
    value: 4,
  },
  {
    label: "Friday",
    value: 5,
  },
  {
    label: "Saturday",
    value: 6,
  },
];

function UserProfilePage() {
  const { username = "" } = useParams();
  const dispatch = useAppDispatch();
  const [bookingIds, setBookingIds] = React.useState<number[]>([]);
  const [bookingsFilter, setBookingsFilter] = React.useState({
    status: [1, 2, 3, 4],
    day: undefined,
    page: 1,
    size: 10,
    sort: "start,DESC",
  });
  const [creditsFilter, setCreditsFilter] = React.useState({
    page: 1,
    size: 10,
  });

  const userQuery = useQuery({
    queryKey: ["users", { username }],
    queryFn: async () => {
      const data = await userGetByUsername({ username });
      return data;
    },
  });
  const user = userQuery.data;
  const userStatus = statusList.find((item) => item.value === user?.status);

  const bookingsQuery = useQuery({
    queryKey: ["bookings", { ...bookingsFilter, userId: user?.id }],
    queryFn: async () => {
      const data = await bookingGetAllAdmin({
        ...bookingsFilter,
        userId: user?.id,
      });
      return data;
    },
  });

  const creditsQuery = useQuery({
    queryKey: ["credits", { ...creditsFilter, userId: user?.id }],
    queryFn: async () => {
      const userId = user?.id;
      if (!userId) {
        return { content: [], page: 1, totalElements: 0, size: 10 };
      }

      const data = await logsCreditGetAllByUser({
        ...creditsFilter,
        userId,
      });
      return data;
    },
  });

  if (userQuery.isLoading) {
    return (
      <div className="flex-1 py-24">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex-1 py-24">
        <NotFoundPage />
      </div>
    );
  }

  return (
    <section className="p-4 space-y-4">
      {/* Profile Information */}
      <section className="border rounded-lg shadow">
        <header className="p-2 flex items-center border-b">
          <h2 className="text-xl font-medium mr-auto">Profile Information</h2>

          <button
            onClick={() => {
              dispatch(
                modalUpdate({
                  show: true,
                  content: "user",
                  data: user,
                  title: "Edit user",
                })
              );
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-400"
          >
            Edit
          </button>
        </header>

        <section className="p-2 flex flex-wrap gap-y-2">
          {/* Username */}
          <section className="w-1/4">
            <header>
              <h3 className="text-xs font-bold">Username</h3>
            </header>

            <section>
              <p>{user.username}</p>
            </section>
          </section>

          {/* First name */}
          <section className="w-1/4">
            <header>
              <h3 className="text-xs font-bold">First name</h3>
            </header>

            <section>
              <p>
                {user.firstName && user.firstName.length
                  ? user.firstName
                  : "NULL"}
              </p>
            </section>
          </section>

          {/* Last Name */}
          <section className="w-1/4">
            <header>
              <h3 className="text-xs font-bold">Last name</h3>
            </header>

            <section>
              <p>
                {user.lastName && user.lastName.length ? user.lastName : "NULL"}
              </p>
            </section>
          </section>

          {/* Phone */}
          <section className="w-1/4">
            <header>
              <h3 className="text-xs font-bold">Phone</h3>
            </header>

            <section>
              <p>{user.phone && user.phone.length ? user.phone : "NULL"}</p>
            </section>
          </section>

          {/* Credit */}
          <section className="w-1/4">
            <header>
              <h3 className="text-xs font-bold">Credits</h3>
            </header>

            <section>
              <p>{user.credits}点</p>
            </section>
          </section>

          {/* Role */}
          <section className="w-1/4">
            <header>
              <h3 className="text-xs font-bold">Roles</h3>
            </header>

            <section>
              <p>{user.role?.name}</p>
            </section>
          </section>

          {/* Status */}
          <section className="w-1/4">
            <header>
              <h3 className="text-xs font-bold">Status</h3>
            </header>

            <section>
              <p>{userStatus?.label}</p>
            </section>
          </section>
        </section>
      </section>

      {/* Booking Table */}
      <section className="border rounded-lg shadow">
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
            options={bookingStatusList}
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
            options={days}
            allowClear
          />
        </section>

        <section>
          <BookingTable
            loading={bookingsQuery.isLoading}
            rowSelection={{
              selectedRowKeys: bookingIds,
              onChange: (selectedRowKeys: any[]) => {
                setBookingIds(selectedRowKeys);
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
            data={bookingsQuery.data}
          />
        </section>
      </section>

      {/* Credit History */}
      <section className="border rounded-lg shadow">
        <header className="p-2 flex items-center border-b">
          <h2 className="text-xl font-medium mr-auto">Credit History</h2>

          <button
            onClick={() => {
              dispatch(
                modalUpdate({
                  show: true,
                  content: "credit",
                  data: { userId: user.id },
                  title: "Add Credit",
                })
              );
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-400"
          >
            Add
          </button>
        </header>

        <section>
          <LogsCreditTable
            data={creditsQuery.data}
            pagination={{
              onChange: (page, size) => {
                setCreditsFilter({
                  ...creditsFilter,
                  page,
                  size,
                });
              },
            }}
          />
        </section>
      </section>
    </section>
  );
}

export default UserProfilePage;
