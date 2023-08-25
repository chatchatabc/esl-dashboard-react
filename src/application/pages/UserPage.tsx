import { useAppDispatch } from "../redux/hooks";
import { ColumnsType } from "antd/es/table";
import { User } from "../../../../esl-workers/src/domain/models/UserModel";
import { modalUpdate } from "../redux/features/modalSlice";
import DynamicTable from "../components/DynamicTable";
import {
  userGetAll,
  userRevokePhoneVerification,
  userVerifyPhone,
} from "../../domain/services/userService";
import {
  utilFormatCurrency,
  utilFormatDateAndTime,
} from "../../domain/services/utilService";
import { useNavigate } from "react-router-dom";
import { Modal, message } from "antd";
import { globalReset } from "../redux/features/globalSlice";

function UserPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const columns: ColumnsType<User> = [
    {
      key: "username",
      title: "Username",
      fixed: "left",
      width: 200,
      render: (record: User) => {
        return (
          <button
            onClick={() => {
              navigate("/users/" + record.username);
            }}
            className="text-blue-500 underline hover:no-underline"
          >
            {record.username}
          </button>
        );
      },
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
      key: "credit",
      title: "Credits",
      render: (record: User) => {
        return (
          <button
            onClick={() => {
              dispatch(
                modalUpdate({
                  show: true,
                  content: "credit",
                  title: "Add Credit",
                  data: { userId: record.id },
                })
              );
            }}
            className="underline hover:no-underline"
          >
            {utilFormatCurrency(record.credits)}
          </button>
        );
      },
    },
    {
      key: "phone",
      title: "Phone Number",
      render: (record: User) => {
        return (
          <button
            onClick={() => {
              Modal.confirm({
                title: `${
                  record.phoneVerifiedAt ? "Revoke" : "Verify"
                } Phone verification`,
                content: `Are you sure you want to ${
                  record.phoneVerifiedAt ? "revoke" : "verify"
                } phone verification?`,
                onOk: async () => {
                  let res: any;
                  if (record.phoneVerifiedAt) {
                    res = await userRevokePhoneVerification({
                      userId: record.id,
                    });
                  } else {
                    res = await userVerifyPhone({ userId: record.id });
                  }

                  if (!res) {
                    message.error("Something went wrong");
                  } else {
                    message.success("Success");
                    dispatch(globalReset());
                  }
                },
                okButtonProps: {
                  className: `${
                    record.phoneVerifiedAt
                      ? "bg-red-500 hover:bg-red-400"
                      : "bg-green-500 hover:bg-green-400"
                  } text-white rounded-md transition`,
                },
                okText: "Yes",
                maskClosable: true,
              });
            }}
            className={`underline ${
              record.phoneVerifiedAt ? "text-green-500" : "text-red-500"
            } hover:no-underline`}
          >
            {record.phone}
          </button>
        );
      },
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
      width: 100,
      fixed: "right",
      render: (record: User) => {
        return (
          <div>
            <button
              onClick={() => {
                dispatch(
                  modalUpdate({
                    show: true,
                    content: "user",
                    title: "Edit User",
                    data: record,
                  })
                );
              }}
              className="text-blue-500 underline hover:no-underline"
            >
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
      <section className="rounded-lg shadow border">
        {/* Header */}
        <header className="p-2 flex items-center">
          <h2 className="text-xl font-medium mr-auto">Users</h2>

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
            className="px-4 py-2 bg-blue-500 text-white rounded-md transition hover:bg-blue-400"
          >
            Add +
          </button>
        </header>

        {/* Table */}
        <section>
          <DynamicTable
            columns={columns}
            getData={userGetAll}
            scroll={{ x: 2000 }}
          />
        </section>
      </section>
    </section>
  );
}

export default UserPage;
