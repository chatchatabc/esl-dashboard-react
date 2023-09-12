import { useAppDispatch } from "../../redux/hooks";
import Table, { ColumnsType, TableProps } from "antd/es/table";
import { CommonContent } from "../../../../../esl-workers/src/domain/models/CommonModel";
import { useNavigate, useSearchParams } from "react-router-dom";
import { modalUpdate } from "../../redux/features/modalSlice";
import { Modal, message } from "antd";
import { User } from "../../../../../esl-workers/src/domain/models/UserModel";
import {
  userRevokePhoneVerification,
  userVerifyPhone,
} from "../../../domain/services/userService";
import { utilFormatDateAndTime } from "../../../domain/services/utilService";

type Props = TableProps<any> & {
  data?: CommonContent<User>;
};

function UserTable({ data, ...props }: Props) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

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
            {record.credits}点
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
    <Table
      rowKey={(record: User) => record.id}
      columns={columns}
      dataSource={data?.content}
      pagination={{
        pageSize: data?.size,
        total: data?.totalElements,
        current: data?.page,
        onChange: (page, size) => {
          const params = new URLSearchParams(searchParams);
          params.set("page", page.toString());
          params.set("size", size.toString());
          navigate(`?${params.toString()}`);
        },
      }}
      {...props}
    />
  );
}

export default UserTable;
