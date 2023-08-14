import { useAppDispatch } from "../redux/hooks";
import { ColumnsType } from "antd/es/table";
import { User } from "../../../../esl-workers/src/domain/models/UserModel";
import { modalUpdate } from "../redux/features/modalSlice";
import DynamicTable from "../components/DynamicTable";
import { userGetAll } from "../../domain/services/userService";
import { utilFormatDateAndTime } from "../../domain/services/utilService";

function UserPage() {
  const dispatch = useAppDispatch();

  const columns: ColumnsType<User> = [
    {
      key: "username",
      dataIndex: "username",
      title: "Username",
    },
    {
      key: "firstName",
      dataIndex: "firstName",
      title: "First Name",
    },
    {
      key: "lastName",
      dataIndex: "lastName",
      title: "Last Name",
    },
    {
      key: "createdAt",
      title: "Created At",
      render: (record: User) => {
        const date = new Date(record.createdAt ?? 0);
        return <p>{utilFormatDateAndTime("zn-CH", date)}</p>;
      },
    },
    {
      key: "updatedAt",
      title: "Updated At",
      render: (record: User) => {
        const date = new Date(record.updatedAt ?? 0);
        return <p>{utilFormatDateAndTime("zn-CH", date)}</p>;
      },
    },
    {
      key: "actions",
      title: "Actions",
      render: () => {
        return (
          <div>
            <button className="text-blue-500 underline hover:no-underline">
              Edit
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <section className="p-4">
      {/* First section */}
      <section className="rounded-lg overflow-hidden shadow border">
        {/* Header */}
        <header className="p-2 flex items-center">
          <h2 className="text-xl font-medium mr-auto">Users</h2>

          <button
            onClick={() => {
              dispatch(
                modalUpdate({
                  show: true,
                  content: "message",
                  title: "Add Message",
                })
              );
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded-md transition hover:bg-blue-400"
          >
            Add +
          </button>
        </header>

        {/* Table */}
        <section>
          <DynamicTable columns={columns} getData={userGetAll} />
        </section>
      </section>
    </section>
  );
}

export default UserPage;
